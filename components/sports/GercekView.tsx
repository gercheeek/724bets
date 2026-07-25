import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Star, 
  Globe, 
  ChevronDown, 
  Play, 
  BarChart2, 
  Trophy,
  Hexagon,
  Target,
  SquareDashed,
  CircleDashed,
  Crosshair,
  Search,
  Filter,
  Flame,
  Gamepad2,
  Tv
} from 'lucide-react';
import { useBetting } from '../../contexts/BettingContext';
import { parseMatchData } from '../Spor724View';
import SportsHeroBanner from './SportsHeroBanner';

interface Match {
  id: string;
  sport: string;
  league: string;
  minute: string;
  period: string;
  hasStream: boolean;
  hasStats: boolean;
  team1: {
    name: string;
    score: number;
    logo: string;
    color: string;
  };
  team2: {
    name: string;
    score: number;
    logo: string;
    color: string;
  };
  odds: {
    home: string;
    draw: string;
    away: string;
  };
  totalMarkets: number;
  isFavorite?: boolean;
  startTs?: number;
  matchDate?: string;
  startTime?: string;
}

const CATEGORIES = [
  { id: 'futbol', name: 'Futbol', icon: '⚽', count: 42 },
  { id: 'basketbol', name: 'Basketbol', icon: '🏀', count: 18 },
  { id: 'mma', name: 'Martial arts', icon: '🥋', count: 5 },
  { id: 'boks', name: 'Boks', icon: '🥊', count: 3 },
  { id: 'cs', name: 'Counter-Strike', icon: '🎮', count: 12 },
  { id: 'hokey', name: 'Buz Hokeyi', icon: '🏒', count: 8 },
  { id: 'tenis', name: 'Tenis', icon: '🎾', count: 15 },
  { id: 'valorant', name: 'Valorant', icon: '🎯', count: 7 },
  { id: 'amfutbol', name: 'Amerikan Futbolu', icon: '🏈', count: 4 },
  { id: 'lol', name: 'League of Legends', icon: '⚔️', count: 9 },
  { id: 'voleybol', name: 'Voleybol', icon: '🏐', count: 6 },
];

const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    sport: 'futbol',
    league: 'Uluslararası › UEFA Şampiyonlar Ligi, Eleme',
    minute: "18'",
    period: '1. Devre',
    hasStream: false,
    hasStats: false,
    team1: { name: 'Omonia Nicosia', score: 1, logo: '🟢', color: '#10b981' },
    team2: { name: 'Kairat Almaty', score: 0, logo: '🟡', color: '#f59e0b' },
    odds: { home: '1.15', draw: '6.40', away: '16.00' },
    totalMarkets: 34,
    isFavorite: false
  },
  {
    id: 'm2',
    sport: 'futbol',
    league: 'Uluslararası › UEFA Konferans Ligi, Elemeler',
    minute: "60'",
    period: '2. Devre',
    hasStream: true,
    hasStats: true,
    team1: { name: 'Neftchi Baku PFC', score: 2, logo: '⚫', color: '#3b82f6' },
    team2: { name: 'Dinamo Minsk', score: 3, logo: '⚪', color: '#6366f1' },
    odds: { home: '8.50', draw: '3.40', away: '1.45' },
    totalMarkets: 48,
    isFavorite: true
  },
  {
    id: 'm3',
    sport: 'futbol',
    league: 'Uluslararası › UEFA Konferans Ligi, Elemeler',
    minute: "19'",
    period: '1. Devre',
    hasStream: false,
    hasStats: false,
    team1: { name: 'Bohemians Dublin', score: 0, logo: '🔴', color: '#ef4444' },
    team2: { name: 'FC Ballkani', score: 0, logo: '🟠', color: '#f97316' },
    odds: { home: '1.60', draw: '3.40', away: '5.80' },
    totalMarkets: 29,
    isFavorite: false
  },
  {
    id: 'm4',
    sport: 'futbol',
    league: 'Uluslararası › Seçkin Kulüp Hazırlık Maçları',
    minute: "65'",
    period: '2. Devre',
    hasStream: true,
    hasStats: true,
    team1: { name: 'Tottenham Hotspur', score: 1, logo: '⚪', color: '#94a3b8' },
    team2: { name: 'Milton Keynes Dons', score: 0, logo: '🔴', color: '#dc2626' },
    odds: { home: '1.12', draw: '7.25', away: '25.00' },
    totalMarkets: 52,
    isFavorite: false
  },
  {
    id: 'm5',
    sport: 'futbol',
    league: 'Türkiye › Trendyol Süper Lig',
    minute: "42'",
    period: '1. Devre',
    hasStream: true,
    hasStats: true,
    team1: { name: 'Galatasaray', score: 2, logo: '🟡', color: '#ea580c' },
    team2: { name: 'Fenerbahçe', score: 1, logo: '🔵', color: '#1d4ed8' },
    odds: { home: '1.45', draw: '4.20', away: '6.50' },
    totalMarkets: 120,
    isFavorite: true
  },
  {
    id: 'm6',
    sport: 'basketbol',
    league: 'ABD › NBA Yaz Ligi',
    minute: "Q3 04:12",
    period: '3. Çeyrek',
    hasStream: true,
    hasStats: true,
    team1: { name: 'LA Lakers', score: 78, logo: '🟣', color: '#a855f7' },
    team2: { name: 'Boston Celtics', score: 74, logo: '🟢', color: '#22c55e' },
    odds: { home: '1.75', draw: '-', away: '2.10' },
    totalMarkets: 45,
    isFavorite: false
  },
  {
    id: 'm7',
    sport: 'cs',
    league: 'E-Spor › IEM Cologne 2026',
    minute: "Harita 2",
    period: 'Canlı',
    hasStream: true,
    hasStats: true,
    team1: { name: 'Natus Vincere', score: 1, logo: '🟡', color: '#eab308' },
    team2: { name: 'FaZe Clan', score: 0, logo: '🔴', color: '#ef4444' },
    odds: { home: '1.55', draw: '-', away: '2.35' },
    totalMarkets: 18,
    isFavorite: true
  },
  {
    id: 'm8',
    sport: 'tenis',
    league: 'ATP › Wimbledon Erkekler Tekler',
    minute: "Set 3",
    period: 'Canlı',
    hasStream: true,
    hasStats: true,
    team1: { name: 'Carlos Alcaraz', score: 2, logo: '🎾', color: '#84cc16' },
    team2: { name: 'Jannik Sinner', score: 1, logo: '🎾', color: '#f97316' },
    odds: { home: '1.85', draw: '-', away: '1.95' },
    totalMarkets: 24,
    isFavorite: false
  }
];

