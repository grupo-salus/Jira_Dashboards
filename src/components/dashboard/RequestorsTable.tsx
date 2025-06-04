import React, { useMemo } from 'react';

interface RequestorsTableProps {
  data: Record<string, number>;
  onSelectRequestor: (requestor: string) => void;
}

const RequestorsTable: React.FC<RequestorsTableProps> = ({ 
  data,
  onSelectRequestor 
}) => {
  const sortedData = useMemo(() => {
    return Object.entries(data)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Top Solicitantes</h2>
      
      {sortedData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-2 px-4">Solicitante</th>
                <th className="text-right py-2 px-4">Quantidade</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr 
                  key={index}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => onSelectRequestor(item.name)}
                >
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="text-right py-2 px-4">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Nenhum dado disponível
        </div>
      )}
    </div>
  );
};

export default RequestorsTable;