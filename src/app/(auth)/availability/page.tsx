"use client";

import React, { useState, useEffect } from "react";
import { Clock, Save, Plus, Trash2, Loader2, Check, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Interface para os horários de funcionamento
interface BusinessHour {
    day: string;
    isOpen: boolean;
    periods: {
        id?: string;
        start: string;
        end: string;
    }[];
}

const DAYS_OF_WEEK = [
    { id: "monday", label: "Segunda-feira" },
    { id: "tuesday", label: "Terça-feira" },
    { id: "wednesday", label: "Quarta-feira" },
    { id: "thursday", label: "Quinta-feira" },
    { id: "friday", label: "Sexta-feira" },
    { id: "saturday", label: "Sábado" },
    { id: "sunday", label: "Domingo" },
];

export default function AvailabilityPage() {
    const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    // Inicializa os horários de funcionamento
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Dados de exemplo (deve vir da API)
                const mockData: BusinessHour[] = DAYS_OF_WEEK.map(day => ({
                    day: day.id,
                    isOpen: ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day.id),
                    periods: ["monday", "tuesday", "wednesday", "thursday", "friday"].includes(day.id)
                        ? [{ start: "09:00", end: "18:00" }]
                        : [],
                }));

                setTimeout(() => {
                    setBusinessHours(mockData);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Erro ao carregar disponibilidade:", error);
                setIsLoading(false);
                setFeedbackMessage({
                    type: "error",
                    text: "Não foi possível carregar os dados de disponibilidade."
                });
            }
        };

        fetchData();
    }, []);

    // Alternar dia aberto/fechado
    const toggleDayOpen = (dayIndex: number) => {
        setBusinessHours(prev => {
            const newHours = [...prev];

            // Se estiver alterando para aberto e não tiver períodos, adicione um período padrão
            if (!newHours[dayIndex].isOpen && newHours[dayIndex].periods.length === 0) {
                newHours[dayIndex] = {
                    ...newHours[dayIndex],
                    isOpen: true,
                    periods: [{ start: "09:00", end: "18:00" }]
                };
            } else {
                // Apenas inverte o estado
                newHours[dayIndex] = {
                    ...newHours[dayIndex],
                    isOpen: !newHours[dayIndex].isOpen
                };
            }

            return newHours;
        });
    };

    // Adicionar novo período em um dia
    const addPeriod = (dayIndex: number) => {
        setBusinessHours(prev => {
            const newHours = [...prev];

            // Adicionar novo período com horário padrão
            const existingPeriods = [...newHours[dayIndex].periods];
            const lastPeriod = existingPeriods[existingPeriods.length - 1];

            // Calcular horário para o próximo período
            const newStart = lastPeriod?.end || "09:00";
            const hour = parseInt(newStart.split(':')[0]);
            let newEnd = (hour + 1) + ":00";

            if (hour >= 23) newEnd = "23:59";

            existingPeriods.push({ start: newStart, end: newEnd });

            newHours[dayIndex] = {
                ...newHours[dayIndex],
                periods: existingPeriods
            };

            return newHours;
        });
    };

    // Remover período
    const removePeriod = (dayIndex: number, periodIndex: number) => {
        setBusinessHours(prev => {
            const newHours = [...prev];

            const existingPeriods = [...newHours[dayIndex].periods];
            existingPeriods.splice(periodIndex, 1);

            newHours[dayIndex] = {
                ...newHours[dayIndex],
                periods: existingPeriods,
                // Se não houver mais períodos, marcar como fechado
                isOpen: existingPeriods.length > 0 ? newHours[dayIndex].isOpen : false
            };

            return newHours;
        });
    };

    // Atualizar horário de início ou fim de um período
    const updatePeriodTime = (dayIndex: number, periodIndex: number, field: 'start' | 'end', value: string) => {
        setBusinessHours(prev => {
            const newHours = [...prev];
            const existingPeriods = [...newHours[dayIndex].periods];

            existingPeriods[periodIndex] = {
                ...existingPeriods[periodIndex],
                [field]: value
            };

            newHours[dayIndex] = {
                ...newHours[dayIndex],
                periods: existingPeriods
            };

            return newHours;
        });
    };

    // Salvar alterações
    const saveChanges = async () => {
        try {
            setIsSaving(true);

            // Simular chamada para API
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Dados enviados:", businessHours);

            setFeedbackMessage({
                type: "success",
                text: "Disponibilidade salva com sucesso!"
            });

            // Limpar mensagem após 3 segundos
            setTimeout(() => {
                setFeedbackMessage(null);
            }, 3000);

        } catch (error) {
            console.error("Erro ao salvar disponibilidade:", error);
            setFeedbackMessage({
                type: "error",
                text: "Erro ao salvar alterações."
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout userName="Usuário">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Disponibilidade</h1>
                        <p className="text-muted-foreground">
                            Configure seus horários de atendimento
                        </p>
                    </div>
                    <div>
                        <Button
                            onClick={saveChanges}
                            disabled={isLoading || isSaving}
                            className="flex items-center gap-2"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            Salvar Alterações
                        </Button>
                    </div>
                </div>

                {/* Mensagem de feedback */}
                {feedbackMessage && (
                    <div className={`p-4 mb-4 rounded-lg flex items-center gap-3 
            ${feedbackMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                        {feedbackMessage.type === 'success' ?
                            <Check size={20} className="text-emerald-500" /> :
                            <AlertCircle size={20} className="text-red-500" />
                        }
                        <span>{feedbackMessage.text}</span>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Horários de Funcionamento
                        </CardTitle>
                        <CardDescription>
                            Configure os dias e horários disponíveis para agendamento
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {businessHours.map((day, dayIndex) => (
                                    <div key={day.day} className="border rounded-lg p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                            <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                                <Switch
                                                    checked={day.isOpen}
                                                    onCheckedChange={() => toggleDayOpen(dayIndex)}
                                                />
                                                <h3 className="text-lg font-medium">{DAYS_OF_WEEK.find(d => d.id === day.day)?.label}</h3>
                                            </div>

                                            <div>
                                                {day.isOpen && (
                                                    <Button
                                                        onClick={() => addPeriod(dayIndex)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Plus size={16} />
                                                        Adicionar Horário
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {!day.isOpen ? (
                                            <p className="text-muted-foreground text-sm">Fechado</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {day.periods.map((period, periodIndex) => (
                                                    <div key={period.id || period.start} className="grid grid-cols-1 sm:grid-cols-8 gap-3 items-center">
                                                        <div className="sm:col-span-3">
                                                            <div className="flex items-center">
                                                                <span className="text-sm font-medium w-14">Início:</span>
                                                                <input
                                                                    type="time"
                                                                    value={period.start}
                                                                    onChange={(e) => updatePeriodTime(dayIndex, periodIndex, 'start', e.target.value)}
                                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-3">
                                                            <div className="flex items-center">
                                                                <span className="text-sm font-medium w-14">Fim:</span>
                                                                <input
                                                                    type="time"
                                                                    value={period.end}
                                                                    onChange={(e) => updatePeriodTime(dayIndex, periodIndex, 'end', e.target.value)}
                                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="sm:col-span-2 flex justify-end">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removePeriod(dayIndex, periodIndex)}
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
