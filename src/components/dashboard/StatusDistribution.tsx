import React, { useMemo } from 'react';

interface StatusDistributionProps {
  data: Record<string, number>;
}

const statusColors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-red-500 to-red-600',
  'from-amber-500 to-amber-600',
  'from-teal-500 to-teal-600',
  'from-cyan-500 to-cyan-600',
  'from-violet-500 to-violet-600',
  'from-orange-500 to-orange-600',
  'from-green-500 to-green-600'
];

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const StatusDistribution: React.FC<StatusDistributionProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([name, value]) => ({
        name: name && name.trim() !== '' ? capitalizeFirst(name) : 'Não informado',
        value
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <div className="card h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-center">Distribuição por Status</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1 items-center justify-center w-full mx-auto">
        {chartData.map((status, idx) => (
          <div
            key={status.name}
            className={`rounded-lg p-3 text-center shadow bg-gradient-to-br ${statusColors[idx % statusColors.length]} flex flex-col items-center justify-center w-[150px] h-[120px] mx-auto`}
          >
            <h3 className="font-medium text-white break-words mb-1 w-full" title={status.name}>{status.name}</h3>
            <p className="text-xl font-bold text-white mb-1">{status.value}</p>
            <p className="text-xs text-blue-100">cards</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusDistribution;