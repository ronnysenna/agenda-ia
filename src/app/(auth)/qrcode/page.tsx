"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
    Loader2, QrCode, Trash2, History, AlertCircle, ListChecks,
    CheckCircle, XCircle, Info, RefreshCw, HelpCircle
} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QRCodeResponse {
    qrcode?: string;
    qrCodeBase64?: string;
    status?: string;
    error?: string;
    instance?: {
        instanceName?: string;
        status?: string;
    };
}

interface InstanceHistory {
    id: string;
    name: string;
    lastConnected: string;
    status: "connected" | "disconnected" | "error";
}

interface InstanceDetail {
    id: string;
    name: string;
    status: string;
}

// Mapeamento de status para UI
const STATUS_DISPLAY_INFO: Record<string, {
    text: string;
    color: string;
    bgColor: string;
    icon: React.ElementType
}> = {
    conectado: {
        text: "Conectado",
        color: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        icon: CheckCircle
    },
    open: {
        text: "Conectado",
        color: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        icon: CheckCircle
    },
    close: {
        text: "Desconectado",
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: XCircle
    },
    disconnected: {
        text: "Desconectado",
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: XCircle
    },
    error: {
        text: "Erro",
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        icon: AlertCircle
    },
    qrcode: {
        text: "QR Code",
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        icon: QrCode
    },
    connecting: {
        text: "Conectando",
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        icon: Loader2
    },
};

