import { EditorContent, type Editor } from "@tiptap/react";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

export function EditorContentContainer({ providedEditor }: { providedEditor?: Editor }) {
    const editor = useTiptapEditor(providedEditor);

    if (!editor) return null;

    return (
        <main className="bg-background flex h-[calc(100vh-44px)] w-full flex-col">
            <div className="flex-1 overflow-y-auto">
                <div
                    className="grid w-full grid-cols-[[full-start]_var(--margin-left-width,_var(--margin-width))_[content-start]_var(--content-width)_[content-end]_var(--margin-right-width,_var(--margin-width))_[full-end]] pb-[30vh]"
                    style={
                        {
                            "--content-width": "minmax(auto, 708px)",
                            "--margin-width": "minmax(96px, 1fr)",
                        } as React.CSSProperties
                    }
                >
                    <EditorContent editor={editor} role="presentation" className="col-[content] mt-20 w-full" />
                </div>
            </div>
        </main>
    );
}
