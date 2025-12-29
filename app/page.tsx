"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  async function salvar() {
    await fetch("/api/save-md", {
      method: "POST",
      body: JSON.stringify({
        path: `docs/${fileName}.md`,
        content: text,
      }),
    });
  }

  return (
    <main className="container my-auto p-20 flex flex-col items-center gap-4 min-w-full">
      <Input
        placeholder="Nome do arquivo"
        id="name"
        value={fileName}
        onChange={handleChangeName}
      />
      <Textarea
        className="h-96"
        placeholder="Adicione sua mensagem aqui"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        cols={50}
      />
      <Button onClick={salvar}>Salvar</Button>
    </main>
  );
}
