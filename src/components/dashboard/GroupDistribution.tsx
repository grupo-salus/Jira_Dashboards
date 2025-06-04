import React, { useMemo } from 'react';
import { BacklogItem } from '../../types/backlog';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface GroupDistributionProps {
  backlogItems: BacklogItem[];
}

const GroupDistribution: React.FC<GroupDistributionProps> = ({ backlogItems }) => {
  const groupData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    backlogItems.forEach(item => {
      const group = item['Grupo Solicitante'];
      counts[group] = (counts[group] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  }, [backlogItems]);
  
  const colors = ['#7C3AED', '#2563EB'];

  return (
    <div className="card h-[300px]">
      <h2 className="text-lg font-semibold mb-4">Distribuição por Grupo Solicitante</h2>
      
      {groupData.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={groupData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis 
              dataKey="name" 
              angle={0}
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickCount={5}
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
              {groupData.map((entry, index) => (
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

export default GroupDistribution;