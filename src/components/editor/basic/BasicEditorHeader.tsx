import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import {
    BlockQuoteToggle,
    ListSelector,
    OrderedListToggle,
    UnorderedListToggle,
} from "../EditorExtensions";
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
                "w-full @container/editor-header flex items-center justify-center",
                className,
            )}
        >
            <div className="flex items-center justify-center gap-1 p-2 mx-auto rounded-b-xl max-[790px]:w-full max-[790px]:rounded-t-xl max-[790px]:rounded-b-none bg-foreground/2">
                <FontSelector editor={editor} />
                <TextStyleSelector editor={editor} />
                <TextAlignSelector editor={editor} className="@max-[475px]/editor-header:hidden" />

                <BasicEditorHeaderSeparator className="@max-[475px]/editor-header:hidden" />
                <BoldToggle editor={editor} className="@max-[730px]/editor-header:hidden" />
                <ItalicToggle editor={editor} className="@max-[730px]/editor-header:hidden" />
                <UnderlineToggle editor={editor} className="@max-[730px]/editor-header:hidden" />
                <StrikethroughToggle
                    editor={editor}
                    className="@max-[730px]/editor-header:hidden"
                />

                <BasicEditorHeaderSeparator className="@max-[475px]/editor-header:hidden" />

                <BlockQuoteToggle editor={editor} className="@max-[400px]/editor-header:hidden" />
                <UnorderedListToggle
                    editor={editor}
                    className="@max-[610px]/editor-header:hidden"
                />
                <OrderedListToggle editor={editor} className="@max-[610px]/editor-header:hidden" />
                <TaskListToggle editor={editor} className="@max-[610px]/editor-header:hidden" />
                <ListSelector
                    editor={editor}
                    className="@max-[400px]/editor-header:hidden @min-[610px]/editor-header:hidden "
                />

                <BasicEditorHeaderSeparator className="@max-[475px]/editor-header:hidden" />

                <TextColorSelector editor={editor} className="@max-[565px]/editor-header:hidden" />
                <CodeToggle editor={editor} className="@max-[400px]/editor-header:hidden" />
                <HorizontalRuleToggle editor={editor} />
                <LinkSelector editor={editor} className="@max-[565px]/editor-header:hidden" />
            </div>
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
