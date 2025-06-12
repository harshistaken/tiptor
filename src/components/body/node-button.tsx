import * as React from "react";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { CustomButton } from "../common/custom-button";
import { CustomDropdownItem, CustomDropdownShortcut } from "@/components/common/custom-dropdown";
import { useResolvedEditor } from "@/providers/editor-provider";
import { ShortcutKey } from "../common/shortcut-key";
import { type NodeType, useNodeState } from "@/utils/node";
import { CustomTooltip } from "../common/custom-tooltip";

// Types & Interfaces

type BaseNodeElementProps = {
    editor?: Editor | null;
    nodeType: NodeType;
    text?: string;
    hide?: boolean;
    className?: string;
    disabled?: boolean;
};

interface NodeDropdownItemProps
    extends BaseNodeElementProps,
        Omit<React.ComponentProps<typeof CustomDropdownItem>, "type"> {}

interface NodeButtonProps extends BaseNodeElementProps, Omit<React.ComponentProps<typeof CustomButton>, "type"> {
    buttonType: "icon" | "default";
    isTooltip?: boolean;
}

// Components

export const NodeButton = React.forwardRef<HTMLButtonElement, NodeButtonProps>(
    (
        {
            editor: providedEditor,
            nodeType,
            text,
            buttonType,
            hide,
            className,
            disabled,
            onClick,
            variant = "ghost",
            isTooltip = false,
            ...buttonProps
        },
        ref,
    ) => {
        const editor = useResolvedEditor(providedEditor);

        const { isDisabled, isActive, shouldShow, handleToggle, Icon, shortcutKey, label } = useNodeState(
            editor,
            nodeType,
            disabled,
            hide,
        );

        const handleClick = React.useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(e);

                if (!e.defaultPrevented && !isDisabled) {
                    handleToggle();
                }
            },
            [onClick, isDisabled, handleToggle],
        );

        if (!shouldShow) {
            return null;
        }

        // Icon button component
        const IconButtonComponent = (
            <CustomButton
                variant={variant}
                size="icon"
                role="button"
                aria-label={nodeType}
                aria-pressed={isActive}
                tabIndex={-1}
                disabled={isDisabled}
                onClick={handleClick}
                className={cn(isActive && "bg-accent text-accent-foreground dark:bg-accent/50", className)}
                ref={ref}
                {...buttonProps}
            >
                <Icon />
            </CustomButton>
        );

        if (buttonType === "icon") {
            if (isTooltip) {
                return (
                    <CustomTooltip
                        tooltipTrigger={IconButtonComponent}
                        tooltipContent={
                            <>
                                <span>{text ? text : label}</span>
                                {shortcutKey && <ShortcutKey shortcutKey={shortcutKey} />}
                            </>
                        }
                    />
                );
            } else {
                return IconButtonComponent;
            }
        }

        // Default button component
        return (
            <CustomButton
                variant={variant}
                size="sm"
                role="button"
                aria-label={nodeType}
                aria-pressed={isActive}
                tabIndex={-1}
                disabled={isDisabled}
                onClick={handleClick}
                className={cn(isActive && "bg-accent text-accent-foreground dark:bg-accent/50", className)}
                ref={ref}
                {...buttonProps}
            >
                <Icon />
                <span>{text ? text : label}</span>
            </CustomButton>
        );
    },
);
NodeButton.displayName = "NodeButton";

export const NodeButtonDropdownItem = React.forwardRef<HTMLDivElement, NodeDropdownItemProps>(
    ({ editor: providedEditor, nodeType, text, hide, className = "", disabled = false, onSelect, ...props }, ref) => {
        const editor = useResolvedEditor(providedEditor);

        const { isDisabled, isActive, shouldShow, handleToggle, Icon, shortcutKey, label } = useNodeState(
            editor,
            nodeType,
            disabled,
            hide,
        );

        const handleSelect = React.useCallback(
            (e: Event) => {
                onSelect?.(e);

                if (!e.defaultPrevented && !isDisabled) {
                    handleToggle();
                }
            },
            [onSelect, isDisabled, handleToggle],
        );

        if (!shouldShow) {
            return null;
        }

        // Dropdown-item component
        return (
            <CustomDropdownItem
                ref={ref}
                className={cn(isActive && "bg-accent text-accent-foreground", className)}
                disabled={isDisabled}
                onSelect={handleSelect}
                {...props}
            >
                <Icon />
                <span>{text ? text : label}</span>
                {shortcutKey && (
                    <CustomDropdownShortcut>
                        <ShortcutKey shortcutKey={shortcutKey} />
                    </CustomDropdownShortcut>
                )}
            </CustomDropdownItem>
        );
    },
);
