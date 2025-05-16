# Minimal Editor Project

This project aims to build a lightweight, minimal text editor with a clean user interface. The editor will eventually support two modes:

1.  **Default Editor**: A standard, straightforward text editing experience.
2.  **Notion-Style Editor**: A block-based editor inspired by Notion, allowing for more structured content creation.

The initial development will focus on the **Notion-Style Editor**.

## Project Goals

-   Create a functional block-based editor.
-   Implement common text formatting options.
-   Allow for easy reordering of content blocks.
-   Provide a clean and intuitive user experience.

## Tech Stack

This project will leverage the following technologies:

-   **[Vite](https://vitejs.dev/guide/):** Next-generation front-end tooling for a faster and leaner development experience.
-   **[React.js](https://react.dev/):** A JavaScript library for building user interfaces.
-   **[Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite):** A utility-first CSS framework for rapid UI development.
-   **[Shadcn UI](https://ui.shadcn.com/):** Re-usable components built using Radix UI and Tailwind CSS.
-   **[Tiptap](https://tiptap.dev/docs/editor/getting-started/overview):** A headless, framework-agnostic editor framework built on top of ProseMirror.
-   **[ProseMirror](https://prosemirror.net/docs/):** A toolkit for building rich text editors, which Tiptap is based on.

## To-Do: Notion-Style Editor (Phase 1)

Here's a preliminary checklist of tasks. The order reflects a suggested development sequence.

### Core Functionality

-   [ ] **Project Setup & Build Process**:
    -   [ ] Initialize project structure (e.g., Vite or Next.js with Tailwind CSS, **Tiptap**).
    -   [ ] Set up a build process (e.g., Vite, Webpack) for development and production.
    -   [ ] Basic linter and formatter setup.
    -   [ ] Render basic Tiptap editor instance.
-   [ ] **Editable Content Area**:
    -   [ ] Create a main content area (`contenteditable` div or using Tiptap's framework).
    -   [ ] Apply minimal clean styling for layout and editor appearance.
-   [ ] **Block-Based Architecture (Tiptap Nodes & Marks)**:
    -   [ ] Define the data structure for a "block" (Custom Tiptap Nodes - e.g., `{ id: string, type: string, content: any, properties?: any }`).
    -   [ ] Implement logic to add new blocks (e.g., pressing Enter creates a new paragraph block by default).
    -   [ ] Assign unique IDs to each block where necessary.
    -   [ ] Render different block types based on their Tiptap node type.
-   [ ] **Text Input and Rendering**:
    -   [ ] Ensure basic text input and display within blocks.
    -   [ ] Handle line breaks and paragraph separation within and between blocks.
    -   [ ] Basic cursor management and navigation (arrow keys within/between blocks).
-   [ ] **Undo/Redo Mechanism**:
    -   [ ] Implement a basic undo/redo stack for content changes (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z - likely provided by Tiptap).
-   [ ] **Editable/Read-Only Mode**:
    -   [ ] Implement a toggle or mechanism to switch between editable and read-only states for the editor content.

### Basic Formatting & Block Types

-   [ ] **Paragraph Block**:
    -   [ ] Default text block functionality.
-   [ ] **Heading Blocks (H1, H2, H3)**:
    -   [ ] Implement rendering for H1, H2, H3 (Tiptap nodes).
    -   [ ] Allow users to change block type to/from a heading (e.g., via slash command or toolbar).
    -   [ ] Keyboard shortcuts (e.g., `Cmd/Ctrl+Alt+1` for H1).
-   [ ] **Inline Styling (Tiptap Marks)**:
    -   [ ] **Bold**: `**text**` or `Ctrl/Cmd+B`. Selection-based application.
    -   [ ] **Italic**: `*text*` or `Ctrl/Cmd+I`. Selection-based application.
    -   [ ] **Underline**: `Ctrl/Cmd+U`. Selection-based application.
    -   [ ] **Strikethrough**: `~~text~~`. Selection-based application.
    -   [ ] **Inline Code**: `` `code` ``. Selection-based application.
    -   [ ] **Links**: Ability to create and edit hyperlinks.
-   [ ] **List Blocks**:
    -   [ ] **Bulleted lists**: (`- ` or `* `). Support for nesting.
    -   [ ] **Numbered lists**: (`1. `). Support for nesting and automatic numbering.
    -   [ ] **To-do lists**: (`- [ ] ` or `- [x] `).
        -   [ ] Interactive checking/unchecking of tasks.
        -   [ ] Visual distinction for completed items.
-   [ ] **Blockquote Block**:
    -   [ ] Implement a blockquote for quoting text.
-   [ ] **Code Block (Basic)**:
    -   [ ] Implement a basic code block (multiline, monospace). (Advanced syntax highlighting in stretch goals).

### Advanced Block Operations

-   [ ] **Block Selection & Focus**:
    -   [ ] Allow users to select a single block (e.g., by clicking its margin or a drag handle if using custom block views).
    -   [ ] Visual indication of the currently focused/selected block.
    -   [ ] (Optional) Multi-block selection.
-   [ ] **Block Manipulation**:
    -   [ ] **Delete selected block**: (e.g., Backspace on empty block, or explicit delete action).
    -   [ ] **Duplicate selected block**.
    -   [ ] **Move block up/down**: Keyboard shortcuts (e.g., `Cmd/Ctrl+Shift+Up/Down`) and/or drag handle.
    -   [ ] **Convert block type**: Change a block from one type to another (e.g., paragraph to heading, paragraph to list item).
    -   [ ] **Merge/Split blocks**: (e.g., Backspace at start of block merges with previous, Enter in middle splits).
-   [ ] **Drag & Drop Reordering**:
    -   [ ] Implement functionality to reorder blocks using a drag handle (e.g., Tiptap's `Draggable` extension or custom).
    -   [ ] Visual cues during dragging (e.g., drop indicator line).
    -   [ ] Add Block Drag Handle for intuitive block-level rearranging.

### UI/UX Enhancements

-   [ ] **Page Header**:
    -   [ ] Design and implement a Notion-style page header area.
    -   [ ] **Emoji Picker**: Integrate an emoji picker (e.g., in the page header or via a command).
-   [ ] **Slash Commands Menu (`/`)**:
    -   [ ] Implement a menu that appears when typing `/` to insert blocks or apply commands.
    -   [ ] List available block types and commands.
    -   [ ] Keyboard navigation and selection within the slash command menu.
    -   [ ] Filtering of commands as user types.
-   [ ] **Placeholder Text**:
    -   [ ] Show placeholder text in empty blocks or the editor (e.g., "Type '/' for commands" or "Type something...").
    -   [ ] Dynamic placeholder based on block type (Tiptap `Placeholder` extension).
-   [ ] **Formatting Toolbar/Pop-up (Bubble Menu)**:
    -   [ ] **Inline Bubble Menu**: Implement a contextual toolbar that appears when text is selected for inline styling.
    -   [ ] (Optional) Floating toolbar that appears when a block is focused for block-level actions.
    -   [ ] Options to change block type.
    -   [ ] Options to apply inline styles.
-   [ ] **Keyboard Shortcuts**:
    -   [ ] Comprehensive shortcuts for common actions (creating blocks, formatting, navigation).
    -   [ ] (Optional) A way to display available shortcuts (e.g., a help modal).
-   [ ] **Theming**:
    -   [ ] Basic light theme.
    -   [ ] **Dark Mode**: Implement a dark mode and a toggle to switch themes.
-   [ ] **Indicators & Behavior**:
    -   [ ] **Character Count**: Display a character or word count indicator.
    -   [ ] **Scroll to Focused Block**: Implement automatic scrolling to keep the active/focused block in view, especially after creation or navigation.

### Data Handling (Initial)

-   [ ] **Data Structure for Editor Content**:
    -   [ ] Define a clear JSON structure to represent the entire document (Tiptap's default JSON output).
-   [ ] **Local Storage Persistence**:
    -   [ ] Save editor content (the JSON structure) to browser local storage.
    -   [ ] Implement debouncing or throttling for save operations to avoid performance issues.
    -   [ ] Load content from local storage on page load.
    -   [ ] Error handling for local storage operations (e.g., storage full).

### Stretch Goals (Phase 1.5 / Future)

-   [ ] **Advanced Code Blocks**:
    -   [ ] Implement dedicated code blocks with syntax highlighting (e.g., using Tiptap's `CodeBlockLowlight` with `lowlight` and `highlight.js`).
    -   [ ] Language selection for code blocks.
-   [ ] **Image Handling**:
    -   [ ] **Image Blocks**: Allow users to add images by URL.
    -   [ ] **Image Upload**: Implement image upload functionality and rendering.
    -   [ ] (Advanced) Image resizing, alignment.
-   [ ] **File Handling**:
    -   [ ] **File Upload**: Implement a general file upload handler and rendering/linking for common file types.
-   [ ] **Embedding**:
    -   [ ] **Embed Iframe**: General iframe embedding support for various content types.
    -   [ ] **YouTube Embed**: Specific functionality for easily embedding YouTube videos.
-   [ ] **Table Blocks**:
    -   [ ] Implement editable tables (e.g., Tiptap's table extension).
-   [ ] **Math Blocks**:
    -   [ ] Support for mathematical expressions (e.g., using KaTeX or MathJax, possibly via a Tiptap extension).
-   [ ] **Navigation & Structure**:
    -   [ ] **Table of Contents**: Implement auto-generated Table of Contents based on headings in the document.
-   [ ] **Export Functionality**:
    -   [ ] Export content to Markdown.
    -   [ ] Export content to HTML.
    -   [ ] Export content to PDF.
-   [ ] **Import Functionality**:
    -   [ ] Import from Markdown (`.md`) files.
    -   [ ] Import from HTML (`.html`) files.
-   [ ] **Collaboration (Very Advanced - Future Phase)**:
    -   [ ] Real-time collaborative editing (e.g., using CRDTs or Operational Transforms).
    -   [ ] Presence indicators.
-   [ ] **Version History (Advanced - Future Phase)**:
    -   [ ] Ability to view and revert to previous versions of the document.
-   [ ] **AI-Powered Features (Future Phase)**:
    -   [ ] Basic text generation/completion.
    -   [ ] Summarization.

## Default Editor (Phase 2)

-   [ ] Define features and scope for the default editor.
-   [ ] Implement the default editor.

---

This README will be updated as the project progresses.
