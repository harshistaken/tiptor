import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import {
    BoldIcon,
    CodeIcon,
    ItalicIcon,
    StrikethroughIcon,
    SubscriptIcon,
    SuperscriptIcon,
    UnderlineIcon,
} from "lucide-react";

// --- Lib ---
import { cn, isMarkInSchema } from "@/lib/utils";

// --- Ui ---
import { Shortcut } from "./shortcut";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type Mark =
    | "bold"
    | "italic"
    | "strike"
    | "code"
    | "underline"
    | "superscript"
    | "subscript";

export interface MarkButtonProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    /**
     * The type of mark to toggle
     */
    type: Mark;
    /**
     * Optional editor instance. If not provided, will use editor from context
     */
    editor?: Editor | null;
    /**
     * Display text for the button (optional)
     */
    text?: string;
    /**
     * Whether this button should be hidden when the mark is not available
     */
    hideWhenUnavailable?: boolean;
    /**
     * Whether tooltip should be shown
     */
    showTooltip?: boolean;
}

export const markIcons = {
    bold: BoldIcon,
    italic: ItalicIcon,
    underline: UnderlineIcon,
    strike: StrikethroughIcon,
    code: CodeIcon,
    superscript: SuperscriptIcon,
    subscript: SubscriptIcon,
};

export const markShortcutKeys: Partial<Record<Mark, string>> = {
    bold: "Ctrl-b",
    italic: "Ctrl-i",
    underline: "Ctrl-u",
    strike: "Ctrl-Shift-s",
    code: "Ctrl-e",
    superscript: "Ctrl-.",
    subscript: "Ctrl-,",
};

export function canToggleMark(editor: Editor | null, type: Mark): boolean {
    if (!editor) return false;

    try {
        return editor.can().toggleMark(type);
    } catch {
        return false;
    }
}

export function isMarkActive(editor: Editor | null, type: Mark): boolean {
    if (!editor) return false;
    return editor.isActive(type);
}

export function toggleMark(editor: Editor | null, type: Mark): void {
    if (!editor) return;
    editor.chain().focus().toggleMark(type).run();
}

export function isMarkButtonDisabled(
    editor: Editor | null,
    type: Mark,
    userDisabled: boolean = false,
): boolean {
    if (!editor) return true;
    if (userDisabled) return true;
    if (editor.isActive("codeBlock")) return true;
    if (!canToggleMark(editor, type)) return true;
    return false;
}

export function shouldShowMarkButton(params: {
    editor: Editor | null;
    type: Mark;
    hideWhenUnavailable: boolean;
    markInSchema: boolean;
}): boolean {
    const { editor, type, hideWhenUnavailable, markInSchema } = params;

    if (!markInSchema) {
        return false;
    }

    if (hideWhenUnavailable) {
        if (isNodeSelection(editor?.state.selection) || !canToggleMark(editor, type)) {
            return false;
        }
    }

    return true;
}

export function getFormattedMarkName(type: Mark): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

export function useMarkState(editor: Editor | null, type: Mark, disabled: boolean = false) {
    const markInSchema = isMarkInSchema(type, editor);
    const isDisabled = isMarkButtonDisabled(editor, type, disabled);
    const isActive = isMarkActive(editor, type);

    const Icon = markIcons[type];
    const shortcutKey = markShortcutKeys[type];
    const formattedName = getFormattedMarkName(type);

    return {
        markInSchema,
        isDisabled,
        isActive,
        Icon,
        shortcutKey,
        formattedName,
    };
}

export const MarkButton = React.forwardRef<HTMLButtonElement, MarkButtonProps>(
    (
        {
            editor: providedEditor,
            type,
            text,
            hideWhenUnavailable = false,
            showTooltip = true,
            className = "",
            disabled,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const editor = useTiptapEditor(providedEditor);

        const { markInSchema, isDisabled, isActive, Icon, shortcutKey, formattedName } =
            useMarkState(editor, type, disabled);

        const handleClick = React.useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(e);

                if (!e.defaultPrevented && !isDisabled && editor) {
                    toggleMark(editor, type);
                }
            },
            [onClick, isDisabled, editor, type],
        );

        const show = React.useMemo(() => {
            return shouldShowMarkButton({
                editor,
                type,
                hideWhenUnavailable,
                markInSchema,
            });
        }, [editor, type, hideWhenUnavailable, markInSchema]);

        if (!show || !editor || !editor.isEditable) {
            return null;
        }

        if (!showTooltip || !formattedName) {
            return (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    role="button"
                    aria-label={type}
                    aria-pressed={isActive}
                    tabIndex={-1}
                    className={cn(
                        "size-8 cursor-pointer text-foreground/70",
                        isActive && "bg-accent text-accent-foreground dark:bg-accent/30",
                        className,
                    )}
                    disabled={isDisabled}
                    onClick={handleClick}
                    ref={ref}
                    {...buttonProps}
                >
                    {children || (
                        <>
                            <Icon className="size-4 pointer-events-none shrink-0" />
                            {text && <span className="font-normal">{text}</span>}
                        </>
                    )}
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
                            aria-label={type}
                            aria-pressed={isActive}
                            tabIndex={-1}
                            className={cn(
                                "size-8 cursor-pointer text-foreground/70",
                                isActive && "bg-accent text-accent-foreground dark:bg-accent/30",
                                className,
                            )}
                            disabled={isDisabled}
                            onClick={handleClick}
                            ref={ref}
                            {...buttonProps}
                        >
                            {children || (
                                <>
                                    <Icon className="size-4 pointer-events-none shrink-0" />
                                    {text && <span className="font-normal">{text}</span>}
                                </>
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col justify-center items-center">
                        <span>{formattedName}</span>
                        {shortcutKey && <Shortcut shortcutKey={shortcutKey} />}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    },
);

MarkButton.displayName = "MarkButton";

export default MarkButton;
