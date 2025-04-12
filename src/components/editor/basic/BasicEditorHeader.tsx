import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { BlockQuoteToggle, OrderedListToggle, UnorderedListToggle } from "../EditorExtensions";
import {
    FontSelector,
    LinkSelector,
    TextAlignSelector,
    TextColorSelector,
    TextStyleSelector,
    TaskListToggle,
    CodeToggle,
    HorizontalRuleToggle,
    BoldToggle,
    ItalicToggle,
    UnderlineToggle,
    StrikethroughToggle,
} from "../EditorExtensions";

interface BasicEditorHeaderProps {
    editor: Editor | null;
    className?: string;
}

export function BasicEditorHeader({ editor, className }: BasicEditorHeaderProps) {
    if (!editor) return null;

    return (
        <div
            className={cn(
                "h-12 w-full border-b backdrop-blur-md rounded-t-xl p-2",
                "flex gap-2 items-center justify-start @container/editor-header theme-scaled",
                className,
            )}
        >
            <FontSelector editor={editor} />
            <TextStyleSelector editor={editor} />
            <TextAlignSelector editor={editor} />

            <BasicEditorHeaderSeparator />
            <BoldToggle editor={editor} />
            <ItalicToggle editor={editor} />
            <UnderlineToggle editor={editor} />
            <StrikethroughToggle editor={editor} />

            <BasicEditorHeaderSeparator />

            <BlockQuoteToggle editor={editor} />
            <UnorderedListToggle editor={editor} />
            <OrderedListToggle editor={editor} />
            <TaskListToggle editor={editor} />

            <BasicEditorHeaderSeparator />

            <TextColorSelector editor={editor} />
            <CodeToggle editor={editor} />
            <LinkSelector editor={editor} />
            <HorizontalRuleToggle editor={editor} />
        </div>
    );
}

function BasicEditorHeaderSeparator({ className }: { className?: string }) {
    return (
        <Separator
            orientation="vertical"
            className={cn("data-[orientation=vertical]:h-2/3", className)}
        />
    );
}
