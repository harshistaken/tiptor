import { cn } from "@/lib/utils";
import React from "react";

const IS_MAC = typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac");

const MAC_SYMBOLS: Record<string, string> = {
    ctrl: "⌘",
    alt: "⌥",
    shift: "⇧",
} as const;

function formatShortcutKey(key: string): string {
    const trimmedKey = key.trim();
    if (IS_MAC) {
        const lowerKey = trimmedKey.toLowerCase();
        return MAC_SYMBOLS[lowerKey] || trimmedKey.toUpperCase();
    }
    return trimmedKey.charAt(0).toUpperCase() + trimmedKey.slice(1);
}

export function ShortcutKey({ shortcutKey, className }: { shortcutKey: string | undefined; className?: string }) {
    const formattedKeys = React.useMemo(() => {
        if (!shortcutKey) return [];
        return shortcutKey.split("-").map(formatShortcutKey);
    }, [shortcutKey]);

    if (formattedKeys.length === 0) return null;

    return (
        <kbd
            className={cn("text-muted-foreground inline-flex items-center justify-center gap-1 select-none", className)}
        >
            {formattedKeys.map((key, index) => (
                <React.Fragment key={index}>{key}</React.Fragment>
            ))}
        </kbd>
    );
}
