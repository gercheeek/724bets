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
    // Check known channel names FIRST to always show proper logos
    if (nameLower.includes('724tv') || nameLower.includes('7/24')) return 'https://img.icons8.com/color/96/television.png';
    if (nameLower.includes('bein') || nameLower.includes('lig tv')) return 'https://upload.wikimedia.org/wikipedia/commons/e/e0/BeIN_Sports_logo.svg';
    if (nameLower.includes('s sport')) return 'https://upload.wikimedia.org/wikipedia/tr/d/d7/S_Sport_logo.png';
    if (nameLower.includes('trt spor')) return 'https://upload.wikimedia.org/wikipedia/commons/e/ee/TRT_Spor_logo.svg';
    if (nameLower.includes('trt 1') || nameLower.includes('trt1')) return 'https://upload.wikimedia.org/wikipedia/commons/5/5f/TRT_1_logo.svg';
    if (nameLower.includes('tabii') || nameLower.includes('tabıı')) return 'https://upload.wikimedia.org/wikipedia/commons/0/07/Tabii_logo.png';
    if (nameLower.includes('a spor')) return 'https://upload.wikimedia.org/wikipedia/tr/b/bf/A_spor_logo.png';
    if (nameLower.includes('tivibu')) return 'https://upload.wikimedia.org/wikipedia/tr/2/23/Tivibu_logo.png';
    if (nameLower.includes('exxen')) return 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Exxen_logo.png';
    if (nameLower.includes('tv8.5') || nameLower.includes('tv8')) return 'https://upload.wikimedia.org/wikipedia/commons/d/de/TV8_logo.svg';
    if (nameLower.includes('mac') || nameLower.includes('maç') || nameLower.includes('futbol') || nameLower.includes('taraftar')) return 'https://img.icons8.com/color/96/football.png';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=1a2035&color=fff`;
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TV724View: React.FC<TV724ViewProps> = ({ config, siteUser, userRole, onBack, onLoginRequired, activeView = '724tv' }) => {
    // ── Core state ──
    const [currentConfig, setCurrentConfig] = useState<TVConfig>(config);
    const [activeChannel, setActiveChannel] = useState<TVChannel | null>(null);
    const [messages, setMessages] = useState<TVChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);
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
        'beIN SPORTS': true,
        'S Sport': true,
        'Smart Spor': true,
        'Tivibu Spor': true,
        'TRT': true,
        'Ulusal': true,
    });
    const toggleGroup = (group: string) => {
        setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
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

            let currentServer = 'default';
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
            try {
                const { data: urlConfig } = await supabase.from('site_configs').select('value').eq('key', 'site_tv_marsbahis_url').maybeSingle();
                if (urlConfig?.value) {
                    marsbahisUrl = urlConfig.value;
                }
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
            }

            if (currentServer !== 'marsbahis' && DEFAULT_TV_CONFIG.channels) {
                DEFAULT_TV_CONFIG.channels.forEach((ch: any) => {
                    const ms = { id: ch.id, name: ch.name, kick_username: ch.platformUsername || ch.slug || ch.streamUrl, platform_type: ch.platformType || ch.platform, avatar_url: ch.thumbnailUrl, tags: ch.tags || [ch.category], is_live: ch.isLive, is_vip: ch.isVip, source_type: ch.sourceType || 'iframe', video_url: ch.videoUrl, iframe_url: ch.iframeUrl, order_index: ch.order, fallback_type: ch.fallback_type, fallback_video_url: ch.fallback_video_url, fallback_iframe_url: ch.fallback_iframe_url };
                    if (!mergedStreamers.find(s => s.id === ch.id || (s.kick_username === ms.kick_username && ms.kick_username))) mergedStreamers.push(ms);
                });
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

        const sc = supabase.channel('s-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'streamers' }, fetchData).subscribe();
        const vc = supabase.channel('v-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'vods' }, fetchData).subscribe();
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

    useEffect(() => { setIsIframeLoaded(false); setIsPlaying(true); }, [activeChannel?.id]);

    useEffect(() => { const h = () => setIsFullscreen(!!document.fullscreenElement); document.addEventListener('fullscreenchange', h); return () => document.removeEventListener('fullscreenchange', h); }, []);

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
        const ch = supabase.channel(`tv-chat-${activeChannel.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tv_chat' }, (p: any) => {
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

        const sourceType = activeChannel.sourceType || (activeChannel.isLive ? 'platform' : 'none');
        if (activeChannel.isLive && sourceType === 'platform') {
            const platform = activeChannel.platformType || activeChannel.platform || 'kick';
            const rawUsername = activeChannel.platformUsername || activeChannel.streamUrl || '';
            const loadingColor = platform === 'kick' ? '#ADFF2F' : platform === 'twitch' ? '#a855f7' : '#ef4444';
            const loader = !isIframeLoaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', zIndex: 10 }}><div style={{ width: '32px', height: '32px', border: `2px solid ${loadingColor}33`, borderTopColor: loadingColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;

            if (platform === 'kick') {
                let id = rawUsername.trim();
                if (id.includes('kick.com/')) id = id.split('kick.com/')[1].split('?')[0].split('/')[0];
                if (!id && activeChannel.slug) id = activeChannel.slug.trim();
                return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{loader}<iframe src={`https://player.kick.com/${id}?autoplay=true&muted=${isMuted ? 'true' : 'false'}`} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;
            }
            if (platform === 'twitch') {
                let id = rawUsername.trim();
                if (id.includes('twitch.tv/')) id = id.split('twitch.tv/')[1].split('?')[0].split('/')[0];
                const host = window.location.hostname;
                return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{loader}<iframe src={`https://player.twitch.tv/?channel=${id}&parent=${host}&autoplay=true&muted=${isMuted}&playsinline=true`} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;
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
                return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{loader}<iframe src={embedUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;
            }
        }
        if (sourceType === 'video') return <div style={{ width: '100%', height: '100%', background: '#000' }}><video ref={videoRef} src={activeChannel.videoUrl || activeChannel.streamUrl} autoPlay={isPlaying} muted={isMuted} playsInline loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>;
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
            return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{!isIframeLoaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', zIndex: 10 }}><div style={{ width: '32px', height: '32px', border: '2px solid rgba(16, 185, 129, 0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>}<iframe src={finalUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;
        }
        if (activeChannel.fallbackType === 'video' && activeChannel.fallbackVideoUrl) return <div style={{ width: '100%', height: '100%', background: '#000' }}><video ref={videoRef} src={activeChannel.fallbackVideoUrl} autoPlay={isPlaying} muted={isMuted} playsInline loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>;
        if (activeChannel.fallbackType === 'iframe' && activeChannel.fallbackIframeUrl) return <div style={{ width: '100%', height: '100%', position: 'relative' }}><iframe src={activeChannel.fallbackIframeUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;

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
        <div ref={wrapperRef} className="tv-redesign-wrapper animate-fade-in" style={{ width: '100%', minHeight: '100vh', fontFamily: "'Inter', sans-serif", backgroundColor: '#050505', backgroundImage: 'radial-gradient(circle at 50% 0%, #1a0505 0%, #050505 70%)', position: 'relative', overflow: 'hidden' }}>
            {/* Neon glowing edges */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', boxShadow: 'inset 0 0 100px rgba(239, 68, 68, 0.03)', zIndex: 0 }} />
            
            {/* Floating balls / chips effect (CSS only) */}
            <div className="floating-elements" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.1, background: 'url(/splash-ball.png)', backgroundSize: '100px', animation: 'float-bg 60s linear infinite' }} />

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
                
                {/* Main 2-Column Layout */}
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'stretch' }}>
                    
                    {/* LEFT: Video Player */}
                    <div style={{ flex: 1.8, minWidth: isMobile ? '100%' : '60%', position: 'relative' }}>
                        <div ref={playerContainerRef} style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                            
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

                    {/* RIGHT: Sidebar (Tabs + Content) */}
                    <div style={{ flex: 1, minWidth: isMobile ? '100%' : '340px', position: 'relative' }}>
                        <div style={{ position: isMobile ? 'relative' : 'absolute', inset: 0, background: '#12141a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', flexDirection: 'column', height: isMobile ? '500px' : '100%', overflow: 'hidden' }}>
                            
                            {/* Channels Sidebar Title */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}>
                                <div style={{ width: '4px', height: '16px', background: '#10b981', borderRadius: '4px', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
                                <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#fff', letterSpacing: '1px', margin: 0 }}>CANLI KANALLAR</h3>
                            </div>

                            {/* Channels Content */}
                            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ position: 'relative', marginBottom: '10px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Kanal ara..." 
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            style={{ width: '100%', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 12px 12px 40px', color: '#fff', fontSize: '13px', outline: 'none', transition: 'border-color 0.2s' }}
                                            className="focus:border-[#10b981]/50"
                                        />
                                        <Search style={{ width: 16, height: 16, color: '#6b7280', position: 'absolute', left: '14px', top: '13px' }} />
                                    </div>
                                    
                                    {(() => {
                                        const filteredStreamers = streamers.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()));
                                        
                                        const grouped: Record<string, Streamer[]> = {};
                                        filteredStreamers.forEach(s => {
                                            const groupName = getChannelGroup(s.name);
                                            if (!grouped[groupName]) grouped[groupName] = [];
                                            grouped[groupName].push(s);
                                        });

                                        return CHANNEL_GROUP_ORDER.filter(g => grouped[g] && grouped[g].length > 0).map(groupName => (
                                            <div key={groupName} style={{ marginBottom: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                                                {/* Accordion Header */}
                                                <div 
                                                    onClick={() => setCollapsedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }))}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%)', cursor: 'pointer' }}
                                                    className="hover:bg-white/5 transition-colors"
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontSize: '13px', fontWeight: 900, color: '#e5e7eb', letterSpacing: '0.5px' }}>{groupName}</span>
                                                    </div>
                                                    {collapsedGroups[groupName] ? <ChevronDown style={{ width: 16, height: 16, color: '#6b7280' }} /> : <ChevronUp style={{ width: 16, height: 16, color: '#6b7280' }} />}
                                                </div>
                                                
                                                {/* Accordion Content */}
                                                {!collapsedGroups[groupName] && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', padding: '8px' }}>
                                                        {grouped[groupName].map(s => {
                                                            const isActive = activeChannel?.id === s.id;
                                                            return (
                                                                <div 
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
                                                                    }}
                                                                    style={{ 
                                                                        display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 12px', 
                                                                        background: isActive ? 'linear-gradient(90deg, rgba(16,185,129,0.1) 0%, transparent 100%)' : 'transparent', 
                                                                        borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                                                                        borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent'
                                                                    }}
                                                                    className="hover:bg-white/5"
                                                                >
                                                                    <div style={{ position: 'relative' }}>
                                                                        <img 
                                                                            src={getChannelLogo(s.name, s.avatar_url)} 
                                                                            alt={s.name} 
                                                                            style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'contain', background: 'rgba(0,0,0,0.4)', padding: '4px', border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.05)' }}
                                                                            onError={(e) => {
                                                                                e.currentTarget.onerror = null;
                                                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=111&color=fff`;
                                                                            }}
                                                                        />
                                                                        {s.is_live && (
                                                                            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', border: '2px solid #12141a', animation: 'pulse 2s infinite' }} />
                                                                        )}
                                                                    </div>
                                                                    <div style={{ flex: 1 }}>
                                                                        <div style={{ fontSize: '13px', fontWeight: 900, color: isActive ? '#fff' : '#d1d5db', marginBottom: '2px' }}>{s.name}</div>
                                                                        <div style={{ fontSize: '10px', color: s.is_live ? '#10b981' : '#6b7280', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                            {s.is_live ? 'CANLI YAYIN' : 'ÇEVRİMDIŞI'}
                                                                        </div>
                                                                    </div>
                                                                    {isActive && (
                                                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <Play style={{ width: 12, height: 12, color: '#10b981', marginLeft: '2px' }} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SYS.ON Cards Block */}
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px', marginTop: '10px' }}>
                    
                    {/* CANLI MASA CARD */}
                    <div className="group relative rounded-xl overflow-hidden cursor-pointer" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
                        {/* Background & Grid */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'url(https://images.unsplash.com/photo-1605662768434-2e21ea5c1926?q=80&w=600&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity' }} className="group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)' }}></div>
                        
                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 10, padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px', width: 'fit-content', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                                <span style={{ color: '#06b6d4', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '1px' }}>SYS.ON _CASINO</span>
                            </div>
                            
                            {/* Cyan Line */}
                            <div style={{ width: '100%', height: '2px', background: '#06b6d4', marginTop: 'auto', marginBottom: '15px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-20px', width: '4px', height: '20px', background: '#06b6d4', top: '-9px' }}></div>
                            </div>
                            
                            <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 20px 0' }}>CANLI MASA</h3>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        <span style={{ fontSize: '10px', color: '#06b6d4', fontFamily: 'monospace' }}>SECURE_LINK: <span style={{ color: '#10b981' }}>TRUE</span></span>
                                    </div>
                                    <span style={{ fontSize: '9px', color: '#6b7280', fontFamily: 'monospace' }}>[ LATENCY: 12ms ]</span>
                                </div>
                                
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: '1px dashed rgba(6,182,212,0.3)', position: 'relative' }} className="group-hover:border-cyan-500 transition-colors">
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(6,182,212,0.5)', margin: '0 auto' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* CANLI SPOR CARD */}
                    <div className="group relative rounded-xl overflow-hidden cursor-pointer" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
                        {/* Background & Grid */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'url(https://images.unsplash.com/photo-1518605368461-1e1e34320e8a?q=80&w=600&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity' }} className="group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)' }}></div>
                        
                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 10, padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px', width: 'fit-content', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                                <span style={{ color: '#10b981', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '1px' }}>SYS.ON _SPORTS</span>
                            </div>
                            
                            {/* Green Line */}
                            <div style={{ width: '100%', height: '2px', background: '#10b981', marginTop: 'auto', marginBottom: '15px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-20px', width: '4px', height: '20px', background: '#10b981', top: '-9px' }}></div>
                            </div>
                            
                            <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 20px 0' }}>CANLI SPOR</h3>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        <span style={{ fontSize: '10px', color: '#10b981', fontFamily: 'monospace' }}>ODDS_SYNC: <span style={{ color: '#10b981' }}>STABLE</span></span>
                                    </div>
                                    <span style={{ fontSize: '9px', color: '#6b7280', fontFamily: 'monospace' }}>[ UPTIME: 99.9% ]</span>
                                </div>
                                
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: '1px dashed rgba(16,185,129,0.3)', position: 'relative' }} className="group-hover:border-emerald-500 transition-colors">
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(16,185,129,0.5)', margin: '0 auto' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ÖZEL ÜRETİM CARD */}
                    <div className="group relative rounded-xl overflow-hidden cursor-pointer" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', minHeight: '260px' }}>
                        {/* Background & Grid */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'url(https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=600&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'luminosity' }} className="group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, #0a0a0a 100%)' }}></div>
                        
                        {/* Content */}
                        <div style={{ position: 'relative', zIndex: 10, padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 12px', width: 'fit-content', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                                <span style={{ color: '#eab308', fontSize: '10px', fontFamily: 'monospace', letterSpacing: '1px' }}>SYS.ON _ORIGINAL</span>
                            </div>
                            
                            {/* Yellow Line */}
                            <div style={{ width: '100%', height: '2px', background: '#eab308', marginTop: 'auto', marginBottom: '15px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-20px', width: '4px', height: '20px', background: '#eab308', top: '-9px' }}></div>
                            </div>
                            
                            <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', margin: '0 0 20px 0' }}>ÖZEL ÜRETİM</h3>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        <span style={{ fontSize: '10px', color: '#eab308', fontFamily: 'monospace' }}>ALGORITHM: <span style={{ color: '#10b981' }}>FAIR</span></span>
                                    </div>
                                    <span style={{ fontSize: '9px', color: '#6b7280', fontFamily: 'monospace' }}>[ RTP: 99.0% ]</span>
                                </div>
                                
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(234,179,8,0.1)', display: 'flex', alignItems: 'center', justifyItems: 'center', border: '1px dashed rgba(234,179,8,0.3)', position: 'relative' }} className="group-hover:border-yellow-500 transition-colors">
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eab308', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(234,179,8,0.5)', margin: '0 auto' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#000" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '2px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default TV724View;
