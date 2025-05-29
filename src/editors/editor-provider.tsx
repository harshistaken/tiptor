import { EditorContext, useEditor } from "@tiptap/react";

import { Document } from "@tiptap/extension-document";
import { Placeholder } from "@tiptap/extension-placeholder";
import React from "react";
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { cn } from "@/lib/utils";
// --- Contexts ---
import { useEditorContext } from "@/contexts/editor-context";
import { useEditorSettingsContext } from "@/contexts/editor-settings-context";

// --- Custom Extensions ---

const EditorDocumentStructure = Document.extend({
    content: "heading block*",
});

interface EditorProviderProps {
    children: React.ReactNode;
    editorClassName?: string;
}

export function EditorProvider({ children, editorClassName }: EditorProviderProps) {
    const { content, setContent } = useEditorContext();
    const { settings } = useEditorSettingsContext();

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                codeBlock: false,
                document: false,
            }),
            EditorDocumentStructure, // Custom document structure
            Typography,
            TextStyle.configure({ mergeNestedSpanStyles: true }),
            Placeholder.configure({
                // Use different placeholders depending on the node type:
                placeholder: ({ node, pos }) => {
                    if (node.type.name === "heading") {
                        // Check if this is the first heading (title heading)
                        if (pos === 0) {
                            return "New page";
                        }
                        // For other headings, show level-specific placeholders
                        switch (node.attrs.level) {
                            case 1:
                                return "Heading 1";
                            case 2:
                                return "Heading 2";
                            case 3:
                                return "Heading 3";
                            default:
                                return "Heading"; // Fallback for other levels if any
                        }
                    }
                    // Default placeholder for other node types or when the first node isn't one of the above
                    return "Write, press '/' for commands...";
                },
            }),
        ],
        content,
        editable: !settings.readOnly,
        editorProps: {
            attributes: {
                autoComplete: "false",
                autoCorrect: "false",
                autoCapitalize: "false",
                spellCheck: "false",
                class: cn("w-full min-w-full editor-typography editor-placeholder", editorClassName),
            },
        },
        onUpdate({ editor }) {
            setContent(editor.getHTML());
            const json = editor.getJSON();
            console.log("json", json);
        },

        // Enable content check to prevent invalid content from being saved
        enableContentCheck: true,
        onContentError: (error) => {
            console.error("Content error:", error);
        },
    });

    // Set the editor to be editable or not based on the readOnly setting
    React.useEffect(() => {
        if (!editor) {
            return undefined;
        }

        editor.setEditable(!settings.readOnly);
    }, [editor, settings.readOnly]);

    // Update content when it changes externally
    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [editor, content]);

    if (!editor) {
        return null;
    }

    return <EditorContext.Provider value={{ editor }}>{children}</EditorContext.Provider>;
}
