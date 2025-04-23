import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import {
    ChevronDown,
    TypeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    Heading5Icon,
    Heading6Icon,
} from "lucide-react";

// --- Lib ---
import { cn, isNodeInSchema } from "@/lib/utils";

// --- UI Primitives ---
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shortcut } from "./shortcut";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type TextStyle = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
export type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface TextStyleDropdownMenuItemProps
    extends Omit<React.ComponentProps<typeof DropdownMenuItem>, "type"> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * The textStyle.
     */
    textStyle: TextStyle;
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

export interface TextStyleDropdownProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    editor?: Editor | null;
    textStyles?: TextStyle[];
    hideWhenUnavailable?: boolean;
    className?: string;
    onOpenChange?: (isOpen: boolean) => void;
}

export const textStyleIcons = {
    h1: Heading1Icon,
    h2: Heading2Icon,
    h3: Heading3Icon,
    h4: Heading4Icon,
    h5: Heading5Icon,
    h6: Heading6Icon,
    p: TypeIcon,
};

export const textStyleShortcutKeys: Partial<Record<TextStyle, string>> = {
    h1: "Ctrl-Alt-1",
    h2: "Ctrl-Alt-2",
    h3: "Ctrl-Alt-3",
    h4: "Ctrl-Alt-4",
    h5: "Ctrl-Alt-5",
    h6: "Ctrl-Alt-6",
    p: "Ctrl-Alt-0",
};

export function canToggleTextStyle(editor: Editor | null, textStyle: TextStyle): boolean {
    if (!editor) return false;

    try {
        if (textStyle === "p") {
            // Check if the editor can set paragraph style
            return editor.can().setParagraph();
        }

        // Extract the heading level (1-6) from the textStyle string (e.g., "h1" -> 1)
        const level = parseInt(textStyle.substring(1), 10) as Level;

        // Check if the corresponding heading level can be toggled
        return editor.can().toggleNode("heading", "paragraph", { level });
    } catch {
        return false;
    }
}

export function isTextStyleActive(editor: Editor | null, textStyle: TextStyle): boolean {
    if (!editor) return false;

    if (textStyle === "p") {
        // Check if paragraph is active
        return editor.isActive("paragraph");
    }

    // Extract the heading level (1-6) from the textStyle string (e.g., "h1" -> 1)
    const level = parseInt(textStyle.substring(1), 10) as Level;

    // Check if the corresponding heading level is currently active
    return editor.isActive("heading", { level });
}

export function toggleTextStyle(editor: Editor | null, textStyle: TextStyle): void {
    if (!editor) return;

    if (textStyle === "p") {
        // If the target style is paragraph, just set it directly
        editor.chain().focus().setParagraph().run();
        return;
    }

    // Extract the heading level (1-6) from the textStyle string (e.g., "h1" -> 1)
    const level = parseInt(textStyle.substring(1), 10) as Level;

    // Check if the corresponding heading level is currently active
    if (editor.isActive("heading", { level })) {
        // If active, toggle back to paragraph
        editor.chain().focus().setParagraph().run();
    } else {
        // If not active, toggle the heading with the specified level
        editor.chain().focus().toggleNode("heading", "paragraph", { level }).run();
    }
}

export function isTextStyleButtonDisabled(
    editor: Editor | null,
    textStyle: TextStyle,
    userDisabled: boolean = false,
): boolean {
    if (!editor) return true;
    if (userDisabled) return true;
    if (!canToggleTextStyle(editor, textStyle)) return true;
    return false;
}

