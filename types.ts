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

// FIX: Add TokenValue type for TokenCard component
export type TokenValue = 1 | 5 | 10;
