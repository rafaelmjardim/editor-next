import { Suspense } from "react";
import EditorClient from "./editorClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando editor...</div>}>
      <EditorClient />
    </Suspense>
  );
}
