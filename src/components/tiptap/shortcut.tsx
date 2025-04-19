import React from "react";

// Determine platform
const IS_MAC = typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac");

const MAC_SYMBOLS: Record<string, string> = {
    ctrl: "⌘",
    alt: "⌥",
    shift: "⇧",
} as const;

// Formatting function
const formatShortcutKey = (key: string): string => {
    const trimmedKey = key.trim();
    if (IS_MAC) {
        const lowerKey = trimmedKey.toLowerCase();
        return MAC_SYMBOLS[lowerKey] || trimmedKey.toUpperCase();
    }
    return trimmedKey.charAt(0).toUpperCase() + trimmedKey.slice(1);
};

// Component to display shortcut keys
export const Shortcut: React.FC<{ shortcutKey: string | undefined }> = ({ shortcutKey }) => {
    const formattedKeys = React.useMemo(() => {
        if (!shortcutKey) return [];
        return shortcutKey.split("-").map(formatShortcutKey);
    }, [shortcutKey]);

    if (formattedKeys.length === 0) return null;

    return (
        <div>
            <kbd className="pointer-events-none inline-flex select-none items-center gap-1 text-[10px] font-sans text-muted-foreground opacity-100">
                {formattedKeys.map((key, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && "+"}
                        {key}
                    </React.Fragment>
                ))}
            </kbd>
        </div>
    );
};
