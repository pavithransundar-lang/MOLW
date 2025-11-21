import React from 'react';
import { Badge, GamificationStats } from '../types';
import { BADGE_DEFINITIONS } from '../constants';
import { FireIcon, TrophyIcon, StarIcon, BankIcon, MoneyIcon, LockIcon } from './icons';

interface GamificationPanelProps {
    stats: GamificationStats;
}

export const GamificationPanel: React.FC<GamificationPanelProps> = ({ stats }) => {
    
    const getIcon = (iconName: string) => {
        switch(iconName) {
            case 'fire': return FireIcon;
            case 'trophy': return TrophyIcon;
            case 'star': return StarIcon;
            case 'bank': return BankIcon;
            case 'money': return MoneyIcon;
            default: return StarIcon;
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
                    <TrophyIcon className="h-8 w-8 text-yellow-500" />
                    Achievements
                </h2>
                <div className="flex items-center bg-orange-100 px-4 py-2 rounded-full border border-orange-200">
                    <FireIcon className={`h-6 w-6 mr-2 ${stats.savingsStreak > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`} />
                    <div>
                        <span className="font-black text-orange-800 text-xl">{stats.savingsStreak}</span>
                        <span className="text-orange-700 text-xs font-bold ml-1 uppercase">Day Streak</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {BADGE_DEFINITIONS.map((badge) => {
                    const isUnlocked = stats.unlockedBadges.includes(badge.id);
                    const Icon = getIcon(badge.icon);

                    return (
                        <div 
                            key={badge.id}
                            className={`relative flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all duration-300 ${isUnlocked ? 'border-yellow-400 bg-yellow-50 shadow-md scale-105' : 'border-gray-100 bg-gray-50 grayscale opacity-70'}`}
                        >
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 text-white shadow-sm ${isUnlocked ? badge.color : 'bg-gray-300'}`}>
                                {isUnlocked ? <Icon className="h-7 w-7" /> : <LockIcon className="h-6 w-6" />}
                            </div>
                            <p className="font-bold text-sm text-gray-800 leading-tight">{badge.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1 leading-tight">{badge.description}</p>
                            {isUnlocked && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-white rounded-full p-0.5 border-2 border-white">
                                    <StarIcon className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-400">
                    Total Lifetime Savings: <span className="font-semibold">{stats.totalLifetimeSavings.toFixed(2)}</span> • 
                    Total Earned: <span className="font-semibold">{stats.totalLifetimeEarnings.toFixed(2)}</span>
                </p>
            </div>
        </div>
    );
};