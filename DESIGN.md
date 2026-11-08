---
name: WATCHFIRST Admin
description: Central de controle do WATCHFIRST — fundo azul-negro, um só acento verde, dados em Figtree com numerais tabulares.
colors:
  bg: "#080c10"
  rail: "#0c141a"
  panel: "#0f181f"
  raised: "#142028"
  line: "rgba(255, 255, 255, 0.07)"
  line-strong: "rgba(255, 255, 255, 0.14)"
  fg: "#f2f6f4"
  fg-muted: "#9baab7"
  fg-dim: "#71808c"
  accent: "#39ff14"
  accent-soft: "#b8f5a8"
  accent-ink: "#071108"
  accent-dim: "rgba(57, 255, 20, 0.12)"
  amber: "#ffc857"
  amber-dim: "rgba(255, 200, 87, 0.14)"
  red: "#ff6b7a"
  red-dim: "rgba(255, 107, 122, 0.14)"
  blue: "#6cb8ff"
  blue-dim: "rgba(108, 184, 255, 0.14)"
typography:
  page-title:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  stat-value:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "28px"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tnum"
  code:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.06em"
    fontFeature: "tnum"
  dialog-title:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.25
  section-title:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum, cv05"
  body-dense:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  meta:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.4
  chip:
    fontFamily: "Figtree, system-ui, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11.5px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.025em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  button-secondary:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "#19262f"
    textColor: "{colors.fg}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fg-muted}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-ghost-hover:
    backgroundColor: "rgba(255, 255, 255, 0.06)"
    textColor: "{colors.fg}"
  button-danger:
    backgroundColor: "{colors.red-dim}"
    textColor: "{colors.red}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-danger-solid:
    backgroundColor: "{colors.red}"
    textColor: "#2a0b10"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "40px"
  button-sm:
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "32px"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
  badge-neutral:
    backgroundColor: "rgba(255, 255, 255, 0.06)"
    textColor: "{colors.fg-muted}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
  badge-accent:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.accent-soft}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
  badge-amber:
    backgroundColor: "{colors.amber-dim}"
    textColor: "{colors.amber}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
  badge-red:
    backgroundColor: "{colors.red-dim}"
    textColor: "{colors.red}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
  badge-blue:
    backgroundColor: "{colors.blue-dim}"
    textColor: "{colors.blue}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
  chip-plan-basic:
    backgroundColor: "transparent"
    textColor: "{colors.fg-muted}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
    typography: "{typography.chip}"
  chip-plan-max:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.sm}"
    padding: "0 8px"
    height: "24px"
    typography: "{typography.chip}"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.fg-muted}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "40px"
    typography: "{typography.body}"
  nav-item-active:
    backgroundColor: "{colors.accent-dim}"
    textColor: "{colors.fg}"
  nav-badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "0 6px"
    height: "20px"
    typography: "{typography.chip}"
  stat-tile:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "14px 16px"
  stat-tile-active:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "14px 20px"
  dialog:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "24px"
  menu:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    padding: "4px"
  ticket:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: "20px 24px 24px"
---

# Design System: WATCHFIRST Admin

Documento escrito a partir do build entregue (`src/index.css`, `src/components/ui/*.tsx`, `src/app/Layout.tsx`, telas em `src/features/**`) e das capturas em `.impeccable/review/`. Onde o contrato de direção e o código divergem, vale o código; as divergências estão anotadas. Prosa em pt-BR, identificadores em inglês como aparecem no código.

## Overview

**Creative North Star: "A sala de controle para quem espera do outro lado"**

O painel é um instrumento, não uma vitrine. Cada tela parte de uma pergunta operacional (alguém está esperando? quem vence esta semana? quem fez isso?) e responde com números que são filtros clicáveis, listas densas e uma única ação primária por tela. Não há métrica-herói: o `StatTile` é um atalho para a lista abaixo, nunca um troféu. A densidade é de ferramenta de trabalho (corpo em 14px, tabelas em 13.5px), lida em PC Windows primeiro e no celular em segundo, sempre em tema escuro.

