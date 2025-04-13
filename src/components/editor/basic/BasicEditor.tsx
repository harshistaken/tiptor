import { useBaseEditor } from "@/lib/useBaseEditor";
import { BasicEditorContent } from "./BasicEditorContent";
import { BasicEditorHeader } from "./BasicEditorHeader";

export function BasicEditor() {
    const editor = useBaseEditor({});

    return (
        <div className="max-w-6xl w-full h-[700px] flex flex-col border rounded-xl shadow-sm">
            <BasicEditorHeader editor={editor} />
            <BasicEditorContent />
        </div>
    );
}
