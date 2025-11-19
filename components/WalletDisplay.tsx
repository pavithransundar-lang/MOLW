import React, { useMemo, useState } from 'react';
import { type Price } from '../types';
import { ClockIcon, BankIcon } from './icons';
import { RM_ICON_MAP } from '../constants';

interface WalletDisplayProps {
  balance: number;
  savedBalance: number;
  priceList: Price[];
  onSpend: (price: Price) => void;
  onSave: (amount: number) => void;
  onWithdraw: (amount: number) => void;
}

export const WalletDisplay: React.FC<WalletDisplayProps> = ({ balance, savedBalance, priceList, onSpend, onSave, onWithdraw }) => {
  const [saveAmount, setSaveAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const totalMinutesAvailable = useMemo(() => {
    if (!priceList.length || balance <= 0) return 0;
    // Find best value (minutes per RM) for a rough estimate
    const bestValue = priceList.reduce((max, p) => p.rm > 0 ? Math.max(max, p.minutes / p.rm) : max, 0);
    return Math.floor(balance * bestValue);
  }, [balance, priceList]);

  const handleSaveClick = () => {
    const amount = parseFloat(saveAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount to save.");
      return;
    }
    onSave(amount);
    setSaveAmount('');
  };

  const handleWithdrawClick = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount to withdraw.");
      return;
    }
    onWithdraw(amount);
    setWithdrawAmount('');
  };

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Student Wallet</h2>
        <div className="flex flex-col sm:flex-row justify-around items-center gap-6 bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="text-center">
            <p className="text-lg font-semibold text-green-700">You Have</p>
            <p className="text-5xl font-bold text-green-800 tracking-tight">
              RM{balance.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-indigo-700">That's about</p>
            <p className="text-5xl font-bold text-indigo-800 tracking-tight">
              {totalMinutesAvailable} <span className="text-3xl font-medium">mins</span>
            </p>
          </div>
        </div>
        <p className="text-center mt-4 text-gray-500 italic">"If you save today, you will have more time tomorrow!"</p>
      </div>

      {/* Spend Time Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <ClockIcon className="h-6 w-6 text-orange-500" />
            Spend Laptop Time
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {priceList.map(price => {
              const Icon = RM_ICON_MAP[price.rm];
              return (
                <button
                    key={price.rm}
                    onClick={() => onSpend(price)}
                    disabled={balance < price.rm}
                    className="flex flex-col items-center justify-center gap-2 text-lg font-bold py-3 px-2 rounded-lg shadow-sm transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 bg-orange-100 text-orange-800 hover:bg-orange-200"
                >
                    {Icon && <Icon className="h-10 w-10" />}
                    <span className="text-xl font-black">{price.minutes} MINS</span>
                </button>
              )
            })}
        </div>
      </div>
      
      {/* Bank/Save Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <BankIcon className="h-6 w-6 text-blue-500" />
            My Bank
        </h3>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center mb-4">
          <p className="font-semibold text-blue-700">Amount Saved</p>
          <p className="text-4xl font-bold text-blue-800">RM{savedBalance.toFixed(2)}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Save Section */}
          <div className="space-y-2">
             <label htmlFor="save-amount" className="font-semibold text-gray-600">Save to Bank</label>
             <div className="flex items-center gap-2">
                <input
                    id="save-amount"
                    type="number"
                    value={saveAmount}
                    onChange={(e) => setSaveAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-inner"
                    aria-label="Amount to save"
                />
                <button 
                  onClick={handleSaveClick}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors shadow-sm shrink-0"
                >
                  Save
                </button>
             </div>
          </div>

          {/* Withdraw Section */}
          <div className="space-y-2">
             <label htmlFor="withdraw-amount" className="font-semibold text-gray-600">Withdraw from Bank</label>
             <div className="flex items-center gap-2">
                <input
                    id="withdraw-amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-inner"
                    aria-label="Amount to withdraw"
                />
                <button 
                  onClick={handleWithdrawClick}
                  disabled={savedBalance <= 0}
                  className="bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 transition-colors shadow-sm shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Withdraw
                </button>
             </div>
          </div>
        </div>
        <p className="text-sm text-center mt-4 text-gray-500 italic">"Saving helps me plan for bigger things!"</p>
      </div>
    </div>
  );
};