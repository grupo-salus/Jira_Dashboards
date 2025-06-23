/**
 * styleConfig.ts
 *
 * Arquivo central para configurar os tamanhos de fonte e outros estilos
 * reutilizáveis no dashboard de Espaço de Projetos.
 *
 * Organizado por seções para facilitar a manutenção e permitir
 * configurações independentes para cada área do dashboard.
 */

// ============================================================================
// CONFIGURAÇÃO GLOBAL DE TAMANHOS
// ============================================================================
// Estados disponíveis:
// - "pequeno" - Tamanhos menores e mais compactos
// - "medio" - Tamanhos equilibrados (padrão)
// - "grande" - Tamanhos maiores
// - "muitoGrande" - Tamanhos muito grandes

// Estado global para o tamanho
let tamanhoGlobalAtual: "pequeno" | "medio" | "grande" | "muitoGrande" =
  "medio";

// Função para alterar o tamanho global
export const setTamanhoGlobal = (
  novoTamanho: "pequeno" | "medio" | "grande" | "muitoGrande"
) => {
  tamanhoGlobalAtual = novoTamanho;
  window.dispatchEvent(
    new CustomEvent("tamanhoGlobalChanged", { detail: novoTamanho })
  );
};

// Função para obter o tamanho atual
export const getTamanhoGlobal = () => tamanhoGlobalAtual;

// ============================================================================
// CONFIGURAÇÕES POR SEÇÃO
// ============================================================================

// SEÇÃO: TOTALIZADORES
const totalizadoresConfig = {
  pequeno: {
    titulo: "text-lg",
    valor: "text-2xl",
    label: "text-base",
    icone: 28,
    largura: "w-56",
    altura: "h-24",
    padding: "p-5",
  },
  medio: {
    titulo: "text-xl",
    valor: "text-3xl",
    label: "text-lg",
    icone: 36,
    largura: "w-72",
    altura: "h-28",
    padding: "p-6",
  },
  grande: {
    titulo: "text-2xl",
    valor: "text-4xl",
    label: "text-xl",
    icone: 44,
    largura: "w-96",
    altura: "h-32",
    padding: "p-7",
  },
  muitoGrande: {
    titulo: "text-3xl",
    valor: "text-5xl",
    label: "text-2xl",
    icone: 56,
    largura: "w-[32rem]",
    altura: "h-40",
    padding: "p-8",
  },
};

// SEÇÃO: GRÁFICOS
const graficosConfig = {
  pequeno: {
    titulo: "text-xs",
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
  },
  medio: {
    titulo: "text-sm",
    label: "text-sm",
    valor: "text-sm",
    eixo: 12,
    tooltip: 12,
    legenda: "text-xs",
    labelRosca: 12,
    raioExterno: 60,
    raioInterno: 30,
    altura: "h-40",
    largura: "w-full",
    padding: "p-3",
  },
  grande: {
    titulo: "text-base",
    label: "text-base",
    valor: "text-base",
    eixo: 14,
    tooltip: 14,
    legenda: "text-sm",
    labelRosca: 14,
    raioExterno: 80,
    raioInterno: 40,
    altura: "h-56",
    largura: "w-full",
    padding: "p-4",
  },
  muitoGrande: {
    titulo: "text-lg",
    label: "text-lg",
    valor: "text-lg",
    eixo: 16,
    tooltip: 16,
    legenda: "text-base",
    labelRosca: 16,
    raioExterno: 100,
    raioInterno: 50,
    altura: "h-72",
    largura: "w-full",
    padding: "p-5",
  },
};

