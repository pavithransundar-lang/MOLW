import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { WalletDisplay } from './components/WalletDisplay';
import { ActionPanel } from './components/ActionPanel';
import { TimerModal } from './components/TimerModal';
import { SettingsModal } from './components/SettingsModal';
import { GamificationPanel } from './components/GamificationPanel';
import { type Price, type Transaction, type AppSettings, type GamificationStats } from './types';
import { DEFAULT_PRICES, DEFAULT_GOALS, DEFAULT_MAX_CLASS_EARNINGS, BADGE_DEFINITIONS } from './constants';

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
  // Application State
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', {
    studentName: 'Mohamed',
    walletTitle: 'My Laptop Wallet',
    maxEarnings: DEFAULT_MAX_CLASS_EARNINGS,
    currency: 'RM'
  });
  
  const [balance, setBalance] = useLocalStorage<number>('wallet-balance', 0);
  const [savedBalance, setSavedBalance] = useLocalStorage<number>('wallet-saved', 0);
  const [classEarnings, setClassEarnings] = useLocalStorage<number>('class-earnings', 0);
  const [history, setHistory] = useLocalStorage<Transaction[]>('wallet-history', []);
  
  // Gamification State
  const [gameStats, setGameStats] = useLocalStorage<GamificationStats>('game-stats', {
    totalLifetimeEarnings: 0,
    totalLifetimeSavings: 0,
    currentBalance: 0,
    currentSaved: 0,
    savingsStreak: 0,
    lastSaveDate: null,
    unlockedBadges: []
  });
  
  // Configurable Arrays
  const [priceList, setPriceList] = useLocalStorage<Price[]>('price-list', DEFAULT_PRICES);
  const [goals, setGoals] = useLocalStorage<string[]>('teacher-goals', DEFAULT_GOALS);

  const [timer, setTimer] = useState<{ active: boolean; duration: number }>({
    active: false,
    duration: 0,
  });
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Helper to check and award badges
  const checkBadges = useCallback((currentStats: GamificationStats) => {
    const newBadges = [...currentStats.unlockedBadges];
    let badgeAdded = false;

    BADGE_DEFINITIONS.forEach(badge => {
        if (!newBadges.includes(badge.id) && badge.condition(currentStats)) {
            newBadges.push(badge.id);
            badgeAdded = true;
            // Simple alert for now, could be a nice toast later
            setTimeout(() => alert(`🎉 Achievement Unlocked: ${badge.name}!`), 500);
        }
    });

    return badgeAdded ? newBadges : currentStats.unlockedBadges;
  }, []);

  // Update Stats wrapper
  const updateGameStats = useCallback((updates: Partial<GamificationStats>) => {
      setGameStats(prev => {
          const nextStats = { ...prev, ...updates };
          const updatedBadges = checkBadges(nextStats);
          return { ...nextStats, unlockedBadges: updatedBadges };
      });
  }, [setGameStats, checkBadges]);

  // Sync simple balance stats when balance changes (defensive coding)
  useEffect(() => {
      setGameStats(prev => ({
          ...prev,
          currentBalance: balance,
          currentSaved: savedBalance
      }));
  }, [balance, savedBalance, setGameStats]);


  const addTransaction = useCallback((type: Transaction['type'], amount: number, description: string) => {
    setHistory(prev => [{
      id: new Date().toISOString() + Math.random(),
      type,
      amount,
      description,
      timestamp: new Date().toISOString()
    }, ...prev.slice(0, 999)]); 
  }, [setHistory]);

  const handleEarn = useCallback((amount: number) => {
    if (classEarnings >= settings.maxEarnings) {
      alert(`The earning limit of ${settings.currency}${settings.maxEarnings.toFixed(2)} for this class has already been reached. Start a new class to earn more.`);
      return;
    }
    if (classEarnings + amount > settings.maxEarnings) {
      alert(`This amount exceeds the class earning limit. You can only earn ${settings.currency}${(settings.maxEarnings - classEarnings).toFixed(2)} more in this class.`);
      return;
    }
    setClassEarnings(prev => prev + amount);
    setBalance(prev => prev + amount);
    
    // Gamification: Update Lifetime Earnings
    setGameStats(prev => {
        const nextStats = {
            ...prev,
            totalLifetimeEarnings: prev.totalLifetimeEarnings + amount,
            currentBalance: prev.currentBalance + amount
        };
        const badges = checkBadges(nextStats);
        return { ...nextStats, unlockedBadges: badges };
    });

    addTransaction('earn', amount, `Earned ${settings.currency}${amount.toFixed(2)}`);
  }, [classEarnings, setBalance, setClassEarnings, addTransaction, settings.maxEarnings, settings.currency, setGameStats, checkBadges]);

  const handleSpend = useCallback((price: Price) => {
    if (balance < price.rm) {
      alert("Not enough money in your wallet!");
      return;
    }
    setBalance(prev => prev - price.rm);
    addTransaction('spend', price.rm, `Spent ${settings.currency}${price.rm.toFixed(2)} for ${price.minutes} minutes`);
    setTimer({ active: true, duration: price.minutes });
  }, [balance, setBalance, addTransaction, settings.currency]);

  const handleSave = useCallback((amount: number) => {
    if (amount <= 0) return;
    if (balance < amount) {
      alert("Not enough money to save!");
      return;
    }
    
    setBalance(prev => prev - amount);
    setSavedBalance(prev => prev + amount);

    // Gamification: Handle Streak Logic
    setGameStats(prev => {
        const today = new Date().toISOString().split('T')[0];
        let newStreak = prev.savingsStreak;
        
        if (prev.lastSaveDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (prev.lastSaveDate === yesterdayStr) {
                newStreak += 1;
            } else {
                // Reset streak if they missed a day, OR start streak if 0
                // But checking if lastSaveDate is null (first time)
                newStreak = 1;
            }
        }

        const nextStats = {
            ...prev,
            totalLifetimeSavings: prev.totalLifetimeSavings + amount,
            currentSaved: prev.currentSaved + amount,
            currentBalance: prev.currentBalance - amount,
            savingsStreak: newStreak,
            lastSaveDate: today
        };
        const badges = checkBadges(nextStats);
        return { ...nextStats, unlockedBadges: badges };
    });

    addTransaction('save', amount, `Saved ${settings.currency}${amount.toFixed(2)} to bank`);
  }, [balance, setBalance, setSavedBalance, addTransaction, settings.currency, setGameStats, checkBadges]);

  const handleWithdraw = useCallback((amount: number) => {
    if (amount <= 0) return;
    if (savedBalance < amount) {
      alert("Not enough money in the bank to withdraw!");
      return;
    }
    setSavedBalance(prev => prev - amount);
    setBalance(prev => prev + amount);
    
    // Just update balances in gamification stats, no special logic
    setGameStats(prev => ({ ...prev, currentSaved: prev.currentSaved - amount, currentBalance: prev.currentBalance + amount }));

    addTransaction('withdraw', amount, `Withdrew ${settings.currency}${amount.toFixed(2)} from bank`);
  }, [savedBalance, setBalance, setSavedBalance, addTransaction, settings.currency, setGameStats]);

  const handleNewClass = useCallback(() => {
    if (window.confirm("Are you sure you want to start a new class? This will reset the class earnings for this session.")) {
      setClassEarnings(0);
    }
  }, [setClassEarnings]);

  const handleReset = useCallback(() => {
    if (window.confirm("Are you sure you want to reset the wallet? This will restore the wallet to its starting state and clear history. Badges will be kept.")) {
      // Clear state
      setBalance(0);
      setSavedBalance(0);
      setHistory([]);
      setClassEarnings(0);
      // Note: We keep gameStats lifetime stats and badges usually, 
      // but let's reset current balances in gameStats
      setGameStats(prev => ({...prev, currentBalance: 0, currentSaved: 0}));
    }
  }, [setBalance, setSavedBalance, setHistory, setClassEarnings, setGameStats]);

  // Batch import transactions
  const handleImportTransactions = (newTransactions: Transaction[]) => {
    let balanceChange = 0;
    let savedChange = 0;
    let classEarningsChange = 0;
    let earnedTotal = 0;
    let savedTotal = 0;

    newTransactions.forEach(t => {
      if (t.type === 'earn') {
        balanceChange += t.amount;
        classEarningsChange += t.amount;
        earnedTotal += t.amount;
      } else if (t.type === 'spend') {
        balanceChange -= t.amount;
      } else if (t.type === 'save') {
        balanceChange -= t.amount;
        savedChange += t.amount;
        savedTotal += t.amount;
      } else if (t.type === 'withdraw') {
        savedChange -= t.amount;
        balanceChange += t.amount;
      }
    });

    setBalance(prev => prev + balanceChange);
    setSavedBalance(prev => prev + savedChange);
    setClassEarnings(prev => prev + classEarningsChange);
    setHistory(prev => [...newTransactions, ...prev]);
    
    // Bulk update gamification
    setGameStats(prev => {
        const nextStats = {
            ...prev,
            totalLifetimeEarnings: prev.totalLifetimeEarnings + earnedTotal,
            totalLifetimeSavings: prev.totalLifetimeSavings + savedTotal,
            currentBalance: prev.currentBalance + balanceChange,
            currentSaved: prev.currentSaved + savedChange,
        };
        const badges = checkBadges(nextStats);
        return { ...nextStats, unlockedBadges: badges };
    });
    
    alert(`Successfully imported ${newTransactions.length} transactions.`);
  };

  const handleUpdateSettings = (newSettings: AppSettings, newPrices: Price[], newGoals: string[]) => {
    setSettings(newSettings);
    setPriceList(newPrices);
    setGoals(newGoals);
  };

  const closeTimer = () => {
    setTimer({ active: false, duration: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <Header title={settings.walletTitle} studentName={settings.studentName} />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <WalletDisplay
              balance={balance}
              savedBalance={savedBalance}
              priceList={priceList}
              onSpend={handleSpend}
              onSave={handleSave}
              onWithdraw={handleWithdraw}
              currency={settings.currency}
            />
            <GamificationPanel stats={gameStats} />
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
              settings={settings}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onImportTransactions={handleImportTransactions}
            />
          </div>
        </main>
      </div>
      
      {timer.active && (
        <TimerModal durationInMinutes={timer.duration} onClose={closeTimer} />
      )}

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings}
          priceList={priceList}
          goals={goals}
          onSave={handleUpdateSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default App;