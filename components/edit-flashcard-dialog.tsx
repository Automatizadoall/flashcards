"use client";

import { useState, useEffect } from "react";
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
import { Flashcard } from "@/types/flashcard";
import { updateFlashcard } from "@/lib/supabase-storage";
import { useToast } from "@/components/ui/use-toast";

interface EditFlashcardDialogProps {
  flashcard: Flashcard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function EditFlashcardDialog({
  flashcard,
  open,
  onOpenChange,
  onUpdate,
}: EditFlashcardDialogProps) {
  const [frente, setFrente] = useState("");
  const [resposta, setResposta] = useState("");
  const [comentario, setComentario] = useState("");
  const [dicas, setDicas] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nivel, setNivel] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (flashcard) {
      setFrente(flashcard.frente);
      setResposta(flashcard.resposta);
      setComentario(flashcard.comentario || "");
      setDicas(flashcard.dicas || "");
      setCategoria(flashcard.categoria || "");
      setNivel(flashcard.nivel || "");
    }
  }, [flashcard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!frente.trim() || !resposta.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (flashcard) {
      const success = await updateFlashcard(
        flashcard.id,
        frente,
        resposta,
        comentario || undefined,
        dicas || undefined,
        categoria || undefined,
        nivel || undefined
      );
      
      if (success) {
        toast({
          title: "Sucesso!",
          description: "Flashcard atualizado com sucesso",
        });
        onUpdate();
        onOpenChange(false);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o flashcard",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Flashcard</DialogTitle>
          <DialogDescription>
            Faça as alterações no seu flashcard abaixo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <label htmlFor="edit-frente" className="text-sm font-medium">
              Frente (Pergunta)
            </label>
            <Input
              id="edit-frente"
              value={frente}
              onChange={(e) => setFrente(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="edit-resposta" className="text-sm font-medium">
              Verso (Resposta)
            </label>
            <Textarea
              id="edit-resposta"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-comentario" className="text-sm font-medium">
              Comentário / Resposta Comentada (Opcional)
            </label>
            <Textarea
              id="edit-comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-dicas" className="text-sm font-medium">
              Dicas (Opcional)
            </label>
            <Textarea
              id="edit-dicas"
              value={dicas}
              onChange={(e) => setDicas(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="edit-categoria" className="text-sm font-medium">
                Categoria (Opcional)
              </label>
              <Input
                id="edit-categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-nivel" className="text-sm font-medium">
                Nível (Opcional)
              </label>
              <Input
                id="edit-nivel"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

