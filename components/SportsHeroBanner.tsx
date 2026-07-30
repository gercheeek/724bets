import React, { useState, useEffect, useMemo } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AnimatedOdd } from './AnimatedOdd';

const PLAYER_IMAGES: Record<string, string> = {
  'ispanya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Lamine_Yamal_France_v_Spain_7.24.26-142.jpg/960px-Lamine_Yamal_France_v_Spain_7.24.26-142.jpg',
  'spain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Lamine_Yamal_France_v_Spain_7.24.26-142.jpg/960px-Lamine_Yamal_France_v_Spain_7.24.26-142.jpg',
  'arjantin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/960px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg',
  'argentina': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg/960px-Leo_Messi_Argentina_v_Egypt_7_July_2026-1.jpg',
  'fransa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/2022_FIFA_World_Cup_France_4%E2%80%931_Australia_-_%287%29_%28cropped%29.jpg/800px-2022_FIFA_World_Cup_France_4%E2%80%931_Australia_-_%287%29_%28cropped%29.jpg',
  'france': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/2022_FIFA_World_Cup_France_4%E2%80%931_Australia_-_%287%29_%28cropped%29.jpg/800px-2022_FIFA_World_Cup_France_4%E2%80%931_Australia_-_%287%29_%28cropped%29.jpg',
  'portekiz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/800px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg',
  'portugal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg/800px-Cristiano_Ronaldo_playing_for_Al_Nassr_FC_against_Persepolis%2C_September_2023_%28cropped%29.jpg',
  'ingiltere': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jude_Bellingham_Real_Madrid.jpg/800px-Jude_Bellingham_Real_Madrid.jpg',
  'england': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jude_Bellingham_Real_Madrid.jpg/800px-Jude_Bellingham_Real_Madrid.jpg',
  'brezilya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Vinicius_Jr_2021.jpg/800px-Vinicius_Jr_2021.jpg',
  'brazil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Vinicius_Jr_2021.jpg/800px-Vinicius_Jr_2021.jpg'
};

const getPlayerImage = (teamName: string) => {
  const normalized = teamName.toLowerCase();
  for (const key of Object.keys(PLAYER_IMAGES)) {
    if (normalized.includes(key)) return PLAYER_IMAGES[key];
  }
  return null;
};
const getSportBgImage = (sportName: any) => {
  const name = String(sportName || '').toLowerCase();
  if (name.includes('basketbol') || name.includes('basketball') || name === '2') return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2000&auto=format&fit=crop';
  if (name.includes('tenis') || name.includes('tennis') || name === '3') return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2000&auto=format&fit=crop';
  if (name.includes('voleybol') || name.includes('volleyball') || name === '4') return 'https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=2000&auto=format&fit=crop';
  if (name.includes('buz hokeyi') || name.includes('ice hockey')) return 'https://images.unsplash.com/photo-1515703407324-5f753eedf996?q=80&w=2000&auto=format&fit=crop';
  if (name.includes('masa tenisi') || name.includes('table tennis')) return 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=2000&auto=format&fit=crop';
  if (name.includes('e-spor') || name.includes('esports')) return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop';
  if (name.includes('hentbol') || name.includes('handball')) return 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2000&auto=format&fit=crop';
  return 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop'; // Futbol fallback
};

