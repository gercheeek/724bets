import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Star, 
  Globe, 
  ChevronDown, 
  Play, 
  BarChart2, 
  Trophy, 
  Search,
  Filter,
  Flame,
  Gamepad2,
  Tv
} from 'lucide-react';
import { useBetting } from '../../contexts/BettingContext';
import { parseMatchData } from '../Spor724View';

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
  const [selectedBets, setSelectedBets] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (events && events.length > 0) {
      const liveMatches = events.map((ev: any, idx: number) => {
        const d = ev.data || ev;
        const parsed = parseMatchData(ev, 'tr');
        
        // Fallback or mapped data
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
           startTs: parsed?.isLive ? 0 : (d.start_ts || (d.start_time ? new Date(d.start_time).getTime() : 0)),
           matchDate: parsed?.matchDate || '',
           startTime: parsed?.startTime || ''
        };
      }).filter(Boolean) as Match[];
      
      setMatches(liveMatches);
    }
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
      <div className="w-full overflow-x-auto scrollbar-none mb-8 pb-2">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10 min-w-max">
          {SPORTS_NAV.map((sport) => (
            <div 
              key={sport.id} 
              className="flex flex-col items-center gap-3 cursor-pointer group"
              onClick={() => {
                setSelectedCategory(sport.id);
                const el = document.getElementById('canli-maclar');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <div className="relative">
                <div className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-full bg-gradient-to-b from-[#1a1b1e] to-[#0a0b0c] border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),_0_0_20px_rgba(16,185,129,0.3)] group-hover:border-[#10b981]/50 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:h-1/2 before:rounded-t-full before:opacity-50">
                  <div style={{ color: sport.color }}>
                    {sport.icon}
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 backdrop-blur-md bg-white/10 text-white text-[10px] md:text-[11px] font-black px-2 py-0.5 rounded-full border border-white/10 shadow-xl">
                  {sport.count}
                </div>
              </div>
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-[#8a94a6] group-hover:text-white transition-colors">
                {sport.name}
              </span>
            </div>
          ))}
        </div>
      </div>



      {/* ── FEATURED MATCHES ROW ── */}
      <div className="w-full flex gap-3 md:gap-4 overflow-x-auto pb-6 mb-2 scrollbar-hide snap-x">
        
        {/* Match Card 1 */}
        <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[360px] bg-gradient-to-b from-[#181a20] to-[#101114] rounded-xl p-4 flex flex-col gap-4 snap-center border border-[#00E676]/20 shadow-[0_0_25px_rgba(0,230,118,0.08)] relative overflow-hidden group hover:shadow-[0_0_35px_rgba(0,230,118,0.15)] transition-all duration-500">
          <div className="flex items-center justify-between text-xs text-white/50 font-medium gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Gamepad2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
              <span className="truncate text-slate-300 font-medium">Counter-Strike 2 | BLAST Bounty Season 1</span>
            </div>
            <span className="shrink-0 text-slate-400">Yarın, 15:30</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#18191c] flex items-center justify-center overflow-hidden">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Sinners_Esports_logo.png/220px-Sinners_Esports_logo.png" className="w-full h-full object-contain p-1.5" alt="Sinners" />
              </div>
              <span className="font-bold text-white text-sm">Sinners Esports</span>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="w-8 h-8 rounded-full bg-[#18191c] flex items-center justify-center overflow-hidden">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/FUT_Esports_logo.png/220px-FUT_Esports_logo.png" className="w-full h-full object-contain p-1.5 invert" alt="FUT" />
              </div>
              <span className="font-bold text-white text-sm">FUT Esports</span>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00E676]/10 blur-3xl rounded-full pointer-events-none group-hover:bg-[#00E676]/20 transition-all duration-700"></div><div className="flex flex-col gap-2 mt-auto relative z-10">
            <div className="text-center text-[10px] text-white/40 uppercase tracking-widest font-semibold">Kazanan</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-[#14161a] hover:bg-[#1a1e24] border border-white/5 hover:border-[#00E676]/30 transition-all duration-300 rounded-lg p-2.5 flex justify-between items-center group hover:shadow-[0_0_10px_rgba(0,230,118,0.1)]">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">1</span>
                <span className="text-white font-bold text-sm">3.65</span>
              </button>
              <button className="flex-1 bg-[#14161a] hover:bg-[#1a1e24] border border-white/5 hover:border-[#00E676]/30 transition-all duration-300 rounded-lg p-2.5 flex justify-between items-center group hover:shadow-[0_0_10px_rgba(0,230,118,0.1)]">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">2</span>
                <span className="text-white font-bold text-sm">1.29</span>
              </button>
            </div>
          </div>
        </div>

        {/* Match Card 2 */}
        <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[360px] bg-gradient-to-b from-[#181a20] to-[#101114] rounded-xl p-4 flex flex-col gap-4 snap-center border border-[#00E676]/20 shadow-[0_0_25px_rgba(0,230,118,0.08)] relative overflow-hidden group hover:shadow-[0_0_35px_rgba(0,230,118,0.15)] transition-all duration-500">
          <div className="flex items-center justify-between text-xs text-white/50 font-medium gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Flame className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate text-slate-300 font-medium">Uluslararası › Elit Boks Unvan Maçı</span>
            </div>
            <span className="shrink-0 text-slate-400">Yarın, 13:30</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://flagcdn.com/w80/gb-eng.png" className="w-full h-full object-cover" alt="UK" />
              </div>
              <span className="font-bold text-white text-sm">Fury, Tyson</span>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://flagcdn.com/w80/pl.png" className="w-full h-full object-cover" alt="PL" />
              </div>
              <span className="font-bold text-white text-sm">Wach, Mariusz</span>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00E676]/10 blur-3xl rounded-full pointer-events-none group-hover:bg-[#00E676]/20 transition-all duration-700"></div><div className="flex flex-col gap-2 mt-auto relative z-10">
            <div className="text-center text-[10px] text-white/40 uppercase tracking-widest font-semibold">Kazanan</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-[#14161a] hover:bg-[#1a1e24] border border-white/5 hover:border-[#00E676]/30 transition-all duration-300 rounded-lg p-2.5 flex justify-between items-center group hover:shadow-[0_0_10px_rgba(0,230,118,0.1)]">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">1</span>
                <span className="text-white font-bold text-sm">1.01</span>
              </button>
              <button className="flex-1 bg-[#14161a] hover:bg-[#1a1e24] border border-white/5 hover:border-[#00E676]/30 transition-all duration-300 rounded-lg p-2.5 flex justify-between items-center group hover:shadow-[0_0_10px_rgba(0,230,118,0.1)]">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">2</span>
                <span className="text-white font-bold text-sm">15.00</span>
              </button>
            </div>
          </div>
        </div>

        {/* Match Card 3 */}
        <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[360px] bg-gradient-to-b from-[#181a20] to-[#101114] rounded-xl p-4 flex flex-col gap-4 snap-center border border-[#00E676]/20 shadow-[0_0_25px_rgba(0,230,118,0.08)] relative overflow-hidden group hover:shadow-[0_0_35px_rgba(0,230,118,0.15)] transition-all duration-500">
          <div className="flex items-center justify-between text-xs text-white/50 font-medium gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Flame className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span className="truncate text-slate-300 font-medium">Uluslararası › Profesyonel Boks</span>
            </div>
            <span className="shrink-0 text-slate-400">25 Ağu, 18:00</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://flagcdn.com/w80/kz.png" className="w-full h-full object-cover" alt="KZ" />
              </div>
              <span className="font-bold text-white text-sm">Akhmedov, Ali</span>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src="https://flagcdn.com/w80/us.png" className="w-full h-full object-cover" alt="US" />
              </div>
              <span className="font-bold text-white text-sm">Wellem, A.</span>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00E676]/10 blur-3xl rounded-full pointer-events-none group-hover:bg-[#00E676]/20 transition-all duration-700"></div><div className="flex flex-col gap-2 mt-auto relative z-10">
            <div className="text-center text-[10px] text-white/40 uppercase tracking-widest font-semibold">Kazanan</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-[#14161a] hover:bg-[#1a1e24] border border-white/5 hover:border-[#00E676]/30 transition-all duration-300 rounded-lg p-2.5 flex justify-between items-center group hover:shadow-[0_0_10px_rgba(0,230,118,0.1)]">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">1</span>
                <span className="text-white font-bold text-sm">1.11</span>
              </button>
              <button className="flex-1 bg-[#14161a] hover:bg-[#1a1e24] border border-white/5 hover:border-[#00E676]/30 transition-all duration-300 rounded-lg p-2.5 flex justify-between items-center group hover:shadow-[0_0_10px_rgba(0,230,118,0.1)]">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">2</span>
                <span className="text-white font-bold text-sm">5.50</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── BIG CATEGORY BANNERS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        
        {/* Canlı Banner */}
        <div 
          onClick={() => {
            const el = document.getElementById('canli-maclar');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="relative flex-1 w-full h-[85px] md:min-h-[120px] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#050505] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#06b6d4,0_0_20px_rgba(239,68,68,0.15)] group/live"
        >
            <div className="absolute inset-0 z-0 flex justify-end">
              <div className="w-[100%] sm:w-[80%] h-full relative">
                <img src="/images/ai-generated/sports_card.jpg" alt="Canlı Spor" className="w-full h-full object-cover object-[center] transform group-hover/live:scale-[1.05] transition-all duration-700 ease-out opacity-60 group-hover/live:opacity-100 hue-rotate-180" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent w-full"></div>
            </div>
            <div className="relative z-20 flex flex-col justify-center items-start h-full px-6">
                <div className="flex items-center gap-3 transform group-hover/live:translate-x-1 transition-transform">
                  <h3 className="text-[28px] lg:text-[42px] font-black text-white tracking-tighter leading-none font-['Outfit'] flex items-center gap-3">
                    CANLI
                    <span className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_12px_#ef4444] animate-pulse"></span>
                  </h3>
                  <div className="bg-[#10b981]/20 border border-red-500/30 text-[#10b981] px-2.5 py-1 rounded-lg text-xs md:text-sm font-black tracking-widest mt-1">
                    {filteredMatches.filter(m => m.period === 'Canlı').length}
                  </div>
                </div>
            </div>
        </div>

        {/* Yaklaşan Banner */}
        <div 
          onClick={() => {
            const el = document.getElementById('yaklasan-maclar');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="relative flex-1 w-full h-[85px] md:min-h-[120px] rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-[#050505] cursor-pointer transition-all duration-300 hover:z-10 hover:shadow-[inset_0_0_0_1px_#06b6d4,0_0_20px_rgba(59,130,246,0.15)] group/upcoming"
        >
            <div className="absolute inset-0 z-0 flex justify-end">
              <div className="w-[100%] sm:w-[80%] h-full relative">
                <img src="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop" alt="Yaklaşan Spor" className="w-full h-full object-cover object-[center] transform group-hover/upcoming:scale-[1.05] transition-all duration-700 ease-out opacity-50 group-hover/upcoming:opacity-90" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent w-full"></div>
            </div>
            <div className="relative z-20 flex flex-col justify-center items-start h-full px-6">
                <div className="flex items-center gap-3 transform group-hover/upcoming:translate-x-1 transition-transform">
                  <h3 className="text-[28px] lg:text-[42px] font-black text-white tracking-tighter leading-none font-['Outfit'] flex items-center gap-3">
                    YAKLAŞAN
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"></span>
                  </h3>
                  <div className="bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 px-2.5 py-1 rounded-lg text-xs md:text-sm font-black tracking-widest mt-1">
                    {filteredMatches.filter(m => m.period !== 'Canlı').length}
                  </div>
                </div>
            </div>
        </div>

      </div>

      {/* ── TOP HEADER SECTION ── */}
      <div id="canli-maclar" className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 scroll-mt-6">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-600/20 border border-red-500/40 shrink-0">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-[#10b981] opacity-75"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] relative z-10"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
            Canlı
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#10b981]/20 text-red-400 border border-red-500/30">
              {filteredMatches.length} MAÇ
            </span>
          </h1>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            placeholder="Takım, lig veya maç ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#101114] border border-[#1e283d] focus:border-[#00E676] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── CATEGORY PILLS HORIZONTAL BAR ── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-800/60">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/25 border border-[#00E676]/40'
              : 'bg-[#101114] hover:bg-[#18191c] text-slate-300 border border-[#1e273a]'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          Tümü ({matches.length})
        </button>

        {CATEGORIES.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full font-medium text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00E676] text-black font-bold shadow-lg shadow-[#00E676]/25 border border-[#00E676]/40'
                  : 'bg-[#101114] hover:bg-[#18191c] text-slate-300 border border-[#1e273a]'
              }`}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* ── MATCH CARDS GRID ── */}
      {filteredMatches.length === 0 ? (
        <div className="py-16 text-center bg-[#101114] rounded-2xl border border-white/5">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">Bu kategoride şu an maç bulunamadı.</p>
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
                  <div key={leagueName} className="bg-black/40 backdrop-blur-2xl border border-white/10 border-t-white/20 border-l-2 border-l-[#10b981]/80 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-white/20">
                    {/* League Header */}
                    <div className="bg-gradient-to-r from-white/[0.05] to-transparent px-4 py-3 border-b border-white/5 flex items-center gap-2 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent before:h-1/2 before:pointer-events-none">
                      <svg className="w-4 h-4 text-[#10b981]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 12h18M12 3v18" strokeDasharray="2 4" />
    <circle cx="12" cy="12" r="3" fill="#10b981" stroke="none" opacity="0.5" />
  </svg>
                      <span className="text-slate-200 font-bold text-sm tracking-wide">{leagueName}</span>
                    </div>
                    
                    {/* Match Rows */}
                    <div className="flex flex-col divide-y divide-white/5">
                      {leagueMatches.map(match => (
                        <div key={match.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 even:bg-white/[0.01] odd:bg-transparent hover:bg-white/[0.03] hover:backdrop-blur-md hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 relative group overflow-hidden">
                          
                          {/* Time & Status */}
                          <div className="w-full md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-1 shrink-0">
                            <div className="flex items-center gap-1.5 bg-[#10b981]/10 border border-red-500/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.1)]"><div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" /><span className="text-[#10b981] text-[11px] font-black tracking-widest">{match.minute}'</span></div>
                            <div className="flex gap-2">
                               {match.hasStream && <Play className="w-3.5 h-3.5 text-[#10b981] hidden md:block" />}
                               {match.hasStats && <BarChart2 className="w-3.5 h-3.5 text-blue-400 hidden md:block" />}
                            </div>
                            {/* Mobile favorite icon */}
                            <button onClick={() => toggleFavorite(match.id)} className="md:hidden text-slate-500">
                              <Star className={`w-4 h-4 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>

                          {/* Teams & Scores */}
                          <div className="flex-1 flex flex-col gap-2 min-w-0">
                            <div className="flex items-center justify-between gap-3 pr-2 md:pr-6">
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team1.name)}&background=random&color=fff&rounded=true&bold=true&size=48`} className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm shrink-0" alt={match.team1.name} />
                                <span className="text-[15px] font-black text-white truncate tracking-tight drop-shadow-md">{match.team1.name}</span>
                              </div>
                              <div className="bg-black/40 border border-white/10 rounded px-2.5 py-0.5 min-w-[32px] flex items-center justify-center backdrop-blur-sm shadow-inner"><span className="text-white font-black text-sm">{match.team1.score}</span></div>
                            </div>
                            <div className="flex items-center justify-between gap-3 pr-2 md:pr-6">
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team2.name)}&background=random&color=fff&rounded=true&bold=true&size=48`} className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm shrink-0" alt={match.team2.name} />
                                <span className="text-[15px] font-black text-white truncate tracking-tight drop-shadow-md">{match.team2.name}</span>
                              </div>
                              <div className="bg-black/40 border border-white/10 rounded px-2.5 py-0.5 min-w-[32px] flex items-center justify-center backdrop-blur-sm shadow-inner"><span className="text-white font-black text-sm">{match.team2.score}</span></div>
                            </div>
                          </div>

                          {/* Right side controls (Odds + Fav) */}
                          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 mt-2 md:mt-0">
                            
                            {/* Desktop Icons */}
                            <button onClick={() => toggleFavorite(match.id)} className="hidden md:flex text-slate-500 hover:text-amber-400 transition-colors">
                              <Star className={`w-5 h-5 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>

                            {/* Odds */}
                            <div className="flex gap-1.5 w-full md:w-auto">
                              <button
                                onClick={() => selectBet(match.id, '1')}
                                className={`flex-1 md:w-[65px] h-[46px] flex flex-col items-center justify-center rounded-md border transition-all ${
                                  selectedBets[match.id] === '1' ? 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent' : 'bg-[#16171a] border border-white/5 border-t-white/10 hover:bg-[#1c1d22] hover:border-white/20 text-slate-300 hover:text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">1</span>
                                <span className="text-[15px] font-black leading-none tracking-tight">{match.odds.home}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, 'X')}
                                className={`flex-1 md:w-[65px] h-[46px] flex flex-col items-center justify-center rounded-md border transition-all ${
                                  selectedBets[match.id] === 'X' ? 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent' : 'bg-[#16171a] border border-white/5 border-t-white/10 hover:bg-[#1c1d22] hover:border-white/20 text-slate-300 hover:text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">X</span>
                                <span className="text-[15px] font-black leading-none tracking-tight">{match.odds.draw}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, '2')}
                                className={`flex-1 md:w-[65px] h-[46px] flex flex-col items-center justify-center rounded-md border transition-all ${
                                  selectedBets[match.id] === '2' ? 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent' : 'bg-[#16171a] border border-white/5 border-t-white/10 hover:bg-[#1c1d22] hover:border-white/20 text-slate-300 hover:text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">2</span>
                                <span className="text-[15px] font-black leading-none tracking-tight">{match.odds.away}</span>
                              </button>
                            </div>
                            
                            <button
                              className="hidden md:flex w-11 h-11 bg-[#18191c] hover:bg-[#25262b] border border-white/5 rounded-lg items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer group-hover:border-slate-700"
                              title={`${match.totalMarkets} Bahis Seçeneği`}
                            >
                              <ChevronDown className="w-4 h-4" />
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

          {/* YAKLAŞAN MAÇLAR */}
          {(() => {
            const upcomingMatches = filteredMatches.filter(m => m.period !== 'Canlı');
            if (upcomingMatches.length === 0) return null;
            
            const grouped = upcomingMatches.reduce((acc, match) => {
              const league = match.league || 'Diğer Ligler';
              if (!acc[league]) acc[league] = [];
              acc[league].push(match);
              return acc;
            }, {} as Record<string, Match[]>);

            Object.values(grouped).forEach(list => {
              list.sort((a, b) => (a.startTs || 0) - (b.startTs || 0));
            });

            const sortedLeagues = Object.entries(grouped).sort((a, b) => {
              const minA = a[1][0]?.startTs || 0;
              const minB = b[1][0]?.startTs || 0;
              return minA - minB;
            });

            return (
              <div className="flex flex-col gap-6 mt-4">
                <div id="yaklasan-maclar" className="flex items-center gap-3 mb-4 scroll-mt-6">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 relative z-10"></span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-wide">YAKLAŞAN MAÇLAR</h3>
                </div>
                {sortedLeagues.map(([leagueName, leagueMatches]) => (
                  <div key={leagueName} className="bg-[#101114] border border-white/5 rounded-xl overflow-hidden shadow-lg opacity-90">
                    {/* League Header */}
                    <div className="bg-gradient-to-r from-white/[0.05] to-transparent px-4 py-3 border-b border-white/5 flex items-center gap-2 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent before:h-1/2 before:pointer-events-none">
                      <svg className="w-4 h-4 text-[#10b981]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 12h18M12 3v18" strokeDasharray="2 4" />
    <circle cx="12" cy="12" r="3" fill="#10b981" stroke="none" opacity="0.5" />
  </svg>
                      <span className="text-slate-200 font-bold text-sm tracking-wide">{leagueName}</span>
                    </div>
                    
                    {/* Match Rows */}
                    <div className="flex flex-col divide-y divide-white/5">
                      {leagueMatches.map(match => (
                        <div key={match.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 even:bg-white/[0.01] odd:bg-transparent hover:bg-white/[0.03] hover:backdrop-blur-md hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 relative group overflow-hidden">
                          
                          {/* Time & Status */}
                          <div className="w-full md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-1 shrink-0">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 text-xs font-bold">
                                {match.matchDate ? `${match.matchDate} ${match.startTime}` : (match.minute && match.minute !== 'Canlı' ? match.minute : 'Yakında')}
                              </span>
                            </div>
                            <div className="flex gap-2">
                               {match.hasStats && <BarChart2 className="w-3.5 h-3.5 text-blue-400 hidden md:block" />}
                            </div>
                            {/* Mobile favorite icon */}
                            <button onClick={() => toggleFavorite(match.id)} className="md:hidden text-slate-500">
                              <Star className={`w-4 h-4 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                          </div>

                          {/* Teams & Scores */}
                          <div className="flex-1 flex flex-col gap-2 min-w-0">
                            <div className="flex items-center justify-between gap-3 pr-2 md:pr-6">
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team1.name)}&background=random&color=fff&rounded=true&bold=true&size=48`} className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm shrink-0" alt={match.team1.name} />
                                <span className="text-[15px] font-black text-white truncate tracking-tight drop-shadow-md">{match.team1.name}</span>
                              </div>
                              <span className="text-slate-500 font-bold text-sm shrink-0">-</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 pr-2 md:pr-6">
                              <div className="flex items-center gap-2.5 truncate">
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(match.team2.name)}&background=random&color=fff&rounded=true&bold=true&size=48`} className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-sm shrink-0" alt={match.team2.name} />
                                <span className="text-[15px] font-black text-white truncate tracking-tight drop-shadow-md">{match.team2.name}</span>
                              </div>
                              <span className="text-slate-500 font-bold text-sm shrink-0">-</span>
                            </div>
                          </div>

                          {/* Right side controls (Odds + Fav) */}
                          <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 mt-2 md:mt-0">
                            
                            {/* Desktop Icons */}
                            <button onClick={() => toggleFavorite(match.id)} className="hidden md:flex text-slate-500 hover:text-amber-400 transition-colors">
                              <Star className={`w-5 h-5 ${match.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>

                            {/* Odds */}
                            <div className="flex gap-1.5 w-full md:w-auto">
                              <button
                                onClick={() => selectBet(match.id, '1')}
                                className={`flex-1 md:w-[65px] h-[46px] flex flex-col items-center justify-center rounded-md border transition-all ${
                                  selectedBets[match.id] === '1' ? 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent' : 'bg-[#16171a] border border-white/5 border-t-white/10 hover:bg-[#1c1d22] hover:border-white/20 text-slate-300 hover:text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">1</span>
                                <span className="text-[15px] font-black leading-none tracking-tight">{match.odds.home}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, 'X')}
                                className={`flex-1 md:w-[65px] h-[46px] flex flex-col items-center justify-center rounded-md border transition-all ${
                                  selectedBets[match.id] === 'X' ? 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent' : 'bg-[#16171a] border border-white/5 border-t-white/10 hover:bg-[#1c1d22] hover:border-white/20 text-slate-300 hover:text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">X</span>
                                <span className="text-[15px] font-black leading-none tracking-tight">{match.odds.draw}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, '2')}
                                className={`flex-1 md:w-[65px] h-[46px] flex flex-col items-center justify-center rounded-md border transition-all ${
                                  selectedBets[match.id] === '2' ? 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent' : 'bg-[#16171a] border border-white/5 border-t-white/10 hover:bg-[#1c1d22] hover:border-white/20 text-slate-300 hover:text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500/70 font-bold leading-none mb-1">2</span>
                                <span className="text-[15px] font-black leading-none tracking-tight">{match.odds.away}</span>
                              </button>
                            </div>
                            
                            <button
                              className="hidden md:flex w-11 h-11 bg-[#18191c] hover:bg-[#25262b] border border-white/5 rounded-lg items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer group-hover:border-slate-700"
                              title={`${match.totalMarkets} Bahis Seçeneği`}
                            >
                              <ChevronDown className="w-4 h-4" />
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
