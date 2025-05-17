export function BlockEditorContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-tiptor-background text-tiptor-foreground flex h-full w-full flex-1 cursor-text font-sans outline-none">
            <div className="isolation-auto flex h-full w-full flex-col overflow-hidden bg-transparent">
                {children}
            </div>
        </div>
    );
}
