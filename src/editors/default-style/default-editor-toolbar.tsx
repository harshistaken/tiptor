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
import { Separator } from "@/components/ui/separator";

export function DefaultEditorToolbar() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { scrollX } = useScroll({ container: scrollContainerRef });
    const scrollXVelocity = useVelocity(scrollX);

    // Opacity based on scroll velocity (0 when stopped, 1 when scrolling)
    // Adjust the velocity threshold (e.g., 150) for smoother transition.
    const scrollingOpacity = useTransform(scrollXVelocity, (v) => {
        // Map absolute velocity: 0 -> 0 opacity, >=150 -> 1 opacity, smooth transition
        // Increase the second value in the input range [0, 150] for a smoother effect
        return transform(Math.abs(v), [0, 50], [0, 1], { clamp: true });
    });

    return (
        // Wrap the toolbar in a relative container to position the fades
        <div className="relative w-full h-11 border-t border-border">
            <motion.div
                ref={scrollContainerRef}
                className="w-full h-full flex items-center justify-start gap-2 z-10 px-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
                style={{
                    overscrollBehaviorX: "contain",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                {/* Existing toolbar content */}
                <div className="h-full flex items-center justify-center gap-0.5">
                    <UndoRedoButton action="undo" />
                    <UndoRedoButton action="redo" />
                </div>
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-2/3" />
                <div className="h-full flex items-center justify-center gap-0.5">
                    <TextStyleDropdown textStyles={["h1", "h2", "h3", "p"]} />
                    <FontFamilyCombobox />
                    <ListDropdown />
                    <NodeButton type="codeBlock" />
                    <NodeButton type="blockquote" />
                </div>
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-2/3" />
                <div className="h-full flex items-center justify-center gap-0.5">
                    <MarkButton type="bold" />
                    <MarkButton type="italic" />
                    <MarkButton type="strike" />
                    <MarkButton type="code" />
                    <MarkButton type="underline" />
                    <HighlightPopover />
                    <LinkPopover />
                </div>
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-2/3" />
                <div className="h-full flex items-center justify-center gap-0.5">
                    <MarkButton type="subscript" />
                    <MarkButton type="superscript" />
                </div>
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-2/3" />
                <div className="h-full flex items-center justify-center gap-0.5">
                    <NodeButton type="horizontalRule" />
                    <TextColorPopover />
                </div>
                <Separator orientation="vertical" className="data-[orientation=vertical]:h-2/3" />
                <div className="h-full flex items-center justify-center gap-0.5">
                    <TextAlignButton align="left" />
                    <TextAlignButton align="center" />
                    <TextAlignButton align="right" />
                    <TextAlignButton align="justify" />
                </div>
            </motion.div>

            {/* Left Fade Overlay */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 w-10 pointer-events-none z-20 mask-r-from-30% backdrop-blur-xl" // Increased width slightly
                style={{
                    // Use the scrolling opacity directly
                    opacity: scrollingOpacity,
                }}
                aria-hidden="true" // Hide decorative element from screen readers
            />

            {/* Right Fade Overlay */}
            <motion.div
                className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none z-20 mask-l-from-30% backdrop-blur-xl" // Increased width slightly
                style={{
                    // Use the scrolling opacity directly
                    opacity: scrollingOpacity,
                }}
                aria-hidden="true" // Hide decorative element from screen readers
            />
        </div>
    );
}
