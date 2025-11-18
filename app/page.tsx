"use client";

import { useState, useEffect } from "react";
import { FlashcardForm } from "@/components/flashcard-form";
import { FlashcardList } from "@/components/flashcard-list";
import { EditFlashcardDialog } from "@/components/edit-flashcard-dialog";
import { EditDeckDialog } from "@/components/edit-deck-dialog";
import { StudyModeFSRS } from "@/components/study-mode-fsrs";
import { DeckSelector } from "@/components/deck-selector";
import { CreateDeckDialog } from "@/components/create-deck-dialog";
import { ElegantCalendar } from "@/components/elegant-calendar";
import { ElegantStatistics } from "@/components/elegant-statistics";
import { MinimalSidebar } from "@/components/minimal-sidebar";
import { Dashboard } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flashcard } from "@/types/flashcard";
import { Deck } from "@/types/deck";
import { getFlashcards, deleteFlashcard, initializeData, getCardsDueToday } from "@/lib/supabase-storage";
import { getDecks } from "@/lib/deck-storage";
import {
  getUserStatistics,
  getDailyStatistics,
  getDeckStatistics,
  getCalendarData,
} from "@/lib/statistics-storage";
import { BookOpen, BarChart3, Calendar } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditDeckDialogOpen, setIsEditDeckDialogOpen] = useState(false);
  const [isCreateDeckDialogOpen, setIsCreateDeckDialogOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Estados para estatísticas
  const [userStats, setUserStats] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [deckStats, setDeckStats] = useState<any[]>([]);
  const [calendarData, setCalendarData] = useState<any[]>([]);
  const [dueCards, setDueCards] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      await initializeData();
      await loadDecks();
      await loadFlashcards();
      await loadStatistics();
    };
    init();
  }, []);

  useEffect(() => {
    loadFlashcards();
  }, [selectedDeckIds]);

  const loadDecks = async () => {
    const loadedDecks = await getDecks();
    setDecks(loadedDecks);
  };

  const loadFlashcards = async () => {
    const cards = await getFlashcards(selectedDeckIds.length > 0 ? selectedDeckIds : undefined);
    setFlashcards(cards);
  };

  const loadStatistics = async () => {
    const [user, daily, deck, calendar, due] = await Promise.all([
      getUserStatistics(),
      getDailyStatistics(14),
      getDeckStatistics(),
      getCalendarData(new Date()),
      getCardsDueToday(),
    ]);
    
    setUserStats(user);
    setDailyStats(daily);
    setDeckStats(deck);
    setCalendarData(calendar);
    setDueCards(due || []);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteFlashcard(id);
    if (success) {
      toast({
        title: "Sucesso!",
        description: "Flashcard excluído",
      });
      await loadFlashcards();
      await loadStatistics();
    }
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setIsEditDialogOpen(true);
  };

  const handleStartStudy = () => {
    if (flashcards.length === 0) {
      toast({
        title: "Atenção",
        description: "Você precisa ter pelo menos um flashcard para estudar",
        variant: "destructive",
      });
      return;
    }
    setIsStudyMode(true);
  };

  if (isStudyMode) {
    return (
      <StudyModeFSRS
        flashcards={flashcards}
        onExit={() => {
          setIsStudyMode(false);
          loadFlashcards();
          loadStatistics();
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Sidebar Minimalista */}
      <MinimalSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 min-w-0">
        <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        {activeTab !== 'dashboard' && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {activeTab === 'flashcards' && 'Meus Flashcards'}
              {activeTab === 'calendar' && 'Calendário de Revisões'}
              {activeTab === 'statistics' && 'Estatísticas'}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'flashcards' && 'Organize e estude seus flashcards com repetição espaçada'}
              {activeTab === 'calendar' && 'Acompanhe seu progresso e revisões agendadas'}
              {activeTab === 'statistics' && 'Analise seu desempenho e métricas de aprendizado'}
            </p>
          </div>
        )}

        {/* Conteúdo das Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="hidden"></div>

          {/* Tab: Dashboard */}
          <TabsContent value="dashboard">
            <Dashboard
              stats={{
                totalCards: flashcards.length,
                dueToday: dueCards.length,
                reviewsToday: dailyStats[0]?.totalReviews || 0,
                streak: dailyStats.filter(d => d.totalReviews > 0).length,
                accuracy: userStats ? Math.round(((userStats.totalReviews - userStats.totalLapses) / Math.max(userStats.totalReviews, 1)) * 100) : 0,
                weeklyGoal: 100,
                weeklyProgress: dailyStats.slice(0, 7).reduce((sum, d) => sum + d.totalReviews, 0),
              }}
              upcomingReviews={calendarData
                .filter(d => d.dueCount > 0)
                .slice(0, 5)
                .map(d => ({
                  date: d.date,
                  count: d.dueCount,
                  decks: d.dueDecks?.map((deck: any) => ({
                    nome: deck.deckNome,
                    icone: deck.deckIcone,
                    count: deck.count,
                  })) || [],
                }))}
              recentDecks={decks.map(deck => {
                const deckCards = flashcards.filter(f => {
                  // Aqui você pode adicionar lógica para filtrar por deck se necessário
                  return true;
                });
                return {
                  ...deck,
                  dueCards: deckCards.filter(f => {
                    const due = f.dueDate ? new Date(f.dueDate) : null;
                    return due && due <= new Date();
                  }).length,
                };
              })}
              onStartStudy={handleStartStudy}
              onNavigateToCalendar={() => setActiveTab("calendar")}
              onNavigateToFlashcards={() => setActiveTab("flashcards")}
            />
          </TabsContent>

          {/* Tab: Flashcards */}
          <TabsContent value="flashcards" className="space-y-6">
            <div className="mb-6 sm:mb-8">
              <DeckSelector
                decks={decks}
                selectedDeckIds={selectedDeckIds}
                onSelectDecks={setSelectedDeckIds}
                onCreateDeck={() => setIsCreateDeckDialogOpen(true)}
                onEditDeck={(deck) => {
                  setEditingDeck(deck);
                  setIsEditDeckDialogOpen(true);
                }}
              />
            </div>

            <div className="flex justify-center mb-6 sm:mb-8">
              <Button 
                size="lg" 
                onClick={handleStartStudy} 
                className="gap-2 w-full sm:w-auto max-w-md"
                disabled={flashcards.length === 0}
              >
                <BookOpen className="h-5 w-5" />
                Iniciar Modo de Estudo ({flashcards.length} {flashcards.length === 1 ? 'card' : 'cards'})
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-1 order-2 lg:order-1">
                <FlashcardForm onAdd={() => {
                  loadFlashcards();
                  loadStatistics();
                }} selectedDeckId={selectedDeckIds[0] || null} />
              </div>
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold mb-2">Meus Flashcards</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Total: {flashcards.length} {flashcards.length === 1 ? "cartão" : "cartões"}
                  </p>
                </div>
                <FlashcardList
                  flashcards={flashcards}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tab: Calendário */}
          <TabsContent value="calendar">
            <ElegantCalendar 
              reviewData={calendarData}
              onDateSelect={(date) => {
                console.log("Data selecionada:", date);
              }}
            />
          </TabsContent>

          {/* Tab: Estatísticas */}
          <TabsContent value="statistics">
            {userStats && (
              <ElegantStatistics
                userStats={userStats}
                dailyStats={dailyStats}
                deckStats={deckStats}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <EditFlashcardDialog
          flashcard={editingFlashcard}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={() => {
            loadFlashcards();
            loadStatistics();
          }}
        />

        <CreateDeckDialog
          open={isCreateDeckDialogOpen}
          onOpenChange={setIsCreateDeckDialogOpen}
          onCreated={() => {
            loadDecks();
            toast({
              title: "Deck criado!",
              description: "Seu novo deck foi criado com sucesso",
            });
          }}
        />

        <EditDeckDialog
          deck={editingDeck}
          open={isEditDeckDialogOpen}
          onOpenChange={setIsEditDeckDialogOpen}
          onUpdated={() => {
            loadDecks();
            loadFlashcards();
            toast({
              title: "Deck atualizado!",
              description: "As alterações foram salvas com sucesso",
            });
          }}
        />
        </div>
      </main>
    </div>
  );
}
