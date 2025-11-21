
export interface Price {
  rm: number;
  minutes: number;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'save' | 'withdraw';
  amount: number; // in RM
  description: string;
  timestamp: string;
}

export type TokenValue = 1 | 5 | 10;

export interface AppSettings {
  studentName: string;
  walletTitle: string;
  maxEarnings: number;
  currency: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'star' | 'trophy' | 'bank' | 'fire' | 'money';
  color: string;
  condition: (stats: GamificationStats) => boolean;
}

export interface GamificationStats {
  totalLifetimeEarnings: number;
  totalLifetimeSavings: number;
  currentBalance: number;
  currentSaved: number;
  savingsStreak: number;
  lastSaveDate: string | null; // ISO Date string YYYY-MM-DD
  unlockedBadges: string[]; // Array of Badge IDs
}
