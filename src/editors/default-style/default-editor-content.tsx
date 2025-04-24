import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { cn } from "@/lib/utils";
import { type Editor, EditorContent } from "@tiptap/react";

export function DefaultEditorContent({
    editor: providedEditor,
    className,
}: {
    editor?: Editor | null;
    className?: string;
}) {
    const editor = useTiptapEditor(providedEditor);

    if (!editor) return null;

    return (
        <div className={cn("w-full h-full flex-1 overflow-auto", className)}>
            <EditorContent
                editor={editor}
                role="presentation"
                className="w-full max-w-5xl h-full min-h-full my-0 mx-auto"
            />
        </div>
    );
}
