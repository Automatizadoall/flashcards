"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/types/flashcard";
import { ChevronLeft, ChevronRight, X, Lightbulb, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { recordReview } from "@/lib/supabase-storage";
import { useToast } from "@/components/ui/use-toast";

interface StudyModeProps {
  flashcards: Flashcard[];
  onExit: () => void;
}

export function StudyMode({ flashcards, onExit }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffled, setShuffled] = useState<Flashcard[]>([]);
  const [showDicas, setShowDicas] = useState(false);
  const [showComentario, setShowComentario] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [answered, setAnswered] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Embaralhar os flashcards ao iniciar
    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
    setShuffled(shuffledCards);
  }, [flashcards]);

  if (shuffled.length === 0) {
    return null;
  }

  const currentCard = shuffled[currentIndex];
  const progress = ((currentIndex + 1) / shuffled.length) * 100;

  const handleAnswer = async (acertou: boolean) => {
    const tempoResposta = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    const success = await recordReview(currentCard.id, acertou, tempoResposta);
    
    if (success) {
      setAnswered(true);
      toast({
        title: acertou ? "✅ Acertou!" : "❌ Errou!",
        description: acertou 
          ? "Continue assim! Você está indo muito bem." 
          : "Não desista! A prática leva à perfeição.",
      });
      
      // Avançar automaticamente após 1.5 segundos
      setTimeout(() => {
        if (currentIndex < shuffled.length - 1) {
          handleNext();
        } else {
          handleFinish();
        }
      }, 1500);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setShowDicas(false);
    setShowComentario(false);
    setAnswered(false);
    setStartTime(new Date());
    setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setShowDicas(false);
      setShowComentario(false);
      setAnswered(false);
      setStartTime(new Date());
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = () => {
    toast({
      title: "🎉 Parabéns!",
      description: `Você completou ${shuffled.length} flashcards!`,
    });
    setTimeout(() => onExit(), 1000);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onExit}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Modo de Estudo</h2>
              <p className="text-sm text-muted-foreground">
                Cartão {currentIndex + 1} de {shuffled.length}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-secondary rounded-full h-2 mb-8">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center mb-8">
          {/* Tags de categoria e nível */}
          {currentCard.categoria && (
            <div className="flex gap-2 mb-4 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                {currentCard.categoria}
              </span>
              {currentCard.nivel && (
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                  {currentCard.nivel}
                </span>
              )}
            </div>
          )}

          <div className="w-full max-w-2xl">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow relative min-h-[300px] sm:min-h-[400px]"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <CardContent className="p-6 sm:p-12 flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                {!isFlipped ? (
                  <div className="flex flex-col items-center justify-center text-center w-full">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-4">FRENTE</div>
                    <p className="text-xl sm:text-2xl md:text-3xl font-medium">{currentCard.frente}</p>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-8">
                      Clique para revelar a resposta
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center w-full">
                    <div className="text-xs sm:text-sm text-muted-foreground mb-4">RESPOSTA</div>
                    <p className="text-lg sm:text-xl md:text-2xl">{currentCard.resposta}</p>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-8">
                      Clique para voltar à pergunta
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botões de Dicas e Comentário */}
            {(currentCard.dicas || currentCard.comentario) && (
              <div className="flex gap-2 mt-4 w-full max-w-2xl">
                {currentCard.dicas && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDicas(!showDicas);
                      setShowComentario(false);
                    }}
                    className={cn("flex-1", showDicas && "bg-accent")}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
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
                      setShowDicas(false);
                    }}
                    className={cn("flex-1", showComentario && "bg-accent")}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Comentário
                  </Button>
                )}
              </div>
            )}

            {/* Exibição de Dicas */}
            {showDicas && currentCard.dicas && (
              <Card className="mt-4 w-full max-w-2xl border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-yellow-900 dark:text-yellow-100">
                        💡 Dicas de Memorização
                      </h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {currentCard.dicas}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Exibição de Comentário */}
            {showComentario && currentCard.comentario && (
              <Card className="mt-4 w-full max-w-2xl border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-blue-900 dark:text-blue-100">
                        📝 Resposta Comentada
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {currentCard.comentario}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Botões de Avaliação - Mostrar após virar o card */}
        {isFlipped && !answered && (
          <div className="flex gap-4 justify-center mb-6 w-full max-w-2xl mx-auto">
            <Button
              onClick={() => handleAnswer(false)}
              size="lg"
              variant="destructive"
              className="flex-1 sm:flex-none sm:min-w-[180px]"
            >
              <ThumbsDown className="mr-2 h-5 w-5" />
              Errou
            </Button>
            <Button
              onClick={() => handleAnswer(true)}
              size="lg"
              className="flex-1 sm:flex-none sm:min-w-[180px] bg-green-600 hover:bg-green-700"
            >
              <ThumbsUp className="mr-2 h-5 w-5" />
              Acertou
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 w-full max-w-2xl mx-auto">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0 || answered}
            size="lg"
            className="w-full sm:w-auto"
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Anterior
          </Button>

          {!answered && currentIndex < shuffled.length - 1 && (
            <Button 
              onClick={handleNext} 
              size="lg" 
              className="w-full sm:w-auto"
              variant="outline"
            >
              Pular
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

