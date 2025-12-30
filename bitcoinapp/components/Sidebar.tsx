import React from 'react';
import { COINS } from '../constants';

interface SidebarProps {
  selectedCoinId: string;
  setSelectedCoinId: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedCoinId, setSelectedCoinId }) => {
  return (
    <aside className="bg-slate-800/50 md:w-64 p-4 md:p-6 flex md:flex-col items-center md:items-start">
      <div className="flex items-center space-x-2 mb-0 md:mb-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h1 className="text-2xl font-bold text-white hidden md:block">CryptoPulse</h1>
      </div>
      <nav className="flex-1 w-full">
        <ul className="flex flex-row md:flex-col justify-around md:justify-start md:space-y-2">
          {COINS.map((coin) => (
            <li key={coin.id}>
              <button
                onClick={() => setSelectedCoinId(coin.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  selectedCoinId === coin.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <coin.icon className="h-6 w-6 mr-3" />
                <span className="font-medium hidden md:block">{coin.name}</span>
                <span className="font-medium block md:hidden">{coin.symbol}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
