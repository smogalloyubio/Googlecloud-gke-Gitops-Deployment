
import React, { useState, useEffect, useCallback } from 'react';
import { fetchCoinData, fetchMarketChart } from '../services/coingecko';
import { Coin, CoinData, ChartDataPoint, Timeframe } from '../types';
import StatCard from './StatCard';
import PriceChart from './PriceChart';
import { TIMEFRAMES } from '../constants';

interface CoinViewProps {
  coin: Coin;
}

const CoinView: React.FC<CoinViewProps> = ({ coin }) => {
  const [coinData, setCoinData] = useState<CoinData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>('1');
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  const fetchLiveStats = useCallback(async () => {
    const data = await fetchCoinData([coin.id]);
    if (data.length > 0) {
      setCoinData(data[0]);
    }
  }, [coin.id]);

  const fetchChart = useCallback(async () => {
    setIsLoadingChart(true);
    const data = await fetchMarketChart(coin.id, parseInt(timeframe));
    setChartData(data);
    setIsLoadingChart(false);
  }, [coin.id, timeframe]);

  useEffect(() => {
    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 60000);
    return () => clearInterval(interval);
  }, [fetchLiveStats]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  const isPositiveChange = (coinData?.price_change_percentage_24h ?? 0) >= 0;
  const priceChangeColor = isPositiveChange ? 'text-green-400' : 'text-red-400';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          {coinData?.image && <img src={coinData.image} alt={coin.name} className="h-12 w-12" />}
          <div>
            <h2 className="text-3xl font-bold text-white">{coin.name} ({coin.symbol.toUpperCase()})</h2>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-semibold text-gray-200">
                ${coinData?.current_price?.toLocaleString() ?? '...'}
              </p>
              <p className={`text-lg font-medium ${priceChangeColor}`}>
                {coinData?.price_change_percentage_24h?.toFixed(2) ?? '...'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Market Price" value={`$${coinData?.current_price?.toLocaleString() ?? '...'}`} />
        <StatCard title="24h High" value={`$${coinData?.high_24h?.toLocaleString() ?? '...'}`} />
        <StatCard title="24h Low" value={`$${coinData?.low_24h?.toLocaleString() ?? '...'}`} />
        <StatCard 
            title="24h Change" 
            value={`${coinData?.price_change_percentage_24h?.toFixed(2) ?? '...'}%`}
            valueClassName={priceChangeColor}
        />
      </div>

      <div className="bg-slate-800/50 p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex justify-end mb-4">
          <div className="flex space-x-1 bg-slate-700 p-1 rounded-lg">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  timeframe === tf.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-slate-600'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-96">
          <PriceChart
            data={chartData}
            isLoading={isLoadingChart}
            color={isPositiveChange ? '#4ade80' : '#f87171'}
            timeframe={timeframe}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinView;
