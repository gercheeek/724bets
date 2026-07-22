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
             home: parsed?.homeOdd !== '-' && parsed?.homeOdd ? parsed.homeOdd : (d.homeOdd || d.odds?.['1'] || '1.80'), 
             draw: parsed?.drawOdd !== '-' && parsed?.drawOdd ? parsed.drawOdd : (d.drawOdd || d.odds?.['X'] || '3.20'), 
             away: parsed?.awayOdd !== '-' && parsed?.awayOdd ? parsed.awayOdd : (d.awayOdd || d.odds?.['2'] || '4.50') 
           },
           totalMarkets: d.markets_count || Math.floor(Math.random() * 50) + 10,
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
      
      {/* ── HIGHLIGHTED PROMO BANNER ── */}
      <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-2xl overflow-hidden mb-4 flex-shrink-0 group cursor-pointer border border-[#2a3528]/50 shadow-2xl">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d140b] via-[#152e12] to-[#123610] z-0"></div>
        
        {/* Boxer Image Overlay (Simulated via Unsplash & gradients) */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/4 lg:w-2/3 bg-[url('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center mix-blend-luminosity opacity-40 z-0" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)', maskImage: 'linear-gradient(to right, transparent, black 40%)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-transparent opacity-80 z-0"></div>

        <div className="relative z-10 flex flex-col justify-center h-full p-6 md:px-10 lg:px-12 w-full md:w-3/4 lg:w-2/3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 md:h-12 bg-[#4ade80] rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
            <div>
              <p className="text-[#4ade80] font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-0.5">BOXING PROMO</p>
              <h2 className="text-white text-3xl md:text-5xl font-extrabold italic tracking-tight drop-shadow-md">Extra 50% Profit!</h2>
            </div>
          </div>
          <p className="text-white text-sm md:text-base font-medium mt-4 max-w-lg leading-relaxed drop-shadow-md">
            Simply <span className="text-[#4ade80] font-bold">bet</span> on the <span className="text-[#4ade80] font-bold">fight</span> to go the <span className="text-[#4ade80] font-bold">distance</span> and enjoy an <span className="text-[#4ade80] font-bold">extra 50% profit</span> if it <span className="text-[#4ade80] font-bold">does</span>!
          </p>
          <p className="text-white/60 text-xs mt-4 max-w-xl leading-relaxed">
            Will be issued as a Freebet from your highest betslip, valid only for 'Will the fight go the distance' market, up to <strong className="text-[#4ade80]">$500</strong> per user! Parlays and Live bets are not eligible.
          </p>
        </div>

        {/* Brand Text */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center">
          <span className="text-white/90 text-6xl font-black italic tracking-tighter drop-shadow-2xl">BOXING</span>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-6 flex items-center gap-1.5 z-10">
          <div className="w-8 h-1 bg-[#3b82f6] rounded-full"></div>
          <div className="w-3 h-1 bg-white/30 rounded-full hover:bg-white/50 transition-colors cursor-pointer"></div>
          <div className="w-3 h-1 bg-white/30 rounded-full hover:bg-white/50 transition-colors cursor-pointer"></div>
          <div className="w-3 h-1 bg-white/30 rounded-full hover:bg-white/50 transition-colors cursor-pointer"></div>
          <div className="w-3 h-1 bg-white/30 rounded-full hover:bg-white/50 transition-colors cursor-pointer"></div>
          <div className="w-3 h-1 bg-white/30 rounded-full hover:bg-white/50 transition-colors cursor-pointer"></div>
        </div>
      </div>

      {/* ── FEATURED MATCHES ROW ── */}
      <div className="w-full flex gap-3 md:gap-4 overflow-x-auto pb-6 mb-2 scrollbar-hide snap-x">
        
        {/* Match Card 1 */}
        <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[360px] bg-[#111621] rounded-xl p-4 flex flex-col gap-4 snap-center border border-white/5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-white/50 font-medium gap-2">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Gamepad2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
              <span className="truncate text-slate-300 font-medium">Counter-Strike 2 | BLAST Bounty Season 1</span>
            </div>
            <span className="shrink-0 text-slate-400">Yarın, 15:30</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1c2230] flex items-center justify-center overflow-hidden">
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Sinners_Esports_logo.png/220px-Sinners_Esports_logo.png" className="w-full h-full object-contain p-1.5" alt="Sinners" />
              </div>
              <span className="font-bold text-white text-sm">Sinners Esports</span>
            </div>
            <div className="flex flex-col items-end gap-2 text-right">
              <div className="w-8 h-8 rounded-full bg-[#1c2230] flex items-center justify-center overflow-hidden">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/FUT_Esports_logo.png/220px-FUT_Esports_logo.png" className="w-full h-full object-contain p-1.5 invert" alt="FUT" />
              </div>
              <span className="font-bold text-white text-sm">FUT Esports</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <div className="text-center text-[10px] text-white/40 uppercase tracking-widest font-semibold">Kazanan</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-[#1c2230] hover:bg-[#252d3d] transition-colors rounded-lg p-2.5 flex justify-between items-center group">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">1</span>
                <span className="text-white font-bold text-sm">3.65</span>
              </button>
              <button className="flex-1 bg-[#1c2230] hover:bg-[#252d3d] transition-colors rounded-lg p-2.5 flex justify-between items-center group">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">2</span>
                <span className="text-white font-bold text-sm">1.29</span>
              </button>
            </div>
          </div>
        </div>

        {/* Match Card 2 */}
        <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[360px] bg-[#111621] rounded-xl p-4 flex flex-col gap-4 snap-center border border-white/5 shadow-lg">
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
          <div className="flex flex-col gap-2 mt-auto">
            <div className="text-center text-[10px] text-white/40 uppercase tracking-widest font-semibold">Kazanan</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-[#1c2230] hover:bg-[#252d3d] transition-colors rounded-lg p-2.5 flex justify-between items-center group">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">1</span>
                <span className="text-white font-bold text-sm">1.01</span>
              </button>
              <button className="flex-1 bg-[#1c2230] hover:bg-[#252d3d] transition-colors rounded-lg p-2.5 flex justify-between items-center group">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">2</span>
                <span className="text-white font-bold text-sm">15.00</span>
              </button>
            </div>
          </div>
        </div>

        {/* Match Card 3 */}
        <div className="min-w-[300px] sm:min-w-[340px] md:min-w-[360px] bg-[#111621] rounded-xl p-4 flex flex-col gap-4 snap-center border border-white/5 shadow-lg">
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
          <div className="flex flex-col gap-2 mt-auto">
            <div className="text-center text-[10px] text-white/40 uppercase tracking-widest font-semibold">Kazanan</div>
            <div className="flex items-center gap-2">
              <button className="flex-1 bg-[#1c2230] hover:bg-[#252d3d] transition-colors rounded-lg p-2.5 flex justify-between items-center group">
                <span className="text-white/50 text-xs font-semibold group-hover:text-white transition-colors">1</span>
                <span className="text-white font-bold text-sm">1.11</span>
              </button>
              <button className="flex-1 bg-[#1c2230] hover:bg-[#252d3d] transition-colors rounded-lg p-2.5 flex justify-between items-center group">
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
                    <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse"></span>
                  </h3>
                  <div className="bg-red-500/20 border border-red-500/30 text-red-500 px-2.5 py-1 rounded-lg text-xs md:text-sm font-black tracking-widest mt-1">
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
                    <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]"></span>
                  </h3>
                  <div className="bg-blue-500/20 border border-blue-500/30 text-blue-500 px-2.5 py-1 rounded-lg text-xs md:text-sm font-black tracking-widest mt-1">
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
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-red-500 opacity-75"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 relative z-10"></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
            Canlı
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
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
            className="w-full bg-[#121927] border border-[#1e283d] focus:border-blue-500 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* ── CATEGORY PILLS HORIZONTAL BAR ── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-800/60">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-full font-semibold text-xs sm:text-sm flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/25 border border-blue-400/40'
              : 'bg-[#131926] hover:bg-[#1b2336] text-slate-300 border border-[#1e273a]'
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
                  ? 'bg-[#2563eb] text-white font-bold shadow-lg shadow-blue-500/25 border border-blue-400/40'
                  : 'bg-[#131926] hover:bg-[#1b2336] text-slate-300 border border-[#1e273a]'
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
        <div className="py-16 text-center bg-[#0e1320] rounded-2xl border border-[#1b2335]">
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
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                  <h3 className="text-xl font-black text-white tracking-wide">CANLI MAÇLAR</h3>
                </div>
                {Object.entries(grouped).map(([leagueName, leagueMatches]) => (
                  <div key={leagueName} className="bg-[#0e1320] border border-[#1b2335] rounded-xl overflow-hidden shadow-lg">
                    {/* League Header */}
                    <div className="bg-[#131926] px-4 py-3 border-b border-[#1b2335] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-200 font-bold text-sm tracking-wide">{leagueName}</span>
                    </div>
                    
                    {/* Match Rows */}
                    <div className="flex flex-col divide-y divide-[#1b2335]/50">
                      {leagueMatches.map(match => (
                        <div key={match.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-[#131926]/40 transition-colors">
                          
                          {/* Time & Status */}
                          <div className="w-full md:w-32 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-center gap-1 shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Canlı" />
                              <span className="text-[#3b82f6] text-xs font-bold">{match.minute}</span>
                            </div>
                            <div className="flex gap-2">
                               {match.hasStream && <Play className="w-3.5 h-3.5 text-red-500 hidden md:block" />}
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
                                <span className="text-sm shrink-0">{match.team1.logo}</span>
                                <span className="text-sm font-bold text-white truncate">{match.team1.name}</span>
                              </div>
                              <span className="text-[#4ade80] font-black text-sm shrink-0">{match.team1.score}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 pr-2 md:pr-6">
                              <div className="flex items-center gap-2.5 truncate">
                                <span className="text-sm shrink-0">{match.team2.logo}</span>
                                <span className="text-sm font-bold text-white truncate">{match.team2.name}</span>
                              </div>
                              <span className="text-[#4ade80] font-black text-sm shrink-0">{match.team2.score}</span>
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
                                className={`flex-1 md:w-[65px] h-11 flex flex-col items-center justify-center rounded-lg border transition-all ${
                                  selectedBets[match.id] === '1' ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-[#151c2c] border-[#222d44] hover:bg-[#1f293e] text-slate-300'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500 font-medium leading-none mb-1">1</span>
                                <span className="text-sm font-bold leading-none">{match.odds.home}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, 'X')}
                                className={`flex-1 md:w-[65px] h-11 flex flex-col items-center justify-center rounded-lg border transition-all ${
                                  selectedBets[match.id] === 'X' ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-[#151c2c] border-[#222d44] hover:bg-[#1f293e] text-slate-300'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500 font-medium leading-none mb-1">X</span>
                                <span className="text-sm font-bold leading-none">{match.odds.draw}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, '2')}
                                className={`flex-1 md:w-[65px] h-11 flex flex-col items-center justify-center rounded-lg border transition-all ${
                                  selectedBets[match.id] === '2' ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-[#151c2c] border-[#222d44] hover:bg-[#1f293e] text-slate-300'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500 font-medium leading-none mb-1">2</span>
                                <span className="text-sm font-bold leading-none">{match.odds.away}</span>
                              </button>
                            </div>
                            
                            <button
                              className="hidden md:flex w-11 h-11 bg-[#151c2c] hover:bg-[#1f293e] border border-[#222d44] rounded-lg items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer group-hover:border-slate-700"
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
                  <div key={leagueName} className="bg-[#0e1320] border border-[#1b2335] rounded-xl overflow-hidden shadow-lg opacity-90">
                    {/* League Header */}
                    <div className="bg-[#131926] px-4 py-3 border-b border-[#1b2335] flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-200 font-bold text-sm tracking-wide">{leagueName}</span>
                    </div>
                    
                    {/* Match Rows */}
                    <div className="flex flex-col divide-y divide-[#1b2335]/50">
                      {leagueMatches.map(match => (
                        <div key={match.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-[#131926]/40 transition-colors">
                          
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
                                <span className="text-sm shrink-0">{match.team1.logo}</span>
                                <span className="text-sm font-bold text-white truncate">{match.team1.name}</span>
                              </div>
                              <span className="text-slate-500 font-bold text-sm shrink-0">-</span>
                            </div>
                            <div className="flex items-center justify-between gap-3 pr-2 md:pr-6">
                              <div className="flex items-center gap-2.5 truncate">
                                <span className="text-sm shrink-0">{match.team2.logo}</span>
                                <span className="text-sm font-bold text-white truncate">{match.team2.name}</span>
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
                                className={`flex-1 md:w-[65px] h-11 flex flex-col items-center justify-center rounded-lg border transition-all ${
                                  selectedBets[match.id] === '1' ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-[#151c2c] border-[#222d44] hover:bg-[#1f293e] text-slate-300'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500 font-medium leading-none mb-1">1</span>
                                <span className="text-sm font-bold leading-none">{match.odds.home}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, 'X')}
                                className={`flex-1 md:w-[65px] h-11 flex flex-col items-center justify-center rounded-lg border transition-all ${
                                  selectedBets[match.id] === 'X' ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-[#151c2c] border-[#222d44] hover:bg-[#1f293e] text-slate-300'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500 font-medium leading-none mb-1">X</span>
                                <span className="text-sm font-bold leading-none">{match.odds.draw}</span>
                              </button>
                              <button
                                onClick={() => selectBet(match.id, '2')}
                                className={`flex-1 md:w-[65px] h-11 flex flex-col items-center justify-center rounded-lg border transition-all ${
                                  selectedBets[match.id] === '2' ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-[#151c2c] border-[#222d44] hover:bg-[#1f293e] text-slate-300'
                                }`}
                              >
                                <span className="text-[10px] text-slate-500 font-medium leading-none mb-1">2</span>
                                <span className="text-sm font-bold leading-none">{match.odds.away}</span>
                              </button>
                            </div>
                            
                            <button
                              className="hidden md:flex w-11 h-11 bg-[#151c2c] hover:bg-[#1f293e] border border-[#222d44] rounded-lg items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer group-hover:border-slate-700"
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
