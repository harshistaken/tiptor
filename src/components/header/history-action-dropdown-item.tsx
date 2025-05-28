import * as React from "react";
import { type Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { useHistoryAction, type HistoryAction } from "@/utils/tiptap/history";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Shortcut } from "../common/shortcut";

export interface HistoryActionDropdownItemProps extends React.ComponentProps<typeof DropdownMenuItem> {
    editor?: Editor | null;
    action: HistoryAction;
}

export const HistoryActionDropdownItem = React.forwardRef<HTMLDivElement, HistoryActionDropdownItemProps>(
    ({ editor: providedEditor, action, className = "", disabled = false, onSelect, ...props }, ref) => {
        const editor = useTiptapEditor(providedEditor);

        const { isDisabled, handleAction, Icon, label, shortcutKey } = useHistoryAction(editor, action, disabled);

        const handleSelect = React.useCallback(
            (e: Event) => {
                onSelect?.(e);

                if (!e.defaultPrevented && !disabled) {
                    handleAction();
                }
            },
            [onSelect, disabled, handleAction],
        );

        if (!editor) {
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
                <Icon className="size-5" />
                <span>{label}</span>
                {shortcutKey && (
                    <DropdownMenuShortcut className="text-secondary">
                        <Shortcut shortcutKey={shortcutKey} />
                    </DropdownMenuShortcut>
                )}
            </DropdownMenuItem>
        );
    },
);
