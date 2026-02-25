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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  buildMarkdown,
  convertFrontmetterToYAML,
  convertYAMLToObject,
  parseMarkdown,
} from "@/lib/utils";
import { ErrorPage } from "../_components/errorPage";

export default function EditorClient() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const path = searchParams.get("path");

  const [errorPage, setErrorPage] = useState(false);

  const [parsedData, setParsedData] = useState<{
    frontmatter: object;
    content: string;
  }>({ content: "", frontmatter: {} });

  const [fileName, setFileName] = useState("");
  const [currentFrontmatter, setCurrentFrontmatter] = useState<string>();
  const [newFrontmatter, setNewFrontmatter] = useState<string>();

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

  const changeFrontmatter = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewFrontmatter(event.target.value);
  };

  async function loadDocToEdit() {
    if (!path) return;

    try {
      const res = await fetch("/api/load-md", {
        method: "POST",
        body: JSON.stringify({
          path: `${path}`,
        }),
      });

      setFileName(setPathName(path));

      if (!res.ok) {
        const erroData = await res.json();
        throw new Error(
          erroData.error.message || "Erro ao carregar documentação.",
        );
      }

      const data = await res.json();

      const pathName = data.path.split("docs/")[1];
      setFileName(pathName);

      setParsedData(parseMarkdown(data.content));
      const { content, frontmatter } = parseMarkdown(data.content);

      setCurrentFrontmatter(convertFrontmetterToYAML(frontmatter));

      editor?.commands.setContent(content, {
        contentType: "markdown",
      });
    } catch (error: any) {
      setErrorPage(true);
    }
  }

  function setPathName(path: string): string {
    return path.split("docs/")[1];
  }

  const handleSaveInformations = () => {
    if (!newFrontmatter) return;
    setCurrentFrontmatter(newFrontmatter);
  };

  async function handleSave() {
    const contentMd = editor?.getMarkdown();

    const fileType = fileName.split(".").pop()?.toLowerCase();
    const allowedFileTypes = ["md", "mdx"];

    const hasValidFileName = !!fileType && allowedFileTypes.includes(fileType);

    if (!fileName || !hasValidFileName || !contentMd || !currentFrontmatter)
      return;

    setLoader(true);

    try {
      await fetch("/api/save-md", {
        method: "POST",
        body: JSON.stringify({
          path: `docs/${fileName}`,
          content: buildMarkdown(
            contentMd,
            convertYAMLToObject(currentFrontmatter),
          ),
        }),
      });
    } catch (error) {
      console.log("Erro ao salvar: ", error);
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

          <Dialog modal>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setNewFrontmatter(currentFrontmatter);
                }}
              >
                Informações
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-semibold text-lg">
                  Adicionar informações
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Importante: Mantenha o formato do texto
                </DialogDescription>
              </DialogHeader>
              <Textarea
                className="min-h-50"
                value={newFrontmatter}
                onChange={changeFrontmatter}
              ></Textarea>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" onClick={handleSaveInformations}>
                    Salvar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-end gap-2 ">
          <Button
            className="bg-transparent text-black border border-black hover:bg-gray-200 cursor-pointer"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" onClick={handleSave}>
            Salvar
            {loader && <ImSpinner8 className="size-4 animate-spin" />}
          </Button>
        </div>
      </div>

      {loader}

      {!errorPage ? (
        <div className="w-full">{editor && <MyEditor editor={editor} />}</div>
      ) : (
        <ErrorPage
          message={path ?? ""}
          onGoToHome={() => {
            router.push("/editor");
            setErrorPage(false);
          }}
        />
      )}
    </main>
  );
}
