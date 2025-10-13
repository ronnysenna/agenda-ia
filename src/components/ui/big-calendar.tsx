"use client";

import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarCheck, ChevronLeft, ChevronRight } from 'lucide-react';

// Localização para português
const locales = {
    'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Mensagens customizadas em português
const messages = {
    today: 'Hoje',
    previous: 'Anterior',
    next: 'Próximo',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há agendamentos neste período.',
    allDay: 'Dia todo',
    showMore: (total: number) => `+${total} mais`,
};

export interface AppointmentEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource?: {
        clientName: string;
        clientPhone: string;
        serviceName?: string;
        status?: 'confirmed' | 'pending' | 'cancelled' | 'completed';
        notes?: string;
    };
}

interface BigCalendarProps {
    events: AppointmentEvent[];
    defaultView?: View;
    onSelectEvent?: (event: AppointmentEvent) => void;
    onSelectSlot?: (slotInfo: any) => void;
    onNavigate?: (date: Date, view: View) => void;
    onView?: (view: View) => void;
}

export function BigCalendar({
    events,
    defaultView = 'month',
    onSelectEvent,
    onSelectSlot,
    onNavigate,
    onView
}: BigCalendarProps) {
    // Customização do componente toolbar
    const CustomToolbar = (toolbar: any) => {
        const goToToday = () => {
            toolbar.onNavigate('TODAY');
        };

        const goToBack = () => {
            toolbar.onNavigate('PREV');
        };

        const goToNext = () => {
            toolbar.onNavigate('NEXT');
        };

        const goToView = (view: string) => {
            toolbar.onView(view);
        };

        // Formatação do título do calendário (mês/ano ou data específica)
        const label = () => {
            const date = toolbar.date;
            return (
                <span className="text-lg font-medium">
                    {format(date, toolbar.view === 'month' ? 'MMMM yyyy' : 'dd/MM/yyyy', { locale: ptBR })}
                </span>
            );
        };

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={goToBack}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    {label()}
                    <button
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={goToNext}
                    >
                        <ChevronRight size={20} />
                    </button>
                    <button
                        className="ml-2 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                        onClick={goToToday}
                    >
                        Hoje
                    </button>
                </div>

                <div className="flex items-center gap-2 border rounded-lg overflow-hidden dark:border-gray-700">
                    <button
                        className={`px-3 py-1.5 ${toolbar.view === 'month' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        onClick={() => goToView('month')}
                    >
                        Mês
                    </button>
                    <button
                        className={`px-3 py-1.5 ${toolbar.view === 'week' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        onClick={() => goToView('week')}
                    >
                        Semana
                    </button>
                    <button
                        className={`px-3 py-1.5 ${toolbar.view === 'day' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        onClick={() => goToView('day')}
                    >
                        Dia
                    </button>
                    <button
                        className={`px-3 py-1.5 ${toolbar.view === 'agenda' ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        onClick={() => goToView('agenda')}
                    >
                        Lista
                    </button>
                </div>
            </div>
        );
    };

    // Componente de evento personalizado
    const EventComponent = ({ event }: { event: AppointmentEvent }) => {
        // Determinar classe de cor com base no status
        const getStatusClass = () => {
            switch (event.resource?.status) {
                case 'confirmed':
                    return 'bg-emerald-500';
                case 'pending':
                    return 'bg-amber-500';
                case 'cancelled':
                    return 'bg-red-500';
                case 'completed':
                    return 'bg-blue-500';
                default:
                    return 'bg-primary';
            }
        };

        return (
            <div className={`p-1 rounded text-white ${getStatusClass()} overflow-hidden text-sm`}>
                <div className="font-medium">{event.title}</div>
                {event.resource?.clientName && (
                    <div className="text-white/90 text-xs truncate">
                        {event.resource.clientName}
                    </div>
                )}
            </div>
        );
    };

    const calendarStyle = useMemo(() => ({
        height: 700,
    }), []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <Calendar
                localizer={localizer}
                events={events}
                defaultView={defaultView}
                views={['month', 'week', 'day', 'agenda']}
                messages={messages}
                startAccessor="start"
                endAccessor="end"
                style={calendarStyle}
                components={{
                    toolbar: CustomToolbar,
                    event: EventComponent,
                }}
                selectable
                onSelectEvent={onSelectEvent}
                onSelectSlot={onSelectSlot}
                onNavigate={onNavigate}
                onView={onView}
                className="modern-calendar"
            />
        </div>
    );
}
