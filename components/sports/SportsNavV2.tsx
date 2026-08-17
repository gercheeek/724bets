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
        <div className="w-full flex flex-col bg-[#0f1115] border-b border-white/5">
            {/* Top Navigation Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between px-2 py-2">
                <div className="flex items-center overflow-x-auto no-scrollbar gap-1 md:pl-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-full transition-all ${
                                activeTab === tab.id
                                    ? 'bg-[#1a1e24] text-white shadow-sm'
                                    : 'bg-transparent text-[#8a929a] hover:text-white hover:bg-[#1a1e24]/50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                
                <div className="px-2 py-2 md:py-0 md:pr-4 flex-shrink-0">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a929a] group-focus-within:text-white transition-colors" />
                        <input
                            type="text"
                            placeholder={language === 'tr' ? 'Ara...' : 'Search'}
                            className="bg-[#16191f] text-sm text-white rounded-full pl-9 pr-4 py-2 w-full md:w-64 border border-transparent focus:border-white/10 outline-none transition-all placeholder:text-[#5e656d]"
                        />
                    </div>
                </div>
            </div>

            {/* Sub Navigation Row */}
            <div className="flex items-center overflow-x-auto no-scrollbar gap-2 px-4 md:px-4 pb-3 pt-1">
                {sports.map((sport) => (
                    <button
                        key={sport.id}
                        onClick={() => onSportChange(sport.id)}
                        className={`px-4 py-1.5 text-xs font-semibold whitespace-nowrap rounded-full transition-all flex items-center gap-2 ${
                            activeSport === sport.id
                                ? 'bg-[#2a303c] text-white'
                                : 'bg-[#16191f] text-[#8a929a] hover:text-white hover:bg-[#1a1e24]'
                        }`}
                    >
                        {sport.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
