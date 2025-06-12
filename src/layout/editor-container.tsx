export function EditorContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background text-foreground flex h-full w-full flex-1 outline-none">
            <div className="flex h-full w-full flex-col overflow-hidden bg-transparent">{children}</div>
        </div>
    );
}
