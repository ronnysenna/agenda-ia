"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z
    .object({
        password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof formSchema>;

export function RedefinirSenhaForm() {
    const searchParams = useSearchParams();
    const tokenFromUrl = searchParams.get("token");
    const router = useRouter();
    const [token, setToken] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [tokenValido, setTokenValido] = useState<boolean | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            // Verificar se o token é válido
            verificarToken(tokenFromUrl);
        } else {
            setTokenValido(false);
            setStatusMessage({
                type: "error",
                message: "Token de redefinição não fornecido ou inválido.",
            });
        }
    }, [tokenFromUrl]);

    async function verificarToken(token: string) {
        try {
            // Simula uma chamada de API para verificar o token
            const response = await fetch(`/api/auth/verificar-token?token=${token}`, {
                method: "GET",
            });

            if (!response.ok) {
                setTokenValido(false);
                setStatusMessage({
                    type: "error",
                    message: "Token inválido ou expirado. Solicite um novo link de redefinição.",
                });
            } else {
                setTokenValido(true);
            }
        } catch (error) {
            setTokenValido(false);
            setStatusMessage({
                type: "error",
                message: "Erro ao verificar token. Tente novamente mais tarde.",
            });
        }
    }

    async function onSubmit(data: FormData) {
        if (!token || !tokenValido) {
            setStatusMessage({
                type: "error",
                message: "Token inválido ou expirado. Solicite um novo link de redefinição.",
            });
            return;
        }

        setIsLoading(true);
        try {
            // Simula uma chamada de API para redefinir a senha
            const response = await fetch("/api/auth/redefinir-senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: data.password,
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || "Erro ao redefinir senha.");
            }

            setStatusMessage({
                type: "success",
                message: "Senha redefinida com sucesso! Redirecionando para o login...",
            });

            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            setStatusMessage({
                type: "error",
                message: error.message || "Erro ao redefinir senha. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (tokenValido === false) {
        return (
            <div className="text-center">
                <div className="p-4 mb-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {statusMessage?.message || "Token inválido ou expirado."}
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    <a href="/recuperar-senha" className="text-primary font-semibold hover:underline">
                        Solicitar um novo link de redefinição
                    </a>
                </p>
            </div>
        );
    }

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

            {/* Campo de Nova Senha */}
            <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                    Nova Senha
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Digite sua nova senha"
                        className={`w-full px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border ${errors.password ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-700"
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10`}
                        disabled={isLoading || !tokenValido}
                        {...register("password")}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                )}
            </div>

            {/* Campo de Confirmar Senha */}
            <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-1">
                    Confirmar Senha
                </label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="Confirme sua nova senha"
                        className={`w-full px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border ${errors.confirmPassword ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-700"
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10`}
                        disabled={isLoading || !tokenValido}
                        {...register("confirmPassword")}
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Botão de Redefinir Senha */}
            <motion.button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-4 flex items-center justify-center"
                disabled={isLoading || !tokenValido}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Redefinindo...
                    </div>
                ) : (
                    "Redefinir Senha"
                )}
            </motion.button>
        </form>
    );
}

export default RedefinirSenhaForm;
