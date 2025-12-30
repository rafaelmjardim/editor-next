"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { MyEditor } from "./_components/myEditor";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Markdown } from "@tiptap/markdown";
import { useEditor } from "@tiptap/react";

export default function Home() {
  const markdown = `# Título

Texto em **negrito** e _itálico_

- Item 1
- Item 2
`;
  const [fileName, setFileName] = useState("");
  const [content, setContent] = useState<string>("# Titulo");

  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography, Markdown],
    content,
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

  const parseMarkdown = () => {
    if (!editor || !editor.markdown) return;

    editor.commands.setContent(content, { contentType: "markdown" });
  };

  useEffect(() => {
    parseMarkdown();
  }, [editor]);

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

  return (
    <main className="container my-auto p-20 flex flex-col items-center gap-4 min-w-full h-screen">
      <Input
        placeholder="Nome do arquivo"
        id="name"
        value={fileName}
        onChange={handleChangeName}
      />

      <div className="w-full">{editor && <MyEditor editor={editor} />}</div>
      <Button onClick={salvar}>Salvar</Button>
    </main>
  );
}
