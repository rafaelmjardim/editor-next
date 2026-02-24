import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";

type ErrorPageProps = {
  message: string;
  onGoToHome: () => void;
};

export function ErrorPage({ message, onGoToHome }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border border-gray-300 w-full py-12">
      <TriangleAlert className="text-gray-600" />
      <h1 className="text-gray-600 font-semibold text-2xl">
        404 - página não encontrada
      </h1>
      <p className="text-sm text-gray-600">
        O Agger Hub não contém o caminho{" "}
        <span className="font-semibold">{message}</span>
      </p>

      <Button
        className="cursor-pointer"
        onClick={() => {
          onGoToHome();
        }}
      >
        Voltar para página inicial
      </Button>
    </div>
  );
}
