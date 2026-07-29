import React, { useState, useEffect } from 'react';
import { Clock, Users, Flame, ShieldCheck, Zap, Layers, ChevronLeft, ChevronRight, Play, TrendingUp, Settings } from 'lucide-react';
import { PlayerLogo } from './PlayerLogo';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { triggerGlobalToast } from '../GlobalToaster';
import { VALID_LOGOS } from './ValidLogos';
import { MatchInfo } from './types';
import { isEliteTeam } from '../../utils/eliteTeams';

const normalize = (str: string) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ fc$/i, '')
    .replace(/ afc$/i, '')
    .replace(/^fc /i, '')
    .replace(/[^\w\sğüşıöç]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface ComboLeg {
  match: string;
  t1: string;
  t2: string;
  selection: string;
  market: string;
  odd: number;
  teamName?: string;
  originalMatch?: any;
}

interface Combo {
  id: string;
  riskLevel: RiskLevel;
  players: number;
  title: string;
  legsCount: number;
  totalOdds: number;
  legs: ComboLeg[];
}

const TURKISH_TEAMS = new Set([
  'Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor', 
  'Başakşehir', 'Sivasspor', 'Konyaspor', 'Adana Demirspor', 
  'Antalyaspor', 'Alanyaspor', 'Kasımpaşa', 'Ankaragücü', 
  'Kayserispor', 'Gaziantep FK', 'Samsunspor', 'Eyüpspor', 'Göztepe'
]);

const getImportance = (team1: string, team2: string) => {
  let score = 0;
  const t1 = normalize(team1);
  const t2 = normalize(team2);
  
  const isTurkish = (t: string) => {
    for (let tt of TURKISH_TEAMS) {
      if (t === normalize(tt)) return true;
    }
    return false;
  };

  // Huge priority for Turkish teams
  if (isTurkish(t1)) score += 20;
  if (isTurkish(t2)) score += 20;
  
  // VIP 50 priority
  if (isEliteTeam(team1)) score += 50;
  if (isEliteTeam(team2)) score += 50;
  
  return score;
};

// Seeded Random Generator for daily consistency
const getSeededRandom = (seed: number) => {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

const getSeedForToday = () => {
  const now = new Date();
  if (now.getHours() < 6) {
    now.setDate(now.getDate() - 1);
  }
  return parseInt(`${now.getFullYear()}${now.getMonth()}${now.getDate()}`);
};

const getNext06AM = () => {
  const now = new Date();
  const resetTime = new Date(now);
  resetTime.setHours(6, 0, 0, 0);
  if (now.getHours() >= 6) {
    resetTime.setDate(resetTime.getDate() + 1);
  }
  return resetTime.getTime();
};

const MATCHUPS = [
  { t1: 'Fenerbahçe', t2: 'Galatasaray' },
  { t1: 'Beşiktaş', t2: 'Fenerbahçe' },
  { t1: 'Galatasaray', t2: 'Beşiktaş' },
  { t1: 'Trabzonspor', t2: 'Galatasaray' },
  { t1: 'Fenerbahçe', t2: 'Trabzonspor' },
  { t1: 'Beşiktaş', t2: 'Trabzonspor' },
  { t1: 'Galatasaray', t2: 'Başakşehir' },
  { t1: 'Fenerbahçe', t2: 'Başakşehir' },
  { t1: 'Real Madrid', t2: 'Barcelona' },
  { t1: 'Arsenal', t2: 'Chelsea' },
  { t1: 'Liverpool', t2: 'Man City' },
  { t1: 'B. Munich', t2: 'B. Dortmund' },
  { t1: 'Juventus', t2: 'Inter' }
];
const MARKETS = ['Kazanan', 'Toplam Gol', '1x2', 'Handikap', 'İlk Yarı Sonucu'];

const generateRandomLeg = (apiMatches: any[], random: () => number, risk: RiskLevel): ComboLeg => {
  let team1 = '';
  let team2 = '';
  let matchObj: any = null;

  const validMatches = apiMatches?.filter(m => VALID_LOGOS.has(normalize(m.home)) && VALID_LOGOS.has(normalize(m.away))) || [];
  
  if (validMatches.length > 0) {
    // Sort matches by importance if they are valid
    validMatches.sort((a, b) => getImportance(b.home, b.away) - getImportance(a.home, a.away));
    // Pick from the top 30% of important matches to ensure quality
    const topCount = Math.max(1, Math.floor(validMatches.length * 0.3));
    matchObj = validMatches[Math.floor(random() * topCount)];
    team1 = matchObj.home;
    team2 = matchObj.away;
  } else {
    const validMatchups = MATCHUPS.filter(m => VALID_LOGOS.has(normalize(m.t1)) && VALID_LOGOS.has(normalize(m.t2)));
    const fallbackMatchups = validMatchups.length > 0 ? validMatchups : MATCHUPS;
    matchObj = fallbackMatchups[Math.floor(random() * fallbackMatchups.length)];
    team1 = matchObj.t1;
    team2 = matchObj.t2;
  }
  
  let selection = '';
  let market = '';
  let odd = 0;

  if (matchObj && matchObj.homeOdd && matchObj.homeOdd > 0) {
    const h = matchObj.homeOdd;
    const a = matchObj.awayOdd;
    const d = matchObj.drawOdd;
    
    // Create possible 1x2 outcomes and sort by safest to riskiest
    const outcomes = [
      { sel: team1, odd: h, market: 'Kazanan' },
      { sel: team2, odd: a, market: 'Kazanan' },
      { sel: 'Beraberlik', odd: d, market: '1x2' }
    ].sort((x, y) => x.odd - y.odd);
    
    if (risk === 'LOW') {
      // Pick the lowest odd (the heavy favorite)
      const safe = outcomes.find(o => o.odd < 1.7) || outcomes[0];
      selection = safe.sel;
      odd = safe.odd;
      market = safe.market;
      
      // Sometimes mix in safe goals market
      if (random() > 0.7) {
         selection = 'üstü 1.5';
         market = 'Toplam Gol';
         odd = (random() * 0.3) + 1.15; // 1.15 - 1.45
      }
    } else if (risk === 'MEDIUM') {
      // Pick moderate odds
      const moderate = outcomes.find(o => o.odd >= 1.7 && o.odd <= 2.8) || outcomes[1];
      selection = moderate.sel;
      odd = moderate.odd;
      market = moderate.market;
      
      // Sometimes mix in standard goals market
      if (random() > 0.6) {
         selection = random() > 0.5 ? 'üstü 2.5' : 'altı 2.5';
         market = 'Toplam Gol';
         odd = (random() * 0.6) + 1.6; // 1.60 - 2.20
      }
    } else { // HIGH
      // Pick the highest odd (underdog or draw)
      const risky = outcomes[outcomes.length - 1]; 
      selection = risky.sel;
      odd = risky.odd;
      market = risky.market;
      
      // Sometimes mix in risky half-time market
      if (random() > 0.5) {
         selection = 'İlk Yarı Beraberlik';
         market = 'İlk Yarı Sonucu';
         odd = (random() * 1.5) + 2.5; // 2.50 - 4.00
      }
    }
  } else {
     // Fallback realistic odds logic when real odds are unavailable
     market = MARKETS[Math.floor(random() * MARKETS.length)];
     if (risk === 'LOW') {
       selection = team1; // Pretend home is favorite
       odd = (random() * 0.4) + 1.2;
     } else if (risk === 'MEDIUM') {
       selection = random() > 0.5 ? team1 : team2;
       odd = (random() * 0.8) + 1.7;
     } else {
       selection = 'Beraberlik';
       odd = (random() * 2.0) + 3.0;
     }
  }

  return {
    match: `${team1} - ${team2}`,
    t1: team1,
    t2: team2,
    selection: selection,
    market: market,
    odd: Number(odd.toFixed(2)),
    teamName: selection !== 'Beraberlik' && selection !== 'üstü 2.5' && selection !== 'altı 2.5' ? selection : undefined,
    originalMatch: matchObj?.id ? matchObj : undefined
  };
};

const generateCombo = (risk: RiskLevel, apiMatches: any[], random: () => number): Combo => {
  const legsCount = 3;

  const legs: ComboLeg[] = [];
  const usedMatches = new Set<string>();

  for (let i = 0; i < legsCount; i++) {
    let leg;
    let attempts = 0;
    do {
      leg = generateRandomLeg(apiMatches, random, risk);
      attempts++;
    } while (usedMatches.has(leg.match) && attempts < 10);
    
    usedMatches.add(leg.match);
    legs.push(leg);
  }

  const calculatedTotalOdds = legs.reduce((acc, leg) => acc * leg.odd, 1);

  return {
    id: random().toString(36).substring(2, 9),
    riskLevel: risk,
    players: Math.floor(random() * 500) + 100, // Boost players for importance
    title: risk === 'LOW' ? 'Günün Bankosu' : risk === 'MEDIUM' ? 'İdeal Seçimler' : 'Büyük Vurgun',
    legsCount,
    totalOdds: Number(calculatedTotalOdds.toFixed(2)),
    legs
  };
};

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  if (level === 'LOW') return (
    <div className="flex items-center gap-1 bg-[#10b981]/20 text-[#10b981] px-1.5 py-0.5 rounded border border-[#10b981]/30 shrink-0">
      <ShieldCheck className="w-3 h-3 shrink-0" />
      <span className="text-[10px] font-black uppercase tracking-wide whitespace-nowrap">Az Riskli</span>
    </div>
  );
  if (level === 'MEDIUM') return (
    <div className="flex items-center gap-1 bg-[#f97316]/20 text-[#f97316] px-1.5 py-0.5 rounded border border-[#f97316]/30 shrink-0">
      <Zap className="w-3 h-3 shrink-0" />
      <span className="text-[10px] font-black uppercase tracking-wide whitespace-nowrap">Orta Riskli</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1 bg-[#ef4444]/20 text-[#ef4444] px-1.5 py-0.5 rounded border border-[#ef4444]/30 shrink-0">
      <Flame className="w-3 h-3 shrink-0" />
      <span className="text-[10px] font-black uppercase tracking-wide whitespace-nowrap">Yüksek Riskli</span>
    </div>
  );
};

const formatTimeLeft = (expiresAt: number) => {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return '00:00:00';
  const totalSeconds = Math.floor(diff / 1000);
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

interface FeaturedCombosProps {
  activeSport?: string;
  matches?: MatchInfo[];
  onSelectMatch?: (match: MatchInfo) => void;
}

const FeaturedCombos: React.FC<FeaturedCombosProps> = ({ activeSport = 'Tüm Sporlar', matches = [], onSelectMatch }) => {
  const { addSelection } = useBetSlip();
  const [lowRiskCombos, setLowRiskCombos] = useState<Combo[]>(() => {
    const seed = getSeedForToday();
    const random = getSeededRandom(seed + 100);
    return Array.from({ length: 7 }, () => generateCombo('LOW', [], random));
  });
  const [mediumRiskCombos, setMediumRiskCombos] = useState<Combo[]>(() => {
    const seed = getSeedForToday();
    const random = getSeededRandom(seed + 200);
    return Array.from({ length: 7 }, () => generateCombo('MEDIUM', [], random));
  });
  const [highRiskCombos, setHighRiskCombos] = useState<Combo[]>(() => {
    const seed = getSeedForToday();
    const random = getSeededRandom(seed + 300);
    return Array.from({ length: 7 }, () => generateCombo('HIGH', [], random));
  });
  const [now, setNow] = useState(Date.now());
  const [apiData, setApiData] = useState<any[]>([]);

  const handleAddCombo = (e: React.MouseEvent, combo: Combo) => {
    e.stopPropagation();
    
    const mappedLegs = combo.legs.map((leg: any) => ({
      match: leg.match,
      selection: leg.selection,
      market: leg.market
    }));

    const boostedOdds = Number((combo.totalOdds * 1.25).toFixed(2));
    addSelection({
      id: `combo_${combo.id}`,
      matchId: `combo_match_${combo.id}`,
      matchName: combo.title,
      selectionName: `Özel Kombine (${combo.legsCount} Seçim)`,
      odd: boostedOdds,
      isSpecialCombo: true,
      legs: mappedLegs
    });
    
    triggerGlobalToast({ type: 'success', message: 'Özel kupon başarıyla sağdaki bahis paneline eklendi!' });
  };

  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    if (hasGenerated) return;
    if (!matches || matches.length === 0) return;

    const futbolMatches = matches
      .filter(m => m.sport?.toLowerCase().includes('futbol') || m.sport?.toLowerCase().includes('soccer'))
      .map(m => ({
        ...m,
        homeOdd: parseFloat(m.homeOdd) || 0,
        drawOdd: parseFloat(m.drawOdd) || 0,
        awayOdd: parseFloat(m.awayOdd) || 0
      }));

    if (futbolMatches.length === 0) return;
    setApiData(futbolMatches);

    // Use a daily seed so combos stay identical for the whole day
    const seed = getSeedForToday();
    
    const generateArray = (risk: RiskLevel, seedModifier: number) => {
      const random = getSeededRandom(seed + seedModifier);
      return Array.from({ length: 7 }, () => generateCombo(risk, futbolMatches, random));
    };

    setLowRiskCombos(generateArray('LOW', 100));
    setMediumRiskCombos(generateArray('MEDIUM', 200));
    setHighRiskCombos(generateArray('HIGH', 300));
    
    setHasGenerated(true);
  }, [matches, hasGenerated]);

  // Sadece UI timer guncellemesi icin, combo regenerate edilmiyor
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [activeIndexLow, setActiveIndexLow] = useState(0);
  const [activeIndexMed, setActiveIndexMed] = useState(0);
  const [activeIndexHigh, setActiveIndexHigh] = useState(0);

  // Auto-rotation disabled per user request
  // Removed the 3 useEffect intervals that were rotating the activeIndex

  if (!matches || matches.length === 0) return null;
  if (!lowRiskCombos || lowRiskCombos.length === 0) return null;

  const next06AM = getNext06AM();

  const renderStack = (
    combos: Combo[], 
    activeIndex: number, 
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>, 
    colorHex: string, 
    glowRgb: string, 
    titlePart1: string, 
    titlePart2: string,
    titleColor: string
  ) => (
    <div className="flex flex-col items-center shrink-0 snap-center mt-4">
      <div className="relative w-[290px] h-[420px] shrink-0 mx-auto perspective-[1200px]">
        {combos.map((combo, i) => {
          const diff = (i - activeIndex + combos.length) % combos.length;
          const isFront = diff === 0;
          
          let translateY = 0;
          let scale = 1;
          let zIndex = combos.length - diff;
          let opacity = 1;
          let brightness = 1;

          if (diff === 0) {
            translateY = 0; scale = 1; opacity = 1; brightness = 1;
          } else if (diff === 1) {
            translateY = -12; scale = 0.94; opacity = 1; brightness = 0.85;
          } else if (diff === 2) {
            translateY = -24; scale = 0.88; opacity = 1; brightness = 0.7;
          } else if (diff === 3) {
            translateY = -36; scale = 0.82; opacity = 1; brightness = 0.55;
          } else {
            translateY = -48; scale = 0.76; opacity = 0; brightness = 0.4;
          }

          return (
            <div 
              key={combo.id}
              onClick={() => {
                if (isFront) {
                  setActiveIndex((activeIndex + 1) % combos.length);
                } else {
                  setActiveIndex(i);
                }
              }}
              className={`absolute top-0 left-0 w-[290px] h-[420px] rounded-xl overflow-hidden bg-[#12161f] flex flex-col group/combo transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer ${isFront ? 'shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white/10 hover:shadow-[0_15px_40px_rgba(0,0,0,1)] hover:-translate-y-1' : 'border border-white/5'}`}
              style={{ 
                transform: `translateY(${translateY}px) scale(${scale})`,
                zIndex: zIndex,
                opacity: opacity,
                filter: `brightness(${brightness})`,
                transformOrigin: 'top center'
              } as React.CSSProperties}
            >
              {/* Top Header Area */}
              <div className="relative bg-[#0d1017] pt-3 pb-5 px-4 flex flex-col shadow-sm overflow-hidden border-b border-white/[0.05] group-hover/combo:bg-[#0f131a] transition-colors duration-500">
                {/* Bottom glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-20 pointer-events-none transition-all duration-700 group-hover/combo:h-24 group-hover/combo:opacity-80" style={{ background: `radial-gradient(ellipse at bottom, rgba(${glowRgb}, 0.35) 0%, transparent 70%)` }}></div>
                
                {/* Top Bar (Icons, Players) */}
                <div className="w-full flex justify-between items-center z-10 mb-4">
                  <div className="flex gap-1.5 items-center">
                    <div className="bg-white/10 text-white/90 text-[9px] font-bold px-1.5 py-0.5 rounded">8s</div>
                    <div className="bg-white/10 p-0.5 rounded"><Play className="w-3 h-3 text-white/80"/></div>
                    <div className="bg-white/10 p-0.5 rounded"><TrendingUp className="w-3 h-3 text-white/80"/></div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-1 text-white/90 text-[11px] font-bold font-mono">
                      <Users className="w-3 h-3 text-white/60"/> {combo.players.toLocaleString('tr-TR')}
                    </div>
                    <Settings className="w-3 h-3 text-white/40 cursor-pointer hover:text-white/80 transition-colors" />
                  </div>
                </div>

                {/* Center Content (Logos & Title) */}
                <div className="w-full flex items-center justify-between z-10">
                  <div className="w-9 h-9 rounded-full bg-black/40 border border-white/10 p-1.5 shrink-0 flex items-center justify-center">
                    <ShieldCheck className="w-full h-full" style={{ color: colorHex }} />
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                    <div className="text-white text-[13px] font-bold leading-snug truncate w-full drop-shadow-md">{combo.title}</div>
                    <div className="text-[12px] font-semibold opacity-90 truncate w-full" style={{ color: colorHex }}>
                      {combo.riskLevel === 'LOW' ? 'Az Riskli' : combo.riskLevel === 'MEDIUM' ? 'Orta Riskli' : 'Yüksek Riskli'}
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-black/40 border border-white/10 p-1.5 shrink-0 flex items-center justify-center">
                    <Flame className="w-full h-full" style={{ color: colorHex }} />
                  </div>
                </div>
              </div>

              {/* Legs Count */}
              <div className="px-4 pt-3 pb-1">
                <div className="text-white/90 text-[12px] font-bold">{combo.legsCount} Seçim</div>
              </div>

              {/* Legs List */}
              <div className="flex-1 px-4 py-1 relative z-10 flex flex-col overflow-y-auto custom-scrollbar gap-3">
                {combo.legs.map((leg, index) => (
                  <div 
                    key={index} 
                    onClick={() => leg.originalMatch && onSelectMatch?.(leg.originalMatch)}
                    className={`flex flex-col p-1.5 -mx-1.5 rounded transition-colors ${leg.originalMatch ? 'cursor-pointer hover:bg-white/5' : ''}`}
                  >
                    <div className="flex items-start gap-2 mb-0.5">
                      <div className="w-3.5 h-3.5 mt-0.5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                      </div>
                      <div className="text-[12px] text-white/90 font-bold leading-tight">{leg.match}</div>
                    </div>
                    <div className="text-[11px] text-zinc-400 font-medium pl-5.5 leading-snug">
                      <span className="text-white/70">{leg.selection}</span> • {leg.market}
                    </div>
                  </div>
                ))}
              </div>

              {/* View Multi Bet Link */}
              <div className="px-4 pb-2 pt-1 text-white/70 hover:text-white text-[12px] font-semibold flex items-center gap-1 cursor-pointer transition-all group/link">
                <span className="group-hover/link:underline underline-offset-2 decoration-white/30">Çoklu Bahisi Görüntüle</span> 
                <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform"/>
              </div>

              {/* Add to Betslip Button */}
              <div className="px-4 pb-4">
                <button 
                  onClick={(e) => handleAddCombo(e, combo)}
                  className="w-full relative overflow-hidden bg-[#1e2330] transition-all duration-300 rounded p-3 flex justify-between items-center group/btn border border-transparent hover:border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none"></div>
                  
                  {/* Subtle sweep animation on button hover */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-[1500ms] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}></div>

                  <span className="text-zinc-300 group-hover/btn:text-white text-[12px] font-semibold transition-colors relative z-10">Bahis Kuponuna Ekle</span>
                  <div className="flex items-center gap-2 relative z-10">
                    <span className="text-[10px] text-zinc-500 line-through decoration-zinc-600">
                      {combo.totalOdds.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[15px] font-black group-hover/btn:scale-110 transition-transform origin-right" style={{ color: colorHex, textShadow: `0 0 10px rgba(${glowRgb}, 0.3)` }}>
                      {(combo.totalOdds * 1.25).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center mt-10">
        <h2 className="text-white/90 text-[13px] font-bold tracking-[0.15em] uppercase text-center mb-4">
          {titlePart1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white" style={{ '--tw-gradient-to': titleColor } as any}>{titlePart2}</span>
        </h2>
        <div className="flex items-center justify-center gap-6">
          <button onClick={() => setActiveIndex((activeIndex - 1 + combos.length) % combos.length)} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors group relative overflow-hidden" style={{ '--tw-hover-border-color': `rgba(${glowRgb}, 0.3)` } as any}>
            <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform" style={{ backgroundColor: `rgba(${glowRgb}, 0.1)` }}></div>
            <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors relative z-10" />
          </button>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <button onClick={() => setActiveIndex((activeIndex + 1) % combos.length)} className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors group relative overflow-hidden" style={{ '--tw-hover-border-color': `rgba(${glowRgb}, 0.3)` } as any}>
            <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform" style={{ backgroundColor: `rgba(${glowRgb}, 0.1)` }}></div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors relative z-10" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1800px] mx-auto mb-8 relative flex flex-row flex-nowrap items-center xl:items-start justify-start xl:justify-center gap-10 xl:gap-14 px-4 xl:px-8 overflow-x-auto custom-scrollbar pb-6 snap-x snap-mandatory">
      {renderStack(lowRiskCombos, activeIndexLow, setActiveIndexLow, '#10b981', '16, 185, 129', 'Az Riskli', 'Kuponlar', '#10b981')}
      {renderStack(mediumRiskCombos, activeIndexMed, setActiveIndexMed, '#f97316', '249, 115, 22', 'Orta Riskli', 'Kuponlar', '#f97316')}
      {renderStack(highRiskCombos, activeIndexHigh, setActiveIndexHigh, '#ef4444', '239, 68, 68', 'Yüksek Riskli', 'Kuponlar', '#ef4444')}
    </div>
  );
};

export default FeaturedCombos;
