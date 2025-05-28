import React from "react";
import { type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isMarkInSchema } from "@/utils/tiptap/schema";
import {
    DEFAULT_FONT_FAMILIES,
    type FontFamily,
    shouldShowFontFamily,
    toggleFontFamily,
    useFontFamilyState,
} from "@/utils/tiptap/font-family";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

export interface FontFamilyPickerProps extends Omit<React.ComponentProps<"div">, "type"> {
    editor?: Editor | null;
    fontFamilies?: FontFamily[];
    className?: string;
    disabled?: boolean;
}

export function FontFamilyPicker({
    editor: providedEditor,
    fontFamilies = DEFAULT_FONT_FAMILIES,
    disabled = false,
    className,
    ...props
}: FontFamilyPickerProps) {
    const editor = useTiptapEditor(providedEditor);
    const textStyleInSchema = isMarkInSchema("textStyle", editor);

    if (!editor || !textStyleInSchema) return null;

    return (
        <div className={cn("grid w-full grid-cols-3 grid-rows-2 p-1", className)} {...props}>
            {fontFamilies.map((fontFamilyOption) => (
                <FontFamilyPickerItem
                    key={fontFamilyOption.value}
                    editor={editor}
                    disabled={disabled}
                    fontFamily={fontFamilyOption}
                    className="h-full w-full"
                />
            ))}
        </div>
    );
}

export interface FontFamilyPickerItemProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    editor?: Editor | null;
    fontFamily: FontFamily;
}

export const FontFamilyPickerItem = React.forwardRef<HTMLButtonElement, FontFamilyPickerItemProps>(
    ({ editor: providedEditor, fontFamily, className = "", disabled, onClick, ...buttonProps }, ref) => {
        const editor = useTiptapEditor(providedEditor);
        const { textStyleInSchema, isDisabled, isActive } = useFontFamilyState(editor, fontFamily, disabled);

        const handleClick = React.useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(e);
                if (!isDisabled && editor) {
                    toggleFontFamily(editor, fontFamily);
                }
            },
            [onClick, isDisabled, editor, fontFamily],
        );

        const showButton = React.useMemo(
            () =>
                shouldShowFontFamily({
                    editor,
                    textStyleInSchema,
                }),
            [editor, textStyleInSchema],
        );

        if (!showButton) return null;

        return (
            <Button
                variant="ghost"
                size="sm"
                role="button"
                disabled={isDisabled}
                ref={ref}
                onClick={handleClick}
                aria-label={fontFamily.label}
                aria-pressed={isActive}
                className={cn(
                    "flex h-fit w-fit cursor-pointer flex-col gap-1 pt-3 pb-2 transition-colors duration-300 select-none",
                    className,
                )}
                {...buttonProps}
            >
                <span className={cn("text-2xl", isActive && "text-primary")} style={{ fontFamily: fontFamily.value }}>
                    Ag
                </span>
                <span className="text-secondary-foreground text-center text-xs text-wrap capitalize">
                    {fontFamily.label}
                </span>
            </Button>
        );
    },
);
