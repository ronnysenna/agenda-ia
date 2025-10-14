"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function ButtonSignOut() {
  const router = useRouter();

  async function signOut() {
    try {
      // Fazendo um logout direto com fetch para garantir
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Importante para incluir os cookies
      });

      // Mesmo que a resposta não seja ok, redireciona
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Redirecionamento forçado em caso de erro
      router.push("/login");
    }
  }

  return (
    <button
      onClick={signOut}
      className="flex items-center justify-center w-full gap-2 px-4 py-2 text-white transition-colors rounded-lg bg-gray-700 hover:bg-gray-600 active:bg-gray-800"
      type="button"
    >
      <LogOut size={18} />
      <span>Sair</span>
    </button>
  );
}
