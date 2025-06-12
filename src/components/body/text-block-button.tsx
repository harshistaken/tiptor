import * as React from "react";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { CustomButton } from "../common/custom-button";
import { ShortcutKey } from "../common/shortcut-key";
import { type TextBlockType, useTextBlockState } from "@/utils/text-block";
import { CustomDropdownItem, CustomDropdownShortcut } from "../common/custom-dropdown";
import { useResolvedEditor } from "@/providers/editor-provider";
import { CustomTooltip } from "../common/custom-tooltip";

// --- Types & Interfaces ---

type BaseTextBlockElementProps = {
    editor?: Editor | null;
    textBlockType: TextBlockType;
    text?: string;
    hide?: boolean;
    className?: string;
    disabled?: boolean;
};

interface TextBlockDropdownItemProps
    extends BaseTextBlockElementProps,
        Omit<React.ComponentProps<typeof CustomDropdownItem>, "type"> {}

interface TextBlockButtonProps
    extends BaseTextBlockElementProps,
        Omit<React.ComponentProps<typeof CustomButton>, "type"> {
    buttonType: "icon" | "default";
    isTooltip?: boolean;
}

// --- Components ---

export const TextBlockButton = React.forwardRef<HTMLButtonElement, TextBlockButtonProps>(
    (
        {
            editor: providedEditor,
            textBlockType,
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

        const { isDisabled, isActive, shouldShow, handleToggle, Icon, shortcutKey, label } = useTextBlockState(
            editor,
            textBlockType,
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
                aria-label={textBlockType}
                aria-pressed={isActive}
                tabIndex={-1}
                disabled={isDisabled}
                onClick={handleClick}
                className={cn(isActive && "bg-accent text-accent-foreground dark:bg-accent/50", className)}
                ref={ref}
                {...buttonProps}
            >
                <Icon className={textBlockType === "p" ? "size-3" : "size-4"} />
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
                aria-label={textBlockType}
                aria-pressed={isActive}
                tabIndex={-1}
                disabled={isDisabled}
                onClick={handleClick}
                className={cn(isActive && "bg-accent text-accent-foreground dark:bg-accent/50", className)}
                ref={ref}
                {...buttonProps}
            >
                <Icon className={textBlockType === "p" ? "mr-1 size-3" : "size-4"} />
                <span>{text ? text : label}</span>
            </CustomButton>
        );
    },
);
TextBlockButton.displayName = "TextBlockButton";

export const TextBlockButtonDropdownItem = React.forwardRef<HTMLDivElement, TextBlockDropdownItemProps>(
    (
        { editor: providedEditor, textBlockType, text, hide, className = "", disabled = false, onSelect, ...props },
        ref,
    ) => {
        const editor = useResolvedEditor(providedEditor);

        const { isDisabled, isActive, shouldShow, handleToggle, Icon, shortcutKey, label } = useTextBlockState(
            editor,
            textBlockType,
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
                <Icon className={textBlockType === "p" ? "mr-1 size-3" : "size-4"} />
                <span>{text ? text : label}</span>
                {shortcutKey && (
                    <CustomDropdownShortcut className="text-secondary">
                        <ShortcutKey shortcutKey={shortcutKey} />
                    </CustomDropdownShortcut>
                )}
            </CustomDropdownItem>
        );
    },
);
