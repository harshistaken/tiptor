import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme/theme-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBlockEditorContext } from "@/contexts/block-editor-context";
import { FontFamilySelector } from "@/components/block-based/font-family-selector";
import { UndoRedoDropdownItem } from "@/components/block-based/undo-redo-dropdown-item";
import { Input } from "@/components/ui/input";

export function BlockEditorHeader() {
    return (
        <header className="bg-tiptor-background z-[100] w-full max-w-screen select-none">
            <div className="flex h-11 w-full items-center justify-between overflow-hidden p-4">
                {/* Add the header content here */}
                <div className="flex items-center justify-center gap-2">
                    <BacktoHomeButton />
                    <EditableTitleWithIcon />
                    <EditModeToggle />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <AppearanceModeToggle />
                    <MoreOptionsDropdown />
                </div>
            </div>
        </header>
    );
}

// This is the button that goes back to the home page
function BacktoHomeButton() {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "size-7 shrink-0 cursor-pointer",
                "text-tiptor-foreground font-normal",
                "hover:text-tiptor-foreground hover:bg-tiptor-secondary",
            )}
        >
            <Icons.MaterialArrowBack className="size-5" />
        </Button>
    );
}

// This is the button that allows the user to edit the title & icon of the page
function EditableTitleWithIcon() {
    const { icon, title } = useBlockEditorContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-7 w-fit shrink-0 cursor-pointer px-2",
                        "text-tiptor-foreground font-normal",
                        "hover:text-tiptor-foreground hover:bg-tiptor-secondary",
                    )}
                >
                    {icon &&
                        (icon.type === "image" ? (
                            <img
                                src={icon.value}
                                alt={title}
                                className="size-5 object-contain"
                            />
                        ) : (
                            <div className="text-lg leading-none">
                                <span
                                    style={{
                                        whiteSpace: "nowrap",
                                        fontFamily:
                                            "Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
                                        opacity: 1,
                                    }}
                                    className="text-white"
                                >
                                    {icon.value}
                                </span>
                            </div>
                        ))}
                    <span className="w-full max-w-60 truncate leading-[1.2]">
                        {title ? title : "New page"}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={4}
                alignOffset={-24}
                className="bg-tiptor-popover text-tiptor-popover-foreground z-1 w-72 grow rounded-xl font-sans text-sm"
            >
                <DropdownMenuGroup>
                    <div className="flex items-center justify-center gap-2 px-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="text-tiptor-foreground bg-tiptor-background hover:bg-tiptor-secondary hover:text-tiptor-foreground border-tiptor-border dark:border-tiptor-border dark:hover:bg-tiptor-secondary dark:bg-tiptor-background/30 size-7 shrink-0 cursor-pointer rounded-sm border p-1 shadow-xs"
                        >
                            {icon &&
                                (icon.type === "image" ? (
                                    <img
                                        src={icon.value}
                                        alt={title}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-lg leading-none">
                                        <span
                                            style={{
                                                whiteSpace: "nowrap",
                                                fontFamily:
                                                    "Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
                                                opacity: 1,
                                            }}
                                            className="text-white"
                                        >
                                            {icon.value}
                                        </span>
                                    </div>
                                ))}
                        </Button>
                        <Input
                            placeholder="New page"
                            className="bg-tiptor-input border-tiptor-border dark:bg-tiptor-input dark:border-tiptor-border text-tiptor-foreground placeholder-tiptor-title-placeholder h-7 focus-visible:ring-0"
                        />
                    </div>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// This is the button that allows the user to toggle the edit mode of the page
function EditModeToggle() {
    const [isEditable, setIsEditable] = React.useState(false);
    return (
        <div className="flex h-7 w-fit items-center justify-center gap-2">
            <Switch
                checked={isEditable}
                onCheckedChange={setIsEditable}
                className="data-[state=checked]:bg-tiptor-primary-green h-[1rem] w-7 shrink-0 cursor-pointer [&>span]:size-3 [&>span]:data-[state=checked]:translate-x-[calc(100%+1px)] [&>span]:data-[state=unchecked]:translate-x-[1px]"
            />
            <span className="text-tiptor-secondary-foreground text-xs font-normal">
                {isEditable ? "EDITABLE" : "READ ONLY"}
            </span>
        </div>
    );
}

// This is the button that allows the user to toggle the appearance mode of the page
function AppearanceModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "size-7 shrink-0 cursor-pointer",
                "text-tiptor-foreground font-normal",
                "hover:text-tiptor-foreground hover:bg-tiptor-secondary",
            )}
            onClick={() =>
                theme === "dark" ? setTheme("light") : setTheme("dark")
            }
        >
            <Icons.MaterialDarkMode className="absolute size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Icons.MaterialLightMode className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
    );
}

