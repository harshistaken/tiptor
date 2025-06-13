import * as React from "react";
import { type Editor } from "@tiptap/react";
import { Redo2Icon, Undo2Icon } from "lucide-react";
import { useResolvedEditor } from "@/hooks/use-resolved-editor";

export type HistoryAction = "undo" | "redo";

export const historyIcons: Record<HistoryAction, React.ElementType> = {
    undo: Undo2Icon,
    redo: Redo2Icon,
};

export const historyShortcutKeys: Partial<Record<HistoryAction, string>> = {
    undo: "Ctrl-z",
    redo: "Ctrl-Shift-z",
};

export const historyLabels: Record<HistoryAction, string> = {
    undo: "Undo",
    redo: "Redo",
};

export function canExecuteHistoryAction(editor: Editor | null, action: HistoryAction): boolean {
    if (!editor) return false;
    return action === "undo" ? editor.can().undo() : editor.can().redo();
}

export function executeHistoryAction(editor: Editor | null, action: HistoryAction): boolean {
    if (!editor) return false;
    const editorChain = editor.chain().focus();
    return action === "undo" ? editorChain.undo().run() : editorChain.redo().run();
}

export function isHistoryActionDisabled(
    editor: Editor | null,
    action: HistoryAction,
    disabled: boolean = false,
): boolean {
    if (disabled) {
        return true;
    }
    if (!editor || !editor.isEditable) {
        return true;
    }
    return !canExecuteHistoryAction(editor, action);
}

export function useHistoryAction(providedEditor: Editor | null, action: HistoryAction, disabled: boolean = false) {
    const editor = useResolvedEditor(providedEditor);

    const canExecute = React.useMemo(() => canExecuteHistoryAction(editor, action), [editor, action]);

    const isDisabled = React.useMemo(
        () => isHistoryActionDisabled(editor, action, disabled),
        [editor, action, disabled],
    );

    const handleAction = React.useCallback(() => {
        if (!editor || isDisabled) return;
        executeHistoryAction(editor, action);
    }, [editor, action, isDisabled]);

    const IconComponent = historyIcons[action];
    const actionLabel = historyLabels[action];
    const keyboardShortcut = historyShortcutKeys[action];

    return {
        canExecute,
        isDisabled,
        handleAction,
        Icon: IconComponent,
        label: actionLabel,
        shortcutKey: keyboardShortcut,
    };
}
