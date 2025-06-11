import { Card, Metrics } from "../types/backlog";

// Interface para os totalizadores básicos
interface BacklogBasicMetrics {
  total_cards: number;
  total_projetos: number;
  idade_media_dias: number;
  card_mais_antigo: {
    dias: number;
    chave: string;
    titulo: string;
    projeto: string | null;
  };
  primeiro_projeto: {
    chave: string;
    titulo: string;
    projeto: string;
    departamento: string;
    prioridade: string;
  } | null;
}

// Tipo para os itens da fila
export interface FilaItem {
  chave: string;
  titulo: string;
  prioridade: string;
  projeto: string | null;
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
      total_projetos: 0,
      idade_media_dias: 0,
      card_mais_antigo: {
        dias: 0,
        chave: "N/A",
        titulo: "Nenhum card encontrado",
        projeto: null,
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
      total_projetos: 0,
      idade_media_dias: 0,
      card_mais_antigo: {
        dias: 0,
        chave: "N/A",
        titulo: "Apenas subtarefas",
        projeto: null,
      },
      primeiro_projeto: null,
    };
  }

  // Total de cards
  const total_cards = items.length;

  // Total de projetos únicos (excluindo nulos)
  const total_projetos = new Set(
    cards.map((item) => item.Projeto).filter(Boolean)
  ).size;

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

  // Encontrar o primeiro projeto (primeiro card com projeto)
  const primeiro_projeto = cards.find((item) => item.Projeto !== null) || null;

  return {
    total_cards,
    total_projetos,
    idade_media_dias,
    card_mais_antigo: {
      dias: card_mais_antigo["Dias no Backlog"],
      chave: card_mais_antigo.Chave,
      titulo: card_mais_antigo.Título,
      projeto: card_mais_antigo.Projeto,
    },
    primeiro_projeto: primeiro_projeto
      ? {
          chave: primeiro_projeto.Chave,
          titulo: primeiro_projeto.Título,
          projeto: primeiro_projeto.Projeto || "", // Garante que não seja nulo
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
      projeto: item.Projeto,
      area: item["Unidade / Departamento"],
    }));
}

// Fila por projeto: um card por projeto
function getFilaPorProjeto(items: BacklogItem[]): FilaItem[] {
  const cards = items.filter(
    (item) => item.Tipo !== "Subtarefa" && item.Projeto
  );
  const projetosUnicos = new Map<string, BacklogItem>();

  cards.forEach((item) => {
    if (!projetosUnicos.has(item.Projeto!)) {
      projetosUnicos.set(item.Projeto!, item);
    }
  });

  return Array.from(projetosUnicos.values()).map((item) => ({
    chave: item.Chave,
    titulo: item.Título,
    prioridade: item.Prioridade,
    projeto: item.Projeto,
    area: item["Unidade / Departamento"],
  }));
}

export function getProjetosPorPrioridade(items: BacklogItem[]) {
  const projetosUnicos = new Map<string, { prioridade: string }>();
  items.forEach((item) => {
    if (item.Projeto && item.Projeto !== "Sem Projeto") {
      if (!projetosUnicos.has(item.Projeto)) {
        projetosUnicos.set(item.Projeto, { prioridade: item.Prioridade });
      }
    }
  });
  const resultado: Record<string, number> = {};
  projetosUnicos.forEach(({ prioridade }) => {
    resultado[prioridade] = (resultado[prioridade] || 0) + 1;
  });
  return resultado;
}

export function getSaudeBacklog(items: BacklogItem[]) {
  // GUARDA: Se a lista estiver vazia, retorna um objeto padrão seguro
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
        projeto: "N/A",
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
  const mais_antigo = Math.max(
    0,
    ...items.map((item) => item["Dias no Backlog"])
  );

  const projeto_mais_antigo = items.reduce((mais_antigo, atual) => {
    return atual["Dias no Backlog"] > mais_antigo["Dias no Backlog"]
      ? atual
      : mais_antigo;
  });

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
      projeto: projeto_mais_antigo.Projeto || "N/A",
    },
  };
}

export function getProjetosPorArea(items: BacklogItem[]) {
  const resultado: Record<string, Record<string, number>> = {};
  items.forEach((item) => {
    const projeto = item.Projeto;
    const area = item["Unidade / Departamento"] || "Não informado";
    if (!projeto || projeto === "Sem Projeto") return;
    if (!resultado[area]) resultado[area] = {};
    if (!resultado[area][projeto]) resultado[area][projeto] = 0;
    resultado[area][projeto]++;
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
    const projeto = item.Projeto;
    if (!projeto || projeto === "Sem Projeto") return;
    if (!resultado[solicitante]) resultado[solicitante] = new Set();
    resultado[solicitante].add(projeto);
  });
  const final: Record<string, number> = {};
  Object.entries(resultado).forEach(([solicitante, projetos]) => {
    final[solicitante] = projetos.size;
  });
  return final;
}

// Função principal que agora chama as funções robustas
export function calculateBacklogMetrics(items: BacklogItem[]) {
  return {
    basic: calculateBasicMetrics(items),
    fila_atual: getFilaAtual(items),
    fila_por_projeto: getFilaPorProjeto(items),
    projetos_por_prioridade: getProjetosPorPrioridade(items),
    saude_backlog: getSaudeBacklog(items),
    projetos_por_area: getProjetosPorArea(items),
    cards_por_area: getCardsPorArea(items),
    projetos_por_solicitante: getProjetosPorSolicitante(items),
  };
}

// Constantes para o dashboard
export const BACKLOG_METRICS = {
  // Constantes serão adicionadas aqui
};
