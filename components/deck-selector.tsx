"use client"

import { Deck } from "@/types/deck";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, CheckSquare, Square, Settings2, Edit, Sparkles } from "lucide-react";
import { useState } from "react";

interface DeckSelectorProps {
  decks: Deck[];
  selectedDeckIds: string[];
  onSelectDecks: (deckIds: string[]) => void;
  onCreateDeck: () => void;
  onEditDeck: (deck: Deck) => void;
}

export function DeckSelector({ decks, selectedDeckIds, onSelectDecks, onCreateDeck, onEditDeck }: DeckSelectorProps) {
  const [hoveredDeck, setHoveredDeck] = useState<string | null>(null);

  const toggleDeck = (deckId: string) => {
    if (selectedDeckIds.includes(deckId)) {
      onSelectDecks(selectedDeckIds.filter(id => id !== deckId));
    } else {
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
    <div className="space-y-6">
      {/* Header com Gradiente */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 p-8 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Meus Decks</h2>
                <p className="text-white/80 text-sm">Organize seus flashcards por tema</p>
              </div>
            </div>
            <Button onClick={onCreateDeck} size="lg" className="bg-white text-teal-600 hover:bg-white/90 gap-2 shadow-lg">
              <Plus className="h-5 w-5" />
              Novo Deck
            </Button>
          </div>

          {selectedDeckIds.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <CheckSquare className="h-5 w-5" />
              <span className="font-medium">
                {selectedDeckIds.length} {selectedDeckIds.length === 1 ? 'deck selecionado' : 'decks selecionados'}
              </span>
              <span className="text-white/60">·</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {totalSelectedCards} cards
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <Button 
          onClick={allSelected ? selectNone : selectAll} 
          variant="outline"
          className="flex-1 h-12"
        >
          {allSelected ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Desmarcar Todos
            </>
          ) : (
            <>
              <CheckSquare className="h-4 w-4 mr-2" />
              Selecionar Todos
            </>
          )}
        </Button>
      </div>

      {/* Grid de Decks */}
      {decks.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum deck ainda</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro deck para começar a organizar seus flashcards
            </p>
            <Button onClick={onCreateDeck} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Criar Primeiro Deck
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {decks.map((deck) => {
            const selected = isSelected(deck.id);
            const hovered = hoveredDeck === deck.id;
            
            return (
              <Card
                key={deck.id}
                className={cn(
                  "group relative p-6 cursor-pointer transition-all duration-300 overflow-hidden",
                  "hover:shadow-2xl hover:-translate-y-1",
                  selected 
                    ? "ring-2 ring-offset-2 shadow-xl" 
                    : "hover:ring-1 hover:ring-offset-1 hover:ring-primary/50"
                )}
                style={{
                  ringColor: selected ? deck.cor : undefined,
                  borderColor: selected ? deck.cor : undefined,
                }}
                onMouseEnter={() => setHoveredDeck(deck.id)}
                onMouseLeave={() => setHoveredDeck(null)}
                onClick={() => toggleDeck(deck.id)}
              >
                {/* Gradiente de Fundo Sutil */}
                <div 
                  className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${deck.cor}, transparent)`
                  }}
                />

                {/* Conteúdo */}
                <div className="relative z-10">
                  {/* Header do Card */}
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="text-4xl p-3 rounded-xl transition-transform group-hover:scale-110"
                      style={{
                        backgroundColor: `${deck.cor}15`
                      }}
                    >
                      {deck.icone}
                    </div>
                    
                    <div className="flex gap-1">
                      {/* Botão de Editar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDeck(deck);
                        }}
                        className={cn(
                          "p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100",
                          "hover:bg-primary/10 hover:scale-110"
                        )}
                        title="Editar deck"
                      >
                        <Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>

                      {/* Checkbox */}
                      <div className="p-2">
                        {selected ? (
                          <CheckSquare className="h-5 w-5 transition-transform scale-110" style={{ color: deck.cor }} />
                        ) : (
                          <Square className="h-5 w-5 text-muted-foreground transition-opacity" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Nome e Descrição */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {deck.nome}
                    </h3>
                    {deck.descricao && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {deck.descricao}
                      </p>
                    )}
                  </div>

                  {/* Footer do Card */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary" 
                        className="font-semibold"
                        style={{
                          backgroundColor: `${deck.cor}20`,
                          color: deck.cor,
                          borderColor: `${deck.cor}30`
                        }}
                      >
                        {deck.totalFlashcards} {deck.totalFlashcards === 1 ? 'card' : 'cards'}
                      </Badge>
                    </div>

                    {selected && (
                      <Badge 
                        variant="default"
                        className="animate-in fade-in slide-in-from-right-2"
                        style={{
                          backgroundColor: deck.cor
                        }}
                      >
                        Selecionado
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dica */}
      {noneSelected && decks.length > 0 && (
        <div className="text-center p-6 bg-muted/50 rounded-xl border-2 border-dashed">
          <p className="text-sm text-muted-foreground">
            💡 Selecione um ou mais decks acima para filtrar seus flashcards
          </p>
        </div>
      )}
    </div>
  );
}
