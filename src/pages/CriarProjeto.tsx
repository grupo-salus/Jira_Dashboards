import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCamposProjeto } from "../api/api_jira";
import { criarProjetoJira } from "../api/api_jira";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  Target,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import FormSidebar from "../components/CriarProjeto/FormSidebar";
import FormSections from "../components/CriarProjeto/FormSections";
import {
  getFieldInfo,
  organizarCamposPorSecao,
} from "../components/CriarProjeto/formUtils";
import {
  CAMPOS_FORMULARIO,
  getCamposObrigatoriosSecao,
} from "../components/CriarProjeto/constants";

const sections = [
  { id: 1, title: "Informações do Solicitante", icon: Users },
  { id: 2, title: "Sobre a Solicitação", icon: FileText },
  { id: 3, title: "Estratégia e Priorização", icon: Target },
  { id: 4, title: "Viabilidade", icon: DollarSign },
  { id: 5, title: "Complementar", icon: MessageSquare },
  { id: 6, title: "Confirmação", icon: CheckCircle },
];

const CriarProjeto: React.FC = () => {
  const navigate = useNavigate();
  const [campos, setCampos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentSection, setCurrentSection] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

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

  const secoes = organizarCamposPorSecao(campos);

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <FormSections
            campos={secoes.solicitante}
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldInfo={getFieldInfo}
          />
        );
      case 2:
        return (
          <FormSections
            campos={secoes.solicitacao}
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldInfo={getFieldInfo}
          />
        );
      case 3:
        return (
          <FormSections
            campos={secoes.estrategia}
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldInfo={getFieldInfo}
          />
        );
      case 4:
        return (
          <FormSections
            campos={secoes.viabilidade}
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldInfo={getFieldInfo}
          />
        );
      case 5:
        return (
          <FormSections
            campos={secoes.complementar}
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldInfo={getFieldInfo}
          />
        );
      case 6:
        return (
          <FormSections
            campos={secoes.confirmacao}
            formData={formData}
            handleInputChange={handleInputChange}
            getFieldInfo={getFieldInfo}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos os campos obrigatórios
    const camposObrigatorios = CAMPOS_FORMULARIO.OBRIGATORIOS;

    const camposVazios: string[] = [];
    const camposPreenchidos: string[] = [];

    camposObrigatorios.forEach((campoKey) => {
      const valor = formData[campoKey];
      const campo = campos.find((c) => c.key === campoKey);
      const fieldInfo = getFieldInfo(campoKey, campo?.label || campoKey);

      // Verificar se o campo está vazio
      let estaVazio = false;

      if (!valor) {
        estaVazio = true;
      } else if (typeof valor === "string" && valor.trim() === "") {
        estaVazio = true;
      } else if (Array.isArray(valor) && valor.length === 0) {
        estaVazio = true;
      } else if (typeof valor === "object" && valor !== null) {
        // Para campos de select (objetos com id/label)
        if (Array.isArray(valor)) {
          // Para arrays (como checkbox)
          if (valor.length === 0) {
            estaVazio = true;
          }
        } else if (!valor.id && !valor.label) {
          // Para objetos de select sem id ou label
          estaVazio = true;
        }
      }

      if (estaVazio) {
        camposVazios.push(fieldInfo.label);
      } else {
        camposPreenchidos.push(fieldInfo.label);
      }
    });

    // Só mostrar alert se todos os campos obrigatórios estiverem preenchidos
    if (camposVazios.length === 0) {
      setShowConfirmModal(true);
      return;
    }

    // Encontrar a primeira seção com campos obrigatórios faltando
    let primeiraSecaoComFalta = 1;

    // Verificar cada seção para encontrar a primeira com campos faltando
    for (let secaoId = 1; secaoId <= 6; secaoId++) {
      const camposObrigatoriosSecao = getCamposObrigatoriosSecao(secaoId);

      if (camposObrigatoriosSecao.length > 0) {
        const temCamposFaltando = camposObrigatoriosSecao.some((campoKey) => {
          const valor = formData[campoKey];
          return (
            !valor ||
            (typeof valor === "string" && valor.trim() === "") ||
            (Array.isArray(valor) && valor.length === 0)
          );
        });

        if (temCamposFaltando) {
          primeiraSecaoComFalta = secaoId;
          break;
        }
      }
    }

    // Navegar para a primeira seção com campos faltando
    setCurrentSection(primeiraSecaoComFalta);

    const mensagem =
      `Existem ${camposVazios.length} campos obrigatórios não preenchidos.\n\n` +
      `Campos faltando:\n` +
      camposVazios.map((campo) => `• ${campo}`).join("\n") +
      `\n\nPor favor, preencha todos os campos obrigatórios antes de enviar.`;

    setFeedback({ success: false, message: mensagem });
    setCurrentSection(primeiraSecaoComFalta);
  };

  // Função para enviar para o backend
  const enviarProjeto = async () => {
    setSending(true);
    setShowConfirmModal(false);
    try {
      // O backend espera os campos do projeto diretamente (payload do Pydantic)
      const response = await criarProjetoJira(formData);

      // Verificar se o projeto foi criado com sucesso
      if (response.success === true && response.data) {
        setFeedback({
          success: true,
          message: `Projeto criado com sucesso!\n\nChave: ${response.data.key}\nID: ${response.data.id}`,
        });

        // Limpar todos os campos do formulário
        setFormData({});

        // Voltar para a primeira seção
        setCurrentSection(1);
      } else {
        // Caso o response não tenha o formato esperado de sucesso
        setFeedback({
          success: false,
          message: response.error || "Erro desconhecido ao criar projeto.",
        });
      }
    } catch (err: any) {
      const errorMessage = err.message || "Erro desconhecido ao criar projeto.";
      setFeedback({ success: false, message: errorMessage });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Carregando campos do formulario...
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
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Formulário de Solicitação de Projeto
              </h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Espaço de Projetos
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Introdução */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-blue-900 dark:text-blue-100 font-semibold mb-2">
                Informações Importantes
              </h2>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Por favor, preencha este formulário com o máximo de clareza
                possível. Ele é essencial para garantir que sua solicitação seja
                analisada corretamente pelo PMO e Tecnologia.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Navegação */}
          <div className="lg:col-span-1">
            <FormSidebar
              sections={sections}
              currentSection={currentSection}
              setCurrentSection={setCurrentSection}
              formData={formData}
              _campos={campos}
              _getFieldInfo={getFieldInfo}
            />
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentSection}. {sections[currentSection - 1]?.title}
                  </h2>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(currentSection / sections.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                {renderSection()}
              </div>
              {/* Botões de Navegação */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSection(Math.max(1, currentSection - 1))
                  }
                  disabled={currentSection === 1}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  {currentSection < sections.length ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentSection(
                          Math.min(sections.length, currentSection + 1)
                        )
                      }
                      className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                      Próximo
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Criar Projeto</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Confirmar abertura de projeto
            </h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">
              Deseja realmente abrir este projeto?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                disabled={sending}
              >
                Não
              </button>
              <button
                onClick={enviarProjeto}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={sending}
              >
                Sim, abrir projeto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Feedback */}
      {feedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-lg w-full">
            <div className="flex items-center mb-4">
              {feedback.success ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              )}
              <h2
                className={`text-xl font-bold ${
                  feedback.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback.success
                  ? "Projeto criado com sucesso"
                  : "Formulário incompleto"}
              </h2>
            </div>
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-left">
                {feedback.message}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setFeedback(null)}
                className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriarProjeto;
