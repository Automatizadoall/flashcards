# 🎓 Plataforma de Flashcards

Uma plataforma moderna e intuitiva para criar e estudar flashcards, construída com Next.js 14, TypeScript e Tailwind CSS.

## ✨ Funcionalidades

### 📚 Gerenciamento de Flashcards
- **Criar Flashcards**: Adicione cartões com frente (pergunta) e verso (resposta)
- **Comentários Detalhados**: Adicione explicações aprofundadas para cada resposta
- **Dicas de Memorização**: Inclua dicas específicas para ajudar na retenção
- **Categorização**: Organize por categoria (ex: Anatomia, Fisiologia, História)
- **Níveis de Dificuldade**: Classifique por nível (Básico, Intermediário, Avançado)
- **Editar e Excluir**: Gerencie seus flashcards facilmente

### 🎯 Modo de Estudo
- **Sistema Interativo**: Cards que viram ao clicar revelando a resposta
- **Embaralhamento Automático**: Os flashcards são reorganizados a cada sessão
- **Progresso Visual**: Barra de progresso mostrando seu avanço nos estudos
- **Acesso a Dicas**: Botões para revelar dicas durante o estudo
- **Respostas Comentadas**: Visualize explicações detalhadas quando necessário
- **Navegação Intuitiva**: Avance, volte ou finalize a qualquer momento

### 💾 Dados e Interface
- **Armazenamento Local**: Seus dados são salvos no navegador
- **Flashcards Pré-carregados**: 60+ flashcards de Anatomia e Fisiologia inclusos
- **Totalmente Responsivo**: Funciona perfeitamente em mobile (📱), tablet (📱) e desktop (💻)
- **Design Moderno**: UI limpa e profissional com shadcn/ui
- **Sistema de Cores**: Dicas em amarelo, comentários em azul
- **Acessibilidade**: Interface otimizada para todos os tamanhos de tela

## 🚀 Como Usar

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Uso

#### Navegação Principal
1. **Explorar Flashcards**: Ao abrir, você terá acesso a 60+ flashcards de Anatomia e Fisiologia
2. **Ver Detalhes**: Clique nos cards para virá-los e ver respostas
3. **Acessar Extras**: Use os botões "Dicas" 💡 e "Comentário" 📝 para ver informações adicionais

#### Criar Novos Flashcards
1. Preencha o formulário com:
   - **Frente**: A pergunta ou conceito
   - **Verso**: A resposta
   - **Comentário** (opcional): Explicação detalhada
   - **Dicas** (opcional): Truques para memorizar
   - **Categoria** (opcional): Ex: Biologia, História
   - **Nível** (opcional): Ex: Básico, Avançado

#### Modo de Estudo
1. Clique em "Iniciar Modo de Estudo"
2. Os cards serão embaralhados automaticamente
3. Clique no card para revelar a resposta
4. Use "Dicas" e "Comentário" quando precisar de ajuda
5. Navegue com "Anterior" e "Próximo"
6. Finalize quando completar todos os cards

#### Gerenciamento
- **Editar**: Modifique qualquer flashcard existente
- **Excluir**: Remova flashcards que não precisa mais
- **Rastreamento**: O sistema marca quais cards você já revisou

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI modernos
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
flashcard/
├── app/
│   ├── layout.tsx                    # Layout principal + metadata
│   ├── page.tsx                      # Página inicial
│   └── globals.css                   # Estilos globais + tema
├── components/
│   ├── ui/                           # Componentes base (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── flashcard-form.tsx            # Formulário de criação
│   ├── flashcard-item.tsx            # Card individual com flip
│   ├── flashcard-list.tsx            # Grid responsivo de cards
│   ├── edit-flashcard-dialog.tsx     # Dialog de edição
│   └── study-mode.tsx                # Modo de estudo fullscreen
├── lib/
│   ├── utils.ts                      # Utilitários (cn, etc)
│   ├── storage.ts                    # CRUD localStorage
│   └── initial-data.ts               # 60+ flashcards iniciais
└── types/
    └── flashcard.ts                  # Interface TypeScript
```

## 🎨 Características de Design

### Responsividade
- **Mobile (< 640px)**: Layout em coluna única, botões com ícones, texto otimizado
- **Tablet (640px - 1024px)**: Grid 2 colunas, elementos intermediários
- **Desktop (> 1024px)**: Grid 3 colunas, experiência completa

### Visual
- Layout em grid totalmente responsivo
- Animações suaves de flip 3D nos cards
- Gradientes modernos (azul/índigo)
- Sistema de cores temático:
  - 💛 Amarelo para dicas
  - 💙 Azul para comentários
  - 🔴 Vermelho para ações destrutivas
- Feedback visual através de toasts
- Tags coloridas para categorias e níveis
- Interface intuitiva e acessível

### UX
- Cards com altura mínima adaptável
- Texto com quebra de linha automática
- Botões responsivos com ícones/texto
- Espaçamento otimizado por dispositivo
- Toque/clique otimizado para todas as plataformas

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm start` - Inicia servidor de produção
- `npm run lint` - Executa o linter

## 🔒 Armazenamento de Dados

Os flashcards são salvos no `localStorage` do navegador, garantindo que seus dados persistam entre sessões sem necessidade de banco de dados.

## 📊 Conteúdo Incluído

A plataforma vem pré-carregada com **60+ flashcards** de Anatomia e Fisiologia, organizados em:

### Nível 1: Conceitos Fundamentais
- Sistema Reprodutor Masculino (6 cards)
- Sistema Reprodutor Feminino (6 cards)
- Sistema Renal e Urinário (8 cards)

### Nível 2: Fisiologia e Detalhes
- Fisiologia Reprodutiva Feminina (6 cards)
- Fisiologia Reprodutiva Masculina (5 cards)
- Fisiologia Renal (7 cards)

### Nível 3: Regulação Fina e Bioquímica
- Regulação Hormonal (7 cards)
- Sistema Renina-Angiotensina (7 cards)
- Mecanismos Avançados (8 cards)

Cada flashcard inclui:
- ✅ Pergunta clara e objetiva
- ✅ Resposta concisa
- ✅ Comentário explicativo detalhado
- ✅ Dicas de memorização
- ✅ Categoria e nível

## 🌟 Próximas Melhorias Possíveis

- ⭐ Estatísticas de estudo (cards mais difíceis, taxa de acerto)
- ⭐ Algoritmo de repetição espaçada (Spaced Repetition System - SRS)
- ⭐ Importar/Exportar flashcards (JSON, CSV)
- ⭐ Modo escuro completo
- ⭐ Compartilhamento de decks entre usuários
- ⭐ Sincronização em nuvem (Supabase, Firebase)
- ⭐ Áudio text-to-speech para perguntas/respostas
- ⭐ Pesquisa e filtros avançados
- ⭐ Múltiplos decks/coleções
- ⭐ Gamificação (pontos, conquistas, streaks)

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