export function shouldShowTextStyleButton(params: {
    editor: Editor | null;
    textStyle: TextStyle;
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

export function getFormattedTextStyleName(textStyle: TextStyle): string {
    if (textStyle === "p") {
        return "Paragraph";
    }

    // Extract the heading level (1-6) from the textStyle string (e.g., "h1" -> 1)
    const level = parseInt(textStyle.substring(1), 10) as Level;

    // Return the formatted heading name
    return `Heading ${level}`;
}

export function useTextStyleState(
    editor: Editor | null,
    textStyle: TextStyle,
    disabled: boolean = false,
) {
    const textStyleInSchema =
        textStyle === "p" ? isNodeInSchema("paragraph", editor) : isNodeInSchema("heading", editor);

    const isDisabled = isTextStyleButtonDisabled(editor, textStyle, disabled);
    const isActive = isTextStyleActive(editor, textStyle);

    const Icon = textStyleIcons[textStyle];
    const shortcutKey = textStyleShortcutKeys[textStyle];
    const formattedName = getFormattedTextStyleName(textStyle);

    return {
        textStyleInSchema,
        isDisabled,
        isActive,
        Icon,
        shortcutKey,
        formattedName,
    };
}

export const TextStyleDropdownMenuItem = React.forwardRef<
    HTMLDivElement,
    TextStyleDropdownMenuItemProps
>(
    (
        {
            editor: providedEditor,
            textStyle,
            text,
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

        const { textStyleInSchema, isDisabled, isActive, Icon, shortcutKey, formattedName } =
            useTextStyleState(editor, textStyle, disabled);

        const handleSelect = React.useCallback(
            (e: Event) => {
                onSelect?.(e);

                if (!e.defaultPrevented && !isDisabled && editor) {
                    toggleTextStyle(editor, textStyle);
                }
            },
            [onSelect, isDisabled, editor, textStyle],
        );

        const show = React.useMemo(() => {
            return shouldShowTextStyleButton({
                editor,
                textStyle,
                hideWhenUnavailable,
                textStyleInSchema,
            });
        }, [editor, textStyle, hideWhenUnavailable, textStyleInSchema]);

        if (!show || !editor || !editor.isEditable) {
            return null;
        }

        return (
            <DropdownMenuItem
                disabled={isDisabled}
                ref={ref}
                onSelect={handleSelect}
                aria-label={formattedName}
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
                        <Icon
                            className={cn(
                                "pointer-events-none shrink-0",
                                textStyle === "p" ? "size-4 mr-1" : "size-5",
                            )}
                        />
                        <span className="font-normal">{text}</span>
                        {shortcutKey && (
                            <DropdownMenuShortcut>
                                <Shortcut shortcutKey={shortcutKey} />
                            </DropdownMenuShortcut>
                        )}
                    </>
                )}
            </DropdownMenuItem>
        );
    },
);

export function TextStyleDropdown({
    editor: providedEditor,
    textStyles = ["h1", "h2", "h3", "h4", "h5", "h6", "p"],
    hideWhenUnavailable = false,
    onOpenChange,
    className,
    ...props
}: TextStyleDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const editor = useTiptapEditor(providedEditor);

    const textStylesInSchema =
        isNodeInSchema("heading", editor) && isNodeInSchema("paragraph", editor);

    const handleOnOpenChange = React.useCallback(
        (open: boolean) => {
            setIsOpen(open);
            onOpenChange?.(open);
        },
        [onOpenChange],
    );

    const getActiveIcon = React.useCallback(() => {
        if (!editor) return <TypeIcon className="size-4 pointer-events-none shrink-0" />;

        const activeTextStyle = textStyles.find((textStyle) =>
            isTextStyleActive(editor, textStyle),
        ) as TextStyle | undefined;

        if (!activeTextStyle) return <TypeIcon className="size-4 pointer-events-none shrink-0" />;

        const ActiveIcon = textStyleIcons[activeTextStyle];
        return (
            <ActiveIcon
                className={cn(
                    "pointer-events-none shrink-0",
                    activeTextStyle === "p" ? "size-4" : "size-5",
                )}
            />
        );
    }, [editor, textStyles]);

    // Renamed and corrected the logic: Check if *any* style *can* be toggled
    const canApplyAnyTextStyle = React.useCallback((): boolean => {
        if (!editor) return false;
        // Check if the editor.can() toggle *any* of the text styles
        return textStyles.some((textStyle) => canToggleTextStyle(editor, textStyle));
    }, [editor, textStyles]);

    // Use the corrected logic for isDisabled
    const isDisabled = !canApplyAnyTextStyle();
    const isAnyTextStyleActive =
        (editor?.isActive("heading") || editor?.isActive("paragraph")) ?? false;

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
        <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                role="button"
                                aria-label="Format text as heading or paragraph"
                                aria-pressed={isAnyTextStyleActive}
                                tabIndex={-1}
                                className={cn(
                                    "cursor-pointer shrink-0 text-foreground/70",
                                    isAnyTextStyleActive &&
                                        "bg-accent text-foreground/70 dark:bg-accent/30",
                                    className,
                                )}
                                disabled={isDisabled}
                                {...props}
                            >
                                {getActiveIcon()}
                                <ChevronDown className="size-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col justify-center items-center">
                        <span>Text styles</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent sideOffset={10} align="start" className="w-52">
                <DropdownMenuLabel className="text-[9px] uppercase text-muted-foreground">
                    Text style
                </DropdownMenuLabel>
                <DropdownMenuGroup className="space-y-[1px]">
                    {textStyles.map((textStyle) => (
                        <TextStyleDropdownMenuItem
                            key={textStyle}
                            editor={editor}
                            textStyle={textStyle}
                            text={getFormattedTextStyleName(textStyle)}
                        />
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
TextStyleDropdown.displayName = "TextStyleDropdown";
