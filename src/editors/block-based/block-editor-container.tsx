export function BlockEditorContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-block-bg-default text-block-fg-default flex flex-1 outline-none w-full h-full cursor-text">
      <div className="isolation-auto flex flex-col bg-transparent w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}
