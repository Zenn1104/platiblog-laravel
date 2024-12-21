import { useEffect, useState } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot } from "lexical";

export default function CustomOnChangePlugin({ value, onChange }) {
    const [editor] = useLexicalComposerContext();
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Load initial content into editor on first render
    useEffect(() => {
        if (isInitialLoad && value) {
            editor.update(() => {
                const root = $getRoot();
                const domParser = new DOMParser();
                const parsedHTML = domParser.parseFromString(
                    value,
                    "text/html"
                );
                const nodes = $generateNodesFromDOM(editor, parsedHTML);

                root.clear();
                root.append(...nodes);
            });
            setIsInitialLoad(false);
        }
    }, [editor, value, isInitialLoad]);

    // Trigger onChange callback when editor content changes
    return (
        <OnChangePlugin
            onChange={(editorState) => {
                editorState.read(() => {
                    const htmlContent = $generateHtmlFromNodes(editor);
                    if (htmlContent !== value) {
                        onChange(htmlContent);
                    }
                });
            }}
        />
    );
}
