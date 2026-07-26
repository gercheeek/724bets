import React from 'react';
import { Home, Star, Copy, Search, Dribbble, Gamepad2, ChevronDown } from 'lucide-react';

const navItems = [
    { id: 'soccer', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 12l3-2.5 1 4.5-4 2-4-2 1-4.5z"/>
            <path d="M12 12V7"/><path d="M15 9.5l3-2.5"/><path d="M16 14l4 1"/><path d="M12 16v6"/><path d="M8 14l-4 1"/><path d="M9 9.5L6 7"/>
        </svg>
    ) },
    { id: 'basketball', icon: <Dribbble className="w-5 h-5" /> },
    { id: 'mma', text: 'MMA' },
    { id: 'boxing', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H8L6 8z"/>
            <path d="M16 10h2a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-2"/>
            <path d="M8 14v4a2 2 0 0 0 2 2h2"/>
        </svg>
    ) },
    { id: 'shooter', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/>
            <circle cx="12" cy="12" r="2"/>
        </svg>
    ) },
    { id: 'hockey', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 2L8 16a2 2 0 0 0 2 2h6"/>
            <circle cx="8" cy="20" r="2"/>
        </svg>
    ) },
    { id: 'tennis', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8"/>
            <path d="M12 4c-4.4 0-8 3.6-8 8"/>
            <path d="M20 12c0 4.4-3.6 8-8 8"/>
            <path d="M4 12l4 4"/>
            <path d="M20 12l-4-4"/>
        </svg>
    ) },
    { id: 'golf', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v18"/>
            <path d="M12 2l-4 4h8z"/>
            <circle cx="16" cy="20" r="2"/>
        </svg>
    ) },
    { id: 'valorant', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4l-8 8 8 8V4z"/>
            <path d="M16 6l6 6-6 6V6z"/>
        </svg>
    ) },
    { id: 'football', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(45 12 12)"/>
            <path d="M9 9l6 6"/>
            <path d="M11 7l2 2"/>
            <path d="M13 9l2 2"/>
            <path d="M15 11l2 2"/>
        </svg>
    ) },
    { id: 'dota', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'chess', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 20h8"/>
            <path d="M10 20v-4h4v4"/>
            <path d="M12 16v-6"/>
            <path d="M10 10l2-4 2 4z"/>
        </svg>
    ) },
    { id: 'f1', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 14h16l-4-4H8z"/>
            <circle cx="7" cy="16" r="2"/>
            <circle cx="17" cy="16" r="2"/>
            <path d="M4 14v-2h4"/>
        </svg>
    ) },
    { id: 'horse', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4c-2 0-4 2-4 4v4s-2 2-2 4h12c0-2-2-4-2-4V8c0-2-2-4-4-4z"/>
            <path d="M14 6l2-2"/>
        </svg>
    ) }
];

interface SportsIconNavProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export default function SportsIconNav({ activeTab = 'home', onTabChange = () => {} }: SportsIconNavProps) {
    return (
        <div className="w-full bg-[#162029] border border-white/5 rounded-xl flex items-center px-2 py-1 shadow-md mb-6 overflow-hidden">
            
            {/* Left Static Actions */}
            <div className="flex items-center gap-1 sm:gap-2 pr-4 border-r border-white/10 shrink-0">
                <button 
                  onClick={() => onTabChange('home')}
                  className={`p-2 sm:p-2.5 rounded-lg transition-colors group flex items-center justify-center relative ${
                    activeTab === 'home' 
                      ? 'text-white bg-[#233240]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                    <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    {activeTab === 'home' && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0f62fe] animate-pulse"></div>}
                </button>
                <button 
                  onClick={() => onTabChange('canli')}
                  className={`p-2 sm:p-2.5 rounded-lg transition-colors group flex items-center gap-1 relative ${
                    activeTab === 'canli' 
                      ? 'text-white bg-[#233240]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                    <span className="text-xs font-black tracking-widest uppercase">CANLI</span>
                    {activeTab === 'canli' && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0f62fe] animate-pulse"></div>}
                </button>
                <button className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                    <Star className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group relative">
                    <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#162029]"></span>
                </button>
            </div>

            {/* Scrollable Sports List */}
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-1 px-4">
                {navItems.map((item, idx) => (
                    <button 
                        key={idx}
                        className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors shrink-0 group flex items-center justify-center min-w-[40px]"
                        title={item.id}
                    >
                        {item.text ? (
                            <span className="text-sm font-black tracking-widest group-hover:scale-110 transition-transform">{item.text}</span>
                        ) : (
                            <div className="group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                        )}
                    </button>
                ))}
                
                {/* Expand Arrow */}
                <button className="p-2 text-slate-400 hover:text-white shrink-0 ml-2">
                    <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Right Static Action (Search) */}
            <div className="pl-4 border-l border-white/10 shrink-0">
                <button className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                    <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
}
