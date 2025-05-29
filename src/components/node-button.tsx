import * as React from "react";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

import { Button } from "@/components/ui/button";
import { Shortcut } from "@/components/common/shortcut";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { type NodeType, useNodeState } from "@/utils/tiptap/node";

export interface NodeButtonProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    editor?: Editor | null;
    nodeType: NodeType;
    text?: string;
    buttonType: "dropdown-item" | "icon" | "default";
    hide?: boolean;
    className?: string;
    disabled?: boolean;
    isTooltip?: boolean;
}

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
        const editor = useTiptapEditor(providedEditor);

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

        if (buttonType === "icon") {
            if (isTooltip) {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={variant}
                                    size="icon"
                                    role="button"
                                    aria-label={nodeType}
                                    aria-pressed={isActive}
                                    tabIndex={-1}
                                    disabled={isDisabled}
                                    onClick={handleClick}
                                    className={cn(
                                        isActive && "bg-accent text-accent-foreground dark:bg-accent/50",
                                        className,
                                    )}
                                    ref={ref}
                                    {...buttonProps}
                                >
                                    <Icon className="pointer-events-none size-4 shrink-0" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="flex flex-col items-center justify-center">
                                <span>{text ? text : label}</span>
                                {shortcutKey && <Shortcut shortcutKey={shortcutKey} />}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            } else {
                return (
                    <Button
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
                        <Icon className="pointer-events-none size-4 shrink-0" />
                    </Button>
                );
            }
        }

        return (
            <Button
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
                <Icon className="pointer-events-none size-4 shrink-0" />
                <span>{text ? text : label}</span>
            </Button>
        );
    },
);
NodeButton.displayName = "NodeButton";
export interface NodeButtonDropdownItemProps extends Omit<React.ComponentProps<typeof DropdownMenuItem>, "type"> {
    editor?: Editor | null;
    nodeType: NodeType;
    text?: string;
    hide?: boolean;
    className?: string;
    disabled?: boolean;
}

export const NodeButtonDropdownItem = React.forwardRef<HTMLDivElement, NodeButtonDropdownItemProps>(
    ({ editor: providedEditor, nodeType, text, hide, className = "", disabled = false, onSelect, ...props }, ref) => {
        const editor = useTiptapEditor(providedEditor);

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
