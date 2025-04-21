import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { LinkIcon, Trash2Icon, CheckIcon } from "lucide-react";

// --- Lib ---
import { cn, isMarkInSchema } from "@/lib/utils";

// --- UI Primitives ---
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface LinkHandlerProps {
    editor: Editor | null;
    onSetLink?: () => void;
    onLinkActive?: () => void;
}

export interface LinkMainProps {
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
    setLink: () => void;
    removeLink: () => void;
    isActive: boolean;
}

export const useLinkHandler = (props: LinkHandlerProps) => {
    const { editor, onSetLink, onLinkActive } = props;
    const [url, setUrl] = React.useState<string>("");

    React.useEffect(() => {
        if (!editor) return;

        // Get URL immediately on mount
        const { href } = editor.getAttributes("link");

        if (editor.isActive("link") && !url) {
            setUrl(href || "");
            onLinkActive?.();
        }
    }, [editor, onLinkActive, url]);

    React.useEffect(() => {
        if (!editor) return;

        const updateLinkState = () => {
            const { href } = editor.getAttributes("link");
            setUrl(href || "");

            if (editor.isActive("link") && !url) {
                onLinkActive?.();
            }
        };

        editor.on("selectionUpdate", updateLinkState);
        return () => {
            editor.off("selectionUpdate", updateLinkState);
        };
    }, [editor, onLinkActive, url]);

    const setLink = React.useCallback(() => {
        if (!url || !editor) return;

        const { from, to } = editor.state.selection;
        const text = editor.state.doc.textBetween(from, to);

        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .insertContent({
                type: "text",
                text: text || url,
                marks: [{ type: "link", attrs: { href: url } }],
            })
            .run();

        onSetLink?.();
    }, [editor, onSetLink, url]);

    const removeLink = React.useCallback(() => {
        if (!editor) return;
        editor
            .chain()
            .focus()
            .unsetMark("link", { extendEmptyMarkRange: true })
            .setMeta("preventAutolink", true)
            .run();
        setUrl("");
    }, [editor]);

    return {
        url,
        setUrl,
        setLink,
        removeLink,
        isActive: editor?.isActive("link") || false,
    };
};

export const LinkButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<typeof Button> & {
        isActive?: boolean;
        isDisabled?: boolean;
        showTooltip?: boolean;
    }
>(({ className, children, showTooltip = true, isActive, isDisabled, ...props }, ref) => {
    if (!showTooltip) {
        return (
            <Button
                type="button"
                variant="ghost"
                size="icon"
                role="button"
                aria-label="LinkButton"
                tabIndex={-1}
                className={cn(
                    "size-8 cursor-pointer",
                    isActive && "bg-accent text-accent-foreground dark:bg-accent/50",
                    className,
                )}
                disabled={isDisabled}
                ref={ref}
                {...props}
            >
                {children || <LinkIcon className="size-4 pointer-events-none shrink-0" />}
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
                        aria-label="LinkButton"
                        tabIndex={-1}
                        className={cn(
                            "size-8 cursor-pointer",
                            isActive && "bg-accent text-accent-foreground dark:bg-accent/50",
                            className,
                        )}
                        disabled={isDisabled}
                        ref={ref}
                        {...props}
                    >
                        {children || <LinkIcon className="size-4 pointer-events-none shrink-0" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="flex flex-col justify-center items-center">
                    <span>Link</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
});

export const LinkContent: React.FC<{
    editor?: Editor | null;
}> = ({ editor: providedEditor }) => {
    const editor = useTiptapEditor(providedEditor);

    const linkHandler = useLinkHandler({
        editor: editor,
    });

    return <LinkMain {...linkHandler} />;
};

const LinkMain: React.FC<LinkMainProps> = ({ url, setUrl, setLink, removeLink, isActive }) => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            event.preventDefault();
            setLink();
        }
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Input
                name="link-input"
                type="url"
                placeholder="Paste a link..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                className="w-full outline-none border-none rounded-[calc(infinity_*_1px_-_0.375rem))] h-8 text-sm md:text-sm min-w-48 whitespace-nowrap overflow-ellipsis shadow-none"
            />
            <div className="flex items-center justify-center gap-[1px]">
                <Button
                    type="button"
                    role="button"
                    variant="ghost"
                    size="icon"
                    className={cn("size-8 cursor-pointer")}
                    disabled={!url && !isActive}
                    title="Apply link"
                    onClick={setLink}
                >
                    <CheckIcon className="size-4 pointer-events-none shrink-0" />
                </Button>

                <Button
                    type="button"
                    role="button"
                    variant="ghost"
                    size="icon"
                    className={cn("size-8 cursor-pointer text-destructive hover:text-destructive")}
                    title="Remove link"
                    disabled={!url && !isActive}
                    onClick={removeLink}
                >
                    <Trash2Icon className="size-4 pointer-events-none shrink-0" />
                </Button>
            </div>
        </div>
    );
};

export interface LinkPopoverProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * Whether to hide the link popover.
     * @default false
     */
    hideWhenUnavailable?: boolean;
    /**
     * Callback for when the popover opens or closes.
     */
    onOpenChange?: (isOpen: boolean) => void;
    /**
     * Whether to automatically open the popover when a link is active.
     * @default true
     */
    autoOpenOnLinkActive?: boolean;
}

export function LinkPopover({
    editor: providedEditor,
    hideWhenUnavailable = false,
    onOpenChange,
    autoOpenOnLinkActive = true,
    ...props
}: LinkPopoverProps) {
    const editor = useTiptapEditor(providedEditor);

    const linkInSchema = isMarkInSchema("link", editor);

    const [isOpen, setIsOpen] = React.useState(false);

    const onSetLink = () => {
        setIsOpen(false);
    };

    const onLinkActive = () => setIsOpen(autoOpenOnLinkActive);

    const linkHandler = useLinkHandler({
        editor: editor,
        onSetLink,
        onLinkActive,
    });

    const isDisabled = React.useMemo(() => {
        if (!editor) return true;
        if (editor.isActive("codeBlock")) return true;
        return !editor.can().setLink?.({ href: "" });
    }, [editor]);

    const canSetLink = React.useMemo(() => {
        if (!editor) return false;
        try {
            return editor.can().setMark("link");
        } catch {
            return false;
        }
    }, [editor]);

    const isActive = editor?.isActive("link") ?? false;

    const handleOnOpenChange = React.useCallback(
        (nextIsOpen: boolean) => {
            setIsOpen(nextIsOpen);
            onOpenChange?.(nextIsOpen);
        },
        [onOpenChange],
    );

    const show = React.useMemo(() => {
        if (!linkInSchema) {
            return false;
        }

        if (hideWhenUnavailable) {
            if (isNodeSelection(editor?.state.selection) || !canSetLink) {
                return false;
            }
        }

        return true;
    }, [linkInSchema, hideWhenUnavailable, editor, canSetLink]);

    if (!show || !editor || !editor.isEditable) {
        return null;
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
            <PopoverTrigger asChild>
                <LinkButton disabled={isDisabled} isActive={isActive} {...props} />
            </PopoverTrigger>

            <PopoverContent
                aria-label="Highlight colors"
                className="w-full h-12 py-0 pl-2 flex items-center justify-center rounded-full "
            >
                <LinkMain {...linkHandler} />
            </PopoverContent>
        </Popover>
    );
}

LinkButton.displayName = "LinkButton";
