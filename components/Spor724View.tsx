import React, { useState, useEffect, useRef } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useLanguage } from '../contexts/LanguageContext';
import { calculateMarketCount } from '../utils/marketUtils';
import { getMatchPriorityScore } from '../utils/eliteTeams';
import { SportsHeroBanner } from './SportsHeroBanner';
import { AnimatedOdd } from './AnimatedOdd';
import Footer from './Footer';
import { ArrowRight, Trophy, Star, Bell, Clock, Search, ShieldCheck, Zap, Activity, Target, Gamepad2, Flame, Volume2, VolumeX, ChevronDown, Radio, Calendar } from 'lucide-react';
import { SidebarMenu } from './sports/SidebarMenu';
import { DualRightPanel } from './sports/DualRightPanel';
import FeaturedCombos from './sports/FeaturedCombos';

import { LiveMatchInline } from './sports/LiveMatchInline';
import { useBetSlip } from '../contexts/BetSlipContext';
import { MatchInfo } from './sports/types';
import { mockSportsData } from '../data/mockSportsData';
import { PopularLiveWidget } from './PopularLiveWidget';
import { SportsNavV2 } from './sports/SportsNavV2';
import { FeaturedCarouselV2 } from './sports/FeaturedCarouselV2';
import { MatchListV2 } from './sports/MatchListV2';
import { SporxSidebar } from './SporxSidebar';
import ModernChat from './ModernChat';
import { SporxBetSlip } from './SporxBetSlip';
import { MatchCard } from './sports/MatchCard';
import SportsPromoSlider from './sports/SportsPromoSlider';
import BasketballPromoSlider from './sports/BasketballPromoSlider';
import { TopMatchesWidget } from './sports/TopMatchesWidget';
import SportsIconNav from './sports/SportsIconNav';
import FavoritesEmptyState from './sports/FavoritesEmptyState';
import MyBetsEmptyState from './sports/MyBetsEmptyState';
import { PopularEventsAccordion } from './sports/PopularEventsAccordion';
import { MyBetsView } from './sports/MyBetsView';
import { PlayerLogo, findBestLogoMatch } from './sports/PlayerLogo';

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
const finishedMatchTimes: Record<string, number> = {};

export const parseMatchData = (ev: any, language: string): MatchInfo | null => {
  const data = ev.data || ev;
  if (!data || !data.participants) return null;
  
  const homeTeam = data.participants.home?.name || data.participants.home || ev.home || 'Ev Sahibi';
  const awayTeam = data.participants.away?.name || data.participants.away || ev.away || 'Deplasman';
  
  let score = '-';
  let minute = 'Yakında';
  let isFinished = data.status === 'finished' || data.status === 'ended' || data.status === 'closed';
  let isLive = !!ev.isLive; // Force live if marked by provider, else determine dynamically
  
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
      let timeStr = String(rawStartTime);
      if (timeStr.includes(' ') && !timeStr.includes('T')) {
        timeStr = timeStr.replace(' ', 'T');
      }
      if (!timeStr.endsWith('Z') && !timeStr.includes('+')) {
        timeStr += 'Z';
      }
      const d = new Date(timeStr);
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
  
  const matchId = String(ev.id || data.id || Math.random());
  
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
      
      // Keep finished matches in 'Live' state for 3 minutes (180000 ms)
      if (!finishedMatchTimes[matchId]) {
        finishedMatchTimes[matchId] = Date.now();
      }
      if (Date.now() - finishedMatchTimes[matchId] < 180000) {
        isLive = true;
      }
  } else if (data.status === 'halftime' || data.minute === 'HT') {
      minute = 'DEVRE ARASI';
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
  let awayLogoUrl = data.participants?.ByNumber?.['2']?.LogoPath || '';
  
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
     if (!market || typeof market !== 'string') continue;
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
    timestamp: dateObj ? dateObj.getTime() : 0,
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

  return matchObj;
};

export default function Spor724View({ onNavigate }: Spor724ViewProps) {
  const { language } = useLanguage();
  const { isConnected, events } = useBetting();
  const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null);
  const [activeTab, setActiveTab] = useState('in-play');
  const [navTab, setNavTab] = useState('home');
  const isAuthenticated = typeof window !== 'undefined' ? !!localStorage.getItem('site_member') : false;
  const allSportsTabName = language === 'tr' ? 'Tüm Sporlar' : 'All Sports';
  const [activeSport, setActiveSport] = useState(allSportsTabName);
  const [currentPath, setCurrentPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '');
  
  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const activeSlug = currentPath.startsWith('/spor/') ? currentPath.split('/')[2] : '';

  useEffect(() => {
    if (activeSlug) {
      const sportObj = mockSportsData.find(m => m.slug === activeSlug);
      if (sportObj) {
        setActiveSport(sportObj.sport);
      }
    } else {
      setActiveSport(allSportsTabName);
    }
    
    if (currentPath.includes('/yaklasan')) {
      setViewMode('bulletin');
      setNavTab('upcoming');
    }
  }, [activeSlug, allSportsTabName, currentPath]);
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

    const handleSportsTabChange = (e: any) => {
      const tab = e.detail;
      
      // Always clear selected match when navigating tabs
      setSelectedMatch(null);
      
      if (tab === 'home' || tab === 'hepsi') {
        setActiveTab('in-play');
        setActiveSport(allSportsTabName);
        setViewMode('home');
        setNavTab('home');
      } else if (tab === 'canli') {
        setActiveTab('in-play');
        setActiveSport(allSportsTabName);
        setViewMode('live');
        setNavTab('canli');
      } else if (tab === 'upcoming') {
        setActiveTab('pre-match');
        setActiveSport(allSportsTabName);
        setViewMode('bulletin');
        setNavTab('upcoming');
      } else if (tab === 'mybets') {
        // Bahislerim is handled by right sidebar or another view typically
        setNavTab('mybets');
      } else {
        // Specific sport selected (e.g. 'Futbol')
        setActiveSport(tab);
        if (window.location.pathname.includes('/yaklasan')) {
           setViewMode('bulletin');
        }
      }
    };

    window.addEventListener('openMobileChatPanel', handleOpenMobileChat);
    window.addEventListener('changeSportsTab', handleSportsTabChange);
    return () => {
      window.removeEventListener('openMobileChatPanel', handleOpenMobileChat);
      window.removeEventListener('changeSportsTab', handleSportsTabChange);
    };
  }, [allSportsTabName]);
  
  const { betSlip, addSelection } = useBetSlip();
  
  const [viewMode, setViewMode] = useState<'home' | 'live' | 'bulletin'>('home');

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
          setTimeout(() => {
            setGoalScoredMatches(gPrev => gPrev.filter(id => id !== m.id));
          }, 4000);
        }
        prevScoresRef.current[m.id] = m.score;
      }
    });
  }, [matches, isGoalSoundEnabled]);

  // Goal simulation for visual demonstration removed to prevent state oscillation

  // Single Source of Truth: Listen to WebSocket events (which includes pre-match and live)
  useEffect(() => {
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
    } else {
      setIsLoading(true);
    }
  }, [events, language]);

  const currentMatches = matches;

  const sportsList = Array.from(new Set(currentMatches.map(m => m.sport)));
  const getSportCount = (sport: string) => currentMatches.filter(m => m.sport === sport).length;

  const liveCountsMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    matches.forEach(m => {
      if (m.isLive) {
         map[m.sport] = (map[m.sport] || 0) + 1;
      }
    });
    return map;
  }, [matches]);

  const isAllSportsSelected = activeSport === 'Tüm Sporlar' || activeSport === 'All Sports' || !activeSport;

  const filteredMatches = React.useMemo(() => {
    let result = currentMatches.filter(m => {
      if (viewMode === 'live' && !m.isLive) return false;
      if (viewMode === 'bulletin') {
        if (m.isLive) return false;
        // Hide matches that have already started from the upcoming list
        if (m.timestamp && m.timestamp < Date.now()) return false;
      }
      if (!isAllSportsSelected && m.sport?.toLowerCase() !== activeSport?.toLowerCase()) return false;
      if (activeCountry && m.country !== activeCountry) return false;
      if (viewMode === 'bulletin' && activeDateFilter !== 'all') {
        if (activeDateFilter === 'today' && m.matchDate !== 'Bugün' && m.matchDate !== 'Today') return false;
        if (activeDateFilter === 'tomorrow' && m.matchDate !== 'Yarın' && m.matchDate !== 'Tomorrow') return false;
      }
      return true;
    });

    if (viewMode === 'live' || viewMode === 'bulletin') {
      result = result
        .sort((a, b) => {
          const scoreA = getMatchPriorityScore(a.home, a.away);
          const scoreB = getMatchPriorityScore(b.home, b.away);
          if (scoreA !== scoreB) return scoreB - scoreA;
          return (a.timestamp || 0) - (b.timestamp || 0);
        });
    } else {
      result = result.sort((a, b) => {
        if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
        return (a.timestamp || 0) - (b.timestamp || 0);
      });
    }

    return result;
  }, [currentMatches, viewMode, activeSport, isAllSportsSelected, activeCountry, activeDateFilter]);

  const displaySportsList = isAllSportsSelected
    ? sportsList
    : sportsList.filter(s => s === activeSport);

  // Group by league
  const groupedByLeague = React.useMemo(() => {
    const grouped: Record<string, MatchInfo[]> = {};
    filteredMatches.forEach(match => {
      if (!grouped[match.league]) {
        grouped[match.league] = [];
      }
      grouped[match.league].push(match);
    });
    return grouped;
  }, [filteredMatches]);

  // Sort league groups by priority tiers
  const getLeaguePriority = (leagueName: string) => {
    const name = leagueName.toLowerCase();
    
    // Tier 1: Top Major Leagues and Competitions (Score: 1)
    const tier1Keywords = [
      'şampiyonlar ligi', 'champions league', 'avrupa ligi', 'europa league', 
      'conference ligi', 'konferans ligi', 'süper lig', 'premier league', 
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

  const sortedLeagues = React.useMemo(() => {
    return Object.keys(groupedByLeague).sort((a, b) => {
      let priorityA = getLeaguePriority(a);
      let priorityB = getLeaguePriority(b);
      
      // VIP 50 teams pull their entire league to the absolute top
      const hasEliteA = groupedByLeague[a].some(m => getMatchPriorityScore(m.home, m.away) > 0);
      const hasEliteB = groupedByLeague[b].some(m => getMatchPriorityScore(m.home, m.away) > 0);
      
      if (hasEliteA) priorityA -= 50;
      if (hasEliteB) priorityB -= 50;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // If same tier, sort alphabetically
      return a.localeCompare(b);
    });
  }, [groupedByLeague]);

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
       const eliteA = getMatchPriorityScore(a.home, a.away);
       const eliteB = getMatchPriorityScore(b.home, b.away);
       
       let pA = getLeaguePriority(a.league);
       let pB = getLeaguePriority(b.league);
       
       if (eliteA > 0) pA -= 50;
       if (eliteB > 0) pB -= 50;
       
       if (pA !== pB) return pA - pB;
       return (b.timestamp || 0) - (a.timestamp || 0);
    })
    .slice(0, 6);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen w-full bg-[#0a0c10] text-zinc-300 font-sans overflow-hidden relative">
      
      {/* Premium Luxury Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Mesh Gradients (Soft Lights) */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#3b82f6]/5 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#6366f1]/5 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-[#3b82f6]/5 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 flex flex-row overflow-hidden relative z-10 bg-transparent">
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-transparent">
        
        {/* Container for centering the layout like Rainbet */}
        <div className="max-w-[1200px] mx-auto pb-24 md:pb-12">
            
            {/* Top Icon Navigation (Sticky) */}
            <div className="sticky top-0 z-50 bg-[#0a0c10]/95 backdrop-blur-md shadow-xl border-b border-white/5 flex items-center justify-between mb-4">
                <div className="flex-1 overflow-hidden">
                  <SportsIconNav activeTab={navTab} liveCounts={liveCountsMap} onTabChange={(tab) => {
                    setNavTab(tab);
                    if (tab === 'canli') {
                      setActiveTab('in-play');
                      setViewMode('live');
                    } else if (tab === 'home') {
                      setActiveTab('in-play');
                      setViewMode('home');
                    } else if (tab === 'upcoming') {
                      setActiveTab('pre-match');
                      setViewMode('bulletin');
                    }
                  }} />
                </div>
            </div>

            <div key={selectedMatch ? `match-${selectedMatch.id}` : `tab-${navTab}`} className="animate-fade-in w-full h-full min-h-[400px] transition-all duration-300">
            {selectedMatch ? (
               <div className="px-2 md:px-4">
                 <LiveMatchInline 
                   match={selectedMatch} 
                   onBack={() => setSelectedMatch(null)} 
                   allLiveMatches={matches.filter(m => m.isLive || m.minute)}
                   onSelectAnotherMatch={setSelectedMatch} 
                 />
               </div>
            ) : (
               <>
               
            {/* Tüm görünümlerde (home, live, bulletin) Slider'ları göster */}
            {(viewMode === 'home' || viewMode === 'live' || viewMode === 'bulletin') && (isAllSportsSelected || activeSport === 'Futbol') && (
              <div className="px-4 md:px-6 mb-2 mt-4">
                <SportsPromoSlider matches={filteredMatches} />
              </div>
            )}

            {navTab === 'home' && (
              <div className="px-4 md:px-6 mb-4 transition-all duration-300">
                  
                  {/* En İyi Maçlar Widget Moved Under Slider */}
                  <div className="mt-6 mb-2">
                    <TopMatchesWidget matches={filteredMatches} onSelectMatch={setSelectedMatch} />
                  </div>

                  {/* Popular Events Accordion Moved Here for Home */}
                  {navTab === 'home' && (
                    <div className="mt-4 mb-2">
                      <PopularEventsAccordion matches={filteredMatches} onSelectMatch={setSelectedMatch} />
                    </div>
                  )}
                  
                  {/* Featured Combos Widget */}
                  {viewMode !== 'bulletin' && (
                    <div className="mt-8">
                      <FeaturedCombos activeSport={activeSport} matches={filteredMatches} onSelectMatch={setSelectedMatch} />
                    </div>
                  )}
              </div>
            )}

            {navTab === 'basketball' && (
              <div className="px-4 md:px-6 mb-4 transition-all duration-300">
                  <BasketballPromoSlider matches={filteredMatches.filter(m => m.sport?.toLowerCase().includes('basket') || m.league?.toLowerCase().includes('nba'))} />
                  
                  {/* En İyi Maçlar Widget Moved Under Slider */}
                  <div className="mt-6 mb-2">
                    <TopMatchesWidget matches={filteredMatches.filter(m => m.sport?.toLowerCase().includes('basket') || m.league?.toLowerCase().includes('nba'))} onSelectMatch={setSelectedMatch} />
                  </div>
              </div>
            )}

            {navTab === 'favorites' && !isAuthenticated ? (
              <div className="px-4 md:px-6 mb-4">
                <FavoritesEmptyState />
              </div>
            ) : navTab === 'mybets' ? (
              !isAuthenticated ? (
                <div className="px-4 md:px-6 mb-4">
                  <MyBetsEmptyState />
                </div>
              ) : (
                <div className="flex-1 w-full bg-[#0a0c10]">
                  <MyBetsView />
                </div>
              )
            ) : (
              <>
                {/* En İyi Maçlar Widget moved to under slider */}
                {/* ── CENTRAL FEED ── */}
    
                {/* Featured Matches Carousel (V2) removed per request */}

                {/* Featured Matches Carousel (V2) removed per request */}


            {/* LIVE AND BULLETIN MATCH LIST (Hidden on Home) */}
            {viewMode !== 'home' && (
              <>
                {/* Removed Sports Filter Pills per request */}
                
                {/* Header */}
                <div className="px-4 md:px-6 mb-4 flex items-center gap-2">
                    {viewMode === 'live' ? (
                        <>
                            <Radio className="w-5 h-5 text-[#ef4444]" />
                            <h2 className="text-white text-xl font-black italic tracking-wide uppercase">Canlı</h2>
                        </>
                    ) : (
                        <>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-amber-500"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>
                            <h2 className="text-white text-xl font-bold tracking-wide">Popüler</h2>
                        </>
                    )}
                </div>

                {/* Main Matches Area */}
                <div className="px-4 md:px-6 pb-8">
                    {(() => {
                        const isYaklasan = currentPath.includes('/yaklasan');
                        if (isYaklasan) {
                            return (
                                <div className="flex flex-col gap-3">
                                   {currentMatches
                                     .filter(m => !m.isLive && (m.sport?.toLowerCase().includes('futbol') || m.sport?.toLowerCase().includes('soccer')))
                                     .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
                                     .slice(0, visibleCount)
                                     .map(match => (
                                        <div 
                                          key={match.id} 
                                          onClick={() => setSelectedMatch(match)}
                                          className="bg-[#171b26] p-3 md:p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between border border-transparent hover:border-white/10 hover:bg-[#1c2230] cursor-pointer transition-colors gap-4 shadow-sm"
                                        >
                                          <div className="flex items-center gap-4 min-w-[200px] flex-1">
                                             <div className="flex flex-col items-center justify-center bg-[#10131a] px-3 py-1.5 rounded-lg min-w-[60px] border border-white/5">
                                                <span className="text-[#06b6d4] font-black text-sm">{match.startTime}</span>
                                                <span className="text-zinc-500 text-[10px] uppercase font-bold">{match.matchDate}</span>
                                             </div>
                                             <div className="flex flex-col gap-1.5 text-sm font-semibold text-white">
                                                <div className="flex items-center gap-2">
                                                   <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center p-0.5"><PlayerLogo name={match.home} fallbackLogo={match.homeLogo} /></div>
                                                   <span className="truncate max-w-[150px] md:max-w-[200px]">{match.home}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                   <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center p-0.5"><PlayerLogo name={match.away} fallbackLogo={match.awayLogo} /></div>
                                                   <span className="truncate max-w-[150px] md:max-w-[200px]">{match.away}</span>
                                                </div>
                                             </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-2 flex-1 md:max-w-[400px]">
                                             <button 
                                               onClick={(e) => { 
                                                  e.stopPropagation(); 
                                                  // Logic for AddSelection
                                                  const sel = {
                                                     id: match.homeId || match.id+'_1', matchId: match.id, matchName: `${match.home} vs ${match.away}`,
                                                     selectionName: `Maç Sonucu: 1`, odd: parseFloat(match.homeOdd.replace(',', '.')) || 1
                                                  };
                                                  addSelection(sel);
                                               }}
                                               className="flex-1 bg-[#252b3b] hover:bg-[#2d3548] p-2.5 rounded-lg flex justify-between items-center border border-white/5"
                                             >
                                                <span className="text-[11px] text-zinc-400 font-medium">1</span>
                                                <span className="text-sm font-bold text-white"><AnimatedOdd value={match.homeOdd} /></span>
                                             </button>
                                             <button 
                                               onClick={(e) => { 
                                                  e.stopPropagation(); 
                                                  const sel = {
                                                     id: match.drawId || match.id+'_x', matchId: match.id, matchName: `${match.home} vs ${match.away}`,
                                                     selectionName: `Maç Sonucu: X`, odd: parseFloat(match.drawOdd.replace(',', '.')) || 1
                                                  };
                                                  addSelection(sel);
                                               }}
                                               className="flex-1 bg-[#252b3b] hover:bg-[#2d3548] p-2.5 rounded-lg flex justify-between items-center border border-white/5"
                                             >
                                                <span className="text-[11px] text-zinc-400 font-medium">X</span>
                                                <span className="text-sm font-bold text-white"><AnimatedOdd value={match.drawOdd} /></span>
                                             </button>
                                             <button 
                                               onClick={(e) => { 
                                                  e.stopPropagation(); 
                                                  const sel = {
                                                     id: match.awayId || match.id+'_2', matchId: match.id, matchName: `${match.home} vs ${match.away}`,
                                                     selectionName: `Maç Sonucu: 2`, odd: parseFloat(match.awayOdd.replace(',', '.')) || 1
                                                  };
                                                  addSelection(sel);
                                               }}
                                               className="flex-1 bg-[#252b3b] hover:bg-[#2d3548] p-2.5 rounded-lg flex justify-between items-center border border-white/5"
                                             >
                                                <span className="text-[11px] text-zinc-400 font-medium">2</span>
                                                <span className="text-sm font-bold text-white"><AnimatedOdd value={match.awayOdd} /></span>
                                             </button>
                                          </div>
                                        </div>
                                   ))}
                                   {currentMatches.filter(m => !m.isLive && (m.sport?.toLowerCase().includes('futbol') || m.sport?.toLowerCase().includes('soccer'))).length > visibleCount && (
                                       <button 
                                           onClick={() => setVisibleCount(p => p + 30)}
                                           className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-colors"
                                       >
                                           {language === 'tr' ? 'Daha Fazla Göster' : 'Show More'}
                                       </button>
                                   )}
                                </div>
                            );
                        }
                        return (
                            <>
                                {isLoading && (
                       <div className="text-center py-24 text-zinc-500 text-sm animate-pulse font-medium">
                          {language === 'tr' ? 'Veriler yükleniyor...' : 'Loading data...'}
                       </div>
                    )}
                    
                    {!isLoading && filteredMatches.length === 0 && (
                       <div className="text-center py-24 text-zinc-500 text-sm font-medium flex flex-col items-center justify-center bg-[#18191c] rounded-xl border border-white/5">
                          <div className="w-16 h-16 bg-[#23273a] rounded-full flex items-center justify-center mb-4">
                             <span className="text-2xl">⚽</span>
                          </div>
                          {language === 'tr' ? 'Bu sekmede veya branşta maç bulunamadı.' : 'No matches found in this section.'}
                       </div>
                    )}
                    
                    {!isLoading && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-8">
                                {Object.entries(
                                  filteredMatches.slice(0, visibleCount).reduce((acc, match) => {
                                      const sport = match.sport || 'Diğer';
                                      if (!acc[sport]) acc[sport] = [];
                                      acc[sport].push(match);
                                      return acc;
                                  }, {} as Record<string, typeof matches>)
                                ).map(([sport, sportMatches]) => (
                                    <div key={sport} className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2 px-1 border-b border-white/5 pb-2">
                                            <div className="w-6 h-6 rounded-md bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center">
                                                {getSportIcon(sport)}
                                            </div>
                                            <h3 className="text-white font-bold text-[15px] uppercase tracking-wide">{sport}</h3>
                                            <div className="ml-auto text-xs font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                                                {sportMatches.length}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                            {sportMatches.map(match => (
                                                <MatchCard 
                                                    key={match.id}
                                                    match={match}
                                                    isGoal={false}
                                                    onSelect={setSelectedMatch}
                                                />
                                            ))}
                                        </div>
                                    </div>
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
                    </>
                    );
                    })()}
                </div>
              </>
            )}
              </>
            )}
            </>
        )}
        </div>
        <Footer />
        </div>
      </div>
      </div>
    </div>
  );
};