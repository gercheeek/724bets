import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TVConfig, TVChannel, TVChatMessage, Streamer, VOD, Gift } from '../types';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import {
    Send, Users, MessageSquare, Tv, Zap, Crown, Star, Shield, X, Lock, Unlock, Search,
    Flame, Award, Play, Pause, Volume2, VolumeX, Maximize, Minimize2,
    ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Radio, Trophy, Calendar, TrendingUp, ArrowRight,
    Bell, BellOff, Gift as GiftIcon, CheckCircle, AlertCircle, BarChart2,
} from 'lucide-react';

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const HERO_SLIDES = [
    { id: 'live', tag: 'CANLI YAYIN', tagColor: '#ef4444', title: 'TÜRKİYE\'NİN İLK KUMAR TV\'Sİ', subtitle: '7/24 Canlı Bahis & Spor Analizi', cta: 'YAYINI İZLE', ctaColor: '#ef4444', bg: 'linear-gradient(135deg, #0a0000 0%, #1a0000 40%, #0d0407 100%)', accent: '#ef4444', emoji: '📺', imageUrl: null },
    { id: 'tournament', tag: 'BÜYÜK TURNUVA', tagColor: '#F0B90B', title: '₺500.000 ÖDÜL HAVUZU', subtitle: 'Özel Turnuvaya Katıl — Her Cuma Çekiliş', cta: 'HEMEN KATIL', ctaColor: '#F0B90B', bg: 'linear-gradient(135deg, #0a0800 0%, #1a1000 40%, #0d0a00 100%)', accent: '#F0B90B', emoji: '🏆', imageUrl: null },
];



