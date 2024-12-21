import React, { useMemo } from "react";
import { Typography } from "@material-tailwind/react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ToolbarPlugin } from "./Plugins";
import CustomOnChangePlugin from "./Plugins/CustomOnChangePlugin";

const theme = {
    text: {
        bold: "font-bold",
        underline: "underline",
        strikethrough: "line-through",
        underlineStrikethrough: "underline line-through",
        italic: "italic",
        code: "text-slate-900 p-2 bg-slate-300 border border-slate-500",
    },
};

export const WSSIYGEditor = React.memo(function WSSIYGEditor({
    value,
    onChange,
    placeHolder,
    name,
}) {
    const initialConfig = useMemo(
        () => ({
            namespace: name,
            theme,
            onError: () => {},
            nodes: [HeadingNode, CodeHighlightNode, CodeNode],
        }),
        [name]
    );

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="relative mx-auto overflow-hidden my-5 w-full max-w-4xl rounded-xl border border-gray-300 bg-white text-left font-normal leading-5 text-gray-900">
                <ToolbarPlugin />
                <div className="relative rounded-b-lg border-opacity-5 bg-white overflow-scroll">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="lexical min-h-[280px] max-h-72 resize-none px-2.5 py-4 text-base caret-gray-900 outline-none" />
                        }
                        placeholder={
                            <Typography
                                color="gray"
                                className="pointer-events-none absolute left-2 top-4 text-gray-400"
                            >
                                {placeHolder}
                            </Typography>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
                <AutoFocusPlugin />
                <HistoryPlugin />
                <CustomOnChangePlugin value={value} onChange={onChange} />
            </div>
        </LexicalComposer>
    );
});
