import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const mergeRefs = <T,>(
    refs: Array<React.RefObject<T> | React.Ref<T> | null | undefined>,
): React.RefCallback<T> => {
    return (value) => {
        refs.forEach((ref) => {
            if (typeof ref === "function") {
                ref(value);
            } else if (ref != null) {
                (ref as React.RefObject<T | null>).current = value;
            }
        });
    };
};

const useObserveVisibility = (
    ref: React.RefObject<HTMLElement | null>,
    callback: () => void,
): void => {
    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        let isMounted = true;

        if (isMounted) {
            requestAnimationFrame(callback);
        }

        const observer = new MutationObserver(() => {
            if (isMounted) {
                requestAnimationFrame(callback);
            }
        });

        observer.observe(element, {
            childList: true,
            subtree: true,
            attributes: true,
        });

        return () => {
            isMounted = false;
            observer.disconnect();
        };
    }, [ref, callback]);
};

const useToolbarKeyboardNav = (toolbarRef: React.RefObject<HTMLDivElement | null>): void => {
    React.useEffect(() => {
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        const getFocusableElements = () =>
            Array.from(
                toolbar.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [role="button"]:not([disabled]), [tabindex="0"]:not([disabled])',
                ),
            );

        const navigateToIndex = (
            e: KeyboardEvent,
            targetIndex: number,
            elements: HTMLElement[],
        ) => {
            e.preventDefault();
            let nextIndex = targetIndex;

            if (nextIndex >= elements.length) {
                nextIndex = 0;
            } else if (nextIndex < 0) {
                nextIndex = elements.length - 1;
            }

            elements[nextIndex]?.focus();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const focusableElements = getFocusableElements();
            if (!focusableElements.length) return;

            const currentElement = document.activeElement as HTMLElement;
            const currentIndex = focusableElements.indexOf(currentElement);

            if (!toolbar.contains(currentElement)) return;

            const keyActions: Record<string, () => void> = {
                ArrowRight: () => navigateToIndex(e, currentIndex + 1, focusableElements),
                ArrowDown: () => navigateToIndex(e, currentIndex + 1, focusableElements),
                ArrowLeft: () => navigateToIndex(e, currentIndex - 1, focusableElements),
                ArrowUp: () => navigateToIndex(e, currentIndex - 1, focusableElements),
                Home: () => navigateToIndex(e, 0, focusableElements),
                End: () => navigateToIndex(e, focusableElements.length - 1, focusableElements),
            };

            const action = keyActions[e.key];
            if (action) {
                action();
            }
        };

        toolbar.addEventListener("keydown", handleKeyDown);
        return () => toolbar.removeEventListener("keydown", handleKeyDown);
    }, [toolbarRef]);
};

const useToolbarVisibility = (ref: React.RefObject<HTMLDivElement | null>): boolean => {
    const [isVisible, setIsVisible] = React.useState(true);
    const isMountedRef = React.useRef(false);

    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const checkVisibility = React.useCallback(() => {
        if (!isMountedRef.current) return;

        const toolbar = ref.current;
        if (!toolbar) return;

        // Check if any group has visible children
        const hasVisibleChildren = Array.from(toolbar.children).some((child) => {
            if (!(child instanceof HTMLElement)) return false;
            if (child.getAttribute("role") === "toolbar-group") {
                return child.children.length > 0;
            }
            return false;
        });

        setIsVisible(hasVisibleChildren);
    }, [ref]);

    useObserveVisibility(ref, checkVisibility);
    return isVisible;
};

const useGroupVisibility = (ref: React.RefObject<HTMLDivElement | null>): boolean => {
    const [isVisible, setIsVisible] = React.useState(true);
    const isMountedRef = React.useRef(false);

    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const checkVisibility = React.useCallback(() => {
        if (!isMountedRef.current) return;

        const group = ref.current;
        if (!group) return;

        const hasVisibleChildren = Array.from(group.children).some((child) => {
            if (!(child instanceof HTMLElement)) return false;
            return true;
        });

        setIsVisible(hasVisibleChildren);
    }, [ref]);

    useObserveVisibility(ref, checkVisibility);
    return isVisible;
};

const useSeparatorVisibility = (ref: React.RefObject<HTMLDivElement | null>): boolean => {
    const [isVisible, setIsVisible] = React.useState(true);
    const isMountedRef = React.useRef(false);

    React.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const checkVisibility = React.useCallback(() => {
        if (!isMountedRef.current) return;

        const separator = ref.current;
        if (!separator) return;

        const prevSibling = separator.previousElementSibling as HTMLElement;
        const nextSibling = separator.nextElementSibling as HTMLElement;

        if (!prevSibling || !nextSibling) {
            setIsVisible(false);
            return;
        }

        const areBothGroups =
            prevSibling.getAttribute("role") === "toolbar-group" &&
            nextSibling.getAttribute("role") === "toolbar-group";

        const haveBothChildren = prevSibling.children.length > 0 && nextSibling.children.length > 0;

        setIsVisible(areBothGroups && haveBothChildren);
    }, [ref]);

    useObserveVisibility(ref, checkVisibility);
    return isVisible;
};

export const Toolbar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...props }, ref) => {
        const toolbarRef = React.useRef<HTMLDivElement>(null);
        const isVisible = useToolbarVisibility(toolbarRef);

        useToolbarKeyboardNav(toolbarRef);

        if (!isVisible) return null;

        return (
            <div
                ref={mergeRefs([toolbarRef, ref])}
                role="toolbar"
                aria-label="toolbar"
                className={cn(
                    "w-full h-full flex items-center justify-start min-[1038px]:justify-center gap-2 z-10 px-2 overflow-x-auto [&::-webkit-scrollbar]:hidden border-b border-border/50",
                    className,
                )}
                style={{
                    overscrollBehaviorX: "contain",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
                {...props}
            >
                {children}
            </div>
        );
    },
);

Toolbar.displayName = "Toolbar";

export const ToolbarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...props }, ref) => {
        const groupRef = React.useRef<HTMLDivElement>(null);
        const isVisible = useGroupVisibility(groupRef);

        if (!isVisible) return null;

        return (
            <div
                ref={mergeRefs([groupRef, ref])}
                role="toolbar-group"
                className={cn("h-full flex items-center justify-center gap-0.5", className)}
                {...props}
            >
                {children}
            </div>
        );
    },
);

ToolbarGroup.displayName = "ToolbarGroup";

export const ToolbarSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    const separatorRef = React.useRef<HTMLDivElement>(null);
    const isVisible = useSeparatorVisibility(separatorRef);

    if (!isVisible) return null;

    return (
        <Separator
            ref={mergeRefs([separatorRef, ref])}
            role="toolbar-separator"
            orientation="vertical"
            className={cn(
                "shrink-0 rounded-full opacity-50 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-2/4 data-[orientation=vertical]:w-0.5",
                className,
            )}
            decorative
            {...props}
        />
    );
});

ToolbarSeparator.displayName = "ToolbarSeparator";
