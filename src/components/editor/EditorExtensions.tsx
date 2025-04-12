import React from "react";
import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import {
    CheckIcon,
    ChevronsUpDown,
    ChevronDown,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    TypeIcon,
    AlignLeftIcon,
    AlignCenterIcon,
    AlignRightIcon,
    AlignJustifyIcon,
    TextQuoteIcon,
    ListIcon,
    ListTodoIcon,
    ListOrderedIcon,
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    PaletteIcon,
    CircleIcon,
    CodeIcon,
    RulerIcon,
    UnlinkIcon,
    LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Selector components
 * @param editor - The editor instance
 * @param className - The className for the selector component
 *
 * - FontSelector
 * - TextStyleSelector
 * - TextAlignSelector
 * - TextColorSelector
 * - LinkSelector
 *
 * @returns The selector components for the editor
 */
export function FontSelector({ editor, className }: { editor: Editor | null; className?: string }) {
    const [open, setOpen] = React.useState(false);

    if (!editor) return null;

    // Fonts available in the editor
    const fonts = [
        {
            font: "Arial",
            isActive: editor?.isActive("textStyle", { fontFamily: "Arial, var(--font-sans)" }),
            onClick: () => editor?.chain().focus().setFontFamily("Arial, var(--font-sans)").run(),
        },
        {
            font: "Times New Roman",
            isActive: editor?.isActive("textStyle", {
                fontFamily: "Times New Roman, var(--font-serif)",
            }),
            onClick: () =>
                editor?.chain().focus().setFontFamily("Times New Roman, var(--font-serif)").run(),
        },
        {
            font: "Georgia",
            isActive: editor?.isActive("textStyle", { fontFamily: "Georgia, var(--font-serif)" }),
            onClick: () =>
                editor?.chain().focus().setFontFamily("Georgia, var(--font-serif)").run(),
        },
        {
            font: "Serif",
            isActive: editor?.isActive("textStyle", { fontFamily: "serif, var(--font-serif)" }),
            onClick: () => editor?.chain().focus().setFontFamily("serif, var(--font-serif)").run(),
        },
        {
            font: "Monospace",
            isActive: editor?.isActive("textStyle", { fontFamily: "monospace, var(--font-mono)" }),
            onClick: () =>
                editor?.chain().focus().setFontFamily("monospace, var(--font-mono)").run(),
        },
        {
            font: "Roboto",
            isActive: editor?.isActive("textStyle", { fontFamily: "var(--font-roboto)" }),
            onClick: () => editor?.chain().focus().setFontFamily("var(--font-roboto)").run(),
        },
        {
            font: "Open Sans",
            isActive: editor?.isActive("textStyle", { fontFamily: "var(--font-open-sans)" }),
            onClick: () => editor?.chain().focus().setFontFamily("var(--font-open-sans)").run(),
        },
        {
            font: "Inter",
            isActive: editor?.isActive("textStyle", { fontFamily: "var(--font-inter)" }),
            onClick: () => editor?.chain().focus().setFontFamily("var(--font-inter)").run(),
        },
    ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between max-w-44 font-normal cursor-pointer",
                        className,
                    )}
                >
                    {fonts.find((option) => option.isActive)?.font || "Select font..."}
                    <ChevronsUpDown className="text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                    <CommandInput placeholder="Search font ..." />
                    <CommandList>
                        <CommandEmpty className="text-muted-foreground">
                            No such font found.
                        </CommandEmpty>
                        <CommandGroup>
                            {fonts.map((font) => (
                                <CommandItem
                                    key={font.font}
                                    value={font.font}
                                    onSelect={() => {
                                        font.onClick();
                                        setOpen(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    {font.font}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto",
                                            font.isActive ? "opacity-100" : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function TextStyleSelector({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    const [open, setOpen] = React.useState(false);

    if (!editor) return null;

    // Text styles available in the editor
    const textStyles = [
        {
            label: "Text",
            icon: <TypeIcon className="size-4" />,
            isActive: editor?.isActive("paragraph"),
            onClick: () => editor?.chain().focus().setParagraph().run(),
        },
        {
            label: "Heading 1",
            icon: <Heading1Icon className="size-5" />,
            shortcut: "#",
            isActive: editor?.isActive("heading", { level: 1 }),
            onClick: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
            label: "Heading 2",
            icon: <Heading2Icon className="size-5" />,
            shortcut: "##",
            isActive: editor?.isActive("heading", { level: 2 }),
            onClick: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            label: "Heading 3",
            icon: <Heading3Icon className="size-5" />,
            shortcut: "###",
            isActive: editor?.isActive("heading", { level: 3 }),
            onClick: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
        },
    ];

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    role="dropdown-menu"
                    aria-expanded={open}
                    className={cn("gap-1 cursor-pointer", className)}
                >
                    {textStyles.find((textStyle) => textStyle.isActive)?.icon || textStyles[0].icon}
                    <ChevronDown className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Text style</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {textStyles.map((textStyle) => (
                        <DropdownMenuItem
                            key={textStyle.label}
                            onSelect={() => textStyle.onClick()}
                            className={cn(
                                "cursor-pointer",
                                textStyle.isActive && "bg-accent text-accent-foreground",
                            )}
                        >
                            {textStyle.icon}
                            {textStyle.label}
                            {textStyle.shortcut && (
                                <DropdownMenuShortcut>{textStyle.shortcut}</DropdownMenuShortcut>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function TextAlignSelector({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    const [open, setOpen] = React.useState(false);

    if (!editor) return null;

    // Text alignments available in the editor
    const textAligns = [
        {
            label: "Left",
            icon: <AlignLeftIcon className="size-4" />,
            shortcut: "⌘⇧L",
            onClick: () => editor?.chain().focus().setTextAlign("left").run(),
            isActive: editor?.isActive({ textAlign: "left" }),
        },
        {
            label: "Center",
            icon: <AlignCenterIcon className="size-4" />,
            shortcut: "⌘⇧E",
            onClick: () => editor?.chain().focus().setTextAlign("center").run(),
            isActive: editor?.isActive({ textAlign: "center" }),
        },
        {
            label: "Right",
            icon: <AlignRightIcon className="size-4" />,
            shortcut: "⌘⇧R",
            onClick: () => editor?.chain().focus().setTextAlign("right").run(),
            isActive: editor?.isActive({ textAlign: "right" }),
        },
        {
            label: "Justify",
            icon: <AlignJustifyIcon className="size-4" />,
            shortcut: "⌘⇧J",
            onClick: () => editor?.chain().focus().setTextAlign("justify").run(),
            isActive: editor?.isActive({ textAlign: "justify" }),
        },
    ];

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    role="dropdown-menu"
                    aria-expanded={open}
                    className={cn("gap-1 cursor-pointer", className)}
                >
                    {textAligns.find((textAlign) => textAlign.isActive)?.icon || textAligns[0].icon}
                    <ChevronDown className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Text align</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {textAligns.map((textAlign) => (
                        <DropdownMenuItem
                            key={textAlign.label}
                            onSelect={() => textAlign.onClick()}
                            className={cn(
                                "cursor-pointer",
                                textAlign.isActive && "bg-accent text-accent-foreground",
                            )}
                        >
                            {textAlign.icon}
                            {textAlign.label}
                            {textAlign.shortcut && (
                                <DropdownMenuShortcut>{textAlign.shortcut}</DropdownMenuShortcut>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function TextColorSelector({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    const [open, setOpen] = React.useState(false);

    if (!editor) return null;

    // Text colors available in the editor
    const textColors = [
        {
            label: "Red",
            value: "#EF4444",
            isActive: editor.isActive("textStyle", { color: "#EF4444" }),
            onClick: () => editor.chain().focus().setColor("#EF4444").run(),
        },
        {
            label: "Yellow",
            value: "#EAB308",
            isActive: editor.isActive("textStyle", { color: "#EAB308" }),
            onClick: () => editor.chain().focus().setColor("#EAB308").run(),
        },
        {
            label: "Blue",
            value: "#3B82F6",
            isActive: editor.isActive("textStyle", { color: "#3B82F6" }),
            onClick: () => editor.chain().focus().setColor("#3B82F6").run(),
        },
        {
            label: "Green",
            value: "#10B981",
            isActive: editor.isActive("textStyle", { color: "#10B981" }),
            onClick: () => editor.chain().focus().setColor("#10B981").run(),
        },
    ];

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    role="dropdown-menu"
                    aria-expanded={open}
                    className={cn("gap-1 cursor-pointer", className)}
                >
                    <PaletteIcon
                        className="size-4"
                        style={{ color: editor.getAttributes("textStyle").color }}
                    />
                    <ChevronDown className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="w-fit p-2 flex gap-2 items-center justify-center rounded-full"
            >
                {/* Default color is basically the already provided color so we just need to unset the color */}
                <CircleIcon
                    className="size-5 text-foreground fill-foreground opacity-50 cursor-pointer"
                    onClick={() => editor.chain().focus().unsetColor().run()}
                />
                {textColors.map((textColor) => (
                    <CircleIcon
                        key={textColor.value}
                        className="size-5 cursor-pointer"
                        style={{
                            color: textColor.value,
                            fill: textColor.value,
                            opacity: textColor.isActive ? 1 : 0.5,
                        }}
                        onClick={() => textColor.onClick()}
                    />
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ListSelector({ editor, className }: { editor: Editor | null; className?: string }) {
    const [open, setOpen] = React.useState(false);

    if (!editor) return null;

    const listItems = [
        {
            label: "Unordered list",
            icon: <ListIcon className="size-4" />,
            shortcut: "⌘⇧8",
            onClick: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive("bulletList"),
        },
        {
            label: "Ordered list",
            icon: <ListOrderedIcon className="size-4" />,
            shortcut: "⌘⇧7",
            onClick: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive("orderedList"),
        },
        {
            label: "Task list",
            icon: <ListTodoIcon className="size-4" />,
            shortcut: "⌘⇧9",
            onClick: () => editor.chain().focus().toggleTaskList().run(),
            isActive: editor.isActive("taskList"),
        },
    ];

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="secondary"
                    role="dropdown-menu"
                    aria-expanded={open}
                    className={cn("gap-1 cursor-pointer", className)}
                >
                    {listItems.find((listItem) => listItem.isActive)?.icon || listItems[0].icon}
                    <ChevronDown className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Lists</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {listItems.map((listItem) => (
                        <DropdownMenuItem
                            key={listItem.label}
                            onSelect={() => listItem.onClick()}
                            className={cn(
                                "cursor-pointer",
                                listItem.isActive && "bg-accent text-accent-foreground",
                            )}
                        >
                            {listItem.icon}
                            {listItem.label}
                            {listItem.shortcut && (
                                <DropdownMenuShortcut>{listItem.shortcut}</DropdownMenuShortcut>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function LinkSelector({ editor, className }: { editor: Editor | null; className?: string }) {
    const [open, setOpen] = React.useState(false);

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState("");
    const linkValue = editor?.getAttributes("link").href;
    const isTextSelected = editor ? editor.state.selection.content().size > 0 : false;

    // Validate URL format
    const isValidUrl = (url: string): boolean => {
        if (!url) return false;

        // Very simple URL validation - could be enhanced for more precise validation
        return (
            url.match(/^mailto:/) !== null ||
            url.match(/^(https?:\/\/)[^\s$.?#].[^\s]*$/) !== null ||
            url.match(/^[^\s$.?#].[^\s]*\.[a-z]{2,}[^\s]*$/) !== null
        );
    };

    // Format URL with protocol
    const formatUrlWithProtocol = (url: string): string => {
        if (!url) return "";

        // Handle mailto: links
        if (url.startsWith("mailto:")) {
            return url;
        }

        // Add https:// if no protocol is specified
        if (!url.match(/^https?:\/\//)) {
            return `https://${url}`;
        }

        return url;
    };

    // Handle adding a link
    const handleSubmit = () => {
        if (!value || !isValidUrl(formatUrlWithProtocol(value))) return;

        const url = formatUrlWithProtocol(value);
        editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        setOpen(false);
    };

    if (!editor) return null;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <ExtensionToggleButton
                    isActive={editor?.isActive("link")}
                    aria-expanded={open}
                    className={className}
                    disabled={!isTextSelected}
                >
                    {linkValue ? (
                        <LinkIcon className="size-4" />
                    ) : (
                        <UnlinkIcon className="size-4" />
                    )}
                </ExtensionToggleButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-fit p-1.5 pr-4 flex gap-2 items-center justify-center rounded-full"
            >
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter or paste a url here"
                    className="w-full outline-none border-none rounded-[calc(infinity_*_1px_-_0.375rem))]"
                    defaultValue={linkValue || ""}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                />
                <div className="flex items-center justify-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={handleSubmit}
                        disabled={!value || !isValidUrl(formatUrlWithProtocol(value))}
                    >
                        <CheckIcon className="size-4" />
                    </Button>
                    {linkValue && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive hover:text-destructive"
                            onClick={() => {
                                editor?.chain().focus().unsetLink().run();
                                if (inputRef.current) {
                                    inputRef.current.value = "";
                                }
                                setOpen(false);
                            }}
                        >
                            <UnlinkIcon className="size-4" />
                        </Button>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/**
 * Basic editor header button
 * @param className - The className for the button
 * @param children - The children for the button
 * @param isActive - The active state for the button
 * @param onClick - The onClick event for the button
 * @param disabled - The disabled state for the button
 * @param props - The props for the button
 */
function ExtensionToggleButton({
    className,
    children,
    isActive,
    onClick,
    disabled,
    ...props
}: {
    className?: string;
    children: React.ReactNode;
    isActive: boolean;
    onClick?: () => void;
    disabled?: boolean;
    props?: React.ComponentProps<"button">;
}) {
    return (
        <Button
            type="button"
            variant="secondary"
            size="icon"
            role="button"
            className={cn("cursor-pointer", isActive && "bg-secondary/80", className)}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </Button>
    );
}

/**
 * Toggle components
 * @param editor - The editor instance
 * @param className - The className for the toggle component
 *
 * - BlockQuoteToggle
 * - UnorderedListToggle
 * - OrderedListToggle
 * - ChecklistToggle
 * - BoldToggle
 * - ItalicToggle
 * - UnderlineToggle
 * - StrikethroughToggle
 * - CodeToggle
 * - HorizontalRuleToggle
 *
 * @returns The toggle components for the editor
 */

export function BlockQuoteToggle({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={className}
        >
            <TextQuoteIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function UnorderedListToggle({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={className}
        >
            <ListIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function OrderedListToggle({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={className}
        >
            <ListOrderedIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function TaskListToggle({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("taskList")}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={className}
        >
            <ListTodoIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function BoldToggle({ editor, className }: { editor: Editor | null; className?: string }) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={className}
        >
            <BoldIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function ItalicToggle({ editor, className }: { editor: Editor | null; className?: string }) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={className}
        >
            <ItalicIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function UnderlineToggle({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={className}
        >
            <UnderlineIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function StrikethroughToggle({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={className}
        >
            <StrikethroughIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function CodeToggle({ editor, className }: { editor: Editor | null; className?: string }) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={className}
        >
            <CodeIcon className="size-4" />
        </ExtensionToggleButton>
    );
}

export function HorizontalRuleToggle({
    editor,
    className,
}: {
    editor: Editor | null;
    className?: string;
}) {
    if (!editor) return null;

    return (
        <ExtensionToggleButton
            isActive={editor.isActive("horizontalRule")}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={className}
        >
            <RulerIcon className="size-4" />
        </ExtensionToggleButton>
    );
}
