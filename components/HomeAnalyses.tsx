import React, { useState } from 'react';
import { MatchAnalysis } from '../types';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';

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

                    {/* Table Rows */}
                    <div className="space-y-3">
                        {topAnalyses.map((item) => {
                            const kgVarOdd = (1.50 + Math.random() * 0.4).toFixed(2);
                            const ustOdd = (1.60 + Math.random() * 0.4).toFixed(2);
                            
                            return (
                                <div key={item.id} className="bg-[#121212] border border-zinc-800/60 rounded-2xl overflow-hidden hover:border-[#f0b90b]/50 hover:shadow-[0_0_20px_rgba(240,185,11,0.1)] transition-all duration-300">
                                    <div 
                                        className="grid grid-cols-1 md:grid-cols-[100px_minmax(200px,1fr)_180px_80px_80px_80px] items-center gap-4 p-4 md:px-6 cursor-pointer"
                                        onClick={() => onNavigate('analysis')}
                                    >
                                        <div className="flex flex-col text-xs font-black">
                                            <span className="text-[#f0b90b]">{formatDate(item.matchDate)}</span>
                                            <span className="text-[#f0b90b]">{item.matchTime}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm font-black italic uppercase tracking-tight text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                            <span>{item.homeTeam}</span>
                                            <span className="text-zinc-600 text-[10px] font-medium not-italic px-1">vs</span>
                                            <span>{item.awayTeam}</span>
                                        </div>

                                        <div className="flex justify-start md:justify-center">
                                            <div className="px-4 py-2 rounded-xl border border-[#f0b90b]/30 bg-[#f0b90b]/5 text-[#f0b90b] text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                {item.prediction}
                                            </div>
                                        </div>

                                        <div className="flex md:justify-center">
                                            <span className="text-[#f0b90b] font-black text-sm">{kgVarOdd}</span>
                                        </div>

                                        <div className="flex md:justify-center">
                                            <span className="text-[#f0b90b] font-black text-sm">{ustOdd}</span>
                                        </div>

                                        <div className="flex md:justify-center">
                                            <span className="text-white font-black text-sm tracking-wide">%{item.confidence}</span>
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
