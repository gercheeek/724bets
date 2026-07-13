import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, BarChart2, MessageCircle, Info, Shield, Trophy, Activity, Star } from 'lucide-react';

interface SingleMatchViewProps {
  match: any;
  onBack: () => void;
}

export const SingleMatchView: React.FC<SingleMatchViewProps> = ({ match, onBack }) => {
  const [activeTab, setActiveTab] = useState('Tümü');
  const [markets, setMarkets] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Tümü']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/.netlify/functions/match_details?id=${match.id}`);
        const json = await res.json();
        if (json.success) {
          setMarkets(json.data.markets);
          setCategories(json.data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch match details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [match.id]);

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
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${
              activeTab === cat 
                ? 'border-[#00FFA3] text-[#00FFA3] bg-[#00FFA3]/5' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-[#1A1D24]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Markets Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-[#09090b]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-[#00FFA3] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-[#00FFA3] font-bold text-sm tracking-widest animate-pulse">BAHİSLER YÜKLENİYOR...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {markets
              .filter(m => activeTab === 'Tümü' || m.category === activeTab)
              .map(market => (
                <div key={market.id} className="bg-[#12161E] rounded-xl border border-[#202532] overflow-hidden shadow-sm">
                  <div className="px-4 py-3 bg-[#161A23] border-b border-[#202532] flex justify-between items-center">
                    <span className="text-zinc-300 text-xs font-bold uppercase">{market.title}</span>
                    <Activity className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className={`p-4 grid gap-2 ${market.selections.length > 3 ? 'grid-cols-3' : `grid-cols-${market.selections.length}`}`}>
                    {market.selections.map((opt: any, i: number) => (
                      <button key={i} className="group relative flex flex-col items-center justify-center h-14 bg-[#1A1D24] border border-[#202532] rounded hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all overflow-hidden">
                        <span className="text-zinc-500 text-[10px] font-bold group-hover:text-zinc-300">{opt.label}</span>
                        <span className="text-white font-black mt-0.5 group-hover:text-[#00FFA3]">{opt.odds}</span>
                      </button>
                    ))}
                  </div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
