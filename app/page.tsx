"use client";

import { useState, useEffect } from "react";
import { FlashcardForm } from "@/components/flashcard-form";
import { FlashcardList } from "@/components/flashcard-list";
import { EditFlashcardDialog } from "@/components/edit-flashcard-dialog";
import { StudyModeFSRS } from "@/components/study-mode-fsrs";
import { DeckSelector } from "@/components/deck-selector";
import { CreateDeckDialog } from "@/components/create-deck-dialog";
import { CalendarView } from "@/components/calendar-view";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDeckDialogOpen, setIsCreateDeckDialogOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [activeTab, setActiveTab] = useState("flashcards");
  
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

  // Calcular estatísticas para sidebars
  const sidebarStats = userStats ? {
    dueToday: userStats.dueToday || 0,
    totalCards: userStats.totalCards || 0,
    accuracy: dailyStats.length > 0 
      ? Math.round((dailyStats.reduce((sum, d) => sum + d.correctReviews, 0) / 
          Math.max(1, dailyStats.reduce((sum, d) => sum + d.totalReviews, 0))) * 100)
      : 0,
    streak: dailyStats.filter(d => d.totalReviews > 0).length,
    reviewsToday: dailyStats[0]?.totalReviews || 0,
    avgStability: userStats.avgStability || 0,
  } : undefined;

  const dueCardsList = dueCards.slice(0, 10).map((card: any) => ({
    id: card.id,
    frente: card.frente,
    deckNome: card.deck_nome || 'Sem Deck',
    deckIcone: card.deck_icone || '📚',
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Sidebar Esquerda */}
      <LeftSidebar
        decks={decks}
        selectedDeckIds={selectedDeckIds}
        onSelectDecks={setSelectedDeckIds}
        onCreateDeck={() => setIsCreateDeckDialogOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={sidebarStats}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 min-w-0">
        <div className="container mx-auto px-4 py-6 sm:py-8 lg:pl-0">
        {/* Header - Apenas em mobile */}
        <div className="text-center mb-6 sm:mb-8 lg:hidden">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FlashCards Pro
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema avançado de repetição espaçada com FSRS
          </p>
        </div>

        {/* Tabs de Navegação - Apenas em mobile */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-6 lg:hidden">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="flashcards" className="gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Flashcards</span>
                <span className="sm:hidden">Cards</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendário</span>
                <span className="sm:hidden">Agenda</span>
              </TabsTrigger>
              <TabsTrigger value="statistics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Estatísticas</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab: Flashcards */}
          <TabsContent value="flashcards" className="space-y-6">
            <div className="mb-6 sm:mb-8">
              <DeckSelector
                decks={decks}
                selectedDeckIds={selectedDeckIds}
                onSelectDecks={setSelectedDeckIds}
                onCreateDeck={() => setIsCreateDeckDialogOpen(true)}
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
            <CalendarView 
              reviewData={calendarData}
              onDateSelect={(date) => {
                console.log("Data selecionada:", date);
              }}
            />
          </TabsContent>

          {/* Tab: Estatísticas */}
          <TabsContent value="statistics">
            {userStats && (
              <StatisticsDashboard
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
        </div>
      </main>

      {/* Sidebar Direita */}
      <RightSidebar
        stats={sidebarStats}
        dueCards={dueCardsList}
        onStartStudy={handleStartStudy}
      />
    </div>
  );
}
