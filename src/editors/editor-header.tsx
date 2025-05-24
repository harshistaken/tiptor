import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme/theme-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEditorContext } from "@/contexts/editor-context";
import { EditorToolsDropdown } from "@/components/header/editor-tools-dropdown";
import { useEditorSettingsContext } from "@/contexts/editor-settings-context";

export function EditorHeader() {
    return (
        <header className="bg-background z-[100] w-full max-w-screen select-none">
            <div className="flex h-11 w-full items-center justify-between overflow-hidden px-4">
                <div className="flex h-full items-center justify-center gap-2">
                    <BacktoHomeButton />
                    <EditableTitleWithIcon />
                    <ReadOnlyModeToggle />
                </div>
                <div className="flex h-full items-center justify-center gap-2">
                    <AppearanceModeToggle />
                    <EditorToolsDropdown />
                </div>
            </div>
        </header>
    );
}

function BacktoHomeButton() {
    const navigate = useNavigate();

    return (
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <Icons.MaterialArrowBack className="size-5 shrink-0" />
        </Button>
    );
}

function EditableTitleWithIcon() {
    const { title, setTitle } = useEditorContext();
    const { settings } = useEditorSettingsContext();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={settings.readOnly}>
                    <span className="w-full max-w-60 truncate leading-tight">{title ? title : "New page"}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={4}
                alignOffset={-24}
                className="w-72 rounded-lg font-sans"
            >
                <Input
                    placeholder="New page"
                    className="h-7 border-none leading-none shadow-none outline-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent"
                    value={title}
                    disabled={settings.readOnly}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function ReadOnlyModeToggle() {
    const { settings, setSettings } = useEditorSettingsContext();

    return (
        <div className="flex h-7 w-fit items-center justify-center gap-2">
            <Switch
                checked={settings.readOnly}
                onCheckedChange={(checked) => setSettings({ ...settings, readOnly: checked })}
                className="h-4 w-7 cursor-pointer [&>span]:size-3 [&>span]:data-[state=checked]:translate-x-[calc(100%+1px)] [&>span]:data-[state=unchecked]:translate-x-[1px]"
            />
            <span className="text-secondary-foreground text-xs font-normal">
                {settings.readOnly ? "READ ONLY" : "EDITABLE"}
            </span>
        </div>
    );
}

function AppearanceModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <Button variant="ghost" size="icon" onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}>
            <Icons.MaterialDarkMode className="absolute size-5 shrink-0 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Icons.MaterialLightMode className="absolute size-5 shrink-0 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </Button>
    );
}
