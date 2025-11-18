"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flashcard } from "@/types/flashcard";
import { ChevronLeft, ChevronRight, X, Lightbulb, MessageSquare, RotateCcw, Frown, Meh, Smile, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { reviewCard, getSchedulingInfo, getStateLabel, type Rating, type FSRSCard } from "@/lib/fsrs";
import { recordFSRSReview } from "@/lib/supabase-storage";
import { useToast } from "@/components/ui/use-toast";

interface StudyModeProps {
  flashcards: Flashcard[];
  onExit: () => void;
}

export function StudyModeFSRS({ flashcards, onExit }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDicas, setShowDicas] = useState(false);
  const [showComentario, setShowComentario] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [reviewedCount, setReviewedCount] = useState(0);
  const { toast } = useToast();

  // Filtrar apenas cards devidos ou novos
  const dueCards = flashcards.filter(card => {
    if (!card.dueDate) return true; // Novos cards
    return new Date(card.dueDate) <= new Date(); // Cards devidos
  });

  if (dueCards.length === 0) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">✅ Tudo revisado!</h2>
            <p className="text-muted-foreground mb-6">
              Você não tem cards pendentes para revisar hoje. Volte amanhã!
            </p>
            <Button onClick={onExit}>Voltar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];
  const progress = ((reviewedCount) / dueCards.length) * 100;

  // Converter flashcard para FSRSCard
  const toFSRSCard = (flashcard: Flashcard): FSRSCard => ({
    state: (flashcard.state || 'new') as any,
    difficulty: flashcard.difficulty || 0,
    stability: flashcard.stability || 0,
    dueDate: flashcard.dueDate ? new Date(flashcard.dueDate) : new Date(),
    elapsedDays: flashcard.elapsedDays || 0,
    scheduledDays: flashcard.scheduledDays || 0,
    reps: flashcard.reps || 0,
    lapses: flashcard.lapses || 0,
    lastReview: flashcard.lastReview ? new Date(flashcard.lastReview) : undefined,
  });

  const fsrsCard = toFSRSCard(currentCard);
  const schedulingInfo = getSchedulingInfo(fsrsCard);

  const handleRating = async (rating: Rating) => {
    const tempoResposta = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    // Processar com FSRS
    const result = reviewCard(fsrsCard, rating);

    // Salvar no banco
    const success = await recordFSRSReview(
      currentCard.id,
      rating,
      tempoResposta,
      result
    );
    
    if (success) {
      setReviewedCount(prev => prev + 1);
      
      const messages = {
        1: { title: "🔄 Repetir", desc: `Você verá este card novamente em breve` },
        2: { title: "😐 Difícil", desc: `Próxima revisão em ${result.scheduledDays} ${result.scheduledDays === 1 ? 'dia' : 'dias'}` },
        3: { title: "😊 Bom", desc: `Próxima revisão em ${result.scheduledDays} ${result.scheduledDays === 1 ? 'dia' : 'dias'}` },
        4: { title: "⚡ Fácil", desc: `Próxima revisão em ${result.scheduledDays} ${result.scheduledDays === 1 ? 'dia' : 'dias'}` },
      };
      
      toast({
        title: messages[rating].title,
        description: messages[rating].desc,
      });
      
      // Avançar após curto delay
      setTimeout(() => {
        if (currentIndex < dueCards.length - 1) {
          handleNext();
        } else {
          handleFinish();
        }
      }, 1200);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowDicas(false);
    setShowComentario(false);
    setStartTime(new Date());
    setCurrentIndex(prev => prev + 1);
  };

  const handleFinish = () => {
    toast({
      title: "🎉 Sessão Completa!",
      description: `Você revisou ${reviewedCount} cards hoje!`,
    });
    setTimeout(() => onExit(), 1500);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex flex-col h-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onExit}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-xl font-bold">Modo de Estudo FSRS</h2>
              <p className="text-sm text-muted-foreground">
                {reviewedCount} de {dueCards.length} revisados
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {getStateLabel(fsrsCard.state)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow w-full max-w-2xl min-h-[400px]"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <CardContent className="p-8 sm:p-12 flex items-center justify-center min-h-[400px]">
              {!isFlipped ? (
                <div className="flex flex-col items-center justify-center text-center w-full">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-4 uppercase tracking-wide">
                    Pergunta
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-medium mb-8">
                    {currentCard.frente}
                  </p>
                  {currentCard.categoria && (
                    <Badge variant="outline" className="mb-2">
                      {currentCard.categoria}
                    </Badge>
                  )}
                  <div className="text-xs sm:text-sm text-muted-foreground mt-8">
                    Clique para revelar a resposta
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  <div className="text-xs sm:text-sm text-muted-foreground mb-4 uppercase tracking-wide">
                    Resposta
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl mb-6">
                    {currentCard.resposta}
                  </p>
                  
                  {/* Botões de Dicas e Comentário */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentCard.dicas && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDicas(!showDicas);
                        }}
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Dicas
                      </Button>
                    )}
                    {currentCard.comentario && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowComentario(!showComentario);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Comentário
                      </Button>
                    )}
                  </div>

                  {/* Conteúdo Expandido */}
                  {showDicas && currentCard.dicas && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg mb-4">
                      <p className="text-sm">{currentCard.dicas}</p>
                    </div>
                  )}
                  {showComentario && currentCard.comentario && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg mb-4">
                      <p className="text-sm">{currentCard.comentario}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Botões de Rating FSRS */}
        {isFlipped && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Button
              variant="destructive"
              size="lg"
              onClick={() => handleRating(1)}
              className="h-20 flex flex-col gap-1"
            >
              <RotateCcw className="h-5 w-5" />
              <span className="font-semibold">Repetir</span>
              <span className="text-xs opacity-80">&lt; 10m</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleRating(2)}
              className="h-20 flex flex-col gap-1 border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <Frown className="h-5 w-5" />
              <span className="font-semibold">Difícil</span>
              <span className="text-xs opacity-80">{schedulingInfo[2].interval}d</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleRating(3)}
              className="h-20 flex flex-col gap-1 border-green-500 text-green-600 hover:bg-green-50"
            >
              <Smile className="h-5 w-5" />
              <span className="font-semibold">Bom</span>
              <span className="text-xs opacity-80">{schedulingInfo[3].interval}d</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleRating(4)}
              className="h-20 flex flex-col gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              <Zap className="h-5 w-5" />
              <span className="font-semibold">Fácil</span>
              <span className="text-xs opacity-80">{schedulingInfo[4].interval}d</span>
            </Button>
          </div>
        )}

        {/* Instruções */}
        {!isFlipped && (
          <div className="text-center text-sm text-muted-foreground">
            Pense na resposta e clique no card para revelar
          </div>
        )}
      </div>
    </div>
  );
}

