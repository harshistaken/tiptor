import { EditorContent, type Editor } from "@tiptap/react";

export function BasicEditorContent({ editor }: { editor: Editor | null }) {
    if (!editor) return null;
    return (
        <div className="flex-1 w-full h-full overflow-auto rounded-b-xl">
            <EditorContent
                editor={editor}
                className="w-full h-full min-h-full flex flex-col items-center "
            />
        </div>
    );
}
