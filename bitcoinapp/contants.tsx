
import React from 'react';
import { Coin, TimeframeOption } from './types';

const BitcoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="#f7931a" height="24px" width="24px" viewBox="0 0 32 32" {...props}>
    <path d="M21.6,13.84a1,1,0,0,0,1-1V11.2a1,1,0,0,0-1-1H19.78a5.35,5.35,0,0,0-7.53-2.31,5.25,5.25,0,0,0-2.3,4.28V14h-1.3a1,1,0,0,0-1,1v2.64a1,1,0,0,0,1,1H9.92v4.88a1,1,0,0,0,1,1h1.62a1,1,0,0,0,1-1V18.68h.83a3.63,3.63,0,0,0,3.62-3.62V13.84Zm-9.45-2.64a3.25,3.25,0,0,1,2.23-3,3.35,3.35,0,0,1,4.45,1.52h-5A1.69,1.69,0,0,0,12.15,11.2Zm6,6.26H14.77a1.69,1.69,0,0,0-1.68,1.68v.06a1.68,1.68,0,0,0,1.68,1.68h3.35a1.62,1.62,0,0,0,1.62-1.62v-.12A1.62,1.62,0,0,0,18.12,17.46Z"/>
  </svg>
);

const EthereumIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2L11.72 2.76L6 13.05L12 17.5L18 13.05L12.28 2.76L12 2Z" fill="#8C8C8C"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 18.91V22L18 14.47L12 18.91Z" fill="#747474"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 18.91L6 14.47L12 22V18.91Z" fill="#8C8C8C"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 17.5L18 13.05L12 8.5L12 17.5Z" fill="#747474"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M6 13.05L12 17.5V8.5L6 13.05Z" fill="#8C8C8C"/>
  </svg>
);

const SolanaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
    <path d="M4.02148 11.3394L18.0675 4.31641L12.0465 20.3664L4.02148 11.3394Z" fill="#9945FF"/>
    <path d="M18.0674 4.31641L20.0004 12.6634L12.0464 20.3664L18.0674 4.31641Z" fill="#14F195"/>
    <path d="M4.02148 11.3394L12.0465 20.3664L9.03448 14.6834L4.02148 11.3394Z" fill="#19FB9B"/>
    <path d="M18.0674 4.31641L9.03442 14.6834L12.0464 20.3664L18.0674 4.31641Z" fill="#9945FF" fillOpacity="0.5"/>
  </svg>
);

export const COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: BitcoinIcon },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: EthereumIcon },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: SolanaIcon },
];

export const TIMEFRAMES: TimeframeOption[] = [
  { value: '1', label: '24h' },
  { value: '7', label: '7d' },
  { value: '30', label: '30d' },
];
