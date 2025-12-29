import { writeFileSync } from "fs";
import path from "path";

export async function POST(req: Request) {
  const { fileName, content } = await req.json();

  if (!content) return;

  const filePath = path.join(process.cwd(), "content/docs", `${fileName}.md`);

  await writeFileSync(filePath, content, "utf-8");

  return Response.json({ fileName, content });
}
