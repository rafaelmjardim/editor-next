"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown } from "@tiptap/markdown";
import { useEditor } from "@tiptap/react";
import { MyEditor } from "../_components/myEditor";
import { useSearchParams } from "next/navigation";

export default function EditorClient() {
  const searchParams = useSearchParams();
  const path = searchParams.get("path");

  const [fileName, setFileName] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Markdown,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[30rem] w-full ",
      },
    },
  });

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  async function loadDocToEdit() {
    if (!path) return;

    const res = await fetch("/api/load-md", {
      method: "POST",
      body: JSON.stringify({
        path: `${path}.md`,
      }),
    });

    const data = await res.json();

    const pathName = data.path.split("docs/")[1].split(".")[0];
    setFileName(pathName);

    editor?.commands.setContent(data.content, { contentType: "markdown" });
  }

  async function salvar() {
    const contentMd = editor?.getMarkdown();

    if (!fileName) return;

    await fetch("/api/save-md", {
      method: "POST",
      body: JSON.stringify({
        path: `docs/${fileName}.md`,
        content: contentMd,
      }),
    });
  }

  useEffect(() => {
    loadDocToEdit();
  }, [editor, path]);

  // console.log("param", params.path);

  return (
    <main className="container mx-auto p-6 flex flex-col items-center gap-4 min-w-full h-screen">
      <div className="flex items-center gap-4 w-full">
        <Input
          className="min-h-10"
          placeholder="Caminho + nome do arquivo"
          id="name"
          value={fileName}
          onChange={handleChangeName}
        />

        <div className="flex items-center gap-2">
          <Button className="bg-transparent text-black border border-black hover:bg-gray-200 cursor-pointer">
            Cancelar
          </Button>
          <Button className="cursor-pointer" onClick={salvar}>
            Salvar
          </Button>
        </div>
      </div>

      <div className="w-full">{editor && <MyEditor editor={editor} />}</div>
    </main>
  );
}
