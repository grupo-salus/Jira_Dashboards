// Constantes dos campos do formulário de criação de projeto
// Centraliza todas as referências aos customfields para evitar duplicação

export const CAMPOS_FORMULARIO = {
  // Campos obrigatórios customizados (sobrescrevem a API do Jira)
  OBRIGATORIOS: [
    "summary", // Título do Projeto
    "customfield_10093", // Nome completo do solicitante
    "customfield_10247", // E-mail corporativo
    "customfield_10245", // Departamento / Unidade solicitante
    "customfield_10481", // Objetivo do Projeto
    "description", // Descrição do Projeto
    "customfield_10478", // Tipo de Projeto
    "priority", // Prioridade da Solicitação
    "customfield_10486", // Confirmação de Responsabilidade
  ],

  // Campos organizados por seção
  SECOES: {
    SOLICITANTE: {
      id: 1,
      titulo: "Solicitante",
      campos: [
        "customfield_10093", // Nome completo do solicitante
        "customfield_10247", // E-mail corporativo
        "customfield_10245", // Departamento / Unidade solicitante
        "customfield_10250", // Diretor responsável pela aprovação
      ],
      obrigatorios: [
        "customfield_10093", // Nome completo do solicitante
        "customfield_10247", // E-mail corporativo
        "customfield_10245", // Departamento / Unidade solicitante
      ],
    },
    SOLICITACAO: {
      id: 2,
      titulo: "Solicitação",
      campos: [
        "summary", // Nome ou Título do Projeto
        "customfield_10481", // Objetivo do Projeto
        "description", // Descrição do Projeto
        "customfield_10476", // Escopo Inicial ou Solução Proposta
        "customfield_10477", // Stakeholders Diretos ou Equipes Envolvidas
      ],
      obrigatorios: [
        "summary", // Nome ou Título do Projeto
        "customfield_10481", // Objetivo do Projeto
        "description", // Descrição do Projeto
      ],
    },
    ESTRATEGIA: {
      id: 3,
      titulo: "Estratégia",
      campos: [
        "customfield_10478", // Tipo de Projeto
        "priority", // Prioridade da Solicitação
        "customfield_10479", // Prazo Desejado ou Restrição Temporal
        "customfield_10480", // Impacto Esperado
        "customfield_10248", // Benefícios Esperados (Resumo)
      ],
      obrigatorios: [
        "customfield_10478", // Tipo de Projeto
        "priority", // Prioridade da Solicitação
      ],
    },
    VIABILIDADE: {
      id: 4,
      titulo: "Viabilidade",
      campos: [
        "customfield_10482", // Riscos Conhecidos ou Percebidos
        "customfield_10483", // Estimativa de Custo
        "customfield_10484", // Existe orçamento reservado
      ],
      obrigatorios: [], // Sem campos obrigatórios
    },
    COMPLEMENTAR: {
      id: 5,
      titulo: "Complementar",
      campos: [
        "customfield_10485", // Observações adicionais
      ],
      obrigatorios: [], // Sem campos obrigatórios
    },
    CONFIRMACAO: {
      id: 6,
      titulo: "Confirmação",
      campos: [
        "customfield_10486", // Confirmação de Responsabilidade
      ],
      obrigatorios: [
        "customfield_10486", // Confirmação de Responsabilidade
      ],
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
