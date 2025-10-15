"use client";

import { ModernSidebar } from "@/components/ui/modern-sidebar-final";
import { Bell } from "lucide-react";

type DashboardLayoutProps = {
    userName: string;
    children: React.ReactNode;
};

export default function DashboardLayout({ userName, children }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <ModernSidebar userName={userName} />
            {/* Header e Conteúdo Principal */}
            <div className="lg:pl-64">
                {/* Header fixo no topo */}
                <header className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 md:px-8">
                        <div className="flex items-center gap-4">
                            <h1 className="text-lg font-semibold text-gray-800 md:block">
                                Agenda<span className="text-primary">AI</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Botão de notificações */}
                            <button
                                type="button"
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Notificações"
                            >
                                <Bell size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </header>
                {/* Conteúdo principal */}
                <main className="p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
