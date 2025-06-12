import * as React from "react";
import { type Editor } from "@tiptap/react";

// --- Assets ---
import {
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    Heading5Icon,
    Heading6Icon,
    TypeIcon,
} from "lucide-react";

// --- Utils ---
import { isNodeInSchema } from "@/utils/common";

export type HeadingLevelType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type TextBlockType = HeadingLevelType | "p";

export const TextBlockIcons: Record<TextBlockType, React.ElementType> = {
    h1: Heading1Icon,
    h2: Heading2Icon,
    h3: Heading3Icon,
    h4: Heading4Icon,
    h5: Heading5Icon,
    h6: Heading6Icon,
    p: TypeIcon,
};

export const textBlockLabels: Record<TextBlockType, string> = {
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    p: "Paragraph",
};

export const headingLevels: Record<HeadingLevelType, number> = {
    h1: 1,
    h2: 2,
    h3: 3,
    h4: 4,
    h5: 5,
    h6: 6,
};

export const textBlockShortcutKeys: Partial<Record<TextBlockType, string>> = {
    h1: "Ctrl-Alt-1",
    h2: "Ctrl-Alt-2",
    h3: "Ctrl-Alt-3",
    h4: "Ctrl-Alt-4",
    h5: "Ctrl-Alt-5",
    h6: "Ctrl-Alt-6",
    p: "Ctrl-Alt-0",
};

export function canToggleTextBlock(editor: Editor | null, textBlockType: TextBlockType): boolean {
    if (!editor) return false;

    try {
        if (textBlockType === "p") {
            return editor.can().setParagraph();
        } else {
            return editor.can().toggleNode("heading", "paragraph", { level: headingLevels[textBlockType] });
        }
    } catch {
        return false;
    }
}

export function isTextBlockActive(editor: Editor | null, textBlockType: TextBlockType): boolean {
    if (!editor) return false;

    if (textBlockType === "p") {
        return editor.isActive("paragraph");
    } else {
        return editor.isActive("heading", { level: headingLevels[textBlockType] });
    }
}

export function toggleTextBlock(editor: Editor | null, textBlockType: TextBlockType): boolean {
    if (!editor) return false;

    if (textBlockType === "p") {
        return editor.chain().focus().setParagraph().run();
    } else {
        if (editor.isActive("heading", { level: headingLevels[textBlockType] })) {
            return editor.chain().focus().setParagraph().run();
        } else {
            return editor
                .chain()
                .focus()
                .toggleNode("heading", "paragraph", { level: headingLevels[textBlockType] })
                .run();
        }
    }
}

export function isTextBlockDisabled(
    editor: Editor | null,
    textBlockType: TextBlockType,
    userDisabled: boolean = false,
): boolean {
    if (!editor) return true;
    if (userDisabled) return true;
    if (!canToggleTextBlock(editor, textBlockType)) return true;
    if (!editor.isEditable) return true;
    return false;
}

export function shouldShowTextBlock(params: {
    editor: Editor | null;
    textBlockType: TextBlockType;
    hide?: boolean;
    textBlockInSchema: boolean;
}): boolean {
    const { editor, textBlockInSchema, hide } = params;

    if (hide) return false;
    if (!textBlockInSchema || !editor) {
        return false;
    }

    return true;
}

export function getFormattedTextBlockName(textBlockType: TextBlockType): string {
    return textBlockLabels[textBlockType];
}

export function useTextBlockState(
    editor: Editor | null,
    textBlockType: TextBlockType,
    disabled: boolean = false,
    hide: boolean = false,
) {
    const textBlockInSchema =
        textBlockType === "p" ? isNodeInSchema("paragraph", editor) : isNodeInSchema("heading", editor);

    const canToggle = canToggleTextBlock(editor, textBlockType);
    const isDisabled = isTextBlockDisabled(editor, textBlockType, disabled);
    const isActive = isTextBlockActive(editor, textBlockType);

    const shouldShow = React.useMemo(
        () =>
            shouldShowTextBlock({
                editor,
                textBlockType,
                textBlockInSchema,
                hide: hide,
            }),
        [editor, textBlockType, hide, textBlockInSchema],
    );

    const handleToggle = React.useCallback(() => {
        if (!isDisabled && editor) {
            return toggleTextBlock(editor, textBlockType);
        }
        return false;
    }, [editor, textBlockType, isDisabled]);

    const Icon = TextBlockIcons[textBlockType];
    const shortcutKey = textBlockShortcutKeys[textBlockType];
    const label = textBlockLabels[textBlockType];

    return {
        textBlockInSchema,
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
