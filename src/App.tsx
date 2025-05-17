import { BlockEditorContainer } from "./editors/block-based/block-editor-container";
import { BlockEditorHeader } from "./editors/block-based/block-editor-header";
import { BlockEditorContent } from "./editors/block-based/block-editor-content";
import { BlockEditorContextProvider } from "./contexts/block-editor-context";

function App() {
    return (
        <BlockEditorContextProvider>
            <BlockEditorContainer>
                <BlockEditorHeader />
                <BlockEditorContent />
            </BlockEditorContainer>
        </BlockEditorContextProvider>
    );
}

export default App;
