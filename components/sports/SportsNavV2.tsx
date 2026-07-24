import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SportsNavV2Props {
    activeTab: string;
    onTabChange: (tab: string) => void;
    activeSport: string;
    onSportChange: (sport: string) => void;
}

export const SportsNavV2 = ({ activeTab, onTabChange, activeSport, onSportChange }: SportsNavV2Props) => {
    const { language } = useLanguage();

    const tabs = [
        { id: 'featured', label: language === 'tr' ? 'Öne Çıkanlar' : 'Featured' },
        { id: 'in-play', label: language === 'tr' ? 'Canlı Bahis' : 'In-Play' },
        { id: 'all-sports', label: language === 'tr' ? 'Tüm Sporlar' : 'All Sports' },
        { id: 'my-bets', label: language === 'tr' ? 'Bahislerim' : 'My Bets' },
    ];

    const sports = [
        { id: 'popular', label: language === 'tr' ? 'Popüler' : 'Popular' },
        { id: 'soccer', label: language === 'tr' ? 'Futbol' : 'Soccer' },
        { id: 'basketball', label: language === 'tr' ? 'Basketbol' : 'Basketball' },
        { id: 'tennis', label: language === 'tr' ? 'Tenis' : 'Tennis' },
        { id: 'cs', label: 'Counter-Strike' },
        { id: 'baseball', label: language === 'tr' ? 'Beyzbol' : 'Baseball' },
        { id: 'ice-hockey', label: language === 'tr' ? 'Buz Hokeyi' : 'Ice Hockey' },
        { id: 'boxing', label: language === 'tr' ? 'Boks' : 'Boxing' },
        { id: 'american-football', label: language === 'tr' ? 'Am. Futbolu' : 'American Football' },
        { id: 'table-tennis', label: language === 'tr' ? 'Masa Tenisi' : 'Table Tennis' },
    ];

    return (
        <div className="w-full flex flex-col">
            {/* Top Navigation Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2a2e45]/50 bg-[#18191c]">
                <div className="flex items-center overflow-x-auto no-scrollbar pl-4 md:pl-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                                activeTab === tab.id
                                    ? 'border-yellow-500 text-white'
                                    : 'border-transparent text-zinc-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                <div className="px-4 py-2 md:py-0 md:pr-6 md:pl-0 flex-shrink-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder={language === 'tr' ? 'Ara...' : 'Search'}
                            className="bg-[#101114] text-sm text-white rounded-full pl-9 pr-4 py-2 w-full md:w-64 border border-[#2a2e45]/50 focus:border-yellow-500/50 outline-none transition-all placeholder:text-zinc-600"
                        />
                    </div>
                </div>
            </div>

            {/* Sub Navigation Row */}
            <div className="flex items-center overflow-x-auto no-scrollbar bg-[#25262b] border-b border-[#2a2e45]/50 px-4 md:px-6 py-2">
                {sports.map((sport) => (
                    <button
                        key={sport.id}
                        onClick={() => onSportChange(sport.id)}
                        className={`px-4 py-1.5 text-xs font-semibold whitespace-nowrap rounded-md transition-all mr-1 ${
                            activeSport === sport.id
                                ? 'bg-zinc-700/50 text-white'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
                        }`}
                    >
                        {sport.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
