# Sistema de Cores Centralizado - Jira Dashboards

## 📋 Visão Geral

Este arquivo centraliza todas as cores do projeto, organizadas por categorias semânticas e componentes específicos. O objetivo é facilitar a manutenção e garantir consistência visual em todo o projeto.

## 🎨 Estrutura do Sistema

### 1. Cores Semânticas

```typescript
themeColors.primary[50 - 900]; // Azul principal
themeColors.secondary[50 - 900]; // Cinza secundário
themeColors.success[50 - 900]; // Verde para sucesso
themeColors.warning[50 - 900]; // Amarelo para avisos
themeColors.error[50 - 900]; // Vermelho para erros
themeColors.info[50 - 900]; // Azul para informações
```

### 2. Cores de Texto

```typescript
themeColors.text.primary.light / dark; // Títulos principais
themeColors.text.secondary.light / dark; // Subtítulos
themeColors.text.tertiary.light / dark; // Textos menores
themeColors.text.success.light / dark; // Textos de sucesso
themeColors.text.warning.light / dark; // Textos de aviso
themeColors.text.error.light / dark; // Textos de erro
themeColors.text.info.light / dark; // Textos informativos
```

### 3. Cores de Fundo

```typescript
themeColors.background.page.light / dark; // Fundo da página
themeColors.background.card.light / dark; // Fundo de cards
themeColors.background.hover.light / dark; // Fundo de hover
themeColors.background.active.light / dark; // Fundo de elementos ativos
```

### 4. Cores de Bordas

```typescript
themeColors.border.primary.light / dark; // Bordas principais
themeColors.border.secondary.light / dark; // Bordas secundárias
themeColors.border.focus.light / dark; // Bordas de foco
```

### 5. Cores por Status

```typescript
// Status de Prazo
themeColors.status.prazo.noPrazo.bg / text.light / dark;
themeColors.status.prazo.foraPrazo.bg / text.light / dark;

// Status de Esforço
themeColors.status.esforco.dentroEstimado.bg / text.light / dark;
themeColors.status.esforco.proximoLimite.bg / text.light / dark;
themeColors.status.esforco.estourouEstimativa.bg / text.light / dark;

// Status de Ideação
themeColors.status.ideacao.recente.bg / text.light / dark;
themeColors.status.ideacao.rever.bg / text.light / dark;
themeColors.status.ideacao.quaseObsoleto.bg / text.light / dark;
themeColors.status.ideacao.obsoleto.bg / text.light / dark;
```

### 6. Cores por Componente

#### Totalizadores

```typescript
themeColors.components.totalizadores.total.icon / bar;
themeColors.components.totalizadores.ideacao.icon / bar;
themeColors.components.totalizadores.projetos.icon / bar;
themeColors.components.totalizadores.backlogPriorizado.icon / bar;
themeColors.components.totalizadores.proximoExecucao.bg /
  border /
  bar.light /
  dark;
```

#### Kanban

```typescript
themeColors.components.kanban.colunas.ideacao;
themeColors.components.kanban.colunas.backlogPriorizado;
themeColors.components.kanban.colunas.emExecucao;
themeColors.components.kanban.colunas.emHomologacao;
themeColors.components.kanban.colunas.operacaoAssistida;
themeColors.components.kanban.colunas.entregue;
themeColors.components.kanban.colunas.cancelado;
themeColors.components.kanban.colunas.bloqueado;

themeColors.components.kanban.cards.bg / border / hover.light / dark;
```

#### Gráficos

```typescript
themeColors.components.graficos.palette; // Array de cores
themeColors.components.graficos.bar.primary / secondary / accent;
themeColors.components.graficos.pie.primary / secondary / accent;
themeColors.components.graficos.line.primary / secondary / accent;
```

#### Botões

```typescript
themeColors.components.buttons.primary.bg / hover / text.light / dark;
themeColors.components.buttons.secondary.bg / hover / text.light / dark;
themeColors.components.buttons.danger.bg / hover / text.light / dark;
```

#### Filtros

```typescript
themeColors.components.filtros.bg / border.light / dark;
themeColors.components.filtros.input.bg / border / focus.light / dark;
```

#### Tabelas

```typescript
themeColors.components.tabelas.header.bg / text.light / dark;
themeColors.components.tabelas.row.bg / hover / border.light / dark;
```

