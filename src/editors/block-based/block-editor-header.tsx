import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useBlockEditorContext } from "@/contexts/block-editor-context";
import { cn } from "@/lib/utils";

export function BlockEditorHeader() {
    return (
        <header className="bg-tiptor-background z-[100] w-full max-w-screen select-none">
            <div className="flex h-11 w-full items-center justify-between overflow-hidden p-4">
                {/* Add the header content here */}
                <div className="flex items-center justify-center gap-2">
                    <BacktoHomeButton />
                    <EditablePageTitleWithIcon />
                </div>
            </div>
        </header>
    );
}

function BacktoHomeButton() {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "size-7 shrink-0 cursor-pointer",
                "text-tiptor-foreground font-normal",
                "hover:text-tiptor-foreground hover:bg-tiptor-secondary",
            )}
        >
            <Icons.MaterialArrowBack className="size-5" />
        </Button>
    );
}

function EditablePageTitleWithIcon() {
    const { icon, title } = useBlockEditorContext();

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "h-7 w-fit shrink-0 cursor-pointer px-2",
                "text-tiptor-foreground font-normal",
                "hover:text-tiptor-foreground hover:bg-tiptor-secondary",
            )}
        >
            {icon &&
                (icon.type === "image" ? (
                    <img
                        src={icon.value}
                        alt={title}
                        className="size-5 object-contain"
                    />
                ) : (
                    <div className="text-lg leading-none">
                        <span
                            style={{
                                whiteSpace: "nowrap",
                                fontFamily:
                                    "Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
                                opacity: 1,
                            }}
                            className="text-white"
                        >
                            {icon.value}
                        </span>
                    </div>
                ))}
            <span className="w-full max-w-60 truncate leading-[1.2]">
                {title ? title : "New page"}
            </span>
        </Button>
    );
}
