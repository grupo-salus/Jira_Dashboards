import { CAMPOS_FORMULARIO, CUSTOM_FIELDS, JIRA_FIELDS } from "./constants";

// Interface para os campos do Jira
interface CampoJira {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: Array<{ id: string; label: string }>;
}

// Função para verificar se um campo é obrigatório (combinando API + customização)
export const isCampoObrigatorio = (
  campoKey: string,
  requiredFromAPI: boolean
): boolean => {
  // Se está na lista de obrigatórios customizados, sempre é obrigatório
  if (CAMPOS_FORMULARIO.OBRIGATORIOS.includes(campoKey)) {
    return true;
  }

  // Caso contrário, usa a obrigatoriedade da API
  return requiredFromAPI;
};

export const getFieldInfo = (key: string, originalLabel: string) => {
  const fieldInfo: Record<string, any> = {
    [CUSTOM_FIELDS.NOME_SOLICITANTE]: {
      label: "Nome completo do solicitante",
      placeholder: "Digite seu nome completo",
      description: "Nome completo da pessoa que está solicitando o projeto",
    },
    [CUSTOM_FIELDS.EMAIL_SOLICITANTE]: {
      label: "E-mail corporativo",
      placeholder: "seu.email@empresa.com",
      description: "E-mail corporativo para contato e acompanhamento",
    },
    [CUSTOM_FIELDS.DEPARTAMENTO_SOLICITANTE]: {
      label: "Departamento / Unidade solicitante",
      placeholder: "Selecione seu departamento",
      description: "Departamento ou unidade responsável pela solicitação",
    },
    [CUSTOM_FIELDS.DIRETOR_RESPONSAVEL]: {
      label: "Diretor responsável pela aprovação",
      placeholder: "Nome do diretor responsável",
      description: "Diretor que deve aprovar esta solicitação",
    },
    [JIRA_FIELDS.SUMMARY]: {
      label: "Nome ou Título do Projeto",
      placeholder: "Ex: Sistema de Gestão de Clientes",
      description: "Escolha um nome claro e objetivo para a demanda",
    },
    [CUSTOM_FIELDS.OBJETIVO_PROJETO]: {
      label: "Objetivo do Projeto",
      placeholder:
        "Descreva o problema ou oportunidade que deu origem à solicitação...",
      description:
        "Qual é o propósito? Que problema resolve ou que oportunidade aproveita?",
      rows: 4,
    },
    [JIRA_FIELDS.DESCRIPTION]: {
      label: "Descrição do Projeto",
      placeholder:
        "Detalhe o que está sendo solicitado. Inclua áreas envolvidas, necessidades, contexto atual...",
      description:
        "Detalhe completo do que está sendo solicitado. Inclua áreas envolvidas, necessidades, contexto atual, origens da solicitação",
      rows: 6,
    },
    [CUSTOM_FIELDS.ESCOPO_INICIAL]: {
      label: "Escopo Inicial ou Solução Proposta pela Área",
      placeholder:
        "O que se espera como entrega? Há alguma sugestão de como a solução deve ser feita?",
      description:
        "O que se espera como entrega? Há alguma sugestão de como a solução deve ser feita?",
      rows: 4,
    },
    [CUSTOM_FIELDS.STAKEHOLDERS]: {
      label: "Stakeholders Diretos ou Equipes Envolvidas",
      placeholder: "Quem deverá participar ou será impactado diretamente?",
      description: "Quem deverá participar ou será impactado diretamente?",
      rows: 3,
    },
    [CUSTOM_FIELDS.TIPO_PROJETO]: {
      label: "Tipo de Projeto",
      placeholder: "Selecione o tipo de projeto",
      description: "Categoria que melhor define o tipo de projeto",
    },
    [JIRA_FIELDS.PRIORITY]: {
      label: "Prioridade da Solicitação",
      placeholder: "Selecione a prioridade",
      description: "Nível de urgência e importância da solicitação",
    },
    [CUSTOM_FIELDS.PRAZO_DESEJADO]: {
      label: "Prazo Desejado ou Restrição Temporal",
      placeholder: "Selecione a data limite",
      description:
        "Existe alguma data-limite ou evento atrelado a essa demanda?",
    },
    [CUSTOM_FIELDS.IMPACTO_ESPERADO]: {
      label: "Impacto Esperado",
      placeholder: "Selecione o impacto esperado",
      description: "Área principal que será impactada com a implementação",
    },
    [CUSTOM_FIELDS.BENEFICIOS_ESPERADOS]: {
      label: "Benefícios Esperados (Resumo)",
      placeholder: "Resultados positivos esperados após a implementação...",
      description: "Resultados positivos esperados após a implementação",
      rows: 4,
    },
    [CUSTOM_FIELDS.RISCOS_CONHECIDOS]: {
      label: "Riscos Conhecidos ou Percebidos pela Área",
      placeholder:
        "Existe algum risco previsto, interno ou externo, com essa solicitação?",
      description:
        "Existe algum risco previsto, interno ou externo, com essa solicitação?",
      rows: 4,
    },
    [CUSTOM_FIELDS.ESTIMATIVA_CUSTO]: {
      label: "Estimativa de Custo (se conhecido)",
      placeholder: "0.00",
      description:
        "Pode incluir valores aproximados ou limitações orçamentárias",
    },
    [CUSTOM_FIELDS.ORCAMENTO_RESERVADO]: {
      label: "Existe orçamento reservado para este projeto?",
      placeholder: "Selecione uma opção",
      description: "Informe se já existe orçamento aprovado para este projeto",
    },
    [CUSTOM_FIELDS.OBSERVACOES_ADICIONAIS]: {
      label: "Observações adicionais",
      placeholder:
        "Use este campo para incluir qualquer informação relevante que não foi contemplada acima...",
      description:
        "Use este campo para incluir qualquer informação relevante que não foi contemplada acima",
      rows: 4,
    },
    [CUSTOM_FIELDS.CONFIRMACAO_RESPONSABILIDADE]: {
      label: "Confirmação de Responsabilidade",
      placeholder: "",
      description:
        "Ao marcar esta opção, declaro que as informações fornecidas foram validadas com minha liderança imediata e com o diretor responsável",
    },
  };
  return (
    fieldInfo[key] || {
      label: originalLabel,
      placeholder: `Digite ${originalLabel.toLowerCase()}`,
      description: "",
    }
  );
};

