import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PriorityDistributionProps {
  data: Record<string, number>;
}

const PriorityDistribution: React.FC<PriorityDistributionProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value
    }));
  }, [data]);

  const colors = [
    '#2563EB', // Blue
    '#7C3AED', // Purple
    '#EC4899', // Pink
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#8B5CF6', // Violet
    '#F97316', // Orange
    '#14B8A6'  // Teal
  ];

  return (
    <div className="card h-full">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Prioridade</h2>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} cards`, 'Quantidade']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
};

export default PriorityDistribution;