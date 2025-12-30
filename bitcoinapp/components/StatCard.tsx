
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  valueClassName?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, valueClassName = 'text-white' }) => {
  return (
    <div className="bg-slate-800/50 p-4 rounded-xl shadow-md">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className={`text-xl sm:text-2xl font-semibold ${valueClassName}`}>{value}</p>
    </div>
  );
};

export default StatCard;
