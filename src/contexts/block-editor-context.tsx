import React from "react";

type IconType = {
    type: "image" | "emoji";
    value: string;
};

type BlockEditorContextType = {
    icon: IconType | null;
    title: string;
    content: string;
    setIcon: (icon: IconType | null) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
};

const BlockEditorContext = React.createContext<
    BlockEditorContextType | undefined
>(undefined);

export const useBlockEditorContext = () => {
    const context = React.useContext(BlockEditorContext);
    if (!context) {
        throw new Error(
            "useBlockEditor must be used within a BlockEditorProvider",
        );
    }

    return context;
};

export const BlockEditorContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [icon, setIcon] = React.useState<IconType | null>({
        type: "emoji",
        value: "🖐🏻",
    });
    const [title, setTitle] = React.useState("Antialiased");
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

    return (
        <BlockEditorContext.Provider value={value}>
            {children}
        </BlockEditorContext.Provider>
    );
};
