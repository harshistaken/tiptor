import * as React from "react";
import { type Editor } from "@tiptap/react";
import { ShortcutKey } from "@/components/common/shortcut-key";
import { CustomDropdownItem, CustomDropdownShortcut } from "@/components/common/custom-dropdown";
import { useHistoryAction, type HistoryAction } from "@/utils/history";
import { useResolvedEditor } from "@/hooks/use-resolved-editor";

export interface HistoryActionDropdownItemProps extends React.ComponentProps<typeof CustomDropdownItem> {
    editor?: Editor | null;
    action: HistoryAction;
}

export const HistoryActionDropdownItem = React.forwardRef<HTMLDivElement, HistoryActionDropdownItemProps>(
    ({ editor: providedEditor, action, className = "", disabled = false, onSelect, ...props }, ref) => {
        const editor = useResolvedEditor(providedEditor);

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
            <CustomDropdownItem
                className={className}
                role="button"
                aria-label={label}
                tabIndex={-1}
                disabled={isDisabled}
                onSelect={handleSelect}
                ref={ref}
                {...props}
            >
                <Icon />
                <span>{label}</span>
                {shortcutKey && (
                    <CustomDropdownShortcut>
                        <ShortcutKey shortcutKey={shortcutKey} />
                    </CustomDropdownShortcut>
                )}
            </CustomDropdownItem>
        );
    },
);