const SPORTS_NAV = [
  { id: 'futbol', name: 'Futbol', count: '99+', color: '#ffffff', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 22 8 22 16 12 22 2 16 2 8 12 2" strokeLinejoin="round"/>
      <polygon points="12 6 17 10 17 15 12 19 7 15 7 10 12 6" strokeDasharray="1 2"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>
  )},
  { id: 'basketbol', name: 'Basketbol', count: '28', color: '#fb923c', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" strokeDasharray="4 2"/>
      <path d="M12 2v20M2 12h20"/>
      <path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" strokeDasharray="1 4"/>
    </svg>
  )},
  { id: 'tenis', name: 'Tenis', count: '99+', color: '#bef264', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 12l10 10 10-10L12 2z"/>
      <path d="M6 12h12M12 6v12" strokeDasharray="1 3"/>
    </svg>
  )},
  { id: 'amfutbol', name: 'Am. Futbolu', count: '67', color: '#f87171', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12C2 6 7 2 12 2s10 4 10 10-5 10-10 10S2 18 2 12z" strokeDasharray="5 2"/>
      <path d="M12 6v12"/>
      <path d="M9 10h6M9 14h6"/>
    </svg>
  )},
  { id: 'hokey', name: 'Hokey', count: '37', color: '#22d3ee', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 20L20 4M20 20L4 4" strokeLinecap="square"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
      <path d="M4 4h4v4H4z" fill="currentColor"/>
    </svg>
  )},
  { id: 'beyzbol', name: 'Beyzbol', count: '14', color: '#fbbf24', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L22 12L12 22L2 12Z" strokeDasharray="2 3"/>
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  )},
  { id: 'masatenisi', name: 'Masa Tenisi', count: '99+', color: '#4ade80', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="10" width="16" height="4" rx="1"/>
      <path d="M12 14v6M10 20h4"/>
      <circle cx="12" cy="6" r="2" fill="currentColor"/>
    </svg>
  )},
  { id: 'mma', name: 'Dövüş San.', count: '53', color: '#f43f5e', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 19 9 12 16 5 9 12 2" />
      <polygon points="12 10 17 15 12 22 7 15 12 10" fill="currentColor"/>
    </svg>
  )},
  { id: 'voleybol', name: 'Voleybol', count: '7', color: '#a78bfa', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" strokeDasharray="3 3"/>
      <path d="M12 2c0 6 4 10 10 10M2 12c6 0 10 4 10 10M12 22c0-6-4-10-10-10M22 12c-6 0-10-4-10-10"/>
    </svg>
  )},
  { id: 'kriket', name: 'Kriket', count: '1', color: '#fcd34d', icon: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 14l6-6M10 20l6-6" strokeDasharray="2 2"/>
      <rect x="14" y="4" width="6" height="6" fill="currentColor" transform="rotate(45 17 7)"/>
      <circle cx="6" cy="18" r="2"/>
    </svg>
  )}
];

