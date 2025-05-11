import { Editor, Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Node } from "@tiptap/pm/model";
import { v4 as uuidv4 } from "uuid";

export type GetTableOfContentLevelFn = (
    headline: {
        node: Node;
        pos: number;
    },
    previousItems: TableOfContentItem[],
) => number;

export type GetTableOfContentIndexFn = (
    headline: {
        node: Node;
        pos: number;
    },
    previousItems: TableOfContentItem[],
    currentLevel?: number,
) => number;

export type TableOfContentsOptions = {
    getId?: (textContent: string) => string;
    anchorTypes?: string[];
    getLevel?: GetTableOfContentLevelFn;
    getIndex?: GetTableOfContentIndexFn;
    onUpdate?: (content: TableOfContentItem[], isCreate?: boolean) => void;
    scrollParent?: (() => HTMLElement | Window) | HTMLElement | Window;
};

export type TableOfContentsStorage = {
    content: TableOfContentItem[];
    anchors: Array<HTMLHeadingElement | HTMLElement>;
    scrollHandler: () => void;
    scrollPosition: number;
};

export type TableOfContentItem = {
    dom: HTMLElement; // the HTML element for this anchor
    editor: Editor; // the editor
    id: string; // the node id
    isActive: boolean; // whether this anchor is currently active
    isScrolledOver: boolean; // whether this anchor was already scrolled over
    itemIndex: number; // the index of the item on its current level
    level: number; // the current level of the item - this could be different from the actual anchor level and is used to render the hierarchy from high to low headlines
    node: Node; // the ProseMirror node for this anchor
    originalLevel: number; // the actual level
    pos: number; // the position of the anchor node
    textContent: string; // the text content of the anchor
};

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        tableOfContents: {
            updateTableOfContents: () => ReturnType;
        };
    }
}

