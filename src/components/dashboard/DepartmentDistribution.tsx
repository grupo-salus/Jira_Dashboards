import React, { useMemo } from 'react';
import { DepartmentType } from '../../types/backlog';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface DepartmentDistributionProps {
  data: Record<string, number>;
  onDepartmentClick: (department: DepartmentType | 'All') => void;
}

const DepartmentDistribution: React.FC<DepartmentDistributionProps> = ({ 
  data,
  onDepartmentClick 
}) => {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);
  
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
        <button 
          onClick={() => onDepartmentClick('All')}
          className="text-xs text-primary-600 hover:underline"
        >
          Ver todos
        </button>
      </div>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tick={{ fontSize: 14 }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8">
              {chartData.map((entry, index) => (
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