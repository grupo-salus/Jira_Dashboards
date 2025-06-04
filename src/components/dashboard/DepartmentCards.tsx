import React from 'react';
import { BacklogItem, DepartmentType } from '../../types/backlog';

interface DepartmentCardsProps {
  backlogItems: BacklogItem[];
  departments: DepartmentType[];
  onSelectDepartment: (department: DepartmentType) => void;
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
  backlogItems, 
  departments,
  onSelectDepartment 
}) => {
  // Get count of cards by department
  const departmentCounts = departments.reduce<Record<string, number>>((acc, dept) => {
    acc[dept] = backlogItems.filter(item => item['Unidade / Departamento'] === dept).length;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
      {departments.map((dept) => (
        <div
          key={dept}
          className={`card cursor-pointer transform transition-all hover:scale-105 hover:shadow-md bg-gradient-to-r ${departmentColors[dept] || 'from-gray-500 to-gray-600'} text-white`}
          onClick={() => onSelectDepartment(dept)}
        >
          <div className="flex flex-col items-center p-4">
            <span className="text-2xl mb-2">{departmentIcons[dept] || '📁'}</span>
            <h3 className="font-medium text-center">{dept}</h3>
            <p className="text-xl font-bold mt-2">{departmentCounts[dept] || 0}</p>
            <p className="text-xs opacity-80">cards</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepartmentCards;