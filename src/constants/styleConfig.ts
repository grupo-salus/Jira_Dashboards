/**
 * styleConfig.ts
 *
 * Arquivo central para configurar os tamanhos de fonte e outros estilos
 * reutilizáveis no dashboard de Espaço de Projetos.
 *
 * Configuração fixa baseada no modo "pequeno" como padrão.
 */

// ============================================================================
// CONFIGURAÇÕES FIXAS (MODO PEQUENO)
// ============================================================================

// SEÇÃO: TOTALIZADORES
const totalizadoresConfig = {
  titulo: "text-lg font-bold",
  valor: "text-2xl",
  label: "text-base",
  icone: "1.75rem", // 28px
  largura: "w-56",
  altura: "h-25",
  padding: "p-5",
  filtroLabel: "text-xs",
  filtroInput: "text-xs px-2 py-1 h-7",
};

// SEÇÃO: GRÁFICOS
const graficosConfig = {
  titulo: "text-sm",
  label: "text-xs",
  valor: "text-xs",
  eixo: "0.815rem", // 10px
  tooltip: "0.625rem", // 10px
  legenda: "0.815rem", // 10px
  labelRosca: "0.625rem", // 10px
  raioExterno: "2.5rem", // 40px
  raioInterno: "1.25rem", // 20px
  altura: "h-32",
  largura: "w-full",
  padding: "p-2",
};

// SEÇÃO: KANBAN
const kanbanConfig = {
  tituloColuna: "text-[0.875rem]", // 14px
  contador: "text-[0.9375rem]", // 15px
  tituloCard: "text-[0.8125rem]", // 13px
  corpoCard: "text-[0.625rem]", // 10px
  tag: "text-[0.5625rem]", // 9px
  status: "text-[0.6875rem]", // 11px
  icone: "0.5rem", // 8px
  larguraCard: "w-16",
  alturaCard: "h-6",
  paddingCard: "p-0.5",
  gapColunas: "gap-0.5",
};

// SEÇÃO: FILTROS
const filtrosConfig = {
  label: "text-xs",
  input: "text-xs px-2 py-1 h-7",
};

// SEÇÃO: PÁGINA
const paginaConfig = {
  titulo: "text-2xl font-bold",
  subtitulo: "text-xl lg:text-2xl font-semibold",
  descricao: "text-base lg:text-lg",
};

// ============================================================================
// FUNÇÕES DE ACESSO POR SEÇÃO
// ============================================================================

// Função para obter configurações dos Totalizadores
export const getTotalizadoresConfig = () => {
  return totalizadoresConfig;
};

// Função para obter configurações dos Gráficos
export const getGraficosConfig = () => {
  return graficosConfig;
};

// Função para obter configurações do Kanban
export const getKanbanConfig = () => {
  return kanbanConfig;
};

// Função para obter configurações dos Filtros
export const getFiltrosConfig = () => {
  return filtrosConfig;
};

// Função para obter configurações da Página
export const getPaginaConfig = () => {
  return paginaConfig;
};

// ============================================================================
// FUNÇÕES DE COMPATIBILIDADE (para componentes existentes)
// ============================================================================

// Função para obter tamanhos de fonte atuais (compatibilidade)
export const getFontSizes = () => {
  return {
    // Títulos das páginas e seções principais
    tituloPrincipal: totalizadoresConfig.titulo,
    tituloPagina: paginaConfig.titulo,

    // Componentes do Kanban
    tituloColunaKanban: kanbanConfig.tituloColuna,
    contadorColunaKanban: kanbanConfig.contador,
    tituloCardKanban: kanbanConfig.tituloCard,
    corpoCardKanban: kanbanConfig.corpoCard,
    tagCardKanban: kanbanConfig.tag,
    statusCardKanban: kanbanConfig.status,

    // Componentes dos Gráficos
    tituloGrafico: graficosConfig.titulo,
    eixoGrafico: graficosConfig.eixo,
    tooltipGrafico: graficosConfig.tooltip,
    legendaGrafico: graficosConfig.legenda,
    labelGraficoRosca: graficosConfig.labelRosca,

    // Totalizadores
    labelTotalizador: totalizadoresConfig.label,
    valorTotalizador: totalizadoresConfig.valor,

    // Filtros
    labelFiltro: filtrosConfig.label,
    inputFiltro: filtrosConfig.input,

    // Botões
    textoBotao: totalizadoresConfig.titulo,
  };
};

// Função para obter tamanhos de ícones atuais (compatibilidade)
export const getIconSizes = () => {
  return {
    card: kanbanConfig.icone,
    totalizador: totalizadoresConfig.icone,
  };
};

// Função para obter dimensões de cards atuais (compatibilidade)
export const getCardDimensions = () => {
  return {
    totalizador: {
      width: totalizadoresConfig.largura,
      height: totalizadoresConfig.altura,
    },
  };
};

// ============================================================================
// EXPORTAÇÕES PARA COMPATIBILIDADE
// ============================================================================
export const fontSizes = getFontSizes();

// Configurações de tooltip
export const TOOLTIP_CONFIG = {
  DELAY_MS: 400, // Delay em milissegundos para mostrar o tooltip
};
