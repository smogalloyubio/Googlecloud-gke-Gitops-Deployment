
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CoinView from './CoinView';
import { COINS } from '../constants';

const Dashboard: React.FC = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string>(COINS[0].id);

  const selectedCoin = COINS.find(c => c.id === selectedCoinId) || COINS[0];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar selectedCoinId={selectedCoinId} setSelectedCoinId={setSelectedCoinId} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <CoinView key={selectedCoin.id} coin={selectedCoin} />
      </main>
    </div>
  );
};

export default Dashboard;
