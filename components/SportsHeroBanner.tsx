import React, { useMemo } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedOdd } from './AnimatedOdd';

export const SportsHeroBanner: React.FC = () => {
  const { events } = useBetting();
  const { language } = useLanguage();

  // Find the Spain vs Argentina match
  const heroMatch = useMemo(() => {
    if (!events || !events.length) return null;
    
    // Attempt to find the specific match
    const match = events.find((ev: any) => {
      const home = ev.data?.participants?.home || '';
      const away = ev.data?.participants?.away || '';
      return (home.includes('Spain') || home.includes('İspanya') || home.includes('Argentina') || home.includes('Arjantin'));
    });

    if (!match) return null;

    const data = match.data;
    const homeTeam = 'İSPANYA';
    const awayTeam = 'ARJANTİN';
    
    let score = '-';
    let minute = 'Yakında';
    let isFinished = data.status === 'finished' || data.status === 'ended' || data.status === 'closed';
    let isLive = data.status === 'in_progress' || data.is_live_betting === true || isFinished;
    
    if (data.scores && Array.isArray(data.scores)) {
      const currentScore = data.scores.find((s: string) => s.startsWith('current|'));
      if (currentScore) {
        const parts = currentScore.split('|');
        if (parts.length >= 4) {
           score = `${parts[2]} - ${parts[3]}`;
        }
      } else if (data.current_score) {
        score = String(data.current_score || '').replace(':', ' - ');
      }
    }
    
    if (isFinished) {
        minute = language === 'tr' ? 'Maç Bitti' : 'FT';
    } else if (data.minute) {
        minute = `${data.minute}'`;
    }

    let homeOdd = '2.40';
    let drawOdd = '3.10';
    let awayOdd = '2.80';

    const rawGroupMarkets = data.group_markets || match.group_markets;
    const rawMarkets = rawGroupMarkets?.['full_event|0'] || rawGroupMarkets?.['game_full_event|0'] || rawGroupMarkets?.['set|1'];
    const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
    
    for (const market of markets) {
       const is1x2 = market.includes('|12|') || market.includes('|1x2|') || market.includes('|match_winner|');
       if (is1x2 && (market.includes('~home~') || market.includes('~away~'))) {
          const parts = market.split('|');
          const selectionsPart = parts.find((p: string) => p.includes('~home~') || p.includes('~away~'));
          
          if (selectionsPart) {
             const selections = selectionsPart.split('!');
             selections.forEach((sel: string) => {
                const sParts = sel.split('~');
                if (sParts.length > 2) {
                  const type = sParts[1].toLowerCase();
                  const odd = parseFloat(sParts[2]);
                  if (!isNaN(odd)) {
                      const oddStr = odd.toFixed(2);
                      if (type === 'home' || type === '1') { homeOdd = oddStr; }
                      if (type === 'draw' || type === 'x') { drawOdd = oddStr; }
                      if (type === 'away' || type === '2') { awayOdd = oddStr; }
                  }
                }
             });
             if (homeOdd !== '-' || awayOdd !== '-') {
                break;
             }
          }
       }
    }

    return {
      homeTeam,
      awayTeam,
      score,
      minute,
      isLive,
      isFinished,
      homeOdd,
      drawOdd,
      awayOdd
    };
  }, [events, language]);

  return (
    <div className="w-full relative px-4 pt-4 pb-2 group">
      <div className="w-full h-[200px] md:h-[240px] lg:h-[280px] rounded-2xl bg-[#050505] relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/[0.05] group/banner">
        
        {/* Background Stadium */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-100 group-hover/banner:scale-105 transition-transform duration-[10s] ease-out"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80&w=2000')` }}
        ></div>
        
        {/* Dark Overlays for Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-[#050505]/90"></div>
        
        {/* Green/Turquoise Glow behind Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#10b981] opacity-[0.15] blur-[100px] rounded-full pointer-events-none"></div>

        {/* Left Player */}
        <div className="hidden md:block absolute bottom-0 left-0 w-[45%] h-full pointer-events-none z-10" >
           <div 
             className="absolute inset-0 bg-cover bg-top opacity-70 mix-blend-luminosity filter contrast-125"
             style={{
               backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Lamine_Yamal_France_v_Spain_7.24.26-142.jpg/960px-Lamine_Yamal_France_v_Spain_7.24.26-142.jpg')`,
               WebkitMaskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 70%)',
               maskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 70%)'
             }}
           ></div>
        </div>

        {/* Right Player */}
        <div className="hidden md:block absolute bottom-0 right-0 w-[45%] h-full pointer-events-none z-10">
           <div 
             className="absolute inset-0 bg-cover bg-top opacity-70 mix-blend-luminosity filter contrast-125"
             style={{
               backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/960px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg')`,
               WebkitMaskImage: 'radial-gradient(circle at 60% 40%, black 20%, transparent 70%)',
               maskImage: 'radial-gradient(circle at 60% 40%, black 20%, transparent 70%)'
             }}
           ></div>
        </div>

        {/* Center Content Area */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-4 pb-4 px-4">
          
          {/* Top Tag & Event Name */}
          <div className="flex flex-col items-center gap-2 mb-3 md:mb-4 animate-fade-in-up">
            {heroMatch && heroMatch.isLive && (
              <div className="flex items-center gap-2 md:gap-3 mt-1 bg-black/40 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
                {!heroMatch.isFinished && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,1)]"></div>}
                <span className={`text-base md:text-lg font-black tracking-[0.2em] uppercase ${heroMatch.isFinished ? 'text-gray-300' : 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}>
                  {heroMatch.minute}
                </span>
              </div>
            )}
          </div>

          {/* Aggressive Typography for Teams & Score/VS */}
          <div className="flex items-center justify-center gap-3 md:gap-5 mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h1 className="text-white font-black text-3xl md:text-5xl lg:text-[56px] uppercase tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] text-right leading-none pb-1">
              İSPANYA
            </h1>
            
            <div className="flex items-center justify-center min-w-[70px] md:min-w-[100px]">
              {heroMatch && (heroMatch.score !== '-' || heroMatch.isLive) ? (
                <div className="flex items-center gap-2 md:gap-4 bg-black/60 border border-white/10 rounded-xl px-4 py-2 md:py-3 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                   <span className="text-white font-black text-3xl md:text-5xl lg:text-[42px] tabular-nums drop-shadow-lg leading-none">{heroMatch.score.split(' - ')[0] || '0'}</span>
                   <span className="text-[#36ffc4] font-black text-xl md:text-2xl drop-shadow-md leading-none">-</span>
                   <span className="text-white font-black text-3xl md:text-5xl lg:text-[42px] tabular-nums drop-shadow-lg leading-none">{heroMatch.score.split(' - ')[1] || '0'}</span>
                </div>
              ) : (
                <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-lg px-2 py-1 md:px-3 md:py-1.5 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <span className="text-[#10b981] font-black italic text-lg md:text-2xl lg:text-[28px] drop-shadow-md leading-none">VS</span>
                </div>
              )}
            </div>
            
            <h1 className="text-white font-black text-3xl md:text-5xl lg:text-[56px] uppercase tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] text-left leading-none pb-1">
              ARJANTİN
            </h1>
          </div>

          {/* Dynamic Odds Buttons (Glassmorphism) */}
          <div className="flex items-center justify-center gap-2 md:gap-3 w-full max-w-[550px] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
             {[
               { label: '1 İSPANYA', odd: heroMatch?.homeOdd || '2.40' },
               { label: 'X BERABERLİK', odd: heroMatch?.drawOdd || '3.10' },
               { label: '2 ARJANTİN', odd: heroMatch?.awayOdd || '2.80' }
             ].map((btn, idx) => (
               <button 
                 key={idx} 
                 className="flex-1 h-[42px] md:h-[50px] rounded-xl bg-black/40 hover:bg-[#10b981]/10 border border-white/10 hover:border-[#10b981]/80 backdrop-blur-xl flex flex-col items-center justify-center gap-0.5 group/odd transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 relative overflow-hidden"
               >
                 {/* Inner Glow on Hover */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#10b981]/20 to-transparent opacity-0 group-hover/odd:opacity-100 transition-opacity duration-300"></div>
                 {/* Shine effect */}
                 <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover/odd:left-[200%] transition-all duration-700 ease-in-out"></div>
                 
                 <span className="text-gray-400 group-hover/odd:text-[#36ffc4] font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-colors relative z-10">{btn.label}</span>
                 <div className="relative z-10">
                   <AnimatedOdd value={btn.odd} />
                 </div>
               </button>
             ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};
