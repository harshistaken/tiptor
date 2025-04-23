import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { BanIcon } from "lucide-react";

// --- Lib ---
import { cn, isMarkInSchema } from "@/lib/utils";

// --- UI Primitives ---
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMenuNavigation } from "@/hooks/use-menu-navigation";

export interface TextColor {
    label: string;
    value: string;
    border?: string;
}

export interface TextColorComponentProps {
    editor?: Editor | null;
    colors?: TextColor[];
    activeNode?: number;
}

export const DEFAULT_TEXT_COLORS: TextColor[] = [
    {
        label: "Green",
        value: "var(--editor-text-color-green)",
        border: "var(--editor-text-color-green)",
    },
    {
        label: "Blue",
        value: "var(--editor-text-color-blue)",
        border: "var(--editor-text-color-blue)",
    },
    {
        label: "Red",
        value: "var(--editor-text-color-red)",
        border: "var(--editor-text-color-red)",
    },
    {
        label: "Purple",
        value: "var(--editor-text-color-purple)",
        border: "var(--editor-text-color-purple)",
    },
    {
        label: "Yellow",
        value: "var(--editor-text-color-yellow)",
        border: "var(--editor-text-color-yellow)",
    },
];

export const useTextColor = (editor: Editor | null) => {
    const markAvailable = isMarkInSchema("textStyle", editor);

    const getActiveTextColor = React.useCallback(() => {
        if (!editor) return null;
        if (!editor.isActive("textStyle")) return null;
        const attrs = editor.getAttributes("textStyle");
        return attrs.color || null;
    }, [editor]);

    const toggleTextColor = React.useCallback(
        (color: string) => {
            if (!markAvailable || !editor) return;
            if (color === "none") {
                editor.chain().focus().unsetColor().run();
            } else {
                editor.chain().focus().toggleMark("textStyle", { color }).run();
            }
        },
        [markAvailable, editor],
    );

    return {
        markAvailable,
        getActiveTextColor,
        toggleTextColor,
    };
};

export const TextColorButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button> & {
        editor?: Editor | null;
        showTooltip?: boolean;
        isActive: boolean;
        isDisabled: boolean;
        children?: React.ReactNode;
    }
