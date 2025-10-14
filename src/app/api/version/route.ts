import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Verificar status do banco de dados
  let databaseStatus = "unknown";
  try {
    // Tentar uma consulta simples para verificar conexão com o banco
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = "connected";
  } catch (error) {
    databaseStatus =
      "error: " + (error instanceof Error ? error.message : String(error));
  }

  // Retornar informações detalhadas sobre o estado do sistema
  return NextResponse.json(
    {
      status: "online",
      version: "1.0.0",
      buildId: process.env.NEXT_PUBLIC_BUILD_ID || "dev",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      database: {
        status: databaseStatus,
        url: process.env.DATABASE_URL
          ? process.env.DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, "//****:****@")
          : "not configured",
      },
      nextauth: {
        url: process.env.NEXTAUTH_URL || "not configured",
      },
      server: {
        hostname: process.env.HOSTNAME || "not set",
        port: process.env.PORT || "3000",
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
