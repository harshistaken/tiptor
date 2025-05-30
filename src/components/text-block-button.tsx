import * as React from "react";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { Button } from "@/components/ui/button";
import { Shortcut } from "@/components/common/shortcut";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type TextBlockType, useTextBlockState } from "@/utils/tiptap/text-block";

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
        Omit<React.ComponentProps<typeof DropdownMenuItem>, "type"> {}

interface TextBlockButtonProps extends BaseTextBlockElementProps, Omit<React.ComponentProps<typeof Button>, "type"> {
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
        const editor = useTiptapEditor(providedEditor);

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
            <Button
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
                <Icon className="pointer-events-none size-4 shrink-0" />
            </Button>
        );

        if (buttonType === "icon") {
            if (isTooltip) {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>{IconButtonComponent}</TooltipTrigger>
                            <TooltipContent className="flex flex-col items-center justify-center">
                                <span>{text ? text : label}</span>
                                {shortcutKey && <Shortcut shortcutKey={shortcutKey} />}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            } else {
                return IconButtonComponent;
            }
        }

        // Default button component
        return (
            <Button
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
                <Icon className="pointer-events-none size-4 shrink-0" />
                <span>{text ? text : label}</span>
            </Button>
        );
    },
);
TextBlockButton.displayName = "TextBlockButton";

export const TextBlockButtonDropdownItem = React.forwardRef<HTMLDivElement, TextBlockDropdownItemProps>(
    (
        { editor: providedEditor, textBlockType, text, hide, className = "", disabled = false, onSelect, ...props },
        ref,
    ) => {
        const editor = useTiptapEditor(providedEditor);

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
            <DropdownMenuItem
                ref={ref}
                className={cn("h-7", isActive && "bg-accent text-accent-foreground", className)}
                disabled={isDisabled}
                onSelect={handleSelect}
                {...props}
            >
                <Icon className="pointer-events-none size-4 shrink-0" />
                <span>{text ? text : label}</span>
                {shortcutKey && (
                    <DropdownMenuShortcut className="text-secondary">
                        <Shortcut shortcutKey={shortcutKey} />
                    </DropdownMenuShortcut>
                )}
            </DropdownMenuItem>
        );
    },
);
