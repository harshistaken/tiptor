"use client";

import * as React from "react";
import { isNodeSelection, type Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// --- Icons ---
import { ChevronDown, ListIcon, ListOrderedIcon, ListTodoIcon } from "lucide-react";

// --- Lib ---
import { cn, isNodeInSchema } from "@/lib/utils";

// --- UI Primitives ---
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shortcut } from "./shortcut";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type ListType = "bulletList" | "orderedList" | "taskList";

export interface ListOption {
    label: string;
    type: ListType;
    icon: React.ElementType;
}

export interface ListDropdownMenuItemProps
    extends Omit<React.ComponentProps<typeof DropdownMenuItem>, "type"> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * The type of list to toggle.
     */
    type: ListType;
    /**
     * Optional text to display alongside the icon.
     */
    text?: string;
    /**
     * Whether the button should hide when the list is not available.
     * @default false
     */
    hideWhenUnavailable?: boolean;
}

export interface ListDropdownProps extends Omit<React.ComponentProps<typeof Button>, "type"> {
    /**
     * The TipTap editor instance.
     */
    editor?: Editor | null;
    /**
     * The list types to display in the dropdown.
     */
    types?: ListType[];
    /**
     * Whether the dropdown should be hidden when no list types are available
     * @default false
     */
    hideWhenUnavailable?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

export const listOptions: ListOption[] = [
    {
        label: "Bullet List",
        type: "bulletList",
        icon: ListIcon,
    },
    {
        label: "Ordered List",
        type: "orderedList",
        icon: ListOrderedIcon,
    },
    {
        label: "Task List",
        type: "taskList",
        icon: ListTodoIcon,
    },
];

export const listShortcutKeys: Record<ListType, string> = {
    bulletList: "Ctrl-Shift-8",
    orderedList: "Ctrl-Shift-7",
    taskList: "Ctrl-Shift-9",
};

export function canToggleList(editor: Editor | null, type: ListType): boolean {
    if (!editor) {
        return false;
    }

    switch (type) {
        case "bulletList":
            return editor.can().toggleBulletList();
        case "orderedList":
            return editor.can().toggleOrderedList();
        case "taskList":
            return editor.can().toggleList("taskList", "taskItem");
        default:
            return false;
    }
}

export function isListActive(editor: Editor | null, type: ListType): boolean {
    if (!editor) return false;

    switch (type) {
        case "bulletList":
            return editor.isActive("bulletList");
        case "orderedList":
            return editor.isActive("orderedList");
        case "taskList":
            return editor.isActive("taskList");
        default:
            return false;
    }
}

export function toggleList(editor: Editor | null, type: ListType): void {
    if (!editor) return;

    switch (type) {
        case "bulletList":
            editor.chain().focus().toggleBulletList().run();
            break;
        case "orderedList":
            editor.chain().focus().toggleOrderedList().run();
            break;
        case "taskList":
            editor.chain().focus().toggleList("taskList", "taskItem").run();
            break;
    }
}

export function getListOption(type: ListType): ListOption | undefined {
    return listOptions.find((option) => option.type === type);
}

export function shouldShowListButton(params: {
    editor: Editor | null;
    type: ListType;
    hideWhenUnavailable: boolean;
    listInSchema: boolean;
}): boolean {
    const { editor, type, hideWhenUnavailable, listInSchema } = params;

    if (!listInSchema) {
        return false;
    }

    if (hideWhenUnavailable) {
        if (isNodeSelection(editor?.state.selection) && !canToggleList(editor, type)) {
            return false;
        }
    }

    return true;
}

export function useListState(editor: Editor | null, type: ListType) {
    const listInSchema = isNodeInSchema(type, editor);
    const listOption = getListOption(type);
    const isActive = isListActive(editor, type);
    const shortcutKey = listShortcutKeys[type];

    return {
        listInSchema,
        listOption,
        isActive,
        shortcutKey,
    };
}

export const ListDropdownMenuItem = React.forwardRef<HTMLDivElement, ListDropdownMenuItemProps>(
    (
        {
            editor: providedEditor,
            type,
            hideWhenUnavailable = false,
            className = "",
            onSelect,
            text,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const editor = useTiptapEditor(providedEditor);
        const { listInSchema, listOption, isActive, shortcutKey } = useListState(editor, type);

        const Icon = listOption?.icon || ListIcon;

        const handleSelect = React.useCallback(
            (e: Event) => {
                onSelect?.(e);

                if (!e.defaultPrevented && editor) {
                    toggleList(editor, type);
                }
            },
            [onSelect, editor, type],
        );

        const show = React.useMemo(() => {
            return shouldShowListButton({
                editor,
                type,
                hideWhenUnavailable,
                listInSchema,
            });
        }, [editor, type, hideWhenUnavailable, listInSchema]);

        if (!show || !editor || !editor.isEditable) {
            return null;
        }

        return (
            <DropdownMenuItem
                ref={ref}
                onSelect={handleSelect}
                aria-label={listOption?.label || type}
                aria-pressed={isActive}
                className={cn(
                    "cursor-pointer",
                    isActive && "bg-accent text-accent-foreground",
                    className,
                )}
                {...buttonProps}
            >
                {children || (
                    <>
                        <Icon className={cn("pointer-events-none shrink-0 size-4")} />
                        <span className="font-normal">{text}</span>
                        {shortcutKey && (
                            <DropdownMenuShortcut>
                                <Shortcut shortcutKey={shortcutKey} />
                            </DropdownMenuShortcut>
                        )}
                    </>
                )}
            </DropdownMenuItem>
        );
    },
);

export function canToggleAnyList(editor: Editor | null, listTypes: ListType[]): boolean {
    if (!editor) return false;
    return listTypes.some((type) => canToggleList(editor, type));
}

export function isAnyListActive(editor: Editor | null, listTypes: ListType[]): boolean {
    if (!editor) return false;
    return listTypes.some((type) => isListActive(editor, type));
}

export function getFilteredListOptions(availableTypes: ListType[]): typeof listOptions {
    return listOptions.filter((option) => !option.type || availableTypes.includes(option.type));
}

export function shouldShowListDropdown(params: {
    editor: Editor | null;
    listTypes: ListType[];
    hideWhenUnavailable: boolean;
    listInSchema: boolean;
    canToggleAny: boolean;
}): boolean {
    const { editor, hideWhenUnavailable, listInSchema, canToggleAny } = params;

    if (!listInSchema) {
        return false;
    }

    if (hideWhenUnavailable) {
        if (isNodeSelection(editor?.state.selection) && !canToggleAny) {
            return false;
        }
    }

    return true;
}

export function useListDropdownState(editor: Editor | null, availableTypes: ListType[]) {
    const [isOpen, setIsOpen] = React.useState(false);

    const listInSchema = availableTypes.some((type) => isNodeInSchema(type, editor));

    const filteredLists = React.useMemo(
        () => getFilteredListOptions(availableTypes),
        [availableTypes],
    );

    const canToggleAny = canToggleAnyList(editor, availableTypes);
    const isAnyActive = isAnyListActive(editor, availableTypes);

    const handleOpenChange = React.useCallback(
        (open: boolean, callback?: (isOpen: boolean) => void) => {
            setIsOpen(open);
            callback?.(open);
        },
        [],
    );

    return {
        isOpen,
        setIsOpen,
        listInSchema,
        filteredLists,
        canToggleAny,
        isAnyActive,
        handleOpenChange,
    };
}

export function useActiveListIcon(editor: Editor | null, filteredLists: typeof listOptions) {
    return React.useCallback(() => {
        const activeOption = filteredLists.find((option) => isListActive(editor, option.type));

        return activeOption ? (
            <activeOption.icon className="tiptap-button-icon" />
        ) : (
            <ListIcon className="tiptap-button-icon" />
        );
    }, [editor, filteredLists]);
}

export function ListDropdown({
    editor: providedEditor,
    types = ["bulletList", "orderedList", "taskList"],
    hideWhenUnavailable = false,
    onOpenChange,
    className,
    ...props
}: ListDropdownProps) {
    const editor = useTiptapEditor(providedEditor);

    const { isOpen, listInSchema, filteredLists, canToggleAny, isAnyActive, handleOpenChange } =
        useListDropdownState(editor, types);

    const getActiveIcon = useActiveListIcon(editor, filteredLists);

    const show = React.useMemo(() => {
        return shouldShowListDropdown({
            editor,
            listTypes: types,
            hideWhenUnavailable,
            listInSchema,
            canToggleAny,
        });
    }, [editor, types, hideWhenUnavailable, listInSchema, canToggleAny]);

    const handleOnOpenChange = React.useCallback(
        (open: boolean) => handleOpenChange(open, onOpenChange),
        [handleOpenChange, onOpenChange],
    );

    if (!show || !editor || !editor.isEditable) {
        return null;
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                role="button"
                                aria-label="List options"
                                aria-pressed={isAnyActive}
                                tabIndex={-1}
                                className={cn(
                                    "cursor-pointer shrink-0 text-foreground/70",
                                    isAnyActive && "bg-accent text-foreground/70 dark:bg-accent/30",
                                    className,
                                )}
                                {...props}
                            >
                                {getActiveIcon()}
                                <ChevronDown className="size-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col justify-center items-center">
                        <span>Lists</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent sideOffset={10} align="start" className="w-52">
                <DropdownMenuLabel className="text-[9px] uppercase text-muted-foreground">
                    Lists
                </DropdownMenuLabel>
                <DropdownMenuGroup className="space-y-[1px]">
                    {filteredLists.map((option) => (
                        <ListDropdownMenuItem
                            key={option.type}
                            editor={editor}
                            type={option.type}
                            text={option.label}
                            hideWhenUnavailable={hideWhenUnavailable}
                        />
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
