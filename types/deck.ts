export interface Deck {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  icone: string;
  criadoEm: Date;
  atualizadoEm: Date;
  totalFlashcards: number;
}

