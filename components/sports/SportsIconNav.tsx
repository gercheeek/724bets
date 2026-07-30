import React from 'react';
import { Home, Star, Copy, Search, ChevronRight } from 'lucide-react';

const navItems = [
    { id: 'soccer', title: 'Futbol', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 12l3-2.5 1 4.5-4 2-4-2 1-4.5z"/>
            <path d="M12 12V7"/><path d="M15 9.5l3-2.5"/><path d="M16 14l4 1"/><path d="M12 16v6"/><path d="M8 14l-4 1"/><path d="M9 9.5L6 7"/>
        </svg>
    ) },
    { id: 'tennis', title: 'Tenis', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2c-4.4 0-8 3.6-8 8"/>
            <path d="M22 12c0 4.4-3.6 8-8 8"/>
        </svg>
    ) },
    { id: 'baseball', title: 'Beyzbol', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M5 12c2.5 0 4-1.5 4-4"/>
            <path d="M19 12c-2.5 0-4 1.5-4 4"/>
            <path d="M8 7l1 1"/><path d="M7 9l1 1"/><path d="M16 17l-1-1"/><path d="M17 15l-1-1"/>
        </svg>
    ) },
    { id: 'basketball', title: 'Basketbol', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2v20"/><path d="M2 12h20"/>
            <path d="M12 2a15 15 0 0 1 0 20"/><path d="M12 2a15 15 0 0 0 0 20"/>
        </svg>
    ) },
    { id: 'cricket', title: 'Kriket', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 14l-8-8 2-2 8 8-2 2z"/>
            <path d="M12 16l4-4 2 2-4 4-2-2z"/>
            <circle cx="18" cy="18" r="2"/>
        </svg>
    ) },
    { id: 'volleyball', title: 'Voleybol', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2c0 6 4 10 10 10"/><path d="M2 12c6 0 10 4 10 10"/><path d="M12 22c0-6-4-10-10-10"/><path d="M22 12c-6 0-10-4-10-10"/>
        </svg>
    ) },
    { id: 'tabletennis', title: 'Masa Tenisi', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 12l-6-6-4 4 6 6 4-4z"/>
            <path d="M10 18l-2 4"/><path d="M14 14l4-2"/>
            <circle cx="18" cy="18" r="2"/>
        </svg>
    ) },
    { id: 'rugby', title: 'Ragbi', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(45 12 12)"/>
            <path d="M9 9l6 6"/><path d="M11 7l2 2"/><path d="M13 9l2 2"/><path d="M15 11l2 2"/>
        </svg>
    ) },
    { id: 'nba2k', title: 'NBA2K', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <text x="4" y="14" fontSize="11" fontWeight="900" fontFamily="sans-serif">NBA</text>
            <text x="7" y="22" fontSize="9" fontWeight="900" fontFamily="sans-serif">2K</text>
        </svg>
    ) },
    { id: 'aussie', title: 'Avustralya...', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-30 12 12)" fill="currentColor"/>
        </svg>
    ) },
    { id: 'efootball', title: 'eFutbol', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 12l3-2.5 1 4.5-4 2-4-2 1-4.5z"/>
            <circle cx="16" cy="16" r="4" fill="#0f1422" stroke="none" />
            <text x="14" y="19" fontSize="10" fontWeight="bold">e</text>
        </svg>
    ) },
    { id: 'snooker', title: 'Snooker', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="2"/><circle cx="9" cy="13" r="2"/><circle cx="15" cy="13" r="2"/><circle cx="12" cy="18" r="2"/>
            <circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>
        </svg>
    ) },
    { id: 'ehockey', title: 'eBuz Hokeyi', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4L8 16a2 2 0 0 0 2 2h6"/>
            <circle cx="10" cy="20" r="2"/>
        </svg>
    ) },
    { id: 'darts', title: 'Dart', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
        </svg>
    ) },
    { id: 'badminton', title: 'Badminton', icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3 6 4-2-2 6-4 2-1 6-1-6-4-2-2-6 4 2 3-6z"/>
        </svg>
    ) }
];

interface SportsIconNavProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    liveCounts?: Record<string, number>;
}

