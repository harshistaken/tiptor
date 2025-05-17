import { Icons } from "@/assets/icons";
import { Button } from "@/components/ui/button";

export function BlockEditorHeader() {
  return (
    <header className="bg-block-bg-default z-[100] w-full max-w-screen select-none">
      <div className="flex justify-between items-center p-4 w-full h-11 overflow-hidden">
        {/* Add the header content here */}
        <Button
          variant="ghost"
          size="icon"
          className="text-block-fg-default hover:bg-block-bg-hover hover:text-block-fg-default active:bg-block-bg-active size-6 cursor-pointer shrink-0"
        >
          <Icons.MaterialArrowBack className="!size-5" />
        </Button>
      </div>
    </header>
  );
}
