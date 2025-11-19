import React from 'react';
import { Price, TokenValue } from './types';
import { OneMinuteIcon, FiveMinuteIcon, TenMinuteIcon, Coin50SenIcon, Coin1RmIcon, Note2RmIcon, Note5RmIcon, Note10RmIcon, Note15RmIcon } from './components/icons';

export const INITIAL_PRICES: Price[] = [
  { rm: 0.50, minutes: 0.5 },
  { rm: 1, minutes: 1 },
  { rm: 2, minutes: 2 },
  { rm: 5, minutes: 5 },
  { rm: 10, minutes: 10 },
  { rm: 15, minutes: 15 },
];

export const EARN_AMOUNTS: number[] = [0.50, 1, 2, 5];

export const MAX_CLASS_EARNINGS = 5;

export const TEACHER_GOALS: string[] = [
  "Mohamed’s goal: learn to save, plan, and manage resources.",
  "Screen time during lunch must be earned and paid for.",
  `A maximum of RM${MAX_CLASS_EARNINGS} can be earned per class.`,
  "Saving now allows him to buy bigger items later.",
];

export const RM_ICON_MAP: { [key: number]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  0.5: Coin50SenIcon,
  1: Coin1RmIcon,
  2: Note2RmIcon,
  5: Note5RmIcon,
  10: Note10RmIcon,
  15: Note15RmIcon,
};


// FIX: Add TOKEN_CONFIG for TokenCard component
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