## 🔧 Funções Utilitárias

### getTextColor()

```typescript
import { getTextColor } from "../utils/themeColors";

const textColor = getTextColor("primary", "light"); // '#111827'
const textColor = getTextColor("secondary", "dark"); // '#d1d5db'
```

### getBackgroundColor()

```typescript
import { getBackgroundColor } from "../utils/themeColors";

const bgColor = getBackgroundColor("card", "light"); // '#ffffff'
const bgColor = getBackgroundColor("page", "dark"); // '#111827'
```

### getBorderColor()

```typescript
import { getBorderColor } from "../utils/themeColors";

const borderColor = getBorderColor("primary", "light"); // '#e5e7eb'
const borderColor = getBorderColor("focus", "dark"); // '#60a5fa'
```

### getStatusColor()

```typescript
import { getStatusColor } from "../utils/themeColors";

const statusBg = getStatusColor("prazo", "No prazo", "light", "bg"); // '#d1fae5'
const statusText = getStatusColor(
  "esforco",
  "Dentro do estimado",
  "dark",
  "text"
); // '#34d399'
```

### getComponentColor()

```typescript
import { getComponentColor } from "../utils/themeColors";

const kanbanColor = getComponentColor("kanban", "colunas", "light", "ideacao"); // '#8b5cf6'
const buttonColor = getComponentColor("buttons", "primary", "dark", "bg"); // 'linear-gradient(...)'
```

## 📝 Exemplos de Uso

### 1. Em um Componente React

```typescript
import React from "react";
import { themeColors, getTextColor } from "../utils/themeColors";

const MyComponent: React.FC = () => {
  const isDark = document.documentElement.classList.contains("dark");
  const theme = isDark ? "dark" : "light";

  return (
    <div
      style={{
        backgroundColor: themeColors.background.card[theme],
        color: getTextColor("primary", theme),
        border: `1px solid ${themeColors.border.primary[theme]}`,
      }}
    >
      <h1 style={{ color: getTextColor("primary", theme) }}>
        Título Principal
      </h1>
      <p style={{ color: getTextColor("secondary", theme) }}>
        Texto secundário
      </p>
    </div>
  );
};
```

### 2. Em um Gráfico

```typescript
import { themeColors } from "../utils/themeColors";

const chartData = [
  {
    name: "Área 1",
    value: 10,
    fill: themeColors.components.graficos.palette[0],
  },
  {
    name: "Área 2",
    value: 20,
    fill: themeColors.components.graficos.palette[1],
  },
  {
    name: "Área 3",
    value: 15,
    fill: themeColors.components.graficos.palette[2],
  },
];
```

### 3. Em um Card do Kanban

```typescript
import { themeColors } from "../utils/themeColors";

const KanbanCard: React.FC = ({ status }) => {
  const isDark = document.documentElement.classList.contains("dark");
  const theme = isDark ? "dark" : "light";

  const statusColor =
    themeColors.components.kanban.colunas[status] || "#6b7280";

  return (
    <div
      style={{
        backgroundColor: themeColors.components.kanban.cards.bg[theme],
        border: `1px solid ${themeColors.components.kanban.cards.border[theme]}`,
        borderLeft: `4px solid ${statusColor}`,
      }}
    >
      {/* Conteúdo do card */}
    </div>
  );
};
```

## 🔄 Compatibilidade

O sistema mantém compatibilidade com o código existente através de:

1. **Aliases**: `themeColors.cardBg` → `themeColors.background.card`
2. **Propriedades diretas**: `themeColors.success`, `themeColors.warning`, etc.
3. **Paleta de gráficos**: `themeColors.chart` → `themeColors.components.graficos.palette`

## 🎯 Benefícios

1. **Centralização**: Todas as cores em um só lugar
2. **Consistência**: Padrões visuais uniformes
3. **Manutenibilidade**: Fácil alteração de cores
4. **Semântica**: Cores com nomes significativos
5. **Flexibilidade**: Suporte a temas light/dark
6. **Compatibilidade**: Não quebra código existente

## 🚀 Próximos Passos

1. Migrar componentes existentes para usar o novo sistema
2. Criar componentes de design system baseados nessas cores
3. Implementar temas customizados
4. Adicionar validação de cores
5. Criar documentação visual das cores
