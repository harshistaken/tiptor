"use client";

import * as React from "react";
import { Editor, useCurrentEditor } from "@tiptap/react";

export function useTiptapEditor(editorFromProps?: Editor | null): Editor | null {
    const { editor: editorFromContext } = useCurrentEditor();
    return React.useMemo(
        () => editorFromProps || editorFromContext,
        [editorFromProps, editorFromContext],
    );
}
