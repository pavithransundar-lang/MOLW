import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { WalletDisplay } from './components/WalletDisplay';
import { ActionPanel } from './components/ActionPanel';
import { TimerModal } from './components/TimerModal';
import { type Price, type Transaction } from './types';
import { INITIAL_PRICES, TEACHER_GOALS, MAX_CLASS_EARNINGS } from './constants';

// Custom hook to sync state with localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }, [key, value]);

  return [value, setValue];
}


const App: React.FC = () => {
  const [balance, setBalance] = useLocalStorage<number>('wallet-balance', 0);
  const [savedBalance, setSavedBalance] = useLocalStorage<number>('wallet-saved', 0);
  const [classEarnings, setClassEarnings] = useLocalStorage<number>('class-earnings', 0);
  const [priceList] = useState<Price[]>(INITIAL_PRICES);
  const [history, setHistory] = useLocalStorage<Transaction[]>('wallet-history', []);
  const [goals] = useState<string[]>(TEACHER_GOALS);

  const [timer, setTimer] = useState<{ active: boolean; duration: number }>({
    active: false,
    duration: 0,
  });

  const addTransaction = useCallback((type: Transaction['type'], amount: number, description: string) => {
    setHistory(prev => [{
      id: new Date().toISOString(),
      type,
      amount,
      description,
      timestamp: new Date().toISOString()
    }, ...prev.slice(0, 49)]); // Keep last 50 transactions
  }, [setHistory]);

  const handleEarn = useCallback((amount: number) => {
    if (classEarnings >= MAX_CLASS_EARNINGS) {
      alert(`The earning limit of RM${MAX_CLASS_EARNINGS.toFixed(2)} for this class has already been reached. Start a new class to earn more.`);
      return;
    }
    if (classEarnings + amount > MAX_CLASS_EARNINGS) {
      alert(`This amount exceeds the class earning limit. You can only earn RM${(MAX_CLASS_EARNINGS - classEarnings).toFixed(2)} more in this class.`);
      return;
    }
    setClassEarnings(prev => prev + amount);
    setBalance(prev => prev + amount);
    addTransaction('earn', amount, `Earned RM${amount.toFixed(2)}`);
  }, [classEarnings, setBalance, setClassEarnings, addTransaction]);

  const handleSpend = useCallback((price: Price) => {
    if (balance < price.rm) {
      alert("Not enough money in your wallet!");
      return;
    }
    setBalance(prev => prev - price.rm);
    addTransaction('spend', price.rm, `Spent RM${price.rm.toFixed(2)} for ${price.minutes} minutes`);
    setTimer({ active: true, duration: price.minutes });
  }, [balance, setBalance, addTransaction]);

  const handleSave = useCallback((amount: number) => {
    if (amount <= 0) return;
    if (balance < amount) {
      alert("Not enough money to save!");
      return;
    }
    setBalance(prev => prev - amount);
    setSavedBalance(prev => prev + amount);
    addTransaction('save', amount, `Saved RM${amount.toFixed(2)} to bank`);
  }, [balance, setBalance, setSavedBalance, addTransaction]);

  const handleWithdraw = useCallback((amount: number) => {
    if (amount <= 0) return;
    if (savedBalance < amount) {
      alert("Not enough money in the bank to withdraw!");
      return;
    }
    setSavedBalance(prev => prev - amount);
    setBalance(prev => prev + amount);
    addTransaction('withdraw', amount, `Withdrew RM${amount.toFixed(2)} from bank`);
  }, [savedBalance, setBalance, setSavedBalance, addTransaction]);

  const handleNewClass = useCallback(() => {
    if (window.confirm("Are you sure you want to start a new class? This will reset the class earnings for this session.")) {
      setClassEarnings(0);
    }
  }, [setClassEarnings]);

  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the wallet? This will restore the wallet to its starting state.")) {
      // Clear the persisted state from localStorage
      window.localStorage.removeItem('wallet-balance');
      window.localStorage.removeItem('wallet-saved');
      window.localStorage.removeItem('wallet-history');
      window.localStorage.removeItem('class-earnings');
      // Reload the page to apply the default initial state
      window.location.reload();
    }
  }, []);

  const closeTimer = () => {
    setTimer({ active: false, duration: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <WalletDisplay
              balance={balance}
              savedBalance={savedBalance}
              priceList={priceList}
              onSpend={handleSpend}
              onSave={handleSave}
              onWithdraw={handleWithdraw}
            />
          </div>
          <div className="lg:col-span-2">
            <ActionPanel
              priceList={priceList}
              onEarn={handleEarn}
              onReset={handleReset}
              goals={goals}
              history={history}
              classEarnings={classEarnings}
              onNewClass={handleNewClass}
            />
          </div>
        </main>
      </div>
      {timer.active && (
        <TimerModal durationInMinutes={timer.duration} onClose={closeTimer} />
      )}
    </div>
  );
};

export default App;