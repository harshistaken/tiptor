// --- Imports ---
import { isNodeSelection, type Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { cn, isMarkInSchema } from "@/lib/utils";
import React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// --- Code ---

export interface FontFamily {
    label: string;
    value: string;
}

export interface FontFamilyCommandItemProps
    extends Omit<React.ComponentProps<typeof CommandItem>, "type"> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * The textStyle.
     */
    fontFamily: FontFamily;
    /**
     * Optional text to display alongside the icon.
     */
    text?: string; // Note: This prop is defined but not used in the current implementation
    /**
     * Whether the button should hide when the textStyle is not available.
     * @default false
     */
    hideWhenUnavailable?: boolean;
}

export interface FontFamilyComboboxProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    editor?: Editor | null;
    fontFamilies?: FontFamily[];
    hideWhenUnavailable?: boolean;
    className?: string;
    onOpenChange?: (isOpen: boolean) => void;
}

export const DEFAULT_FONT_FAMILIES: FontFamily[] = [
    {
        label: "Arial",
        value: "Arial, var(--font-sans)",
    },
    {
        label: "Times New Roman",
        value: "Times New Roman, var(--font-serif)",
    },
    {
        label: "Georgia",
        value: "Georgia, var(--font-serif)",
    },
    {
        label: "Serif",
        value: "serif, var(--font-serif)",
    },
    {
        label: "Monospace",
        value: "monospace, var(--font-mono)",
    },
    {
        label: "Roboto",
        value: "var(--font-roboto)",
    },
    {
        label: "Open Sans",
        value: "var(--font-open-sans)",
    },
    {
        label: "Inter",
        value: "var(--font-inter)",
    },
];

