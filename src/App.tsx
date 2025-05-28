import { EditorContainer } from "./editors/editor-container";
import { EditorHeader } from "./editors/editor-header";
import { EditorContentContainer } from "./editors/editor-content-container";

// Contexts Providers
import { ThemeProvider } from "./components/theme/theme-provider";
import { EditorSettingsContextProvider } from "./contexts/editor-settings-context";
import { EditorContextProvider } from "./contexts/editor-context";
import { EditorProvider } from "./editors/editor-provider";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <EditorSettingsContextProvider>
                <EditorContextProvider>
                    <EditorProvider>
                        <EditorContainer>
                            <EditorHeader />
                            <EditorContentContainer />
                        </EditorContainer>
                    </EditorProvider>
                </EditorContextProvider>
            </EditorSettingsContextProvider>
        </ThemeProvider>
    );
}

export default App;
