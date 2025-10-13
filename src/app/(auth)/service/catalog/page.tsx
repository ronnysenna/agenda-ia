"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, AlertCircle } from "lucide-react";
import { ServiceCard } from "@/components/ui/service-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number; // duração em minutos
    imageUrl?: string;
    category?: string;
}

export default function ServicesCatalogPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const N8N_SEARCH_SERVICES_WEBHOOK_URL =
        "https://n8n.ronnysenna.com.br/webhook/buscar-servicos";

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setServices([]);

        try {
            const response = await fetch(N8N_SEARCH_SERVICES_WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ searchTerm: searchTerm.trim() }),
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar serviços: ${response.statusText}`);
            }

            const data = await response.json();
            setServices(data);
        } catch (error) {
            console.error("Erro:", error);
            setError(
                error instanceof Error ? error.message : "Erro ao buscar serviços",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 max-w-7xl">
            {error && (
                <div className="bg-destructive/15 text-destructive p-4 rounded-lg flex items-center gap-2 mb-6">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            <Card className="p-6">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                            Catálogo de Serviços
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie seus serviços e horários
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/service/addService">
                            <Plus size={18} />
                            <span>Novo Serviço</span>
                        </Link>
                    </Button>
                </div>

                <div className="bg-muted/40 p-4 rounded-lg mb-6">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSearch();
                        }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Digite o nome do serviço, categoria ou descrição..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Buscando...</span>
                                </>
                            ) : (
                                <>
                                    <Search size={18} />
                                    <span>Buscar</span>
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                        <p className="text-muted-foreground">Buscando serviços...</p>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <ServiceCard
                                key={service.id}
                                id={service.id}
                                name={service.name}
                                description={service.description}
                                price={service.price}
                                duration={service.duration}
                                category={service.category}
                                imageUrl={service.imageUrl}
                            />
                        ))}
                    </div>
                ) : (
                    !loading &&
                    searchTerm && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="bg-muted/30 p-4 rounded-full mb-4">
                                <Search size={24} className="text-muted-foreground" />
                            </div>
                            <h5 className="text-lg font-medium mb-1">Nenhum serviço encontrado</h5>
                            <p className="text-muted-foreground">
                                Tente buscar com outros termos
                            </p>
                        </div>
                    )
                )}
            </Card>
        </div>
    );
}
