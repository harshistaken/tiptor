import { type Editor, useCurrentEditor } from "@tiptap/react";
import { useMemo } from "react";

export function useResolvedEditor(providedEditor?: Editor | null) {
    const { editor: editorFromContext } = useCurrentEditor();

    return useMemo(() => providedEditor || editorFromContext, [providedEditor, editorFromContext]);
}
