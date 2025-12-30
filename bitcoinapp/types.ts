// FIX: Import React to resolve 'Cannot find namespace' error.
import React from 'react';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  high_24h: number;
  low_24h: number;
  price_change_percentage_24h: number;
}

export interface ChartDataPoint {
  time: number;
  price: number;
}

export type Timeframe = '1' | '7' | '30';

export interface TimeframeOption {
  value: Timeframe;
  label: string;
}