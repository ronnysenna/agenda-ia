"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useId } from "react";
import {
    Home as HomeIcon,
    User as UserIcon,
    QrCode as QrCodeIcon,
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    Scissors as ScissorsIcon,
    PlusCircle as PlusCircleIcon,
    ChevronDown,
    ChevronUp,
    Search as SearchIcon,
} from "lucide-react";
import { ButtonSignOut } from "./button-signout";

// Componente de Menu extraído para fora do ModernSidebar
function SidebarMenu({ userName }: { userName: string }) {
    const [openServicesMenu, setOpenServicesMenu] = useState(false);

    return (
        <div className="flex flex-col h-full">
            {/* Logo e Nome do Usuário */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex justify-center mb-3">
                    <Image
                        src="/images/logo.svg"
                        alt="Agenda AI Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <div className="text-white text-center">Bem-vindo(a), {userName}</div>
            </div>

            {/* Links de Navegação */}
            <nav className="flex-grow p-3">
                <div className="flex flex-col space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-gray-700/50 transition-colors"
                    >
                        <HomeIcon size={18} /> Dashboard
                    </Link>

                    <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-gray-700/50 transition-colors"
                    >
                        <UserIcon size={18} /> Perfil
                    </Link>

                    <Link
                        href="/qrcode"
                        className="flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-gray-700/50 transition-colors"
                    >
                        <QrCodeIcon size={18} /> Gerar QR Code
                    </Link>

                    {/* Menu Serviços com Submenu */}
                    <div>
                        <button
                            onClick={() => setOpenServicesMenu(!openServicesMenu)}
                            className="w-full flex items-center justify-between px-3 py-2 text-white rounded-md hover:bg-gray-700/50 transition-colors"
                            type="button"
                            aria-expanded={openServicesMenu}
                        >
                            <span className="flex items-center gap-3">
                                <ScissorsIcon size={18} /> Serviços
                            </span>
                            {openServicesMenu ? (
                                <ChevronUp size={16} />
                            ) : (
                                <ChevronDown size={16} />
                            )}
                        </button>

                        <div className={`${openServicesMenu ? "block" : "hidden"} pl-5 mt-1 space-y-1`}>
                            <Link
                                href="/service/catalog"
                                className="flex items-center gap-2 px-3 py-2 text-white rounded-md hover:bg-gray-700/50 transition-colors"
                            >
                                <SearchIcon size={16} /> Listar Serviços
                            </Link>
                            <Link
                                href="/service/addService"
                                className="flex items-center gap-2 px-3 py-2 text-white rounded-md hover:bg-gray-700/50 transition-colors"
                            >
                                <PlusCircleIcon size={16} /> Adicionar Serviço
                            </Link>
                        </div>
                    </div>

                    {/* Calendário */}
                    <Link
                        href="/calendar"
                        className="flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-gray-700/50 transition-colors"
                    >
                        <CalendarIcon size={18} /> Calendário
                    </Link>

                    {/* Disponibilidade */}
                    <Link
                        href="/availability"
                        className="flex items-center gap-3 px-3 py-2 text-white rounded-md hover:bg-gray-700/50 transition-colors"
                    >
                        <ClockIcon size={18} /> Disponibilidade
                    </Link>
                </div>
            </nav>

            {/* Botão Sair */}
            <div className="p-3 border-t border-gray-700">
                <ButtonSignOut />
            </div>
        </div>
    );
}

export function ModernSidebar({ userName }: { userName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarTitleId = useId();
    const sidebarMenuId = useId();

    return (
        <>
            {/* Navbar Mobile */}
            <div className="fixed top-0 z-50 w-full bg-gray-900 border-b border-gray-800 lg:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/images/logo.svg"
                            alt="Agenda AI Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <span id={sidebarTitleId} className="text-lg font-semibold text-white">
                            Agenda<span className="text-primary">AI</span>
                        </span>
                    </div>

                    <button
                        className="flex items-center p-2 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={sidebarMenuId}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span className="sr-only">Abrir menu</span>
                    </button>
                </div>
            </div>

            {/* Sidebar Desktop */}
            <div
                className="hidden lg:block fixed bg-gray-900 border-r border-gray-800"
                style={{ width: "256px", minHeight: "100vh" }}
            >
                <SidebarMenu userName={userName} />
            </div>

            {/* Sidebar Mobile */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "block" : "hidden"}`}
                id={sidebarMenuId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={sidebarTitleId}
            >
                {/* Overlay para fechar o menu quando clicado */}
                <div
                    className="fixed inset-0 bg-black/50"
                    aria-hidden="true"
                    onClick={() => setIsOpen(false)}
                ></div>

                <div
                    className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                        } transition-transform duration-300 ease-in-out`}
                >
                    <div className="flex justify-end p-4">
                        <button
                            type="button"
                            className="p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                            onClick={() => setIsOpen(false)}
                            aria-label="Fechar menu de navegação"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="sr-only">Fechar menu</span>
                        </button>
                    </div>
                    <div className="overflow-y-auto">
                        <SidebarMenu userName={userName} />
                    </div>
                </div>
            </div>
        </>
    );
}
