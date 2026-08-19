import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, BarChart2, MessageCircle, Info, Shield, Trophy, Activity, Star } from 'lucide-react';

interface SingleMatchViewProps {
  match: any;
  onBack?: () => void;
}

const MOCK_CATEGORIES = [
  'Ana Seçenekler', 'Toplam', 'Yarılar', 'Kornerler', 'Oyuncular', 'İstatistikler', 'Asya'
];

const MOCK_MARKETS = [
  // Ana Seçenekler
  { id: 'm1', category: 'Ana Seçenekler', title: 'Maç Sonucu', selections: [{label: '1', odds: '1.85'}, {label: 'X', odds: '3.40'}, {label: '2', odds: '4.20'}] },
  { id: 'm2', category: 'Ana Seçenekler', title: 'Çifte Şans', selections: [{label: '1X', odds: '1.22'}, {label: '12', odds: '1.30'}, {label: 'X2', odds: '1.85'}] },
  { id: 'm3', category: 'Ana Seçenekler', title: 'Karşılıklı Gol', selections: [{label: 'Var', odds: '1.75'}, {label: 'Yok', odds: '1.95'}] },
  { id: 'm4', category: 'Ana Seçenekler', title: 'Maç Golü 2.5 Alt/Üst', selections: [{label: 'Alt', odds: '1.90'}, {label: 'Üst', odds: '1.80'}] },
  { id: 'm5', category: 'Ana Seçenekler', title: 'Beraberlikte İade', selections: [{label: '1', odds: '1.35'}, {label: '2', odds: '3.10'}] },

  // Toplam
  { id: 't1', category: 'Toplam', title: 'Toplam Gol 1.5', selections: [{label: 'Alt', odds: '3.20'}, {label: 'Üst', odds: '1.30'}] },
  { id: 't2', category: 'Toplam', title: 'Toplam Gol 3.5', selections: [{label: 'Alt', odds: '1.35'}, {label: 'Üst', odds: '2.90'}] },
  { id: 't3', category: 'Toplam', title: 'Ev Sahibi Toplam Gol 1.5', selections: [{label: 'Alt', odds: '1.60'}, {label: 'Üst', odds: '2.20'}] },
  { id: 't4', category: 'Toplam', title: 'Deplasman Toplam Gol 1.5', selections: [{label: 'Alt', odds: '1.20'}, {label: 'Üst', odds: '4.00'}] },
  { id: 't5', category: 'Toplam', title: 'Tek/Çift Gol', selections: [{label: 'Tek', odds: '1.85'}, {label: 'Çift', odds: '1.85'}] },

  // Yarılar
  { id: 'h1', category: 'Yarılar', title: '1. Yarı Sonucu', selections: [{label: '1', odds: '2.40'}, {label: 'X', odds: '2.10'}, {label: '2', odds: '4.50'}] },
  { id: 'h2', category: 'Yarılar', title: '1. Yarı Toplam Gol 1.5', selections: [{label: 'Alt', odds: '1.40'}, {label: 'Üst', odds: '2.70'}] },
  { id: 'h3', category: 'Yarılar', title: 'En Çok Gol Olan Yarı', selections: [{label: '1. Yarı', odds: '3.10'}, {label: 'Eşit', odds: '3.40'}, {label: '2. Yarı', odds: '2.00'}] },

  // Kornerler
  { id: 'c1', category: 'Kornerler', title: 'Toplam Korner 9.5', selections: [{label: 'Alt', odds: '1.85'}, {label: 'Üst', odds: '1.85'}] },
  { id: 'c2', category: 'Kornerler', title: 'Ev Sahibi Korner 5.5', selections: [{label: 'Alt', odds: '1.70'}, {label: 'Üst', odds: '2.00'}] },
  { id: 'c3', category: 'Kornerler', title: 'Deplasman Korner 3.5', selections: [{label: 'Alt', odds: '2.10'}, {label: 'Üst', odds: '1.65'}] },
  { id: 'c4', category: 'Kornerler', title: '1. Yarı Toplam Korner 4.5', selections: [{label: 'Alt', odds: '1.90'}, {label: 'Üst', odds: '1.80'}] },

  // Oyuncular
  { id: 'p1', category: 'Oyuncular', title: 'İlk Golü Atar', selections: [{label: 'Ev', odds: '5.50'}, {label: 'Dep', odds: '6.50'}, {label: 'Hiçbiri', odds: '10.00'}] },
  { id: 'p2', category: 'Oyuncular', title: 'Herhangi Bir Zamanda Gol Atar', selections: [{label: 'Oyuncu A', odds: '2.50'}, {label: 'Oyuncu B', odds: '2.80'}, {label: 'Oyuncu C', odds: '3.50'}] },
  { id: 'p3', category: 'Oyuncular', title: 'Oyuncu Kart Görür mü?', selections: [{label: 'Oyuncu A (Evet)', odds: '3.00'}, {label: 'Oyuncu B (Evet)', odds: '2.50'}] },

  // İstatistikler
  { id: 's1', category: 'İstatistikler', title: 'Toplam Kart 4.5', selections: [{label: 'Alt', odds: '1.95'}, {label: 'Üst', odds: '1.75'}] },
  { id: 's2', category: 'İstatistikler', title: 'Kırmızı Kart Çıkar mı?', selections: [{label: 'Evet', odds: '4.50'}, {label: 'Hayır', odds: '1.15'}] },
  { id: 's3', category: 'İstatistikler', title: 'Toplam Faul 24.5', selections: [{label: 'Alt', odds: '1.85'}, {label: 'Üst', odds: '1.85'}] },
  { id: 's4', category: 'İstatistikler', title: 'Toplam Ofsayt 3.5', selections: [{label: 'Alt', odds: '1.65'}, {label: 'Üst', odds: '2.10'}] },

  // Asya
  { id: 'a1', category: 'Asya', title: 'Asya Handikap', selections: [{label: 'Ev (-0.5)', odds: '1.85'}, {label: 'Dep (+0.5)', odds: '1.95'}] },
  { id: 'a2', category: 'Asya', title: 'Asya Alt/Üst 2.75', selections: [{label: 'Alt', odds: '1.80'}, {label: 'Üst', odds: '2.00'}] },
];

