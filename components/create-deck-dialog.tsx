"use client"

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDeck } from "@/lib/deck-storage";
import { useToast } from "@/components/ui/use-toast";

interface CreateDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

const ICONS = ['📚', '🫀', '💧', '❤️', '🧠', '🦴', '🫁', '👁️', '👂', '🦷'];
const COLORS = ['#3b82f6', '#ec4899', '#ef4444', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#84cc16'];

export function CreateDeckDialog({ open, onOpenChange, onCreated }: CreateDeckDialogProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, dê um nome ao deck",
        variant: "destructive",
      });
      return;
    }

    const result = await createDeck(nome, descricao || undefined, selectedColor, selectedIcon);
    
    if (result) {
      setNome("");
      setDescricao("");
      setSelectedIcon('📚');
      setSelectedColor('#3b82f6');
      
      toast({
        title: "Sucesso!",
        description: "Deck criado com sucesso",
      });
      
      onCreated();
      onOpenChange(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível criar o deck",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Novo Deck</DialogTitle>
          <DialogDescription>
            Crie uma coleção de flashcards para organizar seus estudos
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nome" className="text-sm font-medium">
              Nome do Deck *
            </label>
            <Input
              id="nome"
              placeholder="Ex: Sistema Cardiovascular"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium">
              Descrição (Opcional)
            </label>
            <Textarea
              id="descricao"
              placeholder="Descreva o conteúdo deste deck..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Ícone</label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`text-2xl p-2 rounded border-2 transition-colors ${
                    selectedIcon === icon 
                      ? 'border-primary bg-primary/10' 
                      : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cor</label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color 
                      ? 'border-black dark:border-white scale-110' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Criar Deck
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

