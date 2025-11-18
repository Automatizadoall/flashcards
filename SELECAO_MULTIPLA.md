# ✅ Seleção Múltipla de Decks

## 🎯 Nova Funcionalidade Implementada

Agora você pode **selecionar múltiplos decks** para estudar ao mesmo tempo! 

### Por que isso é útil?
- Estude **combinações de assuntos**: Cardiologia + Sistema Urinário
- Revise **múltiplos temas** em uma sessão
- Foque em áreas específicas sem perder a visão do conjunto
- Flexibilidade total na organização dos estudos

---

## 🚀 Como Usar

### 1. Selecionar Múltiplos Decks

**Modo Checkbox**: Cada deck agora tem um checkbox no canto superior direito

```
1. Clique em qualquer deck para selecioná-lo ✅
2. Clique novamente para desmarcar ☐
3. Selecione quantos decks quiser!
```

**Exemplo de uso**:
- Clique em "Sistema Reprodutor" 🫀
- Clique em "Sistema Urinário" 💧
- Agora você vê flashcards dos DOIS sistemas juntos!

### 2. Botões Rápidos

#### Selecionar Todos
- Clique em **"Selecionar Todos"** para marcar todos os decks de uma vez
- Perfeito para revisão geral

#### Desmarcar Todos
- Clique em **"Desmarcar Todos"** para limpar a seleção
- Começa do zero

### 3. Contador Inteligente

No topo, você verá um badge mostrando:
```
2 selecionados · 45 cards
```
- **Quantos decks** estão selecionados
- **Quantos flashcards** no total

### 4. Modo de Estudo com Seleção

```
1. Selecione os decks desejados
   Exemplo: Cardiologia ❤️ + Sistema Urinário 💧
2. Veja o contador: "63 cards"
3. Clique em "Iniciar Modo de Estudo (63 cards)"
4. Estude apenas aqueles flashcards!
```

---

## 🎨 Interface Visual

### Cards com Checkbox
Cada deck agora mostra:
- ✅ **CheckSquare** quando selecionado (colorido)
- ☐ **Square** quando não selecionado (cinza)
- **Borda colorida** quando selecionado (cor do deck)
- **Destaque visual** (sombra + fundo)

### Badge de Contador
Aparece ao lado do título "Decks":
- Cor primária (azul)
- Fundo suave
- Texto: `X selecionados · Y cards`
- Só aparece quando há seleção

### Botões Responsivos
- **Desktop**: Texto completo ("Selecionar Todos", "Novo Deck")
- **Mobile**: Texto curto ("Todos", apenas ícone)

### Mensagem de Ajuda
Quando nenhum deck está selecionado:
```
💡 Selecione um ou mais decks para filtrar os flashcards
```

---

## 🔧 Mudanças Técnicas

### 1. Estado Modificado

**Antes**:
```typescript
const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
```

**Depois**:
```typescript
const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
```

### 2. Componente DeckSelector Atualizado

**Props**:
```typescript
interface DeckSelectorProps {
  decks: Deck[];
  selectedDeckIds: string[];           // Array agora!
  onSelectDecks: (deckIds: string[]) => void;  // Função atualizada
  onCreateDeck: () => void;
}
```

**Novas funções**:
- `toggleDeck(deckId)` - Adiciona/remove deck da seleção
- `selectAll()` - Seleciona todos os decks
- `selectNone()` - Limpa seleção
- `isSelected(deckId)` - Verifica se deck está selecionado
- `totalSelectedCards` - Calcula total de cards selecionados

### 3. Query do Supabase Otimizada

**Antes**:
```typescript
query.eq('deck_id', deckId)  // Um único deck
```

**Depois**:
```typescript
query.in('deck_id', deckIds)  // Múltiplos decks!
```

### 4. Ícones Adicionados
```typescript
import { Plus, CheckSquare, Square } from "lucide-react";
```

---

## 📊 Exemplos de Uso Real

### Cenário 1: Estudar 2 Sistemas Juntos
```
Objetivo: Revisar sistemas circulatório e excretor

1. Clique em "Cardiologia" ❤️
2. Clique em "Sistema Urinário" 💧
3. Badge mostra: "2 selecionados · 63 cards"
4. Iniciar Modo de Estudo
5. Flashcards dos dois sistemas aparecem mesclados
```

