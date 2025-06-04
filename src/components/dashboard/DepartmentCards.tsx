import React from 'react';
import { DepartmentType } from '../../types/backlog';

interface DepartmentCardsProps {
  departments: DepartmentType[];
  onSelectDepartment: (department: DepartmentType) => void;
  data: Record<string, number>;
}

// Department icon mapping (using emoji as placeholders, in a real app would use proper icons)
const departmentIcons: Record<string, string> = {
  'TI': '💻',
  'Marketing': '📱',
  'Vendas': '💰',
  'Financeiro': '📊',
  'RH': '👥',
  'Operações': '⚙️',
  'Jurídico': '⚖️',
  'Atendimento ao Cliente': '🎧',
  'P&D': '🔬',
  'Logística': '🚚'
};

// Department color mapping
const departmentColors: Record<string, string> = {
  'TI': 'from-blue-500 to-blue-600',
  'Marketing': 'from-purple-500 to-purple-600',
  'Vendas': 'from-green-500 to-green-600',
  'Financeiro': 'from-amber-500 to-amber-600',
  'RH': 'from-pink-500 to-pink-600',
  'Operações': 'from-teal-500 to-teal-600',
  'Jurídico': 'from-indigo-500 to-indigo-600',
  'Atendimento ao Cliente': 'from-red-500 to-red-600',
  'P&D': 'from-cyan-500 to-cyan-600',
  'Logística': 'from-orange-500 to-orange-600'
};

const DepartmentCards: React.FC<DepartmentCardsProps> = ({ 
  departments,
  onSelectDepartment,
  data
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {departments.map((department) => {
        const displayName = !department || department.trim() === '' ? 'Não informado' : department;
        const count = data[department] || 0;

        return (
          <button
            key={department}
            onClick={() => onSelectDepartment(department)}
            className="card p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="font-medium truncate" title={displayName}>
              {displayName}
            </h3>
            <p className="text-2xl font-bold mt-2 text-primary-600 dark:text-primary-400">
              {count}
            </p>
            <p className="text-xs text-gray-500">cards</p>
          </button>
        );
      })}
    </div>
  );
};

export default DepartmentCards;