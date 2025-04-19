import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

export function useBasicEditor() {
    const editor = useEditor({
        extensions: [StarterKit, TextAlign.configure({ types: ["heading", "paragraph"] })],
        content: "",
        onUpdate({ editor }) {
            const json = editor.getJSON();
            console.log("Editor JSON:", json);
        },
    });

    return { editor };
}
