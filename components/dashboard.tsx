"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Brain, Calendar, TrendingUp, Target, Flame, Clock, 
  BookOpen, Award, Zap, ArrowRight, CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardProps {
  stats: {
    totalCards: number;
    dueToday: number;
    reviewsToday: number;
    streak: number;
    accuracy: number;
    weeklyGoal: number;
    weeklyProgress: number;
  };
  upcomingReviews: Array<{
    date: Date;
    count: number;
    decks: Array<{ nome: string; icone: string; count: number }>;
  }>;
  recentDecks: Array<{
    id: string;
    nome: string;
    icone: string;
    cor: string;
    totalCards: number;
    dueCards: number;
  }>;
  onStartStudy: () => void;
  onNavigateToCalendar: () => void;
  onNavigateToFlashcards: () => void;
}

export function Dashboard({
  stats,
  upcomingReviews,
  recentDecks,
  onStartStudy,
  onNavigateToCalendar,
  onNavigateToFlashcards,
}: DashboardProps) {
  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bem-vindo de volta! 👋
              </h1>
              <p className="text-white/80 text-lg">
                {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
            
            {stats.dueToday > 0 && (
              <Button
                onClick={onStartStudy}
                size="lg"
                className="bg-white text-teal-600 hover:bg-white/90 gap-2 shadow-lg"
              >
                <Brain className="h-5 w-5" />
                Estudar Agora
              </Button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Para Hoje</span>
              </div>
              <p className="text-3xl font-bold">{stats.dueToday}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Revisadas</span>
              </div>
              <p className="text-3xl font-bold">{stats.reviewsToday}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Sequência</span>
              </div>
              <p className="text-3xl font-bold">{stats.streak} dias</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Acertos</span>
              </div>
              <p className="text-3xl font-bold">{stats.accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Meta Semanal */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-teal-600" />
                  <CardTitle>Meta Semanal</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-0">
                  {stats.weeklyProgress}/{stats.weeklyGoal} revisões
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress 
                  value={(stats.weeklyProgress / stats.weeklyGoal) * 100} 
                  className="h-3"
                />
                <p className="text-sm text-muted-foreground">
                  Faltam {stats.weeklyGoal - stats.weeklyProgress} revisões para completar sua meta
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Próximas Revisões */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <CardTitle>Próximas Revisões</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateToCalendar}
                  className="gap-1"
                >
                  Ver calendário
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingReviews.slice(0, 5).map((review, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/10 dark:to-cyan-950/10 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center min-w-[60px]">
                        <div className="text-2xl font-bold text-teal-600">
                          {format(review.date, "d")}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          {format(review.date, "MMM", { locale: ptBR })}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium mb-1">
                          {review.count} {review.count === 1 ? 'revisão' : 'revisões'}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {review.decks.slice(0, 3).map((deck, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="bg-white dark:bg-gray-800 text-xs"
                            >
                              {deck.icone} {deck.nome}
                            </Badge>
                          ))}
                          {review.decks.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{review.decks.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-2xl font-bold text-teal-600">
                      {review.count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita - 1/3 */}
        <div className="space-y-6">
          {/* Estatísticas Rápidas */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 dark:bg-teal-950/20 rounded-full blur-3xl"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <CardTitle>Visão Geral</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-teal-600" />
                  <span className="text-sm">Total de Cards</span>
                </div>
                <span className="text-lg font-bold text-teal-600">{stats.totalCards}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Devidos Hoje</span>
                </div>
                <span className="text-lg font-bold text-orange-600">{stats.dueToday}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Taxa de Acerto</span>
                </div>
                <span className="text-lg font-bold text-green-600">{stats.accuracy}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Decks Recentes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                  <CardTitle>Meus Decks</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateToFlashcards}
                  className="gap-1"
                >
                  Ver todos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentDecks.slice(0, 4).map((deck) => (
                  <button
                    key={deck.id}
                    onClick={onNavigateToFlashcards}
                    className="w-full text-left p-3 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{deck.icone}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{deck.nome}</div>
                        <div className="text-xs text-muted-foreground">
                          {deck.totalCards} cards · {deck.dueCards} devidos
                        </div>
                      </div>
                      {deck.dueCards > 0 && (
                        <Badge className="bg-orange-500 text-white border-0">
                          {deck.dueCards}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Action */}
          {stats.dueToday === 0 && (
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-lg mb-2">Tudo em dia! 🎉</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Você não tem revisões pendentes hoje
                </p>
                <Button
                  onClick={onNavigateToFlashcards}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Criar novos cards
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

