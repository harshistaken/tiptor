import { useBaseEditor } from "@/lib/useBaseEditor";
import { BasicEditorContent } from "./BasicEditorContent";
import { BasicEditorHeader } from "./BasicEditorHeader";

export function BasicEditor() {
    const editor = useBaseEditor({
        initialContent: "",
    });

    return (
        // add some background color for dark mode as it's look all black
        <div className="max-w-6xl w-full h-[700px] flex flex-col border rounded-xl shadow-sm dark:bg-foreground/5">
            <BasicEditorHeader editor={editor} />
            <BasicEditorContent editor={editor} />
        </div>
    );
}
