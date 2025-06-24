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
  "pequeno";

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
    titulo: "text-lg font-bold",
    valor: "text-2xl",
    label: "text-base",
    icone: 28,
    largura: "w-56",
    altura: "h-24",
    padding: "p-5",
    filtroLabel: "text-xs",
    filtroInput: "text-xs px-2 py-1 h-7",
  },
  medio: {
    titulo: "text-xl",
    valor: "text-3xl",
    label: "text-lg",
    icone: 36,
    largura: "w-72",
    altura: "h-28",
    padding: "p-6",
    filtroLabel: "text-sm",
    filtroInput: "text-sm px-3 py-2 h-8",
  },
  grande: {
    titulo: "text-2xl",
    valor: "text-4xl",
    label: "text-xl",
    icone: 44,
    largura: "w-96",
    altura: "h-32",
    padding: "p-7",
    filtroLabel: "text-base",
    filtroInput: "text-base px-4 py-2 h-10",
  },
  muitoGrande: {
    titulo: "text-3xl",
    valor: "text-5xl",
    label: "text-2xl",
    icone: 56,
    largura: "w-[32rem]",
    altura: "h-40",
    padding: "p-8",
    filtroLabel: "text-lg",
    filtroInput: "text-lg px-5 py-3 h-12",
  },
};

// SEÇÃO: GRÁFICOS
const graficosConfig = {
  pequeno: {
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
  },
  medio: {
    tituloColuna: "text-[15px]",
    contador: "text-[14px]",
    tituloCard: "text-[13px]",
    corpoCard: "text-[12px]",
    tag: "text-[11px]",
    status: "text-[12px]",
    icone: 12,
    larguraCard: "w-24",
    alturaCard: "h-12",
    paddingCard: "p-1",
    gapColunas: "gap-1",
  },
  grande: {
    tituloColuna: "text-[16px]",
    contador: "text-[16px]",
    tituloCard: "text-[15px]",
    corpoCard: "text-[14px]",
    tag: "text-[13px]",
    status: "text-[14px]",
    icone: 16,
    larguraCard: "w-40",
    alturaCard: "h-16",
    paddingCard: "p-2",
    gapColunas: "gap-2",
  },
  muitoGrande: {
    tituloColuna: "text-[18px]",
    contador: "text-[18px]",
    tituloCard: "text-[17px]",
    corpoCard: "text-[16px]",
    tag: "text-[15px]",
    status: "text-[16px]",
    icone: 20,
    larguraCard: "w-56",
    alturaCard: "h-24",
    paddingCard: "p-4",
    gapColunas: "gap-4",
  },
};

// SEÇÃO: FILTROS
const filtrosConfig = {
  pequeno: {
    label: "text-xs",
    input: "text-xs px-2 py-1 h-7",
  },
  medio: {
    label: "text-sm",
    input: "text-sm px-3 py-2 h-8",
  },
  grande: {
    label: "text-base",
    input: "text-base px-4 py-2 h-10",
  },
  muitoGrande: {
    label: "text-lg",
    input: "text-lg px-5 py-3 h-12",
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

// Função para obter configurações dos Filtros
export const getFiltrosConfig = () => {
  return filtrosConfig[tamanhoGlobalAtual];
};

// ============================================================================
// FUNÇÕES DE COMPATIBILIDADE (para componentes existentes)
// ============================================================================

// Função para obter tamanhos de fonte atuais (compatibilidade)
export const getFontSizes = () => {
  const totalizadores = getTotalizadoresConfig();
  const graficos = getGraficosConfig();
  const kanban = getKanbanConfig();
  const filtros = getFiltrosConfig();

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
    labelFiltro: filtros.label,
    inputFiltro: filtros.input,

    // Botões
    textoBotao: totalizadores.titulo, // Exemplo, pode ser ajustado
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
// As exportações abaixo são úteis para componentes que precisam de acesso direto
// a conjuntos de tamanhos, mas o ideal é usar as funções de `get...Config()`
// para garantir que o tamanho global atual seja sempre respeitado.
export const fontSizes = getFontSizes();
export const iconSizes = getIconSizes();
export const chartDimensions = getChartDimensions();
export const cardDimensions = getCardDimensions();
