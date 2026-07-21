import React, { useState, useEffect, useRef } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateMarketCount } from '../utils/marketUtils';
import { SportsHeroBanner } from './SportsHeroBanner';
import { AnimatedOdd } from './AnimatedOdd';
import Footer from './Footer';
import { ArrowRight, Trophy, Star, Bell, Clock, Search, ShieldCheck, Zap, Activity, Target, Gamepad2, Flame, Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { SidebarMenu } from './sports/SidebarMenu';
import { DualRightPanel } from './sports/DualRightPanel';
import { MatchCard } from './sports/MatchCard';
import { LiveMatchModal } from './sports/LiveMatchModal';
import { useBetSlip } from '../contexts/BetSlipContext';
import { MatchInfo } from './sports/types';
import { MessageCircle } from 'lucide-react';

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
  if (!name) return lang === 'tr' ? 'Futbol' : 'Soccer';
  const norm = name.toLowerCase();
  if (norm.includes('soccer') || norm.includes('futbol')) return lang === 'tr' ? 'Futbol' : 'Soccer';
  if (norm.includes('basketball') || norm.includes('basketbol')) return lang === 'tr' ? 'Basketbol' : 'Basketball';
  if (norm.includes('tennis') || norm.includes('tenis')) return lang === 'tr' ? 'Tenis' : 'Tennis';
  if (norm.includes('volleyball') || norm.includes('voleybol')) return lang === 'tr' ? 'Voleybol' : 'Volleyball';
  if (norm.includes('hockey')) return lang === 'tr' ? 'Buz Hokeyi' : 'Ice Hockey';
  if (norm.includes('handball')) return lang === 'tr' ? 'Hentbol' : 'Handball';
  if (norm.includes('table tennis')) return lang === 'tr' ? 'Masa Tenisi' : 'Table Tennis';
  return name;
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

const parseMatchData = (ev: any, language: string): MatchInfo | null => {
  const data = ev.data;
  if (!data || !data.participants) return null;
  
  const homeTeam = data.participants.home || 'Ev Sahibi';
  const awayTeam = data.participants.away || 'Deplasman';
  
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
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const mins = String(dateObj.getMinutes()).padStart(2, '0');
    startTime = `${hours}:${mins}`;

    const dayNum = dateObj.getDate();
    const monthIdx = dateObj.getMonth();
    const monthName = language === 'tr' ? monthsTR[monthIdx] : monthsEN[monthIdx];
    const monthNum = String(monthIdx + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');

    const now = new Date();
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

  if (isFinished) {
      minute = language === 'tr' ? 'Bitti' : 'FT';
  } else if (data.minute) {
      minute = `${data.minute}'`;
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
  const { isConnected, subscribeToSport, messages } = useBetting();
  const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null);
  const [activeTab, setActiveTab] = useState('live');
  const allSportsTabName = language === 'tr' ? 'Tüm Sporlar' : 'All Sports';
  const [activeSport, setActiveSport] = useState(allSportsTabName);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [activeDateFilter, setActiveDateFilter] = useState<'all' | 'today' | 'tomorrow'>('all');
  
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
  const { events } = useBetting();

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

  // Goal simulation for visual demonstration
  useEffect(() => {
    if (isLoading || matches.length === 0) return;
    
    const interval = setInterval(() => {
      const liveMatches = matches.filter(m => m.isLive && !m.isFinished);
      if (liveMatches.length > 0) {
        const randomMatch = liveMatches[Math.floor(Math.random() * liveMatches.length)];
        setGoalScoredMatches(prev => [...prev, randomMatch.id]);
        if (isGoalSoundEnabled) {
          playGoalSound();
        }
        
        setTimeout(() => {
          setGoalScoredMatches(prev => prev.filter(id => id !== randomMatch.id));
        }, 4000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [matches, isLoading, isGoalSoundEnabled]);

  useEffect(() => {
    if (!events || events.length === 0) {
      if (matches.length === 0) setIsLoading(true);
      return;
    }
    
    const parsedMatches: MatchInfo[] = [];
    events.forEach((ev: any) => {
      const matchObj = parseMatchData(ev, language);
      if (matchObj) parsedMatches.push(matchObj);
    });
    
    setMatches(parsedMatches);
    setIsLoading(false);
  }, [events, language]);

  useEffect(() => {
    if (viewMode === 'bulletin' && bulletinMatches.length === 0) {
      setIsBulletinLoading(true);
      fetch('/prelive_matches.json')
        .then(res => res.json())
        .then(data => {
           const parsed: MatchInfo[] = [];
           data.forEach((ev: any) => {
              const m = parseMatchData(ev, language);
              if (m) parsed.push(m);
           });
           setBulletinMatches(parsed);
        })
        .catch(err => console.error("Error fetching prelive matches:", err))
        .finally(() => setIsBulletinLoading(false));
    }
  }, [viewMode, language, bulletinMatches.length]);

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
    <div className="flex h-full w-full bg-zinc-950 text-zinc-300 font-sans overflow-hidden">
      
      {/* ═══════════ MAIN CONTENT AREA ═══════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 bg-zinc-950">
        
        {/* Luxury Ambient Glows */}
        <div className="absolute top-[-250px] left-1/4 w-[700px] h-[700px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[250px] right-1/4 w-[500px] h-[500px] bg-purple-500/[0.02] rounded-full blur-[160px] pointer-events-none"></div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10" style={{ scrollbarWidth: 'thin', scrollbarColor: '#27272a #09090b' }}>
          
          <SportsHeroBanner />

          {/* ═══════════ SECTION HEADER & TOGGLES ═══════════ */}
          <div className="px-4 pt-4 pb-2">
            <div className="flex items-center justify-between gap-4 mb-5 border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-6">
                <div 
                  onClick={() => setViewMode('live')}
                  className={`flex items-center gap-2 cursor-pointer transition-all ${viewMode === 'live' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${viewMode === 'live' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-zinc-600'}`}></div>
                  <span className="text-zinc-100 font-bold text-[16px] tracking-wide">{language === 'tr' ? 'Canlı Bahis' : 'Live Betting'}</span>
                </div>
                <div 
                  onClick={() => setViewMode('bulletin')}
                  className={`flex items-center gap-2 cursor-pointer transition-all ${viewMode === 'bulletin' ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${viewMode === 'bulletin' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-600'}`}></div>
                  <span className="text-zinc-100 font-bold text-[16px] tracking-wide">{language === 'tr' ? 'Maç Bülteni' : 'Bulletin'}</span>
                </div>
              </div>

              {/* Goal Sound Toggle Button */}
              <button
                onClick={toggleGoalSound}
                title={isGoalSoundEnabled ? 'Gol Sesini Kapat' : 'Gol Sesini Aç'}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  isGoalSoundEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)] hover:bg-emerald-500/20'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {isGoalSoundEnabled ? (
                  <>
                    <Volume2 size={15} className="text-emerald-400 animate-pulse shrink-0" />
                    <span className="hidden sm:inline">Gol Sesi: Açık</span>
                    <span className="sm:hidden">Ses: Açık</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={15} className="text-zinc-500 shrink-0" />
                    <span className="hidden sm:inline">Gol Sesi: Kapalı</span>
                    <span className="sm:hidden">Ses: Kapalı</span>
                  </>
                )}
              </button>
            </div>

            {/* Date Filter Pills (Only in Bulletin Mode) */}
            {viewMode === 'bulletin' && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                {[
                  { id: 'all', label: language === 'tr' ? '📅 Tüm Tarihler' : '📅 All Dates' },
                  { id: 'today', label: language === 'tr' ? '☀️ Bugün' : '☀️ Today' },
                  { id: 'tomorrow', label: language === 'tr' ? '🌙 Yarın' : '🌙 Tomorrow' },
                ].map(df => (
                  <button
                    key={df.id}
                    onClick={() => setActiveDateFilter(df.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap ${
                      activeDateFilter === df.id
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {df.label}
                  </button>
                ))}
              </div>
            )}

            {/* Sport Filter Tabs (Futuristic Modular Glass Cards) */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              <button 
                onClick={() => { setActiveSport(allSportsTabName); setActiveCountry(null); }}
                className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl whitespace-nowrap text-[12.5px] font-black transition-all duration-300 border relative overflow-hidden group select-none ${
                  isAllSportsSelected 
                    ? 'bg-[#0f111a] border-[#202538] text-white shadow-[0_6px_20px_rgba(0,0,0,0.4)]' 
                    : 'bg-[#09090b]/60 border-[#18181b]/35 text-zinc-500 hover:text-zinc-200 hover:border-zinc-800/80 hover:bg-[#121217]/50'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isAllSportsSelected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#18181b] text-zinc-600 border border-transparent'
                }`}>
                  🌟
                </div>
                <div className="flex flex-col items-start leading-none gap-1">
                  <span className="tracking-widest uppercase text-[11px]">{allSportsTabName}</span>
                  <span className={`text-[9.5px] font-black tracking-wider ${isAllSportsSelected ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {currentMatches.length} {language === 'tr' ? 'MAÇ' : 'MATCHES'}
                  </span>
                </div>

                {/* Bottom Neon Accent Underline */}
                {isAllSportsSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                )}
              </button>

              {sportsList.map(sport => {
                const count = getSportCount(sport);
                if (count === 0) return null;
                const isActive = !isAllSportsSelected && activeSport === sport;
                return (
                  <button 
                    key={sport}
                    onClick={() => { setActiveSport(sport); setActiveCountry(null); }}
                    className={`flex items-center gap-3.5 px-5 py-3.5 rounded-xl whitespace-nowrap text-[12.5px] font-black transition-all duration-300 border relative overflow-hidden group select-none ${
                      isActive 
                        ? 'bg-[#0f111a] border-[#202538] text-white shadow-[0_6px_20px_rgba(0,0,0,0.4)]' 
                        : 'bg-[#09090b]/60 border-[#18181b]/35 text-zinc-500 hover:text-zinc-200 hover:border-zinc-800/80 hover:bg-[#121217]/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors ${
                      isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#18181b] text-zinc-600 border border-transparent'
                    }`}>
                      {getSportIcon(sport)}
                    </div>
                    <div className="flex flex-col items-start leading-none gap-1">
                      <span className="tracking-widest uppercase text-[11px]">{sport}</span>
                      <span className={`text-[9.5px] font-black tracking-wider ${isActive ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        {count} {language === 'tr' ? 'MAÇ' : 'MATCHES'}
                      </span>
                    </div>

                    {/* Bottom Neon Accent Underline */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ═══════════ MATCHES GRID ═══════════ */}
          <div className="px-4 pb-8">
            
            {(isLoading || isBulletinLoading) && (
               <div className="text-center py-24 text-zinc-500 text-sm animate-pulse font-medium">
                  {language === 'tr' ? 'Veriler yükleniyor...' : 'Loading data...'}
               </div>
            )}
            {!(isLoading || isBulletinLoading) && filteredMatches.length === 0 && (
               <div className="text-center py-24 text-zinc-500 text-sm font-medium">
                  {language === 'tr' ? 'Bu branşta maç bulunamadı.' : 'No matches found.'}
               </div>
            )}
            
            {!(isLoading || isBulletinLoading) && displaySportsList.map(sportName => {
              const sportMatches = filteredMatches.filter(m => m.sport === sportName);
              if (sportMatches.length === 0) return null;

              const sportGroupedByLeague: Record<string, MatchInfo[]> = {};
              sportMatches.forEach(match => {
                if (!sportGroupedByLeague[match.league]) {
                  sportGroupedByLeague[match.league] = [];
                }
                sportGroupedByLeague[match.league].push(match);
              });

              const sortedSportLeagues = Object.keys(sportGroupedByLeague).sort((a, b) => {
                const priorityA = getLeaguePriority(a);
                const priorityB = getLeaguePriority(b);
                if (priorityA !== priorityB) return priorityA - priorityB;
                return a.localeCompare(b);
              });

              return (
                <div key={sportName} className="mb-8">
                  {/* SPORT SECTION HEADER (Futuristic Gaming HUD Style) */}
                  <div className="flex items-center justify-between mb-5 border-b border-[#27272a]/45 pb-3 mt-4 select-none">
                    <div className="flex items-center gap-3">
                      {/* Pulse Glow Line */}
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.85)] animate-pulse"></div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-emerald-400/90 uppercase tracking-[0.25em] leading-none mb-1">
                          {language === 'tr' ? 'BÜLTEN BAŞLIĞI' : 'BULLETIN SECTION'}
                        </span>
                        <h2 className="text-[19px] font-black text-white tracking-widest uppercase flex items-center gap-2.5">
                          {sportName}
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#121217] text-emerald-400 border border-emerald-500/25 tracking-wider uppercase">
                            {sportMatches.length} {language === 'tr' ? 'Maç' : 'Matches'}
                          </span>
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* LEAGUES */}
                  {sortedSportLeagues.map((league, idx) => {
                    const leagueMatches = sportGroupedByLeague[league] || [];
                    const firstMatch = leagueMatches[0];
                    const flag = getCountryFlag(firstMatch?.country || '');
                    
                    // First 3 leagues of each sport category are expanded (open) by default, rest are collapsed.
                    // If user manually clicked, we respect the user's toggle choice.
                    const isCollapsed = collapsedLeagues[league] !== undefined
                      ? collapsedLeagues[league]
                      : idx >= 3;
                    
                    // Fixed Turkish character toLocaleUpperCase('en-US') to prevent dotted İ bug on Turkish browsers
                    const formattedLeagueName = league.toLocaleUpperCase('en-US');
                    
                    return (
                      <div key={league} className="mb-4 pl-0 md:pl-1">
                        {/* League Header (Collapsible Accordion) */}
                        <div 
                          onClick={() => toggleLeagueCollapse(league)}
                          className={`flex items-center gap-3 py-3.5 px-4 bg-gradient-to-r mb-2.5 rounded-r-xl relative overflow-hidden group cursor-pointer transition-all duration-300 select-none border-l-[3px] ${
                            isCollapsed
                              ? 'from-zinc-950/80 via-zinc-900/50 to-transparent border-l-zinc-800 hover:border-l-emerald-500/30 hover:from-zinc-900/80 hover:to-zinc-900/10'
                              : 'from-[#0f111a] via-[#090b11]/80 to-transparent border-l-emerald-500 shadow-[inset_1px_0_0_rgba(16,185,129,0.05),0_4px_12px_rgba(0,0,0,0.25)]'
                          }`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <span className="text-[16px] md:text-[18px] drop-shadow-md relative z-10">{flag}</span>
                          <span className="text-[11.5px] md:text-[12.5px] text-zinc-200 font-bold truncate flex-1 tracking-widest relative z-10">{formattedLeagueName}</span>
                          
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full transition-all duration-300 relative z-10 border ${
                            isCollapsed
                              ? 'bg-zinc-900/80 text-zinc-500 border-white/[0.02]'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                          }`}>
                            {leagueMatches.length} {language === 'tr' ? 'maç' : 'matches'}
                          </span>

                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="p-1.5 text-zinc-600 hover:text-yellow-500 transition-all relative z-10 hover:scale-110"
                          >
                            <Star className="w-3.5 h-3.5 transition-colors" />
                          </button>

                          <div className="p-1 text-zinc-400 group-hover:text-white transition-transform relative z-10">
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? '-rotate-90 text-zinc-500' : 'rotate-0 text-emerald-400'}`} />
                          </div>
                        </div>
                        
                        {/* Match Rows (Collapsible) */}
                        {!isCollapsed && (
                          <div className="flex flex-col gap-2 transition-all duration-300">
                            {leagueMatches.map((match) => (
                              <MatchCard 
                                key={match.id}
                                match={match}
                                isGoal={goalScoredMatches.includes(match.id)}
                                onSelect={setSelectedMatch}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <Footer />
        </div>
      </div>

      {/* ═══════════ DYNAMIC RIGHT PANEL ═══════════ */}
      <DualRightPanel 
        popularMatches={featuredMatches}
        language={language}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
      />
      
      {/* ═══════════ SMART FLOATING ACTION BUTTON (REMOVED) ═══════════ */}
      {/* 
        The floating action button has been removed. 
        Toggle is now managed within the DualRightPanel's sticky bottom bar.
      */}

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