/**
 * backlogMetrics.ts
 *
 * Este arquivo contém funções utilitárias para calcular métricas do backlog:
 * 1. Métricas básicas (total de cards, projetos, etc.)
 * 2. Saúde do backlog (distribuição por idade)
 * 3. Filas e ordenação (fila atual, fila por projeto)
 * 4. Distribuições (por área, solicitante, prioridade)
 *
 * Principais funções:
 * - calculateBasicMetrics: Calcula métricas básicas do backlog
 * - getSaudeBacklog: Analisa a saúde do backlog por idade
 * - getFilaAtual: Gera a fila atual de cards
 * - getFilaPorProjeto: Gera uma fila com um card por projeto
 * - calculateAverageTime: Calcula o tempo médio na fila
 */

import {
  JiraCard,
  TimeMetric,
  BasicMetrics,
  QueueItem,
} from "../types/backlog";
import { differenceInSeconds } from "date-fns";

// Função para calcular métricas básicas
function calculateBasicMetrics(items: JiraCard[]): BasicMetrics {
  const uniqueProjects = new Set(items.map((item) => item.Projeto));
  const firstProject =
    items.length > 0 && items[0].Projeto
      ? {
          projeto: items[0].Projeto,
          departamento: items[0]["Unidade / Departamento"],
          prioridade: items[0].Prioridade,
          chave: items[0].Chave,
        }
      : null;

  return {
    total_cards: items.length,
    total_projetos: uniqueProjects.size,
    primeiro_projeto: firstProject,
  };
}

// Fila atual: todos os cards
function getFilaAtual(items: JiraCard[]): QueueItem[] {
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
function getFilaPorProjeto(items: JiraCard[]): QueueItem[] {
  const cards = items.filter(
    (item) => item.Tipo !== "Subtarefa" && item.Projeto
  );
  const projetosUnicos = new Map<string, JiraCard>();

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

export function getProjetosPorPrioridade(items: JiraCard[]) {
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

export function getSaudeBacklog(items: JiraCard[]) {
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

export function getProjetosPorArea(items: JiraCard[]) {
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

export function getCardsPorArea(items: JiraCard[]) {
  const resultado: Record<string, number> = {};
  items.forEach((item) => {
    const area = item["Unidade / Departamento"] || "Não informado";
    resultado[area] = (resultado[area] || 0) + 1;
  });
  return resultado;
}

export function getProjetosPorSolicitante(items: JiraCard[]) {
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
export function calculateBacklogMetrics(items: JiraCard[]) {
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

// Função para formatar tempo em segundos para dias, horas, minutos e segundos
function formatTime(seconds: number): TimeMetric {
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds: remainingSeconds,
  };
}

// Calcula o tempo médio na fila para um conjunto de itens do backlog
export function calculateAverageTime(items: JiraCard[]): TimeMetric {
  if (!items.length) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const totalSeconds = items.reduce((total, item) => {
    const created = new Date(item["Data de Criação"]);
    const now = new Date();
    return total + differenceInSeconds(now, created);
  }, 0);

  return formatTime(Math.floor(totalSeconds / items.length));
}

// Função para calcular métricas de tempo
export const calculateTimeMetrics = (cards: JiraCard[]): TimeMetric => {
  let totalSeconds = 0;
  let totalCards = 0;

  cards.forEach((card) => {
    if (card["Dias no Backlog"]) {
      totalSeconds += card["Dias no Backlog"] * 24 * 60 * 60; // Convertendo dias para segundos
      totalCards++;
    }
  });

  const averageSeconds = totalCards > 0 ? totalSeconds / totalCards : 0;
  const days = Math.floor(averageSeconds / (24 * 60 * 60));
  const hours = Math.floor((averageSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((averageSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(averageSeconds % 60);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

// Função para calcular métricas de filas
export const calculateQueueMetrics = (cards: JiraCard[]): QueueItem[] => {
  const queueMap = new Map<string, JiraCard[]>();

  cards.forEach((card) => {
    const queue = card["Unidade / Departamento"] || "Sem Fila";
    if (!queueMap.has(queue)) {
      queueMap.set(queue, []);
    }
    queueMap.get(queue)?.push(card);
  });

  return Array.from(queueMap.entries()).map(([name, cards]) => ({
    name,
    count: cards.length,
    chave: cards[0].Chave,
    titulo: cards[0].Título,
    prioridade: cards[0].Prioridade,
    projeto: cards[0].Projeto,
    area: cards[0]["Unidade / Departamento"],
  }));
};