export default function QRCodePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isLoadingQR, setIsLoadingQR] = useState(false);
    const [isLoadingInstances, setIsLoadingInstances] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [qrCodeData, setQrCodeData] = useState<QRCodeResponse | null>(null);
    const [instanceHistory, setInstanceHistory] = useState<InstanceHistory[]>([]);
    const [instanceList, setInstanceList] = useState<InstanceDetail[]>([]);
    const [currentTab, setCurrentTab] = useState("connection");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Carregar estado atual da conexão
    useEffect(() => {
        const fetchConnectionStatus = async () => {
            try {
                setIsLoading(true);

                // Simular chamada para API
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Dados de exemplo
                const mockData: QRCodeResponse = {
                    status: "close",
                };

                setQrCodeData(mockData);

            } catch (error) {
                console.error("Erro ao verificar conexão:", error);
                setError("Não foi possível verificar o status da conexão");
            } finally {
                setIsLoading(false);
            }
        };

        fetchConnectionStatus();

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, []);

    // Carregar histórico de instâncias
    useEffect(() => {
        const fetchInstanceHistory = async () => {
            try {
                // Simular chamada para API
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Dados de exemplo
                const mockHistory: InstanceHistory[] = [
                    {
                        id: "1",
                        name: "agenda_ai",
                        lastConnected: "2025-10-10T15:30:00Z",
                        status: "connected"
                    },
                    {
                        id: "2",
                        name: "agenda_ai_backup",
                        lastConnected: "2025-10-05T10:15:00Z",
                        status: "disconnected"
                    }
                ];

                setInstanceHistory(mockHistory);

            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            }
        };

        if (currentTab === "history") {
            fetchInstanceHistory();
        }
    }, [currentTab]);

    // Carregar lista de instâncias
    const fetchInstanceList = useCallback(async () => {
        if (currentTab !== "instances") return;

        try {
            setIsLoadingInstances(true);

            // Simular chamada para API
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Dados de exemplo
            const mockInstances: InstanceDetail[] = [
                { id: "1", name: "agenda_ai", status: "open" },
                { id: "2", name: "agenda_ai_backup", status: "close" }
            ];

            setInstanceList(mockInstances);

        } catch (error) {
            console.error("Erro ao listar instâncias:", error);
            setError("Não foi possível listar as instâncias");
        } finally {
            setIsLoadingInstances(false);
        }
    }, [currentTab]);

    // Carregar lista de instâncias quando a aba for selecionada
    useEffect(() => {
        if (currentTab === "instances") {
            fetchInstanceList();
        }
    }, [currentTab, fetchInstanceList]);

    // Gerar novo QR Code
    const generateQRCode = async () => {
        try {
            setIsLoadingQR(true);
            setError(null);

            // Simular chamada para API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Dados de exemplo
            const mockResponse: QRCodeResponse = {
                qrCodeBase64: "data:image/png;base64,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",
                status: "qrcode",
            };

            setQrCodeData(mockResponse);

            // Iniciar polling para verificar a conexão
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }

            pollIntervalRef.current = setInterval(() => {
                checkConnectionStatus();
            }, 3000);

        } catch (error) {
            console.error("Erro ao gerar QR Code:", error);
            setError("Não foi possível gerar o QR Code. Tente novamente.");
        } finally {
            setIsLoadingQR(false);
        }
    };

    // Verificar status da conexão
    const checkConnectionStatus = async () => {
        try {
            // Simular chamada para API
            const mockResponse: QRCodeResponse = {
                status: Math.random() > 0.5 ? "open" : "qrcode",
            };

            setQrCodeData(mockResponse);

            // Se conectado, parar de verificar
            if (mockResponse.status === "open") {
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }

                setSuccessMessage("WhatsApp conectado com sucesso!");
                setTimeout(() => setSuccessMessage(null), 5000);
            }

        } catch (error) {
            console.error("Erro ao verificar conexão:", error);
        }
    };

    // Desconectar WhatsApp
    const disconnectWhatsApp = async () => {
        try {
            setIsDisconnecting(true);
            setError(null);

            // Simular chamada para API
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simular resposta de sucesso
            setQrCodeData({
                status: "close"
            });

            setSuccessMessage("WhatsApp desconectado com sucesso!");
            setTimeout(() => setSuccessMessage(null), 5000);

        } catch (error) {
            console.error("Erro ao desconectar:", error);
            setError("Não foi possível desconectar o WhatsApp");
        } finally {
            setIsDisconnecting(false);
        }
    };

    // Excluir instância
    const deleteInstance = async (instanceName: string) => {
        try {
            // Simular chamada para API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Atualizar a lista após exclusão
            setInstanceList(prev => prev.filter(instance => instance.name !== instanceName));

            setSuccessMessage(`Instância ${instanceName} excluída com sucesso!`);
            setTimeout(() => setSuccessMessage(null), 5000);

        } catch (error) {
            console.error("Erro ao excluir instância:", error);
            setError(`Não foi possível excluir a instância ${instanceName}`);
        }
    };

    // Renderizar status atual com cor e ícone apropriados
    const renderStatus = useCallback(() => {
        if (!qrCodeData || !qrCodeData.status) return null;

        const statusInfo = STATUS_DISPLAY_INFO[qrCodeData.status] || {
            text: "Desconhecido",
            color: "text-gray-500",
            bgColor: "bg-gray-50 dark:bg-gray-800",
            icon: HelpCircle
        };

        const StatusIcon = statusInfo.icon;

        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                <StatusIcon size={16} />
                <span className="font-medium">{statusInfo.text}</span>
            </div>
        );
    }, [qrCodeData]);

    return (
        <DashboardLayout userName="Usuário">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Conexão WhatsApp</h1>
                    <p className="text-muted-foreground">
                        Configure a conexão do WhatsApp para enviar mensagens
                    </p>
                </div>

                {/* Mensagens de feedback */}
                {error && (
                    <div className="p-4 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-500" />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="p-4 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 flex items-center gap-3">
                        <CheckCircle size={20} className="text-emerald-500" />
                        <span>{successMessage}</span>
                    </div>
                )}

                <Tabs
                    defaultValue="connection"
                    value={currentTab}
                    onValueChange={setCurrentTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 mb-8">
                        <TabsTrigger value="connection" className="flex items-center gap-2">
                            <QrCode size={16} />
                            <span>Conexão</span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History size={16} />
                            <span>Histórico</span>
                        </TabsTrigger>
                        <TabsTrigger value="instances" className="flex items-center gap-2">
                            <ListChecks size={16} />
                            <span>Instâncias</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="connection">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle>Status da Conexão</CardTitle>
                                        <CardDescription>
                                            Escaneie o QR Code para conectar seu WhatsApp
                                        </CardDescription>
                                    </div>
                                    {!isLoading && renderStatus()}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                                            {qrCodeData?.status === "qrcode" && qrCodeData?.qrCodeBase64 ? (
                                                <div className="text-center">
                                                    <div className="mb-4">
                                                        <Image
                                                            src={qrCodeData.qrCodeBase64}
                                                            alt="QR Code do WhatsApp"
                                                            width={280}
                                                            height={280}
                                                            className="mx-auto"
                                                        />
                                                    </div>
                                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                                        Escaneie este QR Code com seu WhatsApp para conectar
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <QrCode size={120} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                                    <p className="text-muted-foreground mb-2">
                                                        {qrCodeData?.status === "open"
                                                            ? "WhatsApp já está conectado"
                                                            : "Gere um QR Code para conectar seu WhatsApp"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col justify-center space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="font-medium">Instruções</h3>
                                                <div className="space-y-4 text-sm text-muted-foreground">
                                                    <div className="flex gap-2">
                                                        <div className="flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center flex-shrink-0">
                                                            1
                                                        </div>
                                                        <p>Abra o WhatsApp no seu celular</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center flex-shrink-0">
                                                            2
                                                        </div>
                                                        <p>Toque em Mais opções ou Configurações e selecione Dispositivos conectados</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center flex-shrink-0">
                                                            3
                                                        </div>
                                                        <p>Toque em Conectar um dispositivo</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <div className="flex h-6 w-6 rounded-full bg-primary/10 text-primary items-center justify-center flex-shrink-0">
                                                            4
                                                        </div>
                                                        <p>Aponte seu celular para esta tela para capturar o código QR</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col xs:flex-row gap-3">
                                                <Button
                                                    onClick={generateQRCode}
                                                    disabled={isLoadingQR || (qrCodeData?.status === "qrcode")}
                                                    className="flex items-center gap-2"
                                                >
                                                    {isLoadingQR ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                                                    {qrCodeData?.status === "qrcode" ? "QR Code gerado" : "Gerar QR Code"}
                                                </Button>

                                                {qrCodeData?.status === "open" && (
                                                    <Button
                                                        onClick={disconnectWhatsApp}
                                                        disabled={isDisconnecting}
                                                        variant="destructive"
                                                        className="flex items-center gap-2"
                                                    >
                                                        {isDisconnecting ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                                        Desconectar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col items-start">
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Info size={16} className="mt-0.5 flex-shrink-0" />
                                    <p>
                                        Depois de conectado, seu WhatsApp permanecerá ativo até que você desconecte manualmente
                                        ou limpe os dados do navegador. Não desinstale o WhatsApp do seu telefone.
                                    </p>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Histórico de Conexões</CardTitle>
                                <CardDescription>
                                    Visualize o histórico de conexões do WhatsApp
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {instanceHistory.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <History size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                                        <p>Nenhum histórico de conexão encontrado</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {instanceHistory.map((instance) => (
                                            <div
                                                key={instance.id}
                                                className="p-4 border rounded-lg flex items-center justify-between"
                                            >
                                                <div>
                                                    <div className="font-medium mb-1">{instance.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Última conexão: {new Date(instance.lastConnected).toLocaleString('pt-BR')}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                            ${instance.status === 'connected'
                                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                            : instance.status === 'error'
                                                                ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                        }`}
                                                    >
                                                        {instance.status === 'connected' ? (
                                                            <CheckCircle size={12} />
                                                        ) : instance.status === 'error' ? (
                                                            <AlertCircle size={12} />
                                                        ) : (
                                                            <XCircle size={12} />
                                                        )}
                                                        <span>
                                                            {instance.status === 'connected'
                                                                ? 'Conectado'
                                                                : instance.status === 'error'
                                                                    ? 'Erro'
                                                                    : 'Desconectado'
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="instances">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle>Instâncias Disponíveis</CardTitle>
                                        <CardDescription>
                                            Gerencie as instâncias de WhatsApp
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={fetchInstanceList}
                                        className="flex items-center gap-1.5"
                                        disabled={isLoadingInstances}
                                    >
                                        <RefreshCw size={14} className={isLoadingInstances ? "animate-spin" : ""} />
                                        Atualizar
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isLoadingInstances ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : instanceList.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <ListChecks size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                                        <p>Nenhuma instância encontrada</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {instanceList.map((instance) => {
                                            const statusInfo = STATUS_DISPLAY_INFO[instance.status] || {
                                                text: "Desconhecido",
                                                color: "text-gray-500",
                                                bgColor: "bg-gray-50",
                                                icon: HelpCircle
                                            };

                                            const StatusIcon = statusInfo.icon;

                                            return (
                                                <div
                                                    key={instance.id}
                                                    className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                                >
                                                    <div>
                                                        <div className="font-medium mb-1">{instance.name}</div>
                                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${statusInfo.bgColor} ${statusInfo.color} text-xs`}>
                                                            <StatusIcon size={12} />
                                                            <span>{statusInfo.text}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1.5"
                                                            disabled={instance.status === "open"}
                                                            onClick={() => {
                                                                // Lógica para reconectar
                                                                alert("Funcionalidade em desenvolvimento");
                                                            }}
                                                        >
                                                            <RefreshCw size={14} />
                                                            Reconectar
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            onClick={() => deleteInstance(instance.name)}
                                                        >
                                                            <Trash2 size={14} />
                                                            Excluir
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
