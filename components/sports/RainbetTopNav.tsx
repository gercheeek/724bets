import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface RainbetTopNavProps {
    activeSport?: string;
    onSelectSport?: (sport: string) => void;
}

export const RainbetTopNav = ({ activeSport = 'Futbol', onSelectSport = () => {} }: RainbetTopNavProps) => {
    const { language } = useLanguage();

    const sportsList = [
        { id: 'Futbol', name: 'Futbol', count: '99+', iconColor: 'text-white', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 0 0-9z" />
                <path d="M12 11l4.5-3M12 11L7.5 8M12 11v6M12 17l4.5 3M12 17l-4.5 3" />
            </svg>
        )},
        { id: 'Basketbol', name: 'Basketbol', count: '28', iconColor: 'text-orange-400', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <path d="M5.636 5.636a9 9 0 0 1 12.728 12.728M12 2v20M2 12h20M5.636 18.364a9 9 0 0 1 12.728-12.728" />
            </svg>
        )},
        { id: 'Tenis', name: 'Tenis', count: '99+', iconColor: 'text-[#a3e635]', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2C6.477 2 2 6.477 2 12c0 2.21.716 4.253 1.916 5.916l14.168-14.168A9.954 9.954 0 0 0 12 2z" />
                <path d="M4 12c0-3.5 2.5-6 6-6M20 12c0 3.5-2.5 6-6 6" />
            </svg>
        )},
        { id: 'Am. Futbolu', name: 'Am. Futbolu', count: '67', iconColor: 'text-rose-400', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <ellipse cx="12" cy="12" rx="6" ry="10" transform="rotate(45 12 12)" />
                <path d="M9 9l6 6M10 8l1.5 1.5M8 10l1.5 1.5M14 16l-1.5-1.5M16 14l-1.5-1.5" />
            </svg>
        )},
        { id: 'Hokey', name: 'Hokey', count: '37', iconColor: 'text-cyan-400', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M7 21a2 2 0 0 0 2-2V4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v15a2 2 0 0 0 2 2h4M12 16h4M16 16v-2h-4" />
                <circle cx="16" cy="20" r="1" fill="currentColor" />
            </svg>
        )},
        { id: 'Beyzbol', name: 'Beyzbol', count: '14', iconColor: 'text-yellow-400', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12c3.5 0 6-2.5 6-6M22 12c-3.5 0-6 2.5-6 6M12 2c0 3.5 2.5 6 6 6M12 22c0-3.5-2.5-6-6-6" />
            </svg>
        )},
        { id: 'Masa Tenisi', name: 'Masa Tenisi', count: '99+', iconColor: 'text-emerald-400', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <rect x="7" y="5" width="10" height="12" rx="5" />
                <path d="M12 17v5M10 22h4" />
            </svg>
        )},
        { id: 'Dövüş San.', name: 'Dövüş San.', count: '53', iconColor: 'text-red-400', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M17 6h-3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM9 16H6a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h3a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1zM11 6v8M13 14l-2 2M11 16l2-2" />
                <path d="M13 6h-2a2 2 0 0 0-2 2v2M11 16h2a2 2 0 0 0 2-2v-2" />
            </svg>
        )},
        { id: 'Voleybol', name: 'Voleybol', count: '7', iconColor: 'text-purple-400', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19M8 2l8 20M2 8h20" />
            </svg>
        )},
        { id: 'Kriket', name: 'Kriket', count: '1', iconColor: 'text-yellow-500', svg: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M6 18l12-12M8 20l12-12M4 14l6 6M18 4l2 2" />
            </svg>
        )},
    ];

    return (
        <div className="w-full bg-[#050505] py-4 border-b border-white/5 relative z-50">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center">
                {/* Horizontal Scrolling Area */}
                <div className="flex-1 overflow-x-auto no-scrollbar scroll-smooth flex items-start gap-4 md:gap-6 pb-2">
                    {sportsList.map(sport => {
                        const isSelected = activeSport === sport.id;
                        return (
                            <button 
                                key={sport.id} 
                                onClick={() => onSelectSport(sport.id)}
                                className="group flex flex-col items-center justify-start min-w-[64px] transition-all"
                            >
                                {/* Circle Icon with Badge */}
                                <div className={`relative w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-[#1a1d29] shadow-[0_0_15px_rgba(255,255,255,0.05)]' : 'bg-[#151722] hover:bg-[#1a1d29]'}`}>
                                    <div className={`${sport.iconColor} transition-transform duration-300 ${isSelected ? 'scale-110 drop-shadow-[0_0_8px_currentColor]' : 'group-hover:scale-110'}`}>
                                        {sport.svg}
                                    </div>
                                    
                                    {/* Badge */}
                                    <span className="absolute -top-1 -right-2 bg-[#2d3748] text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#050505] z-10 whitespace-nowrap shadow-sm">
                                        {sport.count}
                                    </span>
                                </div>
                                
                                {/* Text */}
                                <span className={`mt-2.5 text-[11px] md:text-[12px] font-bold tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                    {sport.name}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Optional Right Action (Search/Filter) */}
                <div className="hidden md:flex ml-4 flex-shrink-0">
                    <button className="w-10 h-10 rounded-full bg-[#151722] hover:bg-[#1a1d29] flex items-center justify-center text-zinc-400 hover:text-white transition-colors border border-white/5">
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
