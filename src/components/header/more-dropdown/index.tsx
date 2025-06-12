import { CustomButton } from "@/components/common/custom-button";
import {
    CustomDropdown,
    CustomDropdownContent,
    CustomDropdownGroup,
    CustomDropdownItem,
    CustomDropdownSeparator,
    CustomDropdownSwitchItem,
    CustomDropdownTrigger,
} from "@/components/common/custom-dropdown";
import { useEditorContext } from "@/providers/editor-provider";
import { useEditorSettings } from "@/providers/editor-settings-provider";
import {
    AArrowDownIcon,
    ChevronRightIcon,
    DownloadIcon,
    EllipsisIcon,
    LanguagesIcon,
    MoveHorizontalIcon,
    TableOfContentsIcon,
    Trash2Icon,
    UploadIcon,
} from "lucide-react";
import React from "react";
import { FontFamilySelector } from "./font-family-selector";

export function MoreDropdown() {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setContent } = useEditorContext();
    const { settings, updateSettings } = useEditorSettings();

    return (
        <CustomDropdown open={isOpen} onOpenChange={setIsOpen}>
            <CustomDropdownTrigger asChild>
                <CustomButton variant="ghost" size="icon">
                    <EllipsisIcon />
                </CustomButton>
            </CustomDropdownTrigger>
            <CustomDropdownContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="max-h-[80vh] w-64 overflow-x-hidden overflow-y-auto font-sans"
            >
                <CustomDropdownGroup className="pb-2">
                    <FontFamilySelector disabled={settings.readOnly} />
                </CustomDropdownGroup>
                <CustomDropdownSeparator className="my-3 h-1 w-1/9 rounded-full" />
                <CustomDropdownGroup>
                    <CustomDropdownItem
                        className="focus:!text-destructive focus:[&_svg]:!text-destructive"
                        onSelect={() => setContent("")}
                        disabled={settings.readOnly}
                    >
                        <Trash2Icon />
                        <span>Clear all</span>
                    </CustomDropdownItem>
                </CustomDropdownGroup>
                <CustomDropdownSeparator className="my-3 h-1 w-1/9 rounded-full" />
                <CustomDropdownGroup>
                    <CustomDropdownSwitchItem
                        checked={settings.smallText}
                        onCheckedChange={() => updateSettings({ smallText: !settings.smallText })}
                    >
                        <AArrowDownIcon />
                        <span>Small text</span>
                    </CustomDropdownSwitchItem>
                    <CustomDropdownSwitchItem
                        checked={settings.fullWidth}
                        onCheckedChange={() => updateSettings({ fullWidth: !settings.fullWidth })}
                    >
                        <MoveHorizontalIcon />
                        <span>Full width</span>
                    </CustomDropdownSwitchItem>
                    <CustomDropdownSwitchItem
                        checked={settings.tableOfContents}
                        onCheckedChange={() => updateSettings({ tableOfContents: !settings.tableOfContents })}
                    >
                        <TableOfContentsIcon />
                        <span>Table of contents</span>
                    </CustomDropdownSwitchItem>
                </CustomDropdownGroup>
                <CustomDropdownSeparator className="my-3 h-1 w-1/9 rounded-full" />
                <CustomDropdownGroup>
                    <CustomDropdownItem>
                        <LanguagesIcon />
                        <span>Translate</span>
                        <ChevronRightIcon className="ml-auto" />
                    </CustomDropdownItem>
                    <CustomDropdownItem>
                        <UploadIcon />
                        <span>Import</span>
                    </CustomDropdownItem>
                    <CustomDropdownItem>
                        <DownloadIcon />
                        <span>Export</span>
                    </CustomDropdownItem>
                </CustomDropdownGroup>
            </CustomDropdownContent>
        </CustomDropdown>
    );
}
