import React, { useEffect, useState, useRef } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import { Play, Star } from 'lucide-react';

interface Sports1xBetViewProps {
  activeSport?: string;
  onSelectMatch?: (match: any) => void;
  feedType?: 'live' | 'prematch';
}

const OddsButton: React.FC<{ match: any, market: string, oddKey: string, val: string | number, isSelected: boolean, onToggle: () => void }> = ({ match, market, oddKey, val, isSelected, onToggle }) => {
  const prevValRef = useRef<number | null>(null);
  const [flashClass, setFlashClass] = useState<string>('');

  useEffect(() => {
    const numericVal = parseFloat(String(val));
    if (!isNaN(numericVal) && prevValRef.current !== null) {
      if (numericVal > prevValRef.current) {
        setFlashClass('animate-flash-green');
      } else if (numericVal < prevValRef.current) {
        setFlashClass('animate-flash-red');
      }
      
      const timer = setTimeout(() => setFlashClass(''), 2000);
      return () => clearTimeout(timer);
    }
    prevValRef.current = isNaN(numericVal) ? null : numericVal;
  }, [val]);

  if (val === '-' || val === undefined || val === null) {
    return (
      <div className="w-[54px] h-[40px] bg-white/[0.02] flex items-center justify-center rounded-lg text-xs text-white/20 cursor-not-allowed border border-white/[0.03] shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`w-[54px] h-[40px] flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all border shadow-[0_4px_10px_rgba(0,0,0,0.3)] ${flashClass} ${
        isSelected 
          ? 'bg-gradient-to-b from-[color:var(--theme-accent)] to-[#008A99] border-[color:var(--theme-accent)] text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105 font-extrabold' 
          : 'border-white/5 bg-gradient-to-b from-[#1C1E24] to-[#0A0B0E] hover:border-[color:var(--theme-accent)]/50 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)] text-white hover:text-[color:var(--theme-accent)]'
      }`}
    >
      <span className="text-[13px] font-black leading-tight">{val}</span>
    </button>
  );
};

const Sports1xBetView: React.FC<Sports1xBetViewProps> = ({ activeSport, onSelectMatch, feedType = 'live' }) => {
  const { global1xBetMatches, global1xBetPreMatches, language } = useBetting();
  const { betSlip, addSelection, removeSelection } = useBetSlip();

  const sourceMatches = feedType === 'prematch' ? global1xBetPreMatches : global1xBetMatches;

  const getLogoUrl = (teamId: number) => {
    return `https://v3.traincdn.com/resized/size32/sfiles/logo_teams/${teamId}.webp`;
  };

  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [collapsedLeagues, setCollapsedLeagues] = useState<Record<string, boolean>>({});
  const [starredLeagues, setStarredLeagues] = useState<string[]>([]);

  const toggleLeague = (leagueName: string) => {
    setCollapsedLeagues(prev => ({
      ...prev,
      [leagueName]: !prev[leagueName]
    }));
  };

  const toggleStar = (e: React.MouseEvent, leagueName: string) => {
    e.stopPropagation();
    setStarredLeagues(prev => 
      prev.includes(leagueName) ? prev.filter(l => l !== leagueName) : [...prev, leagueName]
    );
  };

  const getOddsButton = (match: any, market: string, label: string, oddKey: string) => {
    const val = match.odds[oddKey];
    
    // Create unique selection id based on match id and odd key
    const selectionId = `${match.id}_${oddKey}`;
    const isSelected = betSlip.some(b => b.id === selectionId);

    const handleToggle = () => {
      if (isSelected) {
        removeSelection(selectionId);
      } else {
        const title = market === '1x2' ? 'Maç Sonucu' : market === 'dc' ? 'Çifte Şans' : 'Toplam Gol';
        addSelection({
          id: selectionId,
          matchId: match.id,
          matchName: `${match.homeTeam} vs ${match.awayTeam}`,
          selectionName: `${title}: ${label}`,
          odd: parseFloat(String(val).replace(',', '.')) || 1.00
        });
        window.dispatchEvent(new CustomEvent('open-betslip'));
      }
    };

    return (
      <OddsButton 
        key={`${match.id}-${oddKey}`}
        match={match}
        market={market}
        oddKey={oddKey}
        val={val}
        isSelected={isSelected}
        onToggle={handleToggle}
      />
    );
  };

  const filteredMatches = (sourceMatches || []).filter((match: any) => {
    if (!activeSport || activeSport === 'Tüm Sporlar' || activeSport === 'All Sports') return true;
    
    // Normalize names for comparison
    const searchSport = activeSport.toLowerCase();
    const matchSport = (match.sport || '').toLowerCase();
    
    if (searchSport.includes('futbol') || searchSport.includes('soccer')) {
       return matchSport.includes('futbol') || matchSport.includes('soccer') || matchSport.includes('football');
    }
    if (searchSport.includes('tenis') || searchSport.includes('tennis')) {
       return matchSport.includes('tenis') || matchSport.includes('tennis');
    }
    if (searchSport.includes('basket')) {
       return matchSport.includes('basket');
    }
    // For others, do a broad match
    return matchSport.includes(searchSport) || searchSport.includes(matchSport);
  });

  // Group by League
  const leagues = filteredMatches.reduce((acc: any, match: any) => {
    if (!acc[match.league]) acc[match.league] = [];
    acc[match.league].push(match);
    return acc;
  }, {});

  const MAJOR_LEAGUE_KEYWORDS = [
    // Top priority tier
    'dünya kupası', 'world cup', 'euro ', 'şampiyonlar ligi', 'champions league', 
    'avrupa ligi', 'europa league', 'konferans', 'copa america', 'euroleague', 'nba',
    // First tier national
    'premier lig', 'premier league', 'la liga', 'serie a', 'bundesliga', 'ligue 1', 
    'süper lig', 'super lig', '1. lig', 'championship', 'mls', 'nhl', 'nfl', 'atp', 'wta',
    // Second tier identifiers
    'kupası', 'cup', 'şampiyonası', 'masters', 'grand slam', 'pro'
  ];

  const getLeaguePriority = (leagueName: string, matches: any[]) => {
    const upperName = leagueName.toUpperCase();
    const lowerName = leagueName.toLowerCase();
    
    // 1xBet "TOP" suffix convention means top-tier matches
    if (upperName.includes('. TOP') || upperName.includes('(TOP)')) {
        return -1;
    }

    // Detect if any match in this league involves a globally known big team
    const BIG_TEAMS = ['bayern', 'real madrid', 'barcelona', 'galatasaray', 'fenerbahçe', 'fenerbahce', 'beşiktaş', 'besiktas', 'trabzonspor', 'arsenal', 'manchester', 'liverpool', 'chelsea', 'juventus', 'milan', 'inter', 'napoli', 'psg', 'borussia', 'lakers', 'celtics'];
    const hasBigTeam = matches.some((m: any) => {
        const home = (m.homeTeam || '').toLowerCase();
        const away = (m.awayTeam || '').toLowerCase();
        return BIG_TEAMS.some(team => home.includes(team) || away.includes(team));
    });

    if (hasBigTeam) {
        return 0;
    }

    for (let i = 0; i < MAJOR_LEAGUE_KEYWORDS.length; i++) {
      if (lowerName.includes(MAJOR_LEAGUE_KEYWORDS[i])) return i + 1;
    }
    return 999;
  };

  // Sort leagues: starred first, then major leagues/teams, then by match count, then alphabetical
  const sortedLeagueEntries = Object.entries(leagues).sort(([a, matchesA]: [string, any], [b, matchesB]: [string, any]) => {
    const aStarred = starredLeagues.includes(a);
    const bStarred = starredLeagues.includes(b);
    if (aStarred && !bStarred) return -1;
    if (!aStarred && bStarred) return 1;

    const aPriority = getLeaguePriority(a, matchesA);
    const bPriority = getLeaguePriority(b, matchesB);
    
    if (aPriority !== bPriority) {
        return aPriority - bPriority;
    }
    
    if (matchesA.length !== matchesB.length) {
        return (matchesB as any[]).length - (matchesA as any[]).length;
    }

    return a.localeCompare(b);
  });

  return (
    <div className="w-full text-white font-sans pb-20">
      <div className="flex flex-col gap-1 mt-1">
        {sortedLeagueEntries.map(([leagueName, matches]: [string, any]) => (
          <div key={leagueName} className="flex flex-col mb-4 rounded-xl overflow-hidden bg-[#101418]/80 backdrop-blur-xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
            <div 
              onClick={() => toggleLeague(leagueName)}
              className="bg-transparent px-4 py-3 border-b border-white/5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all relative"
            >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[color:var(--theme-accent)] transition-colors shadow-[0_0_10px_var(--theme-accent-glow)] opacity-0 group-hover:opacity-100"></div>
                <div className="flex items-center">
                  <div 
                    onClick={(e) => toggleStar(e, leagueName)}
                    className="w-8 h-8 mr-3 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                      <Star className={`w-4 h-4 ${starredLeagues.includes(leagueName) ? 'text-[color:var(--theme-accent)] fill-[color:var(--theme-accent)] drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-zinc-500 hover:text-white'}`} />
                  </div>
                  <span className="text-[15px] font-bold text-white uppercase tracking-wide">{leagueName}</span>
                  <span className="ml-3 px-2.5 py-0.5 rounded-md bg-[color:var(--theme-accent)]/10 text-[color:var(--theme-accent)] border border-[color:var(--theme-accent)]/20 text-[11px] font-black tracking-widest">{matches.length} MAÇ</span>
                </div>
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-zinc-400 group-hover:bg-white/10 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${collapsedLeagues[leagueName] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
            </div>

            {!collapsedLeagues[leagueName] && matches.map((match: any) => (
              <div key={match.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors p-3 flex flex-col md:flex-row items-center gap-4 relative">
                
                {/* MATCH INFO */}
                <div 
                  className="flex items-center gap-4 w-full md:w-[280px] shrink-0 md:border-r border-white/5 pr-4 cursor-pointer hover:bg-white/5 transition-colors rounded-lg p-1"
                  onClick={() => onSelectMatch && onSelectMatch(match)}
                >
                  <div className="flex flex-col items-center justify-center w-[65px] shrink-0 text-center">
                    {match.time.includes("'") ? (
                      <span className="text-[12px] font-black px-2 py-1 rounded-md transition-all text-[color:var(--theme-accent)] bg-[color:var(--theme-accent)]/10 border border-[color:var(--theme-accent)]/30 shadow-[0_0_12px_var(--theme-accent-glow)] animate-pulse scale-105">
                        {match.time}
                      </span>
                    ) : (
                      <div className="flex flex-col items-center justify-center bg-black/40 border border-white/5 rounded-lg px-2 py-1 w-full">
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{match.time.split(' ')[0]} {match.time.split(' ')[1]}</span>
                        <span className="text-[12px] text-white font-black">{match.time.split(' ')[2] || ''}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0 gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-3.5 rounded-full bg-[color:var(--theme-accent)] shadow-[0_0_8px_var(--theme-accent-glow)] ${match.time.includes("'") ? '' : 'opacity-70'}`}></div>
                      <span className="text-[13px] font-semibold text-zinc-200 hover:text-white transition-colors truncate flex-1">{match.homeTeam}</span>
                      {match.scoreHome !== undefined && match.scoreHome !== null && match.scoreHome !== '-' && (
                        <span className="text-[14px] font-black text-[color:var(--theme-accent)] bg-[color:var(--theme-accent)]/10 px-2 py-0.5 rounded-md min-w-[24px] text-center shadow-inner">{match.scoreHome}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-3.5 rounded-full bg-[color:var(--theme-accent)] shadow-[0_0_8px_var(--theme-accent-glow)] ${match.time.includes("'") ? '' : 'opacity-70'}`}></div>
                      <span className="text-[13px] font-semibold text-zinc-200 hover:text-white transition-colors truncate flex-1">{match.awayTeam}</span>
                      {match.scoreAway !== undefined && match.scoreAway !== null && match.scoreAway !== '-' && (
                         <span className="text-[14px] font-black text-[color:var(--theme-accent)] bg-[color:var(--theme-accent)]/10 px-2 py-0.5 rounded-md min-w-[24px] text-center shadow-inner">{match.scoreAway}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ODDS DESKTOP TABLE */}
                <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0 hide-scrollbar pt-2 md:pt-0">
                    <div className="flex items-center gap-3 min-w-max h-full">
                        {/* 1X2 */}
                        <div className="flex items-center bg-black/40 rounded-xl p-1.5 gap-1.5 border border-white/5 h-full shadow-inner">
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] text-zinc-500 font-bold mb-1 tracking-wider uppercase">1</span>
                                {getOddsButton(match, "1x2", "1", "1")}
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] text-zinc-500 font-bold mb-1 tracking-wider uppercase">X</span>
                                {getOddsButton(match, "1x2", "X", "X")}
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] text-zinc-500 font-bold mb-1 tracking-wider uppercase">2</span>
                                {getOddsButton(match, "1x2", "2", "2")}
                            </div>
                        </div>

                        {/* Double Chance */}
                        <div className="flex items-center bg-black/40 rounded-xl p-1.5 gap-1.5 border border-white/5 h-full shadow-inner">
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] text-zinc-500 font-bold mb-1 tracking-wider uppercase">1X</span>
                                {getOddsButton(match, "dc", "1X", "cs1X")}
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] text-zinc-500 font-bold mb-1 tracking-wider uppercase">12</span>
                                {getOddsButton(match, "dc", "12", "cs12")}
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] text-zinc-500 font-bold mb-1 tracking-wider uppercase">X2</span>
                                {getOddsButton(match, "dc", "X2", "csX2")}
                            </div>
                        </div>

                        {/* Over/Under */}
                        <div className="flex items-center bg-black/40 rounded-xl p-1.5 gap-1.5 border border-white/5 h-full shadow-inner">
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] text-zinc-500 font-bold mb-1 tracking-wider uppercase">Üst ({match.odds.tP || '2.5'})</span>
                                {getOddsButton(match, "ou", `Üst (${match.odds.tP || '2.5'})`, "tU")}
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-[10px] text-zinc-500 font-bold mb-1 tracking-wider uppercase">Alt ({match.odds.tP || '2.5'})</span>
                                {getOddsButton(match, "ou", `Alt (${match.odds.tP || '2.5'})`, "tA")}
                            </div>
                        </div>
                    </div>
                </div>

                {/* MORE MARKETS */}
                <div className="hidden md:flex shrink-0">
                   <div 
                       onClick={() => onSelectMatch && onSelectMatch(match)}
                       className="w-[54px] h-[40px] mt-[18px] text-[12px] text-[color:var(--theme-accent)] font-black bg-[color:var(--theme-accent)]/5 border border-[color:var(--theme-accent)]/20 hover:bg-[color:var(--theme-accent)]/20 hover:border-[color:var(--theme-accent)]/50 rounded-lg flex items-center justify-center cursor-pointer transition-all shadow-sm shadow-[#06b6d4]/5"
                   >
                       +{match.marketCount || Math.floor(Math.random() * 300 + 50)}
                   </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {Object.keys(leagues).length === 0 && (
          <div className="text-center text-gray-500 py-10 text-sm font-bold animate-pulse">
            1xBet Canlı Maçlar Yükleniyor...
          </div>
        )}
      </div>
    </div>
  );
};

export default Sports1xBetView;
