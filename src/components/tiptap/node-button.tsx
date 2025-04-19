import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { TextQuoteIcon, TerminalIcon, MinusIcon } from "lucide-react";

// --- Lib ---
import { cn, isNodeInSchema } from "@/lib/utils";

// --- UI Primitives ---
import { Shortcut } from "./shortcut";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type NodeType = "codeBlock" | "blockquote" | "horizontalRule";

export interface NodeButtonProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * The type of node to toggle.
     */
    type: NodeType;
    /**
     * Optional text to display alongside the icon.
     */
    text?: string;
    /**
     * Whether the button should hide when the node is not available.
     * @default false
     */
    hideWhenUnavailable?: boolean;
    /**
     * Whether tooltip should be shown
     */
    showTooltip?: boolean;
}

export const nodeIcons = {
    codeBlock: TerminalIcon,
    blockquote: TextQuoteIcon,
    horizontalRule: MinusIcon,
};

export const nodeShortcutKeys: Partial<Record<NodeType, string>> = {
    codeBlock: "Ctrl-Alt-c",
    blockquote: "Ctrl-Shift-b",
};

export const nodeLabels: Record<NodeType, string> = {
    codeBlock: "Code Block",
    blockquote: "Blockquote",
    horizontalRule: "Divider",
};

export function canToggleNode(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;

    try {
        return type === "codeBlock"
            ? editor.can().toggleNode("codeBlock", "paragraph")
            : type === "horizontalRule"
            ? editor.can().setHorizontalRule()
            : editor.can().toggleWrap("blockquote");
    } catch {
        return false;
    }
}

export function isNodeActive(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;
    return editor.isActive(type);
}

export function toggleNode(editor: Editor | null, type: NodeType): boolean {
    if (!editor) return false;

    if (type === "codeBlock") {
        return editor.chain().focus().toggleNode("codeBlock", "paragraph").run();
    } else if (type === "horizontalRule") {
        return editor.chain().focus().setHorizontalRule().run();
    } else {
        return editor.chain().focus().toggleWrap("blockquote").run();
    }
}

export function isNodeButtonDisabled(
    editor: Editor | null,
    canToggle: boolean,
    userDisabled: boolean = false,
): boolean {
    if (!editor) return true;
    if (userDisabled) return true;
    if (!canToggle) return true;
    return false;
}

export function shouldShowNodeButton(params: {
    editor: Editor | null;
    type: NodeType;
    hideWhenUnavailable: boolean;
    nodeInSchema: boolean;
    canToggle: boolean;
}): boolean {
    const { editor, hideWhenUnavailable, nodeInSchema, canToggle } = params;

    if (!nodeInSchema) {
        return false;
    }

    if (hideWhenUnavailable) {
        if (isNodeSelection(editor?.state.selection) || !canToggle) {
            return false;
        }
    }

    return Boolean(editor?.isEditable);
}

export function formatNodeName(type: NodeType): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
}

export function useNodeState(
    editor: Editor | null,
    type: NodeType,
    disabled: boolean = false,
    hideWhenUnavailable: boolean = false,
) {
    const nodeInSchema = isNodeInSchema(type, editor);

    const canToggle = canToggleNode(editor, type);
    const isDisabled = isNodeButtonDisabled(editor, canToggle, disabled);
    const isActive = isNodeActive(editor, type);

    const shouldShow = React.useMemo(
        () =>
            shouldShowNodeButton({
                editor,
                type,
                hideWhenUnavailable,
                nodeInSchema,
                canToggle,
            }),
        [editor, type, hideWhenUnavailable, nodeInSchema, canToggle],
    );

    const handleToggle = React.useCallback(() => {
        if (!isDisabled && editor) {
            return toggleNode(editor, type);
        }
        return false;
    }, [editor, type, isDisabled]);

    const Icon = nodeIcons[type];
    const shortcutKey = nodeShortcutKeys[type];
    const label = nodeLabels[type];

    return {
        nodeInSchema,
        canToggle,
        isDisabled,
        isActive,
        shouldShow,
        handleToggle,
        Icon,
        shortcutKey,
        label,
    };
}

export const NodeButton = React.forwardRef<HTMLButtonElement, NodeButtonProps>(
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

        const { isDisabled, isActive, shouldShow, handleToggle, Icon, shortcutKey, label } =
            useNodeState(editor, type, disabled, hideWhenUnavailable);

        const handleClick = React.useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                onClick?.(e);

                if (!e.defaultPrevented && !isDisabled) {
                    handleToggle();
                }
            },
            [onClick, isDisabled, handleToggle],
        );

        if (!shouldShow || !editor || !editor.isEditable) {
            return null;
        }

        if (!showTooltip || !label) {
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
                        "size-8 cursor-pointer",
                        isActive && "bg-accent text-accent-foreground dark:bg-accent/50",
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
                                "size-8 cursor-pointer",
                                isActive && "bg-accent text-accent-foreground dark:bg-accent/50",
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
                        <span>{label}</span>
                        {shortcutKey && <Shortcut shortcutKey={shortcutKey} />}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    },
);

NodeButton.displayName = "NodeButton";

export default NodeButton;
