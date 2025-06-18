import { NodeViewContent, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { CustomButton } from "../common/custom-button";
import { CopyIcon } from "lucide-react";

export function CodeBlockWithLanguage({ node, updateAttributes, extension }: NodeViewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(node.attrs.language || "plaintext");

    return (
        <NodeViewWrapper className="group/codeblock relative">
            <Select
                open={isOpen}
                onOpenChange={setIsOpen}
                value={selectedLanguage}
                onValueChange={(value) => {
                    setSelectedLanguage(value);
                    updateAttributes({ language: value });
                }}
            >
                <SelectTrigger className="hover:bg-foreground/5 text-muted-foreground data-[state=open]:bg-foreground/5 dark:data-[state=open]:bg-foreground/5 dark:hover:bg-foreground/5 absolute top-[8px] left-[8px] z-10 !h-6 cursor-pointer rounded border-none bg-transparent px-[6px] py-[4px] text-xs capitalize opacity-0 shadow-none transition-opacity duration-200 ease-in-out outline-none group-hover/codeblock:opacity-100 data-[state=open]:opacity-100 dark:bg-transparent [&_svg]:size-3">
                    <SelectValue placeholder="Language">{selectedLanguage}</SelectValue>
                </SelectTrigger>
                <SelectContent
                    contentEditable={false}
                    align="center"
                    className="max-h-[min(var(--radix-select-content-available-height),20rem)] min-w-36 p-0 [&_svg]:size-3"
                >
                    <SelectGroup>
                        <SelectLabel className="text-muted-foreground text-[10px] uppercase">Languages</SelectLabel>
                        {extension.options.lowlight.listLanguages().map((lang: string, index: number) => (
                            <SelectItem key={index} value={lang} className="h-7 cursor-pointer text-xs capitalize">
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <CustomButton
                variant="secondary"
                size="sm"
                className="hover:bg-foreground/5 text-muted-foreground hover:text-muted-foreground dark:hover:bg-foreground/5 absolute top-[8px] right-[8px] z-10 h-6 cursor-pointer gap-1 rounded border-none px-[6px] py-[4px] text-xs opacity-0 shadow-none transition-opacity duration-200 ease-in-out outline-none group-hover/codeblock:opacity-100"
                onClick={() => {
                    navigator.clipboard.writeText(node.textContent);
                }}
            >
                <CopyIcon className="size-3" />
                <span>Copy</span>
            </CustomButton>

            <pre>
                <NodeViewContent as="code" />
            </pre>
        </NodeViewWrapper>
    );
}
