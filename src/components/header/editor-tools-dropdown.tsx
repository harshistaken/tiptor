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
import { HistoryActionDropdownItem } from "./history-action-dropdown-item";
import { useEditorSettingsContext } from "@/contexts/editor-settings-context";
import { FontFamilyPicker } from "./font-family-picker";
import { useEditorContext } from "@/contexts/editor-context";

export function EditorToolsDropdown() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setContent } = useEditorContext();
    const { settings, setSettings } = useEditorSettingsContext();

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Icons.MaterialMoreHoriz className="size-6" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="max-h-[80vh] w-64 overflow-x-hidden overflow-y-auto font-sans"
            >
                <DropdownMenuGroup className="pb-2">
                    <FontFamilyPicker disabled={settings.readOnly} />
                </DropdownMenuGroup>
                <DropdownMenuGroup className="space-y-[1px]">
                    <HistoryActionDropdownItem action="undo" disabled={settings.readOnly} />
                    <HistoryActionDropdownItem action="redo" disabled={settings.readOnly} />
                    <EditorToolsDropdownItem
                        className="focus:!text-destructive focus:[&_svg]:!text-destructive"
                        onSelect={() => setContent("")}
                        disabled={settings.readOnly}
                    >
                        <Icons.MaterialDelete className="size-5" />
                        <span>Clear all</span>
                    </EditorToolsDropdownItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="mx-auto w-[calc(100%-1rem)]" />
                <DropdownMenuGroup className="space-y-[1px]">
                    <EditorToolsToggleDropdownItem
                        icon={<Icons.MaterialTextRotateVertical className="size-5 rotate-y-180 transform-3d" />}
                        label="Small text"
                        checked={settings.smallText}
                        onCheckedChange={() => setSettings({ ...settings, smallText: !settings.smallText })}
                    />
                    <EditorToolsToggleDropdownItem
                        icon={<Icons.MaterialArrowOutward className="size-5" />}
                        label="Full width"
                        checked={settings.fullWidth}
                        onCheckedChange={() => setSettings({ ...settings, fullWidth: !settings.fullWidth })}
                    />
                    <EditorToolsToggleDropdownItem
                        icon={<Icons.MaterialToc className="size-5" />}
                        label="Table of contents"
                        checked={settings.tableOfContents}
                        onCheckedChange={() => setSettings({ ...settings, tableOfContents: !settings.tableOfContents })}
                    />
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="mx-auto w-[calc(100%-1rem)]" />
                <DropdownMenuGroup>
                    <EditorToolsDropdownItem>
                        <Icons.MaterialTranslate className="size-5" />
                        <span>Translate</span>
                        <Icons.MaterialChevronRight className="ml-auto size-5" />
                    </EditorToolsDropdownItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="mx-auto w-[calc(100%-1rem)]" />
                <DropdownMenuGroup className="space-y-[1px]">
                    <EditorToolsDropdownItem>
                        <Icons.MaterialVerticalAlignTop className="size-5" />
                        <span>Export</span>
                    </EditorToolsDropdownItem>
                    <EditorToolsDropdownItem>
                        <Icons.MaterialVerticalAlignBottom className="size-5" />
                        <span>Import</span>
                    </EditorToolsDropdownItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function EditorToolsDropdownItem({
    children,
    onSelect,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
    return (
        <DropdownMenuItem className={cn("h-7 cursor-pointer", className)} onSelect={onSelect} {...props}>
            {children}
        </DropdownMenuItem>
    );
}

function EditorToolsToggleDropdownItem({
    icon,
    label,
    checked = false,
    onCheckedChange,
    className,
}: {
    icon: React.ReactNode;
    label: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
}) {
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
