import React, { useMemo } from 'react';
import { BacklogItem } from '../../types/backlog';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PriorityDistributionProps {
  backlogItems: BacklogItem[];
}

const PRIORITY_COLORS = {
  'Highest': '#EF4444',
  'High': '#F97316',
  'Medium': '#F59E0B',
  'Low': '#3B82F6',
  'Lowest': '#10B981'
};

const PriorityDistribution: React.FC<PriorityDistributionProps> = ({ backlogItems }) => {
  const priorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    backlogItems.forEach(item => {
      const priority = item.Prioridade;
      counts[priority] = (counts[priority] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [backlogItems]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="card h-[300px]">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Prioridade</h2>
      
      {priorityData.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={priorityData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="80%"
              innerRadius="40%"
              fill="#8884d8"
              dataKey="value"
            >
              {priorityData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || '#BFBFBF'} 
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} cards`, 'Quantidade']} />
            <Legend formatter={(value) => <span className="text-sm">{value}</span>} />
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