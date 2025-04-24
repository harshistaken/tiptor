import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { FontFamilyCombobox } from "@/components/tiptap/font-family-combobox";
import { HighlightPopover } from "@/components/tiptap/highlight-popover";
import { LinkPopover } from "@/components/tiptap/link-popover";
import { ListDropdown } from "@/components/tiptap/list-dropdown";
import MarkButton from "@/components/tiptap/mark-button";
import NodeButton from "@/components/tiptap/node-button";
import TextAlignButton from "@/components/tiptap/text-align-button";
import { TextColorPopover } from "@/components/tiptap/text-color-popover";
import { TextStyleDropdown } from "@/components/tiptap/text-style-dropdown";
import UndoRedoButton from "@/components/tiptap/undo-redo-button";
import { Toolbar, ToolbarGroup, ToolbarSeparator } from "@/components/tiptap/toolbar";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

export function DefaultEditorToolbar({
    editor: providedEditor,
    className,
    innerContainerClassName,
    leftOverlayClassName,
    rightOverlayClassName,
}: {
    editor?: Editor | null;
    className?: string;
    innerContainerClassName?: string;
    leftOverlayClassName?: string;
    rightOverlayClassName?: string;
}) {
    const editor = useTiptapEditor(providedEditor);

    if (!editor) return null;

    return (
        <Toolbar
            className={cn("h-11 w-full", className)}
            innerContainerClassName={innerContainerClassName}
            leftOverlayClassName={leftOverlayClassName}
            rightOverlayClassName={rightOverlayClassName}
        >
            <Spacer />
            <ToolbarGroup>
                <UndoRedoButton action="undo" editor={editor} />
                <UndoRedoButton action="redo" editor={editor} />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <TextStyleDropdown textStyles={["h1", "h2", "h3", "p"]} editor={editor} />
                <FontFamilyCombobox editor={editor} />
                <ListDropdown editor={editor} />
                <NodeButton type="codeBlock" editor={editor} />
                <NodeButton type="blockquote" editor={editor} />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <MarkButton type="bold" editor={editor} />
                <MarkButton type="italic" editor={editor} />
                <MarkButton type="strike" editor={editor} />
                <MarkButton type="code" editor={editor} />
                <MarkButton type="underline" editor={editor} />
                <HighlightPopover editor={editor} />
                <LinkPopover editor={editor} />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <MarkButton type="subscript" editor={editor} />
                <MarkButton type="superscript" editor={editor} />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <NodeButton type="horizontalRule" editor={editor} />
                <TextColorPopover editor={editor} />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <TextAlignButton align="left" editor={editor} />
                <TextAlignButton align="center" editor={editor} />
                <TextAlignButton align="right" editor={editor} />
                <TextAlignButton align="justify" editor={editor} />
            </ToolbarGroup>
            <Spacer />
        </Toolbar>
    );
}

function Spacer() {
    return <div className="w-full h-full flex-1"></div>;
}
