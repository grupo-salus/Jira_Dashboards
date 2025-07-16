// Dados de exemplo para teste do formulário de criação de projeto
// Este arquivo pode ser facilmente editado ou removido após os testes

export const dadosExemplo = {
  // Seção 1 - Solicitante
  customfield_10093: "Luis Henrique Gomes da Fonseca", // Nome completo do solicitante
  customfield_10247: "luis.fonseca@empresa.com", // E-mail corporativo
  customfield_10245: { id: "10467", label: "TI" }, // Departamento / Unidade solicitante (TI)
  customfield_10250: "Caio Livier", // Diretor responsável pela aprovação

  // Seção 2 - Solicitação
  summary: "TESTE VIA PYTHON CAMPO SUMMARY", // Nome ou Título do Projeto
  customfield_10481: "TESTE VIA PYTHON CAMPO 10481 OBJETIVO", // Objetivo do Projeto
  description: "TESTE VIA PYTHON CAMPO 10476 DESCRIÇÃO", // Descrição do Projeto
  customfield_10476:
    "TESTE VIA PYTHON CAMPO 10476 ESCopo Inicial ou Solução Proposta", // Escopo Inicial ou Solução Proposta
  customfield_10477:
    "TESTE VIA PYTHON CAMPO 10477 Stakeholders Diretos ou Equipes Envolvidas", // Stakeholders Diretos ou Equipes Envolvidas

  // Seção 3 - Estratégia
  customfield_10478: { id: "10698", label: "Estratégico" }, // Tipo de Projeto (Estratégico)
  priority: { id: "2", label: "Alta" }, // Prioridade da Solicitação (Alta)
  customfield_10479: "2024-06-30", // Prazo Desejado ou Restrição Temporal
  customfield_10480: { id: "10702", label: "Financeiro" }, // Impacto Esperado (Financeiro)
  customfield_10248: "TESTE VIA PYTHON CAMPO 10248 BENEFÍCIOS ESPERADOS", // Benefícios Esperados

  // Seção 4 - Viabilidade
  customfield_10482: "TESTE VIA PYTHON CAMPO 10482 RISCOS CONHECIDOS", // Riscos Conhecidos
  customfield_10483: 150000.0, // Estimativa de Custo (número, não string)
  customfield_10484: { id: "10709", label: "Sim" }, // Existe orçamento reservado (Sim)

  // Seção 5 - Complementar
  customfield_10485: "TESTE VIA PYTHON CAMPO 10485 OBSERVAÇÕES ADICIONAIS", // Observações adicionais

  // Seção 6 - Confirmação
  customfield_10486: ["10712"], // Confirmação de Responsabilidade (array com ID)
};

// Função para preencher dados de exemplo
export const preencherDadosExemplo = (setFormData: (data: any) => void) => {
  setFormData(dadosExemplo);

  // Log no console para debug
  console.log("=== DADOS DE EXEMPLO PREENCHIDOS ===");
  console.log("Total de campos preenchidos:", Object.keys(dadosExemplo).length);
  console.log("Dados:", dadosExemplo);
};
