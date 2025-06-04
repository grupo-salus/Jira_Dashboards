export interface BacklogItem {
  ID: string;
  Chave: string;
  Título: string;
  Tipo: string;
  Status: string;
  'Data de Criação': string;
  'Última Atualização': string;
  'Prioridade Calculada': number;
  'Relator Técnico': string;
  'Grupo Solicitante': string;
  'Unidade / Departamento': string;
  Solicitante: string;
  Sprint: string;
  'Responsável (Dev)': string;
  'Estimativa Original (segundos)': number;
  'Controle de Tempo (segundos)': number;
  Prioridade: string;
  Branch: string;
  'Backlog (nome)': string;
  Versão: string;
  Descrição: string;
  
  // Derived fields (calculated)
  timeInQueue?: string;
  progressPercentage?: number;
  estimatedCompletion?: string;
}

export type PriorityType = 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';

export type GroupType = 'Franqueado' | 'Franqueadora';

export type DepartmentType = 
  | 'TI'
  | 'Marketing'
  | 'Vendas'
  | 'Financeiro'
  | 'RH'
  | 'Operações'
  | 'Jurídico'
  | 'Atendimento ao Cliente'
  | 'P&D'
  | 'Logística';

export interface BacklogFilter {
  priority: PriorityType | 'All';
  department: DepartmentType | 'All';
  requestGroup: GroupType | 'All';
  requestor: string | 'All';
  searchTerm: string;
}

export interface TimeMetric {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}