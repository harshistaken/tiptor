import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

function CustomDropdown({ children, ...props }: React.ComponentProps<typeof DropdownMenu>) {
    return <DropdownMenu {...props}>{children}</DropdownMenu>;
}

function CustomDropdownPortal({ children, ...props }: React.ComponentProps<typeof DropdownMenuPortal>) {
    return <DropdownMenuPortal {...props}>{children}</DropdownMenuPortal>;
}

function CustomDropdownTrigger({ children, ...props }: React.ComponentProps<typeof DropdownMenuTrigger>) {
    return <DropdownMenuTrigger {...props}>{children}</DropdownMenuTrigger>;
}

function CustomDropdownContent({ children, ...props }: React.ComponentProps<typeof DropdownMenuContent>) {
    return <DropdownMenuContent {...props}>{children}</DropdownMenuContent>;
}

function CustomDropdownGroup({ children, className, ...props }: React.ComponentProps<typeof DropdownMenuGroup>) {
    return (
        <DropdownMenuGroup {...props} className={cn("space-y-[1px]", className)}>
            {children}
        </DropdownMenuGroup>
    );
}

function CustomDropdownItem({ children, className, ...props }: React.ComponentProps<typeof DropdownMenuItem>) {
    return (
        <DropdownMenuItem {...props} className={cn("h-7 cursor-pointer", className)}>
            {children}
        </DropdownMenuItem>
    );
}

function CustomDropdownCheckboxItem({
    children,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuCheckboxItem>) {
    return (
        <DropdownMenuCheckboxItem {...props} className={cn("h-7 cursor-pointer", className)}>
            {children}
        </DropdownMenuCheckboxItem>
    );
}

function CustomDropdownRadioGroup({ children, ...props }: React.ComponentProps<typeof DropdownMenuRadioGroup>) {
    return <DropdownMenuRadioGroup {...props}>{children}</DropdownMenuRadioGroup>;
}

function CustomDropdownRadioItem({
    children,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuRadioItem>) {
    return (
        <DropdownMenuRadioItem {...props} className={cn("h-7 cursor-pointer", className)}>
            {children}
        </DropdownMenuRadioItem>
    );
}

function CustomDropdownSwitchItem({
    children,
    className,
    checked = false,
    onCheckedChange,
    ...props
}: Omit<React.ComponentProps<typeof DropdownMenuItem>, "onSelect"> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
}) {
    return (
        <DropdownMenuItem
            {...props}
            className={cn("h-7 cursor-pointer", className)}
            onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCheckedChange?.(!checked);
            }}
        >
            {children}
            <Switch
                checked={checked}
                className={cn(
                    "ml-auto h-4 w-7 cursor-pointer [&>span]:size-3 [&>span]:data-[state=checked]:translate-x-[calc(100%+1px)] [&>span]:data-[state=unchecked]:translate-x-[1px]",
                )}
            />
        </DropdownMenuItem>
    );
}

function CustomDropdownLabel({ children, className, ...props }: React.ComponentProps<typeof DropdownMenuLabel>) {
    return (
        <DropdownMenuLabel {...props} className={cn("", className)}>
            {children}
        </DropdownMenuLabel>
    );
}

function CustomDropdownSeparator({
    children,
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
    return (
        <DropdownMenuSeparator {...props} className={cn("mx-auto w-[calc(100%-1rem)]", className)}>
            {children}
        </DropdownMenuSeparator>
    );
}

function CustomDropdownShortcut({ children, ...props }: React.ComponentProps<typeof DropdownMenuShortcut>) {
    return <DropdownMenuShortcut {...props}>{children}</DropdownMenuShortcut>;
}

function CustomDropdownSub({ children, ...props }: React.ComponentProps<typeof DropdownMenuSub>) {
    return <DropdownMenuSub {...props}>{children}</DropdownMenuSub>;
}

function CustomDropdownSubTrigger({ children, ...props }: React.ComponentProps<typeof DropdownMenuSubTrigger>) {
    return <DropdownMenuSubTrigger {...props}>{children}</DropdownMenuSubTrigger>;
}

function CustomDropdownSubContent({ children, ...props }: React.ComponentProps<typeof DropdownMenuSubContent>) {
    return <DropdownMenuSubContent {...props}>{children}</DropdownMenuSubContent>;
}

export {
    CustomDropdown,
    CustomDropdownPortal,
    CustomDropdownTrigger,
    CustomDropdownContent,
    CustomDropdownGroup,
    CustomDropdownItem,
    CustomDropdownCheckboxItem,
    CustomDropdownRadioItem,
    CustomDropdownRadioGroup,
    CustomDropdownLabel,
    CustomDropdownSeparator,
    CustomDropdownShortcut,
    CustomDropdownSub,
    CustomDropdownSubTrigger,
    CustomDropdownSubContent,
    CustomDropdownSwitchItem,
};
