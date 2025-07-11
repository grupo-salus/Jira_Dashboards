export const SUPPORT_CONFIG = {
  website: "https://suporte.gruposalus.com.br",
  email: "chamados@gruposalus.com.br",
  phone: "(11) 1234-5678",
  hours: "Segunda a Sexta, 8h às 18h",
  subject: "Erro no Dashboard Jira",
} as const;

export const getSupportEmailBody = (error: string, dashboard?: string) => {
  const dashboardInfo = dashboard ? `\nDashboard: ${dashboard}` : '';
  return `Erro: ${error}${dashboardInfo}\n\nData: ${new Date().toLocaleString()}\n\nPor favor, descreva o que estava fazendo quando o erro ocorreu:`;
};

export const getSupportEmailSubject = (dashboard?: string) => {
  const dashboardInfo = dashboard ? ` - ${dashboard}` : '';
  return `${SUPPORT_CONFIG.subject}${dashboardInfo}`;
}; 