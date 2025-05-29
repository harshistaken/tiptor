import * as React from "react";

import type { Editor } from "@tiptap/react";
import { Icons } from "@/assets/icons";
import { isNodeInSchema } from "@/utils/tiptap/schema";

export type NodeType = "codeBlock" | "blockquote";

export const nodeIcons = {
    codeBlock: Icons.MaterialCode,
    blockquote: Icons.MaterialFormatQuote,
};

export const nodeShortcutKeys: Partial<Record<NodeType, string>> = {
    codeBlock: "Ctrl-Alt-c",
    blockquote: "Ctrl-Shift-b",
};

export const nodeLabels: Record<NodeType, string> = {
    codeBlock: "Code Block",
    blockquote: "Blockquote",
};

export function canToggleNode(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;

    try {
        return type === "codeBlock"
            ? editor.can().toggleNode("codeBlock", "paragraph")
            : editor.can().toggleWrap("blockquote");
    } catch {
        return false;
    }
}

export function isNodeActive(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;
    return editor.isActive(type);
}

export function toggleNode(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;

    if (type === "codeBlock") {
        return editor.chain().focus().toggleNode("codeBlock", "paragraph").run();
    } else {
        return editor.chain().focus().toggleWrap("blockquote").run();
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
