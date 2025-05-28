import { EditorContainer } from "./editors/editor-container";
import { EditorHeader } from "./editors/editor-header";
import { EditorContentContainer } from "./editors/editor-content-container";
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
                        <EditorContentContainer />
                    </EditorContainer>
                </EditorProvider>
            </EditorContextProvider>
        </EditorSettingsProvider>
    );
}

export default App;