>(({ editor, className, children, showTooltip = true, isActive, isDisabled, ...props }, ref) => {
    const currentEditor = useTiptapEditor(editor);
    const { getActiveTextColor } = useTextColor(currentEditor);
    const activeColor = getActiveTextColor();

    if (!showTooltip) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="icon"
                role="button"
                aria-label="Text Color"
                tabIndex={-1}
                className={cn(
                    "size-8 cursor-pointer text-foreground/70",
                    isActive && "bg-accent text-accent-foreground dark:bg-accent/30",
                    className,
                )}
                disabled={isDisabled}
                ref={ref}
                {...props}
            >
                {children || (
                    <div
                        className="size-5 flex items-center justify-center rounded border-[1.5px] border-foreground/70 text-foreground/70 pointer-events-none shrink-0 font-normal"
                        style={
                            {
                                color: activeColor || undefined,
                                borderColor: activeColor || undefined,
                            } as React.CSSProperties
                        }
                    >
                        A
                    </div>
                )}
            </Button>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        role="button"
                        aria-label="Text Color"
                        tabIndex={-1}
                        className={cn(
                            "size-8 cursor-pointer text-foreground/70",
                            isActive && "bg-accent text-accent-foreground dark:bg-accent/30",
                            className,
                        )}
                        disabled={isDisabled}
                        ref={ref}
                        {...props}
                    >
                        {children || (
                            <div
                                className="size-5 flex items-center justify-center rounded border-[1.5px] border-foreground/70 text-foreground/70 pointer-events-none shrink-0 font-normal"
                                style={
                                    {
                                        color: activeColor || undefined,
                                        borderColor: activeColor || undefined,
                                    } as React.CSSProperties
                                }
                            >
                                A
                            </div>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="flex flex-col justify-center items-center">
                    <span>Text color</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
});

export function TextColorContent({
    editor: providedEditor,
    colors = DEFAULT_TEXT_COLORS,
    onClose,
}: {
    editor?: Editor | null;
    colors?: TextColor[];
    onClose?: () => void;
}) {
    const editor = useTiptapEditor(providedEditor);

    const containerRef = React.useRef<HTMLDivElement>(null);

    const { getActiveTextColor, toggleTextColor } = useTextColor(editor);
    const activeColor = getActiveTextColor();

    const menuItems = React.useMemo(
        () => [...colors, { label: "Remove text color", value: "none" }],
        [colors],
    );

    const { selectedIndex } = useMenuNavigation({
        containerRef,
        items: menuItems,
        orientation: "both",
        onSelect: (item) => {
            toggleTextColor(item.value);
            onClose?.();
        },
        onClose,
        autoSelectFirstItem: false,
    });

    return (
        <div ref={containerRef} className="h-8 flex items-center justify-center gap-2" tabIndex={0}>
            <div className="h-full flex items-center justify-center gap-[1px]">
                {colors.map((color, index) => (
                    <Button
                        key={color.value}
                        type="button"
                        variant="ghost"
                        size="icon"
                        role="menuitem"
                        className={cn(
                            "size-8 cursor-pointer text-foreground/70",
                            (activeColor === color.value || selectedIndex === index) &&
                                "bg-accent text-accent-foreground dark:bg-accent/30",
                        )}
                        aria-label={`${color.label} text color`}
                        tabIndex={index === selectedIndex ? 0 : -1}
                        onClick={() => toggleTextColor(color.value)}
                    >
                        <div
                            className="size-5 flex items-center justify-center rounded border-[1.5px] pointer-events-none shrink-0 font-normal"
                            style={
                                {
                                    color: color.value,
                                    borderColor: color.border,
                                } as React.CSSProperties
                            }
                        >
                            A
                        </div>
                    </Button>
                ))}
            </div>
            <Separator
                orientation="vertical"
                className={cn("flex data-[orientation=vertical]:h-2/3")}
            />
            <div className="flex items-center justify-center gap-[1px]">
                <Button
                    type="button"
                    role="menuitem"
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "size-8 cursor-pointer text-foreground/70",
                        selectedIndex === colors.length &&
                            "bg-accent text-accent-foreground dark:bg-accent/30",
                    )}
                    onClick={() => toggleTextColor("none")}
                    aria-label="Remove text color"
                    tabIndex={selectedIndex === colors.length ? 0 : -1}
                >
                    <BanIcon className="size-4 pointer-events-none shrink-0" />
                </Button>
            </div>
        </div>
    );
}

export interface TextColorPopoverProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * The text colors to display in the popover.
     */
    colors?: TextColor[];
    /**
     * Whether to hide the text color popover.
     */
    hideWhenUnavailable?: boolean;
}

export function TextColorPopover({
    editor: providedEditor,
    colors = DEFAULT_TEXT_COLORS,
    hideWhenUnavailable = false,
    ...props
}: TextColorPopoverProps) {
    const editor = useTiptapEditor(providedEditor);

    const { markAvailable } = useTextColor(editor);
    const [isOpen, setIsOpen] = React.useState(false);

    const isDisabled = React.useMemo(() => {
        if (!markAvailable || !editor) {
            return true;
        }

        return (
            editor.isActive("code") ||
            editor.isActive("codeBlock") ||
            editor.isActive("imageUpload")
        );
    }, [markAvailable, editor]);

    const canSetMark = React.useMemo(() => {
        if (!editor || !markAvailable) return false;

        try {
            return editor.can().setMark("textStyle");
        } catch {
            return false;
        }
    }, [editor, markAvailable]);

    const isActive = editor?.isActive("textStyle") ?? false;

    const show = React.useMemo(() => {
        if (hideWhenUnavailable) {
            if (isNodeSelection(editor?.state.selection) || !canSetMark) {
                return false;
            }
        }

        return true;
    }, [hideWhenUnavailable, editor, canSetMark]);

    if (!show || !editor || !editor.isEditable) {
        return null;
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <TextColorButton
                    editor={providedEditor}
                    isDisabled={isDisabled}
                    isActive={isActive}
                    aria-pressed={isActive}
                    {...props}
                />
            </PopoverTrigger>

            <PopoverContent
                sideOffset={10}
                align="start"
                alignOffset={-14}
                aria-label="Highlight colors"
                className="w-full h-10 py-0 flex items-center justify-center rounded-full "
            >
                <TextColorContent
                    editor={editor}
                    colors={colors}
                    onClose={() => setIsOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}

TextColorButton.displayName = "TextColorButton";
