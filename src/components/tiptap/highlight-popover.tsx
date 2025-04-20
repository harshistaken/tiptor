import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { HighlighterIcon, BanIcon } from "lucide-react";

// --- Lib ---
import { cn, isMarkInSchema } from "@/lib/utils";

// --- UI Primitives ---
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Shortcut } from "./shortcut";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMenuNavigation } from "@/hooks/use-menu-navigation";

export interface HighlightColor {
    label: string;
    value: string;
    border?: string;
}

export interface HighlightContentProps {
    editor?: Editor | null;
    colors?: HighlightColor[];
    activeNode?: number;
}

export const DEFAULT_HIGHLIGHT_COLORS: HighlightColor[] = [
    {
        label: "Green",
        value: "var(--editor-highlight-color-green)",
        border: "var(--editor-highlight-color-green-contrast)",
    },
    {
        label: "Blue",
        value: "var(--editor-highlight-color-blue)",
        border: "var(--editor-highlight-color-blue-contrast)",
    },
    {
        label: "Red",
        value: "var(--editor-highlight-color-red)",
        border: "var(--editor-highlight-color-red-contrast)",
    },
    {
        label: "Purple",
        value: "var(--editor-highlight-color-purple)",
        border: "var(--editor-highlight-color-purple-contrast)",
    },
    {
        label: "Yellow",
        value: "var(--editor-highlight-color-yellow)",
        border: "var(--editor-highlight-color-yellow-contrast)",
    },
];

export const useHighlighter = (editor: Editor | null) => {
    const markAvailable = isMarkInSchema("highlight", editor);

    const getActiveColor = React.useCallback(() => {
        if (!editor) return null;
        if (!editor.isActive("highlight")) return null;
        const attrs = editor.getAttributes("highlight");
        return attrs.color || null;
    }, [editor]);

    const toggleHighlight = React.useCallback(
        (color: string) => {
            if (!markAvailable || !editor) return;
            if (color === "none") {
                editor.chain().focus().unsetMark("highlight").run();
            } else {
                editor.chain().focus().toggleMark("highlight", { color }).run();
            }
        },
        [markAvailable, editor],
    );

    return {
        markAvailable,
        getActiveColor,
        toggleHighlight,
    };
};

export const HighlighterButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button> & {
        showTooltip?: boolean;
        isActive: boolean;
        isDisabled: boolean;
        children?: React.ReactNode;
    }
>(({ className, children, showTooltip = true, isActive, isDisabled, ...props }, ref) => {
    if (!showTooltip) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="icon"
                role="button"
                aria-label="Highlight text"
                tabIndex={-1}
                className={cn(
                    "size-8 cursor-pointer",
                    isActive && "bg-accent text-accent-foreground dark:bg-accent/50",
                    className,
                )}
                disabled={isDisabled}
                ref={ref}
                {...props}
            >
                {children || <HighlighterIcon className="size-4 pointer-events-none shrink-0" />}
            </Button>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        role="button"
                        aria-label="Highlight text"
                        tabIndex={-1}
                        className={cn(
                            "size-8 cursor-pointer",
                            isActive && "bg-accent text-accent-foreground dark:bg-accent/50",
                            className,
                        )}
                        disabled={isDisabled}
                        ref={ref}
                        {...props}
                    >
                        {children || (
                            <HighlighterIcon className="size-4 pointer-events-none shrink-0" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="flex flex-col justify-center items-center">
                    <span>Highlighter</span>
                    <Shortcut shortcutKey="Ctrl-Shift-H" />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
});

export function HighlightContent({
    editor: providedEditor,
    colors = DEFAULT_HIGHLIGHT_COLORS,
    onClose,
}: {
    editor?: Editor | null;
    colors?: HighlightColor[];
    onClose?: () => void;
}) {
    const editor = useTiptapEditor(providedEditor);

    const containerRef = React.useRef<HTMLDivElement>(null);

    const { getActiveColor, toggleHighlight } = useHighlighter(editor);
    const activeColor = getActiveColor();

    const menuItems = React.useMemo(
        () => [...colors, { label: "Remove highlight", value: "none" }],
        [colors],
    );

    const { selectedIndex } = useMenuNavigation({
        containerRef,
        items: menuItems,
        orientation: "both",
        onSelect: (item) => {
            toggleHighlight(item.value);
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
                            "size-8 cursor-pointer",
                            (activeColor === color.value || selectedIndex === index) &&
                                "bg-accent text-accent-foreground dark:bg-accent/50",
                        )}
                        aria-label={`${color.label} highlight color`}
                        tabIndex={index === selectedIndex ? 0 : -1}
                        onClick={() => toggleHighlight(color.value)}
                    >
                        <span
                            className="rounded-full size-5"
                            style={
                                {
                                    backgroundColor: color.value,
                                    border: `2px solid ${color.border}`,
                                } as React.CSSProperties
                            }
                        />
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
                        "size-8 cursor-pointer",
                        selectedIndex === colors.length &&
                            "bg-accent text-accent-foreground dark:bg-accent/50",
                    )}
                    onClick={() => toggleHighlight("none")}
                    aria-label="Remove highlight"
                    tabIndex={selectedIndex === colors.length ? 0 : -1}
                >
                    <BanIcon className="size-4 pointer-events-none shrink-0" />
                </Button>
            </div>
        </div>
    );
}

export interface HighlightPopoverProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * The highlight colors to display in the popover.
     */
    colors?: HighlightColor[];
    /**
     * Whether to hide the highlight popover.
     */
    hideWhenUnavailable?: boolean;
}

export function HighlightPopover({
    editor: providedEditor,
    colors = DEFAULT_HIGHLIGHT_COLORS,
    hideWhenUnavailable = false,
    ...props
}: HighlightPopoverProps) {
    const editor = useTiptapEditor(providedEditor);

    const { markAvailable } = useHighlighter(editor);
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
            return editor.can().setMark("highlight");
        } catch {
            return false;
        }
    }, [editor, markAvailable]);

    const isActive = editor?.isActive("highlight") ?? false;

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
                <HighlighterButton
                    isDisabled={isDisabled}
                    isActive={isActive}
                    aria-pressed={isActive}
                    {...props}
                />
            </PopoverTrigger>

            <PopoverContent
                aria-label="Highlight colors"
                className="w-full h-12 py-0 flex items-center justify-center rounded-full "
            >
                <HighlightContent
                    editor={editor}
                    colors={colors}
                    onClose={() => setIsOpen(false)}
                />
            </PopoverContent>
        </Popover>
    );
}

HighlighterButton.displayName = "HighlighterButton";
