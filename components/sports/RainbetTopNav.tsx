import React from 'react';
import { Home, Radio, Star, FileText, Search, Activity, Dribbble, Crosshair, Flag, Gamepad2, Swords } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const RainbetTopNav = () => {
    const { language } = useLanguage();

    const sportsList = [
        { id: 'soccer', icon: <div className="w-5 h-5 rounded-full border-2 border-current opacity-80"></div>, name: 'Futbol' },
        { id: 'basketball', icon: <Dribbble className="w-5 h-5" />, name: 'Basketbol' },
        { id: 'mma', icon: <Swords className="w-5 h-5" />, name: 'MMA' },
        { id: 'boxing', icon: <Activity className="w-5 h-5" />, name: 'Boks' },
        { id: 'csgo', icon: <Gamepad2 className="w-5 h-5" />, name: 'Counter-Strike' },
        { id: 'tennis', icon: <div className="w-5 h-5 rounded-full border-2 border-current border-dashed opacity-80"></div>, name: 'Tenis' },
        { id: 'golf', icon: <Flag className="w-5 h-5" />, name: 'Golf' },
    ];

    return (
        <div className="w-full bg-[#1a1d29] h-14 flex items-center px-4 border-b border-[#23273a] sticky top-0 z-50 shadow-sm">
            {/* Left Nav Icons */}
            <div className="flex items-center gap-6 text-[#8e939d]">
                <button className="hover:text-white transition-colors">
                    <Home className="w-5 h-5" />
                </button>
                <button className="text-white relative group">
                    <div className="flex items-center justify-center p-1 border border-white/20 rounded">
                        <Radio className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 text-[9px] font-bold bg-[#141621] px-1 rounded-sm border border-[#23273a]">LIVE</span>
                    </div>
                </button>
                <button className="hover:text-white transition-colors">
                    <Star className="w-5 h-5" />
                </button>
                <button className="hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                </button>
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-[#2f3448] mx-6 flex-shrink-0"></div>

            {/* Sports Icons (Scrollable) */}
            <div className="flex-1 flex items-center gap-6 overflow-x-auto scrollbar-hide text-[#8e939d]">
                {sportsList.map(sport => (
                    <button key={sport.id} className="hover:text-white transition-colors flex items-center justify-center min-w-[24px]" title={sport.name}>
                        {sport.icon}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="ml-6 flex-shrink-0 text-[#8e939d] flex items-center">
                <button className="hover:text-white transition-colors">
                    <Search className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
