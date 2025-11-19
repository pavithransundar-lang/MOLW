import React from 'react';
import { MoneyIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-4">
         <MoneyIcon className="h-10 w-10 text-green-600" />
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
          My Laptop Wallet (RM)
        </h1>
      </div>
      <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
        Learn to earn, save, and spend your screen time money wisely.
      </p>
    </header>
  );
};
