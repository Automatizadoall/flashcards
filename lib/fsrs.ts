/**
 * FSRS - Free Spaced Repetition Scheduler
 * Algoritmo moderno de repetição espaçada baseado no FSRS-4.5
 * Mais preciso que SM-2 usado no Anki clássico
 */

export type CardState = 'new' | 'learning' | 'review' | 'relearning';

export type Rating = 1 | 2 | 3 | 4; // 1=Again, 2=Hard, 3=Good, 4=Easy

export interface FSRSCard {
  state: CardState;
  difficulty: number; // 0 a 10
  stability: number; // dias
  dueDate: Date;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  lastReview?: Date;
}

export interface FSRSReviewResult {
  card: FSRSCard;
  rating: Rating;
  scheduledDays: number;
  nextReviewDate: Date;
}

// Parâmetros do FSRS (otimizados para aprendizado geral)
const FSRS_PARAMS = {
  requestRetention: 0.9, // Taxa de retenção desejada (90%)
  maximumInterval: 36500, // Máximo intervalo em dias (100 anos)
  w: [
    0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05,
    0.34, 1.26, 0.29, 2.61,
  ],
};

/**
 * Calcula a dificuldade inicial baseada no rating
 */
function initDifficulty(rating: Rating): number {
  return FSRS_PARAMS.w[4] - (rating - 3) * FSRS_PARAMS.w[5];
}

/**
 * Calcula a estabilidade inicial
 */
function initStability(rating: Rating): number {
  return Math.max(FSRS_PARAMS.w[rating - 1], 0.1);
}

/**
 * Calcula a retenção baseada no tempo decorrido
 */
function calculateRetention(elapsedDays: number, stability: number): number {
  return Math.pow(
    1 + (elapsedDays / (9 * stability)),
    -1
  );
}

/**
 * Calcula o intervalo de revisão
 */
function calculateInterval(stability: number, requestRetention: number): number {
  const interval = stability * (Math.pow(requestRetention, 1/9) - 1) * 9;
  return Math.max(1, Math.min(Math.round(interval), FSRS_PARAMS.maximumInterval));
}

/**
 * Atualiza a dificuldade baseada no rating
 */
function updateDifficulty(difficulty: number, rating: Rating): number {
  const deltaD = rating - 3;
  const newDifficulty = difficulty - FSRS_PARAMS.w[6] * deltaD;
  return Math.max(1, Math.min(newDifficulty, 10));
}

/**
 * Atualiza a estabilidade baseada no rating e estado atual
 */
function updateStability(
  state: CardState,
  difficulty: number,
  stability: number,
  retention: number,
  rating: Rating
): number {
  let newStability: number;

  if (state === 'new') {
    newStability = initStability(rating);
  } else if (state === 'review' || state === 'learning') {
    if (rating === 1) {
      // Again - resetar estabilidade
      newStability = Math.max(
        FSRS_PARAMS.w[11] * Math.pow(difficulty, -FSRS_PARAMS.w[12]) * 
        (Math.pow(stability + 1, FSRS_PARAMS.w[13]) - 1) * 
        Math.exp(FSRS_PARAMS.w[14] * (1 - retention)),
        0.1
      );
    } else {
      // Hard, Good, Easy - aumentar estabilidade
      const hardPenalty = rating === 2 ? FSRS_PARAMS.w[15] : 1;
      const easyBonus = rating === 4 ? FSRS_PARAMS.w[16] : 1;
      newStability = stability * (
        1 + Math.exp(FSRS_PARAMS.w[8]) *
        (11 - difficulty) *
        Math.pow(stability, -FSRS_PARAMS.w[9]) *
        (Math.exp((1 - retention) * FSRS_PARAMS.w[10]) - 1) *
        hardPenalty *
        easyBonus
      );
    }
  } else {
    // relearning
    newStability = Math.max(
      FSRS_PARAMS.w[11] * Math.pow(difficulty, -FSRS_PARAMS.w[12]) * 
      (Math.pow(stability + 1, FSRS_PARAMS.w[13]) - 1) * 
      Math.exp(FSRS_PARAMS.w[14] * (1 - retention)),
      0.1
    );
  }

  return Math.max(0.1, newStability);
}

/**
 * Determina o próximo estado do card
 */
function getNextState(currentState: CardState, rating: Rating): CardState {
  if (rating === 1) {
    // Again
    return currentState === 'new' ? 'learning' : 'relearning';
  }

  switch (currentState) {
    case 'new':
    case 'learning':
      return rating === 2 ? 'learning' : 'review';
    case 'review':
      return 'review';
    case 'relearning':
      return rating === 2 ? 'relearning' : 'review';
    default:
      return 'review';
  }
}

/**
 * Processa uma revisão de flashcard usando FSRS
 */
export function reviewCard(card: FSRSCard, rating: Rating): FSRSReviewResult {
  const now = new Date();
  const elapsedDays = card.lastReview
    ? Math.max(0, Math.floor((now.getTime() - card.lastReview.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Calcular retenção atual
  const retention = card.state === 'new' ? 1 : calculateRetention(elapsedDays, card.stability);

  // Atualizar dificuldade
  const newDifficulty = card.state === 'new'
    ? initDifficulty(rating)
    : updateDifficulty(card.difficulty, rating);

  // Atualizar estabilidade
  const newStability = updateStability(
    card.state,
    newDifficulty,
    card.stability,
    retention,
    rating
  );

  // Calcular próximo intervalo
  const scheduledDays = calculateInterval(newStability, FSRS_PARAMS.requestRetention);

  // Próximo estado
  const nextState = getNextState(card.state, rating);

  // Próxima data de revisão
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + scheduledDays);

  // Atualizar card
  const updatedCard: FSRSCard = {
    state: nextState,
    difficulty: newDifficulty,
    stability: newStability,
    dueDate: nextReviewDate,
    elapsedDays,
    scheduledDays,
    reps: card.reps + 1,
    lapses: rating === 1 ? card.lapses + 1 : card.lapses,
    lastReview: now,
  };

  return {
    card: updatedCard,
    rating,
    scheduledDays,
    nextReviewDate,
  };
}

/**
 * Cria um novo card FSRS
 */
export function createNewCard(): FSRSCard {
  return {
    state: 'new',
    difficulty: 0,
    stability: 0,
    dueDate: new Date(),
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
  };
}

/**
 * Calcula previsão de próximos intervalos para cada rating
 */
export function getSchedulingInfo(card: FSRSCard): Record<Rating, { interval: number; state: CardState }> {
  const results: Record<Rating, { interval: number; state: CardState }> = {} as any;

  ([1, 2, 3, 4] as Rating[]).forEach((rating) => {
    const result = reviewCard({ ...card }, rating);
    results[rating] = {
      interval: result.scheduledDays,
      state: result.card.state,
    };
  });

  return results;
}

/**
 * Converte valores de porcentagem para classificação de dificuldade
 */
export function getDifficultyLabel(difficulty: number): string {
  if (difficulty < 3) return 'Muito Fácil';
  if (difficulty < 5) return 'Fácil';
  if (difficulty < 7) return 'Médio';
  if (difficulty < 9) return 'Difícil';
  return 'Muito Difícil';
}

/**
 * Converte estado para label em português
 */
export function getStateLabel(state: CardState): string {
  const labels: Record<CardState, string> = {
    new: 'Novo',
    learning: 'Aprendendo',
    review: 'Revisão',
    relearning: 'Reaprendendo',
  };
  return labels[state];
}

