import React, { useState, useEffect } from 'react';
import { fetchSprintSummary, SprintSummary } from '../api/api_jira';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = [
  '#2563EB', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B',
  '#10B981', '#06B6D4', '#8B5CF6', '#F97316', '#14B8A6'
];

const SprintDashboard: React.FC = () => {
  const [data, setData] = useState<SprintSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSprintSummary()
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  if (error) return <div className="h-screen flex items-center justify-center text-error-500">Erro: {error}</div>;
  if (!data) return <div className="h-screen flex items-center justify-center">Nenhum dado disponível</div>;

  // Gráfico de status
  const statusData = Object.entries(data.por_status).map(([status, value]) => ({ status, value }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Sprint Ativa - Resumo</h1>
      {/* Cards de Resumo Geral */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-3xl font-bold">{data.resumo_geral.total_cards}</div>
          <div className="text-xs text-gray-500">Total de Cards</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-success-500">{data.resumo_geral.entregues_no_prazo}</div>
          <div className="text-xs text-gray-500">Entregues no Prazo</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-error-500">{data.resumo_geral.fora_do_prazo}</div>
          <div className="text-xs text-gray-500">Fora do Prazo</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold">{data.resumo_geral.percentual_no_prazo}%</div>
          <div className="text-xs text-gray-500">% no Prazo</div>
        </div>
      </div>

      {/* Gráfico de Status */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-2">Distribuição por Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} layout="vertical" margin={{ top: 10, right: 30, left: 1, bottom: 10 }}>
              <XAxis type="number" tick={{ fill: '#fff', fontSize: 14 }} />
              <YAxis type="category" dataKey="status" width={180} tick={{ fill: '#fff', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value">
                {statusData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela de Desenvolvedores */}
      <div className="card mb-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Resumo por Desenvolvedor</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-2 py-1 text-left">Dev</th>
              <th className="px-2 py-1">Cards</th>
              <th className="px-2 py-1">Horas Gastas</th>
              <th className="px-2 py-1">Entregues no Prazo</th>
              <th className="px-2 py-1">Fora do Prazo</th>
              <th className="px-2 py-1">% no Prazo</th>
            </tr>
          </thead>
          <tbody>
            {data.por_desenvolvedor.map((dev, idx) => (
              <tr key={dev["Responsável (Dev)"] + idx} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-2 py-1">{dev["Responsável (Dev)"] || <span className="italic text-gray-400">Não informado</span>}</td>
                <td className="px-2 py-1 text-center">{dev.qtd_cards}</td>
                <td className="px-2 py-1 text-center">{dev.horas_gastas}</td>
                <td className="px-2 py-1 text-center text-success-500">{dev.entregues_no_prazo}</td>
                <td className="px-2 py-1 text-center text-error-500">{dev.fora_do_prazo}</td>
                <td className="px-2 py-1 text-center">{dev.percentual_no_prazo}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top 5 Mais Estourados */}
      <div className="card mb-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-2">Top 5 Mais Estourados</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-2 py-1 text-left">Chave</th>
              <th className="px-2 py-1 text-left">Título</th>
              <th className="px-2 py-1 text-left">Dev</th>
              <th className="px-2 py-1 text-center">Tempo Gasto (h)</th>
            </tr>
          </thead>
          <tbody>
            {data.top_5_mais_estourados.map((item, idx) => (
              <tr key={item.Chave + idx} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-2 py-1">{item.Chave}</td>
                <td className="px-2 py-1">{item.Título}</td>
                <td className="px-2 py-1">{item["Responsável (Dev)"]}</td>
                <td className="px-2 py-1 text-center">{item["Tempo Gasto (horas)"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SprintDashboard; 