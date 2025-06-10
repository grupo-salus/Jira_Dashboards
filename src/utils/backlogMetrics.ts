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
  area: string;
}

// Função para calcular os totalizadores básicos
export function calculateBasicMetrics(
  items: BacklogItem[]
): BacklogBasicMetrics {
  // GUARDA: Se a lista de entrada estiver vazia, retorna um objeto padrão seguro.
  // Isso evita o crash "Cannot read properties of undefined".
  if (items.length === 0) {
    return {
      total_cards: 0,
      total_epicos: 0,
      idade_media_dias: 0,
      card_mais_antigo: {
        dias: 0,
        chave: "N/A",
        titulo: "Nenhum card encontrado",
        epico: null,
      },
      primeiro_projeto: null,
    };
  }

  // Filtra apenas cards que não são subtarefas
  const cards = items.filter((item) => item.Tipo !== "Subtarefa");

  // GUARDA 2: Proteção caso só existam subtarefas
  if (cards.length === 0) {
    return {
      total_cards: items.length, // Mostra o total de subtarefas
      total_epicos: 0,
      idade_media_dias: 0,
      card_mais_antigo: {
        dias: 0,
        chave: "N/A",
        titulo: "Apenas subtarefas",
        epico: null,
      },
      primeiro_projeto: null,
    };
  }

  // Total de cards
  const total_cards = items.length;

  // Total de épicos únicos (excluindo nulos)
  const total_epicos = new Set(cards.map((item) => item.Épico).filter(Boolean))
    .size;

  // CORREÇÃO: Evita divisão por zero se `cards` for vazio, resultando em NaN.
  const idade_media_dias = Math.round(
    cards.reduce((acc, item) => acc + item["Dias no Backlog"], 0) /
      (cards.length || 1)
  );

  // Encontrar o card mais antigo. Agora seguro por causa das guardas acima.
  const card_mais_antigo = cards.reduce((mais_antigo, atual) => {
    return atual["Dias no Backlog"] > mais_antigo["Dias no Backlog"]
      ? atual
      : mais_antigo;
  });

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
          epico: primeiro_projeto.Épico || "", // Garante que não seja nulo
          departamento: primeiro_projeto["Unidade / Departamento"],
          prioridade: primeiro_projeto.Prioridade,
        }
      : null,
  };
}

// Fila atual: todos os cards (exceto subtarefas)
// (Nenhuma alteração necessária aqui)
function getFilaAtual(items: BacklogItem[]): FilaItem[] {
  return items
    .filter((item) => item.Tipo !== "Subtarefa")
    .map((item) => ({
      chave: item.Chave,
      titulo: item.Título,
      prioridade: item.Prioridade,
      epico: item.Épico,
      area: item["Unidade / Departamento"],
    }));
}

// Fila por projeto: um card por épico (projeto)
// (Nenhuma alteração necessária aqui)
function getFilaPorProjeto(items: BacklogItem[]): FilaItem[] {
  const cards = items.filter((item) => item.Tipo !== "Subtarefa" && item.Épico);
  const vistos = new Set<string>();
  const result: FilaItem[] = [];
  for (const item of cards) {
    if (item.Épico && !vistos.has(item.Épico)) {
      // Checagem extra de segurança
      vistos.add(item.Épico);
      result.push({
        chave: item.Chave,
        titulo: item.Título,
        prioridade: item.Prioridade,
        epico: item.Épico,
        area: item["Unidade / Departamento"],
      });
    }
  }
  return result;
}

// (Nenhuma alteração necessária aqui)
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

// (Nenhuma alteração necessária aqui)
export function getTarefasPorPrioridade(items: BacklogItem[]) {
  const resultado: Record<string, number> = {};
  items.forEach((item) => {
    if (item.Prioridade) {
      // Pequena guarda para evitar chaves 'undefined'
      resultado[item.Prioridade] = (resultado[item.Prioridade] || 0) + 1;
    }
  });
  return resultado;
}

