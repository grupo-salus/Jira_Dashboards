# JiraDashoards

Este repositório contém dashboards para acompanhamento do backlog e do quadro Kanban do squad Salus. Os dashboards facilitam a visualização do progresso das tarefas, priorização e gestão do fluxo de trabalho, promovendo maior transparência e eficiência para a equipe.

## Estrutura do Projeto

```
.
├── .gitignore
├── README.md
├── backend/          # Backend em Python
│   ├── config/
│   ├── controllers/
│   ├── main.py
│   ├── services/
│   └── utils/
└── src/             # Frontend em React/TypeScript
    ├── api/         # Serviços de API
    │   └── api_jira.ts
    ├── components/  # Componentes React
    │   ├── dashboard/  # Componentes do Dashboard
    │   │   ├── BacklogCharts.tsx
    │   │   ├── BacklogKPICards.tsx
    │   │   └── BacklogQueues.tsx
    │   ├── layout/    # Componentes de Layout
    │   └── icons/     # Ícones personalizados
    ├── context/     # Contextos React
    │   └── JiraContext.tsx
    ├── pages/       # Páginas da aplicação
    │   ├── dashbacklog.tsx
    │   ├── SprintDashboard.tsx
    │   └── Home.tsx
    ├── types/       # Definições de tipos
    │   └── backlog.ts
    ├── utils/       # Funções utilitárias
    │   ├── backlogMetrics.ts
    │   ├── formatters.ts
    │   └── themeColors.ts
    ├── constants/   # Constantes e configurações
    ├── App.tsx      # Componente principal
    ├── main.tsx     # Ponto de entrada
    └── index.css    # Estilos globais
```

## Fluxo do Frontend

### 1. Estrutura de Arquivos

#### API e Dados

- `src/api/api_jira.ts`: Contém as funções que fazem as chamadas à API do backend
  - `fetchBacklogTable`: Busca dados do backlog com filtros

#### Tipos e Interfaces

- `src/types/backlog.ts`: Define todas as interfaces e tipos do sistema
  - `Card`: Interfaces para cards do Jira (Base, Backlog, Project, etc.)
  - `Metrics`: Interfaces para métricas (Basic, BacklogHealth, etc.)
  - `Project`: Interfaces para projetos
  - `Department`: Interfaces para departamentos
  - `Analysis`: Interfaces para análises
  - `Response`: Interfaces para respostas da API
  - `Summary`: Interfaces para resumos

#### Componentes

- `src/components/dashboard/`: Componentes específicos do dashboard
  - `BacklogKPICards.tsx`: Cards com métricas principais
  - `BacklogCharts.tsx`: Gráficos do backlog
  - `BacklogQueues.tsx`: Visualização das filas do backlog

#### Páginas

- `src/pages/dashbacklog.tsx`: Página principal do dashboard de backlog
  - Gerencia o estado global dos filtros
  - Coordena a busca e atualização dos dados
  - Renderiza os componentes do dashboard
- `src/pages/SprintDashboard.tsx`: Dashboard da sprint atual (em desenvolvimento)
- `src/pages/Home.tsx`: Página inicial com navegação

#### Utilitários

- `src/utils/backlogMetrics.ts`: Funções para cálculo de métricas
- `src/utils/formatters.ts`: Funções para formatação de dados
- `src/utils/themeColors.ts`: Definições de cores e estilos

### 2. Fluxo de Dados

1. **Inicialização**:

   - A página `dashbacklog.tsx` é carregada
   - O contexto `JiraContext` é inicializado
   - Os filtros padrão são aplicados

2. **Busca de Dados**:

   - `dashbacklog.tsx` chama `fetchBacklogTable` do `api_jira.ts`
   - A API faz requisição ao backend
   - Os dados são processados e tipados conforme interfaces em `backlog.ts`

3. **Processamento**:

   - Os dados brutos são processados por funções em `backlogMetrics.ts`
   - Métricas são calculadas (idade média, distribuição, etc.)
   - Dados são formatados usando funções de `formatters.ts`

4. **Renderização**:
   - `BacklogKPICards` exibe métricas principais
   - `BacklogCharts` gera gráficos usando os dados processados
   - `BacklogQueues` mostra a distribuição por filas

### 3. Componentes Principais

#### BacklogKPICards

- Exibe métricas principais do backlog
- Mostra total de cards, projetos, idade média e card mais antigo
- Atualiza automaticamente com mudanças nos filtros

#### BacklogCharts

- Renderiza gráficos usando a biblioteca Recharts
- Inclui gráficos de:
  - Distribuição por idade
  - Distribuição por prioridade
  - Distribuição por área
  - Distribuição por solicitante

#### BacklogQueues

- Visualiza a distribuição de cards por fila
- Mostra métricas específicas de cada fila
- Permite análise do fluxo de trabalho

### 4. Gerenciamento de Estado

- **JiraContext**: Gerencia o estado global da aplicação

  - Dados do backlog
  - Estado de carregamento
  - Erros
  - Funções de atualização

- **Filtros**: Gerenciados localmente em `dashbacklog.tsx`
  - Estado dos filtros
  - Funções de atualização
  - Efeitos para buscar dados quando filtros mudam

### 5. Estilização

- Usa Tailwind CSS para estilização
- Tema personalizado definido em `themeColors.ts`
- Componentes estilizados com classes utilitárias
- Layout responsivo para diferentes tamanhos de tela

## Dependências Principais

### Backend

Este projeto depende das seguintes bibliotecas Python:

- `requests`: Para chamadas HTTP à API do Jira
- `python-dotenv`: Para variáveis de ambiente
- `pandas`: Para manipulação de dados
- `openpyxl`: Para exportação Excel

### Frontend

Este projeto depende das seguintes bibliotecas JavaScript/TypeScript:

- `react`: Biblioteca principal para UI
- `recharts`: Para criação de gráficos
- `tailwindcss`: Para estilização
- `date-fns`: Para manipulação de datas
- `axios`: Para chamadas HTTP
