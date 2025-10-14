"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";

const formSchema = z.object({
    email: z.string().email("E-mail inválido."),
});

type FormData = z.infer<typeof formSchema>;

export function RecuperarSenhaForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setStatusMessage(null);

        try {
            // Simula uma chamada de API para solicitar recuperação de senha
            const response = await fetch("/api/auth/recuperar-senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Erro ao solicitar redefinição de senha.");
            }

            // Sucesso
            setStatusMessage({
                type: "success",
                message: "E-mail de recuperação enviado! Verifique sua caixa de entrada.",
            });
            reset(); // Limpa o formulário após sucesso
        } catch (error: any) {
            setStatusMessage({
                type: "error",
                message: error.message || "Ocorreu um erro. Tente novamente mais tarde.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Mensagens de status */}
            {statusMessage && (
                <div className={`p-4 mb-4 rounded-lg flex items-center justify-between ${statusMessage.type === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                    <span>{statusMessage.message}</span>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        onClick={() => setStatusMessage(null)}
                    >
                        &times;
                    </button>
                </div>
            )}

            <div className="mb-6">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white mb-1"
                >
                    E-mail
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Digite o e-mail da sua conta"
                    className={`w-full px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border ${errors.email ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-700"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                    disabled={isLoading}
                    {...register("email")}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
            </div>

            <div className="mb-6">
                <motion.button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                        </div>
                    ) : (
                        "Enviar e-mail de recuperação"
                    )}
                </motion.button>
            </div>

            <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    Lembrou sua senha?{" "}
                    <a href="/login" className="text-primary font-semibold hover:underline">
                        Voltar para login
                    </a>
                </p>
            </div>
        </form>
    );
}

export default RecuperarSenhaForm;
