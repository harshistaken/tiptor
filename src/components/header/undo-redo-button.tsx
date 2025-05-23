import * as React from "react";
import { type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { Icons } from "@/assets/icons";

// --- UI Primitives ---
import { cn } from "@/lib/utils";
import {
    DropdownMenuItem,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Shortcut } from "../common/shortcut";

export type HistoryAction = "undo" | "redo";

export interface UndoRedoDropdownItemProps
    extends React.ComponentProps<typeof DropdownMenuItem> {
    editor?: Editor | null;
    action: HistoryAction;
    showTooltip?: boolean;
}

export const historyIcons = {
    undo: Icons.MaterialUndo,
    redo: Icons.MaterialRedo,
};

export const historyShortcutKeys: Partial<Record<HistoryAction, string>> = {
    undo: "Ctrl-z",
    redo: "Ctrl-Shift-z",
};

export const historyLabels: Record<HistoryAction, string> = {
    undo: "Undo",
    redo: "Redo",
};

export function canExecuteHistoryAction(
    editor: Editor | null,
    action: HistoryAction,
): boolean {
    if (!editor) return false;
    return action === "undo" ? editor.can().undo() : editor.can().redo();
}

export function executeHistoryAction(
    editor: Editor | null,
    action: HistoryAction,
): boolean {
    if (!editor) return false;
    const chain = editor.chain().focus();
    return action === "undo" ? chain.undo().run() : chain.redo().run();
}

export function isHistoryActionDisabled(
    editor: Editor | null,
    action: HistoryAction,
    userDisabled: boolean = false,
): boolean {
    if (userDisabled) return true;
    return !canExecuteHistoryAction(editor, action);
}

export function useHistoryAction(
    providedEditor: Editor | null,
    action: HistoryAction,
    disabled: boolean = false,
) {
    const editor = useTiptapEditor(providedEditor);

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
    const label = historyLabels[action];
    const shortcutKey = historyShortcutKeys[action];

    return {
        canExecute,
        isDisabled,
        handleAction,
        Icon,
        label,
        shortcutKey,
    };
}

export const UndoRedoDropdownItem = React.forwardRef<
    HTMLDivElement,
    UndoRedoDropdownItemProps
>(
    (
        {
            editor: providedEditor,
            action,
            className = "",
            disabled,
            onSelect,
            children,
            ...props
        },
        ref,
    ) => {
        const editor = useTiptapEditor(providedEditor);

        const { isDisabled, handleAction, Icon, label, shortcutKey } =
            useHistoryAction(editor, action, disabled);

        const handleSelect = React.useCallback(
            (e: Event) => {
                onSelect?.(e);

                if (!e.defaultPrevented && !disabled) {
                    handleAction();
                }
            },
            [onSelect, disabled, handleAction],
        );

        if (!editor || !editor.isEditable) {
            return null;
        }

        return (
            <DropdownMenuItem
                className={cn("h-7 cursor-pointer", className)}
                role="button"
                aria-label={label}
                tabIndex={-1}
                disabled={isDisabled}
                onSelect={handleSelect}
                ref={ref}
                {...props}
            >
                {children || (
                    <>
                        <Icon className="pointer-events-none size-5 shrink-0 text-inherit" />
                        <span>{label}</span>
                        {shortcutKey && (
                            <DropdownMenuShortcut className="text-secondary">
                                <Shortcut shortcutKey={shortcutKey} />
                            </DropdownMenuShortcut>
                        )}
                    </>
                )}
            </DropdownMenuItem>
        );
    },
);

UndoRedoDropdownItem.displayName = "UndoRedoDropdownItem";

export default UndoRedoDropdownItem;
