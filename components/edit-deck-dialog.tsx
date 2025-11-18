"use client"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateDeck, deleteDeck } from "@/lib/deck-storage";
import { Deck } from "@/types/deck";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

interface EditDeckDialogProps {
  deck: Deck | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

const ICONS = ['📚', '🫀', '💧', '❤️', '🧠', '🦴', '🫁', '👁️', '👂', '🦷', '🫁', '🦷', '💊', '🩺', '🧬'];
const COLORS = [
  '#3b82f6', '#ec4899', '#ef4444', '#10b981', '#8b5cf6', 
  '#f59e0b', '#06b6d4', '#84cc16', '#f97316', '#14b8a6'
];

export function EditDeckDialog({ deck, open, onOpenChange, onUpdated }: EditDeckDialogProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (deck && open) {
      setNome(deck.nome);
      setDescricao(deck.descricao || "");
      setSelectedIcon(deck.icone);
      setSelectedColor(deck.cor);
    }
  }, [deck, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deck || !nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome do deck é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const success = await updateDeck(deck.id, nome, descricao || undefined, selectedColor, selectedIcon);
    
    if (success) {
      toast({
        title: "Sucesso!",
        description: "Deck atualizado com sucesso",
      });
      onUpdated();
      onOpenChange(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o deck",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deck) return;

    const success = await deleteDeck(deck.id);
    
    if (success) {
      toast({
        title: "Deck excluído",
        description: "O deck foi excluído com sucesso",
      });
      onUpdated();
      onOpenChange(false);
      setShowDeleteAlert(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o deck",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Deck</DialogTitle>
            <DialogDescription>
              Atualize as informações do seu deck
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
                    className={`text-2xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedIcon === icon 
                        ? 'border-primary bg-primary/10 shadow-lg' 
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
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                      selectedColor === color 
                        ? 'border-black dark:border-white scale-110 shadow-lg' 
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <DialogFooter className="flex gap-2">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => setShowDeleteAlert(true)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
              <div className="flex-1" />
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O deck "{deck?.nome}" será excluído permanentemente.
              Os flashcards deste deck não serão excluídos, apenas ficarão sem deck.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

