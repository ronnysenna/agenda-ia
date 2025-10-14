"use client";

import Link from "next/link";
import { RecuperarSenhaForm } from "../_components/recuperar-senha-form";
import Image from "next/image";
import { motion } from "framer-motion";
import { Suspense } from "react";

export default function RecuperarSenhaPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative py-5 bg-gray-900">
      {/* Background gradiente animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 animate-background"
            style={{
              background:
                "linear-gradient(45deg, rgba(251,169,49,0.1) 0%, rgba(251,169,49,0) 70%, rgba(25,135,84,0.1) 100%)",
              backgroundSize: "400% 400%",
            }}
          ></div>
        </div>
      </div>

      <div className="w-full max-w-md px-4 sm:px-6 relative z-10">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="relative inline-block mb-4">
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                style={{
                  width: "180px",
                  height: "180px",
                  filter: "blur(40px)",
                  opacity: "0.2",
                }}
              ></div>
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={120}
                height={120}
                className="relative object-contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Recuperar Senha
            </h1>
            <p className="text-gray-400 mb-4">
              Informe seu e-mail para receber as instruções de recuperação
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full"
          >
            {/* Card do Formulário com efeito de vidro */}
            <div
              className="w-full rounded-xl shadow-xl overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            >
              <div className="p-6">
                <Suspense fallback={<div className="text-center py-4 text-white">Carregando...</div>}>
                  <RecuperarSenhaForm />
                </Suspense>
              </div>
            </div>

            {/* Link para Cadastro */}
            <div className="text-center mt-6">
              <p className="text-gray-300">
                Não tem uma conta?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-semibold hover:underline transition-all"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
