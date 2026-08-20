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

import { LiveMatchInline } from './sports/LiveMatchInline';
import MatchDetails1xBetView from './sports/MatchDetails1xBetView';
import { useBetSlip } from '../contexts/BetSlipContext';
import { MatchInfo } from './sports/types';
import { PopularLiveWidget } from './PopularLiveWidget';
import { SportsNavV2 } from './sports/SportsNavV2';
import { FeaturedCarouselV2 } from './sports/FeaturedCarouselV2';
import { MatchListV2 } from './sports/MatchListV2';
import { SporxSidebar } from './SporxSidebar';
import ModernChat from './ModernChat';
import { SporxBetSlip } from './SporxBetSlip';
import { MatchCard } from './sports/MatchCard';
import SportsPromoSlider from './sports/SportsPromoSlider';
import SportsDashboardWidget from './sports/SportsDashboardWidget';
import SportsBanners from './SportsBanners';
import BasketballPromoSlider from './sports/BasketballPromoSlider';
import { TopMatchesWidget } from './sports/TopMatchesWidget';
import SportsIconNav from './sports/SportsIconNav';
import FavoritesEmptyState from './sports/FavoritesEmptyState';
import MyBetsEmptyState from './sports/MyBetsEmptyState';
import { PopularEventsAccordion } from './sports/PopularEventsAccordion';
import { MyBetsView } from './sports/MyBetsView';
import { PlayerLogo, findBestLogoMatch } from './sports/PlayerLogo';
import { isSimulatedEvent } from '../utils/simulationUtils';
import Sports1xBetView from './Sports1xBetView';

interface BetSelection {
  id: string;
  matchId: string;
  matchName: string;
  marketName: string;
  selectionName: string;
  odd: number;
}

interface Spor724ViewProps {
  onNavigate: (view: any) => void;
  defaultTab?: string;
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
  if (norm.includes('table tennis') || norm.includes('masa')) return lang === 'tr' ? 'Masa Tenisi' : 'Table Tennis';
  if (norm.includes('tennis') || norm.includes('tenis')) return lang === 'tr' ? 'Tenis' : 'Tennis';
  if (norm.includes('volleyball') || norm.includes('voleybol')) return lang === 'tr' ? 'Voleybol' : 'Volleyball';
  if (norm.includes('hockey')) return lang === 'tr' ? 'Buz Hokeyi' : 'Ice Hockey';
  if (norm.includes('handball')) return lang === 'tr' ? 'Hentbol' : 'Handball';
  return name;
};

