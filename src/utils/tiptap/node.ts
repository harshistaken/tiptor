import * as React from "react";
import type { Editor } from "@tiptap/react";

// --- Assets ---
import { Icons } from "@/assets/icons";

// --- Utils ---
import { isNodeInSchema } from "@/utils/tiptap/schema";

export type NodeType = "codeBlock" | "blockquote" | "bulletList" | "orderedList" | "taskList" | "horizontalRule";

export const nodeIcons = {
    codeBlock: Icons.MaterialCode,
    blockquote: Icons.MaterialFormatQuote,
    horizontalRule: Icons.MaterialHorizontalRule,
    bulletList: Icons.MaterialFormatListBulleted,
    orderedList: Icons.MaterialFormatListNumbered,
    taskList: Icons.MaterialCheckList,
};

export const nodeShortcutKeys: Partial<Record<NodeType, string>> = {
    codeBlock: "Ctrl-Alt-c",
    blockquote: "Ctrl-Shift-b",
    bulletList: "Ctrl-Shift-8",
    orderedList: "Ctrl-Shift-7",
    taskList: "Ctrl-Shift-9",
};

export const nodeLabels: Record<NodeType, string> = {
    codeBlock: "Code Block",
    blockquote: "Blockquote",
    horizontalRule: "Divider",
    bulletList: "Bullet List",
    orderedList: "Ordered List",
    taskList: "Task List",
};

export function canToggleNode(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;

    switch (type) {
        case "codeBlock":
            return editor.can().toggleNode("codeBlock", "paragraph");
        case "blockquote":
            return editor.can().toggleWrap("blockquote");
        case "horizontalRule":
            return editor.can().setHorizontalRule();
        case "bulletList":
            return editor.can().toggleBulletList();
        case "orderedList":
            return editor.can().toggleOrderedList();
        case "taskList":
            return editor.can().toggleList("taskList", "taskItem");
        default:
            return false;
    }
}

export function isNodeActive(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;

    switch (type) {
        case "codeBlock":
            return editor.isActive("codeBlock");
        case "blockquote":
            return editor.isActive("blockquote");
        case "horizontalRule":
            return editor.isActive("horizontalRule");
        case "bulletList":
            return editor.isActive("bulletList");
        case "orderedList":
            return editor.isActive("orderedList");
        case "taskList":
            return editor.isActive("taskList");
        default:
            return false;
    }
}

export function toggleNode(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;

    switch (type) {
        case "codeBlock":
            return editor.chain().focus().toggleNode("codeBlock", "paragraph").run();
        case "blockquote":
            return editor.chain().focus().toggleWrap("blockquote").run();
        case "horizontalRule":
            return editor.chain().focus().setHorizontalRule().run();
        case "bulletList":
            return editor.chain().focus().toggleBulletList().run();
        case "orderedList":
            return editor.chain().focus().toggleOrderedList().run();
        case "taskList":
            return editor.chain().focus().toggleList("taskList", "taskItem").run();
    }
}

export function isNodeDisabled(editor: Editor | null, canToggle: boolean, userDisabled: boolean = false): boolean {
    if (!editor) return true;
    if (userDisabled) return true;
    if (!canToggle) return true;
    if (!editor.isEditable) return true;
    return false;
}

export function shouldShowNode(params: {
    editor: Editor | null;
    type: NodeType;
    nodeInSchema: boolean;
    hide?: boolean;
}): boolean {
    const { editor, nodeInSchema, hide } = params;

    if (hide) return false;
    if (!nodeInSchema || !editor) {
        return false;
    }

    return true;
}

export function formatNodeName(type: NodeType): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

export function useNodeState(editor: Editor | null, type: NodeType, disabled: boolean = false, hide: boolean = false) {
    const nodeInSchema = isNodeInSchema(type, editor);
    const canToggle = canToggleNode(editor, type);
    const isDisabled = isNodeDisabled(editor, canToggle, disabled);
    const isActive = isNodeActive(editor, type);

    const shouldShow = React.useMemo(
        () =>
            shouldShowNode({
                editor,
                type,
                nodeInSchema,
                hide: hide,
            }),
        [editor, type, hide, nodeInSchema],
    );

    const handleToggle = React.useCallback(() => {
        if (!isDisabled && editor) {
            return toggleNode(editor, type);
        }
        return false;
    }, [editor, type, isDisabled]);

    const Icon = nodeIcons[type];
    const shortcutKey = nodeShortcutKeys[type];
    const label = nodeLabels[type];

    return {
        nodeInSchema,
        canToggle,
        isDisabled,
        isActive,
        shouldShow,
        handleToggle,
        Icon,
        shortcutKey,
        label,
    };
}
