"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Editor() {
  const router = useRouter();
  return (
    <main className="container my-auto p-20 flex flex-col items-center gap-4 min-w-full h-screen">
      <h1 className="font-semibold de documentos">Bem vindo ao editor</h1>
      <Button className="cursor-pointer" onClick={() => router.push("/editor")}>
        Iniciar
      </Button>
    </main>
  );
}
