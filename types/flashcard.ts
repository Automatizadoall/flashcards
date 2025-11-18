export interface Flashcard {
  id: string;
  frente: string;
  resposta: string;
  comentario?: string;
  dicas?: string;
  categoria?: string;
  nivel?: string;
  criadoEm: Date;
  ultimaRevisao?: Date;
  totalRevisoes?: number;
  totalAcertos?: number;
  totalErros?: number;
  facilidade?: number;
  // Campos FSRS
  state?: 'new' | 'learning' | 'review' | 'relearning';
  difficulty?: number;
  stability?: number;
  dueDate?: Date;
  elapsedDays?: number;
  scheduledDays?: number;
  reps?: number;
  lapses?: number;
  lastReview?: Date;
}

