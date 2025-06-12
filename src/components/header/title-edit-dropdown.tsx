import { CustomButton } from "@/components/common/custom-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEditorContext } from "@/providers/editor-provider";
import { useEditorSettings } from "@/providers/editor-settings-provider";

export function TitleEditDropdown() {
    const { title, setTitle } = useEditorContext();
    const { settings } = useEditorSettings();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <CustomButton
                    size="sm"
                    variant="ghost"
                    disabled={settings.readOnly}
                    className="data-[state=open]:bg-accent dark:data-[state=open]:bg-accent/50 px-2"
                >
                    <span className="w-full max-w-60 truncate">{title ? title : "Untitled"}</span>
                </CustomButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={4}
                alignOffset={-24}
                className="w-72 rounded-lg font-sans"
            >
                <input
                    type="text"
                    className="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-7 w-full min-w-0 rounded-md border-none bg-transparent px-3 py-1 text-sm outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Untitled"
                    value={title}
                    disabled={settings.readOnly}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
