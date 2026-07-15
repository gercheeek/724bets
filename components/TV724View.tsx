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
    { id: 'live', tag: 'CANLI YAYIN', tagColor: '#ef4444', title: 'TÜRKİYE\'NİN İLK KUMAR TV\'Sİ', subtitle: '7/24 Canlı Bahis & Spor Analizi', cta: 'YAYINI İZLE', ctaColor: '#ef4444', bg: 'linear-gradient(135deg, #0a0000 0%, #1a0000 40%, #0d0407 100%)', accent: '#ef4444', emoji: '📺', imageUrl: null },
    { id: 'tournament', tag: 'BÜYÜK TURNUVA', tagColor: '#00FFA3', title: '₺500.000 ÖDÜL HAVUZU', subtitle: 'Özel Turnuvaya Katıl — Her Cuma Çekiliş', cta: 'HEMEN KATIL', ctaColor: '#00FFA3', bg: 'linear-gradient(135deg, #0a0800 0%, #1a1000 40%, #0d0a00 100%)', accent: '#00FFA3', emoji: '🏆', imageUrl: null },
];



const FLASH_EVENTS = [
    { type: 'bonus', icon: '🎰', title: 'BONUS KODU!', description: 'Bu yayına özel anlık bonus!', code: 'TV724BONUS', reward: '%100 İlk Yatırım Bonusu', color: '#00FFA3', duration: 60 },
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

const GROUP_ORDER = [
  '🏆 SPOR KANALLARI',
  '📺 ULUSAL KANALLAR'
];

const getChannelGroup = (name: string): string => {
    const n = name.toLowerCase();
    if (n.includes('trt 1') || n.includes('atv') || n.includes('tv 8') || n.includes('tv 8,5') || n.includes('tv8')) {
        return '📺 ULUSAL KANALLAR';
    }
    return '🏆 SPOR KANALLARI';
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
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            const { data: configData } = await supabase.from('site_configs').select('value').eq('key', 'site_tv_config').maybeSingle();
            if (configData?.value) {
                setCurrentConfig({
                    ...configData.value,
                    channels: DEFAULT_TV_CONFIG.channels
                });
            } else {
                setCurrentConfig(DEFAULT_TV_CONFIG);
            }

            let mergedStreamers: any[] = [];
            const { data: streamersData } = await supabase.from('streamers').select('*').order('order_index', { ascending: true });
            if (streamersData) mergedStreamers = [...streamersData];

            if (DEFAULT_TV_CONFIG.channels) {
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

            const { data: vodsData } = await supabase.from('vods').select('*').order('created_at', { ascending: false });
            if (vodsData && vodsData.length > 0) {
                setVods(vodsData);
            } else if (configData?.value?.vods) {
                setVods(configData.value.vods);
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
            role: msgObj.role,
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
            if (platform === 'youtube') {
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
        if (sourceType === 'iframe') return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{!isIframeLoaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', zIndex: 10 }}><div style={{ width: '32px', height: '32px', border: '2px solid rgba(0, 255, 163,0.3)', borderTopColor: '#00FFA3', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>}<iframe src={activeChannel.iframeUrl || activeChannel.streamUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;
        if (activeChannel.fallbackType === 'video' && activeChannel.fallbackVideoUrl) return <div style={{ width: '100%', height: '100%', background: '#000' }}><video ref={videoRef} src={activeChannel.fallbackVideoUrl} autoPlay={isPlaying} muted={isMuted} playsInline loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>;
        if (activeChannel.fallbackType === 'iframe' && activeChannel.fallbackIframeUrl) return <div style={{ width: '100%', height: '100%', position: 'relative' }}><iframe src={activeChannel.fallbackIframeUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;

        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#00FFA3', gap: '12px', background: 'radial-gradient(circle, #111118 0%, #040507 100%)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0, 255, 163,0.06)', border: '1px solid rgba(0, 255, 163,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-slow 3s infinite' }}>
                    <Tv style={{ width: 24, height: 24, color: '#00FFA3', opacity: 0.8 }} />
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
        <div ref={wrapperRef} style={{ width: '100%', height: '100%', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');

                @keyframes floatUp { 0%{transform:translateY(20px) scale(0.5);opacity:0} 15%{opacity:1;transform:translateY(0) scale(1.2)} 80%{opacity:.8} 100%{transform:translateY(-240px) scale(.6);opacity:0} }
                @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
                @keyframes pulse-slow { 0%,100%{opacity:.9;box-shadow:0 0 10px rgba(0, 255, 163,.05)} 50%{opacity:.6;box-shadow:0 0 25px rgba(0, 255, 163,.2)} }
                @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
                @keyframes glow-live { 0%,100%{box-shadow:0 0 8px rgba(239,68,68,.4),0 0 20px rgba(239,68,68,.1)} 50%{box-shadow:0 0 20px rgba(239,68,68,.8),0 0 40px rgba(239,68,68,.3)} }
                @keyframes card-active-glow { 0%{box-shadow:0 0 8px rgba(173,255,47,.3)} 100%{box-shadow:0 0 30px rgba(173,255,47,.9)} }
                @keyframes hero-in { from{opacity:0;transform:scale(1.02)} to{opacity:1;transform:scale(1)} }
                @keyframes badge-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
                @keyframes skeleton-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
                @keyframes flash-in { from{opacity:0;transform:translate(-50%,-50%) scale(.85)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
                @keyframes toast-in { from{opacity:0;transform:translateX(120%)} to{opacity:1;transform:translateX(0)} }
                @keyframes odds-flash-up { 0%{color:#22c55e;text-shadow:0 0 8px rgba(34,197,94,.6)} 100%{color:inherit;text-shadow:none} }
                @keyframes slide-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

                .tv-wrap { max-width:1400px; margin:0 auto; width:100%; padding:0 16px; display:flex; flex-direction:column; gap:20px; padding-top:16px; }
                .player-chat-row { display:flex; gap:20px; width:100%; align-items:stretch; }
                .player-wrap { flex:1; aspect-ratio:16/9; min-width:280px; position:relative; }
                .chat-wrap { width:340px; position:relative; flex-shrink:0; }
                .chat-inner { position:absolute; inset:0; width:100%; height:100%; display:flex; flex-direction:column; }

                .player-hover:hover .ctrl-bar { opacity:1!important; }
                .fifa-card { transition:all .3s cubic-bezier(.25,.8,.25,1); }
                .fifa-card:hover { transform:translateY(-10px) scale(1.05); filter:brightness(1.1); }
                .fifa-card-active { animation:card-active-glow 2s ease-in-out infinite alternate; }
                .vod-card:hover { transform:translateY(-4px)!important; border-color:rgba(0, 255, 163,.4)!important; box-shadow:0 8px 20px rgba(0, 255, 163,.1)!important; }
                .hero-arrow:hover { background:rgba(255,255,255,.2)!important; transform:scale(1.1); }
                .program-card:hover { border-color:rgba(255,255,255,.15)!important; transform:translateY(-2px); }
                .chat-input-wrap:focus-within { border-color:rgba(173,255,47,.5)!important; }
                .odds-btn:hover { filter:brightness(1.15); transform:scale(1.03); }
                .odds-btn-selected { box-shadow:0 0 0 2px #00FFA3, 0 0 12px rgba(0, 255, 163,.3)!important; }
                .section-label { font-size:11px; font-weight:900; color:#6b7280; text-transform:uppercase; letter-spacing:2px; display:flex; align-items:center; gap:8px; }
                .section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(255,255,255,.06),transparent); }

                .custom-scrollbar::-webkit-scrollbar { height:4px; width:4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background:rgba(255,255,255,.01); border-radius:99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(0, 255, 163,.2); border-radius:99px; }
                .chat-message-row:hover .admin-msg-controls { display:flex!important; }

                /* ── Mobile ── */
                .mobile-only { display:none!important; }
                .desktop-content { display:contents; }
                @media (max-width: 900px) {
                    .player-chat-row { flex-direction:column; }
                    .chat-wrap { width:100%; height:380px; }
                    .chat-inner { position:relative; }
                }
                @media (max-width: 700px) {
                    .mobile-only { display:flex!important; }
                    .desktop-player-chat { display:none!important; }
                    .mobile-content-area { display:flex; flex-direction:column; }
                    .tv-wrap { padding-bottom:80px; }
                }
            `}</style>



            {/* ═══ FLASH EVENT POPUP ════════════════════════════════════════ */}
            {flashEvent && flashCountdown > 0 && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    onClick={(e) => { if (e.target === e.currentTarget) { setFlashEvent(null); } }}>
                    <div style={{ background: 'linear-gradient(135deg, #0d0d14 0%, #111120 100%)', border: `1px solid ${flashEvent.color}44`, borderRadius: '8px', padding: '32px', maxWidth: '400px', width: '100%', position: 'relative', boxShadow: `0 0 60px ${flashEvent.color}22`, animation: 'flash-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        {/* Countdown ring */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${flashEvent.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, color: flashEvent.color }}>{userRole === 'admin' ? '∞' : flashCountdown}</div>
                        </div>
                        <button onClick={() => setFlashEvent(null)} style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '28px', height: '28px', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X style={{ width: 13, height: 13 }} /></button>

                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{flashEvent.icon}</div>
                            <div style={{ display: 'inline-block', background: `${flashEvent.color}22`, border: `1px solid ${flashEvent.color}44`, borderRadius: '8px', padding: '4px 14px', fontSize: '10px', fontWeight: 900, color: flashEvent.color, letterSpacing: '1px', marginBottom: '12px', animation: 'badge-pulse 1.5s infinite' }}>
                                {flashEvent.type === 'quiz' ? '⚡ FLASH QUIZ' : flashEvent.type === 'bonus' ? '🎁 BONUS FIRSAT' : '🎡 ŞANS ÇEVİRMECESİ'}
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>{flashEvent.title}</h2>
                            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '20px', lineHeight: 1.5 }}>{flashEvent.description}</p>

                            {flashEvent.type === 'bonus' && (
                                <div>
                                    <div style={{ background: '#111116', border: `1px dashed ${flashEvent.color}88`, borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', fontWeight: 700 }}>BONUS KODU</div>
                                        <div style={{ fontSize: '22px', fontWeight: 900, color: flashEvent.color, letterSpacing: '3px', fontFamily: "'Outfit', sans-serif" }}>{flashEvent.code}</div>
                                    </div>
                                    <button style={{ width: '100%', padding: '14px', borderRadius: '8px', background: `linear-gradient(135deg, ${flashEvent.color}, ${flashEvent.color}aa)`, border: 'none', color: '#000', fontWeight: 900, fontSize: '14px', cursor: 'pointer', letterSpacing: '0.5px' }}>
                                        KODU KOPYALA & KULLAN
                                    </button>
                                </div>
                            )}

                            {flashEvent.type === 'quiz' && flashEvent.options && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                    {flashEvent.options.map((opt, i) => (
                                        <button key={i} onClick={() => setQuizAnswer(opt)}
                                            style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${quizAnswer === opt ? flashEvent.color : 'rgba(255,255,255,0.1)'}`, background: quizAnswer === opt ? `${flashEvent.color}22` : 'rgba(255,255,255,0.03)', color: quizAnswer === opt ? flashEvent.color : '#e5e7eb', fontWeight: 800, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${quizAnswer === opt ? flashEvent.color : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, color: quizAnswer === opt ? flashEvent.color : '#6b7280' }}>{i + 1}</div>
                                            {opt}
                                        </button>
                                    ))}
                                    {quizAnswer && (
                                        <button style={{ padding: '13px', borderRadius: '8px', background: `linear-gradient(135deg, ${flashEvent.color}, ${flashEvent.color}bb)`, border: 'none', color: '#000', fontWeight: 900, fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}>
                                            {flashEvent.reward} — YANITI GÖNDER
                                        </button>
                                    )}
                                </div>
                            )}

                            {flashEvent.type === 'spin' && (
                                <button onClick={() => setFlashEvent(null)} style={{ width: '100%', padding: '14px', borderRadius: '8px', background: `linear-gradient(135deg, ${flashEvent.color}, ${flashEvent.color}99)`, border: 'none', color: '#000', fontWeight: 900, fontSize: '14px', cursor: 'pointer' }}>
                                    🎡 ÇARKI ÇEVİR — {flashEvent.reward}
                                </button>
                            )}

                            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>
                                🏆 Ödül: <strong style={{ color: flashEvent.color }}>{flashEvent.reward}</strong>
                            </div>
                        </div>

                        {/* Countdown bar */}
                        <div style={{ marginTop: '16px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: flashEvent.color, borderRadius: '99px', width: userRole === 'admin' ? '100%' : `${(flashCountdown / flashEvent.duration) * 100}%`, transition: 'width 1s linear', boxShadow: `0 0 8px ${flashEvent.color}` }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                MAIN CONTENT
            ════════════════════════════════════════════════════════════════ */}
            <div className="tv-wrap animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0' : '24px 16px', display: 'flex', flexDirection: 'column', gap: isMobile ? '0' : '24px' }}>
                
                {/* Side-by-Side: Video Player (left) + Channels List (right) */}
                <div style={{ display: 'flex', gap: isMobile ? '0' : '20px', width: '100%', flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch' }}>
                    
                    {/* Left Column: Video Player */}
                    <div style={{ flex: 1.8, minWidth: isMobile ? '100%' : '320px', display: 'flex', flexDirection: 'column', gap: isMobile ? '0' : '16px', position: isMobile ? 'sticky' : 'relative', top: isMobile ? 0 : 'auto', zIndex: isMobile ? 100 : 1, background: isMobile ? '#000' : 'transparent', borderBottom: isMobile ? '1px solid rgba(255,255,255,0.05)' : 'none', boxShadow: isMobile ? '0 10px 30px rgba(0,0,0,0.8)' : 'none' }}>
                        {!isMiniPlayer ? (
                            <div ref={playerContainerRef} className={isMobile ? '' : 'player-hover'} style={{ width: '100%', aspectRatio: '16/9', position: 'relative', background: '#000', borderRadius: isMobile ? '0' : '8px', overflow: 'hidden', border: activeChannel?.isLive && !isMobile ? '1.5px solid rgba(239, 68, 68, 0.4)' : isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.08)', boxShadow: isMobile ? 'none' : '0 20px 50px rgba(0,0,0,0.7)', transition: 'all 0.3s ease' }}>
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    <div style={{ width: '100%', height: '100%', filter: showPaywall ? 'blur(8px)' : 'none', transition: 'filter 0.5s', pointerEvents: showPaywall ? 'none' : 'auto' }}>
                                        {activeChannel ? (
                                            getStreamEmbed()
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#00FFA3', gap: '16px', background: 'radial-gradient(circle, #111118 0%, #040507 100%)' }}>
                                                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0, 255, 163, 0.06)', border: '1px solid rgba(0, 255, 163, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-slow 3s infinite' }}>
                                                    <Tv style={{ width: 32, height: 32, color: '#00FFA3', opacity: 0.8 }} />
                                                </div>
                                                <p style={{ fontSize: '15px', color: '#9ca3af', fontWeight: 700, letterSpacing: '0.5px' }}>Lütfen bir kanal veya maç seçiniz</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {showPaywall && (
                                        <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                                            <div style={{ background: 'rgba(15, 17, 26, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: isMobile ? '20px' : '30px 40px', borderRadius: '8px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 20px 45px rgba(0,0,0,0.6)', margin: isMobile ? '16px' : '0' }}>
                                                <h2 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Heyecanı Kaçırma!</h2>
                                                <p style={{ fontSize: '13px', color: '#d1d5db', marginBottom: '24px', lineHeight: 1.5 }}>15 saniyelik önizleme süren doldu. Ücretsiz üye ol, tüm canlı yayınlara ve özel sohbet odalarına anında erişim sağla.</p>
                                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                                    <button onClick={onLoginRequired} style={{ background: '#00FFA3', color: '#000', fontWeight: 900, padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'transform 0.2s' }} className="hover:scale-105">ÜYE GİRİŞİ</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {activeChannel && !showPaywall && (
                                        <div className="ctrl-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: isMobile ? '0 16px' : '0 24px', zIndex: 45, opacity: isMobile ? 1 : 0, transition: 'opacity 0.25s' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>{isPlaying ? <Pause style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16 }} />}</button>
                                                <button onClick={() => setIsMuted(!isMuted)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>{isMuted ? <VolumeX style={{ width: 16, height: 16, color: '#ef4444' }} /> : <Volume2 style={{ width: 16, height: 16, color: '#adff2f' }} />}</button>
                                                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '0.5px' }}>{activeChannel.name.toUpperCase()}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {isMobile && (
                                                    <button onClick={() => {
                                                        const el = playerContainerRef.current;
                                                        if (el) {
                                                            if (document.fullscreenElement) document.exitFullscreen();
                                                            else el.requestFullscreen();
                                                        }
                                                    }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                        <Maximize style={{ width: 16, height: 16 }} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ width: '100%', aspectRatio: '16/9', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(0, 255, 163, 0.3)', borderRadius: isMobile ? '0' : '8px', background: 'rgba(0, 255, 163, 0.02)', gap: '16px', padding: '24px', textAlign: 'center' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(0, 255, 163, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Tv style={{ width: 20, height: 20, color: '#00FFA3' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Mini Oynatıcı Aktif</h4>
                                    <p style={{ fontSize: '11px', color: '#6b7280' }}>Yayın ekranın sağ alt köşesinde ufak pencerede oynamaya devam ediyor.</p>
                                </div>
                                <button onClick={() => setIsMiniPlayer(false)} style={{ background: 'rgba(0, 255, 163, 0.1)', border: '1px solid rgba(0, 255, 163, 0.2)', borderRadius: '8px', color: '#00FFA3', fontSize: '12px', fontWeight: 800, padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s' }}>Oynatıcıyı Geri Getir</button>
                            </div>
                        )}
                    </div>
                    
                    {/* Right Column: Channels List */}
                    <div style={{ width: isMobile ? '100%' : '340px', display: 'flex', flexDirection: 'column', background: isMobile ? 'transparent' : 'rgba(255,255,255,0.02)', border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)', borderRadius: isMobile ? '0' : '8px', padding: isMobile ? '16px' : '16px', flexShrink: 0, height: isMobile ? 'auto' : 'auto', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexShrink: 0 }}>
                            <span style={{ fontSize: '11px', fontWeight: 900, color: '#6b7280', letterSpacing: '1px' }}>CANLI KANALLAR</span>
                            <div style={{ position: 'relative', width: '150px' }}>
                                <input 
                                    type="text" 
                                    placeholder="Kanal ara..." 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 10px 6px 28px', color: '#fff', fontSize: '11px', outline: 'none' }}
                                />
                                <Search style={{ width: 10, height: 10, color: '#6b7280', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                            </div>
                        </div>
                        
                        {/* Scrollable list of channels */}
                        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                            <div className="custom-scrollbar" style={{ position: isMobile ? 'relative' : 'absolute', inset: isMobile ? 'auto' : 0, overflowY: isMobile ? 'visible' : 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: isMobile ? '0' : '4px' }}>
                                {(() => {
                                    const filtered = streamers.filter(s => !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()));
                                    if (filtered.length === 0) {
                                        return <div style={{ textAlign: 'center', padding: '20px 0', color: '#6b7280', fontSize: '12px' }}>Kanal bulunamadı.</div>;
                                    }

                                    // Group channels
                                    const groups: Record<string, Streamer[]> = {};
                                    filtered.forEach(s => {
                                        const grp = getChannelGroup(s.name);
                                        if (!groups[grp]) groups[grp] = [];
                                        groups[grp].push(s);
                                    });

                                    // Sort group keys based on GROUP_ORDER
                                    const sortedGroupNames = Object.keys(groups).sort((a, b) => {
                                        const idxA = GROUP_ORDER.indexOf(a);
                                        const idxB = GROUP_ORDER.indexOf(b);
                                        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
                                    });

                                    return sortedGroupNames.map(groupName => (
                                        <div key={groupName} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 900, color: '#00FFA3', padding: '6px 4px 2px 4px', borderBottom: '1px solid rgba(0, 255, 163, 0.15)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                                {groupName}
                                            </div>
                                            {groups[groupName].map(s => {
                                                const isLive = s.is_live;
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
                                                            background: isActive ? 'linear-gradient(135deg, rgba(0, 255, 163, 0.15), rgba(0, 255, 163, 0.03))' : 'rgba(255,255,255,0.02)',
                                                            border: '1px solid ' + (isActive ? '#00FFA3' : 'rgba(255,255,255,0.04)'),
                                                            borderRadius: isMobile ? '12px' : '8px', padding: isMobile ? '12px 16px' : '10px 12px', cursor: 'pointer', transition: 'all 0.2s ease',
                                                            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '8px' : '0'
                                                        }}
                                                        onMouseEnter={e => { if(!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                                        onMouseLeave={e => { if(!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}
                                                    >
                                                        <div style={{ width: isMobile ? '48px' : '40px', height: isMobile ? '48px' : '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0, padding: '2px' }}>
                                                            <img src={getChannelLogo(s.name, s.avatar_url)} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                                        </div>
                                                        <div style={{ flex: 1, minWidth: 0, marginLeft: '4px' }}>
                                                            <div style={{ fontSize: isMobile ? '15px' : '14px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                                                            <div style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>{s.platform_type}</div>
                                                        </div>
                                                        {isLive ? (
                                                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                                                                <span style={{ fontSize: '9px', fontWeight: 900, color: '#ef4444' }}>CANLI</span>
                                                            </div>
                                                        ) : (
                                                            <span style={{ fontSize: '10px', color: '#4b5563', fontWeight: 800 }}>OFFLINE</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TV724View;
