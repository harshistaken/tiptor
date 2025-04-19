import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Editor } from "@tiptap/react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const isMarkInSchema = (markName: string, editor: Editor | null) =>
    editor?.schema.spec.marks.get(markName) !== undefined;

export const isNodeInSchema = (nodeName: string, editor: Editor | null) =>
    editor?.schema.spec.nodes.get(nodeName) !== undefined;
