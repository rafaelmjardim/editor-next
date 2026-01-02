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

  const cleaned = yamlString
    .trim()
    .replace(/^---\s*/g, "")
    .replace(/\s*---$/g, "")
    .trim();

  const parsed = YAML.parse(cleaned);

  return typeof parsed === "object" && parsed !== null ? parsed : {};
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
