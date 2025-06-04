import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface GroupDistributionProps {
  data: Record<string, number>;
}

const GroupDistribution: React.FC<GroupDistributionProps> = ({ data }) => {
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
      <h2 className="text-lg font-semibold mb-4">Distribuição por Status</h2>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
            layout="vertical"
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              dataKey="name" 
              type="category"
              tick={{ fontSize: 11 }}
              width={100}
            />
            <Tooltip 
              formatter={(value) => [`${value} cards`, 'Quantidade']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
};

export default GroupDistribution;