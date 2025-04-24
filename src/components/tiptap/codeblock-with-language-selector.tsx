import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React from "react";
import { cn } from "@/lib/utils";

export function CodeBlockWithLanguageSelector({
    node: {
        attrs: { language: defaultLanguage },
    },
    updateAttributes,
    extension,
}: NodeViewProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <NodeViewWrapper className="relative">
            <Select
                open={open}
                onOpenChange={setOpen}
                defaultValue={defaultLanguage}
                onValueChange={(value: string) => updateAttributes({ language: value })}
            >
                <SelectTrigger
                    size="sm"
                    className={cn(
                        "absolute z-20 data-[size=sm]:h-6 top-2 right-2 cursor-pointer text-xs [&_svg]:size-3",
                        "border-none py-1 hover:bg-foreground/5 shadow-none rounded-[calc(var(--radius)-6px)]",
                    )}
                >
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent
                    contentEditable={false}
                    className="max-h-[min(var(--radix-select-content-available-height),20rem)] w-[var(--radix-select-trigger-width)] p-0 [&_svg]:size-3 "
                >
                    <SelectGroup>
                        <SelectLabel className="text-[9px] uppercase text-muted-foreground">
                            Languages
                        </SelectLabel>
                        {extension.options.lowlight
                            .listLanguages()
                            .map((lang: string, index: number) => (
                                <SelectItem
                                    key={index}
                                    value={lang}
                                    className="text-xs h-7 cursor-pointer"
                                >
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
