// Constantes dos campos do formulário de criação de projeto
// Centraliza todas as referências aos customfields para evitar duplicação

// Campos customizados centralizados
export const CUSTOM_FIELDS = {
  // Seção 1 - Solicitante
  NOME_SOLICITANTE: "customfield_10093",
  EMAIL_SOLICITANTE: "customfield_10247",
  DEPARTAMENTO_SOLICITANTE: "customfield_10245",
  DIRETOR_RESPONSAVEL: "customfield_10250",

  // Seção 2 - Solicitação
  OBJETIVO_PROJETO: "customfield_10481",
  ESCOPO_INICIAL: "customfield_10476",
  STAKEHOLDERS: "customfield_10477",

  // Seção 3 - Estratégia
  TIPO_PROJETO: "customfield_10478",
  PRAZO_DESEJADO: "customfield_10479",
  IMPACTO_ESPERADO: "customfield_10480",
  BENEFICIOS_ESPERADOS: "customfield_10248",

  // Seção 4 - Viabilidade
  RISCOS_CONHECIDOS: "customfield_10482",
  ESTIMATIVA_CUSTO: "customfield_10483",
  ORCAMENTO_RESERVADO: "customfield_10484",

  // Seção 5 - Complementar
  OBSERVACOES_ADICIONAIS: "customfield_10485",

  // Seção 6 - Confirmação
  CONFIRMACAO_RESPONSABILIDADE: "customfield_10486",
} as const;

// Campos padrão do Jira
export const JIRA_FIELDS = {
  SUMMARY: "summary",
  DESCRIPTION: "description",
  PRIORITY: "priority",
} as const;

// Campos organizados por tipo de textarea
export const TEXTAREA_FIELDS = [
  JIRA_FIELDS.DESCRIPTION,
  CUSTOM_FIELDS.OBJETIVO_PROJETO,
  CUSTOM_FIELDS.ESCOPO_INICIAL,
  CUSTOM_FIELDS.STAKEHOLDERS,
  CUSTOM_FIELDS.BENEFICIOS_ESPERADOS,
  CUSTOM_FIELDS.RISCOS_CONHECIDOS,
  CUSTOM_FIELDS.OBSERVACOES_ADICIONAIS,
] as const;

export const CAMPOS_FORMULARIO = {
  // Campos obrigatórios customizados (sobrescrevem a API do Jira)
  OBRIGATORIOS: [
    JIRA_FIELDS.SUMMARY, // Título do Projeto
    CUSTOM_FIELDS.NOME_SOLICITANTE, // Nome completo do solicitante
    CUSTOM_FIELDS.EMAIL_SOLICITANTE, // E-mail corporativo
    CUSTOM_FIELDS.DEPARTAMENTO_SOLICITANTE, // Departamento / Unidade solicitante
    CUSTOM_FIELDS.OBJETIVO_PROJETO, // Objetivo do Projeto
    JIRA_FIELDS.DESCRIPTION, // Descrição do Projeto
    CUSTOM_FIELDS.TIPO_PROJETO, // Tipo de Projeto
    JIRA_FIELDS.PRIORITY, // Prioridade da Solicitação
    CUSTOM_FIELDS.CONFIRMACAO_RESPONSABILIDADE, // Confirmação de Responsabilidade
  ] as string[],

  // Campos organizados por seção
  SECOES: {
    SOLICITANTE: {
      id: 1,
      titulo: "Solicitante",
      campos: [
        CUSTOM_FIELDS.NOME_SOLICITANTE,
        CUSTOM_FIELDS.EMAIL_SOLICITANTE,
        CUSTOM_FIELDS.DEPARTAMENTO_SOLICITANTE,
        CUSTOM_FIELDS.DIRETOR_RESPONSAVEL,
      ] as string[],
      obrigatorios: [
        CUSTOM_FIELDS.NOME_SOLICITANTE,
        CUSTOM_FIELDS.EMAIL_SOLICITANTE,
        CUSTOM_FIELDS.DEPARTAMENTO_SOLICITANTE,
      ] as string[],
    },
    SOLICITACAO: {
      id: 2,
      titulo: "Solicitação",
      campos: [
        JIRA_FIELDS.SUMMARY,
        CUSTOM_FIELDS.OBJETIVO_PROJETO,
        JIRA_FIELDS.DESCRIPTION,
        CUSTOM_FIELDS.ESCOPO_INICIAL,
        CUSTOM_FIELDS.STAKEHOLDERS,
      ] as string[],
      obrigatorios: [
        JIRA_FIELDS.SUMMARY,
        CUSTOM_FIELDS.OBJETIVO_PROJETO,
        JIRA_FIELDS.DESCRIPTION,
      ] as string[],
    },
    ESTRATEGIA: {
      id: 3,
      titulo: "Estratégia",
      campos: [
        CUSTOM_FIELDS.TIPO_PROJETO,
        JIRA_FIELDS.PRIORITY,
        CUSTOM_FIELDS.PRAZO_DESEJADO,
        CUSTOM_FIELDS.IMPACTO_ESPERADO,
        CUSTOM_FIELDS.BENEFICIOS_ESPERADOS,
      ] as string[],
      obrigatorios: [
        CUSTOM_FIELDS.TIPO_PROJETO,
        JIRA_FIELDS.PRIORITY,
      ] as string[],
    },
    VIABILIDADE: {
      id: 4,
      titulo: "Viabilidade",
      campos: [
        CUSTOM_FIELDS.RISCOS_CONHECIDOS,
        CUSTOM_FIELDS.ESTIMATIVA_CUSTO,
        CUSTOM_FIELDS.ORCAMENTO_RESERVADO,
      ] as string[],
      obrigatorios: [] as string[], // Sem campos obrigatórios
    },
    COMPLEMENTAR: {
      id: 5,
      titulo: "Complementar",
      campos: [CUSTOM_FIELDS.OBSERVACOES_ADICIONAIS] as string[],
      obrigatorios: [] as string[], // Sem campos obrigatórios
    },
    CONFIRMACAO: {
      id: 6,
      titulo: "Confirmação",
      campos: [CUSTOM_FIELDS.CONFIRMACAO_RESPONSABILIDADE] as string[],
      obrigatorios: [CUSTOM_FIELDS.CONFIRMACAO_RESPONSABILIDADE] as string[],
    },
  },
};

// Função utilitária para obter todos os campos obrigatórios de uma seção
export const getCamposObrigatoriosSecao = (secaoId: number): string[] => {
  const secoes = Object.values(CAMPOS_FORMULARIO.SECOES);
  const secao = secoes.find((s) => s.id === secaoId);
  return secao?.obrigatorios || [];
};

// Função utilitária para obter todos os campos de uma seção
export const getCamposSecao = (secaoId: number): string[] => {
  const secoes = Object.values(CAMPOS_FORMULARIO.SECOES);
  const secao = secoes.find((s) => s.id === secaoId);
  return secao?.campos || [];
};

// Função utilitária para verificar se uma seção tem campos obrigatórios
export const temCamposObrigatorios = (secaoId: number): boolean => {
  return getCamposObrigatoriosSecao(secaoId).length > 0;
};

// Função utilitária para obter o nome da seção
export const getNomeSecao = (secaoId: number): string => {
  const secoes = Object.values(CAMPOS_FORMULARIO.SECOES);
  const secao = secoes.find((s) => s.id === secaoId);
  return secao?.titulo || `Seção ${secaoId}`;
};
