import { BacklogItem, PriorityType, GroupType, DepartmentType } from '../types/backlog';

const DEPARTMENTS: DepartmentType[] = [
  'TI',
  'Marketing',
  'Vendas',
  'Financeiro',
  'RH',
  'Operações',
  'Jurídico',
  'Atendimento ao Cliente',
  'P&D',
  'Logística'
];

const PRIORITIES: PriorityType[] = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
const GROUPS: GroupType[] = ['Franqueado', 'Franqueadora'];
const STATUSES = ['To Do', 'In Progress', 'Code Review', 'Testing', 'Done', 'Blocked'];

// Developers
const DEVELOPERS = [
  'Carlos Silva',
  'Marina Oliveira',
  'Lucas Souza',
  'Ana Rodrigues',
  'Roberto Ferreira',
  'Julia Mendes'
];

// Requestors
const REQUESTORS = [
  'Marcelo Almeida',
  'Patricia Santos',
  'Fernando Costa',
  'Carla Martins',
  'Eduardo Pereira',
  'Beatriz Nunes',
  'Leonardo Gomes',
  'Gabriela Rocha',
  'Ricardo Duarte',
  'Isabela Fernandes'
];

// Generate random date within the last 30 days
const randomDate = (daysBack: number = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 60),
    Math.floor(Math.random() * 60)
  );
  return date.toISOString();
};

// Generate random backlog items
export const generateMockData = (count: number = 50): BacklogItem[] => {
  const items: BacklogItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    const group = GROUPS[Math.floor(Math.random() * GROUPS.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const developer = DEVELOPERS[Math.floor(Math.random() * DEVELOPERS.length)];
    const requestor = REQUESTORS[Math.floor(Math.random() * REQUESTORS.length)];
    
    const creationDate = randomDate(30);
    const updateDate = randomDate(
      Math.floor((new Date().getTime() - new Date(creationDate).getTime()) / (1000 * 60 * 60 * 24))
    );
    
    const estimateSeconds = Math.floor(Math.random() * 604800); // Up to 1 week in seconds
    const timeSpentSeconds = Math.floor(Math.random() * estimateSeconds);
    
    items.push({
      ID: `ISSUE-${1000 + i}`,
      Chave: `PROJ-${1000 + i}`,
      Título: `Task ${i + 1}: ${getRandomTaskTitle(department)}`,
      Tipo: getIssueType(department),
      Status: status,
      'Data de Criação': creationDate,
      'Última Atualização': updateDate,
      'Prioridade Calculada': Math.floor(Math.random() * 100),
      'Relator Técnico': developer,
      'Grupo Solicitante': group,
      'Unidade / Departamento': department,
      Solicitante: requestor,
      Sprint: `Sprint ${Math.floor(Math.random() * 10) + 1}`,
      'Responsável (Dev)': developer,
      'Estimativa Original (segundos)': estimateSeconds,
      'Controle de Tempo (segundos)': timeSpentSeconds,
      Prioridade: priority,
      Branch: `feature/${department.toLowerCase().replace(' ', '-')}-task-${i + 1}`,
      'Backlog (nome)': `${department} Backlog Q${Math.floor(Math.random() * 4) + 1} 2023`,
      Versão: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}`,
      Descrição: getRandomDescription(department, i)
    });
  }
  
  // Sort by priority calculated (higher is more important)
  return items.sort((a, b) => b['Prioridade Calculada'] - a['Prioridade Calculada']);
};

// Helper function to get random task title based on department
function getRandomTaskTitle(department: string): string {
  const titles: Record<string, string[]> = {
    'TI': [
      'Implementação de novo módulo de segurança',
      'Otimização de performance do banco de dados',
      'Correção de bug no sistema de login',
      'Atualização da API REST',
      'Implementação de novo endpoint'
    ],
    'Marketing': [
      'Criação de campanha digital',
      'Análise de métricas de conversão',
      'Desenvolvimento de novo material para redes sociais',
      'Otimização de SEO',
      'Relatório de performance da campanha'
    ],
    'Vendas': [
      'Implementação de novo fluxo de vendas',
      'Atualização do dashboard de vendas',
      'Criação de relatório mensal',
      'Integração com CRM',
      'Melhoria no processo de qualificação de leads'
    ],
    'Financeiro': [
      'Atualização do sistema de faturamento',
      'Implementação de novo relatório fiscal',
      'Automação do processo de conciliação bancária',
      'Correção no cálculo de impostos',
      'Melhoria na gestão de fluxo de caixa'
    ],
    'RH': [
      'Atualização do sistema de ponto',
      'Implementação de novo processo seletivo',
      'Desenvolvimento de dashboard de performance',
      'Automação de onboarding',
      'Relatório de clima organizacional'
    ],
    'Operações': [
      'Otimização do processo logístico',
      'Implementação de controle de qualidade',
      'Melhoria no sistema de gestão de estoque',
      'Automação do processo de produção',
      'Análise de eficiência operacional'
    ],
    'Jurídico': [
      'Atualização de contratos padrão',
      'Implementação de novo sistema de gestão de processos',
      'Análise de conformidade legal',
      'Automação de geração de documentos',
      'Revisão de políticas internas'
    ],
    'Atendimento ao Cliente': [
      'Melhoria no sistema de tickets',
      'Implementação de chatbot',
      'Análise de satisfação do cliente',
      'Automação de respostas padrão',
      'Desenvolvimento de novo script de atendimento'
    ],
    'P&D': [
      'Prototipagem de novo produto',
      'Pesquisa de mercado para validação',
      'Testes de usabilidade',
      'Desenvolvimento de MVP',
      'Análise de viabilidade técnica'
    ],
    'Logística': [
      'Otimização de rotas de entrega',
      'Implementação de novo sistema de rastreamento',
      'Análise de custos logísticos',
      'Melhoria no processo de armazenamento',
      'Automação de inventário'
    ]
  };
  
  const departmentTitles = titles[department] || ['Nova tarefa'];
  return departmentTitles[Math.floor(Math.random() * departmentTitles.length)];
}

// Helper function to get issue type based on department
function getIssueType(department: string): string {
  const types: Record<string, string[]> = {
    'TI': ['Bug', 'Feature', 'Task', 'Epic', 'Story'],
    'Marketing': ['Campaign', 'Analysis', 'Content', 'Task'],
    'Vendas': ['Process', 'Report', 'Integration', 'Task'],
    'Financeiro': ['Report', 'System', 'Process', 'Bug'],
    'RH': ['Process', 'Report', 'System', 'Task'],
    'Operações': ['Process', 'Optimization', 'Analysis', 'Task'],
    'Jurídico': ['Document', 'Process', 'Analysis', 'Task'],
    'Atendimento ao Cliente': ['Enhancement', 'Process', 'Analysis', 'Task'],
    'P&D': ['Research', 'Prototype', 'Test', 'Analysis'],
    'Logística': ['Optimization', 'System', 'Analysis', 'Process']
  };
  
  const departmentTypes = types[department] || ['Task'];
  return departmentTypes[Math.floor(Math.random() * departmentTypes.length)];
}

// Helper function to generate random descriptions
function getRandomDescription(department: string, index: number): string {
  return `This is a ${department} task that requires attention. 

## Objective
Implement the requested changes to improve system functionality.

## Requirements
- Requirement 1: Update the existing modules
- Requirement 2: Ensure compatibility with current systems
- Requirement 3: Document all changes

## Acceptance Criteria
- The implementation should be tested
- Code should be reviewed by the team
- Documentation should be updated

Task #${index + 1} for ${department} department.`;
}

export const mockBacklogData = generateMockData(50);