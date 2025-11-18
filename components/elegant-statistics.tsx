"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { TrendingUp, Target, Brain, Zap, Award, Flame, CheckCircle2, Clock, Activity } from "lucide-react";
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

interface ElegantStatisticsProps {
  userStats: UserStatistics;
  dailyStats: DailyStats[];
  deckStats: DeckStatistics[];
}

export function ElegantStatistics({ userStats, dailyStats, deckStats }: ElegantStatisticsProps) {
  // Taxa de acerto geral
  const accuracy = userStats.totalReviews > 0
    ? Math.round(((userStats.totalReviews - userStats.totalLapses) / userStats.totalReviews) * 100)
    : 0;

  // Streak
  const currentStreak = dailyStats.filter(d => d.totalReviews > 0).length;

  // Dados para gráficos
  const chartData = dailyStats.slice(0, 14).reverse().map(stat => ({
    data: format(new Date(stat.date), "dd/MM", { locale: ptBR }),
    Acertos: stat.correctReviews,
    Erros: stat.incorrectReviews,
    Total: stat.totalReviews,
  }));

  const distributionData = [
    { name: "Novos", value: userStats.newCards, color: "#14b8a6" },
    { name: "Aprendendo", value: userStats.learningCards, color: "#f59e0b" },
    { name: "Revisão", value: userStats.reviewCards, color: "#0d9488" },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      {/* Header Elegante */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Estatísticas de Aprendizado</h2>
              <p className="text-white/80 text-sm">Análise completa do seu progresso</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas Principais - Grade 4 Colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Cards */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 dark:bg-teal-950/20 rounded-full blur-3xl"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                <Brain className="h-6 w-6 text-teal-600" />
              </div>
              <Badge variant="secondary" className="bg-teal-100 text-teal-700 border-0">
                {userStats.dueToday} devidos
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total de Cards</p>
            <p className="text-4xl font-bold text-teal-600">{userStats.totalCards}</p>
          </CardContent>
        </Card>

        {/* Taxa de Acerto */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-950/20 rounded-full blur-3xl"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                {userStats.totalReviews} revisões
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Taxa de Acerto</p>
            <p className="text-4xl font-bold text-green-600">{accuracy}%</p>
          </CardContent>
        </Card>

        {/* Sequência */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 dark:bg-orange-950/20 rounded-full blur-3xl"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-0">
                Ativo
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Sequência</p>
            <p className="text-4xl font-bold text-orange-600">{currentStreak} dias</p>
          </CardContent>
        </Card>

        {/* Estabilidade */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-950/20 rounded-full blur-3xl"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-0">
                FSRS
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Estabilidade Média</p>
            <p className="text-4xl font-bold text-purple-600">{userStats.avgStability.toFixed(1)}d</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos - Grade 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desempenho Diário */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              <CardTitle>Desempenho dos Últimos 14 Dias</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Acertos vs Erros por dia</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAcertos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorErros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="data" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="Acertos" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#colorAcertos)" />
                <Area type="monotone" dataKey="Erros" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorErros)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Cards */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-teal-600" />
              <CardTitle>Distribuição de Cards</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Por estado de aprendizado</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => entry.name}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-teal-50 dark:bg-teal-950/20 rounded-xl">
                <div className="text-2xl font-bold text-teal-600">{userStats.newCards}</div>
                <div className="text-xs text-muted-foreground">Novos</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">{userStats.learningCards}</div>
                <div className="text-xs text-muted-foreground">Aprendendo</div>
              </div>
              <div className="text-center p-3 bg-teal-50 dark:bg-teal-950/20 rounded-xl">
                <div className="text-2xl font-bold text-teal-700">{userStats.reviewCards}</div>
                <div className="text-xs text-muted-foreground">Revisão</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desempenho por Deck */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-teal-600" />
            <CardTitle>Desempenho por Deck</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">Progresso em cada coleção</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deckStats.map((deck, index) => (
              <div key={index} className="group p-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/10 dark:to-cyan-950/10 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                      {deck.deckIcon}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{deck.deckName}</div>
                      <div className="text-sm text-muted-foreground">
                        {deck.totalCards} cards · {deck.dueCards} devidos
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={deck.accuracy >= 80 ? "default" : "secondary"}
                    className={
                      deck.accuracy >= 80 
                        ? "bg-teal-600 text-white px-4 py-2 text-base"
                        : deck.accuracy >= 60
                        ? "bg-orange-100 text-orange-700 border-orange-200 px-4 py-2 text-base"
                        : "bg-red-100 text-red-700 border-red-200 px-4 py-2 text-base"
                    }
                  >
                    {deck.accuracy}% acerto
                  </Badge>
                </div>
                <Progress value={deck.accuracy} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="border-l-4 border-l-teal-600 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-teal-600" />
            <CardTitle>Insights e Recomendações</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userStats.dueToday > 0 && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border-l-4 border-l-orange-500">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-orange-900 dark:text-orange-400">
                    Você tem {userStats.dueToday} cards para revisar hoje
                  </div>
                  <div className="text-orange-700 dark:text-orange-500 text-sm mt-1">
                    Revise agora para manter seu progresso!
                  </div>
                </div>
              </div>
            )}
            
            {accuracy >= 90 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border-l-4 border-l-green-500">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-green-900 dark:text-green-400">
                    Excelente desempenho! 🎉
                  </div>
                  <div className="text-green-700 dark:text-green-500 text-sm mt-1">
                    Sua taxa de acerto está acima de 90%. Continue assim!
                  </div>
                </div>
              </div>
            )}

            {userStats.newCards > 20 && (
              <div className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-teal-950/20 rounded-xl border-l-4 border-l-teal-500">
                <Brain className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-teal-900 dark:text-teal-400">
                    Muitos cards novos
                  </div>
                  <div className="text-teal-700 dark:text-teal-500 text-sm mt-1">
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

