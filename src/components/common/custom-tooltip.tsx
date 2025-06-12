import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function CustomTooltip({
    tooltipTrigger,
    tooltipContent,
    className,
}: {
    tooltipTrigger: React.ReactNode;
    tooltipContent: React.ReactNode;
    className?: string;
}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{tooltipTrigger}</TooltipTrigger>
                <TooltipContent
                    className={cn(
                        "bg-accent fill-accent [&_svg]:bg-accent [&_svg]:fill-accent flex flex-col items-center justify-center",
                        className,
                    )}
                >
                    {tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
