"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");

  async function salvar() {
    await fetch("/api/save-md", {
      method: "POST",
      body: JSON.stringify({
        fileName: "nome_arquivo",
        path: "docs/intro.md",
        content: text,
      }),
    });
  }

  return (
    <main className="container my-auto p-20 flex flex-col items-center gap-4 min-w-full">
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
