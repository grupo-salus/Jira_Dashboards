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
// ❌ REMOVIDO - Paletas antigas não são mais utilizadas
// themeColors.components.graficos.pizza.palette;
// themeColors.components.graficos.barra.palette;

// ✅ USADO AGORA - Cores específicas para squads e áreas
themeColors.components.squads.BI.hex;
themeColors.components.areas.TI.hex;
```

#### Botões

```typescript
themeColors.components.buttons.primary.bg / hover / text.light / dark;
themeColors.components.buttons.secondary.bg / hover / text.light / dark;
themeColors.components.buttons.danger.bg / hover / text.light / dark;
```

#### Prioridades

```typescript
themeColors.components.prioridades.estrategica.label / color / hex;
themeColors.components.prioridades.alta.label / color / hex;
themeColors.components.prioridades.media.label / color / hex;
themeColors.components.prioridades.baixa.label / color / hex;
themeColors.components.prioridades.muitoBaixa.label / color / hex; // Baixíssima
themeColors.components.prioridades.naoDefinida.label / color / hex;
```

#### Squads

```typescript
themeColors.components.squads.BI.label / hex;
themeColors.components.squads.Infraestrutura.label / hex;
themeColors.components.squads.PMO.label / hex;
themeColors.components.squads.Salesforce.label / hex;
themeColors.components.squads.Sistemas.label / hex;
themeColors.components.squads.Wetok.label / hex;
themeColors.components.squads.naoDefinida.label / hex;
```

#### Áreas/Departamentos

```typescript
themeColors.components.areas.TI.label / hex;
themeColors.components.areas.Operações.label / hex;
themeColors.components.areas.Financeiro.label / hex;
themeColors.components.areas.Marketing.label / hex;
themeColors.components.areas.Presidência.label / hex;
themeColors.components.areas.Auditoria.label / hex;
themeColors.components.areas["Serviço de Atendimento ao Franqueado"].label /
  hex;
themeColors.components.areas.Jurídico.label / hex;
themeColors.components.areas.Crescera.label / hex;
themeColors.components.areas["Recursos Humanos"].label / hex;
themeColors.components.areas["Departamento Pessoal"].label / hex;
themeColors.components.areas.Expansão.label / hex;
themeColors.components.areas.CTS.label / hex;
themeColors.components.areas.Sorriden.label / hex;
themeColors.components.areas["Bom D+"].label / hex;
themeColors.components.areas.Compras.label / hex;
themeColors.components.areas.naoDefinida.label / hex;
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

### getPriorityConfig()

```typescript
import { getPriorityConfig } from "../utils/themeColors";

const priorityConfig = getPriorityConfig("Estratégica");
// Retorna: { label: "Estratégica", color: { bg: "bg-red-100", ... }, hex: "#ef4444" }

const priorityConfig = getPriorityConfig("Alta");
// Retorna: { label: "Alta", color: { bg: "bg-orange-100", ... }, hex: "#f97316" }

const priorityConfig = getPriorityConfig("Baixíssima");
// Retorna: { label: "Baixíssima", color: { bg: "bg-blue-100", ... }, hex: "#3b82f6" }

const priorityConfig = getPriorityConfig("Não existe");
// Retorna: { label: "Não definida", color: { bg: "bg-gray-100", ... }, hex: "#6b7280" }
```

### getSquadConfig()

```typescript
import { getSquadConfig } from "../utils/themeColors";

const squadConfig = getSquadConfig("BI");
// Retorna: { label: "BI", hex: "#E91E63" }

const squadConfig = getSquadConfig("Não existe");
// Retorna: { label: "Não informada", hex: "#6b7280" }
```

### getAreaConfig()

```typescript
import { getAreaConfig } from "../utils/themeColors";

const areaConfig = getAreaConfig("TI");
// Retorna: { label: "TI", hex: "#90CAF9" }

const areaConfig = getAreaConfig("Não existe");
// Retorna: { label: "Não informado", hex: "#6b7280" }
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

### 4. Em um Badge de Prioridade

```typescript
import { getPriorityConfig } from "../utils/themeColors";

const PriorityBadge: React.FC = ({ priority }) => {
  const priorityConfig = getPriorityConfig(priority);
  const isDark = document.documentElement.classList.contains("dark");
  const theme = isDark ? "dark" : "light";

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig.color.bg} ${priorityConfig.color.text} ${priorityConfig.color.dark.bg} ${priorityConfig.color.dark.text}`}
    >
      {priorityConfig.label}
    </span>
  );
};
```

### 5. Em um Gráfico de Pizza de Squads

```typescript
import { getSquadConfig } from "../utils/themeColors";

const SquadPieChart: React.FC = ({ data }) => {
  return (
    <PieChart>
      <Pie data={data} dataKey="value">
        {data.map((entry) => (
          <Cell
            key={`cell-${entry.name}`}
            fill={getSquadConfig(entry.squad).hex}
          />
        ))}
      </Pie>
    </PieChart>
  );
};
```

### 6. Em um Gráfico de Barras de Áreas

```typescript
import { getAreaConfig } from "../utils/themeColors";

const AreaBarChart: React.FC = ({ data }) => {
  return (
    <BarChart data={data}>
      <Bar dataKey="count">
        {data.map((entry) => (
          <Cell
            key={`cell-${entry.area}`}
            fill={getAreaConfig(entry.area).hex}
          />
        ))}
      </Bar>
    </BarChart>
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
