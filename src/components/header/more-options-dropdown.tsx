import React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FontFamilySelector } from "@/components/header/font-family-selector";
import UndoRedoDropdownItem from "./undo-redo-button";

export function MoreOptionsDropdown() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [smallText, setSmallText] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(false);
    const [tableOfContents, setTableOfContents] = React.useState(false);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Icons.MaterialMoreHoriz className="size-6 shrink-0 text-inherit" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="max-h-[80vh] w-64 overflow-x-hidden overflow-y-auto font-sans"
            >
                <DropdownMenuGroup className="pb-2">
                    <FontFamilySelector />
                </DropdownMenuGroup>
                <DropdownMenuGroup className="space-y-[1px]">
                    <UndoRedoDropdownItem action="undo" />
                    <UndoRedoDropdownItem action="redo" />
                    <MoreOptionsDropdownItem className="focus:text-destructive">
                        <Icons.MaterialDelete className="size-5 shrink-0 text-inherit" />
                        <span>Clear all</span>
                    </MoreOptionsDropdownItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="mx-auto w-[calc(100%-1rem)]" />
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
                <DropdownMenuSeparator className="mx-auto w-[calc(100%-1rem)]" />
                <DropdownMenuGroup>
                    <MoreOptionsDropdownItem>
                        <Icons.MaterialTranslate className="size-5 shrink-0 text-inherit" />
                        <span>Translate</span>
                        <Icons.MaterialChevronRight className="ml-auto size-5 shrink-0 text-inherit" />
                    </MoreOptionsDropdownItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="mx-auto w-[calc(100%-1rem)]" />
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
            className={cn("h-7 cursor-pointer", className)}
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
            className={cn("h-7 cursor-pointer", className)}
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
                    "ml-auto h-4 w-7 cursor-pointer [&>span]:size-3 [&>span]:data-[state=checked]:translate-x-[calc(100%+1px)] [&>span]:data-[state=unchecked]:translate-x-[1px]",
                )}
            />
        </DropdownMenuItem>
    );
}
