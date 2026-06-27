import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TVConfig, TVChannel, TVChatMessage, Streamer, VOD, Gift } from '../types';
import { supabase } from '../utils/supabase';
import {
    Send, Users, MessageSquare, Tv, Zap, Crown, Star, Shield, X,
    Flame, Award, Play, Pause, Volume2, VolumeX, Maximize, Minimize2,
    ChevronLeft, ChevronRight, Clock, Radio, Trophy, Calendar, TrendingUp,
    Bell, BellOff, Gift as GiftIcon, CheckCircle, AlertCircle, BarChart2,
} from 'lucide-react';

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const HERO_SLIDES = [
    { id: 'live', tag: 'CANLI YAYIN', tagColor: '#ef4444', title: 'TÜRKİYE\'NİN İLK KUMAR TV\'Sİ', subtitle: '7/24 Canlı Bahis & Spor Analizi', cta: 'YAYINI İZLE', ctaColor: '#ef4444', bg: 'linear-gradient(135deg, #0a0000 0%, #1a0000 40%, #0d0407 100%)', accent: '#ef4444', emoji: '📺', imageUrl: null },
    { id: 'tournament', tag: 'BÜYÜK TURNUVA', tagColor: '#F0B90B', title: '₺500.000 ÖDÜL HAVUZU', subtitle: 'Özel Turnuvaya Katıl — Her Cuma Çekiliş', cta: 'HEMEN KATIL', ctaColor: '#F0B90B', bg: 'linear-gradient(135deg, #0a0800 0%, #1a1000 40%, #0d0a00 100%)', accent: '#F0B90B', emoji: '🏆', imageUrl: null },
    { id: 'schedule', tag: 'BUGÜNÜN PROGRAMI', tagColor: '#00D4FF', title: 'YAYIN AKIş ÇİZELGESİ', subtitle: 'MotoGP · F1 · Futbol · Bahis Analizi · Studio Show', cta: 'PROGRAMA BAK', ctaColor: '#00D4FF', bg: 'linear-gradient(135deg, #000a0d 0%, #001a24 40%, #000d11 100%)', accent: '#00D4FF', emoji: '📅', imageUrl: null },
];

const PROGRAM_SCHEDULE = [
    { id: 1, startH: 10, startM: 0, endH: 11, endM: 30, title: 'Sabah Bahis Analizi', subtitle: 'Premier League Yorumları', emoji: '⚽', color: '#00D4FF', platform: 'Studio' },
    { id: 2, startH: 11, startM: 30, endH: 13, endM: 0, title: 'Formula 1', subtitle: 'Canlı Yarış Yayını', emoji: '🏎️', color: '#ef4444', platform: 'F1' },
    { id: 3, startH: 13, startM: 0, endH: 14, endM: 0, title: 'Öğle Studio', subtitle: 'Bahis Taktikleri', emoji: '🎯', color: '#F0B90B', platform: 'Studio' },
    { id: 4, startH: 14, startM: 0, endH: 16, endM: 0, title: 'MotoGP', subtitle: 'İtalya Grand Prix', emoji: '🏍️', color: '#ADFF2F', platform: 'MotoGP' },
    { id: 5, startH: 16, startM: 0, endH: 18, endM: 0, title: 'Akşam Analiz Show', subtitle: 'Maç Öncesi Stratejiler', emoji: '📊', color: '#F0B90B', platform: 'Studio' },
    { id: 6, startH: 18, startM: 0, endH: 22, endM: 0, title: 'Futbol Maratonu', subtitle: 'UEFA Champions League', emoji: '⚽', color: '#22c55e', platform: 'Futbol' },
    { id: 7, startH: 22, startM: 0, endH: 24, endM: 0, title: 'Gece Studio', subtitle: 'Maç Sonrası Yorumlar', emoji: '🌙', color: '#a855f7', platform: 'Studio' },
];



const FLASH_EVENTS = [
    { type: 'bonus', icon: '🎰', title: 'BONUS KODU!', description: 'Bu yayına özel anlık bonus!', code: 'TV724BONUS', reward: '%100 İlk Yatırım Bonusu', color: '#F0B90B', duration: 60 },
    { type: 'quiz', icon: '⚡', title: 'FLASH QUIZ!', description: 'Bu yarı kaç gol atılacak?', options: ['0-1 GOL', '2-3 GOL', '4+ GOL'], reward: '200 Coin Kazan!', color: '#00D4FF', duration: 30 },
    { type: 'spin', icon: '🎡', title: 'ŞANS ÇEVİRMECESİ!', description: 'Çarkı çevir, bedava bahis kazan!', reward: 'Bedava Bahis Hakkı', color: '#ADFF2F', duration: 45 },
];

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

