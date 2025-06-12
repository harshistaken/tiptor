import { CustomSwitch } from "../common/custom-switch";
import { useEditorSettings } from "@/providers/editor-settings-provider";

export function ReadOnlyModeToggle() {
    const { settings, updateSettings } = useEditorSettings();

    return (
        <div className="ml-1 flex h-7 w-fit items-center justify-center gap-2">
            <CustomSwitch
                checked={settings.readOnly}
                onCheckedChange={(checked) => updateSettings({ readOnly: checked })}
            />
            <span className="text-muted-foreground text-xs">{settings.readOnly ? "READ ONLY" : "EDITABLE"}</span>
        </div>
    );
}
