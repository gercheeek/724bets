import React, { useState, useEffect } from 'react';
import { Diamond, ChevronRight, Shield, Flame, X, Lock, CheckCircle, BarChart3, AlertCircle } from 'lucide-react';
import { fetchPremiumAnalyses } from '../utils/premiumService';
import type { PremiumAnalysis } from '../types';

interface Props {
  onViewChange: (view: any) => void;
}

interface FloatingEmoji {
  id: number;
  x: number;
  y: number;
}

const PremiumTeaser: React.FC<Props> = ({ onViewChange }) => {
  const [analyses, setAnalyses] = useState<PremiumAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive State
  const [hypeCounts, setHypeCounts] = useState<Record<string, number>>({});
  const [hasHyped, setHasHyped] = useState<Record<string, boolean>>({});
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<PremiumAnalysis | null>(null);
  
  // Simulated Interactive Match Vote State
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [votePercentages, setVotePercentages] = useState({ home: 48, draw: 18, away: 34 });

  useEffect(() => {
    const load = async () => {
      const data = await fetchPremiumAnalyses();
      // Use the latest 3
      const sliced = data.slice(0, 3);
      setAnalyses(sliced);

      // Restore hypes from localstorage
      const storedHypes = JSON.parse(localStorage.getItem('premium_hypes') || '{}');
      const storedUserHypes = JSON.parse(localStorage.getItem('premium_user_hypes') || '{}');
      
      const counts: Record<string, number> = {};
      sliced.forEach(item => {
        counts[item.id] = storedHypes[item.id] || Math.floor(Math.random() * 80) + 120;
      });

      setHypeCounts(counts);
      setHasHyped(storedUserHypes);
      setLoading(false);
    };
    load();
  }, []);

  const handleHype = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation(); // Avoid opening the detailed modal
    
    // Increment count
    const isAlreadyHyped = hasHyped[matchId];
    const newCounts = { ...hypeCounts };
    const newUserHypes = { ...hasHyped };

    if (isAlreadyHyped) {
      newCounts[matchId] = Math.max(0, newCounts[matchId] - 1);
      newUserHypes[matchId] = false;
    } else {
      newCounts[matchId] = newCounts[matchId] + 1;
      newUserHypes[matchId] = true;

      // Spawn floating fire emojis at click location
      const newFloating: FloatingEmoji[] = [];
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      for (let i = 0; i < 5; i++) {
        newFloating.push({
          id: Date.now() + i + Math.random(),
          x: clickX + (Math.random() * 40 - 20),
          y: clickY + (Math.random() * 10 - 25),
        });
      }
      setFloatingEmojis(prev => [...prev, ...newFloating]);

      // Remove after animation completes
      setTimeout(() => {
        setFloatingEmojis(prev => prev.filter(f => !newFloating.some(nf => nf.id === f.id)));
      }, 1000);
    }

    setHypeCounts(newCounts);
    setHasHyped(newUserHypes);

    localStorage.setItem('premium_hypes', JSON.stringify(newCounts));
    localStorage.setItem('premium_user_hypes', JSON.stringify(newUserHypes));
  };

  const handleOpenModal = (match: PremiumAnalysis) => {
    setSelectedMatch(match);
    setSelectedVote(null);
    // Dynamic random percentages for votes to keep it realistic
    const homeVal = Math.floor(Math.random() * 30) + 40;
    const drawVal = Math.floor(Math.random() * 15) + 10;
    setVotePercentages({
      home: homeVal,
      draw: drawVal,
      away: 100 - homeVal - drawVal
    });
  };

  const handleVote = (side: 'home' | 'draw' | 'away') => {
    if (selectedVote) return; // Only allow one vote
    setSelectedVote(side);
    
    // Adjust percentages visually to register the user's vote
    setVotePercentages(prev => {
      const next = { ...prev };
      if (side === 'home') next.home += 2;
      else if (side === 'draw') next.draw += 2;
      else next.away += 2;
      return next;
    });
  };

  if (!loading && analyses.length === 0) return null;

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* Header Tier */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFC107]/10 flex items-center justify-center border border-[#FFC107]/20 shadow-[0_0_15px_rgba(255,193,7,0.15)]">
            <Diamond className="w-5 h-5 text-[#FFC107] animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">PREMİUM ANALİZLER</h2>
            <p className="text-[10px] font-black text-[#FFC107] uppercase tracking-widest flex items-center gap-1.5">
              <span>Profesyonel Kadro</span> • <span style={{ textShadow: '0 0 10px rgba(0,230,118,0.3)' }} className="text-[#00E676]">%87 BAŞARI ORANI</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => onViewChange('premium')}
          className="flex items-center gap-1.5 text-[11px] font-black text-[#FFC107] hover:opacity-80 transition-all uppercase tracking-wider bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-[#FFC107]/30"
          style={{ cursor: 'pointer' }}
        >
          TÜMÜNÜ GÖR <ChevronRight className="w-4 h-4 text-[#FFC107]" />
        </button>
      </div>

      {/* Grid of Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-44 rounded-2xl bg-white/3 animate-pulse border border-white/5" />
          ))
        ) : (
          analyses.map(analysis => {
            const hasUserHyped = hasHyped[analysis.id];
            const hypes = hypeCounts[analysis.id] || 0;
            // Simulated Match Confidence scoring (85% to 96%)
            const matchScore = 85 + (parseInt(analysis.id.substring(0, 2), 16) || 4) % 12;

            return (
              <div 
                key={analysis.id}
                onClick={() => handleOpenModal(analysis)}
                className="group relative bg-[#090a0d] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#FFC107]/25 transition-all overflow-hidden flex flex-col justify-between h-[180px]"
                style={{
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Neon golden borders sweep animation */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFC107]/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFC107]/40 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                </div>

                {/* Subtle Radial Glow on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,193,7,0.06) 0%, transparent 65%)' }}
                />

                {/* Top Bar: League & Hype Action */}
                <div className="flex justify-between items-center z-10">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107]" />
                    {analysis.league || 'SÜPER LİG'}
                  </span>
                  
                  {/* Interactive Hype Button */}
                  <button
                    onClick={(e) => handleHype(e, analysis.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] font-extrabold uppercase tracking-widest border transition-all ${
                      hasUserHyped 
                        ? 'bg-[#FFC107] text-[#000] border-[#FFC107] shadow-[0_0_10px_rgba(255,193,7,0.4)] scale-105' 
                        : 'bg-white/3 border-white/5 text-zinc-400 hover:text-white hover:border-white/10'
                    }`}
                    style={{ cursor: 'pointer' }}
                  >
                    <Flame className={`w-3 h-3 ${hasUserHyped ? 'fill-current animate-bounce' : 'text-[#FFD54F]'}`} />
                    {hypes} HYPE
                  </button>
                </div>

                {/* Match Title & Pulse active indicator */}
                <div className="my-2 z-10">
                  <h3 className="text-[14px] font-black text-white group-hover:text-[#FFC107] transition-colors truncate tracking-tight">
                    {analysis.matchName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-ping" />
                    <span className="text-[8px] font-bold text-[#00E676] uppercase tracking-wider">ORAN CANLI & AKTİF</span>
                  </div>
                </div>

                {/* Bottom Bar: Betting Details & Guarantees */}
                <div className="z-10 flex flex-col gap-2">
                  
                  {/* Custom animated Win Confidence Score Bar */}
                  <div className="w-full flex flex-col gap-1">
                    <div className="flex justify-between text-[8px] font-black text-zinc-500 uppercase tracking-widest">
                      <span>Yapay Zeka Analiz Gücü</span>
                      <span className="text-[#FFC107] font-black">%{matchScore}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FFC107]/50 to-[#FFC107] rounded-full transition-all duration-1000 group-hover:opacity-100"
                        style={{ width: `${matchScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-lg bg-[#FFC107]/10 border border-[#FFC107]/20 flex items-center justify-center">
                        <span className="text-[9px] font-black text-[#FFC107] uppercase tracking-wider">{analysis.prediction}</span>
                      </div>
                      <span className="text-[11px] font-black text-[#00E676] tracking-tight">@{analysis.odd.toFixed(2)}</span>
                    </div>

                    {analysis.isGuaranteed && (
                      <div className="flex items-center gap-1 text-[8px] font-black text-zinc-500 uppercase tracking-widest bg-white/3 border border-white/5 px-2 py-0.5 rounded-md">
                        <Shield className="w-2.5 h-2.5 text-[#FFC107]" />
                        İADE GARANTİLİ
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Sparking Emojis overlay container */}
      {floatingEmojis.map(f => (
        <span
          key={f.id}
          className="absolute z-50 text-[18px] select-none pointer-events-none animate-float-up"
          style={{
            left: f.x,
            top: f.y,
            animation: 'premiumFloatUp 1s ease-out forwards',
            position: 'fixed'
          }}
        >
          🔥
        </span>
      ))}

      {/* ══════ GLASSMORPHIC VIP MATCH DETAILS PEEK MODAL ══════ */}
      {selectedMatch && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md transition-all duration-300"
          onClick={() => setSelectedMatch(null)}
        >
          <div 
            className="w-full max-w-[500px] bg-[#0c0d12] border border-[#FFC107]/20 rounded-3xl p-6 relative overflow-hidden"
            style={{
              boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 30px rgba(255,193,7,0.08)',
              animation: 'premiumModalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient gold glow in modal background */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-[#FFC107]/5 blur-[80px] pointer-events-none" />

            {/* Close button */}
            <button 
              onClick={() => setSelectedMatch(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 transition-all"
              style={{ cursor: 'pointer' }}
            >
              <X className="w-4 h-4 text-zinc-400 hover:text-white" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center justify-center mt-3 text-center">
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/5 mb-3">
                {selectedMatch.league || 'SÜPER LİG'} ANALİZİ
              </span>
              <h2 className="text-lg font-black text-white tracking-tight leading-tight max-w-[380px]">
                {selectedMatch.matchName}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 bg-[#00E676]/10 border border-[#00E676]/20 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-ping" />
                <span className="text-[8px] font-black text-[#00E676] uppercase tracking-widest">SİSTEM SİNYALİ GÜNCEL</span>
              </div>
            </div>

            {/* Detailed Match parameters & indicators */}
            <div className="my-5 grid grid-cols-3 gap-2.5">
              <div className="bg-white/3 border border-white/5 p-2.5 rounded-2xl text-center">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">KADROLAR</p>
                <p className="text-[10px] font-black text-white uppercase">EKSİKSİZ</p>
              </div>
              <div className="bg-white/3 border border-white/5 p-2.5 rounded-2xl text-center">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">ZEMİN/HAVA</p>
                <p className="text-[10px] font-black text-white uppercase">İDEAL</p>
              </div>
              <div className="bg-white/3 border border-white/5 p-2.5 rounded-2xl text-center">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">YAPAY ZEKA GÜVENİ</p>
                <p className="text-[10px] font-black text-[#FFC107] uppercase">YÜKSEK</p>
              </div>
            </div>

            {/* Interactive User Voting Feature */}
            <div className="bg-white/3 border border-white/5 rounded-2xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-[#FFC107]" />
                <span className="text-[10px] font-black text-white uppercase tracking-wider">KAMUOYU TAHMİNİ (KİM KAZANIR?)</span>
              </div>

              <div className="flex flex-col gap-2">
                {/* 1 button */}
                <button 
                  onClick={() => handleVote('home')}
                  className={`w-full relative py-2.5 px-3 rounded-xl border text-left overflow-hidden transition-all ${
                    selectedVote === 'home' 
                      ? 'border-[#FFC107]/50 bg-[#FFC107]/5' 
                      : 'border-white/5 bg-black/20 hover:border-white/10'
                  }`}
                  style={{ cursor: selectedVote ? 'default' : 'pointer' }}
                >
                  <div className="absolute top-0 left-0 bottom-0 bg-[#FFC107]/10 transition-all duration-1000" style={{ width: `${votePercentages.home}%` }} />
                  <div className="relative z-10 flex justify-between items-center text-[10px] font-extrabold uppercase">
                    <span className="text-white">EV SAHİBİ (1)</span>
                    <span className="text-[#FFC107]">%{votePercentages.home}</span>
                  </div>
                </button>

                {/* X button */}
                <button 
                  onClick={() => handleVote('draw')}
                  className={`w-full relative py-2.5 px-3 rounded-xl border text-left overflow-hidden transition-all ${
                    selectedVote === 'draw' 
                      ? 'border-[#FFC107]/50 bg-[#FFC107]/5' 
                      : 'border-white/5 bg-black/20 hover:border-white/10'
                  }`}
                  style={{ cursor: selectedVote ? 'default' : 'pointer' }}
                >
                  <div className="absolute top-0 left-0 bottom-0 bg-[#FFC107]/10 transition-all duration-1000" style={{ width: `${votePercentages.draw}%` }} />
                  <div className="relative z-10 flex justify-between items-center text-[10px] font-extrabold uppercase">
                    <span className="text-white">BERABERLİK (X)</span>
                    <span className="text-[#FFC107]">%{votePercentages.draw}</span>
                  </div>
                </button>

                {/* 2 button */}
                <button 
                  onClick={() => handleVote('away')}
                  className={`w-full relative py-2.5 px-3 rounded-xl border text-left overflow-hidden transition-all ${
                    selectedVote === 'away' 
                      ? 'border-[#FFC107]/50 bg-[#FFC107]/5' 
                      : 'border-white/5 bg-black/20 hover:border-white/10'
                  }`}
                  style={{ cursor: selectedVote ? 'default' : 'pointer' }}
                >
                  <div className="absolute top-0 left-0 bottom-0 bg-[#FFC107]/10 transition-all duration-1000" style={{ width: `${votePercentages.away}%` }} />
                  <div className="relative z-10 flex justify-between items-center text-[10px] font-extrabold uppercase">
                    <span className="text-white">DEPLASMAN (2)</span>
                    <span className="text-[#FFC107]">%{votePercentages.away}</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Protected Prediction display card */}
            <div className="bg-[#FFC107]/5 border border-[#FFC107]/15 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#FFC107] uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  KİLİTLİ PREMİUM TAHMİN
                </div>
                <span className="text-[11px] font-black text-[#00E676] tracking-tight">ORAN @{selectedMatch.odd.toFixed(2)}</span>
              </div>
              
              <p className="text-[10px] font-bold text-zinc-400 leading-relaxed">
                Bu maça ait yapay zeka skor kombinasyonları ve VIP editör banko tahmini yalnızca Premium üyelerimize özel olarak kilitlidir.
              </p>

              {/* Glowing CTA purchase button */}
              <button
                onClick={() => { setSelectedMatch(null); onViewChange('premium'); }}
                className="w-full py-3 bg-[#FFC107] hover:bg-[#FFC107]/90 text-black font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-[0_4px_20px_rgba(255,193,7,0.3)] hover:scale-[1.02]"
                style={{ cursor: 'pointer' }}
              >
                🔐 VIP ÜYELİKLE TAHMİNİ GÖSTER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS declarations for customized animations */}
      <style>{`
        @keyframes premiumFloatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(1.3);
            opacity: 0;
          }
        }
        @keyframes premiumModalEnter {
          from {
            transform: scale(0.9) translateY(20px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        .animate-shimmer {
          animation: premiumShimmer 3s linear infinite;
        }
        @keyframes premiumShimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

    </div>
  );
};

export default PremiumTeaser;
