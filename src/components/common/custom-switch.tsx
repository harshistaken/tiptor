import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";

function CustomSwitch({ className, ...props }: React.ComponentProps<typeof Switch>) {
    return (
        <Switch
            {...props}
            className={cn(
                "h-4 w-7 cursor-pointer [&>span]:size-3 [&>span]:data-[state=checked]:translate-x-[calc(100%+1px)] [&>span]:data-[state=unchecked]:translate-x-[1px]",
                className,
            )}
        />
    );
}

export { CustomSwitch };
