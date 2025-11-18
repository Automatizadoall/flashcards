"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Deck } from "@/types/deck";
import {
  BookOpen,
  Calendar,
  BarChart3,
  Plus,
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  Brain,
  Settings,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeftSidebarProps {
  decks: Deck[];
  selectedDeckIds: string[];
  onSelectDecks: (deckIds: string[]) => void;
  onCreateDeck: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: {
    dueToday: number;
    streak: number;
  };
}

export function LeftSidebar({
  decks,
  selectedDeckIds,
  onSelectDecks,
  onCreateDeck,
  activeTab,
  onTabChange,
  stats,
}: LeftSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "flashcards", label: "Flashcards", icon: BookOpen },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "statistics", label: "Estatísticas", icon: BarChart3 },
  ];

  const toggleDeck = (deckId: string) => {
    if (selectedDeckIds.includes(deckId)) {
      onSelectDecks(selectedDeckIds.filter(id => id !== deckId));
    } else {
      onSelectDecks([...selectedDeckIds, deckId]);
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-background border-r z-40 transition-all duration-300 flex flex-col",
          isCollapsed ? "w-16" : "w-72",
          "lg:sticky lg:top-0"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">FlashCards</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(isCollapsed && "mx-auto")}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Navegação Principal */}
          <div className="space-y-1">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Navegação
              </h3>
            )}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    isCollapsed && "justify-center px-2"
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Button>
              );
            })}
          </div>

          {/* Estatísticas Rápidas */}
          {!isCollapsed && stats && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Devidos</span>
                  </div>
                  <Badge variant="secondary">{stats.dueToday}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Sequência</span>
                  </div>
                  <Badge variant="secondary">{stats.streak} dias</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Decks Rápidos */}
          {!isCollapsed && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                  Decks
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateDeck}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {decks.slice(0, 5).map((deck) => {
                  const isSelected = selectedDeckIds.includes(deck.id);
                  return (
                    <button
                      key={deck.id}
                      onClick={() => toggleDeck(deck.id)}
                      className={cn(
                        "w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left",
                        isSelected && "bg-primary/10 border border-primary/20"
                      )}
                    >
                      <span className="text-lg">{deck.icone}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{deck.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {deck.totalFlashcards} cards
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
                {decks.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{decks.length - 5} mais decks
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Ícones colapsados */}
          {isCollapsed && decks.length > 0 && (
            <div className="space-y-2">
              {decks.slice(0, 3).map((deck) => (
                <button
                  key={deck.id}
                  onClick={() => toggleDeck(deck.id)}
                  className={cn(
                    "w-full flex items-center justify-center p-2 rounded-lg hover:bg-muted transition-colors",
                    selectedDeckIds.includes(deck.id) && "bg-primary/10"
                  )}
                  title={deck.nome}
                >
                  <span className="text-xl">{deck.icone}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          {!isCollapsed ? (
            <Button variant="outline" className="w-full gap-2" size="sm">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          ) : (
            <Button variant="outline" size="icon" className="w-full">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}

