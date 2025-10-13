"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // Carregar tema do localStorage quando componente montar
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

        // Se existe tema salvo, usar este
        if (savedTheme) {
            setTheme(savedTheme);
        }
        // Caso contrário, verificar preferência do sistema
        else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? "dark" : "light");
            localStorage.setItem("theme", prefersDark ? "dark" : "light");
        }

        // Aplicar classe dark ao html
        document.documentElement.classList.toggle("dark", theme === "dark");
    }, []);

    // Quando o tema mudar, aplicar mudanças
    useEffect(() => {
        if (theme) {
            document.documentElement.classList.toggle("dark", theme === "dark");
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
        >
            {theme === "light" ? (
                <Moon size={20} className="text-gray-600" />
            ) : (
                <Sun size={20} className="text-gray-300" />
            )}
        </button>
    );
}
