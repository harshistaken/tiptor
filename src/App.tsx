import { BlockEditorContainer } from "./editors/block-based/block-editor-container";
import { BlockEditorHeader } from "./editors/block-based/block-editor-header";
import { BlockEditorContent } from "./editors/block-based/block-editor-content";
import { BlockEditorContextProvider } from "./contexts/block-editor-context";
import { BlockEditorProvider } from "./editors/block-based/block-editor-provider";

function App() {
    return (
        <BlockEditorContextProvider>
            <BlockEditorProvider>
                <BlockEditorContainer>
                    <BlockEditorHeader />
                    <BlockEditorContent />
                </BlockEditorContainer>
            </BlockEditorProvider>
        </BlockEditorContextProvider>
    );
}

export default App;
