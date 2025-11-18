"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isFuture, isPast, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, TrendingUp, Flame, Award, Zap, CheckCircle2 } from "lucide-react";

interface ReviewDay {
  date: Date;
  count: number;
  dueCount: number;
}

interface ElegantCalendarProps {
  reviewData: ReviewDay[];
  onDateSelect?: (date: Date) => void;
}

export function ElegantCalendar({ reviewData, onDateSelect }: ElegantCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Preencher dias para começar no domingo
  const firstDayOfWeek = monthStart.getDay();
  const prefixDays = Array(firstDayOfWeek).fill(null);

  const getDataForDay = (date: Date): ReviewDay | null => {
    return reviewData.find(d => isSameDay(d.date, date)) || null;
  };

  const getDayIntensity = (data: ReviewDay | null): string => {
    if (!data || data.count === 0) return "intensity-0";
    if (data.count < 5) return "intensity-1";
    if (data.count < 10) return "intensity-2";
    if (data.count < 20) return "intensity-3";
    return "intensity-4";
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const previousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const nextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  const selectedDayData = selectedDate ? getDataForDay(selectedDate) : null;

  // Calcular estatísticas do mês
  const monthStats = {
    totalReviews: reviewData.reduce((sum, d) => sum + d.count, 0),
    daysActive: reviewData.filter(d => d.count > 0).length,
    currentStreak: reviewData.filter(d => d.count > 0).length,
    bestDay: reviewData.reduce((max, d) => d.count > max.count ? d : max, { count: 0, date: new Date(), dueCount: 0 })
  };

  return (
    <div className="space-y-6">
      {/* Header Elegante */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Calendário de Estudos</h2>
                <p className="text-white/80 text-sm">Acompanhe sua jornada de aprendizado</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={previousMonth}
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="px-6 py-2 bg-white/10 backdrop-blur-sm rounded-xl min-w-[180px] text-center">
                <span className="font-bold text-lg">
                  {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </span>
              </div>
              <Button
                onClick={nextMonth}
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats Rápidas */}
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm opacity-80">Total</span>
              </div>
              <span className="text-2xl font-bold">{monthStats.totalReviews}</span>
              <p className="text-xs opacity-60">revisões</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm opacity-80">Dias Ativos</span>
              </div>
              <span className="text-2xl font-bold">{monthStats.daysActive}</span>
              <p className="text-xs opacity-60">dias estudados</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="h-4 w-4" />
                <span className="text-sm opacity-80">Sequência</span>
              </div>
              <span className="text-2xl font-bold">{monthStats.currentStreak}</span>
              <p className="text-xs opacity-60">dias seguidos</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4" />
                <span className="text-sm opacity-80">Melhor Dia</span>
              </div>
              <span className="text-2xl font-bold">{monthStats.bestDay.count}</span>
              <p className="text-xs opacity-60">revisões</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendário */}
      <Card className="border-0 shadow-xl">
        <CardContent className="p-6">
          {/* Cabeçalhos dos dias */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 gap-2">
            {prefixDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {daysInMonth.map((date) => {
              const data = getDataForDay(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isTodayDay = isToday(date);
              const intensity = getDayIntensity(data);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDayClick(date)}
                  className={cn(
                    "aspect-square p-2 rounded-xl transition-all relative group",
                    "hover:scale-110 hover:shadow-lg",
                    isSelected && "ring-2 ring-teal-600 ring-offset-2 scale-110 shadow-xl",
                    isTodayDay && "border-2 border-teal-600 font-bold",
                    !data && "hover:bg-muted/50",
                    // Intensidades de cor
                    intensity === "intensity-0" && "bg-gray-100 dark:bg-gray-800",
                    intensity === "intensity-1" && "bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-100",
                    intensity === "intensity-2" && "bg-teal-300 dark:bg-teal-800 text-teal-900 dark:text-teal-50",
                    intensity === "intensity-3" && "bg-teal-500 dark:bg-teal-600 text-white",
                    intensity === "intensity-4" && "bg-teal-700 dark:bg-teal-500 text-white font-bold"
                  )}
                >
                  <span className="text-sm">{format(date, "d")}</span>
                  
                  {data && data.count > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {data.count}
                      </div>
                    </div>
                  )}

                  {data && data.dueCount > 0 && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800 border"></div>
                <div className="w-4 h-4 rounded bg-teal-100 dark:bg-teal-950"></div>
                <div className="w-4 h-4 rounded bg-teal-300 dark:bg-teal-800"></div>
                <div className="w-4 h-4 rounded bg-teal-500 dark:bg-teal-600"></div>
                <div className="w-4 h-4 rounded bg-teal-700 dark:bg-teal-500"></div>
              </div>
              <span>Mais</span>
            </div>

            {selectedDate && (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium">
                  {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                </span>
                {selectedDayData && (
                  <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-teal-200">
                    {selectedDayData.count} revisões
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detalhes do Dia Selecionado */}
      {selectedDate && selectedDayData && (
        <Card className="border-l-4 border-l-teal-600 shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-600" />
              {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 dark:bg-teal-950/20 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Revisões Completas</p>
                <p className="text-3xl font-bold text-teal-600">{selectedDayData.count}</p>
              </div>
              {selectedDayData.dueCount > 0 && (
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Revisões Pendentes</p>
                  <p className="text-3xl font-bold text-orange-600">{selectedDayData.dueCount}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

