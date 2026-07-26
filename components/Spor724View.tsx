import React, { useState, useEffect, useRef } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateMarketCount } from '../utils/marketUtils';
import { SportsHeroBanner } from './SportsHeroBanner';
import { AnimatedOdd } from './AnimatedOdd';
import Footer from './Footer';
import { ArrowRight, Trophy, Star, Bell, Clock, Search, ShieldCheck, Zap, Activity, Target, Gamepad2, Flame, Volume2, VolumeX, ChevronDown, Radio } from 'lucide-react';
import { SidebarMenu } from './sports/SidebarMenu';
import { DualRightPanel } from './sports/DualRightPanel';
import { LiveMatchModal } from './sports/LiveMatchModal';
import { useBetSlip } from '../contexts/BetSlipContext';
import { MatchInfo } from './sports/types';
import { PopularLiveWidget } from './PopularLiveWidget';
import { SportsNavV2 } from './sports/SportsNavV2';
import { FeaturedCarouselV2 } from './sports/FeaturedCarouselV2';
import { MatchListV2 } from './sports/MatchListV2';
import { SporxSidebar } from './SporxSidebar';
import ModernChat from './ModernChat';
import { SporxBetSlip } from './SporxBetSlip';
import { RainbetMatchCard } from './sports/RainbetMatchCard';
import SportsPromoSlider from './sports/SportsPromoSlider';
import SportsIconNav from './sports/SportsIconNav';
interface BetSelection {
  id: string;
  matchId: string;
  matchName: string;
  marketName: string;
  selectionName: string;
  odd: number;
}

interface Spor724ViewProps {
  onNavigate: (view: string) => void;
}

const getTeamColor = (teamName: string) => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#10b981', 
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', 
    '#a855f7', '#d946ef', '#ec4899', '#f43f5e'
  ];
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const mapSportName = (name: string, lang: string) => {
  if (!name) return lang === 'tr' ? 'Futbol' : 'Football';
  const norm = name.toLowerCase();
  if (norm.includes('american') || norm.includes('amerikan')) return lang === 'tr' ? 'Am. Futbolu' : 'Am. Football';
  if (norm.includes('soccer') || norm.includes('futbol') || norm.includes('football')) return lang === 'tr' ? 'Futbol' : 'Football';
  if (norm.includes('basketball') || norm.includes('basketbol')) return lang === 'tr' ? 'Basketbol' : 'Basketball';
  if (norm.includes('tennis') || norm.includes('tenis')) return lang === 'tr' ? 'Tenis' : 'Tennis';
  if (norm.includes('volleyball') || norm.includes('voleybol')) return lang === 'tr' ? 'Voleybol' : 'Volleyball';
  if (norm.includes('hockey')) return lang === 'tr' ? 'Buz Hokeyi' : 'Ice Hockey';
  if (norm.includes('handball')) return lang === 'tr' ? 'Hentbol' : 'Handball';
  if (norm.includes('table tennis') || norm.includes('masa')) return lang === 'tr' ? 'Masa Tenisi' : 'Table Tennis';
  return name;
};

const mapReverseSportName = (name: string) => {
  const norm = name.toLowerCase();
  if (norm.includes('am.') || norm.includes('american')) return 'am. football';
  if (norm.includes('futbol') || norm.includes('soccer') || norm.includes('football')) return 'football';
  if (norm.includes('basketbol') || norm.includes('basketball')) return 'basketball';
  if (norm.includes('tenis') || norm.includes('tennis')) return 'tennis';
  if (norm.includes('voleybol') || norm.includes('volleyball')) return 'volleyball';
  if (norm.includes('buz hokeyi') || norm.includes('ice hockey')) return 'ice-hockey';
  if (norm.includes('hentbol') || norm.includes('handball')) return 'handball';
  if (norm.includes('masa tenisi') || norm.includes('table tennis')) return 'table-tennis';
  if (norm.includes('boks') || norm.includes('boxing')) return 'boxing';
  if (norm.includes('beyzbol') || norm.includes('baseball')) return 'baseball';
  if (norm.includes('counter')) return 'cs';
  return 'popular';
};

