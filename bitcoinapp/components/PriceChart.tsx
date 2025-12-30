
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint, Timeframe } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface PriceChartProps {
  data: ChartDataPoint[];
  isLoading: boolean;
  color: string;
  timeframe: Timeframe;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-2 border border-slate-600 rounded-md shadow-lg">
        <p className="label text-gray-300">{`${new Date(label).toLocaleDateString()} ${new Date(label).toLocaleTimeString()}`}</p>
        <p className="intro text-white font-bold">{`Price: $${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data, isLoading, color, timeframe }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
        <div className="flex items-center justify-center h-full text-gray-500">
            No data available for this timeframe.
        </div>
    );
  }

  const formatXAxisTick = (time: number) => {
    const date = new Date(time);
    if (timeframe === '1') {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="time"
          stroke="#94a3b8"
          tickFormatter={formatXAxisTick}
          fontSize={12}
          interval="auto"
        />
        <YAxis
          stroke="#94a3b8"
          tickFormatter={(price) => `$${price.toLocaleString()}`}
          domain={['dataMin', 'dataMax']}
          fontSize={12}
          />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;
