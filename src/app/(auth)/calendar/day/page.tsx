"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { format, parse, addHours, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, User, Phone } from 'lucide-react';
import AppointmentModal from '@/components/appointments/appointment-modal';

interface Appointment {
    id: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string | null;
    serviceName: string;
    startTime: Date;
    endTime: Date;
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
    notes?: string | null;
}

interface TimeSlot {
    time: string;
    appointments: Appointment[];
    isAvailable: boolean;
}

// Horário comercial padrão (8:00 às 18:00)
const BUSINESS_HOURS = {
    start: 8,
    end: 18,
};

// Intervalo em minutos
const TIME_INTERVAL = 30;

export default function CalendarDayPage(props: { params: { date?: string } }) {
    const { params } = props;
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

    useEffect(() => {
        if (params?.date) {
            try {
                const date = new Date(params.date);
                if (!Number.isNaN(date.getTime())) {
                    setSelectedDate(date);
                }
            } catch {
                console.error("Data inválida na URL");
            }
        }
    }, [params]);

    const fetchAppointments = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const mockAppointments: Appointment[] = [
                {
                    id: '1',
                    clientName: 'João Silva',
                    clientPhone: '(11) 98765-4321',
                    serviceName: 'Corte de Cabelo',
                    startTime: addHours(new Date(selectedDate), 10), // 10:00
                    endTime: addHours(new Date(selectedDate), 11),   // 11:00
                    status: 'CONFIRMED',
                },
                {
                    id: '2',
                    clientName: 'Maria Oliveira',
                    clientPhone: '(11) 97654-3210',
                    serviceName: 'Manicure',
                    startTime: addHours(new Date(selectedDate), 14), // 14:00
                    endTime: addHours(new Date(selectedDate), 15.5), // 15:30
                    status: 'SCHEDULED',
                }
            ];
            const slots: TimeSlot[] = [];
            for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
                for (let minute = 0; minute < 60; minute += TIME_INTERVAL) {
                    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                    const appointmentsAtThisTime = mockAppointments.filter(appointment => {
                        const appointmentTime = format(appointment.startTime, 'HH:mm');
                        return appointmentTime === timeString;
                    });
                    slots.push({
                        time: timeString,
                        appointments: appointmentsAtThisTime,
                        isAvailable: appointmentsAtThisTime.length === 0
                    });
                }
            }
            setTimeSlots(slots);
            setTimeout(() => {
                setIsLoading(false);
            }, 700);
        } catch {
            setError('Erro ao carregar os agendamentos para este dia');
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handlePreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };
    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };
    const handleToday = () => {
        setSelectedDate(new Date());
    };
    const handleSelectSlot = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const date = new Date(selectedDate);
        date.setHours(hours, minutes);
        setSelectedSlot(date);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSlot(null);
    };
    const handleCreateAppointment = async (appointmentData: Appointment) => {
        try {
            const response = await fetch('/api/appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao criar agendamento');
            }

            setFeedback({ type: 'success', message: 'Agendamento criado com sucesso!' });
            fetchAppointments();
            setTimeout(() => setFeedback(null), 5000);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setFeedback({ type: 'error', message: error.message || 'Erro ao criar agendamento' });
            } else {
                setFeedback({ type: 'error', message: 'Erro ao criar agendamento' });
            }
            throw error;
        }
    };
    const getStatusClass = (status: string | undefined) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-success text-white';
            case 'CANCELLED': return 'bg-danger text-white';
            case 'COMPLETED': return 'bg-primary text-white';
            case 'NO_SHOW': return 'bg-warning text-dark';
            default: return 'bg-info text-white';
        }
    };
    return (
        <div className="container-fluid py-4">
            {feedback && (
                <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center mb-3`}>
                    {feedback.message}
                </div>
            )}
            <div className="card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h3 mb-1 fw-bold gradient-number">Agenda Diária</h1>
                        <p className="text-muted mb-0">
                            {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handlePreviousDay}>
                            <ChevronLeft size={16} />
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleToday}>
                            Hoje
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={handleNextDay}>
                            <ChevronRight size={16} />
                        </button>
                        <Link href="/calendar" className="btn btn-outline-secondary d-flex align-items-center gap-2 ms-2">
                            <CalendarIcon size={16} />
                            <span className="d-none d-md-inline">Calendário Completo</span>
                        </Link>
                    </div>
                </div>
                <div className="day-view-container">
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span aria-live="polite">Carregando...</span>
                            </div>
                            <p>Carregando agenda...</p>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">{error}</div>
                    ) : (
                        <div className="day-schedule">
                            {timeSlots.map((slot) => (
                                <div key={slot.time} className={`time-slot p-2 mb-2 d-flex ${isToday(selectedDate) && format(new Date(), 'HH:mm') === slot.time ? 'current-time' : ''}`}>
                                    <div className="time-label d-flex align-items-center me-3" style={{ width: '80px' }}>
                                        <Clock size={14} className="me-1" />
                                        <span>{slot.time}</span>
                                    </div>
                                    <div className="flex-grow-1">
                                        {slot.appointments.length > 0 ? (
                                            slot.appointments.map(appointment => (
                                                <div key={appointment.id} className={`appointment-item p-3 rounded mb-1 ${getStatusClass(appointment.status)}`}>
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <h6 className="mb-0">{appointment.serviceName}</h6>
                                                        <span className="badge bg-white bg-opacity-25">
                                                            {format(appointment.startTime, 'HH:mm')} - {format(appointment.endTime, 'HH:mm')}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex flex-wrap gap-3">
                                                        <div className="d-flex align-items-center">
                                                            <User size={14} className="me-1" />
                                                            <span>{appointment.clientName}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <Phone size={14} className="me-1" />
                                                            <span>{appointment.clientPhone}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <button type="button" className="btn btn-outline-success btn-sm w-100 text-start" onClick={() => handleSelectSlot(slot.time)}>
                                                <span>+ Adicionar agendamento</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {timeSlots.length === 0 && (
                                <div className="text-center py-4">
                                    <p className="text-muted">Não há horários disponíveis para este dia</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {showModal && selectedSlot && (
                <AppointmentModal
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    startDate={selectedSlot}
                    onSave={handleCreateAppointment}
                />
            )}
            <style jsx>{`
        .day-schedule {
          max-height: calc(100vh - 250px);
          overflow-y: auto;
          padding-right: 10px;
        }
        .current-time {
          border-left: 3px solid #0d6efd;
        }
        .time-slot:hover {
          background-color: rgba(0,0,0,0.03);
        }
        .appointment-item {
          transition: all 0.2s ease;
        }
        .appointment-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
      `}</style>
        </div>
    );
}
