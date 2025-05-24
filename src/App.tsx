import { EditorContainer } from "./editors/editor-container";
import { EditorHeader } from "./editors/editor-header";
import { EditorContent } from "./editors/editor-content";
import { EditorProvider } from "./editors/editor-provider";
import { EditorContextProvider } from "./contexts/editor-context";
import { EditorSettingsProvider } from "./contexts/editor-settings-context";

function App() {
    return (
        <EditorSettingsProvider>
            <EditorContextProvider>
                <EditorProvider>
                    <EditorContainer>
                        <EditorHeader />
                        <EditorContent />
                    </EditorContainer>
                </EditorProvider>
            </EditorContextProvider>
        </EditorSettingsProvider>
    );
}

export default App;
