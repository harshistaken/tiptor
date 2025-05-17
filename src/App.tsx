import { BlockEditorContainer } from "./editors/block-based/block-editor-container";
import { BlockEditorHeader } from "./editors/block-based/block-editor-header";
import { BlockEditorContent } from "./editors/block-based/block-editor-content";

function App() {
  return (
    <BlockEditorContainer>
      <BlockEditorHeader />
      <BlockEditorContent />
    </BlockEditorContainer>
  );
}

export default App;
