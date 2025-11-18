"use client"

import { supabase } from "./supabase";
import { Flashcard } from "@/types/flashcard";
import { flashcardsIniciais } from "./initial-data";

// Converter do formato do Supabase para o formato da aplicação
const dbToFlashcard = (db: any): Flashcard => ({
  id: db.id,
  frente: db.frente,
  resposta: db.resposta,
  comentario: db.comentario,
  dicas: db.dicas,
  categoria: db.categoria,
  nivel: db.nivel,
  criadoEm: new Date(db.criado_em),
  ultimaRevisao: db.ultima_revisao ? new Date(db.ultima_revisao) : undefined,
  totalRevisoes: db.total_revisoes,
  totalAcertos: db.total_acertos,
  totalErros: db.total_erros,
  facilidade: db.facilidade,
});

// Converter do formato da aplicação para o formato do Supabase
const flashcardToDb = (flashcard: Partial<Flashcard>) => ({
  frente: flashcard.frente,
  resposta: flashcard.resposta,
  comentario: flashcard.comentario || null,
  dicas: flashcard.dicas || null,
  categoria: flashcard.categoria || null,
  nivel: flashcard.nivel || null,
});

// Inicializar dados se necessário
export const initializeData = async (): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('id')
      .limit(1);

    if (error) throw error;

    // Se não houver dados, inserir flashcards iniciais
    if (data.length === 0) {
      const initialData = flashcardsIniciais.map(card => ({
        frente: card.frente,
        resposta: card.resposta,
        comentario: card.comentario || null,
        dicas: card.dicas || null,
        categoria: card.categoria || null,
        nivel: card.nivel || null,
      }));

      const { error: insertError } = await supabase
        .from('flashcards')
        .insert(initialData);

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
  }
};

export const getFlashcards = async (deckIds?: string[]): Promise<Flashcard[]> => {
  try {
    let query = supabase
      .from('flashcards')
      .select('*')
      .order('criado_em', { ascending: false });
    
    if (deckIds && deckIds.length > 0) {
      query = query.in('deck_id', deckIds);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(dbToFlashcard);
  } catch (error) {
    console.error('Erro ao buscar flashcards:', error);
    return [];
  }
};

export const addFlashcard = async (
  frente: string,
  resposta: string,
  comentario?: string,
  dicas?: string,
  categoria?: string,
  nivel?: string,
  deckId?: string
): Promise<Flashcard | null> => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .insert({
        frente,
        resposta,
        comentario: comentario || null,
        dicas: dicas || null,
        categoria: categoria || null,
        nivel: nivel || null,
        deck_id: deckId || null,
      })
      .select()
      .single();

    if (error) throw error;
    return dbToFlashcard(data);
  } catch (error) {
    console.error('Erro ao adicionar flashcard:', error);
    return null;
  }
};

export const updateFlashcard = async (
  id: string,
  frente: string,
  resposta: string,
  comentario?: string,
  dicas?: string,
  categoria?: string,
  nivel?: string,
  deckId?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .update({
        frente,
        resposta,
        comentario: comentario || null,
        dicas: dicas || null,
        categoria: categoria || null,
        nivel: nivel || null,
        deck_id: deckId || null,
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar flashcard:', error);
    return false;
  }
};

export const deleteFlashcard = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir flashcard:', error);
    return false;
  }
};

export const recordReview = async (
  flashcardId: string,
  acertou: boolean,
  tempoResposta?: number
): Promise<boolean> => {
  try {
    // Registrar a revisão
    const { error: reviewError } = await supabase
      .from('flashcard_reviews')
      .insert({
        flashcard_id: flashcardId,
        acertou,
        tempo_resposta: tempoResposta || null,
      });

    if (reviewError) throw reviewError;

    // Atualizar estatísticas do flashcard
    const { data: flashcard, error: fetchError } = await supabase
      .from('flashcards')
      .select('total_revisoes, total_acertos, total_erros, facilidade')
      .eq('id', flashcardId)
      .single();

    if (fetchError) throw fetchError;

    const novoTotalRevisoes = (flashcard.total_revisoes || 0) + 1;
    const novoTotalAcertos = (flashcard.total_acertos || 0) + (acertou ? 1 : 0);
    const novoTotalErros = (flashcard.total_erros || 0) + (acertou ? 0 : 1);
    
    // Calcular nova facilidade (algoritmo simples)
    let novaFacilidade = flashcard.facilidade || 2.5;
    if (acertou) {
      novaFacilidade = Math.min(5, novaFacilidade + 0.1);
    } else {
      novaFacilidade = Math.max(1.3, novaFacilidade - 0.2);
    }

    const { error: updateError } = await supabase
      .from('flashcards')
      .update({
        total_revisoes: novoTotalRevisoes,
        total_acertos: novoTotalAcertos,
        total_erros: novoTotalErros,
        ultima_revisao: new Date().toISOString(),
        facilidade: novaFacilidade,
      })
      .eq('id', flashcardId);

    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error('Erro ao registrar revisão:', error);
    return false;
  }
};

export const getFlashcardStats = async (flashcardId: string) => {
  try {
    const { data, error } = await supabase
      .from('flashcards')
      .select('total_revisoes, total_acertos, total_erros, facilidade, ultima_revisao')
      .eq('id', flashcardId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return null;
  }
};

