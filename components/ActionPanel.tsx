import React, { useState } from 'react';
import { type Transaction, type Price } from '../types';
import { EARN_AMOUNTS, RM_ICON_MAP, MAX_CLASS_EARNINGS } from '../constants';
import { PlusCircleIcon, CalculatorIcon, MoneyIcon } from './icons';
import { GoogleGenAI } from '@google/genai';


interface ActionPanelProps {
  priceList: Price[];
  onEarn: (amount: number) => void;
  onReset: () => void;
  goals: string[];
  history: Transaction[];
  classEarnings: number;
  onNewClass: () => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ priceList, onEarn, onReset, goals, history, classEarnings, onNewClass }) => {
  const [goalsVisible, setGoalsVisible] = useState(false);
  const [calcAmount, setCalcAmount] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = async () => {
    const amount = parseFloat(calcAmount);
    if (isNaN(amount) || amount <= 0) {
      setCalcResult("Please enter a valid amount.");
      return;
    }

    setIsCalculating(true);
    setCalcResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const priceListString = priceList.map(p => `RM${p.rm.toFixed(2)} = ${p.minutes} minutes`).join(', ');
      
      const prompt = `Based on the following price list, calculate how many minutes RM${amount.toFixed(2)} is worth. The price list is: ${priceListString}. When items can be combined, find the combination that gives the most minutes. Respond with only the final number of minutes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: "You are a calculator. Your only job is to calculate minutes from RM based on a price list. Respond with a single number and nothing else. Do not add units like 'minutes'.",
            temperature: 0,
        }
      });
      
      const textResult = response.text ? response.text.trim() : '';
      if (textResult && !isNaN(parseFloat(textResult))) {
        setCalcResult(`${textResult} minutes`);
      } else {
        setCalcResult("Couldn't calculate. Please try again.");
      }

    } catch (error) {
      console.error("AI Calculator Error:", error);
      setCalcResult("An error occurred.");
    } finally {
      setIsCalculating(false);
    }
  };


  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 sticky top-8">
      <h2 className="text-2xl font-bold text-gray-700">Teacher Panel</h2>
      
      {/* Earn Money */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <PlusCircleIcon className="h-6 w-6 text-green-500" />
          Add RM to Wallet
        </h3>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-3">
            <div className="text-center">
                <label className="text-sm font-semibold text-green-800">Class Earnings</label>
                <div className="w-full bg-green-200 rounded-full h-2.5 my-1 border border-green-300">
                    <div className="bg-green-600 h-full rounded-full transition-all duration-300" style={{ width: `${(classEarnings / MAX_CLASS_EARNINGS) * 100}%` }}></div>
                </div>
                <p className="text-sm font-bold text-green-900">
                    RM{classEarnings.toFixed(2)} / RM{MAX_CLASS_EARNINGS.toFixed(2)}
                </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {EARN_AMOUNTS.map(amount => {
                const Icon = RM_ICON_MAP[amount];
                const isDisabled = classEarnings + amount > MAX_CLASS_EARNINGS;
                return (
                  <button 
                    key={amount} 
                    onClick={() => onEarn(amount)} 
                    disabled={isDisabled}
                    title={isDisabled ? `Cannot earn more than RM${MAX_CLASS_EARNINGS} per class` : `Add RM${amount.toFixed(2)}`} 
                    className="bg-green-100 text-green-800 hover:bg-green-200 font-bold py-3 rounded-lg shadow-sm transition-transform transform hover:scale-105 flex flex-col items-center justify-center disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-gray-200"
                  >
                      {Icon && <Icon className="h-8 w-8" />}
                      <span className="mt-1 text-sm font-semibold">RM{amount.toFixed(2)}</span>
                  </button>
                )
              })}
            </div>
            <button
                onClick={onNewClass}
                className="w-full bg-yellow-500 text-yellow-900 font-bold py-2 rounded-lg hover:bg-yellow-600 transition-colors shadow-sm text-sm"
            >
                Start New Class
            </button>
        </div>
      </div>

      {/* AI Calculator */}
      <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <CalculatorIcon className="h-6 w-6 text-purple-500" />
              AI Time Calculator
          </h3>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800 mb-3">Enter an RM amount to see how many minutes it's worth.</p>
              <div className="flex items-center gap-2">
                  <input
                      type="number"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(e.target.value)}
                      placeholder="e.g., 3.50"
                      className="w-full p-2 border border-gray-300 rounded-md shadow-inner"
                      disabled={isCalculating}
                      aria-label="RM Amount to calculate"
                  />
                  <button
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors shadow-sm disabled:bg-purple-300 disabled:cursor-wait w-20"
                  >
                      {isCalculating ? '...' : 'Calc'}
                  </button>
              </div>
              {calcResult && (
                  <p className="mt-3 text-center font-semibold text-purple-900 bg-purple-100 p-2 rounded">
                      Result: <span className="font-black">{calcResult}</span>
                  </p>
              )}
          </div>
      </div>

      {/* Teacher Goals */}
      <div>
        <button onClick={() => setGoalsVisible(!goalsVisible)} className="w-full text-left font-bold text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors">
          Teacher Goals {goalsVisible ? '▲' : '▼'}
        </button>
        {goalsVisible && (
            <ul className="mt-2 list-disc list-inside bg-yellow-50 p-4 rounded-lg text-yellow-900 space-y-2 text-sm border border-yellow-200">
                {goals.map((goal, index) => <li key={index}>{goal}</li>)}
            </ul>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">History</h3>
        <div className="bg-gray-100 p-3 rounded-lg h-48 overflow-y-auto space-y-2 border border-gray-200">
          {history.length > 0 ? history.map(t => {
            const Icon = (t.type === 'earn' || t.type === 'spend') && RM_ICON_MAP[t.amount] 
              ? RM_ICON_MAP[t.amount] 
              : MoneyIcon;
            const hasSpecificIcon = (t.type === 'earn' || t.type === 'spend') && RM_ICON_MAP[t.amount];

            return (
              <div key={t.id} className="text-sm bg-white p-2 rounded flex items-center gap-3">
                <div className="flex-shrink-0">
                  <Icon className={`h-7 w-7 ${!hasSpecificIcon ? 'text-gray-400' : ''}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">{t.description}</p>
                  <p className="text-xs text-gray-400">{new Date(t.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )
          }) : (
            <p className="text-gray-500 text-center pt-16">No transactions yet.</p>
          )}
        </div>
      </div>
      
      {/* Reset Button */}
      <button onClick={onReset} className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors shadow-sm">
        Reset Wallet
      </button>
    </div>
  );
};