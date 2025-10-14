"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";

const loginSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    password: z
        .string()
        .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Verifica se existe um parâmetro na URL indicando registro bem-sucedido
    useEffect(() => {
        const registered = searchParams.get("registered");
        if (registered === "true") {
            setStatusMessage({
                type: "success",
                message: "Cadastro realizado com sucesso! Faça login para continuar.",
            });
        }
    }, [searchParams]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(formData: LoginFormValues) {
        setIsLoading(true);
        try {
            // Tentar obter a URL de retorno dos parâmetros de busca ou usar dashboard como padrão
            const callbackParam = searchParams.get("callbackUrl");
            const callbackURL = callbackParam ? decodeURIComponent(callbackParam) : "/dashboard";

            const result = await authClient.signIn.email(
                {
                    email: formData.email,
                    password: formData.password,
                    callbackURL: callbackURL,
                },
                {
                    onSuccess: () => {
                        // Forçar uma revalidação do cookie antes de redirecionar
                        document.cookie = "login_success=true; path=/;";

                        // Mensagem para o usuário
                        setStatusMessage({
                            type: "success",
                            message: "Login bem-sucedido! Redirecionando..."
                        });

                        // Adicionamos um pequeno atraso para garantir que os cookies sejam definidos
                        setTimeout(() => {
                            try {
                                // Usar window.location para um redirecionamento completo
                                window.location.replace(callbackURL);
                            } catch (err) {
                                console.error("Erro no redirecionamento:", err);
                                // Fallback para caso de erro
                                window.location.href = "/dashboard";
                            }
                        }, 1500);
                    },
                    onError: (ctx) => {
                        setStatusMessage({
                            type: "error",
                            message:
                                "Falha ao fazer login. Verifique suas credenciais e tente novamente.",
                        });
                    },
                },
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSignInGoogle() {
        try {
            // Tentar obter a URL de retorno dos parâmetros de busca ou usar dashboard como padrão
            const callbackParam = searchParams.get("callbackUrl");
            const callbackURL = callbackParam ? decodeURIComponent(callbackParam) : "/dashboard";

            setIsLoading(true);
            await authClient.signIn.social(
                {
                    provider: "google",
                    callbackURL: callbackURL,
                },
                {
                    onSuccess: () => {
                        // Forçar uma revalidação do cookie antes de redirecionar
                        document.cookie = "login_success=true; path=/;";

                        // Mensagem para o usuário
                        setStatusMessage({
                            type: "success",
                            message: "Login com Google bem-sucedido! Redirecionando..."
                        });

                        // Usar window.location para um redirecionamento completo
                        setTimeout(() => {
                            try {
                                window.location.replace(callbackURL);
                            } catch (err) {
                                console.error("Erro no redirecionamento:", err);
                                // Fallback para caso de erro
                                window.location.href = "/dashboard";
                            }
                        }, 1500);
                    },
                    onError: (ctx) => {
                        setStatusMessage({
                            type: "error",
                            message: "Falha ao fazer login com Google. Tente novamente."
                        });
                        setIsLoading(false);
                    },
                },
            );
        } catch (error) {
            console.error("Erro ao fazer login com Google:", error);
            setIsLoading(false);
        }
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

            {/* Campo de Email */}
            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Digite seu email"
                    className={`w-full px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border ${errors.email ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-700"
                        } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary`}
                    disabled={isLoading}
                    {...register("email")}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
            </div>

            {/* Campo de Senha */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                        Senha
                    </label>
                    <a href="/recuperar-senha" className="text-sm text-primary hover:underline">
                        Esqueceu a senha?
                    </a>
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Digite sua senha"
                        className={`w-full px-4 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border ${errors.password ? "border-red-500 dark:border-red-400" : "border-gray-300 dark:border-gray-700"
                            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10`}
                        disabled={isLoading}
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
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                    )}
                </div>
            </div>

            {/* Botão de Entrar */}
            <motion.button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mb-4 flex items-center justify-center"
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
                        Entrando...
                    </div>
                ) : (
                    "Entrar"
                )}
            </motion.button>

            {/* Separador */}
            <div className="flex items-center mb-4">
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
                <span className="px-3 text-sm text-gray-500 dark:text-gray-400">ou continue com</span>
                <div className="flex-grow h-px bg-gray-300 dark:bg-gray-700"></div>
            </div>

            {/* Botão do Google */}
            <motion.button
                type="button"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium rounded-md shadow-sm border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center gap-2"
                onClick={handleSignInGoogle}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
            >
                <Image
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    width={20}
                    height={20}
                    unoptimized
                />
                <span>Entrar com Google</span>
            </motion.button>
        </form>
    );
}
