import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <div
            className="relative size-5 cursor-pointer"
            onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
        >
            <Sun className="absolute size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        </div>
    );
}
