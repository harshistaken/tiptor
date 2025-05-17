import React from "react";

type BlockEditorContextType = {
    icon: Element | null;
    title: string;
    content: string;
    setIcon: (icon: Element | null) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
};

const BlockEditorContext = React.createContext<BlockEditorContextType | undefined>(undefined);

export const useBlockEditor = () => {
    const context = React.useContext(BlockEditorContext);
    if (!context) {
        throw new Error("useBlockEditor must be used within a BlockEditorProvider");
    }

    return context;
};

export const BlockEditorProvider = ({ children }: { children: React.ReactNode }) => {
    const [icon, setIcon] = React.useState<Element | null>(null);
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");

    const value = React.useMemo(
        () => ({
            icon,
            title,
            content,
            setIcon,
            setTitle,
            setContent,
        }),
        [icon, title, content],
    );

    return <BlockEditorContext.Provider value={value}>{children}</BlockEditorContext.Provider>;
};