const mapCountryName = (name: string, lang: string) => {
  if (!name) return lang === 'tr' ? 'Uluslararası' : 'International';
  const norm = name.toLowerCase();
  if (norm.includes('international clubs')) return lang === 'tr' ? 'Uluslararası (Kulüpler)' : 'International Clubs';
  if (norm.includes('international')) return lang === 'tr' ? 'Uluslararası' : 'International';
  if (norm.includes('turkey') || norm.includes('türkiye')) return lang === 'tr' ? 'Türkiye' : 'Turkey';
  if (norm.includes('germany') || norm.includes('almanya')) return lang === 'tr' ? 'Almanya' : 'Germany';
  if (norm.includes('england') || norm.includes('ingiltere')) return lang === 'tr' ? 'İngiltere' : 'England';
  if (norm.includes('spain') || norm.includes('ispanya')) return lang === 'tr' ? 'İspanya' : 'Spain';
  if (norm.includes('italy') || norm.includes('italya')) return lang === 'tr' ? 'İtalya' : 'Italy';
  if (norm.includes('france') || norm.includes('fransa')) return lang === 'tr' ? 'Fransa' : 'France';
  if (norm.includes('russia') || norm.includes('rusya')) return lang === 'tr' ? 'Rusya' : 'Russia';
  if (norm.includes('belarus') || norm.includes('beyaz rusya')) return lang === 'tr' ? 'Beyaz Rusya' : 'Belarus';
  if (norm.includes('china') || norm.includes('çin')) return lang === 'tr' ? 'Çin' : 'China';
  if (norm.includes('brazil') || norm.includes('brezilya')) return lang === 'tr' ? 'Brezilya' : 'Brazil';
  if (norm.includes('sweden') || norm.includes('isveç')) return lang === 'tr' ? 'İsveç' : 'Sweden';
  if (norm.includes('kazakhstan') || norm.includes('kazakistan')) return lang === 'tr' ? 'Kazakistan' : 'Kazakhstan';
  if (norm.includes('paraguay')) return 'Paraguay';
  if (norm.includes('finland') || norm.includes('finlandiya')) return lang === 'tr' ? 'Finlandiya' : 'Finland';
  return name;
};

const getCountryFlag = (country: string) => {
  const flags: Record<string, string> = {
    'Türkiye': '🇹🇷', 'Turkey': '🇹🇷',
    'Almanya': '🇩🇪', 'Germany': '🇩🇪',
    'İngiltere': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'İspanya': '🇪🇸', 'Spain': '🇪🇸',
    'İtalya': '🇮🇹', 'Italy': '🇮🇹',
    'Fransa': '🇫🇷', 'France': '🇫🇷',
    'Rusya': '🇷🇺', 'Russia': '🇷🇺',
    'Beyaz Rusya': '🇧🇾', 'Belarus': '🇧🇾',
    'Çin': '🇨🇳', 'China': '🇨🇳',
    'Brezilya': '🇧🇷', 'Brazil': '🇧🇷',
    'İsveç': '🇸🇪', 'Sweden': '🇸🇪',
    'Kazakistan': '🇰🇿', 'Kazakhstan': '🇰🇿',
    'Finlandiya': '🇫🇮', 'Finland': '🇫🇮',
    'Litvanya': '🇱🇹', 'Lithuania': '🇱🇹',
    'Özbekistan': '🇺🇿', 'Uzbekistan': '🇺🇿',
    'Estonya': '🇪🇪', 'Estonia': '🇪🇪',
    'Meksika': '🇲🇽', 'Mexico': '🇲🇽',
    'Norveç': '🇳🇴', 'Norway': '🇳🇴',
    'Paraguay': '🇵🇾',
    'Portekiz': '🇵🇹', 'Portugal': '🇵🇹',
    'Hollanda': '🇳🇱', 'Netherlands': '🇳🇱',
    'Belçika': '🇧🇪', 'Belgium': '🇧🇪',
    'Yunanistan': '🇬🇷', 'Greece': '🇬🇷',
    'Ukrayna': '🇺🇦', 'Ukraine': '🇺🇦',
    'Avusturya': '🇦🇹', 'Austria': '🇦🇹',
    'İsviçre': '🇨🇭', 'Switzerland': '🇨🇭',
    'Danimarka': '🇩🇰', 'Denmark': '🇩🇰',
    'İskoçya': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'Hırvatistan': '🇭🇷', 'Croatia': '🇭🇷',
    'Arjantin': '🇦🇷', 'Argentina': '🇦🇷',
    'ABD': '🇺🇸', 'USA': '🇺🇸',
    'Japonya': '🇯🇵', 'Japan': '🇯🇵',
    'Güney Kore': '🇰🇷', 'Korea': '🇰🇷',
    'Suudi Arabistan': '🇸🇦', 'Saudi Arabia': '🇸🇦',
    'Mısır': '🇪🇬', 'Egypt': '🇪🇬',
    'Uluslararası': '🌍', 'International': '🌍',
    'Uluslararası (Kulüpler)': '🏆', 'International Clubs': '🏆',
  };
  return flags[country] || '🏳️';
};

