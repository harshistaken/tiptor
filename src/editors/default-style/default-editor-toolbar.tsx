import { motion, useScroll, useTransform, transform, useVelocity } from "framer-motion"; // Import useVelocity and transform
import { useRef } from "react";
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

export function DefaultEditorToolbar() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { scrollX } = useScroll({ container: scrollContainerRef });
    const scrollXVelocity = useVelocity(scrollX);

    const scrollingOpacity = useTransform(scrollXVelocity, (v) => {
        // Map absolute velocity: 0 -> 0 opacity, >=50 -> 1 opacity, smooth transition
        return transform(Math.abs(v), [0, 50], [0, 1], { clamp: true });
    });

    return (
        <div className="relative w-full h-11">
            <Toolbar ref={scrollContainerRef}>
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
            </Toolbar>

            {/* Left Fade Overlay */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none z-20 mask-r-from-40% backdrop-blur-xl"
                style={{
                    opacity: scrollingOpacity,
                }}
                aria-hidden="true"
            />
            {/* Right Fade Overlay */}
            <motion.div
                className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none z-20 mask-l-from-40% backdrop-blur-xl"
                style={{
                    opacity: scrollingOpacity,
                }}
                aria-hidden="true"
            />
        </div>
    );
}
