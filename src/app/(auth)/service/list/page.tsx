"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, Edit, ArrowUpDown, ChevronDown, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    category?: string;
    imageUrl?: string;
}

export default function ServiceListPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const N8N_SEARCH_SERVICES_WEBHOOK_URL =
        "https://n8n.ronnysenna.com.br/webhook/buscar-servicos";

    // Carregar serviços ao montar o componente
    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

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

    // Função para formatar duração
    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            return remainingMinutes > 0
                ? `${hours}h ${remainingMinutes}min`
                : `${hours}h`;
        }
    };

    // Função para ordenar os serviços
    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    // Ordenar os serviços
    const sortedServices = useMemo(() => {
        return [...services].sort((a, b) => {
            const direction = sortDirection === "asc" ? 1 : -1;

            switch (sortColumn) {
                case "name":
                    return a.name.localeCompare(b.name) * direction;
                case "price":
                    return ((a.price || 0) - (b.price || 0)) * direction;
                case "duration":
                    return (a.duration - b.duration) * direction;
                case "category":
                    return ((a.category || "").localeCompare(b.category || "")) * direction;
                default:
                    return 0;
            }
        });
    }, [services, sortColumn, sortDirection]);

    // Paginação
    const paginatedServices = useMemo(() => {
        return sortedServices.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [sortedServices, currentPage, itemsPerPage]);

    // Calcular número total de páginas
    const totalPages = Math.ceil(sortedServices.length / itemsPerPage);

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
                            Lista de Serviços
                        </h1>
                        <p className="text-muted-foreground">
                            Visualize e gerencie todos os seus serviços
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" asChild>
                            <Link href="/service/catalog">
                                <ChevronDown size={16} className="mr-1" />
                                Ver em cards
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/service/addService">
                                <Plus size={18} />
                                <span>Novo Serviço</span>
                            </Link>
                        </Button>
                    </div>
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
                ) : (
                    <div className="rounded-lg border overflow-hidden">
                        <Table>
                            <caption className="sr-only">Lista de serviços disponíveis</caption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort("name")}
                                        aria-sort={sortColumn === "name" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
                                        role="columnheader"
                                    >
                                        <div className="flex items-center">
                                            Nome do Serviço
                                            <ArrowUpDown size={16} className="ml-2" aria-hidden="true" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hidden md:table-cell"
                                        onClick={() => handleSort("category")}
                                        aria-sort={sortColumn === "category" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
                                        role="columnheader"
                                    >
                                        <div className="flex items-center">
                                            Categoria
                                            <ArrowUpDown size={16} className="ml-2" aria-hidden="true" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer"
                                        onClick={() => handleSort("price")}
                                        aria-sort={sortColumn === "price" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
                                        role="columnheader"
                                    >
                                        <div className="flex items-center">
                                            Preço
                                            <ArrowUpDown size={16} className="ml-2" aria-hidden="true" />
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hidden sm:table-cell"
                                        onClick={() => handleSort("duration")}
                                        aria-sort={sortColumn === "duration" ? (sortDirection === "asc" ? "ascending" : "descending") : undefined}
                                        role="columnheader"
                                    >
                                        <div className="flex items-center">
                                            Duração
                                            <ArrowUpDown size={16} className="ml-2" aria-hidden="true" />
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-right" role="columnheader">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedServices.length > 0 ? (
                                    paginatedServices.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell className="font-medium">{service.name}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {service.category ? (
                                                    <Badge variant="secondary" className="font-normal">
                                                        {service.category}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">Sem categoria</span>
                                                )}
                                            </TableCell>
                                            <TableCell>R$ {service.price?.toFixed(2)}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                {formatDuration(service.duration)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                        aria-label={`Editar serviço ${service.name}`}
                                                    >
                                                        <Link href={`/service/${service.id}/editService`}>
                                                            <Edit size={16} className="mr-1" />
                                                            <span className="sr-only md:not-sr-only md:inline-block">Editar</span>
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex flex-col items-center">
                                                <div className="bg-muted/30 p-4 rounded-full mb-4">
                                                    <Search size={24} className="text-muted-foreground" />
                                                </div>
                                                <h5 className="text-lg font-medium mb-1">Nenhum serviço encontrado</h5>
                                                <p className="text-muted-foreground">
                                                    Tente buscar com outros termos
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {services.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                        <div className="text-sm text-muted-foreground">
                            Mostrando {paginatedServices.length} de {services.length} serviços
                        </div>
                        <div className="flex items-center space-x-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                aria-label="Página anterior"
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft size={16} />
                                <span>Anterior</span>
                            </Button>
                            <span className="text-sm font-medium">
                                Página {currentPage} de {totalPages || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                aria-label="Próxima página"
                                className="flex items-center gap-1"
                            >
                                <span>Próxima</span>
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
