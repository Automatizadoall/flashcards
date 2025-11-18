import { Flashcard } from "@/types/flashcard";
import { flashcardsIniciais } from "./initial-data";

const STORAGE_KEY = "flashcards";
const INITIALIZED_KEY = "flashcards_initialized";

export const getFlashcards = (): Flashcard[] => {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  const initialized = localStorage.getItem(INITIALIZED_KEY);
  
  // Se não está inicializado, carregar dados iniciais
  if (!initialized) {
    const initialFlashcards = flashcardsIniciais.map((card) => ({
      ...card,
      id: crypto.randomUUID(),
      criadoEm: new Date(),
    }));
    saveFlashcards(initialFlashcards);
    localStorage.setItem(INITIALIZED_KEY, "true");
    return initialFlashcards;
  }
  
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((card: any) => ({
      ...card,
      criadoEm: new Date(card.criadoEm),
      ultimaRevisao: card.ultimaRevisao ? new Date(card.ultimaRevisao) : undefined,
    }));
  } catch {
    return [];
  }
};

export const saveFlashcards = (flashcards: Flashcard[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
};

export const addFlashcard = (
  frente: string,
  resposta: string,
  comentario?: string,
  dicas?: string,
  categoria?: string,
  nivel?: string
): Flashcard => {
  const flashcards = getFlashcards();
  const newCard: Flashcard = {
    id: crypto.randomUUID(),
    frente,
    resposta,
    comentario,
    dicas,
    categoria,
    nivel,
    criadoEm: new Date(),
  };
  
  flashcards.push(newCard);
  saveFlashcards(flashcards);
  return newCard;
};

export const deleteFlashcard = (id: string): void => {
  const flashcards = getFlashcards();
  const filtered = flashcards.filter((card) => card.id !== id);
  saveFlashcards(filtered);
};

export const updateFlashcard = (
  id: string,
  frente: string,
  resposta: string,
  comentario?: string,
  dicas?: string,
  categoria?: string,
  nivel?: string
): void => {
  const flashcards = getFlashcards();
  const updated = flashcards.map((card) =>
    card.id === id ? { ...card, frente, resposta, comentario, dicas, categoria, nivel } : card
  );
  saveFlashcards(updated);
};

export const markAsReviewed = (id: string): void => {
  const flashcards = getFlashcards();
  const updated = flashcards.map((card) =>
    card.id === id ? { ...card, ultimaRevisao: new Date() } : card
  );
  saveFlashcards(updated);
};