export const TableOfContentsExtension = Extension.create<TableOfContentsOptions>({
    // Given a name to the extension.
    name: "tableOfContents",

    addOptions() {
        return {
            getId: () => uuidv4(),
            anchorTypes: ["heading"],
            onUpdate: () => {},
            scrollParent: typeof window !== "undefined" ? () => window : undefined,
        };
    },

    addStorage() {
        return {
            anchors: [],
            content: [],
            scrollPosition: 0,
            scrollHandler: () => null,
        };
    },

    // Added a global attribute to the heading node.
    addGlobalAttributes() {
        return [
            {
                types: this.options.anchorTypes || ["heading"],
                attributes: {
                    id: {
                        default: null,
                        parseHTML: (element) => element.getAttribute("id") || null,
                        renderHTML: (attributes) => ({
                            id: attributes.id,
                        }),
                    },
                    "data-toc-id": {
                        default: null,
                        parseHTML: (element) => element.dataset.tocId || null,
                        renderHTML: (attributes) => ({
                            "data-toc-id": attributes["data-toc-id"],
                        }),
                    },
                },
            },
        ];
    },

    // Added a plugin to assign a new id to a heading if it is missing or duplicated.
    addProseMirrorPlugins() {
        const anchorIdAssignerPlugin = new Plugin({
            key: new PluginKey("AnchorIdAssignerPluginKey"),
            appendTransaction: (transactions, _oldState, newState) => {
                const tr = newState.tr;
                let modified = false;
                const seenIds = new Set<string>();

                if (transactions.some((transaction) => transaction.docChanged)) {
                    newState.doc.descendants((node, pos) => {
                        if (
                            this.options.anchorTypes?.includes(node.type.name) &&
                            node.textContent.trim().length > 0
                        ) {
                            const currentId = node.attrs["data-toc-id"];

                            // assign a new one if id is missing or duplicated.
                            if (!currentId || seenIds.has(currentId)) {
                                const newId = this.options.getId?.(node.textContent) || uuidv4();
                                tr.setNodeMarkup(pos, undefined, {
                                    ...node.attrs,
                                    "data-toc-id": newId,
                                    id: newId,
                                });
                                seenIds.add(newId);
                                modified = true;
                            } else {
                                seenIds.add(currentId);
                            }
                        }
                    });
                }

                return modified ? tr : null;
            },
        });
        return [anchorIdAssignerPlugin];
    },

    addCommands() {
        return {
            updateTableOfContents:
                () =>
                ({ dispatch }) => {
                    if (!dispatch) return false;

                    const content = generateTableOfContents({
                        editor: this.editor,
                        storage: this.storage,
                        onUpdate: this.options.onUpdate,
                        getHeadlineIndexFn: this.options.getIndex || getLinearIndexes,
                        getHeadlineLevelFn: this.options.getLevel || getHeadlineLevel,
                        anchorTypes: this.options.anchorTypes,
                    });

                    this.storage.content = content;
                    return true;
                },
        };
    },

    onTransaction({ transaction }) {
        if (!transaction.docChanged) return;

        const meta = transaction.getMeta("toc");
        if (meta) return;

        const content = generateTableOfContents({
            editor: this.editor,
            storage: this.storage,
            onUpdate: this.options.onUpdate,
            getHeadlineIndexFn: this.options.getIndex || getLinearIndexes,
            getHeadlineLevelFn: this.options.getLevel || getHeadlineLevel,
            anchorTypes: this.options.anchorTypes,
        });

        this.storage.content = content;
    },

    onCreate() {
        // This is when the editor is created.
        // create a new id for the heading if it is missing or duplicated.
        const { tr } = this.editor.state;
        const seenIds = new Set<string>();

        this.editor.state.doc.descendants((node, pos) => {
            if (node.type.name === "heading" && node.textContent.trim().length > 0) {
                const currentId = node.attrs["data-toc-id"];

                // assign a new one if id is missing or duplicated.
                if (!currentId || seenIds.has(currentId)) {
                    const newId = uuidv4();
                    tr.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        "data-toc-id": newId,
                        id: newId,
                    });
                    seenIds.add(newId);
                } else {
                    seenIds.add(currentId);
                }
            }
        });

        // dispatch the transaction to the editor.
        this.editor.view.dispatch(tr);

        const content = generateTableOfContents({
            editor: this.editor,
            storage: this.storage,
            onUpdate: this.options.onUpdate,
            getHeadlineIndexFn: this.options.getIndex || getLinearIndexes,
            getHeadlineLevelFn: this.options.getLevel || getHeadlineLevel,
            anchorTypes: this.options.anchorTypes,
        });

        this.storage.content = content;

        if (this.options.scrollParent) {
            this.storage.scrollHandler = () => {
                const scrollParent =
                    typeof this.options.scrollParent === "function"
                        ? this.options.scrollParent()
                        : this.options.scrollParent;

                if (!scrollParent) return;

                const scrollPosition =
                    scrollParent instanceof Window ? scrollParent.scrollY : scrollParent.scrollTop;

                this.storage.scrollPosition = scrollPosition || 0;

                const updatedContent = updateScrollState({
                    editor: this.editor,
                    storage: this.storage,
                    onUpdate: this.options.onUpdate,
                });

                this.storage.content = updatedContent;
            };

            const scrollParent =
                typeof this.options.scrollParent === "function"
                    ? this.options.scrollParent()
                    : this.options.scrollParent;

            if (scrollParent) {
                scrollParent.addEventListener("scroll", this.storage.scrollHandler);
            }
        }
    },

    onDestroy() {
        if (this.options.scrollParent) {
            const scrollParent =
                typeof this.options.scrollParent === "function"
                    ? this.options.scrollParent()
                    : this.options.scrollParent;

            if (scrollParent) {
                scrollParent.removeEventListener("scroll", this.storage.scrollHandler);
            }
        }
    },
});

// Helper functions moved outside the extension

// Get the level of the headline
export const getHeadlineLevel: GetTableOfContentLevelFn = (headline, previousItems) => {
    // default level is 1
    let level = 1;

    // get the last item in the previous items
    const lastItem = previousItems.at(-1);

    // get the last item with the same level
    const lastSameLevel = previousItems
        .reverse()
        .find((item) => item.originalLevel <= headline.node.attrs.level);
    const lastLevel = lastSameLevel?.level || 1;

    if (headline.node.attrs.level > (lastItem?.originalLevel || 1)) {
        // if the current level is greater than the last item, add 1 to the level
        level = (lastItem?.level || 1) + 1;
    } else if (headline.node.attrs.level < (lastItem?.originalLevel || 1)) {
        // if the current level is less than the last item, set the level to the last level
        level = lastLevel;
    } else {
        // if the current level is the same as the last item, set the level to the last item level
        level = lastItem?.level || 1;
    }

    return level;
};

// Get the index of the headline in the linear table of contents
export const getLinearIndexes: GetTableOfContentIndexFn = (_headline, previousItems) => {
    const lastItem = previousItems.at(-1);
    // if there is no last item, return 1 else return the last item index + 1
    return lastItem ? (lastItem?.itemIndex || 1) + 1 : 1;
};

// Get the index of the headline in the hierarchical table of contents
export const getHierarchicalIndexes: GetTableOfContentIndexFn = (
    headline,
    previousItems,
    currentLevel,
) => {
    const level = currentLevel || headline.node.attrs.level || 1;
    let index = 1;
    const sameOrLowerLevelItems = previousItems.filter((item) => item.level <= level);

    if (sameOrLowerLevelItems.at(-1)?.level === level) {
        index = (sameOrLowerLevelItems.at(-1)?.itemIndex || 1) + 1;
    }

    return index;
};

// Handle the table of contents
const generateTableOfContents = ({
    editor,
    storage,
    getHeadlineIndexFn,
    getHeadlineLevelFn,
    anchorTypes,
    onUpdate,
}: {
    editor: Editor;
    storage: TableOfContentsStorage;
    getHeadlineIndexFn: GetTableOfContentIndexFn;
    getHeadlineLevelFn: GetTableOfContentLevelFn;
    anchorTypes?: string[];
    onUpdate?: (content: TableOfContentItem[], isCreate?: boolean) => void;
}) => {
    if (editor.isDestroyed) return storage.content;

    const headlineNodes: Array<{ node: Node; pos: number }> = [];
    let content: TableOfContentItem[] = [];
    const anchors: Array<HTMLHeadingElement | HTMLElement> = [];

    editor.state.doc.descendants((node, pos) => {
        if (anchorTypes?.includes(node.type.name)) {
            headlineNodes.push({ node, pos });
        }
    });

    content = headlineNodes.map((headline, index) => {
        const domNode = editor.view.domAtPos(headline.pos + 1).node as HTMLElement;
        const previousContent = content.slice(0, index);
        const level = getHeadlineLevelFn(headline, previousContent);
        const itemIndex = getHeadlineIndexFn(headline, previousContent, level);

        if (domNode instanceof HTMLHeadingElement || domNode instanceof HTMLElement) {
            anchors.push(domNode);
        }

        return {
            dom: domNode as HTMLHeadingElement,
            editor,
            id: headline.node.attrs["data-toc-id"],
            isActive: false,
            isScrolledOver: false,
            itemIndex,
            level,
            node: headline.node,
            originalLevel: headline.node.attrs.level || 1,
            pos: headline.pos,
            textContent: headline.node.textContent,
        };
    });

    storage.anchors = anchors;
    const updatedContent = updateScrollState({
        editor,
        storage: { ...storage, content },
        onUpdate,
    });

    return updatedContent;
};

const updateScrollState = ({
    editor,
    storage,
    onUpdate,
}: {
    editor: Editor;
    storage: TableOfContentsStorage;
    onUpdate?: (content: TableOfContentItem[], isCreate?: boolean) => void;
}): TableOfContentItem[] => {
    let content = storage.content;
    const scrolledIds: string[] = [];
    let activeId: string | null = null;

    if (editor.isDestroyed) return content;

    storage.anchors.forEach((anchor) => {
        if (storage.scrollPosition >= anchor.offsetTop) {
            const id = anchor.getAttribute("data-toc-id");
            if (id) {
                activeId = id;
                scrolledIds.push(id);
            }
        }
    });

    content = content.map((item) => ({
        ...item,
        isActive: item.id === activeId,
        isScrolledOver: scrolledIds.includes(item.id),
    }));

    if (onUpdate) {
        const isCreate = storage.content.length === 0;
        onUpdate(content, isCreate);
    }

    return content;
};
