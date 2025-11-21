import React, { useState, useRef } from 'react';
import { type Transaction, type Price, type AppSettings } from '../types';
import { EARN_AMOUNTS, RM_ICON_MAP } from '../constants';
import { PlusCircleIcon, CalculatorIcon, MoneyIcon, DownloadIcon, CogIcon, UploadIcon, TableIcon, ClipboardIcon } from './icons';
import { GoogleGenAI } from '@google/genai';


interface ActionPanelProps {
  priceList: Price[];
  onEarn: (amount: number) => void;
  onReset: () => void;
  goals: string[];
  history: Transaction[];
  classEarnings: number;
  onNewClass: () => void;
  settings: AppSettings;
  onOpenSettings: () => void;
  onImportTransactions: (transactions: Transaction[]) => void;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({ 
    priceList, 
    onEarn, 
    onReset, 
    goals, 
    history, 
    classEarnings, 
    onNewClass,
    settings,
    onOpenSettings,
    onImportTransactions
}) => {
  const [goalsVisible, setGoalsVisible] = useState(false);
  const [calcAmount, setCalcAmount] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      const priceListString = priceList.map(p => `${settings.currency}${p.rm.toFixed(2)} = ${p.minutes} minutes`).join(', ');
      
      const prompt = `Based on the following price list, calculate how many minutes ${settings.currency}${amount.toFixed(2)} is worth. The price list is: ${priceListString}. When items can be combined, find the combination that gives the most minutes. Respond with only the final number of minutes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: "You are a calculator. Your only job is to calculate minutes from currency based on a price list. Respond with a single number and nothing else. Do not add units like 'minutes'.",
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

  const handleExportCSV = () => {
    if (history.length === 0) {
      alert("No history to export!");
      return;
    }

    // CSV Headers
    const headers = ['Date', 'Time', 'Type', `Amount (${settings.currency})`, 'Description'];
    
    // Format data
    const csvRows = history.map(t => {
      const date = new Date(t.timestamp);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();
      const description = t.description.replace(/,/g, ';'); // Prevent CSV errors
      return [dateStr, timeStr, t.type, t.amount.toFixed(2), description].join(',');
    });

    // Add BOM for Excel utf-8 compatibility and join rows
    const csvContent = '\uFEFF' + [headers.join(','), ...csvRows].join('\n');
    
    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wallet_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    const headers = ['Type', 'Amount', 'Description', 'Date (Optional)'];
    const exampleRows = [
        ['earn', '5.00', 'Example earning', '2023-10-27'],
        ['spend', '1.00', 'Example spending', ''],
        ['save', '2.00', 'Moving to bank', ''],
        ['withdraw', '2.00', 'Taking from bank', '']
    ];
    const csvContent = '\uFEFF' + [headers.join(','), ...exampleRows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wallet_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processImportData = (content: string) => {
    try {
      const lines = content.split(/\r\n|\n/);
      const transactions: Transaction[] = [];
      
      // Auto-detect delimiter (Comma for CSV, Tab for Excel Copy-Paste)
      let delimiter = ',';
      for(let line of lines) {
          if(line.includes('\t')) { delimiter = '\t'; break; }
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Skip header if found
        if (line.toLowerCase().startsWith('type') && (line.includes('amount') || line.includes('Amount'))) continue;
        
        const columns = line.split(delimiter);
        if (columns.length < 2) continue;

        const typeStr = columns[0].trim().toLowerCase();
        // Clean currency symbols if user pasted "RM 5.00"
        const amountStr = columns[1].trim().replace(/[^0-9.]/g, ''); 
        const amount = parseFloat(amountStr);
        const description = columns[2] ? columns[2].trim() : '';
        let timestamp = new Date().toISOString();
        
        if (columns[3] && columns[3].trim()) {
            const dateParsed = new Date(columns[3].trim());
            if (!isNaN(dateParsed.getTime())) {
                timestamp = dateParsed.toISOString();
            }
        }

        if (['earn', 'spend', 'save', 'withdraw'].includes(typeStr) && !isNaN(amount) && amount > 0) {
            transactions.push({
                id: timestamp + Math.random(),
                type: typeStr as Transaction['type'],
                amount,
                description: description || `Imported ${typeStr}`,
                timestamp
            });
        }
      }

      if (transactions.length > 0) {
        onImportTransactions(transactions);
        setShowPasteModal(false);
        setPasteContent('');
      } else {
        alert("No valid transactions found. Please ensure the format is: Type, Amount, Description");
      }

    } catch (err) {
      console.error(err);
      alert("Error parsing data.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        processImportData(content);
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6 sticky top-8">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Control Panel</h2>
          <button onClick={onOpenSettings} className="text-gray-400 hover:text-gray-600 transition-colors p-1" title="Settings">
             <CogIcon className="h-6 w-6" />
          </button>
      </div>
      
      {/* Earn Money */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
          <PlusCircleIcon className="h-6 w-6 text-green-500" />
          Add Funds
        </h3>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 space-y-3">
            <div className="text-center">
                <label className="text-sm font-semibold text-green-800">Class Earnings</label>
                <div className="w-full bg-green-200 rounded-full h-2.5 my-1 border border-green-300">
                    <div className="bg-green-600 h-full rounded-full transition-all duration-300" style={{ width: `${Math.min((classEarnings / settings.maxEarnings) * 100, 100)}%` }}></div>
                </div>
                <p className="text-sm font-bold text-green-900">
                    {settings.currency}{classEarnings.toFixed(2)} / {settings.currency}{settings.maxEarnings.toFixed(2)}
                </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {EARN_AMOUNTS.map(amount => {
                // Use generic icon if currency is not RM or if no map exists
                const Icon = (settings.currency === 'RM' && RM_ICON_MAP[amount]) 
                  ? RM_ICON_MAP[amount] 
                  : MoneyIcon;
                
                const isDisabled = classEarnings + amount > settings.maxEarnings;
                return (
                  <button 
                    key={amount} 
                    onClick={() => onEarn(amount)} 
                    disabled={isDisabled}
                    title={isDisabled ? `Cannot earn more than ${settings.currency}${settings.maxEarnings} per class` : `Add ${settings.currency}${amount.toFixed(2)}`} 
                    className="bg-green-100 text-green-800 hover:bg-green-200 font-bold py-3 rounded-lg shadow-sm transition-transform transform hover:scale-105 flex flex-col items-center justify-center disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-gray-200"
                  >
                      {Icon && <Icon className="h-8 w-8" />}
                      <span className="mt-1 text-sm font-semibold">{settings.currency}{amount.toFixed(2)}</span>
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
              <p className="text-sm text-purple-800 mb-3">Enter an amount to see how many minutes it's worth.</p>
              <div className="flex items-center gap-2">
                  <input
                      type="number"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(e.target.value)}
                      placeholder="e.g., 3.50"
                      className="w-full p-2 border border-gray-300 rounded-md shadow-inner"
                      disabled={isCalculating}
                      aria-label="Amount to calculate"
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
          Class Goals {goalsVisible ? '▲' : '▼'}
        </button>
        {goalsVisible && (
            <ul className="mt-2 list-disc list-inside bg-yellow-50 p-4 rounded-lg text-yellow-900 space-y-2 text-sm border border-yellow-200">
                {goals.map((goal, index) => <li key={index}>{goal}</li>)}
            </ul>
        )}
      </div>

      {/* Import/Export Tools */}
      <div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">Tools</h3>
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
            <div className="grid grid-cols-3 gap-2">
                <button 
                    onClick={handleDownloadTemplate}
                    className="flex flex-col items-center justify-center bg-white border border-gray-300 text-gray-700 px-1 py-2 rounded hover:bg-gray-100 text-xs font-semibold"
                    title="Download Excel Template"
                >
                    <TableIcon className="h-5 w-5 mb-1" />
                    Template
                </button>
                <button 
                    onClick={() => setShowPasteModal(true)}
                    className="flex flex-col items-center justify-center bg-indigo-600 text-white px-1 py-2 rounded hover:bg-indigo-700 text-xs font-semibold"
                    title="Paste from Excel"
                >
                    <ClipboardIcon className="h-5 w-5 mb-1" />
                    Paste
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center bg-blue-600 text-white px-1 py-2 rounded hover:bg-blue-700 text-xs font-semibold"
                    title="Import CSV File"
                >
                    <UploadIcon className="h-5 w-5 mb-1" />
                    Upload
                </button>
                <input 
                    type="file" 
                    accept=".csv" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                />
            </div>
            {history.length > 0 && (
                 <button 
                    onClick={handleExportCSV}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-2 py-2 rounded hover:bg-gray-100 text-xs font-semibold"
                >
                    <DownloadIcon className="h-4 w-4" />
                    Export History
                </button>
            )}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-700">History</h3>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg h-48 overflow-y-auto space-y-2 border border-gray-200">
          {history.length > 0 ? history.map(t => {
            const Icon = (t.type === 'earn' || t.type === 'spend') && settings.currency === 'RM' && RM_ICON_MAP[t.amount] 
              ? RM_ICON_MAP[t.amount] 
              : MoneyIcon;
            const hasSpecificIcon = (t.type === 'earn' || t.type === 'spend') && settings.currency === 'RM' && RM_ICON_MAP[t.amount];

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
      
      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg">
                <h3 className="text-xl font-bold mb-2">Paste Data from Excel</h3>
                <p className="text-sm text-gray-500 mb-4">Copy your cells from Excel and paste them here. Columns: Type, Amount, Description</p>
                <textarea 
                    className="w-full h-40 border p-2 rounded mb-4 font-mono text-sm"
                    placeholder={`earn\t5.00\tGood work\nspend\t1.00\tLate`}
                    value={pasteContent}
                    onChange={(e) => setPasteContent(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowPasteModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                    <button onClick={() => processImportData(pasteContent)} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700">Import Data</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};