export const parseMatchData = (ev: any, language: string): MatchInfo | null => {
  const data = ev.data;
  if (!data || !data.participants) return null;
  
  const homeTeam = data.participants.home || 'Ev Sahibi';
  const awayTeam = data.participants.away || 'Deplasman';
  
  let score = '-';
  let minute = 'Yakında';
  let isFinished = data.status === 'finished' || data.status === 'ended' || data.status === 'closed';
  let isLive = false; // We will determine this after parsing the date
  
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
  } else if (data.score) {
    score = String(data.score).replace(':', ' - ');
  }
  let startTime = '';
  let matchDate = '';
  let fullDate = '';

  const monthsTR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthsEN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const rawStartTime = data.start_time || data.time || ev.start_time || ev.time;
  let dateObj: Date | null = null;

  if (rawStartTime) {
    try {
      const d = new Date(rawStartTime);
      if (!isNaN(d.getTime())) dateObj = d;
    } catch (e) {}
  } else if (data.start_ts || ev.start_ts) {
    try {
      const ts = data.start_ts || ev.start_ts;
      const d = new Date(ts * 1000);
      if (!isNaN(d.getTime())) dateObj = d;
    } catch (e) {}
  }

  if (dateObj) {
    const now = new Date();
    
    // DEMO HACK: If the date is in the past (e.g. from a stale JSON file), 
    // push it forward to today or tomorrow so the demo looks fresh
    if (dateObj.getTime() < now.getTime() - 24 * 60 * 60 * 1000) {
        dateObj.setDate(now.getDate() + (Math.random() > 0.5 ? 0 : 1));
        dateObj.setMonth(now.getMonth());
        dateObj.setFullYear(now.getFullYear());
    }

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const mins = String(dateObj.getMinutes()).padStart(2, '0');
    startTime = `${hours}:${mins}`;

    const dayNum = dateObj.getDate();
    const monthIdx = dateObj.getMonth();
    const monthName = language === 'tr' ? monthsTR[monthIdx] : monthsEN[monthIdx];
    const monthNum = String(monthIdx + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const matchDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const diffDays = Math.round((matchDay.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) {
      matchDate = language === 'tr' ? 'Bugün' : 'Today';
    } else if (diffDays === 1) {
      matchDate = language === 'tr' ? 'Yarın' : 'Tomorrow';
    } else {
      matchDate = `${formattedDay}.${monthNum}`;
    }
    fullDate = `${formattedDay} ${monthName}`;
  }

  // Proper isLive Logic (Time Barrier & Status Check)
  const activeStatuses = ['in_progress', 'started', 'halftime', 'playing'];
  const hasActiveStatus = activeStatuses.includes(data.status);
  
  if (hasActiveStatus) {
    if (dateObj) {
      if (dateObj.getTime() <= Date.now()) {
        isLive = true;
      }
    } else {
      // Fallback if we have an active status but failed to parse date
      isLive = true;
    }
  }


  if (isFinished) {
      minute = language === 'tr' ? 'Bitti' : 'FT';
  } else if (data.minute) {
      const minStr = String(data.minute).trim();
      minute = /^\d+$/.test(minStr) ? `${minStr}'` : minStr;
  } else if (data.extended_status) {
      minute = String(data.extended_status || '').replace('s', '. Set');
  } else if (startTime) {
      minute = startTime;
  }

  const homeTeamId = data.participants?.home_id || data.participants?.ByNumber?.['1']?.Id || '';
  const awayTeamId = data.participants?.away_id || data.participants?.ByNumber?.['2']?.Id || '';
  
  let homeLogoUrl = data.participants?.ByNumber?.['1']?.LogoPath || '';
  if (!homeLogoUrl && homeTeamId) {
    homeLogoUrl = `https://opt-images.betconstruct.com/team-logo/${homeTeamId}.png`;
  }
  
  let awayLogoUrl = data.participants?.ByNumber?.['2']?.LogoPath || '';
  if (!awayLogoUrl && awayTeamId) {
    awayLogoUrl = `https://opt-images.betconstruct.com/team-logo/${awayTeamId}.png`;
  }
  
  const countryName = mapCountryName(data.country?.name, language);
  const tournamentName = data.tournament?.name || 'Uluslararası Turnuva';
  const league = countryName ? `${countryName} - ${tournamentName}` : tournamentName;
  const sport = mapSportName(data.sport?.name, language);
  const country = countryName;
  
  let homeOdd = '-';
  let drawOdd = '-';
  let awayOdd = '-';
  let homeId = `h_${ev.id}`;
  let drawId = `d_${ev.id}`;
  let awayId = `a_${ev.id}`;
  
  const rawGroupMarkets = data.group_markets || ev.group_markets;
  const rawMarkets = rawGroupMarkets?.['full_event|0'] || rawGroupMarkets?.['game_full_event|0'] || rawGroupMarkets?.['set|1'];
  const markets = Array.isArray(rawMarkets) ? rawMarkets : [];
  
  for (const market of markets) {
     if (!market) continue;
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
              break; // Found valid odds
           }
         }
      }
  }

  if (homeOdd === '-' && awayOdd === '-') {
    return null;
  }

  const matchObj: MatchInfo = {
    id: ev.id,
    home: homeTeam,
    away: awayTeam,
    isLive,
    isFinished,
    score,
    minute,
    startTime: startTime || minute,
    matchDate,
    fullDate,
    league,
    sport,
    country,
    homeOdd,
    drawOdd,
    awayOdd,
    homeId,
    drawId,
    awayId,
    homeLogo: homeLogoUrl,
    awayLogo: awayLogoUrl,
    marketsCount: data.markets_count || calculateMarketCount(ev),
    rawEvent: ev,
  };

  const virtualKeywords = [
    'cyber', 'sanal', 'virtual', 'simulated', 'srl', 'esoccer', 'ebasketball', 'etennis',
    'esports', 'e-sports', 'fifa', 'nba2k', 'gt sports', 'h2hgg', 'dota', 'counter-strike',
    'cs:go', 'cs2', 'valorant', 'league of legends', 'rocket league', 'overwatch', 'starcraft',
    'crossfire', 'king of glory', 'pubg', 'penaltı atışları', 'penalty shootout', 'sub soccer'
  ];

  const combinedSearchStr = `${sport} ${country} ${league} ${homeTeam} ${awayTeam}`.toLowerCase();
  const isFakeMatch = virtualKeywords.some(kw => combinedSearchStr.includes(kw));

  const isDuplicateMock = 
    (homeTeam.toLowerCase().includes('spain') || homeTeam.toLowerCase().includes('ispanya') || homeTeam.toLowerCase().includes('arjantin') || homeTeam.toLowerCase().includes('argentina')) ||
    (homeTeam.toLowerCase().includes('france') || homeTeam.toLowerCase().includes('fransa') || homeTeam.toLowerCase().includes('portekiz') || homeTeam.toLowerCase().includes('portugal')) ||
    (homeTeam.toLowerCase().includes('england') || homeTeam.toLowerCase().includes('ingiltere') || homeTeam.toLowerCase().includes('brezilya') || homeTeam.toLowerCase().includes('brazil'));
    
  if (isFakeMatch || isDuplicateMock) {
     return null;
  }
  
  return matchObj;
};