export function getSaudeBacklog(items: BacklogItem[]) {
  // GUARDA: Proteção contra array vazio para evitar crashes
  if (items.length === 0) {
    return {
      total: 0,
      faixa30: 0,
      faixa60: 0,
      faixa90: 0,
      faixa90mais: 0,
      idade_media: 0,
      mais_antigo: 0,
      projeto_mais_antigo: {
        chave: "N/A",
        titulo: "Nenhum",
        prioridade: "N/A",
        dias: 0,
      },
    };
  }

  const total = items.length;
  const faixa30 = items.filter((item) => item["Dias no Backlog"] <= 30).length;
  const faixa60 = items.filter(
    (item) => item["Dias no Backlog"] > 30 && item["Dias no Backlog"] <= 60
  ).length;
  const faixa90 = items.filter(
    (item) => item["Dias no Backlog"] > 60 && item["Dias no Backlog"] <= 90
  ).length;
  const faixa90mais = items.filter(
    (item) => item["Dias no Backlog"] > 90
  ).length;
  const idade_media = Math.round(
    items.reduce((acc, item) => acc + item["Dias no Backlog"], 0) / (total || 1)
  );
  // CORREÇÃO: Math.max em array vazio retorna -Infinity. Adicionar 0 como valor base.
  const mais_antigo = Math.max(
    0,
    ...items.map((item) => item["Dias no Backlog"])
  );

  // Agora seguro por causa da guarda no início da função
  const projeto_mais_antigo = items.reduce((antigo, atual) =>
    atual["Dias no Backlog"] > antigo["Dias no Backlog"] ? atual : antigo
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

// (As funções abaixo já são seguras para arrays vazios)

export function getEpicosPorArea(items: BacklogItem[]) {
  const resultado: Record<string, Record<string, number>> = {};
  items.forEach((item) => {
    const epico = item.Épico;
    const area = item["Unidade / Departamento"] || "Não informado";
    if (!epico) return;
    if (!resultado[area]) resultado[area] = {};
    if (!resultado[area][epico]) resultado[area][epico] = 0;
    resultado[area][epico]++;
  });
  return resultado;
}

export function getCardsPorArea(items: BacklogItem[]) {
  const resultado: Record<string, number> = {};
  items.forEach((item) => {
    const area = item["Unidade / Departamento"] || "Não informado";
    resultado[area] = (resultado[area] || 0) + 1;
  });
  return resultado;
}

export function getProjetosPorSolicitante(items: BacklogItem[]) {
  const resultado: Record<string, Set<string>> = {};
  items.forEach((item) => {
    const solicitante = item.Solicitante || "Não informado";
    const epico = item.Épico;
    if (!epico) return;
    if (!resultado[solicitante]) resultado[solicitante] = new Set();
    resultado[solicitante].add(epico);
  });
  const final: Record<string, number> = {};
  Object.entries(resultado).forEach(([solicitante, epicos]) => {
    final[solicitante] = epicos.size;
  });
  return final;
}

export function getCardsPorSolicitante(items: BacklogItem[]) {
  const resultado: Record<string, number> = {};
  items.forEach((item) => {
    const solicitante = item.Solicitante || "Não informado";
    resultado[solicitante] = (resultado[solicitante] || 0) + 1;
  });
  return resultado;
}

// Função principal que agora chama as funções robustas
export function calculateBacklogMetrics(items: BacklogItem[]) {
  return {
    basic: calculateBasicMetrics(items),
    fila_atual: getFilaAtual(items),
    fila_por_projeto: getFilaPorProjeto(items),
    epicos_por_prioridade: getEpicosPorPrioridade(items),
    tarefas_por_prioridade: getTarefasPorPrioridade(items),
    saude_backlog: getSaudeBacklog(items),
    epicos_por_area: getEpicosPorArea(items),
    cards_por_area: getCardsPorArea(items),
    projetos_por_solicitante: getProjetosPorSolicitante(items),
    cards_por_solicitante: getCardsPorSolicitante(items),
  };
}

// Constantes para o dashboard
export const BACKLOG_METRICS = {
  // Constantes serão adicionadas aqui
};
