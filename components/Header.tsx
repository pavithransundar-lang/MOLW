import React from 'react';
import { MoneyIcon } from './icons';

interface HeaderProps {
    title: string;
    studentName: string;
}

export const Header: React.FC<HeaderProps> = ({ title, studentName }) => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-4">
         <MoneyIcon className="h-10 w-10 text-green-600" />
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
          {title}
        </h1>
      </div>
      {studentName && (
         <p className="mt-2 text-2xl font-semibold text-indigo-600">
            Student: {studentName}
         </p>
      )}
      <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
        Learn to earn, save, and spend your screen time money wisely.
      </p>
    </header>
  );
};