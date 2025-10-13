"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    Home,
    User,
    QrCode,
    Calendar,
    Clock,
    Scissors,
    PlusCircle,
    ChevronDown,
    ChevronUp,
    Search,
    Menu,
    X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ButtonSignOut } from "./button-signout";

type SidebarLinkProps = {
    href: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
};

const SidebarLink = ({ href, icon, children, isActive, onClick }: SidebarLinkProps) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
        onClick={onClick}
    >
        <span className={`${isActive ? "text-primary" : "text-gray-400"}`}>
            {icon}
        </span>
        <span>{children}</span>
    </Link>
);

export function ModernSidebar({ userName }: { userName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openServicesMenu, setOpenServicesMenu] = useState(false);
    const pathname = usePathname();

    // Close sidebar on mobile when navigating
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Check if running on small screen
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const toggleServicesMenu = () => {
        setOpenServicesMenu(!openServicesMenu);
    };

    // Sidebar content
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-gray-800 dark:bg-gray-900 shadow-lg">
            {/* Logo e Nome do Usuário */}
            <div className="p-5 border-b border-gray-700 dark:border-gray-700">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center transition-all hover:bg-primary/20">
                        <Image
                            src="/images/logo.svg"
                            alt="Agenda AI Logo"
                            width={60}
                            height={60}
                            className="object-contain"
                        />
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Bem-vindo(a)</div>
                    <div className="text-base font-medium text-white">{userName}</div>
                </div>
            </div>

            {/* Links de Navegação */}
            <nav className="flex-grow p-3 overflow-y-auto space-y-1">
                <SidebarLink
                    href="/dashboard"
                    icon={<Home size={20} />}
                    isActive={pathname === "/dashboard"}
                >
                    Dashboard
                </SidebarLink>

                <SidebarLink
                    href="/profile"
                    icon={<User size={20} />}
                    isActive={pathname === "/profile"}
                >
                    Meu Perfil
                </SidebarLink>

                <SidebarLink
                    href="/qrcode"
                    icon={<QrCode size={20} />}
                    isActive={pathname === "/qrcode"}
                >
                    QR Code
                </SidebarLink>

                <SidebarLink
                    href="/calendar"
                    icon={<Calendar size={20} />}
                    isActive={pathname === "/calendar"}
                >
                    Calendário
                </SidebarLink>

                <SidebarLink
                    href="/availability"
                    icon={<Clock size={20} />}
                    isActive={pathname === "/availability"}
                >
                    Disponibilidade
                </SidebarLink>

                {/* Menu Serviços com submenu */}
                <div className="mt-1">
                    <button
                        onClick={toggleServicesMenu}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${pathname.includes("/service")
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`${pathname.includes("/service") ? "text-primary" : "text-gray-400"}`}>
                                <Scissors size={20} />
                            </span>
                            <span>Serviços</span>
                        </div>
                        {openServicesMenu ? (
                            <ChevronUp size={18} />
                        ) : (
                            <ChevronDown size={18} />
                        )}
                    </button>

                    {openServicesMenu && (
                        <div className="ml-7 mt-1 space-y-1 pl-3 border-l border-gray-600">
                            <SidebarLink
                                href="/service/catalog"
                                icon={<Search size={18} />}
                                isActive={pathname === "/service/catalog"}
                            >
                                Catálogo
                            </SidebarLink>

                            <SidebarLink
                                href="/service/addService"
                                icon={<PlusCircle size={18} />}
                                isActive={pathname === "/service/addService"}
                            >
                                Adicionar
                            </SidebarLink>
                        </div>
                    )}
                </div>
            </nav>

            {/* Footer com botão de logout */}
            <div className="p-4 border-t border-gray-700">
                <ButtonSignOut />
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block h-screen w-64 fixed left-0 top-0 z-40">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar (Slide-in) */}
            {isMobile && (
                <>
                    {/* Overlay */}
                    {isOpen && (
                        <button
                            type="button"
                            aria-label="Fechar menu"
                            className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity cursor-default"
                            onClick={() => setIsOpen(false)}
                            onKeyUp={(e) => {
                                if (e.key === 'Escape') setIsOpen(false);
                            }}
                        />
                    )}

                    {/* Sidebar */}
                    <div
                        className={`fixed inset-y-0 left-0 w-64 z-40 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                            } transition-transform duration-300 ease-in-out lg:hidden`}
                    >
                        <SidebarContent />
                    </div>
                </>
            )}

            {/* Content Margin (for desktop) */}
            <div className="lg:pl-64"></div>
        </>
    );
}