export const organizarCamposPorSecao = (campos: CampoJira[]) => {
  const secoes: {
    solicitante: CampoJira[];
    solicitacao: CampoJira[];
    estrategia: CampoJira[];
    viabilidade: CampoJira[];
    complementar: CampoJira[];
    confirmacao: CampoJira[];
  } = {
    solicitante: [],
    solicitacao: [],
    estrategia: [],
    viabilidade: [],
    complementar: [],
    confirmacao: [],
  };

  campos.forEach((campo) => {
    const key = campo.key;

    // Usar as constantes centralizadas para organizar os campos
    if (CAMPOS_FORMULARIO.SECOES.SOLICITANTE.campos.includes(key)) {
      secoes.solicitante.push(campo);
    } else if (CAMPOS_FORMULARIO.SECOES.SOLICITACAO.campos.includes(key)) {
      secoes.solicitacao.push(campo);
    } else if (CAMPOS_FORMULARIO.SECOES.ESTRATEGIA.campos.includes(key)) {
      secoes.estrategia.push(campo);
    } else if (CAMPOS_FORMULARIO.SECOES.VIABILIDADE.campos.includes(key)) {
      secoes.viabilidade.push(campo);
    } else if (CAMPOS_FORMULARIO.SECOES.COMPLEMENTAR.campos.includes(key)) {
      secoes.complementar.push(campo);
    } else if (CAMPOS_FORMULARIO.SECOES.CONFIRMACAO.campos.includes(key)) {
      secoes.confirmacao.push(campo);
    }
  });

  return secoes;
};