const FLASH_EVENTS = [
    { type: 'bonus', icon: '🎰', title: 'BONUS KODU!', description: 'Bu yayına özel anlık bonus!', code: 'TV724BONUS', reward: '%100 İlk Yatırım Bonusu', color: '#F0B90B', duration: 60 },
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
    const nameLower = channelName.toLowerCase();
    // Check known channel names FIRST to always show proper logos
    if (nameLower.includes('724tv') || nameLower.includes('7/24')) return 'https://img.icons8.com/color/96/television.png';
    if (nameLower.includes('bein') || nameLower.includes('lig tv')) return 'https://upload.wikimedia.org/wikipedia/commons/e/e0/BeIN_Sports_logo.svg';
    if (nameLower.includes('s sport')) return 'https://upload.wikimedia.org/wikipedia/tr/d/d7/S_Sport_logo.png';
    if (nameLower.includes('trt spor')) return 'https://upload.wikimedia.org/wikipedia/commons/e/ee/TRT_Spor_logo.svg';
    if (nameLower.includes('trt 1') || nameLower.includes('trt1')) return 'https://upload.wikimedia.org/wikipedia/commons/5/5f/TRT_1_logo.svg';
    if (nameLower.includes('a spor')) return 'https://upload.wikimedia.org/wikipedia/tr/b/bf/A_spor_logo.png';
    if (nameLower.includes('tivibu')) return 'https://upload.wikimedia.org/wikipedia/tr/2/23/Tivibu_logo.png';
    if (nameLower.includes('exxen')) return 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Exxen_logo.png';
    if (nameLower.includes('tv8.5') || nameLower.includes('tv8')) return 'https://upload.wikimedia.org/wikipedia/commons/d/de/TV8_logo.svg';
    if (nameLower.includes('mac') || nameLower.includes('maç') || nameLower.includes('futbol') || nameLower.includes('taraftar')) return 'https://img.icons8.com/color/96/football.png';
    if (avatarUrl && avatarUrl.trim()) return avatarUrl;
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

const getChannelGroup = (name: string): string => {
    const n = name.toLowerCase().replace(/\s+/g, '');
    if (n.includes('bein')) return 'beIN SPORTS';
    if (n.includes('ssport')) return 'S Sport';
    if (n.includes('smartspor')) return 'Smart Spor';
    if (n.includes('tivibu')) return 'Tivibu Spor';
    if (n.includes('trt')) return 'TRT';
    if (n.includes('atv') || n.includes('tv8') || n.includes('tv8,5') || n.includes('tv8.5')) return 'Ulusal';
    return 'Diğer';
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

interface TV724ViewProps { config: TVConfig; siteUser: any; userRole: string | null; onBack: () => void; onLoginRequired?: () => void; }
interface FloatingEmoji { id: number; emoji: string; style: React.CSSProperties; }

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TV724View: React.FC<TV724ViewProps> = ({ config, siteUser, userRole, onBack, onLoginRequired }) => {
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
            if (configData?.value) setCurrentConfig(configData.value);

            let mergedStreamers: any[] = [];
            const { data: streamersData } = await supabase.from('streamers').select('*').order('order_index', { ascending: true });
            if (streamersData) mergedStreamers = [...streamersData];

            if (configData?.value?.channels) {
                configData.value.channels.forEach((ch: any) => {
                    const ms = { id: ch.id, name: ch.name, kick_username: ch.platformUsername || ch.slug || ch.streamUrl, platform_type: ch.platformType || ch.platform, avatar_url: ch.thumbnailUrl, tags: ch.tags || [ch.category], is_live: ch.isLive, is_vip: ch.isVip, source_type: ch.sourceType, video_url: ch.videoUrl, iframe_url: ch.iframeUrl, order_index: ch.order, fallback_type: ch.fallback_type, fallback_video_url: ch.fallback_video_url, fallback_iframe_url: ch.fallback_iframe_url };
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
            if (vodsData) setVods(vodsData);

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
            
            const myUserId = siteUser.id || siteUser.username;
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
        if (sourceType === 'iframe') return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{!isIframeLoaded && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', zIndex: 10 }}><div style={{ width: '32px', height: '32px', border: '2px solid rgba(240,185,11,0.3)', borderTopColor: '#F0B90B', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>}<iframe src={activeChannel.iframeUrl || activeChannel.streamUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;
        if (activeChannel.fallbackType === 'video' && activeChannel.fallbackVideoUrl) return <div style={{ width: '100%', height: '100%', background: '#000' }}><video ref={videoRef} src={activeChannel.fallbackVideoUrl} autoPlay={isPlaying} muted={isMuted} playsInline loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>;
        if (activeChannel.fallbackType === 'iframe' && activeChannel.fallbackIframeUrl) return <div style={{ width: '100%', height: '100%', position: 'relative' }}><iframe src={activeChannel.fallbackIframeUrl} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media; fullscreen; picture-in-picture" onLoad={() => setIsIframeLoaded(true)} title={activeChannel.name} /></div>;

        return (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F0B90B', gap: '12px', background: 'radial-gradient(circle, #111118 0%, #040507 100%)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(240,185,11,0.06)', border: '1px solid rgba(240,185,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-slow 3s infinite' }}>
                    <Tv style={{ width: 24, height: 24, color: '#F0B90B', opacity: 0.8 }} />
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.5px' }}>YAYIN YAKINDA BAŞLAYACAK</p>
            </div>
        );
    };

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

    return (
        <div ref={wrapperRef} style={{ minHeight: '100vh', background: '#040507', fontFamily: "'Inter', sans-serif", paddingBottom: '80px' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');

                @keyframes floatUp { 0%{transform:translateY(20px) scale(0.5);opacity:0} 15%{opacity:1;transform:translateY(0) scale(1.2)} 80%{opacity:.8} 100%{transform:translateY(-240px) scale(.6);opacity:0} }
                @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
                @keyframes pulse-slow { 0%,100%{opacity:.9;box-shadow:0 0 10px rgba(240,185,11,.05)} 50%{opacity:.6;box-shadow:0 0 25px rgba(240,185,11,.2)} }
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
                .vod-card:hover { transform:translateY(-4px)!important; border-color:rgba(240,185,11,.4)!important; box-shadow:0 8px 20px rgba(240,185,11,.1)!important; }
                .hero-arrow:hover { background:rgba(255,255,255,.2)!important; transform:scale(1.1); }
                .program-card:hover { border-color:rgba(255,255,255,.15)!important; transform:translateY(-2px); }
                .chat-input-wrap:focus-within { border-color:rgba(173,255,47,.5)!important; }
                .odds-btn:hover { filter:brightness(1.15); transform:scale(1.03); }
                .odds-btn-selected { box-shadow:0 0 0 2px #F0B90B, 0 0 12px rgba(240,185,11,.3)!important; }
                .section-label { font-size:11px; font-weight:900; color:#6b7280; text-transform:uppercase; letter-spacing:2px; display:flex; align-items:center; gap:8px; }
                .section-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(255,255,255,.06),transparent); }

                .custom-scrollbar::-webkit-scrollbar { height:4px; width:4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background:rgba(255,255,255,.01); border-radius:99px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background:rgba(240,185,11,.2); border-radius:99px; }
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
                    <div style={{ background: 'linear-gradient(135deg, #0d0d14 0%, #111120 100%)', border: `1px solid ${flashEvent.color}44`, borderRadius: '24px', padding: '32px', maxWidth: '400px', width: '100%', position: 'relative', boxShadow: `0 0 60px ${flashEvent.color}22`, animation: 'flash-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        {/* Countdown ring */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${flashEvent.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, color: flashEvent.color }}>{userRole === 'admin' ? '∞' : flashCountdown}</div>
                        </div>
                        <button onClick={() => setFlashEvent(null)} style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '28px', height: '28px', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X style={{ width: 13, height: 13 }} /></button>

                        <div style={{ textAlign: 'center', marginTop: '8px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{flashEvent.icon}</div>
                            <div style={{ display: 'inline-block', background: `${flashEvent.color}22`, border: `1px solid ${flashEvent.color}44`, borderRadius: '20px', padding: '4px 14px', fontSize: '10px', fontWeight: 900, color: flashEvent.color, letterSpacing: '1px', marginBottom: '12px', animation: 'badge-pulse 1.5s infinite' }}>
                                {flashEvent.type === 'quiz' ? '⚡ FLASH QUIZ' : flashEvent.type === 'bonus' ? '🎁 BONUS FIRSAT' : '🎡 ŞANS ÇEVİRMECESİ'}
                            </div>
                            <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '8px', fontFamily: "'Outfit', sans-serif" }}>{flashEvent.title}</h2>
                            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '20px', lineHeight: 1.5 }}>{flashEvent.description}</p>

                            {flashEvent.type === 'bonus' && (
                                <div>
                                    <div style={{ background: '#111116', border: `1px dashed ${flashEvent.color}88`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', fontWeight: 700 }}>BONUS KODU</div>
                                        <div style={{ fontSize: '22px', fontWeight: 900, color: flashEvent.color, letterSpacing: '3px', fontFamily: "'Outfit', sans-serif" }}>{flashEvent.code}</div>
                                    </div>
                                    <button style={{ width: '100%', padding: '14px', borderRadius: '12px', background: `linear-gradient(135deg, ${flashEvent.color}, ${flashEvent.color}aa)`, border: 'none', color: '#000', fontWeight: 900, fontSize: '14px', cursor: 'pointer', letterSpacing: '0.5px' }}>
                                        KODU KOPYALA & KULLAN
                                    </button>
                                </div>
                            )}

                            {flashEvent.type === 'quiz' && flashEvent.options && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                    {flashEvent.options.map((opt, i) => (
                                        <button key={i} onClick={() => setQuizAnswer(opt)}
                                            style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${quizAnswer === opt ? flashEvent.color : 'rgba(255,255,255,0.1)'}`, background: quizAnswer === opt ? `${flashEvent.color}22` : 'rgba(255,255,255,0.03)', color: quizAnswer === opt ? flashEvent.color : '#e5e7eb', fontWeight: 800, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `2px solid ${quizAnswer === opt ? flashEvent.color : 'rgba(255,255,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, color: quizAnswer === opt ? flashEvent.color : '#6b7280' }}>{i + 1}</div>
                                            {opt}
                                        </button>
                                    ))}
                                    {quizAnswer && (
                                        <button style={{ padding: '13px', borderRadius: '10px', background: `linear-gradient(135deg, ${flashEvent.color}, ${flashEvent.color}bb)`, border: 'none', color: '#000', fontWeight: 900, fontSize: '13px', cursor: 'pointer', marginTop: '4px' }}>
                                            {flashEvent.reward} — YANITI GÖNDER
                                        </button>
                                    )}
                                </div>
                            )}

                            {flashEvent.type === 'spin' && (
                                <button onClick={() => setFlashEvent(null)} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: `linear-gradient(135deg, ${flashEvent.color}, ${flashEvent.color}99)`, border: 'none', color: '#000', fontWeight: 900, fontSize: '14px', cursor: 'pointer' }}>
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
            <div className="tv-wrap">



                {/* ── MOBILE TAB NAV ─────────────────────────────────────── */}
                <div className="mobile-only" style={{ position: 'sticky', top: 0, zIndex: 500, background: '#070910', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0', flexDirection: 'row', justifyContent: 'stretch', borderRadius: '12px', overflow: 'hidden' }}>
                    {MOBILE_TABS.map(tab => (
                        <button key={tab.id} onClick={() => setMobileTab(tab.id)}
                            style={{ flex: 1, padding: '12px 4px 10px', border: 'none', cursor: 'pointer', background: mobileTab === tab.id ? 'rgba(240,185,11,0.1)' : 'transparent', borderBottom: `2px solid ${mobileTab === tab.id ? '#F0B90B' : 'transparent'}`, color: mobileTab === tab.id ? '#F0B90B' : '#6b7280', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all .2s', fontSize: '10px', fontWeight: 800, letterSpacing: '0.3px' }}>
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── SWIPEABLE CONTENT AREA ─────────────────────────────── */}
                <div ref={swipeableRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

                    {/* ── PLAYER + CHAT ROW (Desktop: always visible, Mobile: tab-controlled) ── */}
                    <div className="player-chat-row desktop-player-chat">
                        {/* VIDEO PLAYER */}
                        {!isMiniPlayer && (
                            <div className="player-wrap">
                                {isDataLoading ? (
                                    <div style={{ width: '100%', height: '100%', background: '#0C0E14', borderRadius: '18px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Skeleton width="100%" height="100%" borderRadius="18px" />
                                    </div>
                                ) : (
                                    <div ref={playerContainerRef} className="player-hover" style={{ width: '100%', height: '100%', position: 'relative', background: '#000', borderRadius: '18px', overflow: 'hidden', border: activeChannel?.isLive ? '1px solid rgba(239,68,68,.25)' : '1px solid rgba(255,255,255,.06)', boxShadow: activeChannel?.isLive ? '0 0 0 1px rgba(239,68,68,.1),0 12px 40px rgba(0,0,0,.6)' : '0 8px 32px rgba(0,0,0,.5)', animation: activeChannel?.isLive ? 'glow-live 3s ease-in-out infinite' : 'none' }}>
                                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                            <div style={{ width: '100%', height: '100%', filter: showPaywall ? 'blur(8px)' : 'none', transition: 'filter 0.5s', pointerEvents: showPaywall ? 'none' : 'auto' }}>
                                                {getStreamEmbed()}
                                            </div>
                                            {showPaywall && (
                                                <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                                                    <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', padding: '30px 40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                                        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '12px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Heyecanı Kaçırma!</h2>
                                                        <p style={{ fontSize: '14px', color: '#d1d5db', marginBottom: '24px', lineHeight: 1.5 }}>15 saniyelik önizleme süren doldu. Ücretsiz üye ol, tüm canlı yayınlara ve özel sohbet odalarına anında erişim sağla.</p>
                                                        <button onClick={onLoginRequired} style={{ background: '#F0B90B', color: '#000', border: 'none', padding: '12px 30px', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(240,185,11,0.4)', transition: 'all 0.2s', width: '100%' }}>Hemen Kayıt Ol</button>
                                                    </div>
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', inset: 0, background: 'transparent', zIndex: 10, cursor: 'pointer', pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); handlePlayerTap(); }} />

                                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', border: '1px solid rgba(255,255,255,.04)', boxShadow: 'inset 0 0 30px rgba(0,0,0,.4)', zIndex: 9 }} />
                                            {/* Floating emojis */}
                                            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 40, overflow: 'hidden' }}>
                                                {floatingEmojis.map(e => <div key={e.id} style={{ position: 'absolute', bottom: '20px', fontSize: '28px', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.5))', ...e.style }}>{e.emoji}</div>)}
                                            </div>
                                            {/* Controls bar */}
                                            <div className="ctrl-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '52px', background: 'linear-gradient(to top,rgba(0,0,0,.95),transparent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', zIndex: 45, opacity: 0, transition: 'opacity .25s' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '50%', width: '32px', height: '32px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        {isPlaying ? <Pause style={{ width: 14, height: 14 }} /> : <Play style={{ width: 14, height: 14, marginLeft: '1px' }} />}
                                                    </button>
                                                    <div onClick={(e) => { e.stopPropagation(); setFlashShown(false); }} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'linear-gradient(90deg,rgba(240,185,11,.25),rgba(240,185,11,.08))', border: '1px solid rgba(240,185,11,.3)', padding: '5px 10px', borderRadius: '16px', cursor: 'pointer' }}>
                                                        <Award style={{ width: 13, height: 13, color: '#F0B90B' }} />
                                                        <span style={{ fontSize: '10px', fontWeight: 900, color: '#F0B90B' }}>ÖDÜLLER</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}>
                                                        {isMuted ? <VolumeX style={{ width: 15, height: 15, color: '#ef4444' }} /> : <Volume2 style={{ width: 15, height: 15, color: '#ADFF2F' }} />}
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); setIsMiniPlayer(!isMiniPlayer); }} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}>
                                                        <Minimize2 style={{ width: 14, height: 14 }} />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); const el = playerContainerRef.current; if (!document.fullscreenElement) el?.requestFullscreen?.().catch(() => {}); else document.exitFullscreen?.(); }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center' }}>
                                                        <Maximize style={{ width: 15, height: 15 }} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {isMiniPlayer && (
                            <div className="player-wrap" style={{ background: '#0C0E14', borderRadius: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,215,0,.1)', color: '#6b7280', fontSize: '12px', gap: '8px' }}>
                                <Tv style={{ width: 24, height: 24, opacity: 0.3 }} />
                                <span>Mini Oynatıcı Aktif</span>
                                <button onClick={() => setIsMiniPlayer(false)} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '6px', color: '#9ca3af', fontSize: '11px', fontWeight: 700, padding: '6px 12px', cursor: 'pointer' }}>Geri Getir</button>
                            </div>
                        )}

                        {/* RIGHT PANEL: TABS (Sohbet / Kanallar / Maçlar) */}
                        <div className="chat-wrap">
                            <div className="chat-inner" style={{ background: 'rgba(8,10,16,.95)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '18px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,.5)', overflow: 'hidden' }}>
                                {/* ── Tab Bar ── */}
                                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,.05)', flexShrink: 0 }}>
                                    {[
                                        { id: 'chat' as const, label: 'Sohbet', icon: <MessageSquare style={{ width: 12, height: 12 }} /> },
                                        { id: 'channels' as const, label: 'Kanallar', icon: <Tv style={{ width: 12, height: 12 }} /> },
                                        { id: 'matches' as const, label: 'Maçlar', icon: <Trophy style={{ width: 12, height: 12 }} /> },
                                    ].map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setRightPanelTab(tab.id)}
                                            style={{
                                                flex: 1, padding: '10px 6px', border: 'none', cursor: 'pointer',
                                                background: rightPanelTab === tab.id ? 'rgba(240,185,11,0.08)' : 'transparent',
                                                borderBottom: `2px solid ${rightPanelTab === tab.id ? '#F0B90B' : 'transparent'}`,
                                                color: rightPanelTab === tab.id ? '#F0B90B' : '#6b7280',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                                                fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px', transition: 'all .2s',
                                            }}
                                        >
                                            {tab.icon}
                                            {tab.label.toUpperCase()}
                                        </button>
                                    ))}
                                </div>

                                {/* ── Tab: Sohbet ── */}
                                {rightPanelTab === 'chat' && (
                                    <>
                                        <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ADFF2F', animation: 'pulse 1.5s infinite', boxShadow: '0 0 6px rgba(173,255,47,.6)' }} />
                                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>CANLI SOHBET</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,.04)', borderRadius: '20px', padding: '4px 10px' }}>
                                                <Users style={{ width: 11, height: 11, color: '#9ca3af' }} />
                                                <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 700 }}>5K</span>
                                            </div>
                                        </div>
                                        <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }} className="custom-scrollbar">
                                            {isDataLoading ? (
                                                Array(5).fill(0).map((_, i) => (
                                                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                        <Skeleton width="60%" height="10px" />
                                                        <Skeleton width="90%" height="10px" />
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    <div style={{ fontSize: '10px', color: '#F0B90B', textAlign: 'center', padding: '8px 10px', background: 'rgba(240,185,11,.05)', borderRadius: '8px', border: '1px solid rgba(240,185,11,.08)' }}>✦ Canlı sohbeti izliyorsun</div>
                                                    {messages.map((msg, i) => (
                                                        <div key={msg.id || i} className="chat-message-row" style={{ display: 'flex', flexDirection: 'column', gap: '3px', position: 'relative', animation: 'slide-up .2s ease' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                                                {getRoleBadge(msg.role)}
                                                                <span style={{ fontSize: '11px', fontWeight: 800, color: getRoleColor(msg.role) }}>{msg.username}</span>
                                                                <span style={{ fontSize: '9px', color: '#4b5563' }}>{formatTime(msg.timestamp)}</span>
                                                            </div>
                            <div style={{ fontSize: '12px', color: '#d1d5db', lineHeight: '1.4', wordBreak: 'break-word' }}>{msg.message}</div>
                                                            {userRole === 'admin' && (
                                                                 <div className="admin-msg-controls" style={{ position: 'absolute', right: 0, top: 0, display: 'none', gap: '6px', background: 'rgba(0,0,0,.95)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,.1)' }}>
                                                                     <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => supabase.from('tv_chat').delete().eq('id', msg.id).then(() => setMessages(p => p.filter(m => m.id !== msg.id)))}><X style={{ width: 13, height: 13 }} /></button>
                                                                     <button style={{ background: 'transparent', border: 'none', color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => setActiveMutePopup(activeMutePopup === msg.id ? null : msg.id)}><Shield style={{ width: 13, height: 13 }} /></button>
                                                                 </div>
                                                             )}
                                                             {activeMutePopup === msg.id && (
                                                                 <div style={{ position: 'absolute', right: '40px', top: '24px', background: '#111116', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                                                                     <button onClick={() => handleMuteUser(msg.userId, msg.username, 5)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>5 Dakika Sustur</button>
                                                                     <button onClick={() => handleMuteUser(msg.userId, msg.username, 60)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>1 Saat Sustur</button>
                                                                     <button onClick={() => handleMuteUser(msg.userId, msg.username, -1)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>Süresiz Sustur</button>
                                                                     <button onClick={() => handleUnmuteUser(msg.userId)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#10b981', fontSize: '11px', textAlign: 'left', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.05)' }}>Cezayı Kaldır</button>
                                                                 </div>
                                                             )}
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>
                                        <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,.04)', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                                            {['⚽', '🔥', '🎉', '💸', '😮', '👑'].map(emoji => (
                                                <button key={emoji} onClick={() => { triggerReaction(emoji); sendMessage(emoji); }} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '8px', fontSize: '16px', padding: '4px 8px', cursor: 'pointer', transition: 'all .15s', lineHeight: 1 }}>{emoji}</button>
                                            ))}
                                        </div>
                                        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,.04)', background: 'rgba(0,0,0,.2)', flexShrink: 0 }}>
                                            {(siteUser || userRole === 'admin' || userRole === 'editor') ? (
                                                <div className="chat-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '4px 4px 4px 12px', transition: 'all .2s' }}>
                                                    <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Canlı sohbete katıl..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', outline: 'none' }} />
                                                    <button onClick={() => sendMessage()} disabled={!newMessage.trim()} style={{ width: '34px', height: '34px', borderRadius: '8px', background: newMessage.trim() ? '#ADFF2F' : 'rgba(255,255,255,.06)', color: newMessage.trim() ? '#000' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', border: 'none', transition: 'all .2s' }}>
                                                        <Send style={{ width: 14, height: 14 }} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div onClick={onLoginRequired} className="chat-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '4px 4px 4px 12px', transition: 'all .2s', cursor: 'pointer' }}>
                                                    <input type="text" readOnly placeholder="Sohbete katılmak için giriş yap" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', outline: 'none', cursor: 'pointer' }} />
                                                    <button disabled style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,.06)', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
                                                        <Send style={{ width: 14, height: 14 }} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* ── Tab: Kanallar ── */}
                                {rightPanelTab === 'channels' && (
                                    <>
                                        <div style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,.03)', flexShrink: 0 }}>
                                            <input
                                                type="text"
                                                placeholder="Kanal ara..."
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '6px 10px', color: '#fff', fontSize: '11px', outline: 'none' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }} className="custom-scrollbar">
                                            {(() => {
                                                const filtered = activeStreamers.filter(s => {
                                                    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.tags?.[0] || '').toLowerCase().includes(searchQuery.toLowerCase());
                                                    return matchesSearch;
                                                });
                                                
                                                // Group channels
                                                const groups: Record<string, typeof streamers> = {
                                                    'TRT': [],
                                                    'beIN SPORTS': [],
                                                    'S Sport': [],
                                                    'Smart Spor': [],
                                                    'Tivibu Spor': [],
                                                    'Ulusal': [],
                                                };
                                                
                                                filtered.forEach(s => {
                                                    const g = getChannelGroup(s.name);
                                                    if (groups[g]) {
                                                        groups[g].push(s);
                                                    }
                                                });

                                                const GROUP_ORDER = ['TRT', 'beIN SPORTS', 'S Sport', 'Smart Spor', 'Tivibu Spor', 'Ulusal'];
                                                
                                                return GROUP_ORDER.map(groupName => {
                                                    const channelsInGroup = groups[groupName];
                                                    if (!channelsInGroup || channelsInGroup.length === 0) return null;
                                                    
                                                    const isCollapsed = collapsedGroups[groupName];
                                                    const sortedChannels = [...channelsInGroup].sort((a, b) => {
                                                        if (a.is_live && !b.is_live) return -1;
                                                        if (!a.is_live && b.is_live) return 1;
                                                        return (a.order_index || 0) - (b.order_index || 0);
                                                    });
                                                    
                                                    const liveCount = sortedChannels.filter(c => c.is_live).length;
                                                    
                                                    return (
                                                        <div key={groupName} style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                                                            {/* Group Header */}
                                                            <div 
                                                                onClick={() => toggleGroup(groupName)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                    padding: '6px 8px', background: 'rgba(255, 255, 255, 0.03)',
                                                                    borderRadius: '6px', cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.05)',
                                                                    userSelect: 'none', transition: 'all 0.2s'
                                                                }}
                                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(240, 185, 11, 0.2)'; }}
                                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'; }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#e5e7eb', letterSpacing: '0.05em' }}>{groupName}</span>
                                                                    {liveCount > 0 && (
                                                                        <span style={{ fontSize: '8px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1px 5px', borderRadius: '4px', fontWeight: 950 }}>{liveCount} CANLI</span>
                                                                    )}
                                                                </div>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <span style={{ fontSize: '8px', color: '#6b7280', fontWeight: 700 }}>{sortedChannels.length}</span>
                                                                    {isCollapsed ? <ChevronDown size={11} color="#D4AF37" /> : <ChevronUp size={11} color="#D4AF37" />}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Group Channels List */}
                                                            {!isCollapsed && (
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '4px', paddingTop: '2px' }}>
                                                                    {sortedChannels.map(s => {
                                                                        const isLive = s.is_live;
                                                                        const isActive = activeChannel?.id === s.id;
                                                                        return (
                                                                            <div
                                                                                key={s.id}
                                                                                onClick={() => {
                                                                                    setActiveChannel({
                                                                                        id: s.id, name: s.name, slug: s.kick_username || '', platform: s.platform_type,
                                                                                        streamUrl: s.kick_username || '', thumbnailUrl: s.avatar_url || '',
                                                                                        category: s.tags?.[0] || 'CANLI', isLive: s.is_live, isActive: true,
                                                                                        order: s.order_index, sourceType: s.source_type, platformType: s.platform_type,
                                                                                        platformUsername: s.kick_username, videoUrl: s.video_url, iframeUrl: s.iframe_url,
                                                                                        fallbackType: s.fallback_type, fallbackVideoUrl: s.fallback_video_url,
                                                                                        fallbackIframeUrl: s.fallback_iframe_url, viewer_count: s.viewer_count,
                                                                                    } as any);
                                                                                }}
                                                                                style={{
                                                                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px',
                                                                                    borderRadius: '6px', cursor: 'pointer', transition: 'all .15s',
                                                                                    background: isActive ? 'rgba(240,185,11,0.08)' : 'rgba(255,255,255,0.01)',
                                                                                    border: `1px solid ${isActive ? 'rgba(240,185,11,0.2)' : 'rgba(255,255,255,0.03)'}`,
                                                                                    opacity: !isLive ? 0.5 : 1,
                                                                                }}
                                                                                >
                                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                                    <div style={{ fontSize: '10px', fontWeight: 800, color: isActive ? '#F0B90B' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                                                                                    <div style={{ fontSize: '8px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.tags?.[0] || (isLive ? 'Canlı' : 'Çevrimdışı')}</div>
                                                                                </div>
                                                                                {isLive && (
                                                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ef4444' }} />
                                                                                        <span style={{ fontSize: '8px', color: '#ef4444', fontWeight: 900 }}>CANLI</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </>
                                )}

                                {/* ── Tab: Maçlar ── */}
                                {rightPanelTab === 'matches' && (
                                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="custom-scrollbar">
                                        <div style={{ fontSize: '10px', color: '#F0B90B', textAlign: 'center', padding: '8px 10px', background: 'rgba(240,185,11,.05)', borderRadius: '8px', border: '1px solid rgba(240,185,11,.08)' }}>⚽ Dünya Kupası 2026 — Maç Programı</div>
                                        {MATCHES_DATA.map((group, gIdx) => {
                                            const activeItems = group.items.filter(item => !isScheduleMatchPlayed(group.date, item.time, currentTime));
                                            if (activeItems.length === 0) return null;
                                            return (
                                                <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <div style={{ fontSize: '9px', fontWeight: 900, color: '#F0B90B', letterSpacing: '0.5px', textTransform: 'uppercase', background: 'rgba(240,185,11,0.05)', padding: '3px 6px', borderRadius: '4px', borderLeft: '2px solid #F0B90B' }}>
                                                        {group.date}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                        {activeItems.map((item, itemIdx) => (
                                                            <div
                                                                key={itemIdx}
                                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
                                                            >
                                                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>{item.teams}</span>
                                                                <span style={{ fontSize: '9px', fontWeight: 900, color: '#a855f7', background: 'rgba(168,85,247,0.1)', padding: '1px 5px', borderRadius: '3px' }}>{item.time}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* ── MOBILE: Player view ─────────────────────────────── */}
                    {mobileTab === 'player' && (
                        <div className="mobile-only" style={{ flexDirection: 'column', gap: '12px' }}>
                            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '14px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,.06)' }}>
                                {isDataLoading ? <Skeleton width="100%" height="100%" borderRadius="14px" /> : (
                                    <div ref={playerContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
                                        <div style={{ width: '100%', height: '100%', filter: showPaywall ? 'blur(8px)' : 'none', transition: 'filter 0.5s', pointerEvents: showPaywall ? 'none' : 'auto' }}>
                                            {getStreamEmbed()}
                                        </div>
                                        {showPaywall && (
                                            <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'center', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                                                    <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Heyecanı Kaçırma!</h2>
                                                    <p style={{ fontSize: '12px', color: '#d1d5db', marginBottom: '16px', lineHeight: 1.4 }}>15 saniyelik önizleme süren doldu. Ücretsiz üye ol, canlı yayınlara anında erişim sağla.</p>
                                                    <button onClick={onLoginRequired} style={{ background: '#F0B90B', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 15px rgba(240,185,11,0.4)', transition: 'all 0.2s', width: '100%' }}>Hemen Kayıt Ol</button>
                                                </div>
                                            </div>
                                        )}
                                        <div style={{ position: 'absolute', inset: 0, background: 'transparent', zIndex: 10, cursor: 'pointer' }} onClick={handlePlayerTap} />

                                        {/* Mobile controls - always visible */}
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px', background: 'linear-gradient(to top,rgba(0,0,0,.9),transparent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', zIndex: 45 }}>
                                            <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '50%', width: '36px', height: '36px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {isPlaying ? <Pause style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16, marginLeft: '2px' }} />}
                                            </button>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }}>
                                                    {isMuted ? <VolumeX style={{ width: 18, height: 18, color: '#ef4444' }} /> : <Volume2 style={{ width: 18, height: 18, color: '#ADFF2F' }} />}
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); playerContainerRef.current?.requestFullscreen?.().catch(() => {}); }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center' }}>
                                                    <Maximize style={{ width: 18, height: 18 }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Streamer switcher for mobile */}
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '2px 0 8px' }} className="custom-scrollbar">
                                {activeStreamers.filter(s => s.is_live).map(s => (
                                    <button key={s.id} onClick={() => { setActiveChannel({ id: s.id, name: s.name, slug: s.kick_username || '', platform: s.platform_type, streamUrl: s.kick_username || '', thumbnailUrl: s.avatar_url || '', category: s.tags?.[0] || 'CANLI', isLive: s.is_live, isActive: true, order: s.order_index, sourceType: s.source_type, platformType: s.platform_type, platformUsername: s.kick_username, videoUrl: s.video_url, iframeUrl: s.iframe_url, fallbackType: s.fallback_type, fallbackVideoUrl: s.fallback_video_url, fallbackIframeUrl: s.fallback_iframe_url, viewer_count: s.viewer_count } as any); }}
                                        className="streamer-switch-btn" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', background: activeChannel?.id === s.id ? 'rgba(240,185,11,.1)' : 'rgba(255,255,255,.03)', border: `1px solid ${activeChannel?.id === s.id ? '#F0B90B' : 'rgba(255,255,255,.08)'}`, cursor: 'pointer', transition: 'all .2s' }}>
                                        <img src={s.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}`} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                                        <span style={{ fontSize: '11px', fontWeight: 800, color: activeChannel?.id === s.id ? '#F0B90B' : '#e5e7eb', whiteSpace: 'nowrap' }}>{s.name}</span>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mobile: Chat view */}
                    {mobileTab === 'chat' && (
                        <div className="mobile-only" style={{ flexDirection: 'column', height: '70vh', background: 'rgba(8,10,16,.95)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '16px', overflow: 'hidden' }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ADFF2F', animation: 'pulse 1.5s infinite' }} />
                                <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>CANLI SOHBET</span>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }} className="custom-scrollbar">
                                {messages.map((msg, i) => (
                                    <div key={msg.id || i} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{getRoleBadge(msg.role)}<span style={{ fontSize: '12px', fontWeight: 800, color: getRoleColor(msg.role) }}>{msg.username}</span><span style={{ fontSize: '9px', color: '#4b5563' }}>{formatTime(msg.timestamp)}</span></div>
                                        <div style={{ fontSize: '13px', color: '#d1d5db', lineHeight: 1.4 }}>{msg.message}</div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,.04)', display: 'flex', gap: '6px' }}>
                                {['⚽', '🔥', '🎉', '💸'].map(e => <button key={e} onClick={() => { triggerReaction(e); sendMessage(e); }} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: '8px', fontSize: '18px', padding: '6px 10px', cursor: 'pointer', lineHeight: 1 }}>{e}</button>)}
                            </div>
                            <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,.04)' }}>
                                {siteUser ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '6px 6px 6px 14px' }}>
                                        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Mesaj yaz..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none' }} />
                                        <button onClick={() => sendMessage()} style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ADFF2F', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}><Send style={{ width: 16, height: 16 }} /></button>
                                    </div>
                                ) : (
                                    <div onClick={onLoginRequired} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '6px 6px 6px 14px', cursor: 'pointer' }}>
                                        <input type="text" readOnly placeholder="Sohbete katılmak için giriş yap" style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer' }} />
                                        <button disabled style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,.06)', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}><Send style={{ width: 16, height: 16 }} /></button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}





                    {/* ── YAKLAŞAN MAÇLAR ──────────────────────────────────── */}
                    {nextThreeAnalyses.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
                            <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar style={{ width: 14, height: 14, color: '#f0b90b' }} />
                                YAKLAŞAN MAÇLAR
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {nextThreeAnalyses.map((match, idx) => {
                                    const homeParsed = parseTeamFlagAndName(match.homeTeam);
                                    const awayParsed = parseTeamFlagAndName(match.awayTeam);
                                    
                                    const rawHomeFlag = getFlagUrl(homeParsed.name);
                                    const rawAwayFlag = getFlagUrl(awayParsed.name);

                                    const homeFlag = homeParsed.flag || rawHomeFlag;
                                    const awayFlag = awayParsed.flag || rawAwayFlag;

                                    const isHomeFlagEmoji = homeFlag && homeFlag.length <= 4;
                                    const isAwayFlagEmoji = awayFlag && awayFlag.length <= 4;

                                    const highestOdd = match.bookieOdds?.find((o: any) => o.isHighest) || match.bookieOdds?.[0];
                                    const oddVal = highestOdd ? highestOdd.odd1 : '1.50';

                                    return (
                                        <div 
                                            key={match.id}
                                            onClick={onBack}
                                            style={{
                                                background: 'linear-gradient(160deg, #050a05 0%, #080f08 100%)',
                                                border: '1px solid rgba(242, 169, 0, 0.15)',
                                                borderRadius: '16px',
                                                padding: '16px',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            className={`group mac-karti ${idx === 0 ? 'mac-karti-isiltili' : ''}`}
                                        >
                                            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(242, 169, 0, 0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
                                            <div>
                                                {/* Card Header */}
                                                <div className="flex items-center justify-between pb-2.5 mb-3" style={{ borderBottom: '1px solid rgba(242, 169, 0, 0.1)' }}>
                                                    <span style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(242, 169, 0, 0.75)', textTransform: 'uppercase', letterSpacing: '0.5px' }} className="truncate max-w-[65%]">
                                                        {match.league}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-gray-500" />
                                                        <MatchCountdown dateStr={match.matchDate} timeStr={match.matchTime} />
                                                    </span>
                                                </div>

                                                {/* Team Matchup */}
                                                <div className="flex items-center justify-between my-4 px-2">
                                                    {/* Home Team */}
                                                    <div className="flex flex-col items-center w-[40%] text-center">
                                                        <div style={{
                                                            width: '54px',
                                                            height: '38px',
                                                            borderRadius: '10px',
                                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                                            border: '1.5px solid rgba(255, 215, 0, 0.35)',
                                                            boxShadow: '0 8px 20px rgba(0,0,0,0.8), inset 0 0 10px rgba(255, 215, 0, 0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginBottom: '8px',
                                                            overflow: 'hidden',
                                                            flexShrink: 0,
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        className="group-hover:border-[#ffd700] group-hover:scale-105"
                                                        >
                                                            {homeFlag ? (
                                                                isHomeFlagEmoji ? (
                                                                    <span style={{ fontSize: '24px', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
                                                                        {homeFlag}
                                                                    </span>
                                                                ) : (
                                                                    <img src={homeFlag} alt={homeParsed.name} className="w-full h-full object-cover group-hover:scale-110" style={{ transition: 'all 0.5s ease' }} />
                                                                )
                                                            ) : (
                                                                <div style={{ fontSize: '14px' }}>⚽</div>
                                                            )}
                                                        </div>
                                                        <span className="text-[12px] font-black text-gray-100 truncate w-full tracking-wide uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                            {homeParsed.name}
                                                        </span>
                                                    </div>

                                                    {/* VS badge */}
                                                    <div className="w-[20%] flex justify-center">
                                                        <span style={{ 
                                                            fontSize: '9px', 
                                                            fontWeight: 950, 
                                                            color: '#000', 
                                                            background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fcf6ba 75%, #aa771c 100%)', 
                                                            border: '1px solid rgba(255, 215, 0, 0.8)', 
                                                            padding: '4px 10px', 
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.4)',
                                                            letterSpacing: '1px',
                                                            textShadow: '0 1px 1px rgba(255,255,255,0.5)',
                                                            transform: 'scale(1.1)'
                                                        }}
                                                        className="animate-pulse-slow"
                                                        >
                                                            VS
                                                        </span>
                                                    </div>

                                                    {/* Away Team */}
                                                    <div className="flex flex-col items-center w-[40%] text-center">
                                                        <div style={{
                                                            width: '54px',
                                                            height: '38px',
                                                            borderRadius: '10px',
                                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                                            border: '1.5px solid rgba(255, 215, 0, 0.35)',
                                                            boxShadow: '0 8px 20px rgba(0,0,0,0.8), inset 0 0 10px rgba(255, 215, 0, 0.1)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            marginBottom: '8px',
                                                            overflow: 'hidden',
                                                            flexShrink: 0,
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        className="group-hover:border-[#ffd700] group-hover:scale-105"
                                                        >
                                                            {awayFlag ? (
                                                                isAwayFlagEmoji ? (
                                                                    <span style={{ fontSize: '24px', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
                                                                        {awayFlag}
                                                                    </span>
                                                                ) : (
                                                                    <img src={awayFlag} alt={awayParsed.name} className="w-full h-full object-cover group-hover:scale-110" style={{ transition: 'all 0.5s ease' }} />
                                                                )
                                                            ) : (
                                                                <div style={{ fontSize: '14px' }}>⚽</div>
                                                            )}
                                                        </div>
                                                        <span className="text-[12px] font-black text-gray-100 truncate w-full tracking-wide uppercase" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                            {awayParsed.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Prediction / Stats Footer */}
                                            <div className="mt-2 pt-3 border-t border-[#1f2635] flex flex-col gap-2.5">
                                                <div className="flex items-center justify-between text-xs font-bold">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] text-gray-500 uppercase font-black">TAHMİN</span>
                                                        <span className="font-black text-[11px] mt-0.5" style={{ color: '#f2a900' }}>{match.prediction}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[9px] text-gray-500 uppercase font-black">ORAN</span>
                                                        <span className="font-black text-[11px] mt-0.5" style={{ color: '#f2a900' }}>{oddVal}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[9px] text-gray-500 uppercase font-black">GÜVEN</span>
                                                        <span className="font-black text-[11px] mt-0.5" style={{ color: '#f2a900' }}>%{match.confidence}</span>
                                                    </div>
                                                </div>

                                                <button
                                                    className="detay-butonu"
                                                    style={{ width: '100%', marginTop: '6px', padding: '8px 12px', background: 'rgba(242, 169, 0, 0.08)', border: '1px solid rgba(242, 169, 0, 0.2)', color: '#f2a900', fontWeight: 900, fontSize: '10px', borderRadius: '10px', textTransform: 'uppercase', letterSpacing: '2px', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                                                >
                                                    <span>DETAYLI ANALİZ</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── VOD ─────────────────────────────────────────────── */}
                    {vods.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="section-label"><TrendingUp style={{ width: 14, height: 14, color: '#a855f7' }} />GEÇMİŞ YAYINLAR</div>
                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px 0 12px', scrollbarWidth: 'none' }} className="custom-scrollbar">
                                {vods.map(vod => (
                                    <div key={vod.id} className="vod-card" style={{ width: '220px', flexShrink: 0, background: '#0C0E14', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.05)', cursor: 'pointer', transition: 'all .2s' }}
                                        onClick={() => { setActiveChannel({ id: vod.id, name: vod.title, sourceType: 'video', videoUrl: vod.video_url, isLive: false, category: 'VOD' } as any); setMobileTab('player'); }}>
                                        <div style={{ width: '100%', height: '124px', background: '#080a10', position: 'relative' }}>
                                            {vod.thumbnail_url ? <img src={vod.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tv style={{ width: 28, height: 28, color: '#374151' }} /></div>}
                                            <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,.85)', padding: '2px 7px', borderRadius: '4px', fontSize: '8px', color: '#fff', fontWeight: 800 }}>{vod.views} görüntülenme</div>
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.4),transparent)' }} />
                                        </div>
                                        <div style={{ padding: '10px 12px' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vod.title}</div>
                                            <div style={{ fontSize: '9px', color: '#6b7280' }}>{vod.created_at ? new Date(vod.created_at).toLocaleDateString('tr-TR') : ''}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── TICKER ─────────────────────────────────────────── */}
                    {currentConfig.tickerText && (
                        <div style={{ padding: '10px 0', background: '#050507', borderRadius: '10px', border: '1px solid rgba(240,185,11,.1)', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,#f0b90b,transparent)', opacity: .4 }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', animation: 'marquee 30s linear infinite', whiteSpace: 'nowrap' }}>
                                <Zap style={{ width: 10, height: 10, color: '#f0b90b', flexShrink: 0 }} />
                                <span style={{ fontSize: '9px', fontWeight: 900, color: '#f0b90b', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{currentConfig.tickerText}</span>
                                <span style={{ color: '#1a1a1a', margin: '0 20px' }}>|</span>
                                <span style={{ fontSize: '9px', fontWeight: 900, color: '#f0b90b', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{currentConfig.tickerText}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══ FLOATING MINI PLAYER ══════════════════════════════════════ */}
            {isMiniPlayer && activeChannel && (
                <div ref={playerContainerRef} className="player-hover" style={{ position: 'fixed', bottom: '84px', right: '24px', width: '320px', height: '180px', background: '#000', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(173,255,47,.3)', boxShadow: '0 20px 60px rgba(0,0,0,.8),0 0 30px rgba(173,255,47,.12)', zIndex: 99999 }}>
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        {getStreamEmbed()}
                        <div style={{ position: 'absolute', inset: 0, background: 'transparent', zIndex: 10, pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} />
                        <div className="ctrl-bar" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(to top,rgba(0,0,0,.95),transparent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', zIndex: 45, opacity: 0, transition: 'opacity .25s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <button onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>{isPlaying ? <Pause style={{ width: 12, height: 12 }} /> : <Play style={{ width: 12, height: 12 }} />}</button>
                                <span style={{ fontSize: '9px', fontWeight: 800, color: '#fff' }}>{activeChannel.name.toUpperCase()}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>{isMuted ? <VolumeX style={{ width: 12, height: 12, color: '#ef4444' }} /> : <Volume2 style={{ width: 12, height: 12, color: '#adff2f' }} />}</button>
                                <button onClick={(e) => { e.stopPropagation(); setIsMiniPlayer(false); }} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><Maximize style={{ width: 12, height: 12 }} /></button>
                            </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setIsMiniPlayer(false); }} style={{ position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(0,0,0,.8)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100 }}><X style={{ width: 10, height: 10 }} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TV724View;
