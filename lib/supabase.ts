import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface FlashcardDB {
  id: string
  frente: string
  resposta: string
  comentario?: string
  dicas?: string
  categoria?: string
  nivel?: string
  criado_em: string
  atualizado_em: string
  total_revisoes: number
  total_acertos: number
  total_erros: number
  ultima_revisao?: string
  facilidade: number
}

export interface FlashcardReview {
  id: string
  flashcard_id: string
  acertou: boolean
  tempo_resposta?: number
  revisado_em: string
}

