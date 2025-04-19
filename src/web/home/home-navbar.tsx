import { Icons } from "@/assets/icons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { GithubIcon } from "lucide-react";
import { Link, NavLink } from "react-router";

export function HomeNavbar() {
    return (
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between p-4">
            <Link to="/" className="flex items-center justify-center gap-1">
                <Icons.LogoTiptor className="size-6" />
                <span className="text-xl font-medium">Tiptor</span>
            </Link>

            <div className="flex items-center justify-center gap-4">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "text-foreground" : "text-muted-foreground"
                    }
                >
                    Default
                </NavLink>
                <NavLink
                    to="/notion-style"
                    className={({ isActive }) =>
                        isActive ? "text-foreground" : "text-muted-foreground"
                    }
                >
                    Notion
                </NavLink>
            </div>
            <div className="flex items-center justify-center gap-4 max-xs:hidden">
                <Link to="https://github.com/harshwasthere/tiptor.git" target="_blank">
                    <GithubIcon className="size-5 cursor-pointer" />
                </Link>
                <ThemeToggle />
            </div>
        </div>
    );
}
