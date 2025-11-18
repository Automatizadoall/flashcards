"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isFuture, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, TrendingUp, Clock } from "lucide-react";

interface ReviewDay {
  date: Date;
  count: number;
  dueCount: number;
}

interface CalendarViewProps {
  reviewData: ReviewDay[];
  onDateSelect?: (date: Date) => void;
}

export function CalendarView({ reviewData, onDateSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Preencher dias para começar no domingo
  const firstDayOfWeek = monthStart.getDay();
  const prefixDays = Array(firstDayOfWeek).fill(null);

  // Encontrar dados para um dia específico
  const getDataForDay = (date: Date): ReviewDay | null => {
    return reviewData.find(d => isSameDay(d.date, date)) || null;
  };

  // Cor do dia baseado na atividade
  const getDayColor = (data: ReviewDay | null, date: Date): string => {
    if (!data) {
      if (isFuture(date)) return "text-muted-foreground";
      return "text-muted-foreground/50";
    }
    
    if (data.dueCount > 0) return "bg-orange-500/20 text-orange-700 dark:text-orange-400 font-bold";
    if (data.count > 0) return "bg-green-500/20 text-green-700 dark:text-green-400";
    return "";
  };

  // Navegar entre meses
  const previousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const selectedDayData = selectedDate ? getDataForDay(selectedDate) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendário de Revisões
            </CardTitle>
            <CardDescription>
              Acompanhe seu progresso diário e revisões pendentes
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="px-3 py-1 rounded hover:bg-muted transition-colors"
            >
              ←
            </button>
            <span className="font-semibold min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </span>
            <button
              onClick={nextMonth}
              className="px-3 py-1 rounded hover:bg-muted transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legenda */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/40"></div>
            <span className="text-muted-foreground">Revisões feitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/40"></div>
            <span className="text-muted-foreground">Revisões pendentes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-primary"></div>
            <span className="text-muted-foreground">Hoje</span>
          </div>
        </div>

        {/* Grid do calendário */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Cabeçalhos dos dias da semana */}
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}

          {/* Dias vazios antes do primeiro dia */}
          {prefixDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Dias do mês */}
          {daysInMonth.map((date) => {
            const data = getDataForDay(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isTodayDay = isToday(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDayClick(date)}
                className={cn(
                  "aspect-square p-2 rounded-lg transition-all relative",
                  "hover:bg-muted hover:shadow-sm",
                  getDayColor(data, date),
                  isSelected && "ring-2 ring-primary ring-offset-2",
                  isTodayDay && "border-2 border-primary"
                )}
              >
                <span className="text-sm">{format(date, "d")}</span>
                {data && data.count > 0 && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="text-[10px] font-bold">
                      {data.count}
                    </div>
                  </div>
                )}
                {data && data.dueCount > 0 && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Detalhes do dia selecionado */}
        {selectedDate && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">
              {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
            {selectedDayData ? (
              <div className="space-y-2 text-sm">
                {selectedDayData.count > 0 && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span>
                      <strong>{selectedDayData.count}</strong> revisões completadas
                    </span>
                  </div>
                )}
                {selectedDayData.dueCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>
                      <strong>{selectedDayData.dueCount}</strong> revisões pendentes
                    </span>
                  </div>
                )}
                {selectedDayData.count === 0 && selectedDayData.dueCount === 0 && (
                  <span className="text-muted-foreground">Nenhuma atividade neste dia</span>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                {isFuture(selectedDate) 
                  ? "Nenhuma revisão agendada" 
                  : "Nenhuma atividade neste dia"}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

