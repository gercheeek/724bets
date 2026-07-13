import React, { useState } from 'react';
import { ArrowLeft, Target, BarChart2, MessageCircle, Info, Shield, Trophy, Activity, Star } from 'lucide-react';

interface SingleMatchViewProps {
  match: any;
  onBack: () => void;
}

export const SingleMatchView: React.FC<SingleMatchViewProps> = ({ match, onBack }) => {
  const [activeTab, setActiveTab] = useState<'tumu' | 'populer' | 'goller' | 'yari' | 'korner'>('tumu');

  // Dummy detailed markets since API only provides 1x2 currently
  const markets = {
    macSonucu: [
      { label: '1', odds: match.odds[0] || '1.85' },
      { label: 'X', odds: match.odds[1] || '3.40' },
      { label: '2', odds: match.odds[2] || '4.20' },
    ],
    cifteSans: [
      { label: '1X', odds: '1.22' },
      { label: '12', odds: '1.30' },
      { label: 'X2', odds: '1.88' },
    ],
    karsilikliGol: [
      { label: 'Var', odds: '1.75' },
      { label: 'Yok', odds: '1.95' },
    ],
    toplamGol: [
      { label: 'Alt 1.5', odds: '3.10', altLabel: 'Üst 1.5', altOdds: '1.25' },
      { label: 'Alt 2.5', odds: '1.85', altLabel: 'Üst 2.5', altOdds: '1.85' },
      { label: 'Alt 3.5', odds: '1.30', altLabel: 'Üst 3.5', altOdds: '3.10' },
    ],
    ilkYariSonucu: [
      { label: '1', odds: '2.45' },
      { label: 'X', odds: '2.10' },
      { label: '2', odds: '4.80' },
    ],
    macSkoru: [
      { label: '1-0', odds: '6.50' },
      { label: '2-0', odds: '8.00' },
      { label: '2-1', odds: '8.50' },
      { label: '0-0', odds: '9.00' },
      { label: '1-1', odds: '6.00' },
      { label: '0-1', odds: '11.00' },
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-30">
      
      {/* Top Header / Back Button */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#202532] bg-[#0E1116] sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded bg-[#1A1D24] text-zinc-400 hover:text-[#00FFA3] hover:bg-[#00FFA3]/10 transition-colors border border-transparent hover:border-[#00FFA3]/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-[#00FFA3] text-[10px] font-bold uppercase tracking-widest">{match.sport === 'futbol' ? 'Futbol / ' + (match.time === 'Yakında' ? 'Bülten' : 'Canlı') : match.sport}</span>
          <span className="text-sm font-bold text-zinc-200">{match.home} - {match.away}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1A1D24] text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors">
            <Star className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Banner with Score */}
      <div className="relative overflow-hidden border-b border-[#202532]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/5 via-transparent to-[#00FFA3]/5"></div>
        
        <div className="relative px-8 py-10 flex items-center justify-between">
          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-[#12161E] border border-[#202532] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <Shield className="w-10 h-10 text-zinc-600" />
            </div>
            <span className="text-lg font-black text-center max-w-[200px] leading-tight text-zinc-100">{match.home}</span>
          </div>

          <div className="flex flex-col items-center px-8">
            <span className="text-zinc-400 text-xs font-bold mb-2 tracking-widest uppercase bg-[#1A1D24] px-3 py-1 rounded-full border border-[#202532] shadow-inner">{match.time}</span>
            {match.isLive ? (
              <div className="flex items-center gap-4 text-5xl font-black text-[#00FFA3] tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,163,0.3)]">
                <span>{match.scoreHome}</span>
                <span className="text-zinc-600 mb-2">-</span>
                <span>{match.scoreAway}</span>
              </div>
            ) : (
              <div className="text-3xl font-black text-zinc-300 tracking-tighter uppercase my-2">VS</div>
            )}
            {match.isLive && (
              <div className="mt-4 flex items-center gap-2 text-red-500 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Canlı</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-[#12161E] border border-[#202532] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <Shield className="w-10 h-10 text-zinc-600" />
            </div>
            <span className="text-lg font-black text-center max-w-[200px] leading-tight text-zinc-100">{match.away}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#202532] bg-[#0E1116] overflow-x-auto custom-scrollbar sticky top-[73px] z-10 shadow-md">
        {[
          { id: 'tumu', label: 'Tümü' },
          { id: 'populer', label: 'Popüler' },
          { id: 'goller', label: 'Goller' },
          { id: 'yari', label: 'Yarı' },
          { id: 'korner', label: 'Korner / Kart' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-[#00FFA3] text-[#00FFA3] bg-[#00FFA3]/5' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1D24]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Markets Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#09090b]">
        
        {/* Row 1: 1x2 & Double Chance */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#12161E] rounded-xl border border-[#202532] overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-[#161A23] border-b border-[#202532] flex justify-between items-center">
              <span className="text-zinc-300 text-xs font-bold uppercase">Maç Sonucu</span>
              <Activity className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {markets.macSonucu.map((opt, i) => (
                <button key={i} className="group relative flex flex-col items-center justify-center h-14 bg-[#1A1D24] border border-[#202532] rounded hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all overflow-hidden">
                  <span className="text-zinc-500 text-[10px] font-bold group-hover:text-zinc-300">{opt.label}</span>
                  <span className="text-white font-black mt-0.5 group-hover:text-[#00FFA3]">{opt.odds}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#12161E] rounded-xl border border-[#202532] overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-[#161A23] border-b border-[#202532] flex justify-between items-center">
              <span className="text-zinc-300 text-xs font-bold uppercase">Çifte Şans</span>
              <Target className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="p-4 grid grid-cols-3 gap-2">
              {markets.cifteSans.map((opt, i) => (
                <button key={i} className="group relative flex flex-col items-center justify-center h-14 bg-[#1A1D24] border border-[#202532] rounded hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all overflow-hidden">
                  <span className="text-zinc-500 text-[10px] font-bold group-hover:text-zinc-300">{opt.label}</span>
                  <span className="text-white font-black mt-0.5 group-hover:text-[#00FFA3]">{opt.odds}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Goals */}
        <div className="bg-[#12161E] rounded-xl border border-[#202532] overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-[#161A23] border-b border-[#202532] flex justify-between items-center">
            <span className="text-zinc-300 text-xs font-bold uppercase">Toplam Gol Alt/Üst</span>
            <Trophy className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="p-4 space-y-2">
            {markets.toplamGol.map((opt, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_2fr] gap-4 items-center p-2 rounded hover:bg-[#1A1D24] transition-colors border border-transparent hover:border-[#202532]">
                <div className="text-zinc-400 text-xs font-bold w-12">{opt.label.split(' ')[1]}</div>
                <button className="group flex justify-between items-center px-4 h-10 bg-[#161A23] border border-[#202532] rounded hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase group-hover:text-zinc-300">Alt</span>
                  <span className="text-white font-black group-hover:text-[#00FFA3]">{opt.odds}</span>
                </button>
                <button className="group flex justify-between items-center px-4 h-10 bg-[#161A23] border border-[#202532] rounded hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all">
                  <span className="text-zinc-500 text-[10px] font-bold uppercase group-hover:text-zinc-300">Üst</span>
                  <span className="text-white font-black group-hover:text-[#00FFA3]">{opt.altOdds}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Correct Score Grid */}
        <div className="bg-[#12161E] rounded-xl border border-[#202532] overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-[#161A23] border-b border-[#202532] flex justify-between items-center">
            <span className="text-zinc-300 text-xs font-bold uppercase">Maç Skoru</span>
            <Activity className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="p-4 grid grid-cols-4 md:grid-cols-6 gap-2">
            {markets.macSkoru.map((opt, i) => (
              <button key={i} className="group flex flex-col items-center justify-center h-14 bg-[#1A1D24] border border-[#202532] rounded hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-zinc-300 text-[11px] font-bold">{opt.label}</span>
                <span className="text-[#00FFA3] font-black mt-1 text-xs">{opt.odds}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
