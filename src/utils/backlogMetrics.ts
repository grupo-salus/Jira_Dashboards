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

// Tipo para os itens da fila
export interface FilaItem {
  chave: string;
  titulo: string;
  prioridade: string;
  epico: string | null;
  departamento: string;
}

// Função para calcular os totalizadores básicos
export function calculateBasicMetrics(
  items: BacklogItem[]
): BacklogBasicMetrics {
  // Filtra apenas cards que não são subtarefas
  const cards = items.filter((item) => item.Tipo !== "Subtarefa");

  // Total de cards
  const total_cards = items.length;

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

// Fila atual: todos os cards (exceto subtarefas)
function getFilaAtual(items: BacklogItem[]): FilaItem[] {
  return items
    .filter((item) => item.Tipo !== "Subtarefa")
    .map((item) => ({
      chave: item.Chave,
      titulo: item.Título,
      prioridade: item.Prioridade,
      epico: item.Épico,
      departamento: item["Unidade / Departamento"],
    }));
}

// Fila por projeto: um card por épico (projeto)
function getFilaPorProjeto(items: BacklogItem[]): FilaItem[] {
  const cards = items.filter((item) => item.Tipo !== "Subtarefa" && item.Épico);
  const vistos = new Set<string>();
  const result: FilaItem[] = [];
  for (const item of cards) {
    if (!vistos.has(item.Épico!)) {
      vistos.add(item.Épico!);
      result.push({
        chave: item.Chave,
        titulo: item.Título,
        prioridade: item.Prioridade,
        epico: item.Épico,
        departamento: item["Unidade / Departamento"],
      });
    }
  }
  return result;
}

export function getEpicosPorPrioridade(items: BacklogItem[]) {
  const epicosUnicos = new Map<string, { prioridade: string }>();
  items.forEach((item) => {
    if (item.Épico) {
      if (!epicosUnicos.has(item.Épico)) {
        epicosUnicos.set(item.Épico, { prioridade: item.Prioridade });
      }
    }
  });
  const resultado: Record<string, number> = {};
  epicosUnicos.forEach(({ prioridade }) => {
    resultado[prioridade] = (resultado[prioridade] || 0) + 1;
  });
  return resultado;
}

export function getTarefasPorPrioridade(items: BacklogItem[]) {
  // Conta todas as tarefas (incluindo subtarefas) por prioridade
  const resultado: Record<string, number> = {};
  items.forEach((item) => {
    resultado[item.Prioridade] = (resultado[item.Prioridade] || 0) + 1;
  });
  return resultado;
}

export function getSaudeBacklog(items: BacklogItem[]) {
  const total = items.length;
  const faixa30 = items.filter((item) => item["Dias no Backlog"] <= 30).length;
  const faixa60 = items.filter(
    (item) => item["Dias no Backlog"] > 30 && item["Dias no Backlog"] <= 60
  ).length;
  const faixa90 = items.filter(
    (item) => item["Dias no Backlog"] > 60 && item["Dias no Backlog"] <= 90
  ).length;
  const faixa90mais = items.filter((item) => item["Dias no Backlog"] > 90)
    .length;
  const idade_media = Math.round(
    items.reduce((acc, item) => acc + item["Dias no Backlog"], 0) / (total || 1)
  );
  const mais_antigo = Math.max(...items.map((item) => item["Dias no Backlog"]));
  const projeto_mais_antigo = items.reduce(
    (antigo, atual) =>
      atual["Dias no Backlog"] > antigo["Dias no Backlog"] ? atual : antigo,
    items[0]
  );

  return {
    total,
    faixa30,
    faixa60,
    faixa90,
    faixa90mais,
    idade_media,
    mais_antigo,
    projeto_mais_antigo: {
      chave: projeto_mais_antigo.Chave,
      titulo: projeto_mais_antigo.Título,
      prioridade: projeto_mais_antigo.Prioridade,
      dias: projeto_mais_antigo["Dias no Backlog"],
    },
  };
}

// Função principal que será exportada
export function calculateBacklogMetrics(items: BacklogItem[]) {
  return {
    basic: calculateBasicMetrics(items),
    fila_atual: getFilaAtual(items),
    fila_por_projeto: getFilaPorProjeto(items),
    epicos_por_prioridade: getEpicosPorPrioridade(items),
    tarefas_por_prioridade: getTarefasPorPrioridade(items),
    saude_backlog: getSaudeBacklog(items), // <-- adicione aqui
    // Outras métricas serão adicionadas aqui
  };
}

// Constantes para o dashboard
export const BACKLOG_METRICS = {
  // Constantes serão adicionadas aqui
};