export const SingleMatchView: React.FC<SingleMatchViewProps> = ({ match, onBack }) => {
  const [activeTab, setActiveTab] = useState('Ana Seçenekler');
  const [markets] = useState<any[]>(MOCK_MARKETS);
  const [categories] = useState<string[]>(MOCK_CATEGORIES);

  return (
    <div className="flex flex-col h-full bg-[#09090b] text-white animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-30">
      
      {/* Top Header / Back Button */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-[#202532] bg-[#0E1116] sticky top-0 z-20">
        <button 
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded bg-[#0A0C10] text-zinc-400 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10 transition-colors border border-transparent hover:border-[#00E5FF]/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-[#00E5FF] text-[10px] font-bold uppercase tracking-widest">{match.sport === 'futbol' ? 'Futbol / ' + (match.time === 'Yakında' ? 'Bülten' : 'Canlı') : match.sport}</span>
          <span className="text-sm font-bold text-zinc-200">{match.home} - {match.away}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded bg-[#0A0C10] text-zinc-400 hover:text-zinc-300 hover:bg-yellow-400/10 transition-colors">
            <Star className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Premium Glassmorphism Hero Banner */}
      <div className="relative overflow-hidden border-b border-white/5 bg-[#050608]">
        {/* Subtle grid pattern & glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.03)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative px-4 md:px-8 py-10 md:py-14 flex items-center justify-between max-w-4xl mx-auto">
          {/* Home Team */}
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-full blur-xl group-hover:bg-[#00E5FF]/20 transition-all duration-500"></div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center backdrop-blur-md relative z-10 shadow-2xl">
                <span className="text-2xl md:text-3xl font-black text-white tracking-wider">
                  {match.home?.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <span className="text-base md:text-lg font-bold text-center max-w-[150px] md:max-w-[200px] leading-tight text-zinc-200">{match.home}</span>
          </div>

          {/* Scoreboard (Glassmorphism) */}
          <div className="flex flex-col items-center px-2 md:px-6 z-10">
            {match.isLive ? (
              <div className="flex items-center justify-center gap-2 mb-3 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                <span className="text-[10px] md:text-xs font-bold tracking-widest text-red-500">{match.time}</span>
              </div>
            ) : (
              <span className="text-zinc-400 text-[10px] md:text-xs font-bold mb-3 tracking-widest uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                {match.time}
              </span>
            )}
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 md:px-10 py-4 shadow-2xl flex items-center justify-center gap-4 min-w-[140px] md:min-w-[180px]">
              {match.isLive ? (
                <>
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter w-8 text-center">{match.scoreHome || (match.score ? String(match.score).split(' - ')[0] : '0')}</span>
                  <span className="text-zinc-600 text-2xl font-light">-</span>
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter w-8 text-center">{match.scoreAway || (match.score ? String(match.score).split(' - ')[1] : '0')}</span>
                </>
              ) : (
                <div className="text-2xl md:text-3xl font-black text-zinc-500 tracking-tighter uppercase">VS</div>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 rounded-full blur-xl group-hover:bg-red-500/20 transition-all duration-500"></div>
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center backdrop-blur-md relative z-10 shadow-2xl">
                <span className="text-2xl md:text-3xl font-black text-white tracking-wider">
                  {match.away?.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <span className="text-base md:text-lg font-bold text-center max-w-[150px] md:max-w-[200px] leading-tight text-zinc-200">{match.away}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#202532] bg-[#0E1116] overflow-x-auto no-scrollbar sticky top-[73px] z-10 shadow-md">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-4 text-[11px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all duration-300 relative ${
              activeTab === cat 
                ? 'border-[#00E5FF] text-[#00E5FF] bg-gradient-to-t from-[#00E5FF]/10 to-transparent' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            {activeTab === cat && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[2px] bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]"></div>
            )}
            <span className={activeTab === cat ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : ''}>
              {cat}
            </span>
          </button>
        ))}
      </div>

      {/* Markets Content */}
      <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto bg-[#09090b]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {markets
            .filter(m => m.category === activeTab)
            .map(market => (
              <div key={market.id} className="bg-[#12161E] rounded-xl border border-[#202532] overflow-hidden shadow-sm flex flex-col">
                <div className="px-4 py-3 bg-[#161A23] border-b border-[#202532] flex justify-between items-center shrink-0">
                  <span className="text-zinc-300 text-xs font-bold uppercase tracking-wide">{market.title}</span>
                  <Activity className="w-4 h-4 text-zinc-500" />
                </div>
                <div className={`p-4 grid gap-3 ${market.selections.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'} flex-1 content-start`}>
                  {market.selections.map((opt: any, i: number) => (
                    <button key={i} className="group relative flex flex-col items-center justify-center py-3 px-2 bg-[#1A212D] border border-transparent rounded-lg hover:border-[#00E5FF]/40 hover:bg-[#1A212D] hover:shadow-[0_0_12px_rgba(0,229,255,0.15)] transition-all duration-300 cursor-pointer overflow-hidden">
                      <span className="text-[#a1a7b3] text-[11px] font-bold group-hover:text-zinc-300 text-center leading-tight mb-1">{opt.label}</span>
                      <span className="text-white font-black text-[13px] md:text-sm group-hover:text-[#00E5FF] transition-colors">{opt.odds}</span>
                    </button>
                  ))}
                </div>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};
