import React, { useState } from 'react';
import { AppSettings, Price } from '../types';
import { XMarkIcon, TrashIcon, PlusCircleIcon } from './icons';

interface SettingsModalProps {
  settings: AppSettings;
  priceList: Price[];
  goals: string[];
  onSave: (settings: AppSettings, priceList: Price[], goals: string[]) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, priceList, goals, onSave, onClose }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'prices' | 'goals'>('general');
  
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [localPriceList, setLocalPriceList] = useState<Price[]>(priceList);
  const [localGoals, setLocalGoals] = useState<string[]>(goals);
  
  const [newPriceRm, setNewPriceRm] = useState('');
  const [newPriceMins, setNewPriceMins] = useState('');
  const [newGoal, setNewGoal] = useState('');

  const handleSave = () => {
    onSave(localSettings, localPriceList, localGoals);
    onClose();
  };

  const addPrice = () => {
    const rm = parseFloat(newPriceRm);
    const mins = parseFloat(newPriceMins);
    if (rm > 0 && mins > 0) {
      const newList = [...localPriceList, { rm, minutes: mins }].sort((a, b) => a.rm - b.rm);
      setLocalPriceList(newList);
      setNewPriceRm('');
      setNewPriceMins('');
    }
  };

  const removePrice = (index: number) => {
    setLocalPriceList(localPriceList.filter((_, i) => i !== index));
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setLocalGoals([...localGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setLocalGoals(localGoals.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Classroom Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-8 w-8" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
           <button 
             className={`flex-1 py-3 font-bold ${activeTab === 'general' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
             onClick={() => setActiveTab('general')}
           >
             General
           </button>
           <button 
             className={`flex-1 py-3 font-bold ${activeTab === 'prices' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
             onClick={() => setActiveTab('prices')}
           >
             Prices
           </button>
           <button 
             className={`flex-1 py-3 font-bold ${activeTab === 'goals' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
             onClick={() => setActiveTab('goals')}
           >
             Goals
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">App Title</label>
                <input 
                  type="text" 
                  value={localSettings.walletTitle}
                  onChange={(e) => setLocalSettings({...localSettings, walletTitle: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input 
                  type="text" 
                  value={localSettings.studentName}
                  onChange={(e) => setLocalSettings({...localSettings, studentName: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Earnings Per Class ({localSettings.currency})</label>
                <input 
                  type="number" 
                  value={localSettings.maxEarnings}
                  onChange={(e) => setLocalSettings({...localSettings, maxEarnings: parseFloat(e.target.value) || 0})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Currency Symbol</label>
                <input 
                  type="text" 
                  value={localSettings.currency}
                  onChange={(e) => setLocalSettings({...localSettings, currency: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'prices' && (
            <div className="space-y-4">
                <p className="text-sm text-gray-500">Set the cost of screen time. (e.g., {localSettings.currency}1 = 1 Minute)</p>
                <div className="flex gap-2 items-end bg-gray-50 p-3 rounded-lg">
                    <div>
                        <label className="text-xs font-bold text-gray-500">Cost ({localSettings.currency})</label>
                        <input 
                            type="number" 
                            placeholder="1.00" 
                            value={newPriceRm}
                            onChange={(e) => setNewPriceRm(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500">Minutes</label>
                        <input 
                            type="number" 
                            placeholder="1" 
                            value={newPriceMins}
                            onChange={(e) => setNewPriceMins(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1"
                        />
                    </div>
                    <button onClick={addPrice} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">
                        <PlusCircleIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="border rounded-md divide-y">
                    {localPriceList.map((price, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3">
                            <span className="font-medium">{localSettings.currency}{price.rm.toFixed(2)} = {price.minutes} mins</span>
                            <button onClick={() => removePrice(idx)} className="text-red-400 hover:text-red-600">
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    {localPriceList.length === 0 && <p className="p-4 text-center text-gray-400">No prices set.</p>}
                </div>
            </div>
          )}

          {activeTab === 'goals' && (
             <div className="space-y-4">
                <p className="text-sm text-gray-500">Define the rules and goals for the class.</p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Enter new goal..." 
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                    <button onClick={addGoal} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-bold">Add</button>
                </div>
                <ul className="space-y-2">
                    {localGoals.map((goal, idx) => (
                        <li key={idx} className="flex justify-between items-start bg-yellow-50 p-3 rounded border border-yellow-100">
                            <span className="text-sm text-gray-800">{goal}</span>
                            <button onClick={() => removeGoal(idx)} className="text-red-400 hover:text-red-600 ml-2">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
             </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 font-semibold hover:bg-gray-200 rounded-lg">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg">Save Changes</button>
        </div>

      </div>
    </div>
  );
};