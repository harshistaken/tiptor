import { useResolvedEditor } from "@/hooks/use-resolved-editor";
import { type Editor, EditorContent } from "@tiptap/react";
import { useEditorSettings } from "@/providers/editor-settings-provider";

export function EditorBody({ providedEditor }: { providedEditor?: Editor | null }) {
    const editor = useResolvedEditor(providedEditor);
    const { settings } = useEditorSettings();

    if (!editor) return null;

    return (
        <main className="flex h-[calc(100vh-44px)] w-full flex-col">
            <div className="flex-1 overflow-y-auto">
                <div
                    className="grid w-full grid-cols-[[full-start]_minmax(16px,1fr)_[content-start]_var(--content-width)_[content-end]_minmax(16px,1fr)_[full-end]] pb-[30vh] sm:grid-cols-[[full-start]_minmax(96px,1fr)_[content-start]_var(--content-width)_[content-end]_minmax(96px,1fr)_[full-end]]"
                    style={
                        {
                            "--content-width": settings.fullWidth ? "minmax(auto, 100%)" : "minmax(auto, 708px)",
                        } as React.CSSProperties
                    }
                >
                    <EditorContent editor={editor} role="presentation" className="col-[content] mt-20 w-full" />
                </div>
            </div>
        </main>
    );
}
