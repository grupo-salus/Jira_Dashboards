import React, { ReactNode } from "react";
import { ErrorScreen } from "./ErrorScreen";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { SUPPORT_CONFIG } from "@/shared/constants/support";
import { mapErrorWithCode } from "@/shared/utils/errorMapper";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorScreen
          error={
            mapErrorWithCode(this.state.error?.message || "Erro inesperado")
              .message
          }
          errorCode={
            mapErrorWithCode(this.state.error?.message || "Erro inesperado")
              .code
          }
          onRetry={() => this.setState({ hasError: false, error: null })}
          onContactSupport={() => {
            window.open(SUPPORT_CONFIG.website, "_blank");
          }}
        />
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for functional components
export const useErrorBoundary = () => {
  const errorHandler = useErrorHandler();

  const ErrorWrapper = ({ children }: { children: ReactNode }) => {
    if (errorHandler.hasError) {
      return (
        <ErrorScreen
          error={errorHandler.error || "Erro ao carregar dados"}
          errorCode={errorHandler.errorCode}
          onRetry={() => errorHandler.clearError()}
          onContactSupport={errorHandler.contactSupport}
        />
      );
    }

    return <>{children}</>;
  };

  return {
    ErrorWrapper,
    ...errorHandler,
  };
};
