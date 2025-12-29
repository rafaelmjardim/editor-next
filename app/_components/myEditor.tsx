import { Editor, EditorContent } from "@tiptap/react";
import { Toolbar } from "./toolbar";

type MyEditorProps = {
  editor?: Editor;
};

export function MyEditor({ editor }: MyEditorProps) {
  return (
    <div className="rounded-md border border-gray-300 overflow-y-auto">
      <div className="flex items-center gap-1 sticky top-0 z-10">
        {editor && <Toolbar editor={editor} />}
      </div>
      <EditorContent
        editor={editor ?? null}
        className="prose rounded-md px-6 py-1 w-full min-w-full"
      />
    </div>
  );
}
