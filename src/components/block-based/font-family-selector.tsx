// --- Imports ---
import { isNodeSelection, type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn, isMarkInSchema } from "@/lib/utils";
import React from "react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Types & Interfaces ---
export interface FontFamily {
    label: string;
    value: string;
}

export interface FontFamilyButtonProps
    extends Omit<React.ComponentProps<typeof Button>, "type"> {
    editor?: Editor | null;
    fontFamily: FontFamily;
    hideWhenUnavailable?: boolean;
}

export interface FontFamilySelectorProps
    extends Omit<React.ComponentProps<"div">, "type"> {
    editor?: Editor | null;
    fontFamilies?: FontFamily[];
    hideWhenUnavailable?: boolean;
    className?: string;
}

// --- Constants ---
export const DEFAULT_FONT_FAMILIES: FontFamily[] = [
    { label: "Default", value: "var(--font-sans)" },
    { label: "Serif", value: "var(--font-eb-garamond)" },
    { label: "Open", value: "var(--font-open-sans)" },
    { label: "Inter", value: "var(--font-inter)" },
    { label: "Mono", value: "var(--font-ia-writer-mono)" },
    { label: "Noto", value: "var(--font-noto-sans)" },
];

// --- Utility Functions ---
export function canToggleFontFamily(
    editor: Editor | null,
    fontFamily: FontFamily,
): boolean {
    if (!editor) return false;
    try {
        return editor
            .can()
            .toggleMark("textStyle", { fontFamily: fontFamily.value });
    } catch {
        return false;
    }
}

export function isFontFamilyActive(
    editor: Editor | null,
    fontFamily: FontFamily,
): boolean {
    if (!editor) return false;
    return editor.isActive("textStyle", { fontFamily: fontFamily.value });
}

export function toggleFontFamily(
    editor: Editor | null,
    fontFamily: FontFamily,
): void {
    if (!editor) return;

    if (isFontFamilyActive(editor, fontFamily)) {
        if (fontFamily.label !== "Default") {
            editor
                .chain()
                .focus()
                .setFontFamily(DEFAULT_FONT_FAMILIES[0].value)
                .run();
        } else {
            editor.chain().focus().unsetFontFamily().run();
        }
    } else {
        editor
            .chain()
            .focus()
            .toggleMark("textStyle", { fontFamily: fontFamily.value })
            .run();
    }
}

export function isFontFamilyDisabled(
    editor: Editor | null,
    fontFamily: FontFamily,
    userDisabled: boolean = false,
): boolean {
    if (!editor || userDisabled || !canToggleFontFamily(editor, fontFamily)) {
        return true;
    }
    return false;
}

export function shouldShowFontFamily(params: {
    editor: Editor | null;
    fontFamily: FontFamily;
    hideWhenUnavailable: boolean;
    textStyleInSchema: boolean;
}): boolean {
    const { editor, hideWhenUnavailable, textStyleInSchema } = params;

    if (!textStyleInSchema) return false;
    if (hideWhenUnavailable && isNodeSelection(editor?.state.selection)) {
        return false;
    }
    return true;
}

// --- Custom Hooks ---
export function useFontFamilyState(
    editor: Editor | null,
    fontFamily: FontFamily,
    disabled: boolean = false,
) {
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

// --- Components ---
export const FontFamilyButton = React.forwardRef<
    HTMLButtonElement,
    FontFamilyButtonProps
>(
    (
        {
            editor: providedEditor,
            fontFamily,
            hideWhenUnavailable = false,
            className = "",
            disabled,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const editor = useTiptapEditor(providedEditor);
        const { textStyleInSchema, isDisabled, isActive } = useFontFamilyState(
            editor,
            fontFamily,
            disabled,
        );

        const handleClick = React.useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(e);
                if (!isDisabled && editor) {
                    toggleFontFamily(editor, fontFamily);
                }
            },
            [onClick, isDisabled, editor, fontFamily],
        );

        const show = React.useMemo(
            () =>
                shouldShowFontFamily({
                    editor,
                    fontFamily,
                    hideWhenUnavailable,
                    textStyleInSchema,
                }),
            [editor, fontFamily, hideWhenUnavailable, textStyleInSchema],
        );

        if (!show || !editor || !editor.isEditable) return null;

        return (
            <Button
                variant="ghost"
                size="icon"
                role="button"
                disabled={isDisabled}
                ref={ref}
                onClick={handleClick}
                aria-label={fontFamily.label}
                aria-pressed={isActive}
                className={cn(
                    "hover:text-tiptor-foreground hover:bg-tiptor-secondary text-tiptor-foreground flex h-fit w-fit shrink-0 cursor-pointer flex-col items-center justify-center gap-1 p-2 pt-3 font-normal transition-colors duration-300 select-none focus:outline-none",
                    className,
                )}
                {...buttonProps}
            >
                {children || (
                    <>
                        <span
                            className={cn(
                                "text-2xl",
                                isActive && "text-tiptor-primary-green",
                            )}
                            style={{ fontFamily: fontFamily.value }}
                        >
                            Ag
                        </span>
                        <span className="text-tiptor-secondary-foreground text-center text-xs text-wrap capitalize">
                            {fontFamily.label}
                        </span>
                    </>
                )}
            </Button>
        );
    },
);

export function FontFamilySelector({
    editor: providedEditor,
    fontFamilies = DEFAULT_FONT_FAMILIES,
    hideWhenUnavailable = false,
    className,
    ...props
}: FontFamilySelectorProps) {
    const editor = useTiptapEditor(providedEditor);
    const textStylesInSchema = isMarkInSchema("textStyle", editor);

    const show = React.useMemo(() => {
        if (!textStylesInSchema) return false;
        if (
            hideWhenUnavailable &&
            (!editor ||
                !editor.isEditable ||
                isNodeSelection(editor.state.selection))
        ) {
            return false;
        }
        return true;
    }, [textStylesInSchema, hideWhenUnavailable, editor]);

    if (!show || !editor || !editor.isEditable) return null;

    return (
        <div
            className={cn("grid w-full grid-cols-3 grid-rows-2 p-1", className)}
            {...props}
        >
            {fontFamilies.map((fontFamily) => (
                <FontFamilyButton
                    key={fontFamily.value}
                    editor={editor}
                    fontFamily={fontFamily}
                    hideWhenUnavailable={hideWhenUnavailable}
                    className="h-full w-full"
                />
            ))}
        </div>
    );
}

FontFamilySelector.displayName = "FontFamilySelector";