export const SportsHeroBanner: React.FC = () => {
  const { events } = useBetting();
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const heroMatches = useMemo(() => {
    let baseEvents = events || [];

    const extractOdds = (ev: any) => {
      const data = ev.data;
      let homeOdd = '-';
      let drawOdd = '-';
      let awayOdd = '-';

      const rawGroupMarkets = data.group_markets || ev.group_markets;
      const rawMarkets = rawGroupMarkets?.['full_event|0'] || rawGroupMarkets?.['game_full_event|0'] || rawGroupMarkets?.['set|1'];
      const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
      
      for (const market of markets) {
         if (!market || typeof market !== 'string') continue;
         const is1x2 = market.includes('|12|') || market.includes('|1x2|') || market.includes('|match_winner|');
         if (is1x2 && (market.includes('~home~') || market.includes('~away~') || market.includes('~1~') || market.includes('~2~'))) {
            const parts = market.split('|');
            const selectionsPart = parts.find((p: string) => p.includes('~home~') || p.includes('~away~') || p.includes('~1~') || p.includes('~2~'));
            
            if (selectionsPart) {
               const selections = selectionsPart.split('!');
               selections.forEach((sel: string) => {
                  const sParts = sel.split('~');
                  if (sParts.length > 2) {
                    const type = sParts[1].toLowerCase();
                    let odd = parseFloat(sParts[2]);
                    if (!isNaN(odd)) {
                        if (odd < 0) odd = Math.abs(odd);
                        if (odd < 1) odd += 1;
                        if (odd < 1.01) odd = 1.01;
                        const oddStr = odd.toFixed(2);
                        if (type === 'home' || type === '1') { homeOdd = oddStr; }
                        if (type === 'draw' || type === 'x') { drawOdd = oddStr; }
                        if (type === 'away' || type === '2') { awayOdd = oddStr; }
                    }
                  }
               });
               if (homeOdd !== '-' || awayOdd !== '-') {
                  break; // Found valid odds
               }
            }
         }
      }
      return { homeOdd, drawOdd, awayOdd };
    };

    let validEvents = baseEvents.reduce((acc: any[], ev: any) => {
      const data = ev.data;
      if (!data || !data.participants) return acc;
      
      const isFinished = data.status === 'finished' || data.status === 'ended' || data.status === 'closed';
      const isLive = data.status === 'in_progress' || data.is_live_betting === true;
      
      if (!isLive || isFinished) return acc;

      const odds = extractOdds(ev);
      // Filter out matches with no valid odds
      if (odds.homeOdd === '-' && odds.awayOdd === '-') return acc;

      acc.push({ ...ev, parsedOdds: odds, isLive: true, isFinished: false });
      return acc;
    }, []);

    let sortedEvents = validEvents.sort((a: any, b: any) => {
      const aMarkets = Object.keys(a.data?.group_markets || {}).length || 0;
      const bMarkets = Object.keys(b.data?.group_markets || {}).length || 0;
      return bMarkets - aMarkets;
    });

    let topEvents = [];
    const usedSports = new Set();
    
    // First pass: Try to get 1 top match per unique sport
    for (const ev of sortedEvents) {
      const sportObj = ev.data?.sport;
      const sportName = ev.data?.sport_name || (typeof sportObj === 'object' ? sportObj?.name : sportObj) || '';
      const sport = String(sportName).toLowerCase();
      
      if (!usedSports.has(sport)) {
        topEvents.push(ev);
        usedSports.add(sport);
      }
      if (topEvents.length >= 3) break;
    }

    // Second pass: If we don't have 3 matches yet (e.g. only 1 sport is live), fill with remaining top matches
    if (topEvents.length < 3) {
      for (const ev of sortedEvents) {
        if (!topEvents.includes(ev)) {
          topEvents.push(ev);
        }
        if (topEvents.length >= 3) break;
      }
    }

    return topEvents.map((match: any) => {
      const data = match.data;
      const homeTeam = data.participants.home || 'EV SAHİBİ';
      const awayTeam = data.participants.away || 'DEPLASMAN';
      
      const sportObj = data.sport;
      const sportName = data.sport_name || (typeof sportObj === 'object' ? sportObj?.name : sportObj) || '';
      const sport = String(sportName);
      
      let score = '-';
      let minute = 'CANLI';
      
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
      
      if (data.minute) {
          minute = `${data.minute}'`;
      }

      const homePlayerImg = getPlayerImage(homeTeam);
      const awayPlayerImg = getPlayerImage(awayTeam);
      const bgImg = getSportBgImage(sport);

      return {
        id: match.id,
        homeTeam,
        awayTeam,
        score,
        minute,
        sport,
        isLive: true,
        homeOdd: match.parsedOdds.homeOdd !== '-' ? match.parsedOdds.homeOdd : '2.10',
        drawOdd: match.parsedOdds.drawOdd !== '-' ? match.parsedOdds.drawOdd : '3.00',
        awayOdd: match.parsedOdds.awayOdd !== '-' ? match.parsedOdds.awayOdd : '2.80',
        homePlayerImg,
        awayPlayerImg,
        bgImg
      };
    });
  }, [events, language]);

  useEffect(() => {
    if (heroMatches.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroMatches.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMatches.length]);

  if (!heroMatches || heroMatches.length === 0) return null;

  const currentMatch = heroMatches[activeIndex] || heroMatches[0];

  return (
    <div className="w-full relative px-4 pt-4 pb-2 group">
      <div className="w-full h-[200px] md:h-[240px] lg:h-[280px] rounded-2xl bg-[#050505] relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-white/[0.05] group/banner">
        
        {/* Background Stadium */}
        <div 
          key={`bg-${currentMatch.id}`}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-100 group-hover/banner:scale-105 transition-all duration-[10s] ease-out animate-fade-in"
          style={{ backgroundImage: `url('${currentMatch.bgImg}')` }}
        ></div>
        
        {/* Dark Overlays for Cinematic Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-transparent to-[#050505]/90"></div>
        
        {/* Green/Turquoise Glow behind Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#10b981] opacity-[0.15] blur-[100px] rounded-full pointer-events-none transition-all duration-700"></div>

        {/* Left Player */}
        {currentMatch.homePlayerImg && (
          <div key={`home-${currentMatch.id}`} className="hidden md:block absolute bottom-0 left-0 w-[45%] h-full pointer-events-none z-10 animate-fade-in-right">
             <div 
               className="absolute inset-0 bg-cover bg-top opacity-80 mix-blend-luminosity filter contrast-125"
               style={{
                 backgroundImage: `url('${currentMatch.homePlayerImg}')`,
                 WebkitMaskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 70%)',
                 maskImage: 'radial-gradient(circle at 40% 40%, black 20%, transparent 70%)'
               }}
             ></div>
          </div>
        )}

        {/* Right Player */}
        {currentMatch.awayPlayerImg && (
          <div key={`away-${currentMatch.id}`} className="hidden md:block absolute bottom-0 right-0 w-[45%] h-full pointer-events-none z-10 animate-fade-in-left">
             <div 
               className="absolute inset-0 bg-cover bg-top opacity-80 mix-blend-luminosity filter contrast-125"
               style={{
                 backgroundImage: `url('${currentMatch.awayPlayerImg}')`,
                 WebkitMaskImage: 'radial-gradient(circle at 60% 40%, black 20%, transparent 70%)',
                 maskImage: 'radial-gradient(circle at 60% 40%, black 20%, transparent 70%)'
               }}
             ></div>
          </div>
        )}

        {/* Center Content Area */}
        <div key={`content-${currentMatch.id}`} className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-4 pb-4 px-4 animate-fade-in">
          
          {/* Top Tag & Event Name (Moved LIVE badge to score box) */}
          <div className="flex flex-col items-center gap-2 mb-2 md:mb-4 animate-fade-in-up">
            {/* The Live badge is now integrated with the score below */}
          </div>

          {/* Refined Typography for Teams & Score/VS */}
          <div className="flex items-center justify-between w-full max-w-[900px] mb-8 md:mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {/* Home Team */}
            <div className="flex-1 flex justify-end">
              <h1 className="text-white font-medium text-lg md:text-xl lg:text-2xl tracking-wide drop-shadow-[0_8px_15px_rgba(0,0,0,0.8)] text-right leading-snug pb-1 line-clamp-2 max-w-[200px] md:max-w-[280px]">
                {currentMatch.homeTeam}
              </h1>
            </div>
            
            {/* Center Score / VS */}
            <div className="flex-shrink-0 mx-4 md:mx-6 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-1.5 bg-black/40 border border-white/5 rounded-2xl px-5 py-3 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {currentMatch.isLive && (
                  <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]"></div>
                    <span className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase text-red-400 drop-shadow-sm">
                      {currentMatch.minute}
                    </span>
                  </div>
                )}
                
                {(currentMatch.score !== '-' && currentMatch.score.includes(' - ')) ? (
                  <div className="flex items-center justify-center gap-3 md:gap-4">
                     <span className="text-white font-bold text-2xl md:text-3xl lg:text-4xl tabular-nums drop-shadow-md leading-none relative z-10">{currentMatch.score.split(' - ')[0]}</span>
                     <span className="text-[#36ffc4]/60 font-medium text-lg md:text-xl leading-none relative z-10">-</span>
                     <span className="text-white font-bold text-2xl md:text-3xl lg:text-4xl tabular-nums drop-shadow-md leading-none relative z-10">{currentMatch.score.split(' - ')[1]}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center pt-1">
                    <span className="text-[#36ffc4]/60 font-medium italic text-lg md:text-xl drop-shadow-sm leading-none">VS</span>
                  </div>
                )}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex-1 flex justify-start">
              <h1 className="text-white font-medium text-lg md:text-xl lg:text-2xl tracking-wide drop-shadow-[0_8px_15px_rgba(0,0,0,0.8)] text-left leading-snug pb-1 line-clamp-2 max-w-[200px] md:max-w-[280px]">
                {currentMatch.awayTeam}
              </h1>
            </div>
          </div>

          {/* Dynamic Odds Buttons (Glassmorphism) */}
          <div className="flex items-center justify-center gap-3 w-full max-w-[600px] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
             {[
               { label: `1 ${currentMatch.homeTeam.substring(0,3)}`, odd: currentMatch.homeOdd || '2.40' },
               { label: 'X', odd: currentMatch.drawOdd || '3.10' },
               { label: `2 ${currentMatch.awayTeam.substring(0,3)}`, odd: currentMatch.awayOdd || '2.80' }
             ].map((btn, idx) => (
               <button 
                 key={idx} 
                 className="flex-1 h-[44px] md:h-[48px] rounded-lg bg-black/20 hover:bg-[#10b981]/10 border border-white/[0.05] hover:border-[#36ffc4]/30 backdrop-blur-md flex items-center justify-between px-4 group/odd transition-all duration-300 shadow-md hover:-translate-y-0.5 relative overflow-hidden"
               >
                 {/* Inner Glow on Hover */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#36ffc4]/10 to-transparent opacity-0 group-hover/odd:opacity-100 transition-opacity duration-300"></div>
                 {/* Shine effect */}
                 <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover/odd:left-[200%] transition-all duration-700 ease-in-out"></div>
                 
                 <span className="text-gray-400 group-hover/odd:text-[#36ffc4] font-medium text-[10px] md:text-[11px] uppercase tracking-wide transition-colors relative z-10">{btn.label}</span>
                 <div className="relative z-10 text-white group-hover/odd:text-white font-bold text-sm md:text-base tracking-wide drop-shadow-md">
                   <AnimatedOdd value={btn.odd} />
                 </div>
               </button>
             ))}
          </div>

          {/* Slider Indicators */}
          {heroMatches.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30">
              {heroMatches.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${activeIndex === idx ? 'w-6 bg-[#36ffc4] shadow-[0_0_10px_rgba(54,255,196,0.5)]' : 'w-2 bg-white/20'}`}
                />
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};
