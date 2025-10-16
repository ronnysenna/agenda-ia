import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProtectedSession } from "@/lib/get-protected-session";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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

  const updated = await prisma.collaborator.update({
    where: { id: params.id, userId: session.user.id },
    data: { name, role, phone, imageUrl },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getProtectedSession();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  await prisma.collaborator.delete({
    where: { id: params.id, userId: session.user.id },
  });
  return NextResponse.json({ ok: true });
}
