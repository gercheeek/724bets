import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TVConfig, TVChannel, TVChatMessage, Streamer, VOD, Gift } from '../types';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import { DEFAULT_TV_CONFIG } from '../constants';
import {
    Send, Users, MessageSquare, Tv, Zap, Crown, Star, Shield, X, Lock, Unlock, Search,
    Flame, Award, Play, Pause, Volume2, VolumeX, Maximize, Minimize2,
    ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Radio, Trophy, Calendar, TrendingUp, ArrowRight,
    Bell, BellOff, Gift as GiftIcon, CheckCircle, AlertCircle, BarChart2,
} from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';
import SportsPromoSlider from './sports/SportsPromoSlider';
import { TopMatchesWidget } from './sports/TopMatchesWidget';

import { useLanguage } from '../contexts/LanguageContext';
import { parseMatchData } from './Spor724View';
import { MatchInfo } from './sports/types';
import Hls from 'hls.js';

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const HERO_SLIDES = [
    { id: 'live', tag: 'CANLI YAYIN', tagColor: '#10b981', title: 'TÜRKİYE\'NİN İLK KUMAR TV\'Sİ', subtitle: '7/24 Canlı Bahis & Spor Analizi', cta: 'YAYINI İZLE', ctaColor: '#10b981', bg: 'linear-gradient(135deg, #051a10 0%, #0a2e1d 40%, #04120a 100%)', accent: '#10b981', emoji: '📺', imageUrl: null },
    { id: 'tournament', tag: 'BÜYÜK TURNUVA', tagColor: '#06b6d4', title: '₺500.000 ÖDÜL HAVUZU', subtitle: 'Özel Turnuvaya Katıl — Her Cuma Çekiliş', cta: 'HEMEN KATIL', ctaColor: '#06b6d4', bg: 'linear-gradient(135deg, #0a0800 0%, #1a1000 40%, #0d0a00 100%)', accent: '#06b6d4', emoji: '🏆', imageUrl: null },
];



const FLASH_EVENTS = [
    { type: 'bonus', icon: '🎰', title: 'BONUS KODU!', description: 'Bu yayına özel anlık bonus!', code: 'TV724BONUS', reward: '%100 İlk Yatırım Bonusu', color: '#06b6d4', duration: 60 },
    { type: 'quiz', icon: '⚡', title: 'FLASH QUIZ!', description: 'Bu yarı kaç gol atılacak?', options: ['0-1 GOL', '2-3 GOL', '4+ GOL'], reward: '200 Coin Kazan!', color: '#00D4FF', duration: 30 },
    { type: 'spin', icon: '🎡', title: 'ŞANS ÇEVİRMECESİ!', description: 'Çarkı çevir, bedava bahis kazan!', reward: 'Bedava Bahis Hakkı', color: '#ADFF2F', duration: 45 },
];

// ─── MATCHES DATA ────────────────────────────────────────────────────────────
const MATCHES_DATA = [
  { date: '30 Haz 2026', items: [{ teams: 'Fildişi Sahili - Norveç', time: '20:00' }] },
  { date: '1 Tem 2026', items: [
      { teams: 'Fransa - İsveç', time: '00:00' },
      { teams: 'Meksika - Ekvador', time: '04:00' },
      { teams: 'İngiltere - DR Kongo', time: '19:00' },
      { teams: 'Belçika - Senegal', time: '23:00' }
    ]
  },
  { date: '2 Tem 2026', items: [
      { teams: 'Amerika Birleşik Devletleri - Bosna-Hersek', time: '03:00' },
      { teams: 'İspanya - Avusturya', time: '22:00' }
    ]
  },
  { date: '3 Tem 2026', items: [
      { teams: 'Portekiz - Hırvatistan', time: '02:00' },
      { teams: 'İsviçre - Cezayir', time: '06:00' },
      { teams: 'Avustralya - Mısır', time: '21:00' }
    ]
  },
  { date: '4 Tem 2026', items: [
      { teams: 'Arjantin - Cape Verde', time: '01:00' },
      { teams: 'Kolombiya - Gana', time: '04:30' },
      { teams: 'Kanada - Fas', time: '20:00' }
    ]
  }
];

