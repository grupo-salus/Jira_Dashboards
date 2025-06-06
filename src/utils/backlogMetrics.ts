import { BacklogItem } from "../types/backlog";

// Interface para os totalizadores básicos
interface BacklogBasicMetrics {
  total_cards: number;
  total_epicos: number;
  idade_media_dias: number;
  card_mais_antigo: {
    dias: number;
    chave: string;
    titulo: string;
    epico: string | null;
  };
  primeiro_projeto: {
    chave: string;
    titulo: string;
    epico: string;
    departamento: string;
    prioridade: string;
  } | null;
}

// Função para calcular os totalizadores básicos
export function calculateBasicMetrics(
  items: BacklogItem[]
): BacklogBasicMetrics {
  // Filtra apenas cards que não são subtarefas
  const cards = items.filter((item) => item.Tipo !== "Subtarefa");

  // Total de cards
  const total_cards = cards.length;

  // Total de épicos únicos (excluindo nulos)
  const total_epicos = new Set(cards.map((item) => item.Épico).filter(Boolean))
    .size;

  // Cálculo da idade média
  const idade_media_dias = Math.round(
    cards.reduce((acc, item) => acc + item["Dias no Backlog"], 0) / total_cards
  );

  // Encontrar o card mais antigo
  const card_mais_antigo = cards.reduce((mais_antigo, atual) => {
    return atual["Dias no Backlog"] > mais_antigo["Dias no Backlog"]
      ? atual
      : mais_antigo;
  }, cards[0]);

  // Encontrar o primeiro projeto (primeiro card com épico)
  const primeiro_projeto = cards.find((item) => item.Épico !== null) || null;

  return {
    total_cards,
    total_epicos,
    idade_media_dias,
    card_mais_antigo: {
      dias: card_mais_antigo["Dias no Backlog"],
      chave: card_mais_antigo.Chave,
      titulo: card_mais_antigo.Título,
      epico: card_mais_antigo.Épico,
    },
    primeiro_projeto: primeiro_projeto
      ? {
          chave: primeiro_projeto.Chave,
          titulo: primeiro_projeto.Título,
          epico: primeiro_projeto.Épico || "",
          departamento: primeiro_projeto["Unidade / Departamento"],
          prioridade: primeiro_projeto.Prioridade,
        }
      : null,
  };
}

// Função principal que será exportada
export function calculateBacklogMetrics(items: BacklogItem[]) {
  return {
    basic: calculateBasicMetrics(items),
    // Outras métricas serão adicionadas aqui
  };
}

// Constantes para o dashboard
export const BACKLOG_METRICS = {
  // Constantes serão adicionadas aqui
};
