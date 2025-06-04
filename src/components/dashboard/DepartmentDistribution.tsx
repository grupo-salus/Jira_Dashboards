import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DepartmentDistributionProps {
  data: Record<string, number>;
}

const DepartmentDistribution: React.FC<DepartmentDistributionProps> = ({ 
  data
}) => {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([name, value]) => ({
        name: name && name.trim() !== '' ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : 'Não informado',
        value
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);
  
  // Detecta tema atual de forma confiável

  // Generate rainbow-like colors
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Distribuição por Departamento</h2>
      </div>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="95%">
          <BarChart
            data={chartData}
           
            layout="vertical"
            margin={{ top: 10, right: 30, left: 1, bottom: 10 }}
          >
            <XAxis type="number" tick={{ fill: '#fff', fontSize: 14 }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={180}
              tick={props => (
                <g>
                  <rect x={10} y={props.y - 10} width={160} height={22} rx={6} fill="#222" opacity={0.7} />
                  <text
                    x={18}
                    y={props.y + 6}
                    textAnchor="start"
                    fontSize={12}
                    fill="#fff"
                    style={{ fontWeight: 500 }}
                  >
                    {props.payload.value}
                  </text>
                </g>
              )}
              interval={0}
              tickLine={false}
              style={{ whiteSpace: 'nowrap', overflow: 'visible' }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" label={{ position: 'right', fill: '#fff', fontSize: 16, fontWeight: 'bold' }}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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

export default DepartmentDistribution;