function MoreOptionsDropdown() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [smallText, setSmallText] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(false);
    const [tableOfContents, setTableOfContents] = React.useState(false);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "h-7 w-8 shrink-0 cursor-pointer",
                        "text-tiptor-foreground font-normal",
                        "hover:text-tiptor-foreground hover:bg-tiptor-secondary transition-colors duration-300 ease-in",
                    )}
                >
                    <Icons.MaterialMoreHoriz className="size-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="bg-tiptor-popover text-tiptor-popover-foreground z-1 max-h-[80vh] w-64 grow overflow-x-hidden overflow-y-auto rounded-xl font-sans text-sm"
            >
                <DropdownMenuGroup className="pb-2">
                    <FontFamilySelector />
                </DropdownMenuGroup>
                <DropdownMenuGroup className="space-y-[1px]">
                    <UndoRedoDropdownItem action="undo" />
                    <UndoRedoDropdownItem action="redo" />
                    <MoreOptionsDropdownItem className="focus:text-tiptor-destructive">
                        <Icons.MaterialDelete className="size-5 shrink-0 text-inherit" />
                        <span>Clear all</span>
                    </MoreOptionsDropdownItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-tiptor-border mx-auto w-[calc(100%-1rem)]" />
                <DropdownMenuGroup className="space-y-[1px]">
                    <MoreOptionsToggleDropdownItem
                        icon={
                            <Icons.MaterialTextRotateVertical className="size-5 shrink-0 rotate-y-180 text-inherit transform-3d" />
                        }
                        label="Small text"
                        checked={smallText}
                        onCheckedChange={setSmallText}
                    />
                    <MoreOptionsToggleDropdownItem
                        icon={
                            <Icons.MaterialArrowOutward className="size-5 shrink-0 text-inherit" />
                        }
                        label="Full width"
                        checked={fullWidth}
                        onCheckedChange={setFullWidth}
                    />
                    <MoreOptionsToggleDropdownItem
                        icon={
                            <Icons.MaterialToc className="size-5 shrink-0 text-inherit" />
                        }
                        label="Table of contents"
                        checked={tableOfContents}
                        onCheckedChange={setTableOfContents}
                    />
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-tiptor-border mx-auto w-[calc(100%-1rem)]" />
                <DropdownMenuGroup>
                    <MoreOptionsDropdownItem>
                        <Icons.MaterialTranslate className="size-5 shrink-0 text-inherit" />
                        <span>Translate</span>
                        <Icons.MaterialChevronRight className="ml-auto size-5 shrink-0 text-inherit" />
                    </MoreOptionsDropdownItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-tiptor-border mx-auto w-[calc(100%-1rem)]" />
                <DropdownMenuGroup className="space-y-[1px]">
                    <MoreOptionsDropdownItem>
                        <Icons.MaterialVerticalAlignTop className="size-5 shrink-0 text-inherit" />
                        <span>Export</span>
                    </MoreOptionsDropdownItem>
                    <MoreOptionsDropdownItem>
                        <Icons.MaterialVerticalAlignBottom className="size-5 shrink-0 text-inherit" />
                        <span>Import</span>
                    </MoreOptionsDropdownItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function MoreOptionsDropdownItem({
    children,
    onSelect,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
    return (
        <DropdownMenuItem
            className={cn(
                "h-7 shrink-0 cursor-pointer rounded-md text-sm font-normal select-none",
                "text-tiptor-foreground focus:text-tiptor-foreground focus:bg-tiptor-secondary",
                className,
            )}
            onSelect={onSelect}
            {...props}
        >
            {children}
        </DropdownMenuItem>
    );
}

interface MoreOptionsToggleDropdownItemProps {
    icon: React.ReactNode;
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
}

function MoreOptionsToggleDropdownItem({
    icon,
    label,
    checked = false,
    onCheckedChange,
    className,
}: MoreOptionsToggleDropdownItemProps) {
    return (
        <DropdownMenuItem
            className={cn(
                "h-7 shrink-0 cursor-pointer rounded-md text-sm font-normal select-none",
                "text-tiptor-foreground focus:text-tiptor-foreground focus:bg-tiptor-secondary",
                className,
            )}
            onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCheckedChange?.(!checked);
            }}
        >
            {icon}
            <span>{label}</span>
            <Switch
                checked={checked}
                className={cn(
                    "data-[state=checked]:bg-tiptor-primary-green ml-auto h-[1rem] w-7 shrink-0 cursor-pointer [&>span]:size-3 [&>span]:data-[state=checked]:translate-x-[calc(100%+1px)] [&>span]:data-[state=unchecked]:translate-x-[1px]",
                )}
            />
        </DropdownMenuItem>
    );
}
