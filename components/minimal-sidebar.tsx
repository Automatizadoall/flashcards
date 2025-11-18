"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MinimalSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MinimalSidebar({ activeTab, onTabChange }: MinimalSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "flashcards", label: "Flashcards", icon: BookOpen },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "statistics", label: "Estatísticas", icon: BarChart3 },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-background border-r z-40 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
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

      {/* Navegação */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer vazio para espaçamento */}
      <div className="p-4 border-t">
        <div className={cn(
          "text-xs text-muted-foreground text-center",
          isCollapsed && "hidden"
        )}>
          v1.0.0
        </div>
      </div>
    </aside>
  );
}

