import React from "react";
import { Input } from "@/components/ui/input";
import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme/theme-provider";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEditorContext } from "@/contexts/editor-context";
import { MoreOptionsDropdown } from "@/components/header/more-options-dropdown";
export function EditorHeader() {
    return (
        <header className="bg-background z-[100] w-full max-w-screen select-none">
            <div className="flex h-11 w-full items-center justify-between overflow-hidden p-4">
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

function BacktoHomeButton() {
    return (
        <Button variant="ghost" size="icon">
            <Icons.MaterialArrowBack className="size-5 shrink-0 text-inherit" />
        </Button>
    );
}

function EditableTitleWithIcon() {
    const { title } = useEditorContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <span className="w-full max-w-60 truncate leading-tight">
                        {title ? title : "New page"}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={4}
                alignOffset={-24}
                className="w-72 rounded-full font-sans"
            >
                <Input
                    placeholder="New page"
                    className="h-7 border-none leading-none outline-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent"
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function EditModeToggle() {
    const [isEditable, setIsEditable] = React.useState(false);
    return (
        <div className="flex h-7 w-fit items-center justify-center gap-2">
            <Switch
                checked={isEditable}
                onCheckedChange={setIsEditable}
                className="h-4 w-7 cursor-pointer [&>span]:size-3 [&>span]:data-[state=checked]:translate-x-[calc(100%+1px)] [&>span]:data-[state=unchecked]:translate-x-[1px]"
            />
            <span className="text-secondary-foreground text-xs font-normal">
                {isEditable ? "EDITABLE" : "READ ONLY"}
            </span>
        </div>
    );
}

function AppearanceModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() =>
                theme === "dark" ? setTheme("light") : setTheme("dark")
            }
        >
            <Icons.MaterialDarkMode className="absolute size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Icons.MaterialLightMode className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
    );
}
