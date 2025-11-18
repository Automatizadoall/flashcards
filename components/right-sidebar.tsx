"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RightSidebarProps {
  stats?: {
    dueToday: number;
    totalCards: number;
    accuracy: number;
    streak: number;
    reviewsToday: number;
    avgStability: number;
  };
  dueCards?: Array<{
    id: string;
    frente: string;
    deckNome: string;
    deckIcone: string;
  }>;
  onStartStudy?: () => void;
}

export function RightSidebar({ stats, dueCards = [], onStartStudy }: RightSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const accuracyColor = stats?.accuracy
    ? stats.accuracy >= 80
      ? "text-green-600"
      : stats.accuracy >= 60
      ? "text-orange-600"
      : "text-red-600"
    : "text-muted-foreground";

  return (
    <>
      {/* Overlay para mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-screen bg-background border-l z-40 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-80",
          "lg:sticky lg:top-0"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(isCollapsed && "mx-auto")}
          >
            {isCollapsed ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          {!isCollapsed && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {format(currentTime, "EEEE", { locale: ptBR })}
              </p>
              <p className="text-sm font-semibold">
                {format(currentTime, "dd MMM", { locale: ptBR })}
              </p>
            </div>
          )}
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Cards Devidos Hoje */}
          {!isCollapsed && stats && (
            <Card className="border-orange-200 dark:border-orange-900">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    Devidos Hoje
                  </CardTitle>
                  <Badge variant="destructive">{stats.dueToday}</Badge>
                </div>
              </CardHeader>
              {stats.dueToday > 0 && (
                <CardContent>
                  <Button 
                    onClick={onStartStudy} 
                    className="w-full gap-2"
                    size="sm"
                  >
                    <Zap className="h-4 w-4" />
                    Estudar Agora
                  </Button>
                </CardContent>
              )}
            </Card>
          )}

          {/* Métricas Rápidas */}
          {!isCollapsed && stats && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Desempenho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Taxa de Acerto */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Taxa de Acerto</span>
                    <span className={cn("text-sm font-bold", accuracyColor)}>
                      {stats.accuracy}%
                    </span>
                  </div>
                  <Progress value={stats.accuracy} className="h-2" />
                </div>

                {/* Revisões Hoje */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <span className="text-xs">Revisões Hoje</span>
                  </div>
                  <Badge variant="secondary">{stats.reviewsToday}</Badge>
                </div>

                {/* Total de Cards */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    <span className="text-xs">Total de Cards</span>
                  </div>
                  <Badge variant="secondary">{stats.totalCards}</Badge>
                </div>

                {/* Estabilidade */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Estabilidade</span>
                  </div>
                  <Badge variant="secondary">
                    {stats.avgStability.toFixed(1)} dias
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Cards Devidos */}
          {!isCollapsed && dueCards.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Próximos Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dueCards.slice(0, 5).map((card) => (
                    <div
                      key={card.id}
                      className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{card.deckIcone}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {card.frente}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {card.deckNome}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {dueCards.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center pt-1">
                      +{dueCards.length - 5} mais cards
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ícones Colapsados */}
          {isCollapsed && stats && (
            <div className="space-y-4">
              <Button
                variant="outline"
                size="icon"
                className="w-full"
                title={`${stats.dueToday} devidos hoje`}
              >
                <div className="relative">
                  <Clock className="h-4 w-4" />
                  {stats.dueToday > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {stats.dueToday > 9 ? '9+' : stats.dueToday}
                    </span>
                  )}
                </div>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="w-full"
                title={`${stats.accuracy}% de acerto`}
              >
                <Target className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="w-full"
                title={`${stats.reviewsToday} revisões hoje`}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Motivação */}
          {!isCollapsed && stats && stats.streak > 0 && (
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200 dark:border-orange-900">
              <CardContent className="pt-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <p className="text-sm font-semibold">
                    {stats.streak} {stats.streak === 1 ? 'dia' : 'dias'} de sequência!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Continue assim!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </aside>
    </>
  );
}

