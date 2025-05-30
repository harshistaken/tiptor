import React from "react";
import { cn } from "@/lib/utils";
import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function MultiLanguageCodeBlock({
    node: {
        attrs: { language: defaultLanguage },
    },
    updateAttributes,
    extension,
}: NodeViewProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <NodeViewWrapper className="group/codeblock relative">
            <Select
                open={open}
                onOpenChange={setOpen}
                defaultValue={defaultLanguage}
                onValueChange={(value: string) => updateAttributes({ language: value })}
            >
                <SelectTrigger
                    size="sm"
                    className={cn(
                        "absolute top-2 right-2 z-20 cursor-pointer text-xs data-[size=sm]:h-6 [&_svg]:size-3",
                        "hover:bg-foreground/5 rounded-[calc(var(--radius)-6px)] border-none py-1 opacity-0 shadow-none transition-opacity duration-300 ease-in-out group-hover/codeblock:opacity-100 data-[state=open]:opacity-100",
                    )}
                >
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent
                    contentEditable={false}
                    className="max-h-[min(var(--radix-select-content-available-height),20rem)] w-[var(--radix-select-trigger-width)] p-0 [&_svg]:size-3"
                >
                    <SelectGroup>
                        <SelectLabel className="text-muted-foreground text-[9px] uppercase">Languages</SelectLabel>
                        {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
                            <SelectItem key={index} value={lang} className="h-7 cursor-pointer text-xs">
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <pre>
                <NodeViewContent as="code" />
            </pre>
        </NodeViewWrapper>
    );
}