### Cenário 2: Revisão Geral
```
Objetivo: Estudar tudo antes da prova

1. Clique em "Selecionar Todos"
2. Badge mostra: "4 selecionados · 150 cards"
3. Iniciar Modo de Estudo
4. Revise todos os flashcards!
```

### Cenário 3: Foco em Um Único Deck
```
Objetivo: Dominar apenas um assunto

1. Clique em "Cardiologia" ❤️
2. Badge mostra: "1 selecionado · 30 cards"
3. Iniciar Modo de Estudo
4. Estude focado!
```

### Cenário 4: Adicionar Novo Card a Deck Específico
```
Objetivo: Criar flashcard para deck específico

1. Selecione APENAS um deck
2. O formulário adiciona o card automaticamente àquele deck
3. Se múltiplos decks selecionados, vai para o primeiro
```

---

## 🎯 Comportamentos Especiais

### Quando Nenhum Deck Selecionado
- Mostra **TODOS** os flashcards (sem filtro)
- Mensagem de ajuda aparece: "💡 Selecione um ou mais decks..."
- Botão de estudo fica **desabilitado** se não houver cards

### Quando Um Deck Selecionado
- Mostra apenas aquele deck
- Novos flashcards vão para aquele deck automaticamente

### Quando Múltiplos Decks Selecionados
- Mostra flashcards de **todos** os decks selecionados
- Novos flashcards vão para o **primeiro** deck selecionado
- Contador mostra total combinado

### Botão de Estudo Inteligente
- **Habilitado**: Quando há flashcards para estudar
- **Desabilitado**: Quando não há flashcards (seleção vazia)
- Mostra quantidade exata de cards disponíveis

---

## 🔮 Possíveis Melhorias Futuras

1. **Salvar Seleção**: Lembrar última seleção no localStorage
2. **Grupos de Decks**: Criar grupos pré-definidos de decks
3. **Atalhos**: Ctrl+A para selecionar todos, Ctrl+D para desmarcar
4. **Arrastar Seleção**: Click and drag para selecionar vários
5. **Filtros Avançados**: Combinar decks com outros filtros (nível, categoria)
6. **Visualização de Distribuição**: Gráfico mostrando quantos cards de cada deck selecionado
7. **Estudo Proporcional**: Algoritmo que balanceia cards entre decks selecionados
8. **Histórico de Seleções**: Ver quais combinações você mais usa

---

## 🐛 Troubleshooting

### Flashcards não aparecem após seleção
- Verifique se os flashcards têm `deck_id` correto no banco
- Tente "Desmarcar Todos" e selecionar novamente
- Verifique o console do navegador por erros

### Contador mostra número errado
- O contador é calculado em tempo real do campo `total_flashcards`
- Triggers do Supabase atualizam automaticamente
- Se estiver errado, o trigger pode ter falhado

### Botão de estudo desabilitado
- Certifique-se de que os decks selecionados têm flashcards
- Verifique se a query está filtrando corretamente

---

## ✅ Checklist de Funcionalidades

- [x] Seleção múltipla com checkbox visual
- [x] Contador de decks selecionados
- [x] Contador total de flashcards
- [x] Botão "Selecionar Todos"
- [x] Botão "Desmarcar Todos"
- [x] Query otimizada com `.in()`
- [x] Visual destacado para decks selecionados
- [x] Responsivo (mobile + desktop)
- [x] Mensagem de ajuda quando vazio
- [x] Botão de estudo desabilitado quando apropriado
- [x] Integração completa com modo de estudo

---

## 📈 Comparação: Antes vs Depois

### Antes ❌
```
- Selecionar APENAS 1 deck por vez
- Ver apenas 1 assunto
- Trocar manualmente entre decks
- Estudar assuntos isolados
```

### Depois ✅
```
- Selecionar QUANTOS decks quiser
- Ver múltiplos assuntos juntos
- Combinar livremente
- Estudar de forma integrada
- Flexibilidade total
```

---

## 🎉 Conclusão

Agora você tem **controle total** sobre o que estudar:

✅ **1 deck**: Foco profundo em um assunto  
✅ **2-3 decks**: Combinações específicas  
✅ **Todos os decks**: Revisão geral  
✅ **Nenhum deck**: Ver tudo sem filtro  

**Flexibilidade máxima para seu estudo!** 📚✨

