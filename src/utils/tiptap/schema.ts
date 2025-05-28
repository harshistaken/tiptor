import { Editor } from "@tiptap/react";

export const isMarkInSchema = (markName: string, editor: Editor | null) =>
    editor?.schema.spec.marks.get(markName) !== undefined;

export const isNodeInSchema = (nodeName: string, editor: Editor | null) =>
    editor?.schema.spec.nodes.get(nodeName) !== undefined;
