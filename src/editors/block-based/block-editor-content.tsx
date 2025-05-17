export function BlockEditorContent() {
  return (
    <main className="bg-block-bg-default z-1 flex flex-col w-full h-[calc(100vh-44px)] max-h-full shrink-1 grow-0">
      <div className="contents">
        <div className="bg-block-bg-red z-1 flex flex-col items-center mr-0 mb-0 overflow-x-hidden overflow-y-auto grow-1">
          {/* TODO: remove the bg-block-bg-red color when start working on the content */}
        </div>
      </div>
    </main>
  );
}
