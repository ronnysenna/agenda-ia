import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let databaseStatus = "unknown";
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = "connected";
  } catch (error) {
    databaseStatus = "error"; // Não retorna mensagem detalhada para não quebrar healthcheck
  }

  // Sempre retorna status 200, mesmo se o banco estiver offline
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
        port: process.env.PORT || "80",
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
