import { Frontmatter } from "@/types/frontmatter.type";
import { clsx, type ClassValue } from "clsx";
import matter from "gray-matter";
import { twMerge } from "tailwind-merge";
import * as YAML from "yaml";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFrontmetterToYAML = (frontmatter: Frontmatter) => {
  if (!frontmatter) return;
  const yamlBody = YAML.stringify(frontmatter).trim();

  return `---\n${yamlBody}\n---`;
};

export const convertYAMLToObject = (yamlString: string) => {
  if (!yamlString) return {};

  try {
    // Remove as linhas de delimitador --- do início e fim
    const cleaned = yamlString
      .split("\n")
      .filter((line) => line.trim() !== "---")
      .join("\n")
      .trim();

    // Se está vazio após limpeza, retorna objeto vazio
    if (!cleaned) return {};

    // Parse do YAML
    const parsed = YAML.parse(cleaned);

    // Garante que o resultado é um objeto válido
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (error) {
    console.error("Erro ao parsear YAML:", error);
    return {};
  }
};

export const parseMarkdown = (md: string) => {
  const { data, content } = matter(md);

  return {
    frontmatter: data,
    content,
  };
};

export const buildMarkdown = (content: string, frontmatter: unknown) => {
  return matter.stringify(content, frontmatter ?? {});
};