export default function SportsIconNav({ activeTab = 'home', onTabChange = () => {}, liveCounts = {} }: SportsIconNavProps) {
    return (
        <div className="w-full relative flex items-center py-1 md:py-1.5 pl-2 overflow-hidden">
            
            {/* Top Highlight Line for the container */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            {/* Left Static Actions */}
            <div className="flex items-center gap-1.5 shrink-0 mr-3 pr-4 relative after:content-[''] after:absolute after:right-0 after:top-2 after:bottom-2 after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-white/5 after:to-transparent">
                
                <button 
                  onClick={() => onTabChange('home')}
                  className={`w-12 h-12 rounded-lg transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
                    activeTab === 'home' 
                      ? 'bg-gradient-to-b from-[#00E5FF]/20 to-transparent shadow-[inset_0_20px_30px_-15px_rgba(0,229,255,0.3)]' 
                      : 'bg-transparent hover:bg-white/[0.03]'
                  }`}
                >
                    {activeTab === 'home' && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_15px_#00E5FF]"></div>}
                    <Home className={`w-5 h-5 transition-all duration-300 ${activeTab === 'home' ? 'text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]' : 'text-[#64748b] group-hover:text-white'}`} strokeWidth={1.8} />
                    {activeTab === 'home' && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></div>}
                </button>

                <button 
                  onClick={() => onTabChange('canli')}
                  className={`w-14 h-12 rounded-lg transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
                    activeTab === 'canli' 
                      ? 'bg-gradient-to-b from-[#00E5FF]/20 to-transparent shadow-[inset_0_20px_30px_-15px_rgba(0,229,255,0.3)]' 
                      : 'bg-transparent hover:bg-white/[0.03]'
                  }`}
                >
                    {activeTab === 'canli' && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_15px_#00E5FF]"></div>}
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${activeTab === 'canli' ? 'bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-pulse' : 'bg-[#00E5FF]/40'}`}></div>
                        <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${activeTab === 'canli' ? 'text-white drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]' : 'text-[#64748b]'}`}>CANLI</span>
                    </div>
                </button>

                <button 
                  onClick={() => onTabChange('favorites')}
                  className={`w-12 h-12 rounded-lg transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
                    activeTab === 'favorites' 
                      ? 'bg-gradient-to-b from-[#eab308]/20 to-transparent shadow-[inset_0_20px_30px_-15px_rgba(234,179,8,0.3)]' 
                      : 'bg-transparent hover:bg-white/[0.03]'
                  }`}
                >
                    {activeTab === 'favorites' && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#eab308] to-transparent shadow-[0_0_15px_#eab308]"></div>}
                    <Star className={`w-5 h-5 transition-all duration-300 ${activeTab === 'favorites' ? 'text-white drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]' : 'text-[#64748b] group-hover:text-white'}`} strokeWidth={1.8} />
                    {activeTab === 'favorites' && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#eab308] shadow-[0_0_8px_#eab308]"></div>}
                </button>

                <button 
                  onClick={() => onTabChange('mybets')}
                  className={`w-12 h-12 rounded-lg transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden ${
                    activeTab === 'mybets' 
                      ? 'bg-gradient-to-b from-[#10b981]/20 to-transparent shadow-[inset_0_20px_30px_-15px_rgba(16,185,129,0.3)]' 
                      : 'bg-transparent hover:bg-white/[0.03]'
                  }`}
                >
                    {activeTab === 'mybets' && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#10b981] to-transparent shadow-[0_0_15px_#10b981]"></div>}
                    <div className="relative">
                        <Copy className={`w-5 h-5 transition-all duration-300 ${activeTab === 'mybets' ? 'text-white drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'text-[#64748b] group-hover:text-white'}`} strokeWidth={1.8} />
                        {activeTab !== 'mybets' && <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_5px_#10b981]"></div>}
                    </div>
                    {activeTab === 'mybets' && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></div>}
                </button>
            </div>

            {/* Scrollable Sports List */}
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-1.5 px-1 py-1">
                {navItems.map((item, idx) => {
                    const isActive = typeof window !== 'undefined' && window.location.pathname.includes(item.id);
                    const count = liveCounts[item.title] || 0;
                    
                    return (
                    <button 
                        key={idx}
                        onClick={() => {
                            if (item.title) {
                                window.history.pushState(null, '', `/spor/${item.id}`);
                                window.dispatchEvent(new PopStateEvent('popstate'));
                            }
                        }}
                        className={`group relative flex flex-col items-center justify-center min-w-[70px] h-[64px] rounded-xl transition-all duration-300 overflow-hidden ${
                            isActive 
                                ? 'bg-gradient-to-b from-[#00E5FF]/20 via-[#00E5FF]/5 to-transparent' 
                                : 'bg-transparent hover:bg-white/[0.03]'
                        }`}
                        title={item.title || item.id}
                    >
                        {isActive && (
                            <>
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_15px_#00E5FF]"></div>
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00E5FF]/20 via-transparent to-transparent opacity-60"></div>
                            </>
                        )}
                        {!isActive && (
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/40 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.4)] transition-all duration-500"></div>
                        )}
                        
                        <div className="relative flex items-center justify-center mb-1.5 mt-1">
                            <div className={`absolute -top-1.5 -right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 leading-none backdrop-blur-sm ${
                                count > 0 
                                ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_10px_rgba(0,229,255,0.3)]' 
                                : 'bg-white/5 text-white/40 border border-white/5'
                            }`}>
                                {count}
                            </div>
                            
                            <div className={`transition-all duration-300 z-10 ${
                                isActive 
                                    ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] scale-110' 
                                    : 'text-[#64748b] group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                            }`}>
                                {React.cloneElement(item.icon as React.ReactElement<any>, { width: 22, height: 22, strokeWidth: isActive ? 1.8 : 1.5 })}
                            </div>
                        </div>
                        
                        <span className={`text-[10px] font-bold tracking-wider uppercase z-10 transition-all duration-300 ${
                            isActive 
                                ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]' 
                                : 'text-[#64748b] group-hover:text-gray-300'
                        }`}>
                            {item.title}
                        </span>
                    </button>
                )})}
            </div>

            {/* Right Arrow (Fixed) */}
            <div className="absolute right-0 top-0 bg-gradient-to-l from-[#0a0d14] via-[#0a0d14]/80 to-transparent w-16 h-full flex justify-end items-center pr-2 pointer-events-none z-20">
                <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center pointer-events-auto transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:scale-110">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
