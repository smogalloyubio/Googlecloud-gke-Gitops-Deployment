
import { CoinData, ChartDataPoint } from '../types';

// Re-introduced a CORS proxy to resolve 'Failed to fetch' errors. These errors
// are caused by the browser's Cross-Origin Resource Sharing (CORS) policy, which
// blocks direct API calls from the frontend to an external domain. The proxy
// adds the necessary headers to allow the requests.
const API_BASE_URL = 'https://corsproxy.io/?https://api.coingecko.com/api/v3';

export const fetchCoinData = async (coinIds: string[]): Promise<CoinData[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds.join(',')}`);
    if (!response.ok) {
      // Improved error message to include status code for better debugging.
      throw new Error(`Error fetching coin data: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data as CoinData[];
  } catch (error) {
    console.error('Failed to fetch coin data:', error);
    return [];
  }
};

export const fetchMarketChart = async (coinId: string, days: number): Promise<ChartDataPoint[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    if (!response.ok) {
      // Improved error message to include status code for better debugging.
      throw new Error(`Error fetching market chart: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    
    // Add data validation to filter out any null or malformed data points from the API response.
    // This ensures the chart receives clean data and renders reliably for all coins.
    if (!data.prices) {
      return [];
    }

    const chartData = data.prices
      .filter((price: unknown) => 
        Array.isArray(price) && 
        price.length === 2 && 
        typeof price[0] === 'number' && 
        typeof price[1] === 'number'
      )
      .map((price: [number, number]) => ({
        time: price[0],
        price: price[1],
      }));

    // Ensure data is sorted chronologically, as charting libraries expect sorted data.
    return chartData.sort((a, b) => a.time - b.time);
  } catch (error) {
    console.error('Failed to fetch market chart:', error);
    return [];
  }
};
