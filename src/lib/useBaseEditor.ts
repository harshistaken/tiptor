import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { cn } from "./utils";
import React from "react";

const lowlight = createLowlight(all);

interface BaseEditorProps {
    placeholder?: string;
    content?: string;
    initialContent: string;
    onEditorUpdate?: (html: string) => void;
}

export function useBaseEditor({
    placeholder,
    content,
    initialContent,
    onEditorUpdate,
}: BaseEditorProps) {
    const editor = useEditor({
        /**
         * extensions are the extensions that will be used in the editor
         * common extensions are:
         * - StarterKit: provides the basic text formatting options
         * - Placeholder: provides a placeholder for the editor
         * - Typography: provides the typography options
         * - TaskList: provides the task list options
         * - TaskItem: provides the task item options
         * - TextAlign: provides the text align options
         * - Underline: provides the underline options
         * - CodeBlockLowlight: provides the code block options
         * - TextStyle: provides the text style options
         * - FontFamily: provides the font family options
         * - Subscript: provides the subscript options
         * - Superscript: provides the superscript options
         *
         * * add more extensions if you want
         *
         */
        extensions: [
            StarterKit.configure({
                // 1, 2, 3 are the levels of headings, add more levels if you want
                heading: {
                    levels: [1, 2, 3],
                },
                // disable code block extension as we'll use lowlight for code blocks
                codeBlock: false,
            }),
            Placeholder.configure({
                placeholder: placeholder || "What's on your mind today?",
                // show placeholder only when the editor is editable
                showOnlyWhenEditable: false,
            }),
            // enables common text patterns
            Typography,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Underline,
            CodeBlockLowlight.configure({
                lowlight,
            }),
            TextStyle.configure({ mergeNestedSpanStyles: true }),
            FontFamily,
            Subscript,
            Superscript,
            // enable attach links to text
            Link.configure({
                openOnClick: false,
                protocols: ["mailto"],
                // default protocol to use when no protocol is specified
                defaultProtocol: "https",
                // allow only mailto and http/https links
                isAllowedUri: (url, ctx) => {
                    if (!ctx.defaultValidate(url)) return false;

                    try {
                        if (url.startsWith("mailto:")) {
                            return true;
                        }

                        const urlWithProtocol = url.match(/^https?:\/\//)
                            ? url
                            : `${ctx.defaultProtocol}://${url}`;
                        const urlObj = new URL(urlWithProtocol);

                        return urlObj.protocol === "http:" || urlObj.protocol === "https:";
                    } catch {
                        return false;
                    }
                },
                shouldAutoLink: (url) => {
                    try {
                        // construct url into proper format
                        const parsedUrl = url.includes(":")
                            ? new URL(url)
                            : new URL(`https://${url}`);

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = [
                            "example-no-autolink.com",
                            "another-no-autolink.com",
                        ];
                        const domain = parsedUrl.hostname;

                        return !disallowedDomains.includes(domain);
                    } catch {
                        return false;
                    }
                },
                HTMLAttributes: {
                    rel: "noopener noreferrer",
                    target: "_blank",
                },
            }),
        ],
        // content is the initial content of the editor
        content: content || "",
        // editable determines if the editor is editable or read-only
        editable: true,
        // onUpdate is a callback that is called when the editor is updated
        onUpdate({ editor }) {
            onEditorUpdate?.(editor.getHTML());
        },
        // editorProps are the props for the editor
        editorProps: {
            attributes: {
                /**
                 * TODO: Check if h1 is semibold without strong and can be remove strong
                 * TODO: Add syntax highlighting colors for code blocks
                 * TODO: add Break line after cetain cases like blockquote, code, strike, etc.
                 * TODO: Checklist toggle don't remove the placeholder
                 */
                class: cn(
                    // placeholder styles : only show when editor is empty
                    "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:text-muted-foreground [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:pointer-events-none",
                    // editor styles
                    "prose prose-sm dark:prose-invert prose-neutral max-w-none outline-none focus:outline-none p-4 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                    //layout
                    "max-w-[730px] w-full my-10 max-auto",
                    // list styles
                    "[&_ul]:list-disc [&_ol]:list-decimal [&_ul>li]:marker:text-foreground/50 [&_ol>li]:marker:text-foreground/50",
                ),
            },
        },
    });

    // Update content when it changes externally
    React.useEffect(() => {
        if (editor && initialContent !== editor.getHTML()) {
            editor.commands.setContent(initialContent, false);
        }
    }, [editor, initialContent]);

    return editor;
}