export function canToggleFontFamily(editor: Editor | null, fontFamily: FontFamily): boolean {
    if (!editor) return false;

    try {
        // Check if the corresponding heading level can be toggled
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

    // Check if the corresponding heading level is currently active
    if (isFontFamilyActive(editor, fontFamily)) {
        // If active, toggle back to paragraph
        editor.chain().focus().unsetFontFamily().run();
    } else {
        // If not active, toggle the font family
        editor.chain().focus().toggleMark("textStyle", { fontFamily: fontFamily.value }).run();
    }
}

export function isFontFamilyButtonDisabled(
    editor: Editor | null,
    fontFamily: FontFamily,
    userDisabled: boolean = false,
): boolean {
    if (!editor) return true;
    if (userDisabled) return true;
    if (!canToggleFontFamily(editor, fontFamily)) return true;
    return false;
}

export function shouldShowTextStyleButton(params: {
    editor: Editor | null;
    fontFamily: FontFamily;
    hideWhenUnavailable: boolean;
    textStyleInSchema: boolean;
}): boolean {
    const { editor, hideWhenUnavailable, textStyleInSchema } = params;

    if (!textStyleInSchema) {
        return false;
    }

    if (hideWhenUnavailable) {
        if (isNodeSelection(editor?.state.selection)) {
            return false;
        }
    }

    return true;
}

export function useFontFamilyState(
    editor: Editor | null,
    fontFamily: FontFamily,
    disabled: boolean = false,
) {
    const textStyleInSchema = isMarkInSchema("textStyle", editor);

    const isDisabled = isFontFamilyButtonDisabled(editor, fontFamily, disabled);
    const isActive = isFontFamilyActive(editor, fontFamily);

    const fontFamilyLabel = fontFamily.label;
    const fontFamilyValue = fontFamily.value;

    return {
        textStyleInSchema,
        isDisabled,
        isActive,
        fontFamilyLabel,
        fontFamilyValue,
    };
}

export const FontFamilyCommandItem = React.forwardRef<HTMLDivElement, FontFamilyCommandItemProps>(
    (
        {
            editor: providedEditor,
            fontFamily,
            hideWhenUnavailable = false,
            className = "",
            disabled,
            onSelect,
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

        const handleSelect = React.useCallback(
            (e: string) => {
                onSelect?.(e);

                if (!isDisabled && editor) {
                    toggleFontFamily(editor, fontFamily);
                }
            },
            [onSelect, isDisabled, editor, fontFamily],
        );

        const show = React.useMemo(() => {
            return shouldShowTextStyleButton({
                editor,
                fontFamily,
                hideWhenUnavailable,
                textStyleInSchema,
            });
        }, [editor, fontFamily, hideWhenUnavailable, textStyleInSchema]);

        if (!show || !editor || !editor.isEditable) {
            return null;
        }

        return (
            <CommandItem
                disabled={isDisabled}
                ref={ref}
                onSelect={handleSelect}
                aria-label={fontFamily.label}
                aria-pressed={isActive}
                className={cn(
                    "cursor-pointer",
                    isActive && "bg-accent text-accent-foreground",
                    className,
                )}
                {...buttonProps}
            >
                {children || (
                    <>
                        <span className="font-normal">{fontFamily.label}</span>
                        <CheckIcon
                            className={cn(
                                "size-4 pointer-events-none shrink-0 ml-auto",
                                isActive ? "opacity-100" : "opacity-0",
                            )}
                        />
                    </>
                )}
            </CommandItem>
        );
    },
);

export function FontFamilyCombobox({
    editor: providedEditor,
    fontFamilies = DEFAULT_FONT_FAMILIES,
    hideWhenUnavailable = false,
    onOpenChange,
    className,
    ...props
}: FontFamilyComboboxProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const editor = useTiptapEditor(providedEditor);

    const textStylesInSchema = isMarkInSchema("textStyle", editor);

    const handleOnOpenChange = React.useCallback(
        (open: boolean) => {
            setIsOpen(open);
            onOpenChange?.(open);
        },
        [onOpenChange],
    );

    const getActiveFontFamilyLabel = React.useCallback(() => {
        if (!editor) return "Select font...";

        const activeFontFamily = fontFamilies.find((fontFamily) =>
            isFontFamilyActive(editor, fontFamily),
        ) as FontFamily | undefined;

        if (!activeFontFamily) return "Select font...";

        const activeFontFamilyLabel = activeFontFamily.label;
        return activeFontFamilyLabel;
    }, [editor, fontFamilies]);

    // Renamed and corrected the logic: Check if *any* style *can* be toggled
    const canApplyAnyFontFamily = React.useCallback((): boolean => {
        if (!editor) return false;
        // Check if the editor.can() toggle *any* of the text styles
        return fontFamilies.some((fontFamily) => canToggleFontFamily(editor, fontFamily));
    }, [editor, fontFamilies]);

    // Use the corrected logic for isDisabled
    const isDisabled = !canApplyAnyFontFamily();
    const isAnyTextStyleActive = editor?.isActive("textStyle") ?? false;

    const show = React.useMemo(() => {
        if (!textStylesInSchema) {
            return false;
        }

        if (hideWhenUnavailable) {
            // Also check if the editor is null or not editable before accessing state
            if (!editor || !editor.isEditable || isNodeSelection(editor.state.selection)) {
                return false;
            }
        }

        return true;
    }, [textStylesInSchema, hideWhenUnavailable, editor]);

    if (!show || !editor || !editor.isEditable) {
        return null;
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                role="button"
                                aria-label="Set font family"
                                aria-pressed={isAnyTextStyleActive}
                                tabIndex={-1}
                                className={cn(
                                    "w-44 justify-between font-normal cursor-pointer shrink-0 ",
                                    isAnyTextStyleActive &&
                                        "bg-accent text-accent-foreground dark:bg-accent/50",
                                    className,
                                )}
                                disabled={isDisabled}
                                {...props}
                            >
                                {getActiveFontFamilyLabel()}
                                <ChevronsUpDown className="size-4 text-muted-foreground" />
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col justify-center items-center">
                        <span>Font Family</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                    <CommandInput placeholder="Search font..." />
                    <CommandList>
                        <CommandEmpty className="py-6 text-sm text-center text-muted-foreground">
                            No such font found.
                        </CommandEmpty>
                        <CommandGroup className="[&>div]:space-y-[1px]">
                            {fontFamilies.map((fontFamily) => (
                                <FontFamilyCommandItem
                                    key={fontFamily.value}
                                    editor={editor}
                                    fontFamily={fontFamily}
                                    hideWhenUnavailable={hideWhenUnavailable}
                                    className="w-full"
                                >
                                    {fontFamily.label}
                                </FontFamilyCommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

FontFamilyCombobox.displayName = "FontFamilyCombobox";