const mapReverseSportName = (name: string) => {
  const norm = name.toLowerCase();
  if (norm.includes('am.') || norm.includes('american')) return 'am. football';
  if (norm.includes('futbol') || norm.includes('soccer') || norm.includes('football')) return 'football';
  if (norm.includes('basketbol') || norm.includes('basketball')) return 'basketball';
  if (norm.includes('masa tenisi') || norm.includes('table tennis')) return 'table-tennis';
  if (norm.includes('tenis') || norm.includes('tennis')) return 'tennis';
  if (norm.includes('voleybol') || norm.includes('volleyball')) return 'volleyball';
  if (norm.includes('buz hokeyi') || norm.includes('ice hockey')) return 'ice-hockey';
  if (norm.includes('hentbol') || norm.includes('handball')) return 'handball';
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


const formatLeagueName = (name: string, country: string) => {
  if (!name) return name;
  let cleaned = name;
  const parts = cleaned.split(' - ').map(p => p.trim());
  if (parts.length > 1 && (parts[0] === parts[1] || parts[0] === country)) {
    parts.shift();
  }
  // Remove "(Simulated Reality)" or other long suffixes if needed
  let finalName = parts.join(' - ');
  if (finalName.includes('Simulated')) finalName = 'SRL - ' + finalName.replace(' (Simulated Reality League)', '').replace('Simulated Reality', '');
  return finalName;
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
  
  // Strict enforcement: A not_started match can never be live
  if (data.status === 'not_started' || data.status === 'postponed' || data.status === 'canceled') {
    isLive = false;
  }
  
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
  } else if (data.status === 'halftime' || data.minute === 'HT' || data.match_minute === 'HT') {
      minute = 'DEVRE ARASI';
  } else if (data.match_minute !== undefined || data.minute !== undefined) {
      const minStr = String(data.match_minute ?? data.minute).trim();
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
  const rawLeague = countryName ? `${countryName} - ${tournamentName}` : tournamentName;
  const league = formatLeagueName(rawLeague, countryName);
  let sport = mapSportName(data.sport?.name, language);
  
  if (sport === 'Tenis' || sport === 'Tennis') {
    const l = league.toLowerCase();
    if (l.includes('masters league') || l.includes('tt cup') || l.includes('setka cup') || l.includes('wtt ') || l.includes('liga pro') || l.includes('pro league') || l.includes('artem') || l.includes('table tennis') || l.includes('masa tenisi')) {
        sport = language === 'tr' ? 'Masa Tenisi' : 'Table Tennis';
    }
  }
  
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

  // Allow matches without odds to be parsed and displayed
  if (homeOdd === '-' && ev.odds) {
    if (ev.odds['1']) homeOdd = String(ev.odds['1']);
    if (ev.odds['X']) drawOdd = String(ev.odds['X']);
    if (ev.odds['2']) awayOdd = String(ev.odds['2']);
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
    homeOdd: ev.homeOdd && ev.homeOdd !== '-' ? ev.homeOdd : homeOdd,
    drawOdd: ev.drawOdd && ev.drawOdd !== '-' ? ev.drawOdd : drawOdd,
    awayOdd: ev.awayOdd && ev.awayOdd !== '-' ? ev.awayOdd : awayOdd,
    homeId,
    drawId,
    awayId,
    homeLogo: homeLogoUrl,
    awayLogo: awayLogoUrl,
    marketsCount: data.markets_count || calculateMarketCount(ev),
    rawEvent: ev,
    info: data.info || {},
    stats: ev.stats || data.stats,
  };

  return matchObj;
};
export default function Spor724View({ onNavigate, defaultTab }: Spor724ViewProps) {
  const { language } = useLanguage();
  const { isConnected, events, global1xBetMatches, global1xBetPreMatches } = useBetting();
  const [selectedMatch, setSelectedMatch] = useState<MatchInfo | null>(null);
  
  const handleSetSelectedMatch = (match: MatchInfo | null) => {
    setSelectedMatch(match);
    const rawLang = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'tr';
    const langPrefix = ['tr', 'en', 'pt', 'es'].includes(rawLang) ? rawLang : 'tr';
    if (match && match.id) {
       const newPath = `/${langPrefix}/spor/mac/${match.id}`;
       window.history.pushState(null, '', newPath);
       setCurrentPath(newPath);
    } else {
       let base = '/spor';
       if (navTab === 'canli') base = '/spor/canli';
       else if (navTab === 'upcoming') base = '/spor/yaklasanlar';
       const sportSlug = activeSport !== allSportsTabName ? `/${mapReverseSportName(activeSport)}` : '';
       const newPath = `/${langPrefix}${base}${sportSlug}`;
       window.history.pushState(null, '', newPath);
       setCurrentPath(newPath);
    }
  };
  const [activeTab, setActiveTab] = useState(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/canli')) return 'in-play';
    if (path.includes('/yaklasan')) return 'pre-match';
    return defaultTab || 'in-play';
  });
  const [navTab, setNavTab] = useState(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/canli')) return 'canli';
    if (path.includes('/yaklasan')) return 'upcoming';
    if (path.includes('/hepsi')) return 'all';
    if (path.includes('/takip')) return 'followed';
    if (path.includes('/bahislerim')) return 'mybets';
    return 'home';
  });
  const isAuthenticated = typeof window !== 'undefined' ? !!localStorage.getItem('site_member') : false;
  const allSportsTabName = language === 'tr' ? 'Tüm Sporlar' : 'All Sports';
  const [activeSport, setActiveSport] = useState(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    const parts = path.split('/').filter(p => p);
    let lastPart = '';
    const sIndex = parts.indexOf('spor');
    if (sIndex !== -1) {
      if (parts[sIndex + 1] === 'canli' || parts[sIndex + 1] === 'yaklasanlar') {
         lastPart = parts[sIndex + 2] || '';
      } else {
         lastPart = parts[sIndex + 1] || '';
      }
    }
    const slugMap: Record<string, string> = {
      'football': 'Futbol',
      'futbol': 'Futbol',
      'basketball': 'Basketbol',
      'basketbol': 'Basketbol',
      'tennis': 'Tenis',
      'tenis': 'Tenis',
      'volleyball': 'Voleybol',
      'voleybol': 'Voleybol',
      'baseball': 'Beyzbol',
      'beyzbol': 'Beyzbol',
      'table-tennis': 'Masa Tenisi',
      'masa-tenisi': 'Masa Tenisi',
      'ice-hockey': 'Buz Hokeyi',
      'buz-hokeyi': 'Buz Hokeyi',
      'handball': 'Hentbol',
      'hentbol': 'Hentbol',
      'boxing': 'Boks',
      'boks': 'Boks',
      'cs': 'Counter-Strike'
    };
    if (slugMap[lastPart]) return language === 'en' ? (slugMap[lastPart] === 'Futbol' ? 'Football' : slugMap[lastPart]) : slugMap[lastPart];
    return allSportsTabName;
  });
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [goalScoredMatches, setGoalScoredMatches] = useState<string[]>([]);
  const [goalToast, setGoalToast] = useState<{ match: MatchInfo; oldScore: string; newScore: string } | null>(null);
  const [currentPath, setCurrentPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('sports_favorites');
        return stored ? JSON.parse(stored) : [];
      }
    } catch { return []; }
    return [];
  });

  const handleToggleFavorite = React.useCallback((e: React.MouseEvent, match: any) => {
    e.stopPropagation();
    setFavorites((prev: string[]) => {
      const matchId = String(match.id);
      const isFav = prev.includes(matchId);
      const updated = isFav ? prev.filter(id => id !== matchId) : [...prev, matchId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('sports_favorites', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);
  
  useEffect(() => {
    if (currentPath && matches.length > 0) {
       if (currentPath.includes('/mac/')) {
          const matchId = currentPath.split('/mac/')[1]?.split('/')[0];
          if (matchId) {
             const foundMatch = matches.find(m => String(m.id) === matchId);
             if (foundMatch && (!selectedMatch || String(selectedMatch.id) !== matchId)) {
                setSelectedMatch(foundMatch);
             }
          }
       } else if (selectedMatch) {
          setSelectedMatch(null);
       }
    }
  }, [currentPath, matches, selectedMatch]);
  
  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    const handleResetSportsView = () => {
      handleSetSelectedMatch(null);
      setNavTab('home');
      setActiveTab('in-play');
    };
    
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('reset-sports-view', handleResetSportsView);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('reset-sports-view', handleResetSportsView);
    };
  }, []);

  const pathParts = currentPath.split('/').filter(p => p); // remove empty strings
  // pathParts will be like ['tr', 'spor', 'canli', 'soccer'] or ['spor', 'canli', 'soccer']
  let activeSlug = '';
  
  const sporIndex = pathParts.indexOf('spor');
  if (sporIndex !== -1) {
    if (pathParts[sporIndex + 1] === 'canli' || pathParts[sporIndex + 1] === 'yaklasanlar') {
       activeSlug = pathParts[sporIndex + 2] || '';
    } else {
       activeSlug = pathParts[sporIndex + 1] || '';
    }
  }
  useEffect(() => {
    if (activeSlug) {
      const slugMap: Record<string, string> = {
        soccer: 'Futbol',
        basketball: 'Basketbol',
        tennis: 'Tenis',
        volleyball: 'Voleybol',
        baseball: 'Beyzbol',
        tabletennis: 'Masa Tenisi',
        icehockey: 'Buz Hokeyi'
      };
      setActiveSport(slugMap[activeSlug] || activeSlug);
    } else {
      setActiveSport('Futbol'); // Default to Football
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
  }, []);
  
  useEffect(() => {
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
      
      const rawLang = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || 'tr') : 'tr';
      const lang = ['tr', 'en', 'pt', 'es'].includes(rawLang) ? rawLang : 'tr';
      
      if (tab === 'home' || tab === 'hepsi') {
        window.history.pushState(null, '', `/${lang}/spor`);
        setActiveTab('in-play');
        setActiveSport(allSportsTabName);
        setViewMode('home');
        setNavTab('home');
      } else if (tab === 'canli') {
        window.history.pushState(null, '', `/${lang}/spor/canli`);
        setActiveTab('in-play');
        setActiveSport(allSportsTabName);
        setViewMode('live');
        setNavTab('canli');
      } else if (tab === 'upcoming') {
        window.history.pushState(null, '', `/${lang}/spor/yaklasanlar`);
        setActiveTab('pre-match');
        setActiveSport(allSportsTabName);
        setViewMode('bulletin');
        setNavTab('upcoming');
      } else if (tab === 'mybets') {
        window.history.pushState(null, '', `/${lang}/spor/bahislerim`);
        // Bahislerim is handled by right sidebar or another view typically
        setNavTab('mybets');
      } else if (tab === 'followed') {
        window.history.pushState(null, '', `/${lang}/spor/takip`);
        setNavTab('followed');
      } else {
        // Specific sport selected (e.g. 'Futbol')
        setActiveSport(tab);
        const sportSlug = mapReverseSportName(tab);
        let base = '/spor';
        if (window.location.pathname.includes('/canli')) base = '/spor/canli';
        else if (window.location.pathname.includes('/yaklasan')) base = '/spor/yaklasanlar';
        
        window.history.pushState(null, '', `/${lang}${base}/${sportSlug}`);
        
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
  
  const [viewMode, setViewMode] = useState<'home' | 'live' | 'bulletin'>(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path.includes('/canli')) return 'live';
    if (path.includes('/yaklasan')) return 'bulletin';
    return defaultTab === 'upcoming' ? 'bulletin' : 'home';
  });
  useEffect(() => {
    if (defaultTab === 'upcoming') {
      setNavTab('upcoming');
    }
  }, [defaultTab]);



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
        if (prev && prev !== m.score && prev !== '-') {
          // Goal scored!
          setGoalScoredMatches(gPrev => [...gPrev, m.id]);
          setTimeout(() => {
            setGoalScoredMatches(gPrev => gPrev.filter(id => id !== m.id));
          }, 4000);

          if (favorites.includes(String(m.id))) {
             setGoalToast({ match: m, oldScore: prev, newScore: m.score });
             setTimeout(() => setGoalToast(null), 5000);
          }
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
        const nextMatches = parsedMatches.map(newMatch => {
           const oldMatch = prev.find(m => m.id === newMatch.id);
           if (oldMatch && JSON.stringify(oldMatch) === JSON.stringify(newMatch)) {
               return oldMatch; // Preserve reference
           }
           return newMatch;
        });
        
        // Only update state if array changed length or any reference changed
        const isSame = prev.length === nextMatches.length && prev.every((m, i) => m === nextMatches[i]);
        return isSame ? prev : nextMatches;
      });
      setIsLoading(false);
    } else {
      setMatches([]);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [events, language]);

  const currentMatches = React.useMemo(() => {
    const merged = new Map();
    
    const formatOdd = (val: any) => {
        if (!val || val === '-') return '-';
        const num = parseFloat(val);
        if (isNaN(num)) return val;
        // Truncate/round to max 2 decimal places and remove trailing zeros if any (or keep .xx, user wants 1.67 instead of 1.673)
        return num.toFixed(2).replace(/\.?0+$/, ''); // e.g., 1.504 -> 1.50, replace -> 1.5
    };
    
    const map1xBetToMatchInfo = (m: any) => {
      if (m.home && m.away) {
         return {
            ...m,
            homeOdd: formatOdd(m.homeOdd),
            drawOdd: formatOdd(m.drawOdd),
            awayOdd: formatOdd(m.awayOdd)
         };
      }
      return {
        ...m,
        id: m.id,
        home: m.homeTeam || m.home || '',
        away: m.awayTeam || m.away || '',
        homeId: m.homeTeamId || `h_${m.id}`,
        awayId: m.awayTeamId || `a_${m.id}`,
        drawId: `d_${m.id}`,
        isLive: m.isLive || false,
        isFinished: false,
        score: m.score || '0-0',
        minute: m.minute || m.time || "0'",
        league: m.league || '',
        sport: m.sport || '',
        country: m.country || '',
        homeOdd: formatOdd(m.odds?.['1']),
        drawOdd: formatOdd(m.odds?.['X']),
        awayOdd: formatOdd(m.odds?.['2']),
        homeLogo: '',
        awayLogo: '',
        marketsCount: 48,
        rawEvent: m
      };
    };

    if (global1xBetPreMatches && Array.isArray(global1xBetPreMatches)) {
        global1xBetPreMatches.forEach(m => merged.set(m.id, map1xBetToMatchInfo(m)));
    }
    if (global1xBetMatches && Array.isArray(global1xBetMatches)) {
        global1xBetMatches.forEach(m => merged.set(m.id, map1xBetToMatchInfo(m)));
    }
    if (matches && Array.isArray(matches)) {
        matches.forEach(m => merged.set(m.id, m));
    }
    return Array.from(merged.values());
  }, [matches, global1xBetMatches, global1xBetPreMatches]);

  const sportsList = Array.from(new Set(currentMatches.map(m => m.sport)));
  const getSportCount = (sport: string) => currentMatches.filter(m => m.sport === sport).length;

  const liveCountsMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    // Calculate live matches from global1xBetMatches
    (global1xBetMatches || []).forEach((m: any) => {
      let sName = m.sport || '';
      if (sName.toLowerCase().includes('futbol') || sName.toLowerCase().includes('soccer')) sName = 'Futbol';
      else if (sName.toLowerCase().includes('basket')) sName = 'Basketbol';
      else if ((sName.toLowerCase().includes('tenis') || sName.toLowerCase().includes('tennis')) && !sName.toLowerCase().includes('masa') && !sName.toLowerCase().includes('table')) sName = 'Tenis';
      else if (sName.toLowerCase().includes('voleybol') || sName.toLowerCase().includes('volley')) sName = 'Voleybol';
      else if (sName.toLowerCase().includes('beyzbol') || sName.toLowerCase().includes('base')) sName = 'Beyzbol';
      else if (sName.toLowerCase().includes('buz hokeyi') || sName.toLowerCase().includes('ice hockey')) sName = 'Buz Hokeyi';
      else if (sName.toLowerCase().includes('masa tenisi') || sName.toLowerCase().includes('table tennis')) sName = 'Masa Tenisi';
      else if (sName.toLowerCase().includes('espor') || sName.toLowerCase().includes('e-spor')) sName = 'E-Spor / Simülasyon';
      
      map[sName] = (map[sName] || 0) + 1;
    });
    return map;
  }, [global1xBetMatches]);

  const isAllSportsSelected = activeSport === 'Tüm Sporlar' || activeSport === 'All Sports' || !activeSport;

  const filteredMatches = React.useMemo(() => {
    let result = currentMatches.filter(m => {
      // 1. Kökten filtreleme: Simülasyon/E-Spor ayrıştırması
      const isSimulated = isSimulatedEvent(m);
      
      // Eğer seçili spor "E-Spor / Simülasyon" ise, sadece simülasyonları göster.
      if (activeSport === 'E-Spor / Simülasyon') {
          if (!isSimulated) return false;
      } else {
          // Normal sporlarda isek (Tüm Sporlar, Futbol vs.), simülasyonları tamamen gizle.
          if (isSimulated) return false;
      }

      if (viewMode === 'live' && !m.isLive) return false;
      if (viewMode === 'bulletin') {
        if (m.isLive) return false;
        // Hide matches that have already started from the upcoming list
        if (m.timestamp && m.timestamp < Date.now()) return false;
      }
      if (!isAllSportsSelected) {
         let sName = m.sport || '';
         if (sName.toLowerCase().includes('futbol') || sName.toLowerCase().includes('soccer')) sName = 'Futbol';
         else if (sName.toLowerCase().includes('basket')) sName = 'Basketbol';
         else if ((sName.toLowerCase().includes('tenis') || sName.toLowerCase().includes('tennis')) && !sName.toLowerCase().includes('masa') && !sName.toLowerCase().includes('table')) sName = 'Tenis';
         else if (sName.toLowerCase().includes('voleybol') || sName.toLowerCase().includes('volley')) sName = 'Voleybol';
         else if (sName.toLowerCase().includes('beyzbol') || sName.toLowerCase().includes('base')) sName = 'Beyzbol';
         else if (sName.toLowerCase().includes('buz hokeyi') || sName.toLowerCase().includes('ice hockey')) sName = 'Buz Hokeyi';
         else if (sName.toLowerCase().includes('masa tenisi') || sName.toLowerCase().includes('table tennis')) sName = 'Masa Tenisi';
         
         if (sName.toLowerCase() !== activeSport?.toLowerCase()) return false;
      }
      if (activeCountry && m.country !== activeCountry) return false;
      if (viewMode === 'bulletin' && activeDateFilter !== 'all') {
        if (activeDateFilter === 'today' && m.matchDate !== 'Bugün' && m.matchDate !== 'Today') return false;
        if (activeDateFilter === 'tomorrow' && m.matchDate !== 'Yarın' && m.matchDate !== 'Tomorrow') return false;
      }
      return true;
      return true;
    });

    if (viewMode === 'live') {

      result = result
        .sort((a, b) => {
          const getSportPriority = (s: string) => {
              const ls = (s || '').toLowerCase();
              if (ls.includes('futbol') || ls.includes('soccer')) return 1;
              if (ls.includes('basket')) return 2;
              if (ls.includes('tenis') || ls.includes('tennis')) return 3;
              if (ls.includes('voleybol') || ls.includes('volley')) return 4;
              return 5;
          };
          const pA = getSportPriority(a.sport);
          const pB = getSportPriority(b.sport);
          if (pA !== pB) return pA - pB;

          const scoreA = getMatchPriorityScore(a.home, a.away);
          const scoreB = getMatchPriorityScore(b.home, b.away);
          
          // Demote women/youth even if they are in a good league
          const isLowerA = (a.home || '').includes('Kadınlar') || (a.home || '').includes('U19') || (a.league || '').includes('Kadınlar');
          const isLowerB = (b.home || '').includes('Kadınlar') || (b.home || '').includes('U19') || (b.league || '').includes('Kadınlar');
          
          let finalScoreA = scoreA;
          let finalScoreB = scoreB;
          
          if (isLowerA && scoreA === 0) finalScoreA -= 20;
          if (isLowerB && scoreB === 0) finalScoreB -= 20;
          
          if (finalScoreA !== finalScoreB) return finalScoreB - finalScoreA;
          if (scoreA !== scoreB) return scoreB - scoreA;
          return (a.timestamp || 0) - (b.timestamp || 0);
        });
    } else if (viewMode === 'bulletin') {
      result = result.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
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
      const leagueKey = match.league || 'Diğer';
      if (!grouped[leagueKey]) {
        grouped[leagueKey] = [];
      }
      let groupKey = leagueKey;
      const isElite = getMatchPriorityScore(match.home, match.away) > 0;
      const isWomen = (match.home || '').includes('Kadınlar') || (leagueKey).includes('Kadınlar');
      
      // Break out massive generic leagues
      if (groupKey.includes('Kulüp Hazırlık') || groupKey.includes('Club Friendly')) {
         if (isElite) groupKey = '⭐ Öne Çıkan Hazırlık Maçları';
         else if (isWomen) groupKey = 'Kulüp Hazırlık Maçları (Kadınlar)';
         else groupKey = 'Diğer Hazırlık Maçları';
      }
      
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(match);
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

  const getSportColor = (sport: string | null) => {
    if (!sport || sport === 'Tüm Sporlar' || sport === 'All Sports') return { accent: '#06b6d4', glow: 'rgba(6,182,212,0.5)' }; // Default Cyan
    const s = sport.toLowerCase();
    if (s.includes('futbol') || s.includes('soccer')) return { accent: '#10b981', glow: 'rgba(16,185,129,0.5)' }; // Emerald Green
    if (s.includes('basket')) return { accent: '#f97316', glow: 'rgba(249,115,22,0.5)' }; // Orange
    if (s.includes('tenis') && !s.includes('masa')) return { accent: '#eab308', glow: 'rgba(234,179,8,0.5)' }; // Yellow
    if (s.includes('beyzbol')) return { accent: '#ef4444', glow: 'rgba(239,68,68,0.5)' }; // Red
    if (s.includes('espor') || s.includes('e-spor')) return { accent: '#d946ef', glow: 'rgba(217,70,239,0.5)' }; // Fuchsia
    if (s.includes('masa tenisi')) return { accent: '#0ea5e9', glow: 'rgba(14,165,233,0.5)' }; // Sky Blue
    if (s.includes('voleybol')) return { accent: '#8b5cf6', glow: 'rgba(139,92,246,0.5)' }; // Violet
    if (s.includes('buz hokeyi')) return { accent: '#38bdf8', glow: 'rgba(56,189,248,0.5)' }; // Light Blue
    if (s.includes('kriket')) return { accent: '#84cc16', glow: 'rgba(132,204,22,0.5)' }; // Lime
    if (s.includes('ragbi')) return { accent: '#a8a29e', glow: 'rgba(168,162,158,0.5)' }; // Stone/Brown
    
    return { accent: '#06b6d4', glow: 'rgba(6,182,212,0.5)' }; // Default Cyan
  };

  const isEsportsMode = activeSport === 'E-Spor / Simülasyon';
  const esportsTheme = isEsportsMode ? 'border-[#A855F7]/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : '';
  const esportsText = isEsportsMode ? 'text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : '';

  const currentColors = getSportColor(activeSport);
  const dynamicStyle = {
    '--theme-accent': currentColors.accent,
    '--theme-accent-glow': currentColors.glow,
  } as React.CSSProperties;

  return (
    <div style={dynamicStyle} className={`flex flex-col h-[calc(100vh-64px)] md:h-screen w-full bg-[#000000] text-zinc-300 font-sans overflow-hidden relative transition-colors duration-700 ${isEsportsMode ? 'theme-esports' : ''}`}>
      
      {/* Premium Luxury Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        {/* Mesh Gradients (Soft Lights) */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[color:var(--theme-accent)]/10 blur-[120px] rounded-full mix-blend-screen transition-colors duration-1000"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[color:var(--theme-accent)]/[0.07] blur-[150px] rounded-full mix-blend-screen transition-colors duration-1000"></div>
        
        {activeSport === 'Tenis' || activeSport === 'Tennis' ? (
          <>
             {/* Subtle Tennis Court Lines Background */}
             <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,transparent_49.5%,#10b981_49.5%,#10b981_50.5%,transparent_50.5%),linear-gradient(to_bottom,transparent_10%,#10b981_10%,#10b981_11%,transparent_11%,transparent_89%,#10b981_89%,#10b981_90%,transparent_90%)] pointer-events-none"></div>
          </>
        ) : null}
      </div>

      {/* Main Content Scrollable Area */}
      <div className="flex-1 flex flex-row overflow-hidden relative z-10 bg-transparent">
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-transparent">
        
        {/* Container for centering the layout like Rainbet */}
        <div className="max-w-[1200px] mx-auto pb-24 md:pb-12">
            
            {/* Top Icon Navigation (Sticky) */}
            <div className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-md shadow-xl flex items-center justify-between mb-4 border-b border-white/[0.05]">
                <div className="flex-1 overflow-hidden">
                  <SportsIconNav activeTab={navTab} liveCounts={liveCountsMap} onTabChange={(tab) => {
                    handleSetSelectedMatch(null); // HERHANGİ BİR SEKMEYE TIKLANDIĞINDA MAÇIN İÇİNDEN ÇIK!
                    setNavTab(tab);
                    window.dispatchEvent(new CustomEvent('syncSportsMenu', { detail: tab }));
                    
                    const rawLang = typeof window !== 'undefined' ? (window.location.pathname.split('/')[1] || 'tr') : 'tr';
                    const lang = ['tr', 'en', 'pt', 'es'].includes(rawLang) ? rawLang : 'tr';
                    
                    if (tab === 'canli') {
                      window.history.pushState(null, '', `/${lang}/spor/canli`);
                      setActiveTab('in-play');
                      setViewMode('live');
                      setCurrentPath(`/${lang}/spor/canli`);
                    } else if (tab === 'home') {
                      window.history.pushState(null, '', `/${lang}/spor`);
                      setActiveTab('in-play');
                      setViewMode('home');
                      setCurrentPath(`/${lang}/spor`);
                    } else if (tab === 'upcoming') {
                      window.history.pushState(null, '', `/${lang}/spor/yaklasanlar`);
                      setActiveTab('pre-match');
                      setViewMode('bulletin');
                      setCurrentPath(`/${lang}/spor/yaklasanlar`);
                    } else if (tab === 'mybets') {
                      window.history.pushState(null, '', `/${lang}/spor/bahislerim`);
                      setActiveTab('in-play');
                    } else if (tab === 'all') {
                      window.history.pushState(null, '', `/${lang}/spor/hepsi`);
                    } else if (tab === 'followed') {
                      window.history.pushState(null, '', `/${lang}/spor/takip`);
                    }
                  }} />
                </div>
            </div>

            <div key={selectedMatch ? `match-${selectedMatch.id}` : `tab-${navTab}`} className="animate-fade-in w-full h-full min-h-[400px] transition-all duration-300">
            {selectedMatch ? (
               <div className="px-2 md:px-4">
                 {/* Breadcrumb / Back Button */}
                 <div className="flex items-center gap-2 mb-4 px-2 py-2 bg-black/40 backdrop-blur-md rounded-lg border border-white/5 shadow-sm">
                   <button 
                     onClick={() => handleSetSelectedMatch(null)}
                     className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-sm font-bold tracking-wide cursor-pointer"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                     Bültene Dön
                   </button>
                   <div className="w-[1px] h-4 bg-white/20 mx-2"></div>
                   <div className="flex items-center gap-2 text-zinc-300 text-sm font-semibold truncate">
                     <span className="text-[color:var(--theme-accent)]">{selectedMatch.league}</span>
                     <span className="text-zinc-600">|</span>
                      <span className="truncate">{selectedMatch.home || selectedMatch.homeTeam || selectedMatch.O1 || 'Ev Sahibi'} vs {selectedMatch.away || selectedMatch.awayTeam || selectedMatch.O2 || 'Deplasman'}</span>
                   </div>
                 </div>
                 
                 <MatchDetails1xBetView 
                   match={selectedMatch} 
                   onBack={() => handleSetSelectedMatch(null)} 
                 />
               </div>
            ) : (
               <>
               
            {/* Slider'ları SADECE Ana Sayfada (home) göster */}
            {navTab === 'home' && (isAllSportsSelected || activeSport === 'Futbol') && (
              <>
                <div className="px-4 md:px-6 mb-6 mt-6">
                  <SportsPromoSlider matches={currentMatches} />
                </div>
                
                <div className="px-4 md:px-6 mb-6 mt-4">
                  <SportsDashboardWidget matches={filteredMatches} onSelectMatch={handleSetSelectedMatch} />
                </div>
              </>
            )}

            {navTab === 'home' && (
              <div className="px-4 md:px-6 mb-4 transition-all duration-300">
                  
                  {/* Featured Combos Widget Removed */}
                  {viewMode !== 'bulletin' && (
                    <div className="mt-8">
                      <div className="mt-6 w-full">
                        <SportsBanners />
                      </div>
                    </div>
                  )}
              </div>
            )}

            {navTab === 'basketball' && (
              <div className="px-4 md:px-6 mb-4 transition-all duration-300">
                  <BasketballPromoSlider matches={filteredMatches.filter(m => (m.sport || '').toLowerCase().includes('basket') || (m.league || '').toLowerCase().includes('nba'))} />
                  
                  {/* En İyi Maçlar Widget Moved Under Slider */}
                  <div className="mt-6 mb-2">
                    <TopMatchesWidget matches={filteredMatches.filter(m => (m.sport || '').toLowerCase().includes('basket') || (m.league || '').toLowerCase().includes('nba'))} onSelectMatch={handleSetSelectedMatch} sortByTime={viewMode === 'bulletin'} />
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
                  <MyBetsView onSelectMatch={handleSetSelectedMatch} />
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
                {viewMode === 'live' ? (
                  <div className="px-0 md:px-2 w-full mt-2">
                    <Sports1xBetView activeSport={activeSport} onSelectMatch={handleSetSelectedMatch} />
                  </div>
                ) : (
                  <>
                {/* Header for non-live modes */}
                <div className="px-4 md:px-6 mb-4 flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-300"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>
                    <h2 className="text-white text-xl font-bold tracking-wide">Popüler</h2>
                </div>

                {/* Main Matches Area */}
                <div className="px-4 md:px-6 pb-8">
                    {(() => {
                        const isYaklasan = viewMode === 'bulletin';
                        if (isYaklasan) {
                            return (
                                <div className="px-0 md:px-2 w-full mt-2">
                                  <Sports1xBetView feedType="prematch" activeSport={activeSport} onSelectMatch={handleSetSelectedMatch} />
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
                       <div className="text-center py-24 text-zinc-400 text-sm font-medium flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] to-[#000000] rounded-xl border border-white/5 shadow-inner">
                          <div className="w-20 h-20 bg-[#111111]/50 rounded-full flex items-center justify-center mb-5 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                             </svg>
                          </div>
                          <span className="text-lg font-semibold text-white/80 mb-1">
                             {language === 'tr' ? 'Karşılaşma Bulunamadı' : 'No Matches Found'}
                          </span>
                          <span className="text-zinc-500">
                             {language === 'tr' ? 'Şu an bu kategoride canlı maç bulunmamaktadır.' : 'There are currently no live matches in this category.'}
                          </span>
                       </div>
                    )}
                    
                    {!isLoading && (
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-8">
                                {favorites.length > 0 && filteredMatches.filter(m => favorites.includes(String(m.id))).length > 0 && (
                                    <div className="flex flex-col gap-3 mb-8">
                                        <div className="flex items-center gap-2 px-1 pb-2">
                                            <div className="w-6 h-6 rounded-md bg-[#f2a900]/10 text-[#f2a900] flex items-center justify-center">
                                                <Star size={14} className="fill-[#f2a900]" />
                                            </div>
                                            <h3 className="text-[#f2a900] font-bold text-[15px] uppercase tracking-wide">Favorilerim</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                            {filteredMatches.filter(m => favorites.includes(String(m.id))).map(match => (
                                                <MatchCard 
                                                    key={match.id}
                                                    match={match}
                                                    isGoal={goalScoredMatches.includes(String(match.id))}
                                                    isFavorite={true}
                                                    onToggleFavorite={handleToggleFavorite}
                                                    onSelect={handleSetSelectedMatch}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {Object.entries(
                                  filteredMatches.slice(0, visibleCount).reduce((acc, match) => {
                                      const sport = match.sport || 'Diğer';
                                      if (!acc[sport]) acc[sport] = [];
                                      acc[sport].push(match);
                                      return acc;
                                  }, {} as Record<string, typeof matches>)
                                ).sort((a, b) => {
                                    const getPriority = (s: string) => {
                                        const ls = s.toLowerCase();
                                        if (ls.includes('futbol') || ls.includes('soccer')) return 1;
                                        if (ls.includes('basket')) return 2;
                                        if (ls.includes('tenis') || ls.includes('tennis')) return 3;
                                        if (ls.includes('voleybol') || ls.includes('volley')) return 4;
                                        return 5;
                                    };
                                    return getPriority(a[0]) - getPriority(b[0]);
                                }).map(([sport, sportMatches]) => {
                                    const totalCount = filteredMatches.filter(m => (m.sport || 'Diğer') === sport).length;
                                    const nonFavSportMatches = sportMatches.filter(m => !favorites.includes(String(m.id)));
                                    if (nonFavSportMatches.length === 0) return null;
                                    return (
                                        <div key={sport} className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2 px-1 pb-2">
                                                <div className="w-6 h-6 rounded-md bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center">
                                                    {getSportIcon(sport)}
                                                </div>
                                                <h3 className="text-white font-bold text-[15px] uppercase tracking-wide">{sport}</h3>
                                                <div className="ml-auto text-xs font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">
                                                    {totalCount}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                                {nonFavSportMatches.map(match => (
                                                    <MatchCard 
                                                        key={match.id}
                                                        match={match}
                                                        isGoal={goalScoredMatches.includes(String(match.id))}
                                                        isFavorite={false}
                                                        onToggleFavorite={handleToggleFavorite}
                                                        onSelect={handleSetSelectedMatch}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
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
              </>
            )}
        </div>
        <Footer />
        </div>
      </div>
      
      {/* Goal Toast Notification */}
      {goalToast && (
        <div className="fixed top-20 right-4 z-[9999] bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-4 rounded-xl shadow-[0_10px_40px_rgba(16,185,129,0.5)] flex items-center gap-4 animate-slide-in-right border border-emerald-400/30 overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer"></div>
           <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center relative shrink-0">
             <span className="text-2xl animate-bounce">⚽</span>
           </div>
           <div className="flex flex-col relative">
             <span className="text-[10px] font-black tracking-widest text-emerald-200 uppercase">GOOOL!</span>
             <span className="font-bold text-sm truncate max-w-[200px]">{goalToast.match.home} - {goalToast.match.away}</span>
             <div className="flex items-center gap-2 mt-1">
                <span className="text-white/60 line-through text-xs">{goalToast.oldScore}</span>
                <span className="font-black text-lg text-emerald-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">{goalToast.newScore}</span>
             </div>
           </div>
        </div>
      )}
      
      </div>
    </div>
  );
};