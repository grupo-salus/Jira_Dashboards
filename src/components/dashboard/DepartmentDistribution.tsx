import React, { useMemo } from 'react';
import { BacklogItem, DepartmentType } from '../../types/backlog';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface DepartmentDistributionProps {
  backlogItems: BacklogItem[];
  onDepartmentClick: (department: DepartmentType | 'All') => void;
}

const DepartmentDistribution: React.FC<DepartmentDistributionProps> = ({ 
  backlogItems,
  onDepartmentClick 
}) => {
  const departmentData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    backlogItems.forEach(item => {
      const department = item['Unidade / Departamento'];
      counts[department] = (counts[department] || 0) + 1;
    });
    
    return Object.keys(counts)
      .map(key => ({
        name: key,
        value: counts[key]
      }))
      .sort((a, b) => b.value - a.value);
  }, [backlogItems]);
  
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
    <div className="card h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Distribuição por Departamento</h2>
        <button 
          onClick={() => onDepartmentClick('All')}
          className="text-xs text-primary-600 hover:underline"
        >
          Ver todos
        </button>
      </div>
      
      {departmentData.length > 0 ? (
        <ResponsiveContainer width="100%" height="85%">
          <BarChart
            data={departmentData}
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
              onClick={(data) => onDepartmentClick(data.value as DepartmentType)}
              style={{ cursor: 'pointer' }}
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
              {departmentData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                  cursor="pointer"
                  onClick={() => onDepartmentClick(entry.name as DepartmentType)}
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

export default DepartmentDistribution;