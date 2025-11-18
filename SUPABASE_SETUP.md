# 🚀 Configuração do Supabase

## ✅ O que foi implementado

### 📊 Banco de Dados

Foram criadas **2 tabelas** no Supabase:

#### 1. **flashcards**
Armazena todos os flashcards com:
- `id` - UUID único
- `frente` - Pergunta/conceito
- `resposta` - Resposta
- `comentario` - Explicação detalhada (opcional)
- `dicas` - Dicas de memorização (opcional)
- `categoria` - Categoria do flashcard (opcional)
- `nivel` - Nível de dificuldade (opcional)
- `criado_em` - Data de criação
- `atualizado_em` - Data de última atualização
- `total_revisoes` - Total de vezes que foi revisado
- `total_acertos` - Quantas vezes acertou
- `total_erros` - Quantas vezes errou
- `ultima_revisao` - Data da última revisão
- `facilidade` - Fator de facilidade (1.3 a 5.0) para repetição espaçada

#### 2. **flashcard_reviews**
Histórico de todas as revisões:
- `id` - UUID único
- `flashcard_id` - Referência ao flashcard
- `acertou` - Boolean (true = acertou, false = errou)
- `tempo_resposta` - Tempo em segundos para responder
- `revisado_em` - Data e hora da revisão

### 🎯 Novos Recursos

#### Botões "Errou" e "Acertou"
- **Localização**: Modo de Estudo
- **Funcionamento**:
  1. Vire o card para ver a resposta
  2. Aparecem 2 botões: **"Errou"** (vermelho) e **"Acertou"** (verde)
  3. Ao clicar, registra a resposta no banco de dados
  4. Avança automaticamente para o próximo card

#### Sistema de Estatísticas
Cada flashcard agora mostra:
- **Taxa de acerto** em porcentagem
- **Contador de acertos/revisões**: Ex: "75% (9/12)"
- **Cores indicativas**:
  - 🟢 Verde: ≥ 70% de acerto
  - 🟡 Amarelo: 40-69% de acerto
  - 🔴 Vermelho: < 40% de acerto

#### Algoritmo de Facilidade
- **Acertou**: Facilidade aumenta (+0.1)
- **Errou**: Facilidade diminui (-0.2)
- Range: 1.3 (muito difícil) a 5.0 (muito fácil)
- Base para implementar repetição espaçada no futuro

### 🔧 Arquivos Criados/Modificados

#### Novos Arquivos:
- `lib/supabase.ts` - Cliente do Supabase
- `lib/supabase-storage.ts` - Funções de acesso ao banco
- `SUPABASE_SETUP.md` - Este arquivo

#### Modificados:
- `types/flashcard.ts` - Adicionados campos de estatísticas
- `components/study-mode.tsx` - Botões Errou/Acertou + timing
- `components/flashcard-item.tsx` - Exibição de estatísticas
- `components/flashcard-form.tsx` - Integração com Supabase
- `components/edit-flashcard-dialog.tsx` - Integração com Supabase
- `app/page.tsx` - Inicialização e carregamento do Supabase
- `next.config.js` - Variáveis de ambiente
- `package.json` - Adicionado @supabase/supabase-js

## 🌐 Configuração

### Variáveis de Ambiente

As credenciais do Supabase já estão configuradas em `next.config.js`:

```javascript
NEXT_PUBLIC_SUPABASE_URL=https://muvuyhozuctnbodknzeh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**Nota**: Em produção, mova essas variáveis para `.env.local` por segurança.

### Inicialização Automática

Na primeira execução, a aplicação:
1. Verifica se existem flashcards no banco
2. Se vazio, insere os **60+ flashcards iniciais** de Anatomia e Fisiologia
3. Carrega todos os flashcards do Supabase

## 📈 Como Usar

### Modo de Estudo com Rastreamento

1. Clique em **"Iniciar Modo de Estudo"**
2. Leia a **FRENTE** (pergunta)
3. Tente responder mentalmente
4. Clique no card para revelar a **RESPOSTA**
5. Avalie se acertou:
   - 👎 **Errou**: Clique no botão vermelho
   - 👍 **Acertou**: Clique no botão verde
6. O sistema registra automaticamente:
   - Sua resposta (acerto/erro)
   - Tempo que levou para responder
   - Atualiza as estatísticas do flashcard

### Visualizando Estatísticas

Na lista de flashcards, você verá:
- **Badge com porcentagem**: Ex: "75% (9/12)"
- Cores indicando desempenho
- Total de acertos/revisões

## 🔐 Segurança (RLS)

Row Level Security (RLS) está **habilitado** nas tabelas com políticas públicas:
- **Leitura**: Permitida para todos
- **Inserção**: Permitida para todos
- **Atualização**: Permitida para todos
- **Exclusão**: Permitida para todos

**Para Produção**: Recomenda-se adicionar autenticação e restringir as políticas por usuário.

## 📊 Dados Iniciais

São carregados automaticamente **60+ flashcards** de:
- Sistema Reprodutor Masculino e Feminino
- Sistema Renal e Urinário
- 3 níveis de complexidade
- Com comentários e dicas

## 🚀 Próximos Passos Possíveis

1. **Autenticação de Usuários**
   - Implementar Supabase Auth
   - Flashcards privados por usuário

2. **Repetição Espaçada (SRS)**
   - Usar o campo `facilidade` para calcular próxima revisão
   - Algoritmo SM-2 ou similar

3. **Dashboard de Estatísticas**
   - Gráficos de progresso
   - Cards mais difíceis
   - Histórico de estudos

4. **Compartilhamento**
   - Compartilhar decks entre usuários
   - Decks públicos/privados

5. **Modo Offline**
   - Cache local com Supabase Realtime
   - Sincronização automática

## 🐛 Troubleshooting

### Erro de conexão com Supabase
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo

### Flashcards não aparecem
- Abra o console do navegador (F12)
- Verifique erros de rede
- Tente limpar o cache: `Ctrl + Shift + R`

### Botões Errou/Acertou não funcionam
- Certifique-se de que virou o card primeiro
- Verifique a conexão com o Supabase
- Veja mensagens de erro no console

## 📞 Suporte

Em caso de problemas:
1. Verifique o console do navegador (F12)
2. Verifique o Supabase Dashboard para logs
3. Teste a conexão com o banco manualmente

