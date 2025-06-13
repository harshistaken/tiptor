import React from "react";
import { type Editor } from "@tiptap/react";

// --- Utils ---
import { cn } from "@/lib/utils";
import {
    DEFAULT_FONT_FAMILIES,
    shouldShowFontFamily,
    toggleFontFamily,
    useFontFamilyState,
    type FontFamily,
} from "@/utils/font-family";
import { isMarkInSchema } from "@/utils/common";

// --- Providers ---
import { useResolvedEditor } from "@/hooks/use-resolved-editor";

// --- Components ---
import { CustomButton } from "@/components/common/custom-button";

export interface FontFamilySelectorProps extends Omit<React.ComponentProps<"div">, "type"> {
    editor?: Editor | null;
    fontFamilies?: FontFamily[];
    className?: string;
    disabled?: boolean;
}

export function FontFamilySelector({
    editor: providedEditor,
    fontFamilies = DEFAULT_FONT_FAMILIES,
    disabled = false,
    className,
    ...props
}: FontFamilySelectorProps) {
    const editor = useResolvedEditor(providedEditor);
    const textStyleInSchema = isMarkInSchema("textStyle", editor);

    if (!editor || !textStyleInSchema) return null;

    return (
        <div className={cn("grid w-full grid-cols-3 grid-rows-2 p-1", className)} {...props}>
            {fontFamilies.map((fontFamilyOption) => (
                <FontFamilySelectorItem
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

export interface FontFamilySelectorItemProps extends Omit<React.ComponentProps<typeof CustomButton>, "type"> {
    editor?: Editor | null;
    fontFamily: FontFamily;
}

export const FontFamilySelectorItem = React.forwardRef<HTMLButtonElement, FontFamilySelectorItemProps>(
    ({ editor: providedEditor, fontFamily, className = "", disabled, onClick, ...buttonProps }, ref) => {
        const editor = useResolvedEditor(providedEditor);
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
            <CustomButton
                variant="ghost"
                size="sm"
                role="button"
                disabled={isDisabled}
                ref={ref}
                onClick={handleClick}
                aria-label={fontFamily.label}
                aria-pressed={isActive}
                className={cn(
                    "flex h-fit w-fit flex-col gap-1 pt-3 pb-2 transition-colors duration-300 select-none",
                    className,
                )}
                {...buttonProps}
            >
                <span className={cn("text-2xl", isActive && "text-primary")} style={{ fontFamily: fontFamily.value }}>
                    Ag
                </span>
                <span className="text-muted-foreground text-center text-xs text-wrap capitalize">
                    {fontFamily.label}
                </span>
            </CustomButton>
        );
    },
);
