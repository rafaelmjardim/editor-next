import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

export async function POST(req: Request) {
  const { path, content } = await req.json();

  if (!path || !content) return;

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  const apiUrl = `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`;

  const fileResponse = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  let sha;

  if (fileResponse.ok) {
    const fileData = await fileResponse.json();
    sha = fileData.sha;
  }

  const saveResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      message: `docs: update ${path}`,
      content: Buffer.from(content).toString("base64"),
      sha,
    }),
  });

  if (!saveResponse.ok) {
    const error = await saveResponse.json();
    return NextResponse.json(error, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
