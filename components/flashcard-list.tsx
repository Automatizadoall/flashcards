"use client";

import { FlashcardItem } from "./flashcard-item";
import { Flashcard } from "@/types/flashcard";

interface FlashcardListProps {
  flashcards: Flashcard[];
  onDelete: (id: string) => void;
  onEdit: (flashcard: Flashcard) => void;
}

export function FlashcardList({ flashcards, onDelete, onEdit }: FlashcardListProps) {
  if (flashcards.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <p className="text-muted-foreground text-base sm:text-lg">
          Nenhum flashcard criado ainda. Crie seu primeiro cartão acima!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {flashcards.map((flashcard) => (
        <FlashcardItem
          key={flashcard.id}
          flashcard={flashcard}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

