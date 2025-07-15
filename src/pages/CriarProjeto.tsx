import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCamposProjeto } from "../api/api_jira";

interface CampoJira {
  key: string;
  label: string;
  type: string;
  required: boolean;
  options?: Array<{ id: string; label: string }>;
}

const CriarProjeto: React.FC = () => {
  const navigate = useNavigate();
  const [campos, setCampos] = useState<CampoJira[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchCamposProjetoData();
  }, []);

  const fetchCamposProjetoData = async () => {
    try {
      setLoading(true);
      const fields = await fetchCamposProjeto();
      setCampos(fields);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Função para obter informações específicas de cada campo
  const getFieldInfo = (key: string, originalLabel: string) => {
    const fieldInfo: Record<
      string,
      {
        label: string;
        placeholder: string;
        description: string;
        rows?: number;
      }
    > = {
      // 1. Informações do Solicitante
      customfield_10093: {
        label: "Nome completo do solicitante",
        placeholder: "Digite seu nome completo",
        description: "Nome completo da pessoa que está solicitando o projeto",
      },
      customfield_10247: {
        label: "E-mail corporativo",
        placeholder: "seu.email@empresa.com",
        description: "E-mail corporativo para contato e acompanhamento",
      },
      customfield_10245: {
        label: "Departamento / Unidade solicitante",
        placeholder: "Selecione seu departamento",
        description: "Departamento ou unidade responsável pela solicitação",
      },
      customfield_10250: {
        label: "Diretor responsável pela aprovação",
        placeholder: "Nome do diretor responsável",
        description: "Diretor que deve aprovar esta solicitação",
      },

      // 2. Sobre a Solicitação
      summary: {
        label: "Nome ou Título do Projeto",
        placeholder: "Ex: Sistema de Gestão de Clientes",
        description: "Escolha um nome claro e objetivo para a demanda",
      },
      customfield_10481: {
        label: "Objetivo do Projeto",
        placeholder:
          "Descreva o problema ou oportunidade que deu origem à solicitação...",
        description:
          "Qual é o propósito? Que problema resolve ou que oportunidade aproveita?",
        rows: 4,
      },
      description: {
        label: "Descrição do Projeto",
        placeholder:
          "Detalhe o que está sendo solicitado. Inclua áreas envolvidas, necessidades, contexto atual...",
        description:
          "Detalhe completo do que está sendo solicitado. Inclua áreas envolvidas, necessidades, contexto atual, origens da solicitação",
        rows: 6,
      },
      customfield_10476: {
        label: "Escopo Inicial ou Solução Proposta pela Área",
        placeholder:
          "O que se espera como entrega? Há alguma sugestão de como a solução deve ser feita?",
        description:
          "O que se espera como entrega? Há alguma sugestão de como a solução deve ser feita?",
        rows: 4,
      },
      customfield_10477: {
        label: "Stakeholders Diretos ou Equipes Envolvidas",
        placeholder: "Quem deverá participar ou será impactado diretamente?",
        description: "Quem deverá participar ou será impactado diretamente?",
        rows: 3,
      },

      // 3. Estratégia e Priorização
      customfield_10478: {
        label: "Tipo de Projeto",
        placeholder: "Selecione o tipo de projeto",
        description: "Categoria que melhor define o tipo de projeto",
      },
      priority: {
        label: "Prioridade da Solicitação",
        placeholder: "Selecione a prioridade",
        description: "Nível de urgência e importância da solicitação",
      },
      customfield_10479: {
        label: "Prazo Desejado ou Restrição Temporal",
        placeholder: "Selecione a data limite",
        description:
          "Existe alguma data-limite ou evento atrelado a essa demanda?",
      },
      customfield_10480: {
        label: "Impacto Esperado",
        placeholder: "Selecione o impacto esperado",
        description: "Área principal que será impactada com a implementação",
      },
      customfield_10248: {
        label: "Benefícios Esperados (Resumo)",
        placeholder: "Resultados positivos esperados após a implementação...",
        description: "Resultados positivos esperados após a implementação",
        rows: 4,
      },
      customfield_10482: {
        label: "Riscos Conhecidos ou Percebidos pela Área",
        placeholder:
          "Existe algum risco previsto, interno ou externo, com essa solicitação?",
        description:
          "Existe algum risco previsto, interno ou externo, com essa solicitação?",
        rows: 4,
      },

      // 4. Viabilidade
      customfield_10483: {
        label: "Estimativa de Custo (se conhecido)",
        placeholder: "0.00",
        description:
          "Pode incluir valores aproximados ou limitações orçamentárias",
      },
      customfield_10484: {
        label: "Existe orçamento reservado para este projeto?",
        placeholder: "Selecione uma opção",
        description:
          "Informe se já existe orçamento aprovado para este projeto",
      },

      // 5. Complementar
      customfield_10485: {
        label: "Observações adicionais",
        placeholder:
          "Use este campo para incluir qualquer informação relevante que não foi contemplada acima...",
        description:
          "Use este campo para incluir qualquer informação relevante que não foi contemplada acima",
        rows: 4,
      },

      // 6. Confirmação
      customfield_10486: {
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

  const renderField = (campo: CampoJira) => {
    const { key, type, required, options } = campo;
    const fieldInfo = getFieldInfo(key, campo.label);

    switch (type) {
      case "string":
        // Para campos de texto longo, usar textarea
        if (
          [
            "description",
            "customfield_10481",
            "customfield_10476",
            "customfield_10477",
            "customfield_10248",
            "customfield_10482",
            "customfield_10485",
          ].includes(key)
        ) {
          return (
            <div key={key} className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {fieldInfo.label}{" "}
                {required && <span className="text-red-500">*</span>}
              </label>
              {fieldInfo.description && (
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
                  {fieldInfo.description}
                </p>
              )}
              <textarea
                rows={fieldInfo.rows || 4}
                value={formData[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                required={required}
                placeholder={fieldInfo.placeholder}
              />
            </div>
          );
        }

        // Para campos de texto simples
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {fieldInfo.label}{" "}
              {required && <span className="text-red-500">*</span>}
            </label>
            {fieldInfo.description && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
                {fieldInfo.description}
              </p>
            )}
            <input
              type="text"
              value={formData[key] || ""}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required={required}
              placeholder={fieldInfo.placeholder}
            />
          </div>
        );

      case "date":
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {fieldInfo.label}{" "}
              {required && <span className="text-red-500">*</span>}
            </label>
            {fieldInfo.description && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
                {fieldInfo.description}
              </p>
            )}
            <input
              type="date"
              value={formData[key] || ""}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required={required}
            />
          </div>
        );

      case "number":
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {fieldInfo.label}{" "}
              {required && <span className="text-red-500">*</span>}
            </label>
            {fieldInfo.description && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
                {fieldInfo.description}
              </p>
            )}
            <input
              type="number"
              value={formData[key] || ""}
              onChange={(e) =>
                handleInputChange(key, parseFloat(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required={required}
              placeholder={fieldInfo.placeholder}
            />
          </div>
        );

      case "option":
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {fieldInfo.label}{" "}
              {required && <span className="text-red-500">*</span>}
            </label>
            {fieldInfo.description && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
                {fieldInfo.description}
              </p>
            )}
            <select
              value={formData[key]?.id || ""}
              onChange={(e) =>
                handleInputChange(
                  key,
                  e.target.value ? { id: e.target.value } : null
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required={required}
            >
              <option value="">{fieldInfo.placeholder}</option>
              {options?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "priority":
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {fieldInfo.label}{" "}
              {required && <span className="text-red-500">*</span>}
            </label>
            {fieldInfo.description && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
                {fieldInfo.description}
              </p>
            )}
            <select
              value={formData[key]?.id || ""}
              onChange={(e) =>
                handleInputChange(
                  key,
                  e.target.value ? { id: e.target.value } : null
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required={required}
            >
              <option value="">{fieldInfo.placeholder}</option>
              {options?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "array":
        // Para checkbox (como o campo de confirmação)
        return (
          <div key={key} className="mb-6">
            <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={formData[key]?.includes("10712") || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleInputChange(key, ["10712"]);
                  } else {
                    handleInputChange(key, []);
                  }
                }}
                className="w-4 h-4 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                required={required}
              />
              <div className="flex-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {fieldInfo.label}{" "}
                  {required && <span className="text-red-500">*</span>}
                </span>
                {fieldInfo.description && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {fieldInfo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={key} className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {fieldInfo.label}{" "}
              {required && <span className="text-red-500">*</span>}
            </label>
            {fieldInfo.description && (
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 italic">
                {fieldInfo.description}
              </p>
            )}
            <input
              type="text"
              value={formData[key] || ""}
              onChange={(e) => handleInputChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required={required}
              placeholder={fieldInfo.placeholder}
            />
          </div>
        );
    }
  };

  const organizarCamposPorSecao = (campos: CampoJira[]) => {
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

      // 1. Informações do Solicitante
      if (
        [
          "customfield_10093",
          "customfield_10247",
          "customfield_10245",
          "customfield_10250",
        ].includes(key)
      ) {
        secoes.solicitante.push(campo);
      }
      // 2. Sobre a Solicitação
      else if (
        [
          "summary",
          "customfield_10481",
          "description",
          "customfield_10476",
          "customfield_10477",
        ].includes(key)
      ) {
        secoes.solicitacao.push(campo);
      }
      // 3. Estratégia e Priorização
      else if (
        [
          "customfield_10478",
          "priority",
          "customfield_10479",
          "customfield_10480",
          "customfield_10248",
          "customfield_10482",
        ].includes(key)
      ) {
        secoes.estrategia.push(campo);
      }
      // 4. Viabilidade
      else if (["customfield_10483", "customfield_10484"].includes(key)) {
        secoes.viabilidade.push(campo);
      }
      // 5. Complementar
      else if (["customfield_10485"].includes(key)) {
        secoes.complementar.push(campo);
      }
      // 6. Confirmação
      else if (["customfield_10486"].includes(key)) {
        secoes.confirmacao.push(campo);
      }
    });

    return secoes;
  };

  // Atualizar a função renderSecao para melhor organização visual
  const renderSecao = (titulo: string, campos: CampoJira[]) => (
    <div key={titulo} className="mb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {titulo}
        </h2>
        <div className="w-20 h-1 bg-blue-500 rounded"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {campos.map(renderField)}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Carregando campos do projeto...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Erro</div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Formulário de Solicitação de Projeto
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Espaço de Projetos
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Por favor, preencha este formulário com o máximo de clareza
                possível. Ele é essencial para garantir que sua solicitação seja
                analisada corretamente pelo PMO e Tecnologia.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
              ← Voltar
            </button>
          </div>

          <form className="space-y-8">
            {campos.length > 0 && (
              <>
                {renderSecao(
                  "1. Informações do Solicitante",
                  organizarCamposPorSecao(campos).solicitante
                )}
                {renderSecao(
                  "2. Sobre a Solicitação",
                  organizarCamposPorSecao(campos).solicitacao
                )}
                {renderSecao(
                  "3. Estratégia e Priorização",
                  organizarCamposPorSecao(campos).estrategia
                )}
                {renderSecao(
                  "4. Viabilidade (Se houver informações iniciais)",
                  organizarCamposPorSecao(campos).viabilidade
                )}
                {renderSecao(
                  "5. Complementar",
                  organizarCamposPorSecao(campos).complementar
                )}
                {renderSecao(
                  "6. Confirmação",
                  organizarCamposPorSecao(campos).confirmacao
                )}
              </>
            )}

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Criar Projeto (Em desenvolvimento)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CriarProjeto;
