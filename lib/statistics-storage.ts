"use client"

import { supabase } from "./supabase";
import { format, subDays, startOfDay } from "date-fns";

// Buscar estatísticas gerais do usuário
export async function getUserStatistics() {
  try {
    const { data, error } = await supabase
      .from('user_statistics')
      .select('*')
      .single();

    if (error) throw error;
    
    return {
      totalCards: data.total_cards || 0,
      newCards: data.new_cards || 0,
      learningCards: data.learning_cards || 0,
      reviewCards: data.review_cards || 0,
      dueToday: data.due_today || 0,
      futureReviews: data.future_reviews || 0,
      avgDifficulty: data.avg_difficulty || 0,
      avgStability: data.avg_stability || 0,
      totalReviews: data.total_reviews || 0,
      totalLapses: data.total_lapses || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return {
      totalCards: 0,
      newCards: 0,
      learningCards: 0,
      reviewCards: 0,
      dueToday: 0,
      futureReviews: 0,
      avgDifficulty: 0,
      avgStability: 0,
      totalReviews: 0,
      totalLapses: 0,
    };
  }
}

// Buscar estatísticas diárias
export async function getDailyStatistics(days: number = 14) {
  try {
    const { data, error } = await supabase
      .from('daily_review_stats')
      .select('*')
      .limit(days);

    if (error) throw error;

    return (data || []).map(row => ({
      date: row.review_date,
      totalReviews: row.total_reviews || 0,
      correctReviews: row.correct_reviews || 0,
      incorrectReviews: row.incorrect_reviews || 0,
      avgResponseTime: row.avg_response_time || 0,
    }));
  } catch (error) {
    console.error('Erro ao buscar estatísticas diárias:', error);
    return [];
  }
}

// Buscar cards devidos hoje
export async function getCardsDueToday() {
  try {
    const { data, error } = await supabase
      .from('cards_due_today')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar cards devidos:', error);
    return [];
  }
}

// Buscar estatísticas por deck
export async function getDeckStatistics() {
  try {
    // Buscar todos os decks com seus cards
    const { data: decks, error: decksError } = await supabase
      .from('decks')
      .select(`
        id,
        nome,
        icone,
        total_flashcards
      `);

    if (decksError) throw decksError;

    // Para cada deck, calcular estatísticas
    const deckStats = await Promise.all(
      (decks || []).map(async (deck) => {
        // Cards devidos
        const { count: dueCount } = await supabase
          .from('flashcards')
          .select('*', { count: 'exact', head: true })
          .eq('deck_id', deck.id)
          .lte('due_date', new Date().toISOString());

        // Reviews do deck
        const { data: reviews } = await supabase
          .from('flashcard_reviews')
          .select('acertou')
          .in('flashcard_id', 
            supabase
              .from('flashcards')
              .select('id')
              .eq('deck_id', deck.id)
          );

        const totalReviews = reviews?.length || 0;
        const correctReviews = reviews?.filter(r => r.acertou).length || 0;
        const accuracy = totalReviews > 0 
          ? Math.round((correctReviews / totalReviews) * 100)
          : 0;

        return {
          deckName: deck.nome,
          deckIcon: deck.icone,
          totalCards: deck.total_flashcards || 0,
          dueCards: dueCount || 0,
          accuracy,
        };
      })
    );

    return deckStats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas por deck:', error);
    return [];
  }
}

// Buscar dados do calendário
export async function getCalendarData(month: Date) {
  try {
    const startDate = startOfDay(subDays(month, 30));
    const endDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);

    // Reviews por dia
    const { data: reviews, error } = await supabase
      .from('flashcard_reviews')
      .select('revisado_em')
      .gte('revisado_em', startDate.toISOString())
      .lte('revisado_em', endDate.toISOString());

    if (error) throw error;

    // Cards devidos por dia com informações
    const { data: dueCards } = await supabase
      .from('flashcards')
      .select(`
        id,
        due_date,
        deck_id,
        decks (
          nome,
          icone
        )
      `)
      .gte('due_date', startDate.toISOString())
      .lte('due_date', futureDate.toISOString());

    // Agrupar por data
    const reviewsByDate: Record<string, number> = {};
    const dueByDate: Record<string, { count: number; decks: Record<string, any> }> = {};

    (reviews || []).forEach(review => {
      const date = format(new Date(review.revisado_em), 'yyyy-MM-dd');
      reviewsByDate[date] = (reviewsByDate[date] || 0) + 1;
    });

    // Agrupar por data e deck
    (dueCards || []).forEach(card => {
      const date = format(new Date(card.due_date), 'yyyy-MM-dd');
      if (!dueByDate[date]) {
        dueByDate[date] = { count: 0, decks: {} };
      }
      dueByDate[date].count++;
      
      const deckId = card.deck_id || 'no-deck';
      const deckNome = card.decks?.nome || 'Sem deck';
      const deckIcone = card.decks?.icone || '📚';
      
      if (!dueByDate[date].decks[deckId]) {
        dueByDate[date].decks[deckId] = {
          deckId,
          deckNome,
          deckIcone,
          cardIds: [],
          count: 0,
        };
      }
      
      dueByDate[date].decks[deckId].cardIds.push(card.id);
      dueByDate[date].decks[deckId].count++;
    });

    // Criar array de dias
    const result = [];
    for (let i = -30; i < 60; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() + i);
      const dateStr = format(date, 'yyyy-MM-dd');
      result.push({
        date,
        count: reviewsByDate[dateStr] || 0,
        dueCount: dueByDate[dateStr]?.count || 0,
        dueDecks: dueByDate[dateStr]?.decks ? Object.values(dueByDate[dateStr].decks) : [],
      });
    }

    return result;
  } catch (error) {
    console.error('Erro ao buscar dados do calendário:', error);
    return [];
  }
}

