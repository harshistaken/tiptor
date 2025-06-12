import { MoonIcon, SunIcon } from "lucide-react";
import { CustomButton } from "@/components/common/custom-button";
import { useTheme } from "@/providers/theme-provider";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <CustomButton
            variant="ghost"
            size="icon"
            onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
            className="relative"
        >
            <MoonIcon className="absolute size-4 shrink-0 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <SunIcon className="absolute size-4 shrink-0 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </CustomButton>
    );
}
