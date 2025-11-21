import React from 'react';
import { Price, TokenValue, Badge } from './types';
import { OneMinuteIcon, FiveMinuteIcon, TenMinuteIcon, Coin50SenIcon, Coin1RmIcon, Note2RmIcon, Note5RmIcon, Note10RmIcon, Note15RmIcon } from './components/icons';

export const DEFAULT_PRICES: Price[] = [
  { rm: 0.50, minutes: 0.5 },
  { rm: 1, minutes: 1 },
  { rm: 2, minutes: 2 },
  { rm: 5, minutes: 5 },
  { rm: 10, minutes: 10 },
  { rm: 15, minutes: 15 },
];

export const EARN_AMOUNTS: number[] = [0.50, 1, 2, 5];

export const DEFAULT_MAX_CLASS_EARNINGS = 5;

export const DEFAULT_GOALS: string[] = [
  "Goal 1: Learn to save, plan, and manage resources.",
  "Screen time during class must be earned and paid for.",
  `A maximum of RM${DEFAULT_MAX_CLASS_EARNINGS} can be earned per class.`,
  "Saving now allows you to buy bigger items later.",
];

export const RM_ICON_MAP: { [key: number]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  0.5: Coin50SenIcon,
  1: Coin1RmIcon,
  2: Note2RmIcon,
  5: Note5RmIcon,
  10: Note10RmIcon,
  15: Note15RmIcon,
};


export const TOKEN_CONFIG: { [key in TokenValue]: { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; }; } = {
  1: {
    icon: OneMinuteIcon,
    color: 'bg-teal-500',
  },
  5: {
    icon: FiveMinuteIcon,
    color: 'bg-sky-500',
  },
  10: {
    icon: TenMinuteIcon,
    color: 'bg-indigo-500',
  },
};

export const BADGE_DEFINITIONS: Badge[] = [
    {
        id: 'first_save',
        name: 'First Step',
        description: 'Make your first deposit into the bank.',
        icon: 'star',
        color: 'bg-yellow-400',
        condition: (stats) => stats.totalLifetimeSavings > 0
    },
    {
        id: 'saver_bronze',
        name: 'Piggy Bank',
        description: 'Have a current bank balance of 10 or more.',
        icon: 'bank',
        color: 'bg-orange-400',
        condition: (stats) => stats.currentSaved >= 10
    },
    {
        id: 'saver_gold',
        name: 'Future Investor',
        description: 'Accumulate a total lifetime savings of 50.',
        icon: 'trophy',
        color: 'bg-yellow-500',
        condition: (stats) => stats.totalLifetimeSavings >= 50
    },
    {
        id: 'streak_3',
        name: 'On Fire',
        description: 'Save money 3 days in a row.',
        icon: 'fire',
        color: 'bg-red-500',
        condition: (stats) => stats.savingsStreak >= 3
    },
    {
        id: 'streak_7',
        name: 'Habit Hero',
        description: 'Save money 7 days in a row.',
        icon: 'fire',
        color: 'bg-purple-600',
        condition: (stats) => stats.savingsStreak >= 7
    },
    {
        id: 'earner_master',
        name: 'Hard Worker',
        description: 'Earn a total of 100 lifetime credits.',
        icon: 'money',
        color: 'bg-green-500',
        condition: (stats) => stats.totalLifetimeEarnings >= 100
    }
];