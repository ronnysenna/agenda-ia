"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Settings, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { BigCalendar } from '@/components/ui/big-calendar';
import type { AppointmentEvent } from '@/components/ui/big-calendar';

export default function CalendarPage() {
    const [events, setEvents] = useState<AppointmentEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<AppointmentEvent | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);

                // Dados de exemplo para teste
                const mockEvents: AppointmentEvent[] = [
                    {
                        id: '1',
                        title: 'Corte de Cabelo - João',
                        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0),
                        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 11, 0),
                        resource: {
                            clientName: 'João Silva',
                            clientPhone: '(11) 98765-4321',
                            serviceName: 'Corte de Cabelo',
                            status: 'confirmed',
                        },
                    },
                    {
                        id: '2',
                        title: 'Manicure - Maria',
                        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 14, 0),
                        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 15, 30),
                        resource: {
                            clientName: 'Maria Oliveira',
                            clientPhone: '(11) 91234-5678',
                            serviceName: 'Manicure',
                            status: 'pending',
                        },
                    },
                    {
                        id: '3',
                        title: 'Barba - Carlos',
                        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 9, 0),
                        end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 9, 30),
                        resource: {
                            clientName: 'Carlos Ferreira',
                            clientPhone: '(11) 93456-7890',
                            serviceName: 'Barba',
                            status: 'cancelled',
                        },
                    },
                ];

                setTimeout(() => {
                    setEvents(mockEvents);
                    setIsLoading(false);
                }, 1000);

            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleEventSelect = (event: AppointmentEvent) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const handleSlotSelect = (slotInfo: { start: Date; end: Date }) => {
        setSelectedDate(slotInfo.start);
        setShowModal(true);
    };

    return (
        <DashboardLayout userName="Usuário">
            {/* Cabeçalho da página */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Agenda de Atendimentos</h1>
                    <p className="text-muted-foreground">
                        Gerencie seus horários e agendamentos
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Link
                        href="/calendar/settings"
                        className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Settings size={18} />
                        <span>Configurações</span>
                    </Link>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                        onClick={() => {
                            setSelectedEvent(null);
                            setShowModal(true);
                        }}
                    >
                        <Plus size={18} />
                        <span>Novo Agendamento</span>
                    </button>
                </div>
            </div>

            {/* Calendário */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <BigCalendar
                    events={events}
                    onSelectEvent={handleEventSelect}
                    onSelectSlot={handleSlotSelect}
                />
            )}

            {/* Legenda */}
            <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="text-sm">Agendado</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-sm">Confirmado</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-sm">Pendente</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm">Cancelado</span>
                </div>
            </div>

            {/* Modal de Agendamento (simples) */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedEvent ? 'Editar Agendamento' : 'Novo Agendamento'}
                        </h2>
                        {/* Formulário simplificado */}
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="px-4 py-2 border rounded-md"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-primary text-white rounded-md"
                                onClick={() => setShowModal(false)}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
