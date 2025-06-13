import { ThemeProvider } from "@/providers/theme-provider";
import { EditorSettingsProvider } from "./providers/editor-settings-provider";
import { EditorProvider } from "./providers/editor-provider";
import { EditorContainer } from "./layout/editor-container";
import { EditorHeader } from "./layout/editor-header";
import { EditorBody } from "./layout/editor-body";
import { EditorContentContextProvider, useEditorContentContext } from "./providers/editor-content-provider";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <EditorSettingsProvider>
                <EditorContentContextProvider>
                    <Editor />
                </EditorContentContextProvider>
            </EditorSettingsProvider>
        </ThemeProvider>
    );
}

const Editor = () => {
    const { content, setContent } = useEditorContentContext();
    return (
        <EditorProvider content={content} onContentChange={setContent}>
            <EditorContainer>
                <EditorHeader />
                <EditorBody />
            </EditorContainer>
        </EditorProvider>
    );
};

export default App;
