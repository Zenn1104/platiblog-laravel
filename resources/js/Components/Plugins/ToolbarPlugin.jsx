import {
    HEADINGS,
    LOW_PRIORIRTY,
    RICH_TEXT_OPTION,
    RichTextAction,
} from "@/constants";
import { useKeyBindings } from "@/hooks/useKeyBindings";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { IconButton, Option, Select } from "@material-tailwind/react";
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from "lexical";
import { useEffect, useState } from "react";

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [disableMap, setDisableMap] = useState({
        [RichTextAction.Undo]: true,
        [RichTextAction.Redo]: true,
    });
    const [selectionMap, setSelectionMap] = useState({});

    const updateToolbar = () => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
            const newSelectionMap = {
                [RichTextAction.Bold]: selection.hasFormat("bold"),
                [RichTextAction.Italics]: selection.hasFormat("italic"),
                [RichTextAction.Underline]: selection.hasFormat("underline"),
                [RichTextAction.Strikethrough]:
                    selection.hasFormat("strikethrough"),
                [RichTextAction.Superscript]:
                    selection.hasFormat("superscript"),
                [RichTextAction.SubScript]: selection.hasFormat("subscript"),
                [RichTextAction.Code]: selection.hasFormat("code"),
                [RichTextAction.Highlight]: selection.hasFormat("highlight"),
            };
            setSelectionMap(newSelectionMap);
        }
    };

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (payload) => {
                    updateToolbar();
                    return false;
                },
                LOW_PRIORIRTY
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setDisableMap((prevDisableMap) => ({
                        ...prevDisableMap,
                        undo: !payload,
                    }));
                    return false;
                },
                LOW_PRIORIRTY
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setDisableMap((prevDisableMap) => ({
                        ...prevDisableMap,
                        redo: !payload,
                    }));
                    return false;
                },
                LOW_PRIORIRTY
            )
        );
    }, [editor]);

    const onAction = (id) => {
        switch (id) {
            case RichTextAction.Bold: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                break;
            }
            case RichTextAction.Italics: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                break;
            }
            case RichTextAction.Underline: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                break;
            }
            case RichTextAction.Strikethrough: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                break;
            }
            case RichTextAction.Superscript: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
                break;
            }
            case RichTextAction.SubScript: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
                break;
            }
            case RichTextAction.Highlight: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
                break;
            }
            case RichTextAction.Code: {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
                break;
            }
            case RichTextAction.LeftAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                break;
            }
            case RichTextAction.RightAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                break;
            }
            case RichTextAction.CenterAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                break;
            }
            case RichTextAction.JustifyAlign: {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                break;
            }
            case RichTextAction.Undo: {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
                break;
            }
            case RichTextAction.Redo: {
                editor.dispatchCommand(REDO_COMMAND, undefined);
                break;
            }
        }
    };

    useKeyBindings({ onAction });

    const getSelectedBtnProps = (isSelected) =>
        isSelected
            ? {
                  color: "blue-gray",
                  variant: "gradient",
              }
            : {};

    const updateHeading = (heading) => {
        editor.update(() => {
            const selection = $getSelection();

            // Pastikan selection adalah range yang valid
            if ($isRangeSelection(selection)) {
                // Bungkus teks yang dipilih dalam node heading yang baru
                $wrapNodes(selection, () => $createHeadingNode(heading));
            }
        });
    };

    return (
        <div className="m-1 flex items-center gap-0.5 rounded-lg bg-gray-100 p-1">
            {/* Format Dropdown */}
            <Select
                onChange={(e) => updateHeading(e)}
                className="appearance-none rounded-md bg-transparent px-2 py-1 outline-none hover:bg-gray-900/10"
            >
                {HEADINGS.map((heading) => (
                    <Option key={heading} value={heading}>
                        {heading}
                    </Option>
                ))}
            </Select>

            {RICH_TEXT_OPTION.map(({ id, label, icon, fontSize }, index) =>
                id === RichTextAction.Devider ? (
                    <div
                        key={index}
                        className="mx-1 h-6 w-px bg-gray-400"
                    ></div>
                ) : (
                    <IconButton
                        key={id}
                        variant="text"
                        color="gray"
                        onClick={() => onAction(id)}
                        {...getSelectedBtnProps(selectionMap[id])}
                    >
                        {icon}
                    </IconButton>
                )
            )}
        </div>
    );
}