O material é um azul-negro em três degraus (`bg` → `rail`/`panel` → `raised`) separado por fios de 7% e 14% de branco, com um único acento, o verde `#39FF14` da marca, reservado para quatro papéis: a ação primária, o item de navegação atual, seleção/foco e o indicador "ao vivo" (badge de pendentes, `live-dot`). Texto pequeno acentuado usa o tom suave `#B8F5A8`; links herdam esse tom. Âmbar, vermelho e azul só aparecem onde existe estado (vence em breve, bloqueado/erro, vitalício/informação). Uma só família tipográfica, Figtree, auto-hospedada em peso variável 300–900, com numerais tabulares ligados no `body` para que colunas de datas, contagens e códigos se alinhem.

O único momento de assinatura é o "ingresso": a revelação, uma vez só, de um código de acesso ou senha temporária, apresentada como um bilhete de cinema perfurado (`.ticket`), com o código em 30px tabular, linha de corte tracejada com dois recortes circulares, aviso em âmbar e ações Copiar / WhatsApp. Todo o resto do painel adota padrões conhecidos de administração: barra lateral de 240px, linha de título com ações à direita, quatro estatísticas, tabela que vira cartões no celular.

**Key Characteristics:**
- Fundos azul-negros em três degraus, sem gradientes; profundidade por tom e por fio, sombra só em camadas flutuantes.
- Um acento verde, racionado: ação primária, nav atual, seleção, "ao vivo". Nunca texto corrido.
- Uma família (Figtree), escala fixa em px (11.5 → 30), `tnum` ligado globalmente.
- Números são filtros: todo `StatTile` com `onClick` troca a lista abaixo e marca `aria-pressed`.
- Toda ação destrutiva passa por `ConfirmDialog` com a consequência escrita; exclusões exigem digitar o nome.
- Controles que a pessoa não pode usar não são renderizados (`useCan`), e o servidor recusa também.
- Sem olho/kicker acima de títulos; o único texto em caixa alta é rótulo de grupo ou chip de plano.

## Colors

Uma paleta de fundo azul-negro com um acento verde elétrico e três cores de estado em versão plena e em versão "dim" (translúcida, para fundos de chips e botões).

