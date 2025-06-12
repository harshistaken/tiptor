import { ThemeProvider } from "@/providers/theme-provider";
import { EditorSettingsProvider } from "./providers/editor-settings-provider";
import { EditorProvider } from "./providers/editor-provider";
import { EditorContainer } from "./layout/editor-container";
import { EditorHeader } from "./layout/editor-header";
import { EditorBody } from "./layout/editor-body";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <EditorSettingsProvider>
                <EditorProvider>
                    <EditorContainer>
                        <EditorHeader />
                        <EditorBody />
                    </EditorContainer>
                </EditorProvider>
            </EditorSettingsProvider>
        </ThemeProvider>
    );
}

export default App;
