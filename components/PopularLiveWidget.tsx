import React from 'react';
import { Flame, Activity, ChevronRight } from 'lucide-react';

interface PopularLiveWidgetProps {
    onNavigate: (view: string) => void;
}

export const PopularLiveWidget: React.FC<PopularLiveWidgetProps> = ({ onNavigate }) => {
    
    const demoMatches = [
        {
            league: "Uluslararası - World Cup",
            time: "20'",
            home: { name: "Spain", code: "SP", color: "#3B82F6" },
            away: { name: "Argentina", code: "AR", color: "#3B82F6" },
            score: "0 - 0"
        },
        {
            league: "USA - MLB",
            time: "Aug 15, 20:30",
            home: { name: "Colorado Rockies", code: "CO", color: "#10B981" },
            away: { name: "Cincinnati Reds", code: "CI", color: "#10B981" },
            score: "0 - 5",
            isUpcoming: true
        },
        {
            league: "WTA - Palermo, Singles",
            time: "2. Set",
            home: { name: "Basiletti, Noemi", code: "BA", color: "#F97316" },
            away: { name: "Shinikova, Isabella", code: "SH", color: "#3B82F6" },
            score: "2 - 0",
            bgImage: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=600&auto=format&fit=crop"
        },
        {
            league: "USA - MLB",
            time: "Aug 15, 20:30",
            home: { name: "Houston Astros", code: "HO", color: "#8B5CF6" },
            away: { name: "Baltimore Orioles", code: "BA", color: "#0EA5E9" },
            score: "1 - 2",
            isUpcoming: true
        },
        {
            league: "USA - MLB",
            time: "Aug 15, 20:30",
            home: { name: "Philadelphia Phillies", code: "PH", color: "#F97316" },
            away: { name: "New York Mets", code: "NE", color: "#0EA5E9" },
            score: "0 - 6",
            isUpcoming: true
        },
        {
            league: "Colombia - Liga A...",
            time: "44'",
            home: { name: "Deportivo Alexis Garcia", code: "DE", color: "#10B981" },
            away: { name: "Politecnico JIC", code: "PO", color: "#EF4444" },
            score: "3 - 0"
        }
    ];

    return (
        <div className="w-full mb-8">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Flame className="w-5 h-5 text-emerald-400" />
                <h2 className="text-[17px] font-bold text-white tracking-wide">Popüler Canlı</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoMatches.map((match, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => onNavigate('sports')}
                        className="relative rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                        style={{ 
                            background: '#0a0f16', 
                            border: '1px solid rgba(255,255,255,0.03)',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        {/* Background Image Overlay if exists */}
                        {match.bgImage && (
                            <div 
                                className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity"
                                style={{
                                    backgroundImage: `url(${match.bgImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            />
                        )}
                        
                        <div className="relative z-10 p-4">
                            {/* Top row */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Activity className="w-3.5 h-3.5" />
                                    <span className="text-[11px] font-bold truncate max-w-[140px]">{match.league}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[11px] font-bold ${match.isUpcoming ? 'text-gray-400' : 'text-red-500'}`}>{match.time}</span>
                                    {!match.isUpcoming && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    )}
                                </div>
                            </div>
                            
                            {/* Teams & Score */}
                            <div className="flex items-center justify-between px-2 mb-4">
                                <div className="flex flex-col items-center gap-2 w-[80px]">
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-lg"
                                        style={{ backgroundColor: match.home.color }}
                                    >
                                        {match.home.code}
                                    </div>
                                    <span className="text-[12px] font-bold text-white text-center leading-tight truncate w-full">{match.home.name}</span>
                                </div>
                                
                                <div className="flex flex-col items-center justify-center">
                                    <div className="text-[20px] font-black text-white tracking-widest">{match.score}</div>
                                    <div className="text-[10px] text-gray-500 font-bold mt-1">1X2</div>
                                </div>
                                
                                <div className="flex flex-col items-center gap-2 w-[80px]">
                                    <div 
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-lg"
                                        style={{ backgroundColor: match.away.color }}
                                    >
                                        {match.away.code}
                                    </div>
                                    <span className="text-[12px] font-bold text-white text-center leading-tight truncate w-full">{match.away.name}</span>
                                </div>
                            </div>
                            
                            {/* Odds Buttons */}
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                <button className="bg-[#1a202c] hover:bg-[#2d3748] transition-colors border border-white/5 rounded-lg py-2 flex items-center justify-center gap-1.5 text-gray-400">
                                    <span className="text-[11px] font-bold text-gray-500">1</span>
                                    <span className="text-[12px] font-black">-</span>
                                </button>
                                <button className="bg-[#1a202c] hover:bg-[#2d3748] transition-colors border border-white/5 rounded-lg py-2 flex items-center justify-center gap-1.5 text-gray-400">
                                    <span className="text-[11px] font-bold text-gray-500">Draw</span>
                                    <span className="text-[12px] font-black">-</span>
                                </button>
                                <button className="bg-[#1a202c] hover:bg-[#2d3748] transition-colors border border-white/5 rounded-lg py-2 flex items-center justify-center gap-1.5 text-gray-400">
                                    <span className="text-[11px] font-bold text-gray-500">2</span>
                                    <span className="text-[12px] font-black">-</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* View More Button */}
            <div className="flex justify-center mt-6">
                <button 
                    onClick={() => onNavigate('sports')}
                    className="flex items-center gap-2 bg-[#1a202c] hover:bg-[#2d3748] border border-white/10 text-gray-300 hover:text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all group"
                >
                    Daha Fazlası
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
