import React from "react";
import { cn } from "@/lib/utils";
import { useEditorSettings } from "./editor-settings-provider";
import { useEditor, ReactNodeViewRenderer, EditorContext } from "@tiptap/react";

// --- Components ---

import { CodeBlockWithLanguage } from "@/components/body/codeblock-with-language";

// --- Extensions ---

import { StarterKit } from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { TaskItem } from "@tiptap/extension-task-item";
import { TaskList } from "@tiptap/extension-task-list";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import { Underline } from "@tiptap/extension-underline";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { ListKeymap } from "@tiptap/extension-list-keymap";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";

const lowlight = createLowlight(all);

// --- Custom extensions ---

import Selection from "@/extensions/selection-extension";
import TrailingNode from "@/extensions/trailing-node-extension";

// --- Types ---

interface EditorProviderProps {
    children: React.ReactNode;
    editorClassName?: string;
    characterLimit?: number;
    content: string;
    onContentChange: (content: string) => void;
}

// --- Provider ---

export function EditorProvider({
    children,
    editorClassName,
    characterLimit = 1000,
    content,
    onContentChange,
}: EditorProviderProps) {
    const { settings } = useEditorSettings();

    const editor = useEditor({
        // Set the extensions of the editor
        extensions: [
            // StarterKit contains the basic extensions for the editor
            StarterKit.configure({
                codeBlock: false,
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            // Node extensions
            CodeBlockLowlight.extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockWithLanguage);
                },
            }).configure({ lowlight, defaultLanguage: "plaintext" }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            // Mark extensions
            Highlight.configure({ multicolor: true }),
            Link.configure({
                openOnClick: false,
                defaultProtocol: "https",
                protocols: ["http", "https", "mailto"],
                isAllowedUri: (url, ctx) => {
                    // 1. Use Tiptap's default validation first
                    if (!ctx.defaultValidate(url)) return false;

                    try {
                        // 2. Explicitly allow mailto links
                        if (url.startsWith("mailto:")) {
                            return true;
                        }

                        // 3. Ensure the URL has a protocol (http or https) for proper parsing
                        const urlWithProtocol = url.match(/^https?:\/\//)
                            ? url // Use the url as is if it already has http:// or https://
                            : `${ctx.defaultProtocol}://${url}`; // Otherwise, prepend the default protocol (https://)

                        // 4. Parse the URL using the standard URL constructor
                        const urlObj = new URL(urlWithProtocol);

                        // 5. Check if the parsed protocol is either http: or https:
                        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
                    } catch {
                        // 6. If any error occurs during parsing (e.g., invalid URL format), disallow the URL
                        return false;
                    }
                },
            }),
            Subscript,
            Superscript,
            TextStyle.configure({ mergeNestedSpanStyles: true }),
            Underline,
            // Functional extensions
            CharacterCount.configure({
                limit: characterLimit,
            }),
            Color,
            FontFamily,
            ListKeymap,
            Placeholder.configure({
                // Use different placeholders depending on the node type:
                placeholder: ({ node }) => {
                    if (node.type.name === "heading") {
                        // Check if this is the first heading (title heading)
                        // if (pos === 0) {
                        //     return "New page";
                        // }
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
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Typography,

            // Custom extensions
            Selection,
            TrailingNode,
        ],

        // Set the initial content of the editor
        content: content,
        // Set the editable state of the editor
        editable: !settings.readOnly,

        // Disable immediate rendering to prevent the editor from rendering before the content is set
        immediatelyRender: false,

        // Set the editor props
        editorProps: {
            attributes: {
                autoComplete: "false",
                autoCorrect: "false",
                autoCapitalize: "false",
                spellCheck: "false",
                class: cn("w-full min-w-full tiptap-placeholder prose", editorClassName),
            },
        },

        // Update the content state when the editor content changes
        onUpdate({ editor }) {
            onContentChange?.(editor.getHTML());
            console.log(editor.storage.characterCount.characters());
        },

        // Enable content check to prevent invalid content from being saved
        enableContentCheck: true,
        onContentError: (error) => {
            console.error("Content error:", error);
        },
    });

    // This effect for readOnly is still perfectly valid
    React.useEffect(() => {
        if (editor) {
            editor.setEditable(!settings.readOnly);
        }
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

    return <EditorContext.Provider value={{ editor }}>{children}</EditorContext.Provider>;
}
