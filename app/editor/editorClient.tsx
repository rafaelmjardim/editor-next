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
import { useRouter } from "next/navigation";
import { ImSpinner8 } from "react-icons/im";

export default function EditorClient() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const path = searchParams.get("path");

  const [fileName, setFileName] = useState("");
  const [loader, setLoader] = useState(false);

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

    const pathName = data.path.split("docs/")[1];
    setFileName(pathName);

    editor?.commands.setContent(data.content, { contentType: "markdown" });
  }

  async function salvar() {
    const contentMd = editor?.getMarkdown();

    const fileType = fileName.split(".").pop()?.toLowerCase();
    const allowedFileTypes = ["md", "mdx"];

    const hasValidFileName = !!fileType && allowedFileTypes.includes(fileType);

    if (!fileName || !hasValidFileName) return;

    setLoader(true);

    try {
      await fetch("/api/save-md", {
        method: "POST",
        body: JSON.stringify({
          path: `docs/${fileName}`,
          content: contentMd,
        }),
      });
    } catch (error) {
      console.log("Erro ao salvar");
    } finally {
      setLoader(false);
    }
  }

  function handleCancel() {
    setFileName("");
    editor?.commands.clearContent();
    router.push("/editor");
  }

  useEffect(() => {
    loadDocToEdit();
  }, [editor, path]);

  return (
    <main className="container mx-auto p-6 flex flex-col items-center gap-4 min-w-full h-screen">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-2 ">
          <span className="text-nowrap font-semibold text-blue-500">
            agger-docs
          </span>
          <span className="text-nowrap font-semibold text-gray-400">/</span>
          <span className="text-nowrap font-semibold text-blue-500">docs</span>
          <span className="text-nowrap font-semibold text-gray-400">/</span>

          <Input
            className="min-h-6"
            placeholder="Caminho + nome do arquivo"
            id="name"
            value={fileName}
            onChange={handleChangeName}
          />
        </div>

        <div className="flex items-center justify-end gap-2 ">
          <Button
            className="bg-transparent text-black border border-black hover:bg-gray-200 cursor-pointer"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" onClick={salvar}>
            Salvar
            {loader && <ImSpinner8 className="size-4 animate-spin" />}
          </Button>
        </div>
      </div>

      <div className="w-full">{editor && <MyEditor editor={editor} />}</div>
    </main>
  );
}
