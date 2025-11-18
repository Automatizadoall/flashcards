"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, MessageSquare, Lightbulb } from "lucide-react";
import { Flashcard } from "@/types/flashcard";
import { cn } from "@/lib/utils";

interface FlashcardItemProps {
  flashcard: Flashcard;
  onDelete: (id: string) => void;
  onEdit: (flashcard: Flashcard) => void;
}

export function FlashcardItem({ flashcard, onDelete, onEdit }: FlashcardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showComentario, setShowComentario] = useState(false);
  const [showDicas, setShowDicas] = useState(false);

  const taxaAcerto = flashcard.totalRevisoes && flashcard.totalRevisoes > 0
    ? Math.round((flashcard.totalAcertos || 0) / flashcard.totalRevisoes * 100)
    : null;

  return (
    <div className="perspective-1000">
      <div className="flex flex-wrap gap-2 mb-2 text-xs items-center">
        {flashcard.categoria && (
          <span className="bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">
            {flashcard.categoria}
          </span>
        )}
        {flashcard.nivel && (
          <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded whitespace-nowrap">
            {flashcard.nivel}
          </span>
        )}
        {taxaAcerto !== null && (
          <span className={cn(
            "px-2 py-1 rounded whitespace-nowrap font-semibold",
            taxaAcerto >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
            taxaAcerto >= 40 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {taxaAcerto}% ({flashcard.totalAcertos}/{flashcard.totalRevisoes})
          </span>
        )}
      </div>
      
      <Card 
        className="cursor-pointer hover:shadow-lg relative min-h-[180px] sm:min-h-[200px]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <CardContent className="p-4 sm:p-6 flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
          {!isFlipped ? (
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-xs text-muted-foreground mb-2">Frente</div>
                <p className="text-base sm:text-lg font-medium break-words">{flashcard.frente}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Clique para ver a resposta
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="text-xs text-muted-foreground mb-2">Resposta</div>
                <p className="text-base sm:text-lg break-words">{flashcard.resposta}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                Clique para voltar
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Dicas e Comentário */}
      {(flashcard.dicas || flashcard.comentario) && (
        <div className="flex gap-2 mt-2">
          {flashcard.dicas && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowDicas(!showDicas);
                setShowComentario(false);
              }}
              className={cn("flex-1 text-xs sm:text-sm", showDicas && "bg-accent")}
            >
              <Lightbulb className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Dicas</span>
              <span className="sm:hidden">💡</span>
            </Button>
          )}
          {flashcard.comentario && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowComentario(!showComentario);
                setShowDicas(false);
              }}
              className={cn("flex-1 text-xs sm:text-sm", showComentario && "bg-accent")}
            >
              <MessageSquare className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Comentário</span>
              <span className="sm:hidden">📝</span>
            </Button>
          )}
        </div>
      )}

      {/* Exibição de Dicas */}
      {showDicas && flashcard.dicas && (
        <Card className="mt-2 border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1 text-yellow-900 dark:text-yellow-100">
                  💡 Dicas de Memorização
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {flashcard.dicas}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exibição de Comentário */}
      {showComentario && flashcard.comentario && (
        <Card className="mt-2 border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1 text-blue-900 dark:text-blue-100">
                  📝 Resposta Comentada
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {flashcard.comentario}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(flashcard);
          }}
          className="flex-1 text-xs sm:text-sm"
        >
          <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Editar</span>
          <span className="sm:hidden">✏️</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(flashcard.id);
          }}
          className="flex-1 text-xs sm:text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Excluir</span>
          <span className="sm:hidden">🗑️</span>
        </Button>
      </div>
    </div>
  );
}

