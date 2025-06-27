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
  icone: 28,
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
  eixo: 10,
  tooltip: 10,
  legenda: "text-xs",
  labelRosca: 10,
  raioExterno: 40,
  raioInterno: 20,
  altura: "h-32",
  largura: "w-full",
  padding: "p-2",
};

// SEÇÃO: KANBAN
const kanbanConfig = {
  tituloColuna: "text-[14px]",
  contador: "text-[15px]",
  tituloCard: "text-[13px]",
  corpoCard: "text-[10px]",
  tag: "text-[9px]",
  status: "text-[11px]",
  icone: 8,
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
