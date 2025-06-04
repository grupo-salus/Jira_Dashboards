import React from 'react';
import { DepartmentType } from '../../types/backlog';

interface DepartmentCardsProps {
  departments: DepartmentType[];
  data: Record<string, number>;
}

const DepartmentCards: React.FC<DepartmentCardsProps> = ({ 
  departments,
  data
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6 justify-center items-center">
      {departments.map((department) => {
        const displayName = !department || department.trim() === '' ? 'Não informado' : department;
        const count = data[department] || 0;

        return (
          <div
            key={department}
            className="card p-4 text-center flex flex-col items-center justify-center w-[220px] h-[120px] min-w-[220px] max-w-[220px] min-h-[120px] max-h-[120px]"
          >
            <h3 className="font-medium break-words mb-1 w-full" title={displayName}>
              {displayName}
            </h3>
            <p className="text-2xl font-bold mt-2 text-primary-600 dark:text-primary-400">
              {count}
            </p>
            <p className="text-xs text-gray-500">cards</p>
          </div>
        );
      })}
    </div>
  );
};

export default DepartmentCards;