import { Heading, HeadingOptions } from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";
import { v4 as uuidv4 } from "uuid";

/**
 * Custom Heading Extension for Tiptap:
 * - This extension extends Tiptap's default Heading extension to add unique IDs to headings.
 * - Renders the heading with 'id' and 'data-toc-id' attributes set to the UUID.
 */

export const HeadingWithId = Heading.extend<HeadingOptions>({
    // Optional: Define a new name for the extension if needed otherwise it will be "heading".
    // name: "HeadingWithId",

    addOptions() {
        return {
            ...this.parent?.(), // Inherit parent options (levels, HTMLAttributes)
        };
    },

    addAttributes() {
        const parentAttributes = this.parent?.() ?? {};

        return {
            ...parentAttributes, // Include parent attributes (e.g., level)
            id: {
                // Default to a new UUID v4 when a heading node is created.
                default: () => uuidv4(),
                // Use existing 'id' attribute from parsed HTML if present.
                parseHTML: (element) => element.getAttribute("id"),
                // Render both 'id' and 'data-toc-id' attributes with the node's 'id'.
                renderHTML: (attributes) => {
                    // Ensure an ID exists, generate if missing (should ideally not happen).
                    const id = attributes.id || uuidv4();
                    if (!attributes.id) {
                        console.warn(
                            `Heading node was missing id during renderHTML. Assigned temporaryId: ${id}`,
                        );
                    }
                    return {
                        id: id,
                        "data-toc-id": id,
                    };
                },
                // Generate a new ID when the heading is split.
                keepOnSplit: false,
            },
        };
    },

    renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level);
        const level = hasLevel ? node.attrs.level : this.options.levels[0];

        const mergedAttributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

        return [`h${level}`, mergedAttributes, 0];
    },

    // Commands, keyboard shortcuts, input rules etc. are inherited from the parent 'Heading' extension.
    // No need to redefine them unless modifications are required.
});
