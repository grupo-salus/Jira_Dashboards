interface ErrorMapping {
  pattern: string | RegExp;
  message: string;
  type: 'network' | 'server' | 'auth' | 'data' | 'unknown';
  code: string;
}

const ERROR_MAPPINGS: ErrorMapping[] = [
  // Erros de rede/conexão
  {
    pattern: /Unexpected token '<', "<!DOCTYPE "... is not valid JSON/,
    message: "Servidor não está acessível. Verifique se o backend está rodando.",
    type: 'network',
    code: 'BACKEND_OFFLINE'
  },
  {
    pattern: /Failed to fetch/,
    message: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
    type: 'network',
    code: 'NETWORK_FAILED'
  },
  {
    pattern: /Network Error/,
    message: "Erro de rede. Verifique sua conexão com a internet.",
    type: 'network',
    code: 'NETWORK_ERROR'
  },
  {
    pattern: /ERR_NETWORK/,
    message: "Erro de conexão com o servidor.",
    type: 'network',
    code: 'ERR_NETWORK'
  },
  {
    pattern: /ERR_CONNECTION_REFUSED/,
    message: "Servidor não está respondendo. Tente novamente em alguns instantes.",
    type: 'network',
    code: 'CONNECTION_REFUSED'
  },
  {
    pattern: /ERR_EMPTY_RESPONSE/,
    message: "Servidor retornou uma resposta vazia.",
    type: 'server',
    code: 'EMPTY_RESPONSE'
  },
  {
    pattern: /ERR_INTERNET_DISCONNECTED/,
    message: "Sem conexão com a internet. Verifique sua rede.",
    type: 'network',
    code: 'NO_INTERNET'
  },

  // Erros de servidor
  {
    pattern: /500/,
    message: "Erro interno do servidor. Nossa equipe foi notificada.",
    type: 'server',
    code: 'SERVER_500'
  },
  {
    pattern: /502/,
    message: "Servidor temporariamente indisponível. Tente novamente em alguns minutos.",
    type: 'server',
    code: 'SERVER_502'
  },
  {
    pattern: /503/,
    message: "Serviço temporariamente indisponível. Estamos fazendo manutenção.",
    type: 'server',
    code: 'SERVER_503'
  },
  {
    pattern: /504/,
    message: "Tempo limite da conexão. Tente novamente.",
    type: 'server',
    code: 'SERVER_504'
  },

  // Erros de autenticação
  {
    pattern: /401/,
    message: "Sessão expirada. Faça login novamente.",
    type: 'auth',
    code: 'AUTH_401'
  },
  {
    pattern: /403/,
    message: "Acesso negado. Verifique suas permissões.",
    type: 'auth',
    code: 'AUTH_403'
  },

  // Erros de dados
  {
    pattern: /Unexpected token/,
    message: "Erro na resposta do servidor. Tente novamente.",
    type: 'data',
    code: 'DATA_PARSE_ERROR'
  },
  {
    pattern: /JSON/,
    message: "Erro ao processar dados. Tente novamente.",
    type: 'data',
    code: 'JSON_ERROR'
  },
  {
    pattern: /SyntaxError/,
    message: "Erro na resposta do servidor. Tente novamente.",
    type: 'data',
    code: 'SYNTAX_ERROR'
  },

  // Erros de timeout
  {
    pattern: /timeout/,
    message: "Tempo limite excedido. Tente novamente.",
    type: 'network',
    code: 'TIMEOUT'
  },
  {
    pattern: /ETIMEDOUT/,
    message: "Conexão expirou. Verifique sua internet.",
    type: 'network',
    code: 'ETIMEDOUT'
  },
];

export const mapErrorMessage = (error: unknown): string => {
  const errorString = error instanceof Error ? error.message : String(error);
  
  // Procura por um mapeamento específico
  for (const mapping of ERROR_MAPPINGS) {
    if (mapping.pattern.test(errorString)) {
      return mapping.message;
    }
  }

  // Se não encontrar mapeamento específico, retorna mensagem genérica
  return "Erro inesperado. Tente novamente ou entre em contato com o suporte.";
};

export const mapErrorWithCode = (error: unknown): { message: string; code: string } => {
  const errorString = error instanceof Error ? error.message : String(error);
  
  // Procura por um mapeamento específico
  for (const mapping of ERROR_MAPPINGS) {
    if (mapping.pattern.test(errorString)) {
      return {
        message: mapping.message,
        code: mapping.code
      };
    }
  }

  // Se não encontrar mapeamento específico, retorna mensagem genérica
  return {
    message: "Erro inesperado. Tente novamente ou entre em contato com o suporte.",
    code: 'UNKNOWN_ERROR'
  };
};

export const getErrorType = (error: unknown): 'network' | 'server' | 'auth' | 'data' | 'unknown' => {
  const errorString = error instanceof Error ? error.message : String(error);
  
  for (const mapping of ERROR_MAPPINGS) {
    if (mapping.pattern.test(errorString)) {
      return mapping.type;
    }
  }

  return 'unknown';
};

export const isNetworkError = (error: unknown): boolean => {
  return getErrorType(error) === 'network';
};

export const isServerError = (error: unknown): boolean => {
  return getErrorType(error) === 'server';
};

export const isAuthError = (error: unknown): boolean => {
  return getErrorType(error) === 'auth';
}; 