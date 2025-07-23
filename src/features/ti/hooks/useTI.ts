// Hook temporariamente desabilitado - Dashboard TI em desenvolvimento
interface UseTIReturn {
  data: any | null;
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  refetch: () => void;
}

export const useTI = (): UseTIReturn => {
  // Retorna estado vazio para evitar chamadas desnecessárias
  return {
    data: null,
    loading: false,
    error: null,
    errorCode: null,
    refetch: () => {
      console.log("Dashboard TI em desenvolvimento - refetch desabilitado");
    },
  };
};
