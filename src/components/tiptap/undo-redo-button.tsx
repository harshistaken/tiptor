import * as React from "react";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { Undo2Icon, Redo2Icon } from "lucide-react";

// --- UI Primitives ---
import { cn } from "@/lib/utils";
import { Shortcut } from "./shortcut";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type HistoryAction = "undo" | "redo";

/**
 * Props for the UndoRedoButton component.
 */
export interface UndoRedoButtonProps extends React.ComponentProps<typeof Button> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * Optional text to display alongside the icon.
     */
    text?: string;
    /**
     * The history action to perform (undo or redo).
     */
    action: HistoryAction;
    /**
     * Whether tooltip should be shown
     */
    showTooltip?: boolean;
}

export const historyIcons = {
    undo: Undo2Icon,
    redo: Redo2Icon,
};

export const historyShortcutKeys: Partial<Record<HistoryAction, string>> = {
    undo: "Ctrl-z",
    redo: "Ctrl-Shift-z",
};

export const historyActionLabels: Record<HistoryAction, string> = {
    undo: "Undo",
    redo: "Redo",
};

/**
 * Checks if a history action can be executed.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to check
 * @returns Whether the action can be executed
 */
export function canExecuteHistoryAction(editor: Editor | null, action: HistoryAction): boolean {
    if (!editor) return false;
    return action === "undo" ? editor.can().undo() : editor.can().redo();
}

/**
 * Executes a history action on the editor.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to execute
 * @returns Whether the action was executed successfully
 */
export function executeHistoryAction(editor: Editor | null, action: HistoryAction): boolean {
    if (!editor) return false;
    const chain = editor.chain().focus();
    return action === "undo" ? chain.undo().run() : chain.redo().run();
}

/**
 * Determines if a history action should be disabled.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to check
 * @param userDisabled Whether the action is explicitly disabled by the user
 * @returns Whether the action should be disabled
 */
export function isHistoryActionDisabled(
    editor: Editor | null,
    action: HistoryAction,
    userDisabled: boolean = false,
): boolean {
    if (userDisabled) return true;
    return !canExecuteHistoryAction(editor, action);
}

/**
 * Hook that provides all the necessary state and handlers for a history action.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to handle
 * @param disabled Whether the action is explicitly disabled
 * @returns Object containing state and handlers for the history action
 */
export function useHistoryAction(
    editor: Editor | null,
    action: HistoryAction,
    disabled: boolean = false,
) {
    const canExecute = React.useMemo(
        () => canExecuteHistoryAction(editor, action),
        [editor, action],
    );

    const isDisabled = isHistoryActionDisabled(editor, action, disabled);

    const handleAction = React.useCallback(() => {
        if (!editor || isDisabled) return;
        executeHistoryAction(editor, action);
    }, [editor, action, isDisabled]);

    const Icon = historyIcons[action];
    const actionLabel = historyActionLabels[action];
    const shortcutKey = historyShortcutKeys[action];

    return {
        canExecute,
        isDisabled,
        handleAction,
        Icon,
        actionLabel,
        shortcutKey,
    };
}

/**
 * Button component for triggering undo/redo actions in a TipTap editor.
 */
export const UndoRedoButton = React.forwardRef<HTMLButtonElement, UndoRedoButtonProps>(
    (
        {
            editor: providedEditor,
            action,
            text,
            className = "",
            showTooltip = true,
            disabled,
            onClick,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const editor = useTiptapEditor(providedEditor);

        const { isDisabled, handleAction, Icon, actionLabel, shortcutKey } = useHistoryAction(
            editor,
            action,
            disabled,
        );

        const handleClick = React.useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(e);

                if (!e.defaultPrevented && !disabled) {
                    handleAction();
                }
            },
            [onClick, disabled, handleAction],
        );

        if (!editor || !editor.isEditable) {
            return null;
        }

        if (!showTooltip || !actionLabel) {
            return (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    role="button"
                    aria-label={actionLabel}
                    tabIndex={-1}
                    className={cn("size-8 cursor-pointer", className)}
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
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            role="button"
                            aria-label={actionLabel}
                            tabIndex={-1}
                            className={cn("size-8 cursor-pointer", className)}
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
                        <span>{actionLabel}</span>
                        {shortcutKey && <Shortcut shortcutKey={shortcutKey} />}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    },
);

UndoRedoButton.displayName = "UndoRedoButton";

export default UndoRedoButton;
