import React from "react";
import {
    CheckIcon,
    ChevronDown,
    ChevronsUpDown,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    TypeIcon,
    AlignLeftIcon,
    AlignCenterIcon,
    AlignRightIcon,
    AlignJustifyIcon,
    ListTodoIcon,
    ListOrderedIcon,
    ListIcon,
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    StrikethroughIcon,
    CodeIcon,
    TextQuoteIcon,
    RulerIcon,
    PaletteIcon,
    CircleIcon,
    LinkIcon,
    UnlinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

export function BasicEditorHeader({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "h-12 border-b bg-foreground/2 backdrop-blur-md rounded-t-xl p-2",
                "flex gap-2 items-center justify-start",
                className,
            )}
        >
            <FontFamilySelector />
            <TextStyleSelector />
            <TextAlignSelector />
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-2/3" />
            <ListItemBlock />
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-2/3" />
            <FormattingBlock />
            <Separator orientation="vertical" className="data-[orientation=vertical]:h-2/3" />
            <MiscellaneousBlock />
        </div>
    );
}

// TODO: Add functionality by integrating with editor using tiptap-extension-font-family
function FontFamilySelector() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    const fontFamilies = [
        {
            label: "Arial",
            value: "Arial",
        },
        {
            label: "Times New Roman",
            value: "Times New Roman",
        },
        {
            label: "Georgia",
            value: "Georgia",
        },
        {
            label: "Serif",
            value: "serif",
        },
        {
            label: "Monospace",
            value: "Monospace",
        },
        {
            label: "Roboto",
            value: "Roboto",
        },
        {
            label: "Open Sans",
            value: "OpenSans",
        },
        {
            label: "Inter",
            value: "Inter",
        },
    ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between max-w-44 font-normal"
                >
                    {value
                        ? fontFamilies.find((fontFamily) => fontFamily.value === value)?.label
                        : "Select font..."}
                    <ChevronsUpDown className="text-muted-foreground" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                    <CommandInput placeholder="Search font ..." />
                    <CommandList>
                        <CommandEmpty>No such font found.</CommandEmpty>
                        <CommandGroup>
                            {fontFamilies.map((fontFamily) => (
                                <CommandItem
                                    key={fontFamily.value}
                                    value={fontFamily.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    {fontFamily.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto",
                                            value === fontFamily.value
                                                ? "opacity-100"
                                                : "opacity-0",
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

// TODO: Add functionality by integrating with editor using tiptap-extension-heading & tiptap-extension-paragraph
function TextStyleSelector() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    const textStyles = [
        {
            label: "Text",
            value: "text",
            icon: <TypeIcon className="mr-1 size-4" />,
        },
        {
            label: "Heading 1",
            value: "heading-1",
            icon: <Heading1Icon className="size-5" />,
            shortcut: "#",
        },
        {
            label: "Heading 2",
            value: "heading-2",
            icon: <Heading2Icon className="size-5" />,
            shortcut: "##",
        },
        {
            label: "Heading 3",
            value: "heading-3",
            icon: <Heading3Icon className="size-5" />,
            shortcut: "###",
        },
    ];
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="dropdown-menu"
                    aria-expanded={open}
                    className="gap-1"
                >
                    {value
                        ? textStyles.find((textStyle) => textStyle.value === value)?.icon
                        : textStyles[0].icon}
                    <ChevronDown className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Text style</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {textStyles.map((textStyle) => (
                        <DropdownMenuItem
                            key={textStyle.value}
                            onSelect={() => setValue(textStyle.value)}
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
// TODO: Add functionality by integrating with editor using tiptap-extension-text-align
function TextAlignSelector() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    const textAligns = [
        {
            label: "Left",
            value: "left",
            icon: <AlignLeftIcon className="size-4" />,
            shortcut: "⌘⇧L",
        },
        {
            label: "Center",
            value: "center",
            icon: <AlignCenterIcon className="size-4" />,
            shortcut: "⌘⇧E",
        },
        {
            label: "Right",
            value: "right",
            icon: <AlignRightIcon className="size-4" />,
            shortcut: "⌘⇧R",
        },
        {
            label: "Justify",
            value: "justify",
            icon: <AlignJustifyIcon className="size-4" />,
            shortcut: "⌘⇧J",
        },
    ];
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="dropdown-menu"
                    aria-expanded={open}
                    className="gap-1"
                >
                    {value
                        ? textAligns.find((textAlign) => textAlign.value === value)?.icon
                        : textAligns[0].icon}
                    <ChevronDown className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Text style</DropdownMenuLabel>
                <DropdownMenuGroup>
                    {textAligns.map((textAlign) => (
                        <DropdownMenuItem
                            key={textAlign.value}
                            onSelect={() => setValue(textAlign.value)}
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

// TODO: Add functionality by integrating with editor using tiptap-extension-list-item
function ListItemBlock() {
    const listItems = [
        {
            label: "Blockquote",
            icon: <TextQuoteIcon className="size-4" />,
        },
        {
            label: "Unordered List",
            icon: <ListIcon className="size-4" />,
        },
        {
            label: "Ordered List",
            icon: <ListOrderedIcon className="size-4" />,
        },
        {
            label: "Checklist",
            icon: <ListTodoIcon className="size-4" />,
        },
    ];

    return (
        <React.Fragment>
            {listItems.map((listItem) => (
                <Button key={listItem.label} type="button" variant="outline" size="icon">
                    {listItem.icon}
                </Button>
            ))}
        </React.Fragment>
    );
}

// TODO: Add functionality by integrating with editor using tiptap-extension-bold, tiptap-extension-italic, tiptap-extension-underline, tiptap-extension-strikethrough
function FormattingBlock() {
    const formattingItems = [
        {
            icon: <BoldIcon className="size-4" />,
            tooltip: "Bold",
        },
        {
            icon: <ItalicIcon className="size-4" />,
            tooltip: "Italic",
        },
        {
            icon: <UnderlineIcon className="size-4" />,
            tooltip: "Underline",
        },
        {
            icon: <StrikethroughIcon className="size-4" />,
            tooltip: "Strike",
        },
    ];

    return (
        <React.Fragment>
            {formattingItems.map((formattingItem) => (
                <Button key={formattingItem.tooltip} type="button" variant="outline" size="icon">
                    {formattingItem.icon}
                </Button>
            ))}
        </React.Fragment>
    );
}

// TODO: Add functionality by integrating with editor using tiptap-extension-text-color
function TextColorSelector() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    const textColors = [
        {
            label: "Red",
            value: "#EF4444",
        },
        {
            label: "Yellow",
            value: "#EAB308",
        },
        {
            label: "Blue",
            value: "#3B82F6",
        },
        {
            label: "Green",
            value: "#10B981",
        },
    ];
    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="dropdown-menu"
                    aria-expanded={open}
                    className="gap-1"
                >
                    <PaletteIcon className="size-4" style={{ color: value }} />
                    <ChevronDown className="text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="center"
                className="w-fit p-2 flex gap-2 items-center justify-center rounded-full"
            >
                <CircleIcon className="size-5 text-foreground fill-foreground opacity-50 cursor-pointer" />
                {textColors.map((textColor) => (
                    <CircleIcon
                        key={textColor.value}
                        className="size-5 cursor-pointer"
                        style={{
                            color: textColor.value,
                            fill: textColor.value,
                            opacity: value === textColor.value ? 1 : 0.5,
                        }}
                        onClick={() => setValue(textColor.value)}
                    />
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// TODO: Add functionality by integrating with editor using tiptap-extension-link
function LinkBlock() {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const linkValue = "";

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

    const handleSubmit = () => {
        if (!value || !isValidUrl(formatUrlWithProtocol(value))) return;

        // const url = formatUrlWithProtocol(value);
        // editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        setOpen(false);
    };

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

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    role="dropdown-menu"
                    aria-expanded={open}
                >
                    {linkValue ? (
                        <LinkIcon className="size-4" />
                    ) : (
                        <UnlinkIcon className="size-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-fit p-1.5 pr-4 flex gap-2 items-center justify-center rounded-full"
            >
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Paste a link"
                    defaultValue={linkValue || ""}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSubmit();
                        }
                    }}
                    className="w-full outline-none border-none rounded-[calc(infinity_*_1px_-_0.375rem))]"
                />
                <div className="flex items-center justify-center">
                    <Button
                        type="button"
                        size="icon"
                        onClick={handleSubmit}
                        variant="ghost"
                        className="size-7"
                    >
                        <CheckIcon className="size-4" />
                    </Button>

                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-7 text-destructive hover:text-destructive"
                    >
                        <UnlinkIcon className="size-4" />
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// TODO: Add functionality by integrating with editor using tiptap-extension-code, tiptap-extension-horizontal-rule
function MiscellaneousBlock() {
    const miscellaneousItems = [
        {
            icon: <CodeIcon className="size-4" />,
            tooltip: "Code",
        },
        {
            icon: <RulerIcon className="size-4" />,
            tooltip: "Horizontal Rule",
        },
    ];

    return (
        <React.Fragment>
            <TextColorSelector />
            {miscellaneousItems.map((miscellaneousItem) => (
                <Button key={miscellaneousItem.tooltip} type="button" variant="outline" size="icon">
                    {miscellaneousItem.icon}
                </Button>
            ))}
            <LinkBlock />
        </React.Fragment>
    );
}
