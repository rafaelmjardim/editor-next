import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  Redo,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  Undo,
  type LucideProps,
} from "lucide-react";

import { Editor, useEditorState } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor;
}

interface ToolbarButton {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
  label: string;
  action: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
  hasSeparator?: boolean;
}

export function Toolbar({ editor }: ToolbarProps) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isAlignStart: ctx.editor.isActive({ textAlign: "left" }) ?? false,
        isAlignCenter: ctx.editor.isActive({ textAlign: "center" }) ?? false,
        isAlignEnd: ctx.editor.isActive({ textAlign: "right" }) ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: Undo,
      label: "Desfazer",
      isDisabled: !editorState.canUndo,
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: Redo,
      label: "Refazer",
      isDisabled: !editorState.canRedo,
      action: () => editor.chain().focus().redo().run(),
      hasSeparator: true,
    },
    {
      icon: Heading1,
      label: "Heading 1",
      isActive: editorState.isHeading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      isActive: editorState.isHeading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: List,
      label: "Lista",
      isActive: editorState.isBulletList,
      action: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      icon: Code,
      label: "Bloco de código",
      isActive: editorState.isCodeBlock,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      hasSeparator: true,
    },
    {
      icon: Bold,
      label: "Bold",
      isActive: editorState.isBold,
      action: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: "Italico",
      isActive: editorState.isItalic,
      action: () => editor.chain().focus().toggleItalic().run(),
      hasSeparator: true,
    },
    {
      icon: TextAlignStart,
      label: "Alinhar no inicio",
      isActive: editorState.isAlignStart,
      action: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      icon: TextAlignCenter,
      label: "Alinhar ao centro",
      isActive: editorState.isAlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      icon: TextAlignEnd,
      label: "Alinhar no fim",
      isActive: editorState.isAlignEnd,
      action: () => editor.chain().focus().setTextAlign("right").run(),
    },
  ];

  return (
    <div className="flex jus gap-1 mb-3 p-2 border-b w-full bg-white">
      {toolbarButtons.map((item, index) => (
        <div key={index} className="flex items-center">
          <button
            data-active={item.isActive}
            data-disabled={item.isDisabled}
            className="p-2 text-gray-600 rounded-md hover:bg-slate-100 transition-colors  border-gray-200 data-[active=true]:text-blue-500 data-[disabled=true]:text-gray-300 data-[disabled=true]:hover:bg-transparent"
            disabled={item.isDisabled}
            key={index}
            onClick={item.action}
            title={item.label}
          >
            <item.icon className="w-4 h-4"></item.icon>
          </button>

          {item.hasSeparator && (
            <span className=" h-full w-[1px] mx-[4px] bg-gray-200"></span>
          )}
        </div>
      ))}
    </div>
  );
}
