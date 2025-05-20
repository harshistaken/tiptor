import React from "react";
import { EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { ListKeymap } from "@tiptap/extension-list-keymap";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";

interface EditorProviderProps {
    content?: string;
    editable?: boolean;
    onContentChange?: (content: string) => void;
    children: React.ReactNode;
}

export function EditorProvider({
    content = "",
    editable = true,
    onContentChange,
    children,
}: EditorProviderProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: false,
            }),
            FontFamily,
            TextStyle.configure({ mergeNestedSpanStyles: true }),
            ListKeymap,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Typography,
        ],
        content,
        editable,
        editorProps: {
            attributes: {
                autocomplete: "false",
                autocorrect: "false",
                autocapitalize: "false",
                spellcheck: "false",
            },
        },
        onUpdate({ editor }) {
            onContentChange?.(editor.getHTML());
        },
    });

    // Update content when it changes externally
    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [editor, content]);

    return (
        <EditorContext.Provider value={{ editor }}>
            {children}
        </EditorContext.Provider>
    );
}
