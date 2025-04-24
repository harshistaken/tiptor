import { DefaultEditorContent } from "@/editors/default-style/default-editor-content";
import { DefaultEditorProvider } from "@/editors/default-style/default-editor-provider";
import { DefaultEditorToolbar } from "@/editors/default-style/default-editor-toolbar";

export function DefaultEditorTemplate() {
    return (
        <DefaultEditorProvider>
            <div className="w-full max-w-6xl h-[44rem] flex flex-col border shadow-sm rounded-xl">
                <DefaultEditorToolbar
                    className="rounded-t-xl"
                    leftOverlayClassName="rounded-tl-xl"
                    rightOverlayClassName="rounded-tr-xl"
                />
                <DefaultEditorContent className="rounded-b-xl" />
            </div>
        </DefaultEditorProvider>
    );
}
