import React from "react";

type EditorContextType = {
    title: string;
    content: string;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
};

const EditorContext = React.createContext<EditorContextType | undefined>(undefined);

export const useEditorContext = () => {
    const context = React.useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within a EditorProvider");
    }

    return context;
};

export const EditorContextProvider = ({ children }: { children: React.ReactNode }) => {
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

    return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};
