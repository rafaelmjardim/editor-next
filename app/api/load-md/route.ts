import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

export async function POST(req: Request) {
  const { path } = await req.json();

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  const apiUrl = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Arquivo não encontrado" },
      { status: 404 }
    );
  }

  const file = await response.json();

  const content = Buffer.from(file.content, "base64").toString("utf-8");

  return NextResponse.json({
    content,
    sha: file.sha,
    path: file.path,
  });
}