export const GercekView: React.FC = () => {
  const { events } = useBetting();
  const [selectedCategory, setSelectedCategory] = useState<string>('futbol');
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [selectedBets, setSelectedBets] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(30);

  useEffect(() => {
    // GEÇİCİ OLARAK VERİ ÇEKMEYİ DURDURDUK (UI DÜZENLEMELERİ İÇİN)
    /*
    if (events && events.length > 0) {
      setIsParsing(true);
      const timer = setTimeout(() => {
        const liveMatches = events.map((ev: any, idx: number) => {
          const d = ev.data || ev;
          const parsed = parseMatchData(ev, 'tr');
          
        const sportName = (parsed?.sport || d.sport?.name || d.sport_name || 'futbol').toLowerCase();
        let cat = 'futbol';
        if (sportName.includes('basket')) cat = 'basketbol';
        else if (sportName.includes('tenis') || sportName.includes('tennis')) cat = 'tenis';
        else if (sportName.includes('voley')) cat = 'voleybol';
        else if (sportName.includes('masa')) cat = 'masatenisi';
        else if (sportName.includes('buz')) cat = 'hokey';

        let homeScore = 0;
        let awayScore = 0;
        if (parsed?.score && parsed.score !== '-') {
           const scParts = parsed.score.split('-');
           if (scParts.length === 2) {
             homeScore = parseInt(scParts[0].trim()) || 0;
             awayScore = parseInt(scParts[1].trim()) || 0;
           }
        }

        return {
           id: parsed?.id || d.id || `m${idx}`,
           sport: cat,
           league: parsed?.league || d.league || d.tournament?.name || 'Canlı Lig',
           minute: String(parsed?.minute || d.minute || d.match_time || 'Canlı'),
           period: (parsed?.isLive || d.is_live_betting || d.status === 'in_progress' || d.type === 'live' || (d.minute && String(d.minute).match(/\d+/))) ? 'Canlı' : '',
           hasStream: true,
           hasStats: true,
           team1: { 
             name: parsed?.home || d.team1 || d.participants?.home || 'Ev Sahibi', 
             score: homeScore, 
             logo: '🔴', 
             color: '#ef4444' 
           },
           team2: { 
             name: parsed?.away || d.team2 || d.participants?.away || 'Deplasman', 
             score: awayScore, 
             logo: '🔵', 
             color: '#3b82f6' 
           },
           odds: { 
             home: parsed?.homeOdd !== '-' && parsed?.homeOdd ? parsed.homeOdd : (d.homeOdd || d.odds?.['1'] || '-'), 
             draw: parsed?.drawOdd !== '-' && parsed?.drawOdd ? parsed.drawOdd : (d.drawOdd || d.odds?.['X'] || '-'), 
             away: parsed?.awayOdd !== '-' && parsed?.awayOdd ? parsed.awayOdd : (d.awayOdd || d.odds?.['2'] || '-') 
           },
           totalMarkets: d.markets_count || 10,
           isFavorite: false,
           startTs: d.start_ts,
           matchDate: parsed?.matchDate,
           startTime: parsed?.startTime
        };
      });
      setMatches(liveMatches);
      setIsParsing(false);
      }, 50);

      return () => clearTimeout(timer);
    } else if (events && events.length === 0) {
      setIsParsing(false);
    }
    */
  }, [events]);

  const toggleFavorite = (matchId: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  const selectBet = (matchId: string, selection: string) => {
    setSelectedBets(prev => {
      const key = `${matchId}_${selection}`;
      const next = { ...prev };
      if (next[matchId] === selection) {
        delete next[matchId];
      } else {
        next[matchId] = selection;
      }
      return next;
    });
  };

  const filteredMatches = matches.filter(m => {
    // 1. Sport and Search filters
    const matchSport = selectedCategory === 'all' || m.sport === selectedCategory;
    const matchSearch = searchQuery === '' || 
      m.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.league.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchSport || !matchSearch) return false;

    // 2. Hide old/finished matches from Upcoming (Yaklaşan)
    if (m.period !== 'Canlı' && m.startTs && m.startTs > 0) {
      const now = Date.now();
      // If the match started more than 15 minutes ago and is not live, assume it's finished or expired
      if (m.startTs < now - 15 * 60 * 1000) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="w-full min-h-full bg-transparent text-slate-100 p-4 md:p-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      {/* ── TOP HORIZONTAL SPORTS NAV ── */}
      <div className="relative w-full mb-8">
        {/* Scroll fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10"></div>
        
        <div className="w-full overflow-x-auto scrollbar-none pb-2 relative">
          <div className="flex items-center gap-6 md:gap-8 lg:gap-10 min-w-max px-2">
            {SPORTS_NAV.map((sport) => {
              const isActive = selectedCategory === sport.id;
              return (
                <div 
                  key={sport.id} 
                  className="relative group cursor-pointer transition-all duration-300"
                  onClick={() => {
                    setSelectedCategory(sport.id);
                    const el = document.getElementById('canli-maclar');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {/* Custom Skewed Background */}
                  <div className={`absolute inset-0 -skew-x-12 transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#1a1a1a] border-b border-emerald-500/50 shadow-[0_2px_10px_-5px_rgba(16,185,129,0.2)]' 
                      : 'bg-transparent border-b border-transparent group-hover:bg-white/5'
                  }`}></div>
                  
                  {/* Content (Un-skewed) */}
                  <div className="relative z-10 px-5 py-2.5 flex items-center gap-2">
                    <div className={isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}>
                      {sport.icon}
                    </div>
                    <span className={`text-[12px] md:text-[13px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                      isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}>
                      {sport.name}
                    </span>
                    <span className={`text-[10px] md:text-[11px] font-bold px-2 py-0.5 ml-1 transition-colors ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 skew-x-12' 
                        : 'bg-zinc-800/50 text-zinc-400 group-hover:bg-zinc-700/50 skew-x-12'
                    }`}>
                      <div className="-skew-x-12">{sport.count}</div>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <SportsHeroBanner />
      </div>




      {/* ── FEATURED MATCHES ROW ── */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 mb-4">
        
        {/* Match Card 1 */}
        <div className="bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] rounded-2xl p-5 flex flex-col gap-4 border border-white/5 relative overflow-hidden transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs text-white/50 font-bold gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Gamepad2 className="w-4 h-4 shrink-0 text-white" />
              <span className="truncate text-white/80">Counter-Strike 2 | BLAST Bounty</span>
            </div>
            <span className="shrink-0 bg-white/5 px-2 py-1 rounded-md text-white/70">Yarın, 15:30</span>
          </div>
          <div className="flex items-center justify-between mt-4 gap-2">
            <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-sm">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Sinners&backgroundColor=000000" className="w-full h-full object-cover scale-125" alt="Sinners" />
              </div>
              <span className="font-bold text-white/90 text-[13px] truncate w-full">Sinners Esports</span>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-b from-white/60 to-white/10 font-black text-[15px] shrink-0 px-3 italic drop-shadow-md">VS</div>
            <div className="flex flex-col items-end gap-2 text-right flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-sm">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=FUT&backgroundColor=000000" className="w-full h-full object-cover scale-125" alt="FUT" />
              </div>
              <span className="font-bold text-white/90 text-[13px] truncate w-full text-right">FUT Esports</span>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none transition-all duration-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="flex flex-col gap-4 mt-auto relative z-10 pt-4 border-t border-white/5">
            <div className="text-center text-[11px] text-white/60 uppercase tracking-widest font-black mb-1">Maç Sonucu</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/10 border-b-[#000] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_5px_rgba(0,0,0,0.5)] hover:from-[#363636] hover:to-[#222222] hover:border-[#00ff88]/50 hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all duration-200 rounded-lg p-3 flex justify-between items-center group/btn cursor-pointer active:scale-95">
                <span className="text-white/40 text-xs font-bold group-hover/btn:text-white transition-colors">1</span>
                <span className="text-white font-black text-[15px] group-hover/btn:text-[#00ff88] transition-colors">3.65</span>
              </button>
              <button className="flex-1 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/10 border-b-[#000] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_5px_rgba(0,0,0,0.5)] hover:from-[#363636] hover:to-[#222222] hover:border-[#00ff88]/50 hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all duration-200 rounded-lg p-3 flex justify-between items-center group/btn cursor-pointer active:scale-95">
                <span className="text-white/40 text-xs font-bold group-hover/btn:text-white transition-colors">2</span>
                <span className="text-white font-black text-[15px] group-hover/btn:text-[#00ff88] transition-colors">1.29</span>
              </button>
            </div>
          </div>
        </div>

        {/* Match Card 2 */}
        <div className="bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] rounded-2xl p-5 flex flex-col gap-4 border border-white/5 relative overflow-hidden transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs text-white/50 font-bold gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Flame className="w-4 h-4 shrink-0 text-white" />
              <span className="truncate text-white/80">Boks | Unvan Maçı</span>
            </div>
            <span className="shrink-0 bg-white/5 px-2 py-1 rounded-md text-white/70">Yarın, 13:30</span>
          </div>
          <div className="flex items-center justify-between mt-4 gap-2">
            <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-white/10 shadow-sm bg-white/5">
                <img src="https://flagcdn.com/w80/gb.png" className="w-full h-full object-cover" alt="TF" />
              </div>
              <span className="font-bold text-white/90 text-[13px] truncate w-full">Fury, Tyson</span>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-b from-white/60 to-white/10 font-black text-[15px] shrink-0 px-3 italic drop-shadow-md">VS</div>
            <div className="flex flex-col items-end gap-2 text-right flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-white/10 shadow-sm bg-white/5">
                <img src="https://flagcdn.com/w80/pl.png" className="w-full h-full object-cover" alt="MW" />
              </div>
              <span className="font-bold text-white/90 text-[13px] truncate w-full text-right">Wach, Mariusz</span>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none transition-all duration-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="flex flex-col gap-4 mt-auto relative z-10 pt-4 border-t border-white/5">
            <div className="text-center text-[11px] text-white/60 uppercase tracking-widest font-black mb-1">Maç Sonucu</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/10 border-b-[#000] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_5px_rgba(0,0,0,0.5)] hover:from-[#363636] hover:to-[#222222] hover:border-[#00ff88]/50 hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all duration-200 rounded-lg p-3 flex justify-between items-center group/btn cursor-pointer active:scale-95">
                <span className="text-white/40 text-xs font-bold group-hover/btn:text-white transition-colors">1</span>
                <span className="text-white font-black text-[15px] group-hover/btn:text-[#00ff88] transition-colors">1.01</span>
              </button>
              <button className="flex-1 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/10 border-b-[#000] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_5px_rgba(0,0,0,0.5)] hover:from-[#363636] hover:to-[#222222] hover:border-[#00ff88]/50 hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all duration-200 rounded-lg p-3 flex justify-between items-center group/btn cursor-pointer active:scale-95">
                <span className="text-white/40 text-xs font-bold group-hover/btn:text-white transition-colors">2</span>
                <span className="text-white font-black text-[15px] group-hover/btn:text-[#00ff88] transition-colors">15.00</span>
              </button>
            </div>
          </div>
        </div>

        {/* Match Card 3 */}
        <div className="bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] rounded-2xl p-5 flex flex-col gap-4 border border-white/5 relative overflow-hidden transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between text-xs text-white/50 font-bold gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Flame className="w-4 h-4 shrink-0 text-white" />
              <span className="truncate text-white/80">Boks | Profesyonel Maç</span>
            </div>
            <span className="shrink-0 bg-white/5 px-2 py-1 rounded-md text-white/70">25 Ağu, 18:00</span>
          </div>
          <div className="flex items-center justify-between mt-4 gap-2">
            <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-white/10 shadow-sm bg-white/5">
                <img src="https://flagcdn.com/w80/kz.png" className="w-full h-full object-cover" alt="AA" />
              </div>
              <span className="font-bold text-white/90 text-[13px] truncate w-full">Akhmedov, Ali</span>
            </div>
            <div className="text-transparent bg-clip-text bg-gradient-to-b from-white/60 to-white/10 font-black text-[15px] shrink-0 px-3 italic drop-shadow-md">VS</div>
            <div className="flex flex-col items-end gap-2 text-right flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-white/10 shadow-sm bg-white/5">
                <img src="https://flagcdn.com/w80/id.png" className="w-full h-full object-cover" alt="AW" />
              </div>
              <span className="font-bold text-white/90 text-[13px] truncate w-full text-right">Wellem, A.</span>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none transition-all duration-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none"></div>
          <div className="flex flex-col gap-4 mt-auto relative z-10 pt-4 border-t border-white/5">
            <div className="text-center text-[11px] text-white/60 uppercase tracking-widest font-black mb-1">Maç Sonucu</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/10 border-b-[#000] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_5px_rgba(0,0,0,0.5)] hover:from-[#363636] hover:to-[#222222] hover:border-[#00ff88]/50 hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all duration-200 rounded-lg p-3 flex justify-between items-center group/btn cursor-pointer active:scale-95">
                <span className="text-white/40 text-xs font-bold group-hover/btn:text-white transition-colors">1</span>
                <span className="text-white font-black text-[15px] group-hover/btn:text-[#00ff88] transition-colors">1.11</span>
              </button>
              <button className="flex-1 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-white/10 border-b-[#000] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_5px_rgba(0,0,0,0.5)] hover:from-[#363636] hover:to-[#222222] hover:border-[#00ff88]/50 hover:shadow-[0_0_15px_rgba(0,255,136,0.15)] transition-all duration-200 rounded-lg p-3 flex justify-between items-center group/btn cursor-pointer active:scale-95">
                <span className="text-white/40 text-xs font-bold group-hover/btn:text-white transition-colors">2</span>
                <span className="text-white font-black text-[15px] group-hover/btn:text-[#00ff88] transition-colors">5.50</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── SEARCH BAR (TOP OF LIST) ── */}
      <div className="relative w-full mb-6">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text"
          placeholder="Takım, lig veya maç ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111] border border-white/10 focus:border-white hover:border-white/20 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder-white/40 outline-none transition-all"
        />
      </div>

      {/* ── MATCH CARDS GRID ── */}
      {isParsing ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-[#111216] rounded-2xl border border-white/5 shadow-inner">
          <div className="relative w-12 h-12 mb-4">
            <span className="animate-ping absolute inset-0 rounded-full bg-[#10b981] opacity-20"></span>
            <div className="w-12 h-12 rounded-full border-2 border-[#10b981]/20 border-t-[#10b981] animate-spin"></div>
          </div>
          <h3 className="text-white text-base font-bold tracking-wide mb-1 animate-pulse">MAÇ BÜLTENİ YÜKLENİYOR...</h3>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="py-24 text-center bg-[#111216] rounded-2xl border border-white/5 shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-lg">
            <Trophy className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-white font-medium mb-1">Karşılaşma Bulunamadı</p>
          <p className="text-slate-500 text-sm">Bu kategoride şu an aktif veya yaklaşan bir maç yok.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          
          {/* CANLI MAÇLAR */}
          {(() => {
            const liveMatches = filteredMatches.filter(m => m.period === 'Canlı');
            if (liveMatches.length === 0) return null;
            
            const grouped = liveMatches.reduce((acc, match) => {
              const league = match.league || 'Diğer Ligler';
              if (!acc[league]) acc[league] = [];
              acc[league].push(match);
              return acc;
            }, {} as Record<string, Match[]>);

            return (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-2.5 h-2.5 bg-[#10b981] rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                  <h3 className="text-xl font-black text-white tracking-wide">CANLI MAÇLAR</h3>
                </div>
                {Object.entries(grouped).map(([leagueName, leagueMatches]) => (
                  <div key={leagueName} className="bg-transparent border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/10 mb-4">
                    {/* League Header */}
                    <div className="backdrop-blur-xl bg-white/[0.03] px-4 py-3 flex items-center gap-3 relative border-b border-white/5">
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-white/80 rounded-full" />
                        <span className="text-white/80 font-bold text-[11px] uppercase tracking-wider">{leagueName}</span>
                      </div>
                    </div>
                    
                    {/* Match Rows */}
                    <div className="flex flex-col">
                      {leagueMatches.map((match, index) => (
                        <div key={match.id} className={`flex flex-col md:flex-row md:items-center gap-4 p-5 hover:bg-white/[0.03] transition-all duration-300 relative group overflow-hidden ${index !== 0 ? 'border-t border-white/[0.03]' : ''}`}>
                          
                          {/* Time & Status */}
                          <div className="w-full md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-2 shrink-0">
                            <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1.5 rounded-md">
                              <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                              <span className="text-[#10b981] text-[13px] font-black tracking-widest">{match.minute}'</span>
                            </div>
                            <div className="flex gap-2 mt-1">
                               {match.hasStream && <Play className="w-4 h-4 text-white/50 hover:text-white transition-colors hidden md:block cursor-pointer" />}
                               {match.hasStats && <BarChart2 className="w-4 h-4 text-white/50 hover:text-white transition-colors hidden md:block cursor-pointer" />}
                            </div>
                            {/* Mobile favorite icon */}
                            <button onClick={() => toggleFavorite(match.id)} className="md:hidden text-slate-500">
                              <Star className={`w-4 h-4 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>

                          {/* Teams & Scores */}
                          <div className="flex-1 flex flex-col gap-3 min-w-0">
                            <div className="flex items-center justify-between gap-3 pr-2 md:pr-8">
                              <div className="flex items-center gap-3 truncate">
                                <img src={`https://flagcdn.com/w80/${['gb','de','es','it','fr','br','ar','pt','nl','be'][match.team1.name.length % 10]}.png`} className="w-6 h-6 md:w-7 md:h-7 rounded-full shadow-sm shrink-0 border border-white/10 object-cover" alt={match.team1.name} />
                                <span className="text-[17px] font-black text-white truncate tracking-tight">{match.team1.name}</span>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 min-w-[36px] flex items-center justify-center">
                                <span className="text-white font-black text-[15px]">{match.team1.score}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-3 pr-2 md:pr-8">
                              <div className="flex items-center gap-3 truncate">
                                <img src={`https://flagcdn.com/w80/${['it','fr','br','ar','pt','nl','be','gb','de','es'][match.team2.name.length % 10]}.png`} className="w-6 h-6 md:w-7 md:h-7 rounded-full shadow-sm shrink-0 border border-white/10 object-cover" alt={match.team2.name} />
                                <span className="text-[17px] font-black text-white truncate tracking-tight">{match.team2.name}</span>
                              </div>
                              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 min-w-[36px] flex items-center justify-center">
                                <span className="text-white font-black text-[15px]">{match.team2.score}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right side controls (Odds + Fav) */}
                          <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 mt-3 md:mt-0">
                            
                            {/* Desktop Icons */}
                            <button onClick={() => toggleFavorite(match.id)} className="hidden md:flex text-slate-600 hover:text-white transition-colors">
                              <Star className={`w-5 h-5 ${match.isFavorite ? 'fill-white text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`} />
                            </button>

                            {/* Odds */}
                            <div className="flex gap-2 w-full md:w-auto">
                              <button
                                onClick={() => selectBet(match.id, '1')}
                                className={`flex-1 md:w-[70px] h-[50px] flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                                  selectedBets[match.id] === '1' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 z-10' : 'bg-[#1a1a1a] hover:bg-white text-white/70 hover:text-black transition-colors duration-200 rounded-lg'
                                }`}
                              >
                                <span className="text-[11px] text-inherit opacity-60 font-bold mb-0.5">1</span>
                                <span className="text-[15px] font-black tracking-tight">{match.odds.home}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, 'X')}
                                className={`flex-1 md:w-[70px] h-[50px] flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                                  selectedBets[match.id] === 'X' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 z-10' : 'bg-[#1a1a1a] hover:bg-white text-white/70 hover:text-black transition-colors duration-200 rounded-lg'
                                }`}
                              >
                                <span className="text-[11px] text-inherit opacity-60 font-bold mb-0.5">X</span>
                                <span className="text-[15px] font-black tracking-tight">{match.odds.draw}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, '2')}
                                className={`flex-1 md:w-[70px] h-[50px] flex flex-col items-center justify-center rounded-xl transition-all duration-300 ${
                                  selectedBets[match.id] === '2' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105 z-10' : 'bg-[#1a1a1a] hover:bg-white text-white/70 hover:text-black transition-colors duration-200 rounded-lg'
                                }`}
                              >
                                <span className="text-[11px] text-inherit opacity-60 font-bold mb-0.5">2</span>
                                <span className="text-[15px] font-black tracking-tight">{match.odds.away}</span>
                              </button>
                            </div>
                            
                            <button
                              className="hidden md:flex w-12 h-12 bg-transparent hover:bg-white/5 rounded-xl items-center justify-center text-slate-500 hover:text-white transition-all cursor-pointer"
                              title={`${match.totalMarkets} Bahis Seçeneği`}
                            >
                              <ChevronDown className="w-5 h-5" />
                            </button>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}



        </div>
      )}

    </div>
  );
};

export default GercekView;
