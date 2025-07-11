import { useTheme } from "@/shared/context/ThemeContext";
import { AlertTriangle, RefreshCw, MessageCircle } from "lucide-react";
import { SUPPORT_CONFIG } from "@/shared/constants/support";

interface ErrorScreenProps {
  error?: string;
  errorCode?: string | null;
  onRetry?: () => void;
  onContactSupport?: () => void;
}

export const ErrorScreen = ({
  error = "Erro ao carregar dados",
  errorCode,
  onRetry,
  onContactSupport,
}: ErrorScreenProps) => {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen px-6 py-12 flex items-center justify-center"
      style={{ backgroundColor: theme.bg.base }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ backgroundColor: theme.bg.muted }}
          >
            <AlertTriangle
              size={32}
              style={{ color: theme.text.error || "#ef4444" }}
            />
          </div>
        </div>

        {/* Error Message */}
        <h1
          className="text-3xl font-bold mb-4"
          style={{ color: theme.text.title }}
        >
          Ops! Algo deu errado
        </h1>

        <p
          className="text-lg mb-4 max-w-2xl mx-auto"
          style={{ color: theme.text.subtitle }}
        >
          {error}
        </p>

        {errorCode && (
          <p
            className="text-sm mb-12 opacity-70"
            style={{ color: theme.text.subtitle }}
          >
            Código do erro: {errorCode}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.brand.primary,
                color: theme.text.inverse,
              }}
            >
              <RefreshCw size={18} />
              Tentar Novamente
            </button>
          )}

          {onContactSupport && (
            <button
              onClick={onContactSupport}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200"
              style={{
                backgroundColor: theme.bg.surface,
                color: theme.text.title,
                border: `1px solid ${theme.border.base}`,
              }}
            >
              <MessageCircle size={18} />
              Contactar Suporte
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8">
          <p className="text-sm" style={{ color: theme.text.subtitle }}>
            Se o problema persistir, verifique sua conexão com a internet ou
            acesse{" "}
            <a
              href={SUPPORT_CONFIG.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity"
              style={{ color: theme.brand.primary }}
            >
              {SUPPORT_CONFIG.website}
            </a>{" "}
            para abrir um chamado.
          </p>
        </div>
      </div>
    </div>
  );
};
