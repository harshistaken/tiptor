import * as React from "react";

export function useWindowSize() {
    const [windowSize, setWindowSize] = React.useState<{
        width: number | undefined;
        height: number | undefined;
    }>({
        width: typeof window !== "undefined" ? window.innerWidth : undefined,
        height: typeof window !== "undefined" ? window.innerHeight : undefined,
    });

    React.useEffect(() => {
        // This effect should only run on the client
        if (typeof window === "undefined") {
            return;
        }

        const handleResize = () => {
            // Use visualViewport if available, fallback to innerWidth/Height
            const width = window.visualViewport?.width ?? window.innerWidth;
            const height = window.visualViewport?.height ?? window.innerHeight;

            setWindowSize((state) => {
                // Avoid state update if size hasn't changed
                if (width === state.width && height === state.height) {
                    return state;
                }
                return { width, height };
            });
        };

        // Set initial size correctly
        handleResize();

        // Add event listeners
        window.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("resize", handleResize);
        window.visualViewport?.addEventListener("scroll", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("resize", handleResize);
            window.visualViewport?.removeEventListener("scroll", handleResize);
        };
    }, []);

    return windowSize;
}
