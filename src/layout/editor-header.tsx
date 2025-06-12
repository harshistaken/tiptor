import { useNavigate } from "react-router";
import { Icons } from "@/assets/icons";
import { CustomButton } from "@/components/common/custom-button";
import { MoreDropdown } from "@/components/header/more-dropdown";
import { TitleEditDropdown } from "@/components/header/title-edit-dropdown";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { ReadOnlyModeToggle } from "@/components/header/read-only-mode-toggle";

export function EditorHeader() {
    return (
        <header className="bg-background z-10 w-full max-w-screen select-none">
            <div className="flex h-11 w-full items-center justify-between overflow-hidden px-4">
                <div className="flex h-full items-center justify-center gap-1">
                    <BackToHomeButton />
                    <TitleEditDropdown />
                    <ReadOnlyModeToggle />
                </div>
                <div className="flex h-full items-center justify-center gap-2">
                    <ThemeToggle />
                    <MoreDropdown />
                </div>
            </div>
        </header>
    );
}

function BackToHomeButton() {
    const navigate = useNavigate();
    return (
        <CustomButton variant="ghost" size="icon" onClick={() => navigate("/")}>
            <Icons.TiptorLogo className="size-5 shrink-0" />
        </CustomButton>
    );
}
