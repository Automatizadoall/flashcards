# 📱 Guia de Responsividade

## Breakpoints Tailwind CSS

A aplicação usa os breakpoints padrão do Tailwind CSS:

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md a lg)
- **Desktop**: > 1024px (xl)

## Adaptações por Dispositivo

### 📱 Mobile (< 640px)

#### Layout
- Layout em coluna única
- Formulário aparece depois da lista (order-2)
- Grid de cards: 1 coluna
- Padding reduzido (px-4)

#### Componentes
- Títulos menores (text-2xl)
- Botões com largura total
- Ícones + emojis (sem texto)
- Cards com padding reduzido (p-4)
- Texto: base/lg

#### Modo de Estudo
- Card mínimo: 300px
- Padding do card: p-6
- Texto: xl/lg
- Botões empilhados verticalmente

### 📱 Tablet (640px - 1024px)

#### Layout
- Grid de cards: 2 colunas
- Layout ainda em coluna (formulário e lista)
- Padding intermediário (px-6)

#### Componentes
- Títulos médios (text-3xl)
- Botões com texto visível
- Grid intermediário
- Cards normais (p-6)
- Texto: lg

#### Modo de Estudo
- Card mínimo: 400px
- Padding: p-12
- Texto: 2xl/xl
- Botões em linha

### 💻 Desktop (> 1024px)

#### Layout
- Grid de cards: 2-3 colunas (xl: 3)
- Layout lado a lado (1/3 form + 2/3 lista)
- Padding completo (px-8)

#### Componentes
- Títulos grandes (text-4xl)
- Todos os textos visíveis
- Experiência completa
- Hover effects
- Texto: xl/2xl

#### Modo de Estudo
- Card mínimo: 400px
- Padding completo: p-12
- Texto: 3xl/2xl
- Botões com ícones e texto

## Classes Responsivas Importantes

### Espaçamento
```css
px-4 sm:px-6 lg:px-8        /* Padding horizontal */
py-6 sm:py-8                 /* Padding vertical */
gap-4 sm:gap-6               /* Gap no grid */
space-y-3 sm:space-y-4       /* Espaçamento vertical */
```

### Tipografia
```css
text-2xl sm:text-3xl md:text-4xl    /* Títulos */
text-base sm:text-lg                /* Corpo de texto */
text-xs sm:text-sm                  /* Texto pequeno */
```

### Layout
```css
grid-cols-1 sm:grid-cols-2 xl:grid-cols-3   /* Grid responsivo */
flex-col sm:flex-row                         /* Direção do flex */
w-full sm:w-auto                             /* Largura */
```

### Componentes
```css
min-h-[180px] sm:min-h-[200px]     /* Altura mínima */
p-4 sm:p-6                          /* Padding */
h-3 w-3 sm:h-4 sm:w-4              /* Tamanho de ícones */
```

### Visibilidade
```css
hidden sm:inline                    /* Mostra apenas em telas maiores */
sm:hidden                          /* Esconde em telas maiores */
```

## Testando Responsividade

### Chrome DevTools
1. Abra o DevTools (F12)
2. Clique no ícone de dispositivo móvel (Ctrl+Shift+M)
3. Teste diferentes dispositivos:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad Mini (768px)
   - iPad Air (820px)
   - Desktop (1280px+)

### Breakpoints para Testar
- **320px**: iPhone SE (menor)
- **375px**: iPhone 8/X
- **390px**: iPhone 12/13/14
- **414px**: iPhone Plus
- **768px**: iPad Mini
- **820px**: iPad Air
- **1024px**: iPad Pro
- **1280px**: Desktop pequeno
- **1920px**: Desktop grande

## Boas Práticas Implementadas

### Touch Targets
- Botões com tamanho mínimo de 44x44px
- Espaçamento adequado entre elementos clicáveis
- Áreas de toque generosas nos cards

### Performance
- Uso de classes Tailwind (CSS otimizado)
- Sem imagens pesadas
- Animações CSS nativas
- LocalStorage para persistência

### Acessibilidade
- Contraste adequado de cores
- Textos legíveis em todos os tamanhos
- Botões com labels claros
- Feedback visual para interações

### UX Mobile
- Formulário acessível com teclado virtual
- Cards fáceis de tocar
- Navegação clara
- Feedback imediato (toasts)
- Sem hover states em mobile

## Problemas Comuns e Soluções

### Texto Cortado
✅ Solução: `break-words` nos textos longos

### Botões Pequenos em Mobile
✅ Solução: `w-full sm:w-auto` para botões

### Cards Muito Altos
✅ Solução: `min-h-[180px] sm:min-h-[200px]`

### Scroll Horizontal
✅ Solução: `overflow-hidden` no container principal

### Touch não Funciona
✅ Solução: Evitar `:hover` puro, usar `onClick`

## Meta Tags Importantes

Já implementadas no `layout.tsx`:
```typescript
viewport: "width=device-width, initial-scale=1, maximum-scale=5"
```

Isso garante:
- Largura correta em dispositivos móveis
- Zoom inicial adequado
- Permite zoom até 5x (acessibilidade)