export default function Spor724View({ onNavigate }: Spor724ViewProps) {
  const { language } = useLanguage();
  const { isConnected, events } = useBetting();
  const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null);
  const [activeTab, setActiveTab] = useState('in-play');
  const allSportsTabName = language === 'tr' ? 'Tüm Sporlar' : 'All Sports';
  const [activeSport, setActiveSport] = useState(allSportsTabName);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeDateFilter, setActiveDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [visibleCount, setVisibleCount] = useState<number>(30);
  
  // Dual-mode panel toggled by a simple boolean or string on mobile, but since DualRightPanel handles it inside,
  // we just need to know if the sidebar wrapper itself is open on mobile.
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1280) {
      setIsSidebarOpenMobile(false); // On desktop it's always open statically
    }

    const handleOpenMobileChat = () => {
      setIsSidebarOpenMobile(true);
      setTimeout(() => {
        window.dispatchEvent(new Event('setRightPanelToChat'));
      }, 50);
    };
    window.addEventListener('openMobileChatPanel', handleOpenMobileChat);
    return () => {
      window.removeEventListener('openMobileChatPanel', handleOpenMobileChat);
    };
  }, []);
  
  const { betSlip } = useBetSlip();
  
  const [viewMode, setViewMode] = useState<'live' | 'bulletin'>('live');
  const [bulletinMatches, setBulletinMatches] = useState<MatchInfo[]>([]);
  const [isBulletinLoading, setIsBulletinLoading] = useState(false);

  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [goalScoredMatches, setGoalScoredMatches] = useState<string[]>([]);


  // Collapsible Leagues State
  const [collapsedLeagues, setCollapsedLeagues] = useState<Record<string, boolean>>({});

  const toggleLeagueCollapse = (leagueName: string) => {
    setCollapsedLeagues(prev => ({
      ...prev,
      [leagueName]: !prev[leagueName]
    }));
  };

  // Goal Sound Toggle State (persisted in localStorage)
  const [isGoalSoundEnabled, setIsGoalSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('724_goal_sound') !== 'false';
  });

  const playGoalSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Sound 1: Referee Whistle
      const playWhistleNote = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        
        gain.gain.setValueAtTime(0.25, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
      };

      // Double whistle: Beep-Beep!
      playWhistleNote(2400, 0, 0.12);
      playWhistleNote(2800, 0.14, 0.25);

      // Sound 2: Stadium Cheer Chord (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.1 + i * 0.04);
        
        gain.gain.setValueAtTime(0.18, ctx.currentTime + 0.1 + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7 + i * 0.04);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + 0.1 + i * 0.04);
        osc.stop(ctx.currentTime + 0.7 + i * 0.04);
      });
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  const toggleGoalSound = () => {
    setIsGoalSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('724_goal_sound', String(next));
      if (next) playGoalSound();
      return next;
    });
  };

  // Track live score changes to trigger goal sound & highlight
  const prevScoresRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!matches || matches.length === 0) return;

    matches.forEach(m => {
      if (m.isLive && m.score && m.score !== '-') {
        const prev = prevScoresRef.current[m.id];
        if (prev && prev !== m.score) {
          // Goal scored!
          setGoalScoredMatches(gPrev => [...gPrev, m.id]);
          if (isGoalSoundEnabled) {
            playGoalSound();
          }
          setTimeout(() => {
            setGoalScoredMatches(gPrev => gPrev.filter(id => id !== m.id));
          }, 4000);
        }
        prevScoresRef.current[m.id] = m.score;
      }
    });
  }, [matches, isGoalSoundEnabled]);

  // Goal simulation for visual demonstration removed to prevent state oscillation

  // Single Source of Truth: Listen to WebSocket events if available, otherwise poll live_matches.json smoothly
  useEffect(() => {
    let interval: any;
    let abortController = new AbortController();
    
    const fetchFromJSON = () => {
      abortController.abort(); // Cancel previous ongoing request to prevent race conditions
      abortController = new AbortController();
      
      fetch(`/live_matches.json?t=${new Date().getTime()}`, { signal: abortController.signal })
        .then(res => res.json())
        .then(data => {
           const parsed: MatchInfo[] = [];
           const seen = new Set<string>();
           if (Array.isArray(data)) {
             data.forEach((ev: any) => {
                if (ev && ev.data) {
                  const info = parseMatchData(ev, language);
                  if (info && !seen.has(info.id)) {
                    seen.add(info.id);
                    parsed.push(info);
                  }
                }
             });
           }
           if (parsed.length > 0) {
              setMatches(prev => {
                // Smooth merge: check if changed before replacing to avoid DOM flickering
                if (JSON.stringify(prev) === JSON.stringify(parsed)) return prev;
                return parsed;
              });
           }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
             console.error("Error fetching live matches:", err);
          }
        })
        .finally(() => setIsLoading(false));
    };

    if (events && events.length > 0) {
      const parsedMatches: MatchInfo[] = [];
      events.forEach((ev: any) => {
        const matchObj = parseMatchData(ev, language);
        if (matchObj) parsedMatches.push(matchObj);
      });
      setMatches(prev => {
        if (JSON.stringify(prev) === JSON.stringify(parsedMatches)) return prev;
        return parsedMatches;
      });
      setIsLoading(false);
    } else if (viewMode === 'live') {
      if (matches.length === 0) setIsLoading(true);
      fetchFromJSON();
      interval = setInterval(fetchFromJSON, 2000); // Smooth 2s polling
    }
    
    return () => {
      if (interval) clearInterval(interval);
      abortController.abort(); // Cleanup on unmount or deps change
    };
  }, [events, viewMode, language]);

  const currentMatches = viewMode === 'live' ? matches : bulletinMatches;
  const sportsList = Array.from(new Set(currentMatches.map(m => m.sport)));
  const getSportCount = (sport: string) => currentMatches.filter(m => m.sport === sport).length;

  const isAllSportsSelected = activeSport === 'Tüm Sporlar' || activeSport === 'All Sports' || !activeSport;

  const filteredMatches = currentMatches.filter(m => {
    if (viewMode === 'live' && !m.isLive) return false;
    if (!isAllSportsSelected && m.sport !== activeSport) return false;
    if (activeCountry && m.country !== activeCountry) return false;
    if (viewMode === 'bulletin' && activeDateFilter !== 'all') {
      if (activeDateFilter === 'today' && m.matchDate !== 'Bugün' && m.matchDate !== 'Today') return false;
      if (activeDateFilter === 'tomorrow' && m.matchDate !== 'Yarın' && m.matchDate !== 'Tomorrow') return false;
    }
    return true;
  });

  const displaySportsList = isAllSportsSelected
    ? sportsList
    : sportsList.filter(s => s === activeSport);

  // Group by league
  const groupedByLeague: Record<string, MatchInfo[]> = {};
  filteredMatches.forEach(match => {
    if (!groupedByLeague[match.league]) {
      groupedByLeague[match.league] = [];
    }
    groupedByLeague[match.league].push(match);
  });

  // Sort league groups by priority tiers
  const getLeaguePriority = (leagueName: string) => {
    const name = leagueName.toLowerCase();
    
    // Tier 1: Top Major Leagues and Competitions (Score: 1)
    const tier1Keywords = [
      'şampiyonlar ligi', 'champions league', 'avrupa ligi', 'europa league', 
      'conference league', 'konferans ligi', 'süper lig', 'premier league', 
      'la liga', 'serie a', 'bundesliga', 'ligue 1', 'nba', 'euroleague',
      'dünya kupası', 'world cup', 'euro 20', 'copa america', 'grand slam', 'masters 1000',
      'club friendly games', 'uluslararası (kulüpler)'
    ];
    if (tier1Keywords.some(kw => name.includes(kw))) return 1;

    // Tier 3: Youth, Women, Friendlies (except club friendlies), Amateurs, Lower Leagues (Score: 3)
    const tier3Keywords = [
      'u19', 'u20', 'u21', 'u23', 'youth', 'genç', 'women', 'kadınlar', 'bayanlar',
      'friendly', 'hazırlık', 'amateur', 'amatör', 'reserve', 'rezerv',
      '2. lig', '3. lig', 'division 2', 'division 3', 'league 2', 'league 3',
      'serie b', 'serie c', 'liga 2', 'liga 3', 'championship', 'segunda', 'b ligi'
    ];
    if (tier3Keywords.some(kw => name.includes(kw) && !name.includes('club friendly games') && !name.includes('uluslararası (kulüpler)'))) return 3;

    // Tier 2: Everything else (Other 1st Leagues, Standard Tournaments) (Score: 2)
    return 2;
  };

  const sortedLeagues = Object.keys(groupedByLeague).sort((a, b) => {
    const priorityA = getLeaguePriority(a);
    const priorityB = getLeaguePriority(b);
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    // If same tier, sort alphabetically
    return a.localeCompare(b);
  });

  const getSportBgImage = (sportName: string) => {
    const name = (sportName || '').toLowerCase();
    if (name.includes('basketbol') || name.includes('basketball')) return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop';
    if (name.includes('tenis') || name.includes('tennis')) return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop';
    if (name.includes('voleybol') || name.includes('volleyball')) return 'https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop';
    if (name.includes('buz hokeyi') || name.includes('ice hockey')) return 'https://images.unsplash.com/photo-1515703407324-5f753eedf996?q=80&w=800&auto=format&fit=crop';
    if (name.includes('masa tenisi') || name.includes('table tennis')) return 'https://images.unsplash.com/photo-1534158914592-062992fbe900?q=80&w=800&auto=format&fit=crop';
    if (name.includes('e-spor') || name.includes('esports')) return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop';
    if (name.includes('hentbol') || name.includes('handball')) return 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop'; // Futbol fallback
  };

  const getSportIcon = (sportName: string) => {
    const name = sportName.toLowerCase();
    if (name.includes('futbol') || name.includes('soccer')) return <Activity className="w-4 h-4" />;
    if (name.includes('basketbol') || name.includes('basketball')) return <Target className="w-4 h-4" />;
    if (name.includes('tenis') || name.includes('tennis')) return <Trophy className="w-4 h-4" />;
    if (name.includes('voleybol') || name.includes('volleyball')) return <Clock className="w-4 h-4" />;
    if (name.includes('e-spor') || name.includes('esports') || name.includes('counter') || name.includes('valorant')) return <Gamepad2 className="w-4 h-4" />;
    if (name.includes('boks') || name.includes('boxing') || name.includes('martial')) return <Flame className="w-4 h-4" />;
    if (name.includes('hokey') || name.includes('hockey')) return <Zap className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  // Featured matches for Popüler grid (top 6 highest priority matches)
  const featuredMatches = [...matches]
    .filter(m => m.isLive)
    .sort((a, b) => {
       const pA = getLeaguePriority(a.league);
       const pB = getLeaguePriority(b.league);
       return pA - pB;
    })
    .slice(0, 6);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen w-full bg-[#101114] text-zinc-300 font-sans overflow-hidden">
      
      {/* Top Nav (Rainbet Style) - Removed */ }
      {/* Main Content Scrollable Area */}
      <div className="flex-1 flex flex-row overflow-hidden relative z-10 bg-[#101114]">
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-[#101114]">
        
        {/* Container for centering the layout like Rainbet */}
        <div className="max-w-[1200px] mx-auto pb-24 md:pb-12">
            
            {/* Top Icon Navigation (Moved above slider) */}
            <div className="px-4 md:px-6 pt-4 mb-4">
                <SportsIconNav />
            </div>

            {/* Max Tier Official Partner Banner (Professional Edition) -> Now a Slider */}
            <div className="px-4 md:px-6 mb-4">
                <SportsPromoSlider />
            </div>

            {/* ── CENTRAL FEED ── */}

            {/* Featured Matches Carousel (V2 updated) */}
            <FeaturedCarouselV2 matches={filteredMatches} onSelectMatch={setSelectedMatch} />

            {/* Sports Filter Pills (Rainbet Style) */}
            <div className="px-4 md:px-6 mb-4">
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                  <button
                      onClick={() => setActiveSport(allSportsTabName)}
                      className={`flex-shrink-0 px-4 py-2 text-[13px] font-bold rounded-full transition-colors whitespace-nowrap flex items-center gap-2 ${
                        isAllSportsSelected
                          ? 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-[#18191c] text-[#8e939d] hover:bg-[#23273a] hover:text-white border border-white/5'
                      }`}
                  >
                      {getSportIcon('Tüm Sporlar')}
                      <span>{allSportsTabName}</span>
                  </button>

                  {sportsList.map(sport => (
                    <button
                      key={sport}
                      onClick={() => setActiveSport(sport)}
                      className={`flex-shrink-0 px-4 py-2 text-[13px] font-bold rounded-full transition-colors whitespace-nowrap flex items-center gap-2 ${
                        activeSport === sport
                          ? 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-[#18191c] text-[#8e939d] hover:bg-[#23273a] hover:text-white border border-white/5'
                      }`}
                    >
                      {getSportIcon(sport)}
                      <span>{sport}</span>
                    </button>
                  ))}
                </div>
            </div>
            
            {/* Live Header */}
            <div className="px-4 md:px-6 mb-4 flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#ef4444]" />
                <h2 className="text-white text-xl font-black italic tracking-wide uppercase">Canlı</h2>
            </div>

            {/* Main Matches Area */}
            <div className="px-4 md:px-6 pb-8">
                {(isLoading || isBulletinLoading) && (
                   <div className="text-center py-24 text-zinc-500 text-sm animate-pulse font-medium">
                      {language === 'tr' ? 'Veriler yükleniyor...' : 'Loading data...'}
                   </div>
                )}
                
                {!(isLoading || isBulletinLoading) && filteredMatches.length === 0 && (
                   <div className="text-center py-24 text-zinc-500 text-sm font-medium flex flex-col items-center justify-center bg-[#18191c] rounded-xl border border-white/5">
                      <div className="w-16 h-16 bg-[#23273a] rounded-full flex items-center justify-center mb-4">
                         <span className="text-2xl">⚽</span>
                      </div>
                      {language === 'tr' ? 'Bu sekmede veya branşta maç bulunamadı.' : 'No matches found in this section.'}
                   </div>
                )}
                
                {!(isLoading || isBulletinLoading) && (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filteredMatches.slice(0, visibleCount).map(match => (
                                <RainbetMatchCard 
                                    key={match.id}
                                    match={match}
                                    onSelect={setSelectedMatch}
                                />
                            ))}
                        </div>
                        {filteredMatches.length > visibleCount && (
                            <button 
                                onClick={() => setVisibleCount(p => p + 30)}
                                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-colors"
                            >
                                {language === 'tr' ? 'Daha Fazla Göster' : 'Show More'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
      </div>
      </div>

      {/* Live Match Details Modal */}
      {selectedMatch && (
        <LiveMatchModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  );
};