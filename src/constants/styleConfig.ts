/**
 * styleConfig.ts
 *
 * Arquivo central para configurar os tamanhos de fonte e outros estilos
 * reutilizáveis no dashboard de Espaço de Projetos.
 *
 * A ideia é centralizar as classes do Tailwind para facilitar a manutenção
 * e garantir a consistência visual em todos os componentes.
 */

// ============================================================================
// CONFIGURAÇÃO GLOBAL DE TAMANHOS
// ============================================================================
// Altere esta variável para testar diferentes tamanhos:
// - "pequeno" - Tamanhos menores e mais compactos
// - "medio" - Tamanhos equilibrados (padrão)
// - "grande" - Tamanhos maiores
// - "muitoGrande" - Tamanhos muito grandes

// Estado global para o tamanho (será controlado pelo React)
let tamanhoGlobalAtual: "pequeno" | "medio" | "grande" | "muitoGrande" =
  "medio";

// Função para alterar o tamanho global
export const setTamanhoGlobal = (
  novoTamanho: "pequeno" | "medio" | "grande" | "muitoGrande"
) => {
  tamanhoGlobalAtual = novoTamanho;
  // Força re-render dos componentes que usam estas configurações
  window.dispatchEvent(
    new CustomEvent("tamanhoGlobalChanged", { detail: novoTamanho })
  );
};

// Função para obter o tamanho atual
export const getTamanhoGlobal = () => tamanhoGlobalAtual;

// Configurações de tamanho baseadas na variável global
const tamanhos = {
  pequeno: {
    titulo: "text-base",
    subtitulo: "text-sm",
    corpo: "text-xs",
    pequeno: "text-xs",
    valor: "text-xl",
    iconeCard: 14,
    iconeTotalizador: 24,
    cardWidth: "w-48",
    cardHeight: "h-16",
    graficoRadius: 60,
    graficoInnerRadius: 30,
  },
  medio: {
    titulo: "text-lg",
    subtitulo: "text-base",
    corpo: "text-sm",
    pequeno: "text-xs",
    valor: "text-2xl",
    iconeCard: 16,
    iconeTotalizador: 32,
    cardWidth: "w-64",
    cardHeight: "h-20",
    graficoRadius: 80,
    graficoInnerRadius: 40,
  },
  grande: {
    titulo: "text-3xl",
    subtitulo: "text-xl",
    corpo: "text-lg",
    pequeno: "text-base",
    valor: "text-4xl",
    iconeCard: 20,
    iconeTotalizador: 48,
    cardWidth: "w-96",
    cardHeight: "h-32",
    graficoRadius: 120,
    graficoInnerRadius: 60,
  },
  muitoGrande: {
    titulo: "text-4xl",
    subtitulo: "text-2xl",
    corpo: "text-xl",
    pequeno: "text-lg",
    valor: "text-5xl",
    iconeCard: 24,
    iconeTotalizador: 56,
    cardWidth: "w-[28rem]",
    cardHeight: "h-40",
    graficoRadius: 160,
    graficoInnerRadius: 80,
  },
};

// Função para obter a configuração atual
const getConfigAtual = () => tamanhos[tamanhoGlobalAtual];

// Função para obter tamanhos de fonte atuais
export const getFontSizes = () => {
  const configAtual = getConfigAtual();

  return {
    // Títulos das páginas e seções principais
    tituloPrincipal: configAtual.titulo,

    // Componentes do Kanban
    tituloColunaKanban: configAtual.titulo,
    contadorColunaKanban: configAtual.pequeno,
    tituloCardKanban: configAtual.subtitulo,
    corpoCardKanban: configAtual.corpo,
    tagCardKanban: configAtual.pequeno,
    statusCardKanban: configAtual.pequeno,

    // Componentes dos Gráficos
    tituloGrafico: configAtual.titulo,
    eixoGrafico:
      configAtual.corpo === "text-lg"
        ? 16
        : configAtual.corpo === "text-xl"
        ? 18
        : configAtual.corpo === "text-2xl"
        ? 20
        : 14,
    tooltipGrafico:
      configAtual.corpo === "text-lg"
        ? 16
        : configAtual.corpo === "text-xl"
        ? 18
        : configAtual.corpo === "text-2xl"
        ? 20
        : 14,
    legendaGrafico: configAtual.pequeno,
    labelGraficoRosca:
      configAtual.corpo === "text-lg"
        ? 16
        : configAtual.corpo === "text-xl"
        ? 18
        : configAtual.corpo === "text-2xl"
        ? 20
        : 14,

    // Totalizadores
    labelTotalizador: configAtual.pequeno,
    valorTotalizador: configAtual.valor,

    // Filtros
    labelFiltro: configAtual.subtitulo,
    inputFiltro: configAtual.subtitulo,

    // Botões
    textoBotao: configAtual.subtitulo,
  };
};

// Função para obter tamanhos de ícones atuais
export const getIconSizes = () => {
  const configAtual = getConfigAtual();

  return {
    card: configAtual.iconeCard,
    totalizador: configAtual.iconeTotalizador,
  };
};

// Função para obter dimensões de gráficos atuais
export const getChartDimensions = () => {
  const configAtual = getConfigAtual();

  return {
    pie: {
      outerRadius: configAtual.graficoRadius,
      innerRadius: configAtual.graficoInnerRadius,
    },
  };
};

// Função para obter dimensões de cards atuais
export const getCardDimensions = () => {
  const configAtual = getConfigAtual();

  return {
    totalizador: {
      width: configAtual.cardWidth,
      height: configAtual.cardHeight,
    },
  };
};

// Exportações para compatibilidade (usando valores padrão)
export const fontSizes = getFontSizes();
export const iconSizes = getIconSizes();
export const chartDimensions = getChartDimensions();
export const cardDimensions = getCardDimensions();
