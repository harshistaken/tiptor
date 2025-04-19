import * as React from "react";

export function useMobile(mobileBreakpoint: number = 768) {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

    React.useEffect(() => {
        const query = window.matchMedia(`(max-width: ${mobileBreakpoint - 1}px)`);

        const onChange = () => {
            setIsMobile(window.innerWidth < mobileBreakpoint);
        };

        query.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < mobileBreakpoint);
        return () => query.removeEventListener("change", onChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return !!isMobile;
}
