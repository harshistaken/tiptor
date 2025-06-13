import React from "react";

type EditorContentContextType = {
    title: string;
    content: string;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
};

const EditorContentContext = React.createContext<EditorContentContextType | undefined>(undefined);

export const useEditorContentContext = () => {
    const context = React.useContext(EditorContentContext);
    if (!context) {
        throw new Error("useEditorContentContext must be used within a EditorContentContextProvider");
    }

    return context;
};

export const EditorContentContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [title, setTitle] = React.useState("Canvas");
    const [content, setContent] = React.useState("");

    const value = React.useMemo(
        () => ({
            title,
            content,
            setTitle,
            setContent,
        }),
        [title, content],
    );

    return <EditorContentContext.Provider value={value}>{children}</EditorContentContext.Provider>;
};
