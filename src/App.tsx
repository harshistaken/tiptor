import { EditorContainer } from "./editors/editor-container";
import { EditorHeader } from "./editors/editor-header";
import { EditorContent } from "./editors/editor-content";
import { EditorContextProvider } from "./contexts/editor-context";
import { EditorProvider } from "./editors/editor-provider";

function App() {
    return (
        <EditorContextProvider>
            <EditorProvider>
                <EditorContainer>
                    <EditorHeader />
                    <EditorContent />
                </EditorContainer>
            </EditorProvider>
        </EditorContextProvider>
    );
}

export default App;
