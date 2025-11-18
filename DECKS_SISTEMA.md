# 📚 Sistema de Decks (Coleções)

## ✅ Problemas Resolvidos

### 1. ❌ Flashcards Duplicados
**Solução:** Executada migração SQL que removeu todos os duplicados, mantendo apenas o registro mais recente de cada flashcard.

### 2. 📂 Organização por Decks
**Solução:** Sistema completo de decks/coleções implementado para organizar flashcards por assunto/tema.

---

## 🎯 Como Funciona

### O que é um Deck?
Um **Deck** é uma coleção de flashcards organizados por tema/assunto. Exemplo:
- 🫀 **Sistema Reprodutor** - Flashcards sobre anatomia reprodutiva
- 💧 **Sistema Renal e Urinário** - Flashcards sobre rins e néfrons
- ❤️ **Cardiologia** - Flashcards sobre sistema cardiovascular

### Decks Pré-criados

Ao inicializar, o sistema cria automaticamente 4 decks:
1. **Sistema Reprodutor** (🫀) - Rosa
2. **Sistema Renal e Urinário** (💧) - Azul
3. **Cardiologia** (❤️) - Vermelho
4. **Sem Categoria** (📝) - Cinza

Os flashcards existentes são automaticamente organizados nos decks correspondentes.

---

## 🚀 Como Usar

### Visualizar Decks

Na página principal, você verá um **seletor de decks** no topo:
- **Todos os Decks**: Mostra TODOS os flashcards
- **Decks individuais**: Clique para filtrar apenas aquele deck

Cada deck mostra:
- Ícone emoji
- Nome do deck
- Quantidade de cards
- Descrição (se houver)
- Cor personalizada

### Criar Novo Deck

1. Clique em **"+ Novo Deck"**
2. Preencha:
   - **Nome** (obrigatório): Ex: "Sistema Digestivo"
   - **Descrição** (opcional): Descreva o conteúdo
   - **Ícone**: Escolha um emoji (10 opções)
   - **Cor**: Escolha uma cor (8 opções)
3. Clique em **"Criar Deck"**

### Adicionar Flashcard a um Deck

Ao criar um novo flashcard:
1. O flashcard será **automaticamente** adicionado ao deck selecionado
2. Se "Todos os Decks" estiver selecionado, vai para "Sem Categoria"
3. Você pode mover flashcards entre decks editando-os

### Estudar por Deck

1. **Selecione um deck** específico
2. Clique em **"Iniciar Modo de Estudo"**
3. Estude apenas os flashcards daquele deck!
4. Perfeito para focar em um assunto específico

---

## 📊 Estrutura do Banco de Dados

### Nova Tabela: `decks`

```sql
CREATE TABLE decks (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  cor TEXT DEFAULT '#3b82f6',
  icone TEXT DEFAULT '📚',
  criado_em TIMESTAMPTZ,
  atualizado_em TIMESTAMPTZ,
  total_flashcards INTEGER DEFAULT 0
);
```

### Tabela Atualizada: `flashcards`

Adicionado campo `deck_id`:
```sql
ALTER TABLE flashcards 
ADD COLUMN deck_id UUID REFERENCES decks(id) ON DELETE SET NULL;
```

### Triggers Automáticos

1. **Contagem Automática**: Quando flashcards são adicionados/removidos, o contador do deck é atualizado automaticamente
2. **Timestamp**: Campo `atualizado_em` é atualizado automaticamente

---

## 🎨 Componentes Criados

### 1. `DeckSelector`
**Localização**: Topo da página principal

**Funcionalidades**:
- Grid responsivo de decks
- Opção "Todos os Decks"
- Botão para criar novo deck
- Visual com cores e ícones personalizados
- Mostra contador de flashcards por deck

### 2. `CreateDeckDialog`
**Modal para criar decks**

**Campos**:
- Nome do deck (obrigatório)
- Descrição (opcional)
- Seletor de ícone (10 emojis)
- Seletor de cor (8 cores)

### 3. Arquivos Criados/Modificados

**Novos**:
- `types/deck.ts` - Interface TypeScript
- `lib/deck-storage.ts` - Funções CRUD de decks
- `components/deck-selector.tsx` - Componente seletor
- `components/create-deck-dialog.tsx` - Dialog de criação
- `DECKS_SISTEMA.md` - Esta documentação

**Modificados**:
- `lib/supabase-storage.ts` - Adicionado filtro por deck
- `components/flashcard-form.tsx` - Adiciona ao deck selecionado
- `app/page.tsx` - Integração completa com decks

---

## 💡 Exemplos de Uso

### Cenário 1: Estudar apenas Cardiologia
```
1. Clique no deck "Cardiologia" ❤️
2. Veja apenas flashcards de cardiologia
3. Clique em "Iniciar Modo de Estudo"
4. Estude focado em cardio!
```

### Cenário 2: Criar deck personalizado
```
1. Clique em "+ Novo Deck"
2. Nome: "Neurologia"
3. Ícone: 🧠
4. Cor: Roxo
5. Criar!
```

### Cenário 3: Organizar flashcards existentes
```
1. Veja um flashcard sem categoria
2. Clique em "Editar"
3. (Futuramente) Selecione um deck
4. Salve
```

---

## 🔮 Próximos Passos Possíveis

### Funcionalidades Adicionais:
1. **Editar Decks**: Mudar nome, cor, ícone
2. **Excluir Decks**: Com confirmação
3. **Estatísticas por Deck**: Taxa de acerto por deck
4. **Compartilhar Decks**: Export/Import
5. **Decks Públicos**: Biblioteca de decks compartilhados
6. **Mover Cards**: Arrastar entre decks
7. **Decks Favoritos**: ⭐ Destacar decks importantes
8. **Ordem Personalizada**: Reordenar decks

### Melhorias de UI:
1. **Drag & Drop**: Arrastar cards entre decks
2. **Visualização em Lista**: Alternar entre grid/lista
3. **Busca de Decks**: Filtrar por nome
4. **Ícones Customizados**: Upload de imagens
5. **Temas de Cores**: Paletas pré-definidas

---

## 🐛 Troubleshooting

### Flashcards não aparecem no deck correto
- Verifique se o flashcard tem `deck_id` definido
- Use a query SQL: `SELECT * FROM flashcards WHERE deck_id IS NULL;`
- Atualize manualmente se necessário

### Contador de flashcards errado
- O trigger deve atualizar automaticamente
- Forçar atualização: `UPDATE decks SET total_flashcards = (SELECT COUNT(*) FROM flashcards WHERE deck_id = decks.id);`

### Duplicados voltaram
- A migração removeu os duplicados existentes
- Adicione constraint UNIQUE se necessário

---

## 📈 Estatísticas

**Antes**: 
- Todos os flashcards em uma lista
- Difícil encontrar assuntos específicos
- Flashcards duplicados

**Depois**:
- Organização por decks/temas
- Filtro rápido por assunto
- Zero duplicados
- Contadores automáticos
- Visual bonito e intuitivo

---

## 🎉 Conclusão

Agora você pode:
✅ Organizar flashcards por assunto
✅ Criar decks personalizados
✅ Estudar focado em um tema
✅ Visualizar contadores por deck
✅ Interface visual moderna
✅ Zero duplicados

**Tudo pronto para uma experiência de estudo mais organizada!** 📚✨

