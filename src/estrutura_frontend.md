# Estrutura de Pastas do Frontend (`src/`)

```
src/
  api/
    api_jira.ts
  App.tsx
  components/
    common/
    DashAcompanhamentoTI/
      AcompanhamentoTITable.tsx
    DashProjetos/
      AnaliseDemandasPorSquad.tsx
      index.ts
      kanban-scrollbar.css
      KanbanCards.tsx
      kanbanUtils.ts
      ProjetosBarPorArea.tsx
      ProjetosBarPorPrioridade.tsx
      ProjetosKanban.tsx
      ProjetosTable.tsx
      ProjetosTotalizadores.tsx
      TooltipProjetos.tsx
    icons/
      DashboardIcons.tsx
    layout/
      Navbar.tsx
    SprintDashboard/
  constants/
    styleConfig.ts
  context/
    JiraContext.tsx
    ThemeContext.tsx
  docs/
  hooks/
  index.css
  main.tsx
  metrics/
    MetricsCalculators.ts
  pages/
    dashprojetos.tsx
    Home.tsx
    SprintDashboard.tsx
    TIDashboard.tsx
  types/
    Typesjira.ts
    TypesMetrics.ts
  utils/
    backlogMetrics.ts
    formatters.ts
    themeColors.md
    themeColors.ts
  vite-env.d.ts
```

> **Observação:**
>
> - Subpastas como `common/`, `docs/`, `hooks/` estão vazias ou reservadas para expansão.
> - Os arquivos e pastas podem crescer conforme a modularização e refatoração.
