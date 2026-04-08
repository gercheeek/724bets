import React, { useState } from 'react';
import { MatchAnalysis } from '../types';
import { ChevronDown, ChevronUp, ChevronRight, TrendingUp } from 'lucide-react';

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
        <section className="relative py-12 w-full bg-[#050505]">
            <div className="max-w-[1100px] mx-auto px-4">

                {/* Simulated Header Controls from Screenshot */}
                <div className="flex justify-center gap-4 mb-6">
                    <button className="flex items-center gap-2 px-8 py-3 bg-[#f0b90b] text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(240,185,11,0.2)]">
                        <span className="text-xl">⚽</span> FUTBOL
                    </button>
                    <button onClick={() => onNavigate('analysis')} className="flex items-center gap-2 px-8 py-3 bg-[#121212] border border-zinc-800 text-zinc-400 font-black uppercase tracking-widest rounded-xl hover:text-white transition-colors">
                        <span className="text-xl">🏀</span> BASKETBOL
                    </button>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <button className="px-6 py-2 bg-[#f0b90b] text-black text-[10px] font-black uppercase tracking-widest rounded-lg flex flex-col items-center justify-center">
                        TÜM<br/>HAFTA
                    </button>
                    {[0, 1, 2, 3, 4, 5].map(i => {
                        const d = new Date();
                        d.setDate(d.getDate() + i);
                        const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
                        return (
                            <button key={i} onClick={() => onNavigate('analysis')} className="px-5 py-2 bg-[#121212] border border-zinc-900 text-zinc-400 hover:border-zinc-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex flex-col items-center justify-center transition-all">
                                {dayNames[d.getDay()]}<br/>
                                <span className="text-white mt-0.5">{d.getDate()} {['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'][d.getMonth()]}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-4 mb-12">
                    <button className="px-6 py-2 bg-[#f0b90b] text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                        TÜMÜ
                    </button>
                    <button onClick={() => onNavigate('analysis')} className="px-6 py-2 bg-transparent border border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors">
                        GENEL MAÇLAR
                    </button>
                    <button onClick={() => onNavigate('analysis')} className="px-6 py-2 bg-transparent border border-zinc-800 text-zinc-500 hover:text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors">
                        SÜPER LİG
                    </button>
                </div>

                {/* Data Table */}
                <div className="w-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-5 bg-[#f0b90b] rounded-full shadow-[0_0_10px_rgba(240,185,11,0.5)]"></div>
                        <h3 className="text-white font-black uppercase tracking-[0.2em]">ÖNE ÇIKAN ANALİZLER</h3>
                    </div>

                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-[100px_minmax(200px,1fr)_180px_80px_80px_80px] gap-4 mb-2 px-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-800/50 pb-3">
                        <div>SAAT</div>
                        <div>MAÇ</div>
                        <div className="text-center">TAHMİN</div>
                        <div className="text-center">KG VAR</div>
                        <div className="text-center">2.5 ÜST</div>
                        <div className="text-center">GÜVEN</div>
                    </div>

                    {/* Premium Cards Grid */}
                    <div className="grid grid-cols-1 gap-6">
                        {topAnalyses.map((item) => {
                            const kgVarOdd = (1.50 + Math.random() * 0.4).toFixed(2);
                            const ustOdd = (1.60 + Math.random() * 0.4).toFixed(2);
                            
                            return (
                                <div key={item.id} className="group relative">
                                    {/* Premium Match Card */}
                                    <div 
                                        onClick={() => onNavigate('analysis')}
                                        className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-md p-6 rounded-[32px] flex flex-col md:flex-row items-center justify-between transition-all duration-500 hover:border-[#f0b90b]/40 hover:bg-zinc-900/60 hover:-translate-y-1 shadow-2xl shadow-black/40 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-8 w-full md:w-auto">
                                            {/* Icon Wrapper */}
                                            <div className="hidden lg:flex w-16 h-16 bg-black rounded-3xl items-center justify-center border border-zinc-800/80 transition-all duration-500 group-hover:border-[#f0b90b]/30 group-hover:shadow-[0_0_20px_rgba(240,185,11,0.15)]">
                                                <TrendingUp className="w-7 h-7 text-[#f0b90b]" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2.5">
                                                    <div className="px-2.5 py-1 bg-zinc-800/80 rounded-lg border border-zinc-700/50">
                                                        <span className="text-zinc-400 text-[10px] font-black tracking-widest uppercase">{formatDate(item.matchDate)}</span>
                                                    </div>
                                                    <span className="text-[#f0b90b] text-[11px] font-black">{item.matchTime}</span>
                                                    <span className="ml-2 text-zinc-600 text-[9px] font-black uppercase tracking-widest">{item.league}</span>
                                                </div>
                                                <h3 className="text-white font-black text-xl uppercase italic tracking-tight flex items-center gap-3">
                                                    {item.homeTeam} 
                                                    <span className="text-zinc-600 font-medium not-italic text-xs lowercase">vs</span> 
                                                    {item.awayTeam}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                            {/* Prediction Badge */}
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">EDİTÖR TAHMİNİ</span>
                                                <div className="px-5 py-2.5 bg-[#f0b90b]/10 border border-[#f0b90b]/30 rounded-2xl">
                                                    <span className="text-[#f0b90b] font-black text-xs uppercase italic">{item.prediction}</span>
                                                </div>
                                            </div>

                                            {/* Odds Preview */}
                                            <div className="flex gap-6">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">KG VAR</span>
                                                    <span className="text-white font-black text-lg tracking-tighter">{kgVarOdd}</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">2.5 ÜST</span>
                                                    <span className="text-white font-black text-lg tracking-tighter">{ustOdd}</span>
                                                </div>
                                            </div>

                                            {/* Confidence Level */}
                                            <div className="flex flex-col items-end min-w-[80px]">
                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">GÜVEN</span>
                                                <span className="text-2xl font-black text-[#f0b90b] tracking-tighter">%{item.confidence}</span>
                                            </div>

                                            <div className="hidden lg:flex items-center justify-center p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 group-hover:bg-[#f0b90b] group-hover:text-black transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-10 flex justify-center">
                    <button 
                        onClick={() => onNavigate('analysis')}
                        className="group flex items-center gap-3 px-8 py-4 bg-transparent border border-zinc-800 rounded-2xl hover:border-[#f0b90b] transition-all duration-300"
                    >
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-[#f0b90b]">DAHA FAZLA ANALİZ</span>
                    </button>
                </div>

            </div>
        </section>
    );
};

export default HomeAnalyses;
