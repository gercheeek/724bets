const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { useBetting } from '../../contexts/BettingContext';
import { useBetSlip } from '../../contexts/BetSlipContext';
import UpcomingMatchesView from '../UpcomingMatchesView';
import SportsHeroBanner from './SportsHeroBanner';
import { Clock, Play, Trophy, Gamepad2, ChevronDown } from 'lucide-react';

interface GercekViewProps {
  onNavigate?: (view: string) => void;
  initialTab?: string;
}

const GercekView: React.FC<GercekViewProps> = ({ onNavigate, initialTab = 'home' }) => {
  const { matches, isParsing } = useBetting();
  const { betSlip, selectBet } = useBetSlip();
  const [navTab, setNavTab] = useState(initialTab);
  const [activeSport, setActiveSport] = useState('futbol');

  useEffect(() => {
    setNavTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleTabChange = (e: CustomEvent) => {
      setNavTab(e.detail);
    };
    window.addEventListener('changeSportsTab', handleTabChange as EventListener);
    return () => window.removeEventListener('changeSportsTab', handleTabChange as EventListener);
  }, []);

  // Filter out finished matches
  const filteredMatches = matches.filter(m => {
    if (m.period !== 'Canlı' && m.startTs && m.startTs > 0) {
      const now = Date.now();
      if (m.startTs < now - 15 * 60 * 1000) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="w-full min-h-full bg-transparent text-slate-100 p-4 md:p-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      
      {/* ── TOP HERO BANNER (SLIDER) ── */}
      <div className="mb-8">
        <SportsHeroBanner />
      </div>

      {navTab === 'upcoming' ? (
        <div className="w-full h-[calc(100vh-200px)] min-h-[600px] bg-[#0a0d14] rounded-2xl overflow-hidden mt-4 border border-white/5 shadow-2xl relative z-10">
          <UpcomingMatchesView />
        </div>
      ) : (
        <div className="w-full">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-lg font-bold text-white tracking-wide">Canlı Maçlar</h2>
          </div>

          {isParsing ? (
            <div className="py-24 flex flex-col items-center justify-center text-center bg-[#0b0e11] rounded-xl border border-white/5">
              <div className="relative w-12 h-12 mb-4">
                <span className="animate-ping absolute inset-0 rounded-full bg-[#10b981] opacity-20"></span>
                <div className="w-12 h-12 rounded-full border-2 border-[#10b981]/20 border-t-[#10b981] animate-spin"></div>
              </div>
              <h3 className="text-white text-base font-bold tracking-wide mb-1 animate-pulse">MAÇ BÜLTENİ YÜKLENİYOR...</h3>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="py-24 text-center bg-[#0b0e11] rounded-xl border border-white/5">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
                <Trophy className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-white font-medium mb-1">Karşılaşma Bulunamadı</p>
              <p className="text-slate-500 text-sm">Bu kategoride şu an aktif veya yaklaşan bir maç yok.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {(() => {
                const liveMatches = filteredMatches.filter(m => m.period === 'Canlı');
                if (liveMatches.length === 0) return null;
                
                const grouped = liveMatches.reduce((acc, match) => {
                  const league = match.league || 'Diğer Ligler';
                  if (!acc[league]) acc[league] = [];
                  acc[league].push(match);
                  return acc;
                }, {} as Record<string, typeof matches>);

                return Object.entries(grouped).map(([leagueName, leagueMatches]) => {
                  const flagCode = ['se','ch','gb','de','es','it','fr','br','ar','pt'][leagueName.length % 10];
                  return (
                    <div key={leagueName} className="mb-4 bg-[#0b0e11] rounded-lg border border-white/5 overflow-hidden">
                      <div className="bg-[#15191f] px-4 py-3 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <img src={\`https://flagcdn.com/w20/\${flagCode}.png\`} className="w-4 h-3 object-cover rounded-[2px]" />
                          <span className="text-white font-medium text-[13px] tracking-wide">{leagueName}</span>
                          <span className="text-zinc-400 text-[11px] font-bold px-1.5 py-0.5 bg-white/5 rounded ml-1">{leagueMatches.length}</span>
                        </div>
                        <button className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
                          <div className="w-2.5 h-0.5 bg-emerald-500 rounded-full"></div>
                        </button>
                      </div>
                      
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 p-3">
                        {leagueMatches.map((match) => (
                          <div key={match.id} className="bg-[#15191f] rounded-lg p-3 flex flex-col gap-3 border border-white/5 hover:bg-[#1a1e25] transition-colors cursor-pointer group">
                            <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-white/5 pb-2">
                              <span className="truncate">{match.league}</span>
                              <div className="flex items-center gap-1.5 shrink-0 bg-red-500/10 px-2 py-0.5 rounded text-red-500 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                {match.minute}'
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex flex-col gap-2 flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-white font-medium text-[13px] truncate">{match.team1.name}</span>
                                  </div>
                                  <span className="text-[#00ff88] font-bold text-[14px]">{match.team1.score}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-white font-medium text-[13px] truncate">{match.team2.name}</span>
                                  </div>
                                  <span className="text-[#00ff88] font-bold text-[14px]">{match.team2.score}</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-1 w-[60px] shrink-0">
                                <button onClick={(e) => { e.stopPropagation(); selectBet(match.id, '1'); }} className={\`w-full h-7 rounded flex items-center justify-center text-xs font-bold transition-all \${betSlip.some(b => b.id === match.id + '_1') ? 'bg-[#00ff88] text-black' : 'bg-white/5 text-white hover:bg-white/10'}\`}>{match.odds.home}</button>
                                <button onClick={(e) => { e.stopPropagation(); selectBet(match.id, 'X'); }} className={\`w-full h-7 rounded flex items-center justify-center text-xs font-bold transition-all \${betSlip.some(b => b.id === match.id + '_X') ? 'bg-[#00ff88] text-black' : 'bg-white/5 text-white hover:bg-white/10'}\`}>{match.odds.draw}</button>
                                <button onClick={(e) => { e.stopPropagation(); selectBet(match.id, '2'); }} className={\`w-full h-7 rounded flex items-center justify-center text-xs font-bold transition-all \${betSlip.some(b => b.id === match.id + '_2') ? 'bg-[#00ff88] text-black' : 'bg-white/5 text-white hover:bg-white/10'}\`}>{match.odds.away}</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default GercekView;
`;

fs.writeFileSync('components/sports/GercekView.tsx', content);
console.log("Successfully rebuilt GercekView.tsx");
