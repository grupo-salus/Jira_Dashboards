import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { BacklogSummary } from '../../types/backlog';
import { formatPercentage, formatHours, getPriorityColorClass } from '../../utils/formatters';
import {
  CardsIcon,
  EpicIcon,
  NoEpicIcon,
  CalendarIcon,
  ClockIcon,
  FireIcon,
  CompassIcon
} from '../icons/DashboardIcons';

// Componente para os KPI Cards (Scorecards)
export const KPICards: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  const { colors } = useTheme();
  
  const kpis = [
    {
      title: 'Total de Cards',
      value: data.total_cards,
      icon: <CardsIcon className="text-primary-600" size={32} />,
      color: colors.primary[600],
      description: 'Total de cards no backlog'
    },
    {
      title: 'Total de Épicos Únicos',
      value: data.total_epicos_unicos,
      icon: <EpicIcon className="text-primary-500" size={32} />,
      color: colors.primary[500],
      description: 'Número de épicos diferentes'
    },
    {
      title: 'Cards Sem Épico',
      value: data.total_cards_sem_epico,
      icon: <NoEpicIcon className="text-error" size={32} />,
      color: colors.error,
      description: 'Cards não associados a épicos'
    },
    {
      title: 'Idade Média do Backlog',
      value: `${data.saude_do_backlog.idade_media_dias} dias`,
      icon: <CalendarIcon className="text-warning" size={32} />,
      color: colors.warning,
      description: 'Tempo médio no backlog'
    },
    {
      title: 'Card Mais Antigo',
      value: `${data.saude_do_backlog.card_mais_antigo_dias} dias`,
      icon: <ClockIcon className="text-error" size={32} />,
      color: colors.error,
      description: 'Tempo do card mais antigo'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {kpis.map((kpi, index) => (
        <div key={index} className="card flex items-center p-4">
          <div className="mr-3">{kpi.icon}</div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.title}</div>
            <div className="text-2xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs text-gray-400">{kpi.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Componente para o gráfico de distribuição de prioridade (Donut Chart)
export const PriorityDistributionChart: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  const { colors } = useTheme();
  
  const priorityColors = {
    'Highest': colors.error,
    'High': colors.warning,
    'Medium': colors.primary[500],
    'Low': colors.primary[300],
    'Lowest': colors.success
  };

  const chartData = Object.entries(data.distribuicao_geral_de_prioridade).map(([priority, count]) => ({
    name: priority,
    value: count,
    color: priorityColors[priority as keyof typeof priorityColors]
  }));

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Distribuição de Prioridade</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              label={({ name, percent }) => `${name} (${formatPercentage(percent * 100)})`}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para o gráfico de distribuição por status (Barras Horizontais)
export const StatusDistributionChart: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  const { colors } = useTheme();
  
  const chartData = Object.entries(data.distribuicao_por_status)
    .map(([status, count]) => ({
      status,
      count
    }))
    .sort((a, b) => b.count - a.count); // Ordena do maior para o menor

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Status</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="status" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill={colors.primary[500]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para o gráfico de distribuição por idade (Barras Verticais)
export const AgeDistributionChart: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  const { colors } = useTheme();
  
  const chartData = Object.entries(data.saude_do_backlog.distribuicao_por_idade)
    .map(([range, count]) => ({
      range,
      count
    }))
    .sort((a, b) => {
      // Ordena as faixas de idade corretamente
      const getDays = (range: string) => {
        if (range === "91+ dias") return 91;
        return parseInt(range.split("-")[0]);
      };
      return getDays(a.range) - getDays(b.range);
    });

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Idade do Backlog</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={colors.primary[500]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para o gráfico de carga de trabalho por departamento (Barras Horizontais)
export const WorkloadByDepartmentChart: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  const { colors } = useTheme();
  
  const chartData = Object.keys(data.carga_de_trabalho_por_departamento.total_cards)
    .map(dept => ({
      department: dept,
      cards: data.carga_de_trabalho_por_departamento.total_cards[dept],
      hours: data.carga_de_trabalho_por_departamento.horas_estimadas[dept]
    }))
    .sort((a, b) => b.cards - a.cards); // Ordena do maior para o menor

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Carga de Trabalho por Departamento</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="department" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="cards" name="Total de Cards" fill={colors.primary[500]} />
            <Bar dataKey="hours" name="Horas Estimadas" fill={colors.warning} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para o heatmap de prioridade por departamento
export const PriorityByDepartmentHeatmap: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  const { colors } = useTheme();
  
  const departments = Object.keys(data.relacao_departamento_vs_prioridade);
  const priorities = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];

  return (
    <div className="card mb-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Prioridade por Departamento</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Departamento</th>
            {priorities.map(priority => (
              <th key={priority} className="px-4 py-2">{priority}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {departments.map(dept => (
            <tr key={dept}>
              <td className="px-4 py-2 font-medium">{dept}</td>
              {priorities.map(priority => {
                const value = data.relacao_departamento_vs_prioridade[dept]?.[priority] || 0;
                const intensity = Math.min(value / 10, 1); // Normaliza para 0-1
                return (
                  <td
                    key={`${dept}-${priority}`}
                    className="px-4 py-2 text-center"
                    style={{
                      backgroundColor: `rgba(${colors.primary[500]}, ${intensity})`,
                      color: intensity > 0.5 ? 'white' : 'inherit'
                    }}
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Componente para o gráfico de distribuição por épico (Barras Empilhadas)
export const EpicDistributionChart: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  const { colors } = useTheme();
  
  const priorities = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
  const priorityColors = {
    'Highest': colors.error,
    'High': colors.warning,
    'Medium': colors.primary[500],
    'Low': colors.primary[300],
    'Lowest': colors.success
  };

  const chartData = Object.entries(data.distribuicao_prioridade_por_epico)
    .map(([epic, priorities]) => ({
      epic,
      ...priorities
    }))
    .sort((a, b) => {
      // Ordena pelo total de cards (soma de todas as prioridades)
      const getTotal = (obj: any) => priorities.reduce((sum, p) => sum + (obj[p] || 0), 0);
      return getTotal(b) - getTotal(a);
    });

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Épico</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="epic" />
            <YAxis />
            <Tooltip />
            <Legend />
            {priorities.map((priority, index) => (
              <Bar
                key={priority}
                dataKey={priority}
                name={priority}
                stackId="a"
                fill={priorityColors[priority as keyof typeof priorityColors]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Componente para a tabela de cards sem épico
export const CardsWithoutEpicTable: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  const cardsWithoutEpic = data.resumo_geral_cards
    .filter(card => !card.Épico)
    .sort((a, b) => {
      // Ordena por prioridade (Highest primeiro)
      const priorityOrder = { 'Highest': 0, 'High': 1, 'Medium': 2, 'Low': 3, 'Lowest': 4 };
      return priorityOrder[a.Prioridade as keyof typeof priorityOrder] - priorityOrder[b.Prioridade as keyof typeof priorityOrder];
    });

  return (
    <div className="card mb-6">
      <h2 className="text-lg font-semibold mb-4">Cards Sem Épico</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full backlog-table">
          <thead>
            <tr>
              <th>Chave</th>
              <th>Título</th>
              <th>Prioridade</th>
              <th>Departamento</th>
            </tr>
          </thead>
          <tbody>
            {cardsWithoutEpic.map(card => (
              <tr key={card.Chave}>
                <td>{card.Chave}</td>
                <td>{card.Título}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-sm ${getPriorityColorClass(card.Prioridade)}`}>
                    {card.Prioridade}
                  </span>
                </td>
                <td>{card["Unidade / Departamento"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para destacar o primeiro da fila
export const QueueHighlights: React.FC<{ data: BacklogSummary }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {data.primeiro_card_na_fila && (
        <div className="card p-4">
          <div className="flex items-center mb-2">
            <FireIcon className="text-error mr-2" size={24} />
            <h3 className="text-lg font-semibold">Card Mais Antigo</h3>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Chave: {data.primeiro_card_na_fila.Chave}</div>
          <div className="font-medium">{data.primeiro_card_na_fila.Título}</div>
          <div className="mt-2">
            <span className={`px-2 py-1 rounded text-sm ${getPriorityColorClass(data.primeiro_card_na_fila.Prioridade)}`}>
              {data.primeiro_card_na_fila.Prioridade}
            </span>
          </div>
        </div>
      )}
      
      {data.primeiro_projeto_na_fila && (
        <div className="card p-4">
          <div className="flex items-center mb-2">
            <CompassIcon className="text-primary-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold">Primeiro Projeto</h3>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Chave: {data.primeiro_projeto_na_fila.Chave}</div>
          <div className="font-medium">{data.primeiro_projeto_na_fila.Título}</div>
          <div className="mt-2">
            <span className={`px-2 py-1 rounded text-sm ${getPriorityColorClass(data.primeiro_projeto_na_fila.Prioridade)}`}>
              {data.primeiro_projeto_na_fila.Prioridade}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}; 