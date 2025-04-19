import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <div
            className="relative size-5 cursor-pointer"
            onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
        >
            <Sun className="absolute size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </div>
    );
}
