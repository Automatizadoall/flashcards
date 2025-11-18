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
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MinimalSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MinimalSidebar({ activeTab, onTabChange }: MinimalSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "flashcards", label: "Flashcards", icon: BookOpen },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "statistics", label: "Estatísticas", icon: BarChart3 },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-background border-r z-40 flex flex-col shadow-lg",
        "transition-all duration-500 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        "lg:sticky lg:top-0"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
        <div className={cn(
          "flex items-center gap-2 transition-all duration-500",
          isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
        )}>
          <div className="p-2 bg-teal-600 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base">FlashCards</span>
            <span className="text-[10px] text-muted-foreground">Aprendizado inteligente</span>
          </div>
        </div>
        
        {isCollapsed && (
          <div className="p-2 bg-teal-600 rounded-lg mx-auto">
            <Brain className="h-5 w-5 text-white" />
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "transition-all duration-300 hover:bg-teal-100 dark:hover:bg-teal-900/30",
            isCollapsed && "absolute right-2"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                "group relative overflow-hidden",
                isActive
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg scale-105"
                  : "hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 dark:hover:from-teal-950/20 dark:hover:to-cyan-950/20 text-muted-foreground hover:text-foreground hover:scale-102"
              )}
            >
              {/* Animated background on hover */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              
              <Icon className={cn(
                "h-5 w-5 flex-shrink-0 relative z-10 transition-transform duration-300",
                isActive && "scale-110",
                !isActive && "group-hover:scale-110"
              )} />
              
              <span className={cn(
                "font-medium relative z-10 transition-all duration-500",
                isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              )}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className={cn(
          "transition-all duration-500",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          {!isCollapsed && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Sistema online</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">
                v1.0.0
              </div>
            </div>
          )}
        </div>
        
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}

