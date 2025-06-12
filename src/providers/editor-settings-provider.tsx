import React from "react";

// --- Types ---

type EditorSettings = {
    readOnly: boolean;
    smallText: boolean;
    fullWidth: boolean;
    tableOfContents: boolean;
};

type EditorSettingsContextType = {
    settings: EditorSettings;
    setSettings: (settings: EditorSettings) => void;
    updateSettings: (partialSettings: Partial<EditorSettings>) => void;
};

// --- Constants ---

const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
    readOnly: false,
    smallText: false,
    fullWidth: false,
    tableOfContents: false,
};

const STORAGE_KEY = "editor-settings";

// --- Utilities ---

const loadSettingsFromStorage = (): EditorSettings => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Merge with defaults to handle missing properties
            return { ...DEFAULT_EDITOR_SETTINGS, ...parsed };
        }
    } catch (error) {
        console.warn("Failed to load editor settings from localStorage:", error);
    }
    return DEFAULT_EDITOR_SETTINGS;
};

const saveSettingsToStorage = (settings: EditorSettings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.warn("Failed to save editor settings to localStorage:", error);
    }
};

// --- Context ---

const EditorSettingsContext = React.createContext<EditorSettingsContextType | undefined>(undefined);

export const useEditorSettings = () => {
    const context = React.useContext(EditorSettingsContext);
    if (!context) {
        throw new Error("useEditorSettings must be used within a EditorSettingsProvider");
    }
    return context;
};

// --- Provider ---

export const EditorSettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [settingsState, setSettingsState] = React.useState<EditorSettings>(loadSettingsFromStorage);

    const setSettings = React.useCallback((newSettings: EditorSettings) => {
        setSettingsState(newSettings);
        saveSettingsToStorage(newSettings);
    }, []);

    const updateSettings = React.useCallback((partialSettings: Partial<EditorSettings>) => {
        setSettingsState((prevSettings) => {
            const newSettings = { ...prevSettings, ...partialSettings };
            saveSettingsToStorage(newSettings);
            return newSettings;
        });
    }, []);

    const value = React.useMemo(
        () => ({
            settings: settingsState,
            setSettings,
            updateSettings,
        }),
        [settingsState, setSettings, updateSettings],
    );

    return <EditorSettingsContext.Provider value={value}>{children}</EditorSettingsContext.Provider>;
};
