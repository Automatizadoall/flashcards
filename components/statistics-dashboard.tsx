"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, Target, Brain, Zap, Calendar, Clock, Award, Flame } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserStatistics {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  dueToday: number;
  futureReviews: number;
  avgDifficulty: number;
  avgStability: number;
  totalReviews: number;
  totalLapses: number;
}

interface DailyStats {
  date: string;
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  avgResponseTime: number;
}

interface DeckStatistics {
  deckName: string;
  deckIcon: string;
  totalCards: number;
  dueCards: number;
  accuracy: number;
}

interface StatisticsDashboardProps {
  userStats: UserStatistics;
  dailyStats: DailyStats[];
  deckStats: DeckStatistics[];
}

export function StatisticsDashboard({ userStats, dailyStats, deckStats }: StatisticsDashboardProps) {
  // Dados para gráfico de pizza (distribuição de cards)
  const distributionData = [
    { name: "Novos", value: userStats.newCards, color: "#3b82f6" },
    { name: "Aprendendo", value: userStats.learningCards, color: "#f59e0b" },
    { name: "Revisão", value: userStats.reviewCards, color: "#10b981" },
  ].filter(item => item.value > 0);

  // Taxa de acerto geral
  const accuracy = userStats.totalReviews > 0
    ? Math.round(((userStats.totalReviews - userStats.totalLapses) / userStats.totalReviews) * 100)
    : 0;

  // Streak (dias consecutivos - simplificado)
  const currentStreak = dailyStats.filter(d => d.totalReviews > 0).length;

  // Dados formatados para gráfico diário
  const chartData = dailyStats.slice(0, 14).reverse().map(stat => ({
    data: format(new Date(stat.date), "dd/MM", { locale: ptBR }),
    Acertos: stat.correctReviews,
    Erros: stat.incorrectReviews,
    Total: stat.totalReviews,
  }));

  return (
    <div className="space-y-6">
      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cards</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalCards}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.dueToday} devidos hoje
            </p>
          </CardContent>
        </Card>

        {/* Taxa de Acerto */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Acerto</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              {userStats.totalReviews} revisões totais
            </p>
          </CardContent>
        </Card>

        {/* Sequência */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sequência</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak} dias</div>
            <p className="text-xs text-muted-foreground">
              Estudos consecutivos
            </p>
          </CardContent>
        </Card>

        {/* Estabilidade Média */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estabilidade Média</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.avgStability.toFixed(1)} dias</div>
            <p className="text-xs text-muted-foreground">
              Intervalo médio de revisão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desempenho Diário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Desempenho dos Últimos 14 Dias
            </CardTitle>
            <CardDescription>Acertos vs Erros por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Acertos" fill="#10b981" />
                <Bar dataKey="Erros" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Distribuição de Cards
            </CardTitle>
            <CardDescription>Por estado de aprendizado</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userStats.newCards}</div>
                <div className="text-xs text-muted-foreground">Novos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{userStats.learningCards}</div>
                <div className="text-xs text-muted-foreground">Aprendendo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userStats.reviewCards}</div>
                <div className="text-xs text-muted-foreground">Revisão</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas por Deck */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Desempenho por Deck
          </CardTitle>
          <CardDescription>Progresso em cada coleção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deckStats.map((deck, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{deck.deckIcon}</span>
                  <div>
                    <div className="font-semibold">{deck.deckName}</div>
                    <div className="text-sm text-muted-foreground">
                      {deck.totalCards} cards · {deck.dueCards} devidos
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={deck.accuracy >= 80 ? "default" : deck.accuracy >= 60 ? "secondary" : "destructive"}>
                    {deck.accuracy}% acerto
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Insights e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {userStats.dueToday > 0 && (
              <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-900 dark:text-orange-400">
                    Você tem {userStats.dueToday} cards para revisar hoje
                  </div>
                  <div className="text-orange-700 dark:text-orange-500 text-xs mt-1">
                    Revise agora para manter seu progresso!
                  </div>
                </div>
              </div>
            )}
            
            {accuracy >= 90 && (
              <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <Award className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-400">
                    Excelente desempenho! 🎉
                  </div>
                  <div className="text-green-700 dark:text-green-500 text-xs mt-1">
                    Sua taxa de acerto está acima de 90%. Continue assim!
                  </div>
                </div>
              </div>
            )}

            {userStats.newCards > 20 && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900 dark:text-blue-400">
                    Muitos cards novos
                  </div>
                  <div className="text-blue-700 dark:text-blue-500 text-xs mt-1">
                    Você tem {userStats.newCards} cards novos. Comece devagar para melhor retenção!
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

