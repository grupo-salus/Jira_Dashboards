// Arquivo vazio - será implementado futuramente

// Exportação temporária para tornar o arquivo um módulo válido
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pt-BR");
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString("pt-BR");
};
