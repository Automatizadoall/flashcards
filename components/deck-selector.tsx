"use client"

import { Deck } from "@/types/deck";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, CheckSquare, Square } from "lucide-react";

interface DeckSelectorProps {
  decks: Deck[];
  selectedDeckIds: string[];
  onSelectDecks: (deckIds: string[]) => void;
  onCreateDeck: () => void;
}

export function DeckSelector({ decks, selectedDeckIds, onSelectDecks, onCreateDeck }: DeckSelectorProps) {
  const toggleDeck = (deckId: string) => {
    if (selectedDeckIds.includes(deckId)) {
      // Remover deck da seleção
      onSelectDecks(selectedDeckIds.filter(id => id !== deckId));
    } else {
      // Adicionar deck à seleção
      onSelectDecks([...selectedDeckIds, deckId]);
    }
  };

  const selectAll = () => {
    onSelectDecks(decks.map(d => d.id));
  };

  const selectNone = () => {
    onSelectDecks([]);
  };

  const isSelected = (deckId: string) => selectedDeckIds.includes(deckId);
  const allSelected = selectedDeckIds.length === decks.length && decks.length > 0;
  const noneSelected = selectedDeckIds.length === 0;

  const totalSelectedCards = decks
    .filter(deck => selectedDeckIds.includes(deck.id))
    .reduce((sum, deck) => sum + deck.totalFlashcards, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Decks</h2>
          {selectedDeckIds.length > 0 && (
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
              {selectedDeckIds.length} {selectedDeckIds.length === 1 ? 'selecionado' : 'selecionados'} · {totalSelectedCards} cards
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={allSelected ? selectNone : selectAll} 
            size="sm" 
            variant="outline"
            className="gap-1"
          >
            {allSelected ? (
              <>
                <Square className="h-3 w-3" />
                <span className="hidden sm:inline">Desmarcar Todos</span>
                <span className="sm:hidden">Desmarcar</span>
              </>
            ) : (
              <>
                <CheckSquare className="h-3 w-3" />
                <span className="hidden sm:inline">Selecionar Todos</span>
                <span className="sm:hidden">Todos</span>
              </>
            )}
          </Button>
          <Button onClick={onCreateDeck} size="sm" variant="outline">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Novo Deck</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {/* Decks do usuário com seleção múltipla */}
        {decks.map((deck) => {
          const selected = isSelected(deck.id);
          return (
            <Card
              key={deck.id}
              className={cn(
                "p-4 cursor-pointer transition-all hover:shadow-md border-2 relative",
                selected
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "border-transparent hover:border-primary/50"
              )}
              onClick={() => toggleDeck(deck.id)}
              style={{
                borderColor: selected ? deck.cor : undefined,
              }}
            >
              {/* Checkbox visual no canto superior direito */}
              <div className="absolute top-2 right-2">
                {selected ? (
                  <CheckSquare className="h-5 w-5 text-primary" />
                ) : (
                  <Square className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex items-center gap-3 pr-6">
                <div className="text-3xl">{deck.icone}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{deck.nome}</h3>
                  <p className="text-xs text-muted-foreground">
                    {deck.totalFlashcards} {deck.totalFlashcards === 1 ? 'card' : 'cards'}
                  </p>
                </div>
              </div>
              {deck.descricao && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {deck.descricao}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {noneSelected && decks.length > 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          💡 Selecione um ou mais decks para filtrar os flashcards
        </div>
      )}
    </div>
  );
}

