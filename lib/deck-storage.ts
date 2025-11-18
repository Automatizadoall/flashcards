"use client"

import { supabase } from "./supabase";
import { Deck } from "@/types/deck";

// Converter do formato do Supabase para o formato da aplicação
const dbToDeck = (db: any): Deck => ({
  id: db.id,
  nome: db.nome,
  descricao: db.descricao,
  cor: db.cor,
  icone: db.icone,
  criadoEm: new Date(db.criado_em),
  atualizadoEm: new Date(db.atualizado_em),
  totalFlashcards: db.total_flashcards || 0,
});

export const getDecks = async (): Promise<Deck[]> => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return (data || []).map(dbToDeck);
  } catch (error) {
    console.error('Erro ao buscar decks:', error);
    return [];
  }
};

export const createDeck = async (
  nome: string,
  descricao?: string,
  cor?: string,
  icone?: string
): Promise<Deck | null> => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .insert({
        nome,
        descricao: descricao || null,
        cor: cor || '#3b82f6',
        icone: icone || '📚',
      })
      .select()
      .single();

    if (error) throw error;
    return dbToDeck(data);
  } catch (error) {
    console.error('Erro ao criar deck:', error);
    return null;
  }
};

export const updateDeck = async (
  id: string,
  nome: string,
  descricao?: string,
  cor?: string,
  icone?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('decks')
      .update({
        nome,
        descricao: descricao || null,
        cor: cor || '#3b82f6',
        icone: icone || '📚',
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao atualizar deck:', error);
    return false;
  }
};

export const deleteDeck = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao excluir deck:', error);
    return false;
  }
};

