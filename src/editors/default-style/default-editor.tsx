import { EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
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

// --- Custom Extensions ---
import { Selection } from "@/custom-extensions/selection-extension";
import { TrailingNode } from "@/custom-extensions/trailing-node-extension";

const lowlight = createLowlight(all);

interface DefaultEditorProps {
    limit?: number;
    content: string;
    editable?: boolean;
}

export function DefaultEditor({ limit = 5000, content = "", editable = true }: DefaultEditorProps) {
    const editor = useEditor({
        extensions: [
            // Add your desired extensions here
            // Node Extensions
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
                defaultLanguage: "plaintext",
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            // Mark Extensions
            Highlight.configure({
                multicolor: true,
            }),
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
            // Functional Extensions
            CharacterCount.configure({
                limit,
            }),
            Color,
            FontFamily,
            ListKeymap,
            Placeholder.configure({
                // Use different placeholders depending on the node type:
                placeholder: ({ node }) => {
                    if (node.type.name === "heading") {
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

                    if (node.type.name === "paragraph") {
                        return "Write, press '/' for commands";
                    }

                    if (node.type.name === "orderedList" || node.type.name === "bulletList") {
                        return "List";
                    }

                    if (node.type.name === "taskList") {
                        return "To-do";
                    }

                    if (node.type.name === "blockquote") {
                        return "Empty quote";
                    }

                    // Default placeholder for other node types or when the first node isn't one of the above
                    return "Write, press '/' for commands";
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Typography,
            // Custom Extensions

            Link,
            Selection,
            TrailingNode,
        ],
        content,
        editable,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
            },
        },
    });

    return <EditorContext.Provider value={{ editor }}>
        
    </EditorContext.Provider>;
}
