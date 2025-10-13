"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

type CalendarEvent = {
    id: string;
    title: string;
    date: Date;
    color?: string;
};

interface ModernCalendarProps {
    events?: CalendarEvent[];
    onDateSelect?: (date: Date) => void;
}

export function ModernCalendar({ events = [], onDateSelect }: ModernCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handlePreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleDateClick = (day: Date) => {
        setSelectedDate(day);
        if (onDateSelect) {
            onDateSelect(day);
        }
    };

    // Gerar array com todos os dias do mês atual
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Encontrar eventos para um dia específico
    const getEventsForDay = (day: Date) => {
        return events.filter(event => isSameDay(day, new Date(event.date)));
    };

    // Nomes dos dias da semana
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    return (
        <Card className="w-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                        {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                    </CardTitle>
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={handlePreviousMonth}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Mês anterior"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Próximo mês"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Dias da semana */}
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="text-center text-xs font-medium text-gray-500 py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Dias do mês */}
                <div className="grid grid-cols-7 gap-1">
                    {/* Adicionar espaços vazios até o primeiro dia do mês */}
                    {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                        <div key={`empty-start-${index}`} className="h-14 p-1" />
                    ))}

                    {/* Renderizar dias do mês */}
                    {daysInMonth.map((day) => {
                        const dayEvents = getEventsForDay(day);
                        const isSelected = selectedDate && isSameDay(day, selectedDate);

                        return (
                            <div
                                key={day.toISOString()}
                                className="h-14 p-1 relative"
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDateClick(day)}
                                    className={`w-full h-full flex flex-col text-left p-1 rounded-md transition-colors ${isToday(day)
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : isSelected
                                                ? 'bg-primary/20 text-primary font-medium'
                                                : !isSameMonth(day, currentMonth)
                                                    ? 'text-gray-400 dark:text-gray-600'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <span className="text-xs">{format(day, "d")}</span>

                                    {/* Indicadores de evento */}
                                    {dayEvents.length > 0 && (
                                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={`h-1.5 w-1.5 rounded-full ${event.color || "bg-primary"
                                                        }`}
                                                    title={event.title}
                                                />
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <span className="text-[0.65rem] text-gray-500">+{dayEvents.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    })}

                    {/* Adicionar espaços vazios após o último dia do mês */}
                    {Array.from({ length: (6 - monthEnd.getDay()) % 7 }).map((_, index) => (
                        <div key={`empty-end-${index}`} className="h-14 p-1" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
