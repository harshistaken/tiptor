import React from "react";
import { EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { ListKeymap } from "@tiptap/extension-list-keymap";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";

// --- Contexts ---
import { useEditorContext } from "@/contexts/editor-context";
import { useEditorSettingsContext } from "@/contexts/editor-settings-context";

interface EditorProviderProps {
    children: React.ReactNode;
}

export function EditorProvider({ children }: EditorProviderProps) {
    const { content, setContent } = useEditorContext();
    const { settings } = useEditorSettingsContext();

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
        editable: !settings.readOnly,
        editorProps: {
            attributes: {
                autocomplete: "false",
                autocorrect: "false",
                autocapitalize: "false",
                spellcheck: "false",
            },
        },
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        },
    });

    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [editor, content]);

    return <EditorContext.Provider value={{ editor }}>{children}</EditorContext.Provider>;
}