// ─── SKELETON COMPONENT ───────────────────────────────────────────────────────
const Skeleton: React.FC<{ width?: string | number; height?: string | number; borderRadius?: string; style?: React.CSSProperties }> = ({ width = '100%', height = '16px', borderRadius = '6px', style }) => (
    <div style={{ width, height, borderRadius, background: 'linear-gradient(90deg, #111116 25%, #1a1a24 50%, #111116 75%)', backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s ease-in-out infinite', flexShrink: 0, ...style }} />
);

// ─── INTERFACES ───────────────────────────────────────────────────────────────
interface TV724ViewProps { config: TVConfig; siteUser: any; userRole: string | null; onBack: () => void; }
interface FloatingEmoji { id: number; emoji: string; style: React.CSSProperties; }

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const TV724View: React.FC<TV724ViewProps> = ({ config, siteUser, userRole, onBack }) => {
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
    const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    // ── Hero carousel ──
    const [heroSlide, setHeroSlide] = useState(0);
    const heroTimerRef = useRef<any>(null);

    // ── Flash Events ──
    const [flashEvent, setFlashEvent] = useState<typeof FLASH_EVENTS[0] | null>(null);
    const [flashCountdown, setFlashCountdown] = useState(0);
    const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
    const [flashShown, setFlashShown] = useState(false);

    // ── Notifications ──
    const [notifiedPrograms, setNotifiedPrograms] = useState<Set<number>>(new Set());
    const [notificationToast, setNotificationToast] = useState<string | null>(null);

    // ── Mobile tabs + swipe ──
    const [mobileTab, setMobileTab] = useState<'player' | 'chat' | 'schedule'>('player');
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
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
        if (flashCountdown === 0) { setFlashEvent(null); return; }
        const t = setTimeout(() => setFlashCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [flashEvent, flashCountdown]);

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
            setIsDataLoading(false);
        };
        fetchData();

        const sc = supabase.channel('s-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'streamers' }, fetchData).subscribe();
        const vc = supabase.channel('v-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'vods' }, fetchData).subscribe();
        return () => { supabase.removeChannel(sc); supabase.removeChannel(vc); };
    }, []);

    useEffect(() => {
        if (currentConfig?.channels?.length > 0) {
            const live = currentConfig.channels.filter(c => c.isActive).sort((a, b) => a.order - b.order);
            if (live.length > 0) {
                if (!activeChannel) setActiveChannel(live[0]);
                else { const u = live.find(c => c.id === activeChannel.id); if (u) setActiveChannel(u); }
            }
        }
    }, [currentConfig]);

    useEffect(() => { setIsIframeLoaded(false); setIsPlaying(true); }, [activeChannel?.id]);

    useEffect(() => { const h = () => setIsFullscreen(!!document.fullscreenElement); document.addEventListener('fullscreenchange', h); return () => document.removeEventListener('fullscreenchange', h); }, []);

    // ══ Chat ═════════════════════════════════════════════════════════════════
    useEffect(() => {
        if (!activeChannel) return;
        const fetch = async () => {
            const { data } = await supabase.from('tv_chat').select('*').eq('channel_id', activeChannel.id).order('created_at', { ascending: true }).limit(100);
            if (data) setMessages(data.map(m => ({ id: m.id, userId: m.user_id, username: m.username, message: m.message, role: m.role || 'user', timestamp: new Date(m.created_at).getTime(), channelId: m.channel_id })));
        };
        fetch();
        const ch = supabase.channel(`tv-chat-${activeChannel.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tv_chat', filter: `channel_id=eq.${activeChannel.id}` }, (p: any) => {
            const m = p.new;
            setMessages(prev => [...prev, { id: m.id, userId: m.user_id, username: m.username, message: m.message, role: m.role || 'user', timestamp: new Date(m.created_at).getTime(), channelId: m.channel_id }]);
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

    const sendMessage = async (text?: string) => {
        const t = text || newMessage;
        if (!t.trim() || !siteUser || !activeChannel) return;
        try {
            await supabase.from('tv_chat').insert({ channel_id: activeChannel.id, user_id: siteUser.id || siteUser.username, username: siteUser.username || siteUser.name || 'Anonim', message: t.trim(), role: userRole === 'admin' ? 'admin' : (userRole === 'vip' ? 'vip' : 'user') });
            if (!text) setNewMessage('');
        } catch (e) {}
    };

    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

    const getRoleColor = (role: string) => role === 'admin' ? '#FFD700' : role === 'vip' ? '#00BFFF' : '#f3f4f6';
    const getRoleBadge = (role: string) => {
        if (role === 'admin') return <span style={{ background: 'linear-gradient(90deg,#FFD700,#FFA500)', padding: '1px 5px', borderRadius: '3px', fontSize: '8px', fontWeight: 900, color: '#000', letterSpacing: '0.5px' }}>ADMIN</span>;
        if (role === 'vip') return <Star style={{ width: 10, height: 10, color: '#00BFFF' }} />;
        return null;
    };

    const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const formatProgramTime = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    const getProgramStatus = (p: typeof PROGRAM_SCHEDULE[0]) => {
        const nowM = new Date().getHours() * 60 + new Date().getMinutes();
        const startM = p.startH * 60 + p.startM; const endM = p.endH * 60 + p.endM;
        if (nowM >= startM && nowM < endM) return 'live';
        if (nowM < startM) return 'upcoming';
        return 'past';
    };

    const handleNotify = (programId: number, programTitle: string) => {
        setNotifiedPrograms(p => { const n = new Set(p); if (n.has(programId)) n.delete(programId); else n.add(programId); return n; });
        setNotificationToast(notifiedPrograms.has(programId) ? `"${programTitle}" bildirimi iptal edildi` : `"${programTitle}" başladığında bildirim alacaksın!`);
        setTimeout(() => setNotificationToast(null), 3000);
    };

    // ══ Mobile Swipe ═══════════════════════════════════════════════════════
    const MOBILE_TABS: Array<{ id: typeof mobileTab; label: string; icon: React.ReactNode }> = [
        { id: 'player', label: 'Yayın', icon: <Tv style={{ width: 18, height: 18 }} /> },
        { id: 'chat', label: 'Sohbet', icon: <MessageSquare style={{ width: 18, height: 18 }} /> },
        { id: 'schedule', label: 'Program', icon: <Calendar style={{ width: 18, height: 18 }} /> },
    ];
    const mobileTabOrder = ['player', 'chat', 'schedule'];

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

    // ══════════════════════════════════════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════════════════════════════════════
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

            {/* ═══ NOTIFICATION TOAST ═══════════════════════════════════════ */}
            {notificationToast && (
                <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 99999, background: '#111116', border: '1px solid rgba(173,255,47,0.3)', borderRadius: '12px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', animation: 'toast-in 0.3s ease', maxWidth: '320px' }}>
                    <Bell style={{ width: 16, height: 16, color: '#ADFF2F', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{notificationToast}</span>
                    <button onClick={() => setNotificationToast(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', marginLeft: 'auto', padding: '2px' }}><X style={{ width: 14, height: 14 }} /></button>
                </div>
            )}

            {/* ═══ FLASH EVENT POPUP ════════════════════════════════════════ */}
            {flashEvent && flashCountdown > 0 && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
                    onClick={(e) => { if (e.target === e.currentTarget) { setFlashEvent(null); } }}>
                    <div style={{ background: 'linear-gradient(135deg, #0d0d14 0%, #111120 100%)', border: `1px solid ${flashEvent.color}44`, borderRadius: '24px', padding: '32px', maxWidth: '400px', width: '100%', position: 'relative', boxShadow: `0 0 60px ${flashEvent.color}22`, animation: 'flash-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        {/* Countdown ring */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid ${flashEvent.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, color: flashEvent.color }}>{flashCountdown}</div>
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
                            <div style={{ height: '100%', background: flashEvent.color, borderRadius: '99px', width: `${(flashCountdown / flashEvent.duration) * 100}%`, transition: 'width 1s linear', boxShadow: `0 0 8px ${flashEvent.color}` }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════
                MAIN CONTENT
            ════════════════════════════════════════════════════════════════ */}
            <div className="tv-wrap">

                {/* ── HERO CAROUSEL ──────────────────────────────────────── */}
                <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', userSelect: 'none' }}>
                    <div key={slide.id} style={{ position: 'relative', minHeight: '240px', overflow: 'hidden', background: slide.bg, animation: 'hero-in 0.6s ease', borderRadius: '20px', border: `1px solid ${slide.accent}22` }}>
                        {/* Grid pattern */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)' }} />
                        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${slide.bg} 30%, transparent 100%)` }} />

                        <div style={{ position: 'relative', zIndex: 10, padding: '32px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '240px', maxWidth: '580px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                <span style={{ background: slide.tagColor, color: '#fff', fontSize: '9px', fontWeight: 900, padding: '4px 10px', borderRadius: '20px', letterSpacing: '1.5px', textTransform: 'uppercase', animation: 'badge-pulse 2s infinite', boxShadow: `0 0 12px ${slide.tagColor}66` }}>
                                    {slide.id === 'live' && activeChannel?.isLive ? '🔴 CANLI YAYIN' : slide.tag}
                                </span>
                                {slide.id === 'live' && streamers.filter(s => s.is_live).length > 0 && (
                                    <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>{streamers.filter(s => s.is_live).length} yayıncı aktif</span>
                                )}
                            </div>
                            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', margin: '0 0 8px', fontFamily: "'Outfit','Inter',sans-serif", lineHeight: 1.15, letterSpacing: '-0.5px', textShadow: '0 2px 20px rgba(0,0,0,.6)' }}>
                                {slide.id === 'live' && activeChannel ? activeChannel.name.toUpperCase() : slide.title}
                            </h1>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.6)', margin: '0 0 22px', fontWeight: 500, lineHeight: 1.5 }}>
                                {slide.id === 'live' && activeChannel ? activeChannel.category : slide.subtitle}
                            </p>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <button style={{ padding: '11px 26px', borderRadius: '10px', cursor: 'pointer', border: 'none', background: slide.ctaColor, color: '#fff', fontSize: '12px', fontWeight: 900, letterSpacing: '0.5px', textTransform: 'uppercase', boxShadow: `0 4px 20px ${slide.ctaColor}55`, transition: 'all .2s' }}>{slide.cta}</button>
                                <button onClick={onBack} style={{ padding: '11px 18px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(255,255,255,.05)', color: '#9ca3af', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', gap: '6px' }}><X style={{ width: 12, height: 12 }} />KAPAT</button>
                            </div>
                        </div>
                        <div style={{ position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)', fontSize: '110px', opacity: 0.1, pointerEvents: 'none', filter: 'blur(2px)' }}>{slide.emoji}</div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg,${slide.accent},transparent)` }} />
                    </div>
                    <button className="hero-arrow" onClick={() => goToHeroSlide((heroSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20, transition: 'all .2s' }}><ChevronLeft style={{ width: 18, height: 18 }} /></button>
                    <button className="hero-arrow" onClick={() => goToHeroSlide((heroSlide + 1) % HERO_SLIDES.length)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20, transition: 'all .2s' }}><ChevronRight style={{ width: 18, height: 18 }} /></button>
                    <div style={{ position: 'absolute', bottom: '14px', right: '18px', display: 'flex', gap: '6px', zIndex: 20 }}>
                        {HERO_SLIDES.map((s, i) => <button key={s.id} onClick={() => goToHeroSlide(i)} style={{ width: i === heroSlide ? '24px' : '7px', height: '7px', borderRadius: '99px', border: 'none', cursor: 'pointer', background: i === heroSlide ? HERO_SLIDES[i].accent : 'rgba(255,255,255,.25)', transition: 'all .3s', padding: 0, boxShadow: i === heroSlide ? `0 0 8px ${HERO_SLIDES[i].accent}` : 'none' }} />)}
                    </div>
                </div>

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
                                            {getStreamEmbed()}
                                            <div style={{ position: 'absolute', inset: 0, background: 'transparent', zIndex: 10, cursor: 'pointer', pointerEvents: 'auto' }} onClick={(e) => { e.stopPropagation(); handlePlayerTap(); }} />
                                            {activeChannel?.isLive && (
                                                <div style={{ position: 'absolute', top: '14px', left: '14px', zIndex: 40, display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(239,68,68,.9)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,.15)', boxShadow: '0 4px 14px rgba(239,68,68,.5)', pointerEvents: 'none' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }} />
                                                    <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '1.5px' }}>CANLI</span>
                                                </div>
                                            )}
                                            {activeChannel && (
                                                <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 40, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '6px', pointerEvents: 'none' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: activeChannel.platformType === 'kick' ? '#ADFF2F' : activeChannel.platformType === 'twitch' ? '#a855f7' : '#ef4444' }} />
                                                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#fff' }}>{activeChannel.name}</span>
                                                </div>
                                            )}
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

                        {/* LIVE CHAT */}
                        <div className="chat-wrap">
                            <div className="chat-inner" style={{ background: 'rgba(8,10,16,.95)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '18px', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,.5)', overflow: 'hidden' }}>
                                <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,.02)', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ADFF2F', animation: 'pulse 1.5s infinite', boxShadow: '0 0 6px rgba(173,255,47,.6)' }} />
                                        <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff', letterSpacing: '1px' }}>CANLI SOHBET</span>
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
                                                            <button style={{ background: 'transparent', border: 'none', color: '#f59e0b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Shield style={{ width: 13, height: 13 }} /></button>
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
                                    {siteUser ? (
                                        <div className="chat-input-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.08)', borderRadius: '10px', padding: '4px 4px 4px 12px', transition: 'all .2s' }}>
                                            <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleKeyDown} placeholder="Canlı sohbete katıl..." style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', outline: 'none' }} />
                                            <button onClick={() => sendMessage()} disabled={!newMessage.trim()} style={{ width: '34px', height: '34px', borderRadius: '8px', background: newMessage.trim() ? '#ADFF2F' : 'rgba(255,255,255,.06)', color: newMessage.trim() ? '#000' : '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: newMessage.trim() ? 'pointer' : 'not-allowed', border: 'none', transition: 'all .2s' }}>
                                                <Send style={{ width: 14, height: 14 }} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,.02)', borderRadius: '8px' }}>Sohbete katılmak için giriş yapın</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── MOBILE: Player view ─────────────────────────────── */}
                    {mobileTab === 'player' && (
                        <div className="mobile-only" style={{ flexDirection: 'column', gap: '12px' }}>
                            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '14px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,.06)' }}>
                                {isDataLoading ? <Skeleton width="100%" height="100%" borderRadius="14px" /> : (
                                    <div ref={playerContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
                                        {getStreamEmbed()}
                                        <div style={{ position: 'absolute', inset: 0, background: 'transparent', zIndex: 10, cursor: 'pointer' }} onClick={handlePlayerTap} />
                                        {activeChannel?.isLive && <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 40, display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(239,68,68,.9)', pointerEvents: 'none' }}><div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s infinite' }} /><span style={{ fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '1.5px' }}>CANLI</span></div>}
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
                                {streamers.filter(s => s.is_live).map(s => (
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
                                    <div style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,.02)', borderRadius: '8px' }}>Sohbete katılmak için giriş yapın</div>
                                )}
                            </div>
                        </div>
                    )}



                    {/* ── PROGRAM TIMELINE ────────────────────────────────── */}
                    {(mobileTab === 'schedule' || window?.innerWidth > 700) && (
                        <div id="program-timeline" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="section-label">
                                <Calendar style={{ width: 14, height: 14, color: '#00D4FF' }} />
                                YAYIN AKIş ÇİZELGESİ
                            </div>
                            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px 0 12px', scrollbarWidth: 'none' }} className="custom-scrollbar">
                                {isDataLoading ? (
                                    Array(5).fill(0).map((_, i) => <Skeleton key={i} width="200px" height="140px" borderRadius="14px" style={{ flexShrink: 0 }} />)
                                ) : (
                                    PROGRAM_SCHEDULE.map(prog => {
                                        const status = getProgramStatus(prog);
                                        const isNotified = notifiedPrograms.has(prog.id);
                                        return (
                                            <div key={prog.id} className="program-card" style={{ flexShrink: 0, width: '200px', background: status === 'live' ? `${prog.color}0f` : 'rgba(255,255,255,.02)', border: status === 'live' ? `1px solid ${prog.color}44` : '1px solid rgba(255,255,255,.06)', borderRadius: '14px', padding: '14px', transition: 'all .2s', opacity: status === 'past' ? 0.45 : 1, position: 'relative', overflow: 'hidden', cursor: 'default' }}>
                                                {status === 'live' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: prog.color, boxShadow: `0 0 8px ${prog.color}` }} />}
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <span style={{ fontSize: '22px', lineHeight: 1 }}>{prog.emoji}</span>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                        {status === 'live' && <span style={{ background: '#ef4444', color: '#fff', fontSize: '7px', fontWeight: 900, padding: '2px 6px', borderRadius: '10px', animation: 'badge-pulse 2s infinite' }}>CANLI</span>}
                                                        {status === 'upcoming' && (
                                                            <button onClick={() => handleNotify(prog.id, prog.title)} style={{ background: isNotified ? 'rgba(240,185,11,.15)' : 'rgba(255,255,255,.05)', border: `1px solid ${isNotified ? '#F0B90B' : 'rgba(255,255,255,.1)'}`, borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }} title={isNotified ? 'Bildirimi İptal Et' : 'Başladığında Bildir'}>
                                                                {isNotified ? <Bell style={{ width: 11, height: 11, color: '#F0B90B' }} /> : <Bell style={{ width: 11, height: 11, color: '#6b7280' }} />}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '13px', fontWeight: 900, color: status === 'past' ? '#6b7280' : '#fff', marginBottom: '4px', lineHeight: 1.2 }}>{prog.title}</div>
                                                <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '10px', lineHeight: 1.3 }}>{prog.subtitle}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Clock style={{ width: 10, height: 10, color: '#6b7280' }} />
                                                        <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 700 }}>{formatProgramTime(prog.startH, prog.startM)}–{formatProgramTime(prog.endH, prog.endM)}</span>
                                                    </div>
                                                    <span style={{ fontSize: '9px', fontWeight: 800, color: prog.color, background: `${prog.color}15`, padding: '2px 6px', borderRadius: '6px' }}>{prog.platform}</span>
                                                </div>
                                                {isNotified && status === 'upcoming' && (
                                                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#F0B90B', fontWeight: 700 }}>
                                                        <CheckCircle style={{ width: 10, height: 10 }} /> Bildirim aktif
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── YAYINCILAR FUT KARTLARI ─────────────────────────── */}
                    {streamers.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="section-label">
                                <Users style={{ width: 14, height: 14, color: '#F0B90B' }} />
                                YAYINCILAR
                            </div>
                            {isDataLoading ? (
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {Array(4).fill(0).map((_, i) => <Skeleton key={i} width="170px" height="245px" borderRadius="12px" style={{ flexShrink: 0 }} />)}
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(168px,1fr))', gap: '20px', justifyItems: 'center' }}>
                                    {streamers.map(streamer => {
                                        const isActive = activeChannel?.id === streamer.id;
                                        const isLive = streamer.is_live; const isVip = streamer.is_vip;
                                        const stats = getStreamerStats(streamer);
                                        const platformCode = streamer.platform_type === 'youtube' ? 'YT' : streamer.platform_type === 'twitch' ? 'TWC' : 'KCK';
                                        let borderG = 'linear-gradient(135deg,#bdc3c7 0%,#95a5a6 100%)';
                                        let bodyG = 'linear-gradient(135deg,#e6e9f0 0%,#eef1f5 50%,#bdc3c7 100%)';
                                        let textC = '#2c3e50'; let labelC = 'rgba(44,62,80,.65)'; let divC = 'rgba(44,62,80,.15)';
                                        if (isVip) { borderG = 'linear-gradient(135deg,#d4af37 0%,#f3e5ab 50%,#aa771c 100%)'; bodyG = 'linear-gradient(135deg,#fff 0%,#f6f8fb 50%,#e9ecef 100%)'; textC = '#111116'; labelC = 'rgba(0,0,0,.6)'; divC = 'rgba(0,0,0,.12)'; }
                                        else if (isLive) { borderG = 'linear-gradient(135deg,#f5af19 0%,#f1c40f 100%)'; bodyG = 'linear-gradient(135deg,#fceabb 0%,#fccd4d 50%,#f8b500 100%)'; textC = '#3e2723'; labelC = 'rgba(62,40,0,.7)'; divC = 'rgba(62,40,0,.15)'; }
                                        const PlatformIcon = () => {
                                            const c = streamer.platform_type === 'kick' ? '#adff2f' : streamer.platform_type === 'twitch' ? '#a855f7' : '#ef4444';
                                            return <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 6px ${c}99` }}><Zap style={{ width: 9, height: 9, color: '#000' }} /></div>;
                                        };
                                        return (
                                            <div key={streamer.id} onClick={() => { setActiveChannel({ id: streamer.id, name: streamer.name, slug: streamer.kick_username || '', platform: streamer.platform_type, streamUrl: streamer.kick_username || '', thumbnailUrl: streamer.avatar_url || '', category: streamer.tags?.[0] || 'CANLI YAYIN', isLive: streamer.is_live, isActive: true, order: streamer.order_index, sourceType: streamer.source_type, platformType: streamer.platform_type, platformUsername: streamer.kick_username, videoUrl: streamer.video_url, iframeUrl: streamer.iframe_url, fallbackType: streamer.fallback_type, fallbackVideoUrl: streamer.fallback_video_url, fallbackIframeUrl: streamer.fallback_iframe_url, viewer_count: streamer.viewer_count } as any); setMobileTab('player'); }}
                                                className={`fifa-card ${isActive ? 'fifa-card-active' : ''}`}
                                                style={{ position: 'relative', width: '170px', height: '245px', padding: '2px', background: isActive ? 'linear-gradient(135deg,#adff2f 0%,#f0b90b 100%)' : borderG, clipPath: 'polygon(0% 12%,12% 5%,50% 0%,88% 5%,100% 12%,100% 82%,50% 100%,0% 82%)', cursor: 'pointer', filter: !isLive ? 'grayscale(35%) opacity(.85)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
                                                <div style={{ width: '100%', height: '100%', background: bodyG, clipPath: 'polygon(0% 12%,12% 5%,50% 0%,88% 5%,100% 12%,100% 82%,50% 100%,0% 82%)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', boxSizing: 'border-box', overflow: 'hidden' }}>
                                                    <div style={{ width: '100%', height: '108px', position: 'relative' }}>
                                                        <div style={{ position: 'absolute', left: '2px', top: '12px', width: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: textC }}>
                                                            <div style={{ fontSize: '24px', fontWeight: 900, lineHeight: '22px', fontFamily: "'Outfit','Inter',sans-serif" }}>{stats.rating}</div>
                                                            <div style={{ fontSize: '9px', fontWeight: 800, opacity: .8, letterSpacing: '.5px' }}>{platformCode}</div>
                                                            <div style={{ fontSize: '14px', lineHeight: '14px' }}>🇹🇷</div>
                                                            <div style={{ marginTop: '2px' }}><PlatformIcon /></div>
                                                        </div>
                                                        <div style={{ position: 'absolute', right: '4px', top: '8px', width: '80px', height: '80px', borderRadius: '50%', background: isLive ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.05)', border: isLive ? '2px solid rgba(255,255,255,.4)' : '2px solid rgba(0,0,0,.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <img src={streamer.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(streamer.name)}&background=random`} alt={streamer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </div>
                                                        {isLive && <div style={{ position: 'absolute', bottom: '16px', right: '24px', background: '#ef4444', color: '#fff', fontSize: '7px', fontWeight: 900, padding: '1px 5px', borderRadius: '4px', boxShadow: '0 2px 6px rgba(239,68,68,.5)', animation: 'pulse 1.5s infinite' }}>LIVE</div>}
                                                    </div>
                                                    <div style={{ width: '85%', height: '1px', background: divC, margin: '2px 0 4px' }} />
                                                    <div style={{ width: '90%', textAlign: 'center', color: textC, fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{streamer.name}</div>
                                                    <div style={{ width: '85%', height: '1px', background: divC, margin: '4px 0 2px' }} />
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '4px', color: textC, width: '100%' }}>
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
                                                            {[['IZL', stats.izl], ['ETK', stats.etk], ['COŞ', stats.cos]].map(([l, v]) => <span key={l as string} style={{ fontSize: '9px', fontWeight: 800 }}><span style={{ fontWeight: 900, marginRight: '4px' }}>{v}</span><span style={{ color: labelC, fontSize: '8px' }}>{l}</span></span>)}
                                                        </div>
                                                        <div style={{ width: '1px', background: divC, alignSelf: 'stretch' }} />
                                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1px' }}>
                                                            {[['BET', stats.bet], ['SLT', stats.slt], ['YAY', stats.yay]].map(([l, v]) => <span key={l as string} style={{ fontSize: '9px', fontWeight: 800 }}><span style={{ fontWeight: 900, marginRight: '4px' }}>{v}</span><span style={{ color: labelC, fontSize: '8px' }}>{l}</span></span>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
