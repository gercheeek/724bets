import React from 'react';
import { MatchAnalysis } from '../types';
import { ChevronRight, TrendingUp, BarChart3 } from 'lucide-react';

interface HomeAnalysesProps {
    analyses: MatchAnalysis[];
    onNavigate: (view: string) => void;
}

const HomeAnalyses: React.FC<HomeAnalysesProps> = ({ analyses, onNavigate }) => {

    // Filter to only get football for home page preview, top 5 highest confidence
    const topAnalyses = [...analyses]
        .filter(a => a.sport !== 'Basketbol' && !a.league.toLowerCase().includes('nba'))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

    if (topAnalyses.length === 0) return null;



    // Format date for display (e.g., "6 Nis 2026")
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    return (
        <section className="relative w-full h-full bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md rounded-2xl p-3 md:p-4">
            <div className="w-full h-full mx-auto">

                {/* Simplified Header Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800/50">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#f0b90b]" />
                        <h3 className="text-white font-black uppercase tracking-widest text-sm">POPÜLER TAHMİNLER</h3>
                    </div>
                    
                    <div className="flex gap-1.5">
                        <button onClick={() => onNavigate('analysis')} className="px-3 py-1.5 bg-[#f0b90b] text-black text-[8px] font-black uppercase tracking-widest rounded-lg shadow-[0_4px_15px_rgba(240,185,11,0.2)]">
                            FUTBOL
                        </button>
                        <button onClick={() => onNavigate('analysis')} className="px-3 py-1.5 bg-zinc-800/40 border border-zinc-700/30 text-zinc-500 text-[8px] font-black uppercase tracking-widest rounded-lg hover:border-zinc-500 hover:text-white transition-all">
                            BASKETBOL
                        </button>
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-1.5 mb-4 pb-1 justify-start scrollbar-none">
                    <button className="flex flex-col items-center justify-center min-w-[60px] h-[42px] rounded-xl bg-[#f0b90b] text-black shadow-[0_4px_20px_rgba(240,185,11,0.3)]">
                         <span className="text-[7px] font-black uppercase tracking-widest mb-0.5">BUGÜN</span>
                         <span className="text-[10px] font-bold italic">TÜMÜ</span>
                    </button>
                    {[1, 2, 3, 4].map(i => {
                        const d = new Date();
                        d.setDate(d.getDate() + i);
                        const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
                        return (
                            <button key={i} onClick={() => onNavigate('analysis')} className="flex flex-col items-center justify-center min-w-[55px] h-[42px] rounded-xl border border-zinc-700/50 bg-zinc-800/20 text-zinc-500 hover:border-zinc-500 hover:text-white transition-all">
                                <span className="text-[7px] font-black uppercase tracking-widest mb-0.5">{dayNames[d.getDay()]}</span>
                                <span className="text-[10px] font-bold italic">{d.getDate()} {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][d.getMonth()]}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Data Table */}
                <div className="w-full">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-[#f0b90b] rounded-full shadow-[0_0_10px_rgba(240,185,11,0.5)]"></div>
                        <h3 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">ÖNE ÇIKAN ANALİZLER</h3>
                    </div>

                    {/* Premium Cards Grid */}
                    <div className="grid grid-cols-1 gap-2">
                        {topAnalyses.map((item) => {
                            const kgVarOdd = (1.50 + Math.random() * 0.4).toFixed(2);
                            const ustOdd = (1.60 + Math.random() * 0.4).toFixed(2);
                            
                            return (
                                <div key={item.id} className="group relative">
                                    {/* Premium Match Card */}
                                    <div 
                                        onClick={() => onNavigate('analysis')}
                                        className="bg-zinc-800/20 border border-zinc-800/50 p-2 md:px-4 md:py-3 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2 transition-all duration-300 hover:border-[#f0b90b]/40 hover:bg-zinc-800/40 cursor-pointer group/card"
                                    >
                                        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                                            <div className="w-8 h-8 shrink-0 bg-black rounded-lg flex items-center justify-center border border-zinc-800 group-hover/card:border-[#f0b90b]/30">
                                                <TrendingUp className="w-3.5 h-3.5 text-[#f0b90b]" />
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">
                                                    <span className="text-[#f0b90b] text-[8px] font-black">{item.matchTime}</span>
                                                    <span className="text-zinc-600 text-[7px] font-black uppercase tracking-widest truncate">{item.league}</span>
                                                </div>
                                                <h3 className="text-white font-black text-xs uppercase tracking-tight truncate">
                                                    {item.homeTeam} <span className="text-zinc-600 font-medium lowercase px-1 text-[9px]">vs</span> {item.awayTeam}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-zinc-800/50 pt-2 sm:pt-0">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[6px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-0.5">TAHMİN</span>
                                                    <div className="px-2 py-0.5 bg-[#f0b90b]/5 border border-[#f0b90b]/20 rounded-md">
                                                        <span className="text-[#f0b90b] font-black text-[9px] uppercase italic">{item.prediction}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[6px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">KG</span>
                                                        <span className="text-white font-black text-[10px]">{kgVarOdd}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[6px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">2.5Ü</span>
                                                        <span className="text-white font-black text-[10px]">{ustOdd}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end min-w-[35px]">
                                                <span className="text-[6px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">GÜVEN</span>
                                                <span className="text-sm font-black text-[#f0b90b] tracking-tighter">%{item.confidence}</span>
                                            </div>
                                            
                                            <ChevronRight className="hidden md:block w-3.5 h-3.5 text-zinc-700 group-hover/card:text-[#f0b90b] transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 flex justify-center">
                    <button 
                        onClick={() => onNavigate('analysis')}
                        className="group flex items-center gap-2 px-6 py-3 bg-transparent border border-zinc-800 rounded-xl hover:border-[#f0b90b] transition-all duration-300"
                    >
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-[#f0b90b]">DAHA FAZLA ANALİZ</span>
                    </button>
                </div>

            </div>
        </section>
    );
};

export default HomeAnalyses;
