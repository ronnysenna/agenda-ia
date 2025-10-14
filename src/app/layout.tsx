import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./bootstrap-custom.css";
import "./globals.css";
import { BootstrapClient } from "@/components/bootstrap-client";

// Importação do Bootstrap movida para um componente client-side
// para evitar problemas de SSR

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agenda AI - Gestão de Agendamentos por WhatsApp",
  description:
    "Automatize seu atendimento, organize seus serviços e aumente seus agendamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen bg-background`}
      >
        {/* Componente para carregar Bootstrap no lado do cliente */}
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}