// SEÇÃO: KANBAN
const kanbanConfig = {
  pequeno: {
    tituloColuna: "text-[8px]",
    contador: "text-[6px]", 
    tituloCard: "text-[9px]",
    corpoCard: "text-[7px]",
    tag: "text-[6px]",
    status: "text-[6px]",
    icone: 8,
    larguraCard: "w-16",
    alturaCard: "h-6",
    paddingCard: "p-0.5",
    gapColunas: "gap-0.5",
  },
  medio: {
    tituloColuna: "text-[10px]",
    contador: "text-[8px]",
    tituloCard: "text-[10px]", 
    corpoCard: "text-[8px]",
    tag: "text-[8px]",
    status: "text-[8px]",
    icone: 12,
    larguraCard: "w-24",
    alturaCard: "h-10",
    paddingCard: "p-1",
    gapColunas: "gap-1",
  },
  grande: {
    tituloColuna: "text-xs",
    contador: "text-[10px]",
    tituloCard: "text-xs",
    corpoCard: "text-[10px]",
    tag: "text-[10px]",
    status: "text-[10px]",
    icone: 16,
    larguraCard: "w-40",
    alturaCard: "h-16",
    paddingCard: "p-2",
    gapColunas: "gap-3",
  },
  muitoGrande: {
    tituloColuna: "text-sm",
    contador: "text-xs",
    tituloCard: "text-sm",
    corpoCard: "text-xs",
    tag: "text-xs", 
    status: "text-xs",
    icone: 20,
    larguraCard: "w-56",
    alturaCard: "h-24",
    paddingCard: "p-4",
    gapColunas: "gap-4",
  },
};

// ============================================================================
// FUNÇÕES DE ACESSO POR SEÇÃO
// ============================================================================

// Função para obter configurações dos Totalizadores
export const getTotalizadoresConfig = () => {
  return totalizadoresConfig[tamanhoGlobalAtual];
};

// Função para obter configurações dos Gráficos
export const getGraficosConfig = () => {
  return graficosConfig[tamanhoGlobalAtual];
};

// Função para obter configurações do Kanban
export const getKanbanConfig = () => {
  return kanbanConfig[tamanhoGlobalAtual];
};

// ============================================================================
// FUNÇÕES DE COMPATIBILIDADE (para componentes existentes)
// ============================================================================

// Função para obter tamanhos de fonte atuais (compatibilidade)
export const getFontSizes = () => {
  const totalizadores = getTotalizadoresConfig();
  const graficos = getGraficosConfig();
  const kanban = getKanbanConfig();

  return {
    // Títulos das páginas e seções principais
    tituloPrincipal: totalizadores.titulo,

    // Componentes do Kanban
    tituloColunaKanban: kanban.tituloColuna,
    contadorColunaKanban: kanban.contador,
    tituloCardKanban: kanban.tituloCard,
    corpoCardKanban: kanban.corpoCard,
    tagCardKanban: kanban.tag,
    statusCardKanban: kanban.status,

    // Componentes dos Gráficos
    tituloGrafico: graficos.titulo,
    eixoGrafico: graficos.eixo,
    tooltipGrafico: graficos.tooltip,
    legendaGrafico: graficos.legenda,
    labelGraficoRosca: graficos.labelRosca,

    // Totalizadores
    labelTotalizador: totalizadores.label,
    valorTotalizador: totalizadores.valor,

    // Filtros
    labelFiltro: totalizadores.titulo,
    inputFiltro: totalizadores.titulo,

    // Botões
    textoBotao: totalizadores.titulo,
  };
};

// Função para obter tamanhos de ícones atuais (compatibilidade)
export const getIconSizes = () => {
  const totalizadores = getTotalizadoresConfig();
  const kanban = getKanbanConfig();

  return {
    card: kanban.icone,
    totalizador: totalizadores.icone,
  };
};

// Função para obter dimensões de gráficos atuais (compatibilidade)
export const getChartDimensions = () => {
  const graficos = getGraficosConfig();

  return {
    pie: {
      outerRadius: graficos.raioExterno,
      innerRadius: graficos.raioInterno,
    },
  };
};

// Função para obter dimensões de cards atuais (compatibilidade)
export const getCardDimensions = () => {
  const totalizadores = getTotalizadoresConfig();

  return {
    totalizador: {
      width: totalizadores.largura,
      height: totalizadores.altura,
    },
  };
};

// ============================================================================
// EXPORTAÇÕES PARA COMPATIBILIDADE
// ============================================================================
export const fontSizes = getFontSizes();
export const iconSizes = getIconSizes();
export const chartDimensions = getChartDimensions();
export const cardDimensions = getCardDimensions();
