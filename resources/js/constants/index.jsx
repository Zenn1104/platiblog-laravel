import {
    BoldIcon,
    ItalicIcon,
    UnderlineIcon,
    ListBulletIcon,
    QueueListIcon,
    CodeBracketIcon,
    LinkIcon,
    PhotoIcon,
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
    HashtagIcon,
    StrikethroughIcon,
    ScissorsIcon,
    SunIcon,
    Bars3BottomLeftIcon,
    Bars3Icon,
    Bars3BottomRightIcon,
    Bars3CenterLeftIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon, // Icon for fullscreen
} from "@heroicons/react/24/solid";

export const RichTextAction = {
    Bold: "bold",
    Italics: "italics",
    Underline: "underline",
    Strikethrough: "strikethrough",
    Superscript: "superscript",
    SubScript: "subscript",
    Highlight: "highlight",
    Code: "code",
    LeftAlign: "leftAlign",
    CenterAlign: "centerAlign",
    RightAlign: "rightAlign",
    JustifyAlign: "justifyAlign",
    Devider: "devider",
    Undo: "undo",
    Redo: "redo",
};

export const RICH_TEXT_OPTION = [
    {
        id: RichTextAction.Bold,
        icon: <BoldIcon className="h-5 w-5" />,
        label: "Bold",
    },
    {
        id: RichTextAction.Italics,
        icon: <ItalicIcon className="h-5 w-5" />,
        label: "Italics",
    },
    {
        id: RichTextAction.Underline,
        icon: <UnderlineIcon className="h-5 w-5" />,
        label: "Underline",
    },
    { id: RichTextAction.Devider },
    {
        id: RichTextAction.Highlight,
        icon: <HashtagIcon className="h-5 w-5" />,
        label: "Highlight",
        fontSize: 10,
    },
    {
        id: RichTextAction.Strikethrough,
        icon: <StrikethroughIcon className="h-5 w-5" />,
        label: "Strikethrough",
    },
    {
        id: RichTextAction.Superscript,
        icon: <ScissorsIcon className="h-5 w-5" />,
        label: "Superscript",
    },
    {
        id: RichTextAction.SubScript,
        icon: <SunIcon className="h-5 w-5" />,
        label: "Subscript",
    },
    {
        id: RichTextAction.Code,
        icon: <CodeBracketIcon className="h-5 w-5" />,
        label: "Code",
    },
    {
        id: RichTextAction.LeftAlign,
        icon: <Bars3BottomLeftIcon className="h-5 w-5" />,
        label: "Align Left",
    },
    {
        id: RichTextAction.CenterAlign,
        icon: <Bars3CenterLeftIcon className="h-5 w-5" />,
        label: "Align Center",
    },
    {
        id: RichTextAction.RightAlign,
        icon: <Bars3BottomRightIcon className="h-5 w-5" />,
        label: "Align Right",
    },
    {
        id: RichTextAction.JustifyAlign,
        icon: <Bars3Icon className="h-5 w-5" />,
        label: "Align Justify",
    },
    { id: RichTextAction.Devider },
    {
        id: RichTextAction.Undo,
        icon: <ArrowUturnLeftIcon className="h-5 w-5" />,
        label: "Undo",
    },
    {
        id: RichTextAction.Redo,
        icon: <ArrowUturnRightIcon className="h-5 w-5" />,
        label: "Redo",
    },
];

export const LOW_PRIORIRTY = 1;
export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
