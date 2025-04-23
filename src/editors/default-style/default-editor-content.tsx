import { type Editor, EditorContent } from "@tiptap/react";

export function DefaultEditorContent({ editor }: { editor: Editor | null }) {
    if (!editor) return null;

    return (
        <div className="w-full h-full flex-1 overflow-auto">
            <EditorContent
                editor={editor}
                role="presentation"
                className="h-full min-h-full max-w-2xl w-full mx-auto my-0"
            />
        </div>
    );
}
