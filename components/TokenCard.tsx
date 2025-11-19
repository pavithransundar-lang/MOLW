
import React from 'react';
import { type TokenValue } from '../types';
import { TOKEN_CONFIG } from '../constants';

interface TokenCardProps {
  value: TokenValue;
  count: number;
}

export const TokenCard: React.FC<TokenCardProps> = ({ value, count }) => {
  const config = TOKEN_CONFIG[value];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl text-white shadow-md flex flex-col justify-between h-40 ${config.color}`}>
      <div className="flex justify-between items-start">
        <span className="text-4xl font-black">{value}</span>
        <Icon className="h-10 w-10 opacity-80" />
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold leading-tight">MINUTES</p>
        <p className="text-3xl font-bold leading-tight">x {count}</p>
      </div>
    </div>
  );
};
