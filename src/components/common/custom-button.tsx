import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

function CustomButton({ children, size, className, ...props }: React.ComponentProps<typeof Button>) {
    // Define size-based height classes
    const sizeClasses = {
        sm: "h-7",
        default: "h-8",
        lg: "h-9",
        icon: "size-7",
    };

    // Get the appropriate size class
    const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default;

    return (
        <Button {...props} size={size} className={cn("cursor-pointer font-normal", sizeClass, className)}>
            {children}
        </Button>
    );
}

export { CustomButton };
