import React from "react";

type EditorSettings = {
    smallText: boolean;
    fullWidth: boolean;
    tableOfContents: boolean;
};

type EditorSettingsContextType = {
    settings: EditorSettings;
    setSettings: (settings: EditorSettings) => void;
};

const EditorSettingsContext = React.createContext<
    EditorSettingsContextType | undefined
>(undefined);

export const useEditorSettingsContext = () => {
    const context = React.useContext(EditorSettingsContext);
    if (!context) {
        throw new Error(
            "useEditorSettings must be used within a EditorSettingsProvider",
        );
    }
    return context;
};

export const EditorSettingsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [settings, setSettings] = React.useState<EditorSettings>({
        smallText: false,
        fullWidth: false,
        tableOfContents: false,
    });

    return (
        <EditorSettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </EditorSettingsContext.Provider>
    );
};