### Primary
- **Verde WATCHFIRST** (`accent`, #39ff14): superfície do botão primário, do chip MAX, do badge de pendentes na barra lateral, do `live-dot`, da borda do `StatTile` ativo, do thumb/track do `Switch` ligado, do anel de foco (`:focus-visible` 2px) e do cursor de texto. Também o `FIRST` do logotipo. Nunca como cor de texto corrido.
- **Tinta sobre verde** (`accent-ink`, #071108): o texto preto-esverdeado em cima do acento (botão primário, chip MAX, badge de contagem). Contraste alto sem usar preto puro.
- **Verde suave** (`accent-soft`, #b8f5a8): texto pequeno acentuado — links (`a`), texto do badge "Ativo"/"Aceita", iniciais do avatar na barra lateral. É o verde legível em corpo pequeno.
- **Verde a 12%** (`accent-dim`, rgba(57,255,20,0.12)): fundo do item de navegação atual e dos badges de tom `accent`. Deixa o verde presente sem acender a tela.

### Neutral
- **Página** (`bg`, #080c10): fundo do `html`/`body` e dos campos de formulário (`Input`, `Select`, `Textarea` ficam um degrau mais fundos que o painel onde estão).
- **Trilho** (`rail`, #0c141a): barra lateral e barra superior no celular (a 95% com `backdrop-blur-sm`).
- **Painel** (`panel`, #0f181f): cartões, `Panel`, `Table`, `StatTile`, `DialogContent`, cartão de login, recortes do ingresso.
- **Elevado** (`raised`, #142028): `DropdownContent`, `Tooltip`, botão secundário, `StatTile` ativo/hover, ícone do `EmptyState`, avatar, o próprio `.ticket`. O contrato de direção previa #111B22; o build assentou em #142028 e este é o valor normativo.
- **Fio** (`line`, 7% branco): divisórias de tabela, bordas de `Panel`/`Table`/`StatTile` em repouso, separadores de menu, borda do trilho.
- **Fio forte** (`line-strong`, 14% branco): bordas de controles (`Input`, botão secundário, `Badge`, chip BÁSICO), diálogos, menus, tooltips, `.ticket`, cartão de login; hover de `StatTile`.
- **Texto** (`fg`, #f2f6f4): texto principal, títulos, valores.
- **Texto atenuado** (`fg-muted`, #9baab7): descrições, rótulos de campo, botão ghost em repouso, nav em repouso, rótulo do `StatTile`.
- **Texto apagado** (`fg-dim`, #71808c): metadados (e-mail, "visto há 5 horas", cabeçalho de tabela), placeholders, ícones de nav em repouso, legenda "CENTRAL DE CONTROLE".

### Tertiary (estado)
- **Âmbar** (`amber`, #ffc857; `amber-dim` a 14%): "vence em 7 dias", contagem regressiva com menos de 5 minutos, aviso do ingresso ("Guarde agora…"), borda de pedido urgente (`rgba(255,200,87,0.4)`).
- **Vermelho** (`red`, #ff6b7a; `red-dim` a 14%): bloqueado, vencido, rejeitado, erro de campo (`aria-invalid`), item de menu perigoso, botões `danger` e `danger-solid` (texto #2a0b10 sobre o vermelho pleno).
- **Azul** (`blue`, #6cb8ff; `blue-dim` a 14%): vitalício e informação neutra. Nenhum outro uso no build.

### Named Rules
**The One Accent Rule.** O verde `#39FF14` aparece em superfície (botão primário, chip MAX, badge de contagem, `live-dot`, borda ativa, anel de foco) e nunca como cor de texto corrido; texto acentuado pequeno usa `accent-soft`. Teste: se um trecho de texto com mais de uma palavra está em `text-accent`, é defeito.

**The State Earns Colour Rule.** Âmbar, vermelho e azul só pintam elementos que carregam estado real (validade, situação, erro, informação). Um `StatTile` com zero vencimentos fica neutro; com um ou mais, vira âmbar. Nunca use cor de estado para decorar.

**The Dim Pair Rule.** Toda cor de estado vem em par: a cor plena para texto/ícone e a versão `-dim` (12–14% de alfa) para o fundo do mesmo chip ou botão, com borda a 25–30% da mesma cor. Não invente um terceiro tom.

## Typography

**Display Font:** Figtree (auto-hospedada, `font-weight: 300 900`, fallback `system-ui, 'Segoe UI', Roboto, sans-serif`)
**Body Font:** Figtree (a mesma)
**Label/Mono Font:** nenhuma distinta; códigos usam Figtree com `tabular-nums` e `letter-spacing: 0.06em`

**Character:** Uma humanista geométrica, quente o bastante para pt-BR e precisa o bastante para colunas de dados. O `body` liga `'tnum' 1, 'cv05' 1` para todo o app, então todo número alinha sem classes extras; `h1–h3` recebem `letter-spacing: -0.01em` e `text-wrap: balance` na base, e o título de página aperta para -0.02em.

### Hierarchy
Escala fixa em px, sem `clamp()`. Só o título de página muda com a viewport.

- **Page title** (600, 26px no celular / 30px a partir de `sm`, line-height 1, -0.02em): `PageHeader` h1 ("Membros", "Boa noite, Dono", nome do membro no detalhe).
- **Stat value** (600, 28px, line-height 1, tabular): o número do `StatTile`.
- **Code** (600, 30px, line-height 1.15, +0.06em, tabular): o código no `.ticket`, quebrado em grupos de 12 caracteres quando passa de 24.
- **Auth title** (600, 22px, leading-tight): h1 do cartão de login/primeiro acesso.
- **Wordmark** (800, 17px na barra lateral / 15px na barra superior / 19px no login, -0.02em): "WATCH" em `fg`, "FIRST" em `accent`.
- **Dialog title** (600, 17px, leading-tight): `DialogPrimitive.Title`.
- **Request title** (600, 16px): e-mail do pedido pendente.
- **Section title** (600, 15px): h2 de `Panel`, título de `EmptyState`, nome no cartão de membro móvel.
- **Body** (400, 14px, 1.5): texto padrão, item de nav (500), descrição de página, nome em listas.
- **Body dense** (400, 13.5px): corpo de `Table`, itens de menu, descrições de diálogo, linhas de atividade e histórico.
- **Label** (500, 13px): rótulo de `Field`, contagem de resultados, avisos em caixa, botão `sm`.
- **Meta** (400, 12.5px): e-mail sob o nome, dica/erro de campo, cabeçalho de `THead`, rótulo do `StatTile`, aviso do ingresso, tooltips.
- **Small meta** (400, 12px): texto de `Badge` (500), "visto há…", horário na atividade, papel sob o nome do usuário.
- **Chip / group label** (700, 11.5px, +0.025em): chips de plano BÁSICO/MAX, badge de contagem; em caixa alta e 500–600, a legenda "CENTRAL DE CONTROLE" (+0.14em), `DropdownLabel` e o separador de dia da atividade.

### Named Rules
**The No Kicker Rule.** Nenhum título recebe uma linha de texto acima dele. Caixa alta espaçada existe em três lugares apenas: a legenda sob o logotipo, rótulos de grupo em menus e separadores de dia em listas. Teste: se um `uppercase tracking-*` está imediatamente antes de um `h1`/`h2`, é defeito.

**The Tabular Everything Rule.** Datas, contagens, "1/3 dispositivos", "2:47", códigos: tudo alinha porque `tnum` vem do `body`. Nunca desligue com `proportional-nums` em dados.

**The One Family Rule.** Não introduza segunda família, nem monoespaçada para códigos: o ingresso prova que Figtree 600 tabular com +0.06em resolve.

## Layout

Casca de administração em grade de duas colunas a partir de `lg` (1024px): `grid-cols-[240px_1fr]`, com a barra lateral `sticky top-0 h-svh` em `rail`, separada por um fio `line` à direita. O conteúdo vive em `main` com `px-4` (16px) no celular, `px-6` (24px) em `sm` e `px-8` (32px) em `lg`; `pt-6`/`lg:pt-8`, `pb-16`. O miolo é limitado a `max-w-[1400px]` centrado.

Abaixo de `lg`, o trilho vira uma barra superior de 56px (`h-14`) em `rail/95` com `backdrop-blur-sm`, botão de menu à esquerda, logotipo centralizado e, à direita, o badge verde de pendentes (visível só quando há pendentes). O menu abre como gaveta de 280px vinda da esquerda (`slide-in` 220ms) com a mesma `Sidebar`.

Ritmo vertical de página: `flex-col gap-6` (24px) entre `PageHeader`, `StatRow`, filtros e lista. O `PageHeader` alinha título à esquerda e ações à direita (`sm:items-end`); no celular a ação primária vem primeiro e ocupa a largura, as secundárias ficam numa linha abaixo. O `StatRow` é `grid-cols-4` a partir de `md` (768px) e, abaixo disso, uma fileira com rolagem horizontal e `snap-mandatory`, sangrando `-mx-4` até a borda da tela, cada tile com `min-w-[168px]`. Filtros de lista ficam em coluna até `xl` (1280px), onde busca e três `Select` entram na mesma linha. A visão geral usa duas colunas `xl:grid-cols-[1.1fr_1fr]`.

Tabelas existem a partir de `md`; abaixo, cada linha vira um cartão `rounded-lg border-line bg-panel p-4` com nome, e-mail, chips e contagem de dispositivos. Diálogos são `w-[calc(100vw-32px)]` com `max-w-sm` (confirmação), `max-w-lg` (padrão) ou `max-w-2xl` (formulários). O login é um cartão de `max-w-[420px]` centrado na página.

Espaçamento interno recorrente: `Panel` cabeçalho `px-5 py-3.5` (20/14), linhas de lista `px-5 py-3`, células `px-4 py-3`, `TH` com `h-10`, `StatTile` `px-4 py-3.5`, diálogo `p-6`, cartão de login `p-6 sm:p-7`, menu `p-1` com itens `px-2.5 py-2`, nav `px-3` em trilho com `px-3`.

## Elevation & Depth

Híbrido com predominância tonal: a profundidade em repouso vem dos três degraus de fundo e dos dois pesos de fio; sombra só aparece no que flutua ou no único momento de assinatura. Superfícies dentro da página (`Panel`, `Table`, `StatTile`) são `panel` sobre `bg` com borda `line`, sem sombra. Controles e chips são `raised` ou translúcidos com borda `line-strong`. Campos de formulário descem um degrau para `bg`, lendo como cavidades.

### Shadow Vocabulary
- **Pop** (`box-shadow: 0 12px 32px -8px rgba(0,0,0,0.6), 0 2px 6px -2px rgba(0,0,0,0.5)`): `DialogContent`, `DropdownContent`, `Tooltip`, gaveta móvel, cartão de login. Marca o que está sobre a página.
- **Ticket** (`box-shadow: 0 24px 48px -16px rgba(57,255,20,0.18), 0 8px 20px -8px rgba(0,0,0,0.7)`): só o `.ticket`. Um halo verde difuso, a única sombra colorida do sistema.
- **Inset do primário** (`box-shadow: 0 0 0 1px rgba(57,255,20,0.25) inset`): borda interna do botão primário, para que o verde pleno tenha aresta.
- **Anel de foco de campo** (`0 0 0 3px rgba(57,255,20,0.18)` + `border-color: accent`): `:focus` em `Input`/`Select`/`Textarea`. Elementos genéricos usam `outline: 2px solid accent; outline-offset: 2px` via `:focus-visible`.

Sobreposições (`Overlay`) são `rgba(4,7,10,0.72)` nos diálogos e `0.7` na gaveta, com `fade-in` 180ms.

Movimento acompanha a profundidade: `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` para tudo que entra. `pop-in` 220ms (diálogo, escala 0.97→1), `pop-in-menu` 160ms (menu, -4px→0), `slide-in` 220ms (gaveta), `row-in` 220ms (linhas), `ticket-in` 420ms (ingresso, 10px e -0.6deg de rotação → repouso), `shimmer` 1.4s linear (skeleton), `pulse` 1.8s infinito (`live-dot`). Transições de estado em controles duram 150ms. `prefers-reduced-motion` zera tudo.

### Named Rules
**The Flat Inside, Lifted Above Rule.** O que pertence à página (painéis, tabelas, tiles) não tem sombra; o que se sobrepõe a ela (diálogo, menu, tooltip, gaveta) recebe `shadow-pop`. Só o ingresso tem sombra própria e colorida.

**The Hairline Rule.** Separação é fio, não sombra nem mudança brusca de fundo: `line` (7%) para divisões dentro de uma superfície, `line-strong` (14%) para o contorno de um controle ou de uma camada flutuante.

## Shapes

Cantos suavemente arredondados em três passos: `sm` 6px (badges, chips, botão `sm`, item de menu, skeleton, anel de foco), `md` 10px (botões `md`/`lg`/`icon`, campos, item de nav, menu, ícone do app no login) e `lg` 14px (painéis, tabelas, tiles, diálogos, cartões de membro, ingresso). Pílulas (`999px`) só para badge de contagem, `live-dot`, avatar, thumb do `Switch` e polegar da barra de rolagem.

Bordas de 1px em todo contorno; nenhuma superfície depende só de fundo. O ingresso é a única silhueta especial: um retângulo `lg` com uma linha de corte `1px dashed rgba(255,255,255,0.24)` e dois recortes circulares de 24px (`--notch: 12px`) preenchidos com `panel` e contornados com `line-strong`, posicionados sobre a própria linha de corte para lerem como furos no bilhete.

Ícones são Lucide, traço fino, em 16px dentro de botões e chips, 18px na navegação, 20px no `EmptyState` e nos botões da barra superior, 12px dentro de `Badge`.

## Components

Caráter geral: preciso e contido. Controles têm altura fixa, borda de 1px, raio `md`, e respondem com mudanças de 150ms em fundo/borda/brilho, nunca com deslocamento ou escala.

### Buttons
- **Shape:** cantos `md` (10px) em `md`/`lg`/`icon`; `sm` (6px) no tamanho `sm`. Alturas 32 / 40 / 48 px; ícone 36×36. Texto 13 / 14 / 15 px; ícone à esquerda com `gap` 6–8px.
- **Primary:** `accent` com texto `accent-ink` em 600, inset de 1px a 25% do verde; hover `brightness(1.1)`, active `brightness(0.95)`. Um por tela: "+ Novo membro", "Já enviei, fechar", "Entrar", "Copiar" no ingresso, aprovações no pedido pendente.
- **Secondary (padrão):** `raised` com borda `line-strong`; hover fundo #19262f e borda a 20%. Ações comuns ("Adicionar", "Tentar de novo", "WhatsApp").
- **Ghost:** texto `fg-muted` sem fundo; hover texto `fg` e fundo branco a 6%. "Atualizar", "CSV", "Cancelar", "Ver todas", botões de ícone (menu de linha, fechar).
- **Danger:** `red-dim` com texto `red` e borda a 25% do vermelho; hover fundo a 22%. "Rejeitar".
- **Danger solid:** `red` com texto #2a0b10 em 600. Só como confirmação final em `ConfirmDialog` perigoso ("Excluir membro", "Bloquear").
- **Loading / Disabled:** `loading` troca o ícone por um `Loader2` girando e marca `aria-busy`; disabled é opacidade 50% sem eventos.

### Chips
- **Badge:** 24px de altura, raio `sm`, 12px em 500, borda 1px; tons `neutral` (branco a 6%, texto `fg-muted`), `accent`, `amber`, `red`, `blue` seguindo a Dim Pair Rule. Usado para situação (Ativo / Bloqueado / Vencido), validade (relativa só quando ≤ 7 dias ou vencida; data absoluta caso contrário; "Vitalício" em azul), origem do pedido e contagem regressiva.
- **PlanChip:** identidade do plano, mesma forma em toda parte. BÁSICO: contorno `line-strong`, texto `fg-muted`. MAX: preenchido `accent`, texto `accent-ink`. Ambos 24px, 11.5px em 700, +0.025em, caixa alta por conteúdo.
- **Nav badge:** pílula verde de 20px com a contagem de pendentes em 11.5px 700 tabular, no item "Solicitações" e na barra superior móvel.

### Cards / Containers
- **Corner Style:** `lg` (14px).
- **Background:** `panel`; `raised` quando ativo (StatTile) ou flutuante.
- **Shadow Strategy:** nenhuma dentro da página; `shadow-pop` em diálogos e menus.
- **Border:** `line` em repouso; `line-strong` para diálogos, cartão de login e hover de tile; `accent` para `StatTile` ativo; âmbar a 40% para pedido urgente.
- **Internal Padding:** `Panel` cabeçalho 20/14 com fio inferior e h2 de 15px; linhas 20/12; `StatTile` 16/14; cartão de pedido `p-5`; cartão de membro móvel `p-4`.
- **StatTile:** rótulo 12.5px `fg-muted`, valor 28px 600 tabular (cor por tom), dica 12px `fg-dim`. Quando clicável, hover eleva para `raised` com `line-strong`; ativo recebe borda `accent` e `aria-pressed`. Carregando, o valor vira um `skeleton` de 28×48.
- **Table:** contêiner `lg` com `line` e `panel`; `THead` em branco a 3% com 12.5px `fg-dim` e `TH` de 40px em 600 (ordenável com setas de 12px); linhas com fio `line` entre si e hover branco a 3.5% quando clicáveis; entrada com `row-in`.

### Inputs / Fields
- **Style:** fundo `bg` (um degrau abaixo do painel), borda `line-strong`, raio `md`, 40px de altura, `px-3`, placeholder `fg-dim`; `Textarea` `min-h-24` redimensionável; `Select` nativo com chevron de 16px à direita e opções em `raised`.
- **Hover / Focus:** hover borda a 22%; foco borda `accent` + anel `0 0 0 3px rgba(57,255,20,0.18)`, sem outline.
- **Error / Disabled:** `aria-invalid` pinta a borda de `red` e o `Field` mostra o erro em 12.5px `red` abaixo; dica normal em 12.5px `fg-dim`. Rótulo 13px 500 `fg-muted` acima (ou ao lado com `inline`). Disabled a 50% com `cursor-not-allowed`.
- **Switch:** 40×24 pílula, borda `line-strong` sobre branco a 8%; ligado vira `accent` com thumb `accent-ink`.

### Navigation
- **Style:** barra lateral `rail` de 240px: logotipo (17px 800) e legenda "CENTRAL DE CONTROLE" (11.5px, +0.14em, `fg-dim`) no topo com `px-5`; lista com `gap-0.5`; chip de usuário no rodapé separado por fio, com avatar de 32px (`raised`, iniciais em `accent-soft`, anel `line-strong`), nome 13.5px 500 e papel 12px `fg-dim`, abrindo um menu "Minha conta / Sair".
- **Item:** 40px, raio `md`, `px-3`, 14px 500, ícone 18px. Repouso: texto `fg-muted`, ícone `fg-dim`. Hover: fundo branco a 5%, texto `fg`. Atual: fundo `accent-dim`, texto `fg`, ícone `accent`. Itens exigem permissão (`perm`) e simplesmente não aparecem sem ela.
- **Mobile:** barra superior de 56px e gaveta de 280px descritas em Layout; o badge de pendentes também vive na barra superior, como atalho para Solicitações.

### Dialogs & Menus
- **DialogContent:** `panel`, borda `line-strong`, raio `lg`, `p-6`, `shadow-pop`, título 17px 600 e descrição 13.5px `fg-muted`; botão fechar ghost no canto (omitido com `hideClose` quando fechar tem consequência, como no ingresso). Rodapé `mt-6` com botões à direita (empilhados e invertidos no celular).
- **ConfirmDialog:** tamanho `sm`; o título é a pergunta, a descrição é a consequência; botão de confirmação `primary` ou `danger-solid`; com `typeToConfirm`, um `Input` exige digitar a palavra (nome do membro em exclusões) antes de habilitar.
- **DropdownContent:** `raised`, borda `line-strong`, raio `md`, `p-1`, `shadow-pop`, `min-w-48`; itens 13.5px com `px-2.5 py-2`, realce branco a 7%, tom `danger` em `red` com realce `red-dim`; separador `line`; rótulo de grupo 11.5px caixa alta `fg-dim`. Itens aparecem conforme permissão.
- **Tooltip:** `raised`, `line-strong`, raio `sm`, 12.5px, `shadow-pop`, 300ms de atraso.

### Ticket (componente de assinatura)
A revelação única de código de acesso ou senha temporária, e o único lugar onde esses valores aparecem. `raised` com `line-strong`, raio `lg`, `shadow-ticket`, entrada `ticket-in` (420ms). Canhoto superior `px-6 pt-5 pb-6`: título 14px 600 ("Código de acesso · MAX"), subtítulo 13px `fg-muted` (nome), código em 30px 600 tabular +0.06em com `select-all`, quebrado em linhas de 12 caracteres quando longo. Linha de corte tracejada a 24% com dois recortes de 24px em `panel`. Canhoto inferior `px-6 pt-4 pb-5`: aviso em âmbar 12.5px ("Guarde agora: este código não será exibido de novo.") e, à direita, `CopyButton` primário `sm` (vira "Copiado" por 1.8s) e `LinkButton` "WhatsApp" secundário `sm` com `wa.me`. Aparece dentro de um `DialogContent` sem X, cujo único fechamento é o botão primário "Já enviei, fechar".

### Estados vazios e carregamento
- **EmptyState:** centrado, `py-14`, ícone Lucide 20px dentro de um quadrado 44px `raised` com `line-strong` e raio `md`; título 15px 600, descrição 13.5px `fg-muted`, ação opcional.
- **Skeleton:** gradiente branco 5→10→5% com `shimmer` 1.4s, raio `sm`; tabelas carregam com seis linhas de esqueleto no formato final.
- **Spinner:** 16px, borda 2px `fg-dim` com topo `accent`.

## Do's and Don'ts

### Do:
- **Do** reservar `accent` (#39ff14) para superfície de ação primária, item de nav atual, borda de seleção, badge de contagem e `live-dot`; use `accent-soft` (#b8f5a8) para qualquer texto pequeno acentuado e para links.
- **Do** emparelhar cor plena e `-dim` (12–14%) com borda a 25–30% em todo chip ou botão de estado (`badge-amber`, `button-danger`).
- **Do** manter uma única ação primária por tela, posicionada à direita no `PageHeader` e em largura total acima das secundárias no celular.
- **Do** fazer de cada número de `StatTile` um filtro clicável com `aria-pressed`, ou renderizá-lo como `div` quando não houver lista para filtrar.
- **Do** passar toda ação destrutiva ou irreversível por `ConfirmDialog` com a consequência escrita; use `typeToConfirm` com o nome do objeto em exclusões e `tone="danger"` com `danger-solid` quando o efeito é bloquear ou apagar.
- **Do** mostrar códigos e senhas temporárias somente dentro de `Ticket`, uma única vez, num diálogo sem X.
- **Do** omitir (não desabilitar) controles e itens de nav sem permissão, via `useCan`.
- **Do** usar a escala fixa em px (30/28/26/22/17/16/15/14/13.5/13/12.5/12/11.5) e Figtree em 400/500/600/700/800; números sempre tabulares.
- **Do** separar com fios: `line` dentro de superfícies, `line-strong` em contornos de controles e camadas flutuantes.
- **Do** trocar tabelas por cartões `lg` abaixo de `md` e transformar o `StatRow` numa fileira com snap abaixo de `md`.
- **Do** animar entradas com `--ease-out` (160–420ms) e respeitar `prefers-reduced-motion`.

### Don't:
- **Don't** usar `#39ff14` como cor de texto corrido nem em frases; apenas em superfícies, ícones de nav ativa e no `FIRST` do logotipo.
- **Don't** colocar olho/kicker, rótulo em caixa alta ou qualquer linha de texto acima de um `h1`/`h2`; caixa alta espaçada só em legenda da marca, rótulo de grupo de menu, separador de dia e chips de plano.
- **Don't** introduzir segunda família tipográfica, monoespaçada ou `clamp()`; o único tamanho responsivo é o título de página (26→30px).
- **Don't** aplicar sombra a painéis, tabelas ou tiles dentro da página; `shadow-pop` é para o que flutua e `shadow-ticket` é exclusivo do ingresso.
- **Don't** usar âmbar, vermelho ou azul sem estado correspondente (validade, bloqueio/erro, vitalício/informação), nem como cor decorativa de ícones ou títulos.
- **Don't** inventar uma terceira forma de chip de plano: BÁSICO é contorno `line-strong`, MAX é `accent` preenchido, ambos 24px e 11.5px 700.
- **Don't** usar gradientes, imagens de fundo, cantos maiores que 14px (exceto pílulas) ou fundos puramente pretos; os três degraus azul-negros são o material.
- **Don't** apresentar métricas-herói sem destino; se o número não filtra nem navega, ele não merece um `StatTile`.
- **Don't** usar sombra deslocada dura, ícones em glifo de fonte ou fontes de sistema no lugar de Figtree.

## Como estender

### Versões do app (fase 2)
Uma tela nova herda o sistema sem tokens novos. Monte-a com `PageHeader` (título "Versões do app", descrição em 14px `fg-muted`, ação primária única "Publicar versão" à direita, "Atualizar" ghost), um `StatRow` apenas se os números filtrarem a lista (por exemplo "Versão oficial · Builds · Downloads nos últimos 7 dias"; caso contrário omita a fileira), e um `Panel` por canal (Windows, Android, sites) com linhas `px-5 py-3` em 13.5px: número da versão em 500, data e tamanho em `meta` 12.5px tabular, `Badge tone="accent"` para "Oficial", `Badge tone="neutral"` para builds internos, `Badge tone="blue"` para notas informativas. Links de download seguem a cor de `a` (`accent-soft`). "Tornar oficial" e "Remover build" passam por `ConfirmDialog`; remover uma versão oficial exige `typeToConfirm` com o número da versão. Abaixo de `md`, cada linha vira cartão `lg` como em Membros. Não há ingresso nesta tela: a revelação única é exclusiva de códigos e senhas.

### Tauri (Windows .msi, Android .apk)
A casca não muda: mesmo `Layout`, mesmos tokens, mesmo `color-scheme: dark`. Pontos a observar no invólucro: a cor da janela e da barra de título nativa deve ser `bg` (#080c10) para que a borda do `rail` não apareça como faixa; evitar barra de título customizada com arraste sobre a barra superior móvel (`h-14`), que já é sticky; a gaveta e os diálogos usam `position: fixed`, então o viewport do WebView precisa ter `safe-area` tratado com `min-h-svh` como já está; `scrollbar-width: thin` e os estilos de `::-webkit-scrollbar` já cobrem o WebView2 e o Android WebView. Ícones do app vêm dos assets de marca ("WATCH" branco, "FIRST" em `accent`), nunca de um novo desenho. Nenhum componente pode supor ponteiro: alturas de 40px nos controles e 44px no ícone do `EmptyState` já atendem toque, mantenha-as.
