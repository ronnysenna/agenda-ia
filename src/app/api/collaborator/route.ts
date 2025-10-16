import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProtectedSession } from "@/lib/get-protected-session";

// GET: Lista todos os colaboradores do usuário logado
export async function GET() {
  const session = await getProtectedSession();
  if (!session?.user?.id) return NextResponse.json([], { status: 401 });

  const collaborators = await prisma.collaborator.findMany({
    where: { userId: session.user.id },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(collaborators);
}

// POST: Adiciona um novo colaborador
export async function POST(req: Request) {
  const session = await getProtectedSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, role, phone, imageUrl } = body;
  if (!name || !role)
    return NextResponse.json(
      { error: "Nome e função obrigatórios" },
      { status: 400 }
    );

  const collaborator = await prisma.collaborator.create({
    data: {
      name,
      role,
      phone,
      imageUrl,
      userId: session.user.id,
    },
  });
  return NextResponse.json(collaborator);
}
