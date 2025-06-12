import React from "react";
import { cn } from "@/lib/utils";
import { useEditorSettings } from "./editor-settings-provider";
import { type Editor, useEditor, ReactNodeViewRenderer } from "@tiptap/react";

// --- Components ---

import { CodeBlockWithLanguage } from "@/components/body/codeblock-with-language";

// --- Extensions ---

import { StarterKit } from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
const lowlight = createLowlight(all);

// --- Types ---

interface EditorContextType {
    editor: Editor | null;
    title: string;
    setTitle: (title: string) => void;
    content: string;
    setContent: (content: string) => void;
}

interface EditorProviderProps {
    children: React.ReactNode;
    editorClassName?: string;
}

// --- Context ---

export const EditorContext = React.createContext<EditorContextType | null>(null);

// --- Provider ---

export function EditorProvider({ children, editorClassName }: EditorProviderProps) {
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");

    const { settings } = useEditorSettings();

    const editor = useEditor({
        // Set the extensions of the editor
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            CodeBlockLowlight.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockWithLanguage);
                },
            }).configure({ lowlight, defaultLanguage: "plaintext" }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
        ],

        // Set the initial content of the editor
        content: content,
        // Set the editable state of the editor
        editable: !settings.readOnly,

        // Set the editor props
        editorProps: {
            attributes: {
                autoComplete: "false",
                autoCorrect: "false",
                autoCapitalize: "false",
                spellCheck: "false",
                class: cn("w-full min-w-full", editorClassName),
            },
        },

        // Update the content state when the editor content changes
        onUpdate({ editor }) {
            setContent(editor.getHTML());
        },

        // Enable content check to prevent invalid content from being saved
        enableContentCheck: true,
        onContentError: (error) => {
            console.error("Content error:", error);
        },
    });

    const contextValue = React.useMemo(
        () => ({
            editor,
            content,
            title,
            setTitle,
            setContent,
        }),
        [editor, content, title],
    );

    // This effect for readOnly is still perfectly valid
    React.useEffect(() => {
        editor?.setEditable(!settings.readOnly);
    }, [editor, settings.readOnly]);

    // Sync the content of the editor with the content state
    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [editor, content]);

    if (!editor) {
        return null;
    }

    return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
}

// --- Hooks ---

export function useEditorContext() {
    const context = React.useContext(EditorContext);
    if (!context) {
        throw new Error("useEditorContext must be used within an EditorProvider");
    }
    return context;
}

export function useResolvedEditor(providedEditor?: Editor | null) {
    const { editor: editorFromContext } = useEditorContext();

    return React.useMemo(() => providedEditor || editorFromContext, [providedEditor, editorFromContext]);
}
