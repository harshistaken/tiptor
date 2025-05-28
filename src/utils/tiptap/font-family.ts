import { type Editor } from "@tiptap/react";
import { isMarkInSchema } from "@/utils/tiptap/schema";

export interface FontFamily {
    label: string;
    value: string;
}

export const DEFAULT_FONT_FAMILIES: FontFamily[] = [
    { label: "Default", value: "var(--font-sans)" },
    { label: "Serif", value: "var(--font-eb-garamond)" },
    { label: "Open", value: "var(--font-open-sans)" },
    { label: "Inter", value: "var(--font-inter)" },
    { label: "Mono", value: "var(--font-ia-writer-mono)" },
    { label: "Noto", value: "var(--font-noto-sans)" },
];

export function canToggleFontFamily(editor: Editor | null, fontFamily: FontFamily): boolean {
    if (!editor) return false;
    try {
        return editor.can().toggleMark("textStyle", { fontFamily: fontFamily.value });
    } catch {
        return false;
    }
}

export function isFontFamilyActive(editor: Editor | null, fontFamily: FontFamily): boolean {
    if (!editor) return false;
    return editor.isActive("textStyle", { fontFamily: fontFamily.value });
}

export function toggleFontFamily(editor: Editor | null, fontFamily: FontFamily): void {
    if (!editor) return;

    if (isFontFamilyActive(editor, fontFamily)) {
        if (fontFamily.label !== "Default") {
            editor.chain().focus().setFontFamily(DEFAULT_FONT_FAMILIES[0].value).run();
        } else {
            editor.chain().focus().unsetFontFamily().run();
        }
    } else {
        editor.chain().focus().toggleMark("textStyle", { fontFamily: fontFamily.value }).run();
    }
}

export function isFontFamilyDisabled(
    editor: Editor | null,
    fontFamily: FontFamily,
    disabled: boolean = false,
): boolean {
    if (disabled) {
        return true;
    }

    if (!editor || !editor.isEditable) {
        return true;
    }

    if (!canToggleFontFamily(editor, fontFamily)) {
        return true;
    }
    return false;
}

export function shouldShowFontFamily(params: { editor: Editor | null; textStyleInSchema: boolean }): boolean {
    const { editor, textStyleInSchema } = params;

    if (!editor || !textStyleInSchema) return false;

    return true;
}

export function useFontFamilyState(editor: Editor | null, fontFamily: FontFamily, disabled: boolean = false) {
    const textStyleInSchema = isMarkInSchema("textStyle", editor);
    const isDisabled = isFontFamilyDisabled(editor, fontFamily, disabled);
    const isActive = isFontFamilyActive(editor, fontFamily);

    return {
        textStyleInSchema,
        isDisabled,
        isActive,
        fontFamilyLabel: fontFamily.label,
        fontFamilyValue: fontFamily.value,
    };
}
