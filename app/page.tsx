"use client";

import { useState, useEffect } from "react";
import { FlashcardForm } from "@/components/flashcard-form";
import { FlashcardList } from "@/components/flashcard-list";
import { EditFlashcardDialog } from "@/components/edit-flashcard-dialog";
import { StudyMode } from "@/components/study-mode";
import { DeckSelector } from "@/components/deck-selector";
import { CreateDeckDialog } from "@/components/create-deck-dialog";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/types/flashcard";
import { Deck } from "@/types/deck";
import { getFlashcards, deleteFlashcard, initializeData } from "@/lib/supabase-storage";
import { getDecks } from "@/lib/deck-storage";
import { BookOpen, GraduationCap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDeckDialogOpen, setIsCreateDeckDialogOpen] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      await initializeData();
      await loadDecks();
      await loadFlashcards();
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

  const handleDelete = async (id: string) => {
    const success = await deleteFlashcard(id);
    if (success) {
      toast({
        title: "Excluído",
        description: "Flashcard removido com sucesso",
      });
      await loadFlashcards();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o flashcard",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    setIsEditDialogOpen(true);
  };

  const handleStartStudy = () => {
    if (flashcards.length === 0) {
      toast({
        title: "Aviso",
        description: "Crie pelo menos um flashcard para iniciar o modo de estudo",
        variant: "destructive",
      });
      return;
    }
    setIsStudyMode(true);
  };

  if (isStudyMode) {
    return <StudyMode flashcards={flashcards} onExit={() => setIsStudyMode(false)} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <GraduationCap className="h-8 w-8 sm:h-10 md:h-12 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              Plataforma de Flashcards
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground text-center max-w-2xl px-4">
            Crie, organize e estude com flashcards personalizados. Aprenda de forma
            eficiente com nosso sistema de repetição espaçada.
          </p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <FlashcardForm onAdd={loadFlashcards} selectedDeckId={selectedDeckIds[0] || null} />
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

        <EditFlashcardDialog
          flashcard={editingFlashcard}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdate={loadFlashcards}
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
  );
}

