import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCamposProjeto } from "../api/api_jira";
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
    // Lógica de envio do formulário
    console.log("Formulário válido:", formData);
  };

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
    </div>
  );
};

export default CriarProjeto;
