"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { addFlashcard } from "@/lib/supabase-storage";
import { useToast } from "@/components/ui/use-toast";

interface FlashcardFormProps {
  onAdd: () => void;
  selectedDeckId?: string | null;
}

export function FlashcardForm({ onAdd, selectedDeckId }: FlashcardFormProps) {
  const [frente, setFrente] = useState("");
  const [resposta, setResposta] = useState("");
  const [comentario, setComentario] = useState("");
  const [dicas, setDicas] = useState("");
  const [categoria, setCategoria] = useState("");
  const [nivel, setNivel] = useState("");
  const { toast } = useToast();

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

    const result = await addFlashcard(frente, resposta, comentario || undefined, dicas || undefined, categoria || undefined, nivel || undefined, selectedDeckId || undefined);
    
    if (result) {
      setFrente("");
      setResposta("");
      setComentario("");
      setDicas("");
      setCategoria("");
      setNivel("");
      
      toast({
        title: "Sucesso!",
        description: "Flashcard criado com sucesso",
      });
      
      onAdd();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível criar o flashcard",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Criar Novo Flashcard</CardTitle>
        <CardDescription className="text-sm">
          Adicione um novo cartão de estudos com uma pergunta e resposta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <label htmlFor="frente" className="text-sm font-medium">
              Frente (Pergunta)
            </label>
            <Input
              id="frente"
              placeholder="Digite a pergunta ou conceito..."
              value={frente}
              onChange={(e) => setFrente(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="resposta" className="text-sm font-medium">
              Verso (Resposta)
            </label>
            <Textarea
              id="resposta"
              placeholder="Digite a resposta ou explicação..."
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="comentario" className="text-sm font-medium">
              Comentário / Resposta Comentada (Opcional)
            </label>
            <Textarea
              id="comentario"
              placeholder="Adicione explicações detalhadas, contexto ou informações extras..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dicas" className="text-sm font-medium">
              Dicas (Opcional)
            </label>
            <Textarea
              id="dicas"
              placeholder="Adicione dicas para memorização..."
              value={dicas}
              onChange={(e) => setDicas(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="categoria" className="text-sm font-medium">
                Categoria (Opcional)
              </label>
              <Input
                id="categoria"
                placeholder="Ex: Anatomia, História..."
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nivel" className="text-sm font-medium">
                Nível (Opcional)
              </label>
              <Input
                id="nivel"
                placeholder="Ex: Básico, Avançado..."
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Flashcard
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

