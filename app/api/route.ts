export async function GET(request: Request) {
  const tokenTeste = process.env.GITHUB_OWNER!;

  return Response.json({ message: "teste", token: tokenTeste });
}
