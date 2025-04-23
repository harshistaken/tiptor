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
import { cn } from "@/lib/utils";

export function DefaultEditorToolbar({ className }: { className?: string }) {
    return (
        <Toolbar className={cn("h-11 w-full", className)}>
            <div className="w-full h-full flex-1"></div>
            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <TextStyleDropdown textStyles={["h1", "h2", "h3", "p"]} />
                <FontFamilyCombobox />
                <ListDropdown />
                <NodeButton type="codeBlock" />
                <NodeButton type="blockquote" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                <HighlightPopover />
                <LinkPopover />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <MarkButton type="subscript" />
                <MarkButton type="superscript" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <NodeButton type="horizontalRule" />
                <TextColorPopover />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>
            <div className="w-full h-full flex-1"></div>
        </Toolbar>
    );
}