const getChannelLogo = (channelName: string, avatarUrl?: string) => {
    if (avatarUrl && avatarUrl.trim()) return avatarUrl;
    const nameLower = channelName.toLowerCase();
    
    // Check known channel names FIRST to always show proper logos using High-Res PNGs
    if (nameLower.includes('724tv') || nameLower.includes('7/24')) return 'https://img.icons8.com/color/96/television.png';
    if (nameLower.includes('bein') || nameLower.includes('lig tv')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/BeIN_Sports_logo_%28horizontal_version%29.svg/512px-BeIN_Sports_logo_%28horizontal_version%29.svg.png';
    if (nameLower.includes('s sport') || nameLower.includes('ssport')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/SSport_logo.png/512px-SSport_logo.png';
    if (nameLower.includes('smart')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Smart_Spor_logo.png/512px-Smart_Spor_logo.png';
    if (nameLower.includes('tivibu')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Tivibu_Spor_logo.svg/512px-Tivibu_Spor_logo.svg.png';
    if (nameLower.includes('trt')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/TRT_Spor_logo.svg/512px-TRT_Spor_logo.svg.png';
    if (nameLower.includes('a spor')) return 'https://upload.wikimedia.org/wikipedia/tr/b/bf/A_spor_logo.png';
    if (nameLower.includes('exxen') || nameLower.includes('dijital') || nameLower.includes('platform')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Exxen_Logo.svg/512px-Exxen_Logo.svg.png';
    if (nameLower.includes('eurosport') || nameLower.includes('euro sport')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Eurosport_logo.svg/512px-Eurosport_logo.svg.png';
    if (nameLower.includes('tv8')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/TV8_logo.svg/512px-TV8_logo.svg.png';
    if (nameLower.includes('mac') || nameLower.includes('maç') || nameLower.includes('futbol') || nameLower.includes('taraftar')) return 'https://img.icons8.com/color/96/football.png';
    if (nameLower.includes('ulusal')) return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/TRT_1_logo.svg/512px-TRT_1_logo.svg.png';
    if (nameLower.includes('diğer') || nameLower.includes('diger')) return 'https://img.icons8.com/color/96/tv.png';
    
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=1a2035&color=fff&size=128&rounded=true&bold=true`;
};

// ─── STREAMER STATS HELPER ────────────────────────────────────────────────────
const getStreamerStats = (streamer: Streamer) => {
    const name = streamer.name || '';
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const getStat = (offset: number, min = 70, max = 95) => Math.abs((hash + offset) % (max - min + 1)) + min;
    const isVip = streamer.is_vip; const isLive = streamer.is_live;
    return {
        rating: isVip ? 99 : (isLive ? 92 : 85),
        izl: Math.min(99, getStat(1, isVip ? 90 : 75, 98) + (isLive ? 3 : 0)),
        etk: Math.min(99, getStat(2, isVip ? 92 : 78, 99) + (isLive ? 2 : 0)),
        cos: Math.min(99, getStat(3, isVip ? 95 : 80, 99) + (isLive ? 4 : 0)),
        bet: Math.min(99, getStat(4, isVip ? 94 : 75, 99)),
        slt: Math.min(99, getStat(5, isVip ? 91 : 70, 98)),
        yay: Math.min(99, getStat(6, isVip ? 96 : 80, 99)),
    };
};

const CHANNEL_GROUP_ORDER = [
    '⚽ beIN SPORTS',
    '🏅 S SPORT',
    '🎯 SMART SPOR',
    '🏀 TİVİBU SPOR',
    '🌍 EUROSPORT',
    '🎥 DİJİTAL PLATFORMLAR',
    '📺 ULUSAL KANALLAR',
    '📺 DİĞER KANALLAR'
];

const getChannelGroup = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('bein') || n.includes('lig tv')) return '⚽ beIN SPORTS';
    if (n.includes('s sport') || n.includes('ssport')) return '🏅 S SPORT';
    if (n.includes('smart')) return '🎯 SMART SPOR';
    if (n.includes('tivibu')) return '🏀 TİVİBU SPOR';
    if (n.includes('euro sport') || n.includes('eurosport')) return '🌍 EUROSPORT';
    if (n.includes('tabii') || n.includes('exxen')) return '🎥 DİJİTAL PLATFORMLAR';
    if (n.includes('trt') || n.includes('a spor') || n.includes('atv') || n.includes('tv 8')) return '📺 ULUSAL KANALLAR';
    return '📺 DİĞER KANALLAR';
};

const FLAG_CODES: Record<string, string> = {
  'Kanada': 'ca', 'Katar': 'qa', 'Meksika': 'mx', 'Güney Kore': 'kr',
  'Amerika Birleşik Devletleri': 'us', 'Avustralya': 'au', 'İskoçya': 'gb-sct',
  'Fas': 'ma', 'Brezilya': 'br', 'Haiti': 'ht', 'Türkiye': 'tr',
  'Paraguay': 'py', 'Hollanda': 'nl', 'İsveç': 'se', 'Almanya': 'de',
  'Fildişi Sahili': 'ci', 'Ekvador': 'ec', 'Curacao': 'cw', 'Tunus': 'tn',
  'Japonya': 'jp', 'İspanya': 'es', 'Suudi Arabistan': 'sa', 'Belçika': 'be',
  'İran': 'ir', 'Uruguay': 'uy', 'Cape Verde': 'cv', 'Yeni Zelanda': 'nz',
  'Mısır': 'eg', 'Arjantin': 'ar', 'Avusturya': 'at', 'Fransa': 'fr',
  'Irak': 'iq', 'Norveç': 'no', 'Senegal': 'sn', 'Ürdün': 'jo',
  'Cezayir': 'dz', 'Portekiz': 'pt', 'Özbekistan': 'uz', 'İngiltere': 'gb-eng',
  'Gana': 'gh', 'Panama': 'pa', 'Hırvatistan': 'hr', 'Kolombiya': 'co',
  'DR Kongo': 'cd', 'Demokratik Kongo': 'cd', 'Bosna-Hersek': 'ba', 'İsviçre': 'ch', 'Çekya': 'cz',
  'Güney Afrika': 'za'
};

const getFlagUrl = (country: string) => {
  const code = FLAG_CODES[country];
  return code ? `https://flagcdn.com/w80/${code}.png` : '';
};

const parseTeamFlagAndName = (teamName: string) => {
  if (!teamName) return { name: '', flag: '' };
  const flagMatch = teamName.match(/^([\uD83C-\uDBFF\uDC00-\uDFFF\u2000-\u3300]+)\s*(.+)$/);
  if (flagMatch) {
    return { flag: flagMatch[1].trim(), name: flagMatch[2].trim() };
  }
  return { name: teamName.trim(), flag: '' };
};

const MatchCountdown: React.FC<{ dateStr: string; timeStr: string }> = ({ dateStr, timeStr }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    const target = new Date(`${dateStr}T${timeStr}:00+03:00`);
    const update = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setText('CANLI');
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      if (days > 0) {
        setText(`${days}g ${hours}s ${mins}d`);
      } else if (hours > 0) {
        setText(`${hours}s ${mins}d ${secs}sn`);
      } else {
        setText(`${mins}d ${secs}sn`);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [dateStr, timeStr]);

  if (text === 'CANLI') {
    return <span className="font-black" style={{ color: '#00E676', animation: 'pulse 1.5s infinite' }}>CANLI</span>;
  }

  return <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#f2a900' }}>{text}</span>;
};

// ─── SKELETON COMPONENT ───────────────────────────────────────────────────────
const Skeleton: React.FC<{ width?: string | number; height?: string | number; borderRadius?: string; style?: React.CSSProperties }> = ({ width = '100%', height = '16px', borderRadius = '6px', style }) => (
    <div style={{ width, height, borderRadius, background: 'linear-gradient(90deg, #111116 25%, #1a1a24 50%, #111116 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s ease-in-out infinite', flexShrink: 0, ...style }} />
);

// ─── INTERFACES ───────────────────────────────────────────────────────────────
const isScheduleMatchPlayed = (dateStr: string, timeStr: string, currentTime: Date) => {
    const months: Record<string, number> = {
        'haz': 5,
        'tem': 6
    };
    const parts = dateStr.toLowerCase().split(' ');
    if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const monthShort = parts[1];
        const year = parseInt(parts[2], 10);
        const month = months[monthShort];
        if (month !== undefined) {
            const monthPad = String(month + 1).padStart(2, '0');
            const dayPad = String(day).padStart(2, '0');
            const isoStr = `${year}-${monthPad}-${dayPad}T${timeStr}:00+03:00`;
            const targetTime = new Date(isoStr).getTime();
            const matchEnd = targetTime + 150 * 60 * 1000;
            return currentTime.getTime() > matchEnd;
        }
    }
    return false;
};

interface TV724ViewProps {
    config: TVConfig;
    siteUser: any;
    userRole: string | null;
    onBack: () => void;
    onLoginRequired?: () => void;
    activeView?: string;
}
interface FloatingEmoji { id: number; emoji: string; style: React.CSSProperties; }

const getGroupConfig = (groupName: string) => {
    const clean = groupName.replace(/^[^\s]+\s+/, '').toUpperCase();
    if (clean.includes('BEIN')) {
        return {
            color: '#ff7a00',
            glow: 'rgba(255, 122, 0, 0.15)',
            gradient: 'linear-gradient(135deg, rgba(255, 122, 0, 0.25) 0%, rgba(255, 122, 0, 0.08) 100%)',
            icon: <Tv style={{ width: 14, height: 14, color: '#ff7a00' }} />
        };
    }
    if (clean.includes('S SPORT')) {
        return {
            color: '#ef4444',
            glow: 'rgba(239, 68, 68, 0.15)',
            gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.08) 100%)',
            icon: <Trophy style={{ width: 14, height: 14, color: '#ef4444' }} />
        };
    }
    if (clean.includes('SMART SPOR')) {
        return {
            color: '#06b6d4',
            glow: 'rgba(6, 182, 212, 0.15)',
            gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.08) 100%)',
            icon: <Zap style={{ width: 14, height: 14, color: '#06b6d4' }} />
        };
    }
    if (clean.includes('TİVİBU')) {
        return {
            color: '#eab308',
            glow: 'rgba(234, 179, 8, 0.15)',
            gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(234, 179, 8, 0.08) 100%)',
            icon: <Award style={{ width: 14, height: 14, color: '#eab308' }} />
        };
    }
    if (clean.includes('EUROSPORT')) {
        return {
            color: '#3b82f6',
            glow: 'rgba(59, 130, 246, 0.15)',
            gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.08) 100%)',
            icon: <Radio style={{ width: 14, height: 14, color: '#3b82f6' }} />
        };
    }
    if (clean.includes('DİJİTAL')) {
        return {
            color: '#a855f7',
            glow: 'rgba(168, 85, 247, 0.15)',
            gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0.08) 100%)',
            icon: <Crown style={{ width: 14, height: 14, color: '#a855f7' }} />
        };
    }
    if (clean.includes('ULUSAL')) {
        return {
            color: '#10b981',
            glow: 'rgba(16, 185, 129, 0.15)',
            gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.08) 100%)',
            icon: <Star style={{ width: 14, height: 14, color: '#10b981' }} />
        };
    }
    return {
        color: '#9ca3af',
        glow: 'rgba(156, 163, 175, 0.15)',
        gradient: 'linear-gradient(135deg, rgba(156, 163, 175, 0.25) 0%, rgba(156, 163, 175, 0.08) 100%)',
        icon: <Tv style={{ width: 14, height: 14, color: '#9ca3af' }} />
    };
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TV724View: React.FC<TV724ViewProps> = ({ config, siteUser, userRole, onBack, onLoginRequired, activeView = '724tv' }) => {
    // ── Core state ──
    const { events } = useBetting();
    const { language } = useLanguage();
    
    const matches = React.useMemo(() => {
        if (!events) return [];
        return events.map(ev => parseMatchData(ev, language)).filter(Boolean) as MatchInfo[];
    }, [events, language]);

    const [currentConfig, setCurrentConfig] = useState<TVConfig>(config);
    const [activeChannel, setActiveChannel] = useState<TVChannel | null>(null);
    const [messages, setMessages] = useState<TVChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
    const iframeLoadTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [vods, setVods] = useState<VOD[]>([]);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
    const [tvServer, setTvServer] = useState<'default' | 'marsbahis'>('default');
    const [showSplash, setShowSplash] = useState(false);
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (activeChannel) {
            setShowSplash(true);
            const timer = setTimeout(() => setShowSplash(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [activeChannel?.id]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);
    const [mutedUsers, setMutedUsers] = useState<{ userId: string; username: string; mutedUntil: number }[]>([]);
    const [activeMutePopup, setActiveMutePopup] = useState<string | null>(null);
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
        '⚽ beIN SPORTS': true,
        '🏅 S SPORT': true,
        '🎯 SMART SPOR': true,
        '🏀 TİVİBU SPOR': true,
        '🌍 EUROSPORT': true,
        '🎥 DİJİTAL PLATFORMLAR': true,
        '📺 ULUSAL KANALLAR': true,
        '📺 DİĞER KANALLAR': true,
    });
    const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('Tümü');
    const toggleGroup = (group: string) => {
        setCollapsedGroups(prev => {
            const newState: Record<string, boolean> = {};
            // Collapse all groups
            Object.keys(prev).forEach(k => newState[k] = true);
            // Toggle the target group
            newState[group] = !prev[group];
            return newState;
        });
    };

    const toggleAllGroups = () => {
        const allCollapsed = Object.values(collapsedGroups).every(v => v);
        const updated: Record<string, boolean> = {};
        CHANNEL_GROUP_ORDER.forEach(g => {
            updated[g] = !allCollapsed;
        });
        setCollapsedGroups(updated);
    };

    // ── Hero carousel ──
    const [heroSlide, setHeroSlide] = useState(0);
    const heroTimerRef = useRef<any>(null);

    // ── Flash Events ──
    const [flashEvent, setFlashEvent] = useState<typeof FLASH_EVENTS[0] | null>(null);
    const [flashCountdown, setFlashCountdown] = useState(0);
    const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
    const [flashShown, setFlashShown] = useState(false);

    // ── Mobile tabs + swipe ──
    const [mobileTab, setMobileTab] = useState<'player' | 'chat'>('player');
    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    // ── Right panel tabs ──
    const [rightPanelTab, setRightPanelTab] = useState<'chat' | 'channels' | 'matches'>('chat');
    const [searchQuery, setSearchQuery] = useState('');
    const [isChannelsModalOpen, setIsChannelsModalOpen] = useState(false);
    const [tvTab, setTvTab] = useState<'maclar' | 'kanallar' | 'sohbet'>('maclar');
    const [tvMatches, setTvMatches] = useState<any[]>([]);

    useEffect(() => {
        fetch('/prelive_matches.json')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data)) {
                    // Sadece en yakın 20 maçı alalım
                    setTvMatches(data.slice(0, 20));
                }
            }).catch(e => console.log('Matches fetch error:', e));
    }, []);

    const [activeTab, setActiveTab] = useState<'channels' | 'vods'>('channels');
    const swipeableRef = useRef<HTMLDivElement>(null);

    // ── Refs ──
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [hlsError, setHlsError] = useState(false);

    // ══ Hero Timer ═══════════════════════════════════════════════════════════
    const startHeroTimer = useCallback(() => {
        if (heroTimerRef.current) clearInterval(heroTimerRef.current);
        heroTimerRef.current = setInterval(() => setHeroSlide(p => (p + 1) % HERO_SLIDES.length), 5000);
    }, []);

    const goToHeroSlide = (idx: number) => { setHeroSlide(idx); startHeroTimer(); };

    useEffect(() => {
        startHeroTimer();
        return () => { if (heroTimerRef.current) clearInterval(heroTimerRef.current); };
    }, [startHeroTimer]);

    // ══ Paywall Timer ══════════════════════════════════════════════════════════
    useEffect(() => {
        setShowPaywall(false);
        if (userRole === 'admin') {
            return;
        }
        if (!siteUser) {
            const timer = setTimeout(() => setShowPaywall(true), 15000);
            return () => clearTimeout(timer);
        }
    }, [siteUser, userRole, activeChannel?.id]);

    // ══ Flash Event Trigger ═══════════════════════════════════════════════════
    useEffect(() => {
        if (flashShown) return;
        const timer = setTimeout(() => {
            const ev = FLASH_EVENTS[Math.floor(Math.random() * FLASH_EVENTS.length)];
            setFlashEvent(ev);
            setFlashCountdown(ev.duration);
            setFlashShown(true);
        }, 45000 + Math.random() * 30000); // 45-75 seconds after mount
        return () => clearTimeout(timer);
    }, [flashShown]);

    useEffect(() => {
        if (!flashEvent || flashCountdown <= 0) return;
        if (userRole === 'admin') return; // Freeze countdown for admin
        if (flashCountdown === 0) { setFlashEvent(null); return; }
        const t = setTimeout(() => setFlashCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [flashEvent, flashCountdown, userRole]);

    // ══ Scroll to TV ═════════════════════════════════════════════════════════
    useEffect(() => {
        const scroll = () => {
            if (!wrapperRef.current) return;
            const header = document.querySelector('.header-wrapper');
            const headerHeight = header ? header.getBoundingClientRect().height : 172;
            const offsetPosition = wrapperRef.current.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        };
        scroll(); const t1 = setTimeout(scroll, 100); const t2 = setTimeout(scroll, 300);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    // ══ Fetch Data ════════════════════════════════════════════════════════════
    useEffect(() => {
        const fetchData = async () => {
            setIsDataLoading(true);
            try {
                const { data: configData } = await supabase.from('site_configs').select('value').eq('key', 'site_tv_config').maybeSingle();
                if (configData?.value) {
                    setCurrentConfig({
                        ...configData.value,
                        channels: DEFAULT_TV_CONFIG.channels
                    });
                } else {
                    setCurrentConfig(DEFAULT_TV_CONFIG);
                }
            } catch (e) {
                console.error('Config fetch error:', e);
                setCurrentConfig(DEFAULT_TV_CONFIG);
            }

            let currentServer = 'xslot'; // Xslot'u varsayılan yaptık
            try {
                const { data: serverConfig } = await supabase.from('site_configs').select('value').eq('key', 'site_tv_server').maybeSingle();
                if (serverConfig?.value) {
                    setTvServer(serverConfig.value);
                    currentServer = serverConfig.value;
                }
            } catch (e) {
                console.error('Server config fetch error:', e);
            }
            
            let marsbahisUrl = 'https://www.marsbahistv400.com';
            let xslotUrl = 'https://xslot116.live'; // Fallback Xslot URL

            try {
                const { data: urlConfig } = await supabase.from('site_configs').select('value').eq('key', 'site_tv_marsbahis_url').maybeSingle();
                if (urlConfig?.value) marsbahisUrl = urlConfig.value;
                
                const { data: xslotConfig } = await supabase.from('site_configs').select('value').eq('key', 'site_tv_xslot_url').maybeSingle();
                if (xslotConfig?.value) xslotUrl = xslotConfig.value;
            } catch (e) {}

            let mergedStreamers: any[] = [];
            try {
                const { data: streamersData } = await supabase.from('streamers').select('*').order('order_index', { ascending: true });
                if (streamersData) mergedStreamers = [...streamersData];
            } catch (e) {
                console.error('Streamers fetch error:', e);
            }
            
            if (currentServer === 'marsbahis') {
                try {
                    const host = window.location.hostname;
                    const proto = window.location.protocol;
                    const proxyUrl = host === 'localhost' ? 'http://localhost:4000' : `${proto}//${host}:4000`;
                    const res = await fetch(`${proxyUrl}/api/marsbahis-tv?url=${encodeURIComponent(marsbahisUrl)}`);
                    const data = await res.json();
                    if (data.success && data.channels) {
                        data.channels.forEach((ch: any) => {
                            if (!mergedStreamers.find(s => s.kick_username === ch.kick_username)) {
                                mergedStreamers.push(ch);
                            }
                        });
                    }
                } catch (e) {
                    console.error('Marsbahis API fetch error:', e);
                }
            } else if (currentServer === 'xslot') {
                try {
                    const host = window.location.hostname;
                    const proto = window.location.protocol;
                    const proxyUrl = host === 'localhost' ? 'http://localhost:4000' : `${proto}//${host}:4000`;
                    const res = await fetch(`${proxyUrl}/api/xslot-tv?url=${encodeURIComponent(xslotUrl)}`);
                    const data = await res.json();
                    if (data.success && data.channels) {
                        data.channels.forEach((ch: any) => {
                            if (!mergedStreamers.find(s => s.kick_username === ch.kick_username)) {
                                mergedStreamers.push(ch);
                            }
                        });
                    }
                } catch (e) {
                    console.error('Xslot API fetch error:', e);
                }
            }

            if ((currentServer !== 'marsbahis' && currentServer !== 'xslot') || mergedStreamers.length === 0) {
                if (DEFAULT_TV_CONFIG.channels) {
                    DEFAULT_TV_CONFIG.channels.forEach((ch: any) => {
                        const ms = { id: ch.id, name: ch.name, kick_username: ch.platformUsername || ch.slug || ch.streamUrl, platform_type: ch.platformType || ch.platform, avatar_url: ch.thumbnailUrl, tags: ch.tags || [ch.category], is_live: ch.isLive, is_vip: ch.isVip, source_type: ch.sourceType || 'iframe', video_url: ch.videoUrl, iframe_url: ch.iframeUrl, order_index: ch.order, fallback_type: ch.fallback_type, fallback_video_url: ch.fallback_video_url, fallback_iframe_url: ch.fallback_iframe_url };
                        if (!mergedStreamers.find(s => s.id === ch.id || (s.kick_username === ms.kick_username && ms.kick_username))) mergedStreamers.push(ms);
                    });
                }
            }

            if (mergedStreamers.length > 0) {
                const sorted = mergedStreamers.sort((a, b) => { if (a.is_vip && !b.is_vip) return -1; if (!a.is_vip && b.is_vip) return 1; return (a.order_index || 0) - (b.order_index || 0); });
                setStreamers(sorted);
                const live = sorted.find(s => s.is_live && s.is_vip) || sorted.find(s => s.is_live) || sorted[0];
                if (live && !activeChannel) setActiveChannel({ id: live.id, name: live.name, slug: live.kick_username || '', platform: live.platform_type, streamUrl: live.kick_username || '', thumbnailUrl: live.avatar_url || '', category: (live.tags?.length > 0) ? live.tags[0] : 'CANLI YAYIN', isLive: live.is_live, isActive: true, order: live.order_index, sourceType: live.source_type, platformType: live.platform_type, platformUsername: live.kick_username, videoUrl: live.video_url, iframeUrl: live.iframe_url, fallbackType: live.fallback_type, fallbackVideoUrl: live.fallback_video_url, fallbackIframeUrl: live.fallback_iframe_url, viewer_count: live.viewer_count } as any);
            }

            try {
                const { data: vodsData } = await supabase.from('vods').select('*').order('created_at', { ascending: false });
                if (vodsData && vodsData.length > 0) {
                    setVods(vodsData);
                } else if ((DEFAULT_TV_CONFIG as any).vods) {
                    setVods((DEFAULT_TV_CONFIG as any).vods);
                }
            } catch (e) {
                console.error('Vods fetch error:', e);
                if ((DEFAULT_TV_CONFIG as any).vods) setVods((DEFAULT_TV_CONFIG as any).vods);
            }

            const { data: analysesConfig } = await supabase.from('site_configs').select('value').eq('key', 'site_analyses').maybeSingle();
            if (analysesConfig?.value) setAnalyses(analysesConfig.value);
            else {
                const local = localStorage.getItem('site_analyses');
                if (local) setAnalyses(JSON.parse(local));
            }

            setIsDataLoading(false);
        };
        fetchData();

        const sc = supabase.channel(`s-rt-${Math.random()}`).on('postgres_changes', { event: '*', schema: 'public', table: 'streamers' }, fetchData).subscribe();
        const vc = supabase.channel(`v-rt-${Math.random()}`).on('postgres_changes', { event: '*', schema: 'public', table: 'vods' }, fetchData).subscribe();
        return () => { supabase.removeChannel(sc); supabase.removeChannel(vc); };
    }, []);

    useEffect(() => {
        if (currentConfig?.channels?.length > 0) {
            const live = currentConfig.channels.filter(c => {
                if (!c.isActive) return false;
                const timeMatch = c.name.match(/(\d{2}):(\d{2})/);
                if (timeMatch) {
                    const hour = parseInt(timeMatch[1], 10);
                    const minute = parseInt(timeMatch[2], 10);
                    const matchStart = new Date(currentTime);
                    matchStart.setHours(hour, minute, 0, 0);
                    const matchEnd = matchStart.getTime() + 150 * 60 * 1000;
                    if (currentTime.getTime() > matchEnd) {
                        return false;
                    }
                }
                return true;
            }).sort((a, b) => a.order - b.order);
            
            if (live.length > 0) {
                if (!activeChannel) setActiveChannel(live[0]);
                else {
                    const u = live.find(c => c.id === activeChannel.id);
                    if (u) setActiveChannel(u);
                    else setActiveChannel(live[0]);
                }
            }
        }
    }, [currentConfig, currentTime]);

    useEffect(() => { 
        if (iframeLoadTimerRef.current) clearTimeout(iframeLoadTimerRef.current);
        setIsIframeLoaded(false); 
        setIsPlaying(true); 
    }, [activeChannel?.id]);

    useEffect(() => { const h = () => setIsFullscreen(!!document.fullscreenElement); document.addEventListener('fullscreenchange', h); return () => document.removeEventListener('fullscreenchange', h); }, []);

    // HLS Initialization Effect
    useEffect(() => {
        if (!activeChannel) return;
        const url = activeChannel.streamUrl || activeChannel.iframeUrl || '';
        const isM3u8 = url.includes('.m3u8');
        
        if (isM3u8 && videoRef.current) {
            setHlsError(false);
            if (Hls.isSupported()) {
                if (hlsRef.current) {
                    hlsRef.current.destroy();
                }
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hlsRef.current = hls;
                
                hls.loadSource(url);
                hls.attachMedia(videoRef.current);
                
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    if (isPlaying) videoRef.current?.play().catch(e => console.log('HLS play error:', e));
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.error('HLS Network Error');
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.error('HLS Media Error');
                                hls.recoverMediaError();
                                break;
                            default:
                                setHlsError(true);
                                hls.destroy();
                                break;
                        }
                    }
                });
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari
                videoRef.current.src = url;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    if (isPlaying) videoRef.current?.play().catch(e => console.log('Safari play error:', e));
                });
                videoRef.current.addEventListener('error', () => {
                    setHlsError(true);
                });
            }
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [activeChannel, isPlaying]);

    // ══ Chat ═════════════════════════════════════════════════════════════════
    useEffect(() => {
        const fetchMutes = async () => {
            try {
                const data = await getGlobalConfig('tv_mutes');
                if (data && Array.isArray(data.mutedUsers)) {
                    setMutedUsers(data.mutedUsers);
                }
            } catch (e) {
                console.error("Load mutes failed:", e);
            }
        };
        fetchMutes();
    }, []);

    useEffect(() => {
        if (!activeChannel) return;
        const fetch = async () => {
            const { data } = await supabase.from('tv_chat').select('*').eq('channel_id', activeChannel.id).order('created_at', { ascending: true }).limit(100);
            if (data) setMessages(data.map(m => ({ id: m.id, userId: m.user_id, username: m.username, message: m.message, role: m.role || 'user', timestamp: new Date(m.created_at).getTime(), channelId: m.channel_id })));
        };
        fetch();
        const ch = supabase.channel(`tv-chat-${activeChannel.id}-${Math.random()}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tv_chat' }, (p: any) => {
            const m = p.new;
            if (String(m.channel_id) === String(activeChannel.id)) {
                setMessages(prev => {
                    if (prev.some(x => x.id === m.id || (x.id.startsWith('temp-') && x.userId === m.user_id && x.message === m.message))) {
                        return prev.map(x => (x.id.startsWith('temp-') && x.userId === m.user_id && x.message === m.message) ? { ...x, id: m.id, timestamp: new Date(m.created_at).getTime() } : x);
                    }
                    return [...prev, { id: m.id, userId: m.user_id, username: m.username, message: m.message, role: m.role || 'user', timestamp: new Date(m.created_at).getTime(), channelId: m.channel_id }];
                });
            }
        }).subscribe();
        return () => { supabase.removeChannel(ch); };
    }, [activeChannel?.id]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // ══ Helpers ═══════════════════════════════════════════════════════════════
    const triggerReaction = (emoji: string) => {
        const id = Date.now() + Math.random();
        setFloatingEmojis(p => [...p, { id, emoji, style: { left: `${Math.floor(Math.random() * 50) + 25}%`, transform: `rotate(${Math.floor(Math.random() * 60) - 30}deg)`, animation: `floatUp ${(Math.random() * 0.4 + 1.2).toFixed(2)}s cubic-bezier(0.25,1,0.5,1) forwards` } }]);
        setTimeout(() => setFloatingEmojis(p => p.filter(e => e.id !== id)), 2000);
    };

    const handleMuteUser = async (targetUserId: string, targetUsername: string, minutes: number) => {
        try {
            const mutesData = await getGlobalConfig('tv_mutes');
            let currentMutes = mutesData && Array.isArray(mutesData.mutedUsers) ? mutesData.mutedUsers : [];
            currentMutes = currentMutes.filter((m: any) => m.userId !== targetUserId);
            
            const mutedUntil = minutes === -1 ? -1 : Date.now() + minutes * 60000;
            currentMutes.push({ userId: targetUserId, username: targetUsername, mutedUntil });
            
            await updateGlobalConfig('tv_mutes', { mutedUsers: currentMutes });
            setMutedUsers(currentMutes);
            setActiveMutePopup(null);
            alert(`${targetUsername} adlı kullanıcı ${minutes === -1 ? 'süresiz' : minutes + ' dakika'} susturuldu.`);
        } catch (e) {
            console.error("Mute user error:", e);
        }
    };

    const handleUnmuteUser = async (targetUserId: string) => {
        try {
            const mutesData = await getGlobalConfig('tv_mutes');
            let currentMutes = mutesData && Array.isArray(mutesData.mutedUsers) ? mutesData.mutedUsers : [];
            currentMutes = currentMutes.filter((m: any) => m.userId !== targetUserId);
            
            await updateGlobalConfig('tv_mutes', { mutedUsers: currentMutes });
            setMutedUsers(currentMutes);
            setActiveMutePopup(null);
            alert(`Kullanıcının cezası kaldırıldı.`);
        } catch (e) {
            console.error("Unmute user error:", e);
        }
    };

    const sendMessage = async (text?: string) => {
        const t = text || newMessage;
        const isAdminOrEditor = userRole === 'admin' || userRole === 'editor';
        if (!t.trim() || (!siteUser && !isAdminOrEditor) || !activeChannel) return;

        // Mute Check
        try {
            const mutesData = await getGlobalConfig('tv_mutes');
            const currentMutes = mutesData && Array.isArray(mutesData.mutedUsers) ? mutesData.mutedUsers : [];
            setMutedUsers(currentMutes);
            
            const myUserId = siteUser?.id || siteUser?.username || 'admin-user';
            const muteRecord = currentMutes.find((m: any) => m.userId === myUserId);
            if (muteRecord) {
                const now = Date.now();
                if (muteRecord.mutedUntil === -1) {
                    alert("Sohbetten süresiz olarak uzaklaştırıldınız.");
                    return;
                } else if (now < muteRecord.mutedUntil) {
                    const remainingMin = Math.ceil((muteRecord.mutedUntil - now) / 60000);
                    alert(`Sohbetten geçici olarak uzaklaştırıldınız. Kalan süre: ${remainingMin} dakika.`);
                    return;
                }
            }
        } catch (e) {
            console.error("Mute check error:", e);
        }

        const userId = siteUser?.id || siteUser?.username || (isAdminOrEditor ? (userRole || 'admin') : 'guest');
        const username = siteUser?.username || siteUser?.name || (userRole === 'admin' ? 'Yönetici' : (userRole === 'editor' ? 'Editor' : 'Anonim'));

        const msgObj = {
            channel_id: activeChannel.id,
            user_id: userId,
            username: username,
            message: t.trim(),
            role: userRole === 'admin' ? 'admin' : (userRole === 'vip' ? 'vip' : 'user')
        };

        // Optimistic UI Update
        const tempId = 'temp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const localMsg = {
            id: tempId,
            userId: msgObj.user_id,
            username: msgObj.username,
            message: msgObj.message,
            role: msgObj.role as "admin" | "vip" | "user",
            timestamp: Date.now(),
            channelId: msgObj.channel_id
        };
        
        if (!text) setNewMessage('');

        setMessages(prev => {
            if (prev.some(m => m.userId === localMsg.userId && m.message === localMsg.message && Date.now() - m.timestamp < 1000)) {
                return prev;
            }
            return [...prev, localMsg];
        });

        try {
            const { error } = await supabase.from('tv_chat').insert(msgObj);
            if (error) console.error("Supabase tv_chat insert error:", error);
        } catch (e) {
            console.error("Chat insert failed:", e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

    const getRoleColor = (role: string) => role === 'admin' ? '#FFD700' : role === 'vip' ? '#00BFFF' : '#f3f4f6';
    const getRoleBadge = (role: string) => {
        if (role === 'admin') return <span style={{ background: 'linear-gradient(90deg,#FFD700,#FFA500)', padding: '1px 5px', borderRadius: '3px', fontSize: '8px', fontWeight: 900, color: '#000', letterSpacing: '0.5px' }}>ADMIN</span>;
        if (role === 'vip') return <Star style={{ width: 10, height: 10, color: '#00BFFF' }} />;
        return null;
    };

    const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    // ══ Mobile Swipe ═══════════════════════════════════════════════════════
    const MOBILE_TABS: Array<{ id: typeof mobileTab; label: string; icon: React.ReactNode }> = [
        { id: 'player', label: 'Yayın', icon: <Tv style={{ width: 18, height: 18 }} /> },
        { id: 'chat', label: 'Sohbet', icon: <MessageSquare style={{ width: 18, height: 18 }} /> },
    ];
    const mobileTabOrder = ['player', 'chat'];

    const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const delta = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) {
            const idx = mobileTabOrder.indexOf(mobileTab);
            if (delta > 0 && idx < mobileTabOrder.length - 1) setMobileTab(mobileTabOrder[idx + 1] as any);
            if (delta < 0 && idx > 0) setMobileTab(mobileTabOrder[idx - 1] as any);
        }
        setTouchStartX(null);
    };

    // ══ Player Fullscreen on tap (mobile) ═════════════════════════════════
    const handlePlayerTap = () => {
        const isMobile = window.innerWidth < 768;
        if (isMobile && playerContainerRef.current && !document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen?.().catch(() => {});
        } else {
            setIsPlaying(!isPlaying);
        }
    };

    // ══ Stream Embed ═════════════════════════════════════════════════════════
    const handleIframeLoad = () => {
        if (iframeLoadTimerRef.current) clearTimeout(iframeLoadTimerRef.current);
        iframeLoadTimerRef.current = setTimeout(() => {
            setIsIframeLoaded(true);
        }, 8000); // 8 saniye bekle (hata ekranlarını gizlemek için)
    };

    const getStreamEmbed = () => {
        if (!activeChannel) return null;
        if (!isPlaying) return (
            <div onClick={handlePlayerTap} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle,#111118 0%,#040507 100%)', cursor: 'pointer' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(173,255,47,0.1)', border: '2px solid #adff2f', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(173,255,47,0.35)' }}>
                    <Play style={{ width: 28, height: 28, color: '#adff2f', marginLeft: '4px' }} />
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 700, marginTop: '12px', letterSpacing: '1px' }}>OYNATMAK İÇİN DOKUN</span>
            </div>
        );

        // Watermark & Bonus Overlays (stacked on the right edge)
        const watermarkOverlay = (
            <div className="absolute bottom-[35px] sm:bottom-[40px] right-0 z-[50] flex flex-col gap-1.5 pointer-events-none">
               {/* Bonus Button 3 */}
               <div className="w-[115px] h-[32px] bg-[#0A0D14] rounded-l-md border border-r-0 border-[#f59e0b]/30 shadow-lg overflow-hidden backdrop-blur-md pointer-events-auto cursor-pointer flex items-center hover:bg-[#f59e0b]/10 transition-colors group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/10 to-transparent opacity-60"></div>
                  <div className="w-8 flex justify-center"><GiftIcon className="w-3.5 h-3.5 text-[#f59e0b] group-hover:scale-110 transition-transform" /></div>
                  <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '10px', letterSpacing: '0.2px', position: 'relative', zIndex: 10 }}>%20 KAYIP</span>
               </div>
               
               {/* Bonus Button 2 */}
               <div className="w-[115px] h-[32px] bg-[#0A0D14] rounded-l-md border border-r-0 border-[#10b981]/30 shadow-lg overflow-hidden backdrop-blur-md pointer-events-auto cursor-pointer flex items-center hover:bg-[#10b981]/10 transition-colors group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/10 to-transparent opacity-60"></div>
                  <div className="w-8 flex justify-center"><Award className="w-3.5 h-3.5 text-[#10b981] group-hover:scale-110 transition-transform" /></div>
                  <span style={{ color: '#10b981', fontWeight: 800, fontSize: '10px', letterSpacing: '0.2px', position: 'relative', zIndex: 10 }}>%100 BONUS</span>
               </div>

               {/* Bonus Button 1 */}
               <div className="w-[115px] h-[32px] bg-[#0A0D14] rounded-l-md border border-r-0 border-[#8b5cf6]/30 shadow-lg overflow-hidden backdrop-blur-md pointer-events-auto cursor-pointer flex items-center hover:bg-[#8b5cf6]/10 transition-colors group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6]/10 to-transparent opacity-60"></div>
                  <div className="w-8 flex justify-center"><Flame className="w-3.5 h-3.5 text-[#8b5cf6] group-hover:scale-110 transition-transform" /></div>
                  <span style={{ color: '#8b5cf6', fontWeight: 800, fontSize: '10px', letterSpacing: '0.2px', position: 'relative', zIndex: 10 }}>50 FREESPIN</span>
               </div>

               {/* Original Watermark */}
               <div className="w-[115px] h-[32px] bg-[#0A0D14] rounded-l-md border border-r-0 border-white/5 shadow-lg overflow-hidden backdrop-blur-md flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-white/5 transition-colors">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/10 to-[#10b981]/10 opacity-60"></div>
                   <span style={{ color: '#00E5FF', fontWeight: 800, fontSize: '13px', letterSpacing: '0.2px', position: 'relative', zIndex: 10 }}>724</span>
                   <span style={{ color: '#fff', fontWeight: 800, fontSize: '13px', letterSpacing: '0.2px', position: 'relative', zIndex: 10 }}>bets<span style={{ color: '#00E5FF' }}>*</span></span>
               </div>
            </div>
        );

        const customLoader = !isIframeLoaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #0F141E 0%, #030407 100%)', zIndex: 60 }}>
                <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(0, 229, 255, 0.1)', borderTopColor: '#00E5FF', animation: 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite' }}></div>
                    <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', border: '3px solid rgba(16, 185, 129, 0.1)', borderBottomColor: '#10b981', animation: 'spin 1.5s linear infinite reverse' }}></div>
                    <Tv style={{ width: 28, height: 28, color: '#00E5FF', animation: 'pulse 2s infinite' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                    <span style={{ color: '#00E5FF', fontWeight: 900, fontSize: '28px', letterSpacing: '0.5px' }}>724</span>
                    <span style={{ color: '#fff', fontWeight: 900, fontSize: '28px', letterSpacing: '0.5px' }}>bets<span style={{ color: '#00E5FF' }}>*</span></span>
                </div>
                <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', marginTop: '16px', textTransform: 'uppercase' }}>YAYIN BAĞLANTISI KURULUYOR...</p>
            </div>
        );

        const url = activeChannel.streamUrl || activeChannel.iframeUrl || '';
        const isM3u8 = url.includes('.m3u8');

        if (isM3u8) {
            if (hlsError) {
                return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle, #0F141E 0%, #030407 100%)' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                            <AlertCircle style={{ width: 36, height: 36, color: '#ef4444' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                            <span style={{ color: '#00E5FF', fontWeight: 900, fontSize: '28px', letterSpacing: '0.5px' }}>724</span>
                            <span style={{ color: '#fff', fontWeight: 900, fontSize: '28px', letterSpacing: '0.5px' }}>bets<span style={{ color: '#00E5FF' }}>*</span></span>
                        </div>
                        <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', marginTop: '16px', textTransform: 'uppercase' }}>Yayın Şu An Çevrimdışı</p>
                        <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '8px' }}>Lütfen daha sonra tekrar deneyin veya başka bir kanal seçin.</p>
                    </div>
                );
            }

            return (
                <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>
                    {watermarkOverlay}
                    <video 
                        ref={videoRef} 
                        muted={isMuted} 
                        playsInline 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                </div>
            );
        }

        const sourceType = activeChannel.sourceType || (activeChannel.isLive ? 'platform' : 'none');
        if (activeChannel.isLive && sourceType === 'platform') {
            const platform = activeChannel.platformType || activeChannel.platform || 'kick';
            const rawUsername = activeChannel.platformUsername || activeChannel.streamUrl || '';
            const loadingColor = platform === 'kick' ? '#ADFF2F' : platform === 'twitch' ? '#a855f7' : '#ef4444';
            
            if (platform === 'kick') {
                let id = rawUsername.trim();
                if (id.includes('kick.com/')) id = id.split('kick.com/')[1].split('?')[0].split('/')[0];
                if (!id && activeChannel.slug) id = activeChannel.slug.trim();
                return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{customLoader}{watermarkOverlay}<iframe src={`https://player.kick.com/${id}?autoplay=true&muted=${isMuted ? 'true' : 'false'}`} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={handleIframeLoad} title={activeChannel.name} /></div>;
            }
            if (platform === 'twitch') {
                let id = rawUsername.trim();
                if (id.includes('twitch.tv/')) id = id.split('twitch.tv/')[1].split('?')[0].split('/')[0];
                const host = window.location.hostname;
                return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{customLoader}{watermarkOverlay}<iframe src={`https://player.twitch.tv/?channel=${id}&parent=${host}&autoplay=true&muted=${isMuted}&playsinline=true`} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={handleIframeLoad} title={activeChannel.name} /></div>;
            }
            if ((platform as string) === "youtube") {
                let parsedId = rawUsername.trim();
                try {
                    if (parsedId.includes('youtube.com') || parsedId.includes('youtu.be')) {
                        const u = new URL(parsedId.startsWith('http') ? parsedId : `https://${parsedId}`);
                        if (u.hostname.includes('youtu.be')) parsedId = u.pathname.slice(1);
                        else if (u.pathname.includes('/watch')) parsedId = u.searchParams.get('v') || parsedId;
                        else if (u.pathname.includes('/live/')) parsedId = u.pathname.split('/live/')[1].split('?')[0];
                        else if (u.pathname.includes('/channel/')) parsedId = u.pathname.split('/channel/')[1].split('?')[0];
                    }
                } catch (e) {}
                const ytMute = isMuted ? 1 : 0;
                const embedUrl = (parsedId.startsWith('UC') || parsedId.startsWith('HC'))
                    ? `https://www.youtube.com/embed/live_stream?channel=${parsedId}&autoplay=1&mute=${ytMute}&playsinline=1&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3`
                    : `https://www.youtube.com/embed/${parsedId}?autoplay=1&mute=${ytMute}&playsinline=1&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3`;
                return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{customLoader}{watermarkOverlay}<iframe src={embedUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={handleIframeLoad} title={activeChannel.name} /></div>;
            }
        }
        if (sourceType === 'video') return <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>{watermarkOverlay}<video ref={videoRef} src={activeChannel.videoUrl || activeChannel.streamUrl} autoPlay={isPlaying} muted={isMuted} playsInline loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>;
        if (sourceType === 'iframe') {
            let finalUrl = activeChannel.iframeUrl || activeChannel.streamUrl;
            if (tvServer === 'marsbahis' && finalUrl && finalUrl.includes('channel?id=')) {
                const idMatch = finalUrl.match(/channel\?id=([^&]+)/);
                if (idMatch && idMatch[1]) {
                    // Try to get marsbahisUrl from config, otherwise fallback
                    let mbUrl = 'https://www.marsbahistv400.com';
                    if (currentConfig && (currentConfig as any).marsbahisUrl) {
                        mbUrl = (currentConfig as any).marsbahisUrl;
                    }
                    finalUrl = `${mbUrl.replace(/\/$/, '')}/channel?id=${idMatch[1]}`;
                }
            }
            return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{customLoader}{watermarkOverlay}<iframe src={finalUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={handleIframeLoad} title={activeChannel.name} /></div>;
        }
        if (activeChannel.fallbackType === 'video' && activeChannel.fallbackVideoUrl) return <div style={{ width: '100%', height: '100%', background: '#000', position: 'relative' }}>{watermarkOverlay}<video ref={videoRef} src={activeChannel.fallbackVideoUrl} autoPlay={isPlaying} muted={isMuted} playsInline loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>;
        if (activeChannel.fallbackType === 'iframe' && activeChannel.fallbackIframeUrl) return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{customLoader}{watermarkOverlay}<iframe src={activeChannel.fallbackIframeUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={handleIframeLoad} title={activeChannel.name} /></div>;

        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#06b6d4', gap: '12px', background: 'radial-gradient(circle, #111118 0%, #040507 100%)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0, 255, 163,0.06)', border: '1px solid rgba(0, 255, 163,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-slow 3s infinite' }}>
                    <Tv style={{ width: 24, height: 24, color: '#06b6d4', opacity: 0.8 }} />
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.5px' }}>YAYIN YAKINDA BAŞLAYACAK</p>
            </div>
        );
    };

    const isTVActive = activeView === '724tv';
    if (!isTVActive && (!isMiniPlayer || !activeChannel)) {
        return null;
    }

    if (!currentConfig?.isActive) return null;
    const slide = HERO_SLIDES[heroSlide];

    const activeStreamers = streamers.filter(s => {
        const timeMatch = s.name.match(/(\d{2}):(\d{2})/);
        if (timeMatch) {
            const hour = parseInt(timeMatch[1], 10);
            const minute = parseInt(timeMatch[2], 10);
            const matchStart = new Date(currentTime);
            matchStart.setHours(hour, minute, 0, 0);
            const matchEnd = matchStart.getTime() + 150 * 60 * 1000;
            if (currentTime.getTime() > matchEnd) {
                return false;
            }
        }
        return true;
    });

    // ══════════════════════════════════════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════════════════════════════════════
    const getNextThreeAnalyses = () => {
        return [...analyses]
            .filter(a => {
                const target = new Date(`${a.matchDate}T${a.matchTime}:00+03:00`);
                return target.getTime() > currentTime.getTime();
            })
            .sort((a, b) => {
                const tA = new Date(`${a.matchDate}T${a.matchTime}:00+03:00`).getTime();
                const tB = new Date(`${b.matchDate}T${b.matchTime}:00+03:00`).getTime();
                return tA - tB;
            })
            .slice(0, 3);
    };
    const nextThreeAnalyses = getNextThreeAnalyses();

    if (!isTVActive) {
        return null;
    }

    return (
        <div ref={wrapperRef} className="tv-redesign-wrapper animate-fade-in" style={{ width: '100%', minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#050508', backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.03) 0%, #050508 70%)', position: 'relative', overflow: 'hidden' }}>
            {/* Elegant dark edges */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.8)', zIndex: 0 }} />
            
            {/* Floating balls / chips effect (CSS only) */}
            <div className="floating-elements" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.1, background: 'url(/splash-ball.webp)', backgroundSize: '100px', animation: 'float-bg 60s linear infinite' }} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
                @keyframes float-bg { 0% { background-position: 0 0; } 100% { background-position: 1000px 1000px; } }
                @keyframes pulse-red { 0%,100%{box-shadow:0 0 10px rgba(239,68,68,.2)} 50%{box-shadow:0 0 25px rgba(239,68,68,.5)} }
                .custom-scrollbar::-webkit-scrollbar { width:4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background:rgba(255,255,255,.02); border-radius:4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(239,68,68,.3); border-radius:4px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background:rgba(239,68,68,.5); }
                .tv-tab-btn { transition: all 0.2s; position: relative; }
                .tv-tab-btn::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: #10b981; transform: scaleX(0); transition: transform 0.2s; }
                .tv-tab-btn.active { color: #fff; }
                .tv-tab-btn.active::after { transform: scaleX(1); }
            `}</style>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '10px' : '20px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* ─── SPORTS SLIDER ─── */}
                <div className="w-full -mt-2 mb-2">
                    <SportsPromoSlider matches={matches} compact={true} />
                </div>

                {/* Main Column Layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'stretch' }}>
                    
                    {/* TOP: Video Player */}
                    <div style={{ width: '100%', position: 'relative' }}>
                        <div ref={playerContainerRef} style={{ width: '100%', aspectRatio: isMobile ? '16/9' : '21/9', maxHeight: '70vh', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            
                            {!activeChannel ? (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #0a110d 0%, #000 100%)' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', border: '2px solid rgba(16,185,129,0.3)' }}>
                                        <Play style={{ width: 32, height: 32, color: '#10b981', marginLeft: '4px' }} />
                                    </div>
                                    <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>YAYIN BAŞLIYOR</h2>
                                    <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: 600 }}>Lütfen sağ taraftan bir maç veya kanal seçin.</p>
                                    <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', opacity: 0.3 }}>
                                        <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff' }}>724<span style={{ color: '#10b981' }}>TV</span></span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    
                                    {/* Splash Overlay */}
                                    {showSplash && (
                                        <div style={{ position: 'absolute', inset: 0, zIndex: 50, background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <span style={{ fontSize: isMobile ? '36px' : '64px', fontWeight: 900, color: '#fff', letterSpacing: '-0.05em' }}>
                                                    724
                                                </span>
                                                <span style={{ fontSize: isMobile ? '36px' : '64px', fontWeight: 900, color: '#10b981', letterSpacing: '-0.05em' }}>
                                                    BETS
                                                </span>
                                            </div>
                                            <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', animation: 'pulse-red 1.4s infinite ease-in-out both' }} />
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', animation: 'pulse-red 1.4s infinite ease-in-out both', animationDelay: '0.16s' }} />
                                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', animation: 'pulse-red 1.4s infinite ease-in-out both', animationDelay: '0.32s' }} />
                                            </div>
                                        </div>
                                    )}

                                    {getStreamEmbed()}
                                    
                                    {/* Custom Controls Bar */}
                                    <div className="ctrl-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', opacity: isMobile ? 1 : 0, transition: 'opacity 0.2s' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                                {isPlaying ? <Pause style={{ width: 18, height: 18 }} /> : <Play style={{ width: 18, height: 18 }} />}
                                            </button>
                                            <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                                {isMuted ? <VolumeX style={{ width: 18, height: 18, color: '#ef4444' }} /> : <Volume2 style={{ width: 18, height: 18, color: '#10b981' }} />}
                                            </button>
                                            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{activeChannel.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }} />
                                                <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981' }}>CANLI</span>
                                            </div>
                                            <button onClick={() => {
                                                if (document.fullscreenElement) document.exitFullscreen();
                                                else playerContainerRef.current?.requestFullscreen();
                                            }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                                <Maximize style={{ width: 18, height: 18 }} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Watermark */}
                                    <div style={{ position: 'absolute', top: '20px', left: '20px', opacity: 0.8, pointerEvents: 'none', zIndex: 40 }}>
                                        <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>724<span style={{ color: '#10b981' }}>TV</span></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Feature Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <div onClick={() => setIsChannelsModalOpen(true)} className="bg-[#12141a] border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-center hover:bg-[#1a1d24] transition-colors cursor-pointer relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/0 via-[#10b981]/5 to-[#10b981]/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h4 className="text-white text-lg md:text-xl font-bold mb-1 relative z-10 flex items-center gap-2">
                                <Tv className="w-5 h-5 text-[#10b981]" /> Kanallar
                            </h4>
                            <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-wider relative z-10">TÜM CANLI YAYINLARI KEŞFEDİN</p>
                        </div>
                        <div className="bg-[#12141a] border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-center hover:bg-[#1a1d24] transition-colors cursor-pointer">
                            <h4 className="text-white text-lg md:text-xl font-bold mb-1">Güvenilir Sistem</h4>
                            <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">LİSANSLI ALTYAPI İLE GÜVENDESİNİZ</p>
                        </div>
                        <div className="bg-[#12141a] border border-white/5 rounded-xl p-5 md:p-6 flex flex-col justify-center hover:bg-[#1a1d24] transition-colors cursor-pointer">
                            <h4 className="text-white text-lg md:text-xl font-bold mb-1">Canlı Destek</h4>
                            <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">7/24 KESİNTİSİZ HİZMET</p>
                        </div>
                    </div>

                    {/* Channels Modal Overlay */}
                    {isChannelsModalOpen && (
                        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6" onClick={() => setIsChannelsModalOpen(false)}>
                            <div className="bg-[#12141a] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                                
                                {/* Modal Header & Search */}
                                <div className="p-4 md:p-6 border-b border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/[0.02] shrink-0">
                                    <div className="flex items-center justify-between md:justify-start gap-4">
                                        <h2 className="text-white text-lg md:text-xl font-black flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981]"></div>
                                            CANLI KANALLAR
                                            <span className="text-[10px] md:text-xs font-bold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 px-2 py-0.5 rounded-full flex items-center gap-1.5 ml-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                                                {streamers.length} KANAL
                                            </span>
                                        </h2>
                                        <button onClick={() => setIsChannelsModalOpen(false)} className="md:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-full md:w-[300px]">
                                            <input 
                                                type="text" 
                                                placeholder="Kanal ara... (beIN 1, Tivibu...)" 
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 focus:border-[#10b981] rounded-lg py-2 pl-9 pr-8 text-xs text-white outline-none transition-colors"
                                            />
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                            {searchQuery && (
                                                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={() => setIsChannelsModalOpen(false)} className="hidden md:flex w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Body: Accordion */}
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 flex flex-col gap-3">
                                    {(() => {
                                        const filteredStreamers = streamers.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()));
                                        
                                        const grouped: Record<string, Streamer[]> = {};
                                        filteredStreamers.forEach(s => {
                                            const groupName = getChannelGroup(s.name);
                                            if (!grouped[groupName]) grouped[groupName] = [];
                                            grouped[groupName].push(s);
                                        });

                                        return CHANNEL_GROUP_ORDER
                                            .filter(g => grouped[g] && grouped[g].length > 0)
                                            .map(groupName => {
                                                const config = getGroupConfig(groupName);
                                                const isCollapsed = collapsedGroups[groupName];
                                                
                                                return (
                                                    <div key={groupName} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: `1px solid ${config.color}33`, overflow: 'hidden', transition: 'all 0.3s' }}>
                                                        <button 
                                                            onClick={() => toggleGroup(groupName)}
                                                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: isCollapsed ? 'transparent' : 'rgba(255,255,255,0.03)', cursor: 'pointer', border: 'none', textAlign: 'left', transition: 'background 0.2s' }}
                                                            className="hover:bg-[#ffffff08]"
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <div style={{ width: '4px', height: '18px', background: config.color, borderRadius: '4px', boxShadow: `0 0 10px ${config.color}80` }} />
                                                                <span style={{ fontSize: '15px', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>
                                                                    {groupName}
                                                                </span>
                                                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '12px', marginLeft: '8px' }}>
                                                                    {grouped[groupName].length} Kanal
                                                                </span>
                                                            </div>
                                                            <ChevronDown style={{ width: 20, height: 20, color: '#9ca3af', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
                                                        </button>
                                                        
                                                        <div 
                                                            style={{ 
                                                                display: 'grid', 
                                                                gridTemplateRows: isCollapsed ? '0fr' : '1fr', 
                                                                transition: 'grid-template-rows 0.3s ease-out'
                                                            }}
                                                        >
                                                            <div style={{ overflow: 'hidden' }}>
                                                                <div className="p-3 border-t flex flex-row sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-2 overflow-x-auto custom-scrollbar" style={{ borderTopColor: `${config.color}15` }}>
                                                                    {grouped[groupName].map(s => {
                                                                        const isActive = activeChannel?.id === s.id;
                                                                        return (
                                                                            <button 
                                                                                key={s.id}
                                                                                onClick={() => {
                                                                                    setActiveChannel({
                                                                                        id: s.id, name: s.name, slug: s.kick_username || '', platform: s.platform_type,
                                                                                        streamUrl: s.kick_username || '', thumbnailUrl: s.avatar_url || '',
                                                                                        category: s.tags?.[0] || 'CANLI YAYIN', isLive: s.is_live, isActive: true,
                                                                                        order: s.order_index, sourceType: s.source_type, platformType: s.platform_type,
                                                                                        platformUsername: s.kick_username, videoUrl: s.video_url, iframeUrl: s.iframe_url,
                                                                                        fallbackType: s.fallback_type, fallbackVideoUrl: s.fallback_video_url,
                                                                                        fallbackIframeUrl: s.fallback_iframe_url, viewer_count: s.viewer_count,
                                                                                    } as any);
                                                                                    // Auto close modal on mobile after selecting a channel
                                                                                    if (window.innerWidth < 768) setIsChannelsModalOpen(false);
                                                                                }}
                                                                                className={`group/item flex items-center min-w-[150px] sm:min-w-0 w-full gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 border flex-shrink-0 ${isActive ? 'bg-[#10b981]/10 border-[#10b981]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                                                            >
                                                                                <div className="relative flex-shrink-0">
                                                                                    <div className={`w-8 h-8 rounded-md overflow-hidden bg-black/50 border ${isActive ? 'border-[#10b981]' : 'border-white/10'}`}>
                                                                                        <img src={getChannelLogo(s.name, s.avatar_url)} alt={s.name} className="w-full h-full object-contain p-1" />
                                                                                    </div>
                                                                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0B0E14] ${isActive ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' : (s.is_live ? 'bg-[#10b981]/50' : 'bg-zinc-600')}`} />
                                                                                </div>
                                                                                
                                                                                <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
                                                                                    <div className={`text-xs font-bold truncate transition-colors ${isActive ? 'text-white' : 'text-zinc-300 group-hover/item:text-white'}`}>
                                                                                        {s.name}
                                                                                    </div>
                                                                                    {s.is_live ? (
                                                                                        <div className="flex items-center gap-1 mt-0.5">
                                                                                            <span className="text-[9px] font-black text-[#10b981] tracking-wider">CANLI</span>
                                                                                            {s.viewer_count && s.viewer_count > 0 && (
                                                                                                <>
                                                                                                    <span className="text-zinc-600 text-[8px]">•</span>
                                                                                                    <Users className="w-2.5 h-2.5 text-zinc-500" />
                                                                                                    <span className="text-[9px] font-bold text-zinc-500">{s.viewer_count}</span>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <span className="text-[9px] font-bold text-zinc-500 mt-0.5">ÇEVRİMDIŞI</span>
                                                                                    )}
                                                                                </div>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* End Modal */}
                </div>

                {/* 3. Live Matches List (Moved to bottom) */}
                <div className="mt-4 w-full">
                    <TopMatchesWidget 
                        matches={matches.filter(m => m.isLive || m.minute)} 
                        onSelectMatch={() => {}}
                        sortByTime={false}
                    />
                </div>

            </div>
        </div>
    );
};
export default TV724View;

const LiveFeedTicker = () => {
  const [toastIndex, setToastIndex] = useState(0);
  const TOAST_MESSAGES = [
      { user: 'a***7', action: '₺2.500 yatırdı', detail: 've 5 bilet aldı!' },
      { user: 'm***4', action: 'VIP Çekilişe Katıldı', detail: '₺10.000 değerinde bilet aldı!' },
      { user: 'k***9', action: '₺1.000 yatırdı', detail: 've 2 bilet aldı!' },
      { user: 'c***2', action: 'Yeni Üye Oldu', detail: 'Hoşgeldin Bonusu aldı!' }
  ];

  useEffect(() => {
      const interval = setInterval(() => {
          setToastIndex(prev => (prev + 1) % TOAST_MESSAGES.length);
      }, 3500);
      return () => clearInterval(interval);
  }, []);

  const msg = TOAST_MESSAGES[toastIndex];

  return (
      <div className="w-full bg-[#0a0d14] border-t border-white/5 py-3 overflow-hidden shrink-0 mt-4 rounded-xl shadow-lg border border-white/10">
          <div className="flex items-center gap-4 px-4 whitespace-nowrap overflow-hidden">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CANLI AKIŞ
              </span>
              <div className="flex-1 flex items-center gap-2 text-sm text-zinc-300 min-w-0">
                  <span className="text-amber-500 font-medium">⚡ {msg.user}</span>
                  <span className="text-zinc-400">az önce</span>
                  <span className="text-emerald-400 font-medium">{msg.action}</span>
                  <span className="text-zinc-500">{msg.detail}</span>
              </div>
          </div>
      </div>
  );
};
