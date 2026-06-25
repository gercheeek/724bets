import React, { useState, useEffect, useRef } from 'react';
import { TVConfig, TVChannel, TVChatMessage, Streamer, VOD, Gift } from '../types';
import { supabase } from '../utils/supabase';
import { Send, Users, MessageSquare, Tv, Zap, Crown, Star, Shield, X, BarChart2, Flame, Award, PartyPopper, DollarSign } from 'lucide-react';

interface TV724ViewProps {
    config: TVConfig;
    siteUser: any;
    userRole: string | null;
    onBack: () => void;
}

interface FloatingEmoji {
    id: number;
    emoji: string;
    style: React.CSSProperties;
}

const TV724View: React.FC<TV724ViewProps> = ({ config, siteUser, userRole, onBack }) => {
    const [currentConfig, setCurrentConfig] = useState<TVConfig>(config);
    const [activeChannel, setActiveChannel] = useState<TVChannel | null>(null);
    const [messages, setMessages] = useState<TVChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(true);
    const [activeTab, setActiveTab] = useState<'chat' | 'poll'>('chat');
    
    // Gambling TV State
    const [streamers, setStreamers] = useState<Streamer[]>([]);
    const [vods, setVods] = useState<VOD[]>([]);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [showGifts, setShowGifts] = useState(false);
    
    // Floating Emojis State
    const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
    
    // Poll State
    const [hasVoted, setHasVoted] = useState(false);
    const [votedOption, setVotedOption] = useState<string | null>(null);
    const [pollVotes, setPollVotes] = useState({ home: 142, draw: 54, away: 98 });

    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Dynamic offset scroll to focus on the TV container on mount
    useEffect(() => {
        const scrollToTV = () => {
            if (wrapperRef.current) {
                const header = document.querySelector('.header-wrapper');
                const headerHeight = header ? header.getBoundingClientRect().height : 172;
                const elementPosition = wrapperRef.current.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight - 16;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        };

        scrollToTV();
        const t1 = setTimeout(scrollToTV, 100);
        const t2 = setTimeout(scrollToTV, 300);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);
    // Fetch fresh config and new Gambling TV data directly from Supabase on mount to prevent caching
    useEffect(() => {
        const fetchFreshData = async () => {
            // Fetch legacy TV config (kept for chat etc if needed)
            const { data: configData } = await supabase
                .from('site_configs')
                .select('value')
                .eq('key', 'site_tv_config')
                .maybeSingle();
            
            if (configData?.value) {
                setCurrentConfig(configData.value);
            }

            // Fetch Streamers
            const { data: streamersData } = await supabase
                .from('streamers')
                .select('*')
                .order('order_index', { ascending: true });
            
            if (streamersData) {
                const sortedStreamers = [...streamersData].sort((a, b) => {
                    if (a.is_vip && !b.is_vip) return -1;
                    if (!a.is_vip && b.is_vip) return 1;
                    return (a.order_index || 0) - (b.order_index || 0);
                });
                setStreamers(sortedStreamers);
                // Automatically set the VIP/Founder or the first live streamer as active channel
                const liveStreamer = sortedStreamers.find(s => s.is_live && s.is_vip) || sortedStreamers.find(s => s.is_live) || sortedStreamers[0];
                if (liveStreamer && !activeChannel) {
                    // Map Streamer to TVChannel format for compatibility with existing player logic
                    setActiveChannel({
                        id: liveStreamer.id,
                        name: liveStreamer.name,
                        slug: liveStreamer.kick_username || '',
                        platform: liveStreamer.platform_type,
                        streamUrl: liveStreamer.kick_username || '',
                        thumbnailUrl: liveStreamer.avatar_url || '',
                        category: (liveStreamer.tags && liveStreamer.tags.length > 0) ? liveStreamer.tags[0] : 'CANLI YAYIN',
                        isLive: liveStreamer.is_live,
                        isActive: true,
                        order: liveStreamer.order_index,
                        sourceType: liveStreamer.source_type,
                        platformType: liveStreamer.platform_type,
                        platformUsername: liveStreamer.kick_username,
                        videoUrl: liveStreamer.video_url,
                        iframeUrl: liveStreamer.iframe_url,
                        fallbackType: liveStreamer.fallback_type,
                        fallbackVideoUrl: liveStreamer.fallback_video_url,
                        fallbackIframeUrl: liveStreamer.fallback_iframe_url,
                        viewer_count: liveStreamer.viewer_count
                    } as any);
                }
            }

            // Fetch VODs
            const { data: vodsData } = await supabase
                .from('vods')
                .select('*')
                .order('created_at', { ascending: false });
            if (vodsData) setVods(vodsData);

            // Fetch Gifts
            const { data: giftsData } = await supabase
                .from('gifts')
                .select('*')
                .order('order_index', { ascending: true });
            if (giftsData) setGifts(giftsData);
        };
        fetchFreshData();

        // Real-time subscription to streamers, vods, and gifts tables
        const streamersChannel = supabase
            .channel('streamers-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'streamers' }, () => {
                fetchFreshData();
            })
            .subscribe();

        const vodsChannel = supabase
            .channel('vods-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'vods' }, () => {
                fetchFreshData();
            })
            .subscribe();

        const giftsChannel = supabase
            .channel('gifts-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, () => {
                fetchFreshData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(streamersChannel);
            supabase.removeChannel(vodsChannel);
            supabase.removeChannel(giftsChannel);
        };
    }, []);
    // Initialize with first active channel & load local poll state
    useEffect(() => {
        if (currentConfig?.channels?.length > 0) {
            const liveChannels = currentConfig.channels.filter(c => c.isActive).sort((a, b) => a.order - b.order);
            if (liveChannels.length > 0) {
                if (!activeChannel) {
                    setActiveChannel(liveChannels[0]);
                } else {
                    const updatedActive = liveChannels.find(c => c.id === activeChannel.id);
                    if (updatedActive) {
                        setActiveChannel(updatedActive);
                    }
                }
            }
        }

        // Restore poll state if already voted
        const savedVote = localStorage.getItem('tv_poll_vote');
        if (savedVote) {
            setHasVoted(true);
            setVotedOption(savedVote);
        }
    }, [currentConfig]);

    // Fetch chat messages
    useEffect(() => {
        if (!activeChannel) return;

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('tv_chat')
                .select('*')
                .eq('channel_id', activeChannel.id)
                .order('created_at', { ascending: true })
                .limit(100);

            if (data) {
                setMessages(data.map(m => ({
                    id: m.id,
                    userId: m.user_id,
                    username: m.username,
                    message: m.message,
                    role: m.role || 'user',
                    timestamp: new Date(m.created_at).getTime(),
                    channelId: m.channel_id
                })));
            }
        };

        fetchMessages();

        // Real-time subscription
        const channel = supabase
            .channel(`tv-chat-${activeChannel.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'tv_chat',
                filter: `channel_id=eq.${activeChannel.id}`
            }, (payload: any) => {
                const m = payload.new;
                setMessages(prev => [...prev, {
                    id: m.id,
                    userId: m.user_id,
                    username: m.username,
                    message: m.message,
                    role: m.role || 'user',
                    timestamp: new Date(m.created_at).getTime(),
                    channelId: m.channel_id
                }]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeChannel?.id]);

    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Floating reaction trigger
    const triggerReaction = (emoji: string) => {
        const id = Date.now() + Math.random();
        const randomX = Math.floor(Math.random() * 50) + 25; // 25% to 75%
        const randomRotate = Math.floor(Math.random() * 60) - 30; // -30deg to 30deg
        const randomDuration = (Math.random() * 0.4 + 1.2).toFixed(2); // 1.2s to 1.6s

        const newEmoji: FloatingEmoji = {
            id,
            emoji,
            style: {
                left: `${randomX}%`,
                transform: `rotate(${randomRotate}deg)`,
                animation: `floatUp ${randomDuration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`
            }
        };

        setFloatingEmojis(prev => [...prev, newEmoji]);
        setTimeout(() => {
            setFloatingEmojis(prev => prev.filter(e => e.id !== id));
        }, 2000);
    };

    const sendMessage = async (customText?: string) => {
        const textToSend = customText || newMessage;
        if (!textToSend.trim() || !siteUser || !activeChannel) return;

        const chatRole = userRole === 'admin' ? 'admin' : (userRole === 'vip' ? 'vip' : 'user');

        try {
            await supabase.from('tv_chat').insert({
                channel_id: activeChannel.id,
                user_id: siteUser.id || siteUser.username,
                username: siteUser.username || siteUser.name || 'Anonim',
                message: textToSend.trim(),
                role: chatRole,
            });
            if (!customText) setNewMessage('');
        } catch (err) {
            console.error('Chat send error:', err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleVote = (option: 'home' | 'draw' | 'away') => {
        if (hasVoted) return;
        
        setPollVotes(prev => ({
            ...prev,
            [option]: prev[option] + 1
        }));
        setHasVoted(true);
        setVotedOption(option);
        localStorage.setItem('tv_poll_vote', option);
        triggerReaction('🗳️');
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return '#FFD700';
            case 'vip': return '#00BFFF';
            default: return '#f3f4f6';
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Crown style={{ width: 10, height: 10, color: '#FFD700' }} />;
            case 'vip': return <Star style={{ width: 10, height: 10, color: '#00BFFF' }} />;
            default: return null;
        }
    };

    // Iframe Loading State
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    useEffect(() => {
        setIsIframeLoaded(false);
    }, [activeChannel?.id]);

    const activeChannels = (currentConfig?.channels || []).filter(c => c.isActive).sort((a, b) => a.order - b.order);

    const getStreamEmbed = () => {
        if (!activeChannel) return null;

        const isLive = activeChannel.isLive;

        // 1. Live Render Mode
        if (isLive) {
            const sourceType = activeChannel.sourceType || 'platform'; // default fallback for legacy data
            
            if (sourceType === 'platform') {
                const platform = activeChannel.platformType || activeChannel.platform || 'kick';
                const username = activeChannel.platformUsername || activeChannel.streamUrl;
                
                if (platform === 'kick') {
                    return (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            {!isIframeLoaded && (
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: '#000', zIndex: 10
                                }}>
                                    <div style={{
                                        width: '24px', height: '24px',
                                        border: '2px solid rgba(240,185,11,0.2)',
                                        borderTopColor: '#f0b90b',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                </div>
                            )}
                            <iframe
                                src={`https://player.kick.com/${username}?autoplay=true&muted=true&playsinline=true`}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                allowFullScreen
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                onLoad={() => setIsIframeLoaded(true)}
                                title={activeChannel.name}
                            />
                        </div>
                    );
                } else if (platform === 'twitch') {
                    const host = window.location.hostname;
                    return (
                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                            {!isIframeLoaded && (
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: '#000', zIndex: 10
                                }}>
                                    <div style={{
                                        width: '24px', height: '24px',
                                        border: '2px solid rgba(240,185,11,0.2)',
                                        borderTopColor: '#f0b90b',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                </div>
                            )}
                            <iframe
                                src={`https://player.twitch.tv/?channel=${username}&parent=${host}&autoplay=true&muted=true&playsinline=true`}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                allowFullScreen
                                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                                onLoad={() => setIsIframeLoaded(true)}
                                title={activeChannel.name}
                            />
                        </div>
                    );
                }
            } else if (sourceType === 'video') {
                const videoUrl = activeChannel.videoUrl || activeChannel.streamUrl;
                return (
                    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
                        <video
                            src={videoUrl}
                            autoPlay
                            muted
                            playsInline
                            loop
                            controls
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </div>
                );
            } else if (sourceType === 'iframe') {
                const iframeUrl = activeChannel.iframeUrl || activeChannel.streamUrl;
                return (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        {!isIframeLoaded && (
                            <div style={{
                                position: 'absolute', inset: 0, display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                background: '#000', zIndex: 10
                            }}>
                                <div style={{
                                    width: '24px', height: '24px',
                                    border: '2px solid rgba(240,185,11,0.2)',
                                    borderTopColor: '#f0b90b',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                            </div>
                        )}
                        <iframe
                            src={iframeUrl}
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            allowFullScreen
                            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                            onLoad={() => setIsIframeLoaded(true)}
                            title={activeChannel.name}
                        />
                    </div>
                );
            }
        }

        // 2. Offline / Fallback Render Mode
        const fallbackType = activeChannel.fallbackType || 'none';

        if (fallbackType === 'video' && activeChannel.fallbackVideoUrl) {
            return (
                <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
                    <video
                        src={activeChannel.fallbackVideoUrl}
                        autoPlay
                        muted
                        playsInline
                        loop
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
            );
        } else if (fallbackType === 'iframe' && activeChannel.fallbackIframeUrl) {
            return (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {!isIframeLoaded && (
                        <div style={{
                            position: 'absolute', inset: 0, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            background: '#000', zIndex: 10
                        }}>
                            <div style={{
                                width: '24px', height: '24px',
                                border: '2px solid rgba(240,185,11,0.2)',
                                borderTopColor: '#f0b90b',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                        </div>
                    )}
                    <iframe
                        src={activeChannel.fallbackIframeUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allowFullScreen
                        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                        onLoad={() => setIsIframeLoaded(true)}
                        title={activeChannel.name}
                    />
                </div>
            );
        }

        // Default Luxury placeholder when offline
        return (
            <div style={{
                width: '100%', height: '100%', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#f0b90b', gap: '10px',
                background: 'radial-gradient(circle, #111118 0%, #060709 100%)',
                padding: '16px',
            }}>
                <div style={{
                    width: '50px', height: '50px', borderRadius: '50%',
                    background: 'rgba(240,185,11,0.06)', border: '1px solid rgba(240,185,11,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(240,185,11,0.05)',
                    animation: 'pulse-slow 3s infinite',
                }}>
                    <Tv style={{ width: 22, height: 22, color: '#f0b90b', opacity: 0.8 }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                        YAYIN YAKINDA BAŞLAYACAK
                    </h3>
                    <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>
                        Yayını başlatmak için aktif kanal seçin.
                    </p>
                </div>
            </div>
        );
    };

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    // Calculate poll percentages
    const totalVotes = pollVotes.home + pollVotes.draw + pollVotes.away;
    const homePercent = totalVotes > 0 ? Math.round((pollVotes.home / totalVotes) * 100) : 0;
    const drawPercent = totalVotes > 0 ? Math.round((pollVotes.draw / totalVotes) * 100) : 0;
    const awayPercent = totalVotes > 0 ? Math.round((pollVotes.away / totalVotes) * 100) : 0;

    const quickMessages = [
        { label: '⚽ GOL!', emoji: '⚽' },
        { label: '🔥 SÜPER!', emoji: '🔥' },
        { label: '🎉 KAZANDIK!', emoji: '🎉' },
        { label: '💸 KASALAR KATLANDI!', emoji: '💸' }
    ];

    if (!currentConfig?.isActive) return null;

    return (
        <div ref={wrapperRef} style={{
            minHeight: '100vh',
            background: '#060709', // Deeper rich dark background
            padding: '24px 16px 80px',
            fontFamily: "'Inter', sans-serif",
        }}>
            <div style={{
                maxWidth: '800px', // Super-compact 800px width limit
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}>
                
                {/* ═══ TOP BAR ═══ */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: 'rgba(17,17,24,0.75)',
                    border: '1px solid rgba(255,215,0,0.1)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '5px 10px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgba(240,185,11,0.15), rgba(240,185,11,0.05))',
                            border: '1px solid rgba(240,185,11,0.25)',
                        }}>
                            <Tv style={{ width: 14, height: 14, color: '#f0b90b' }} />
                            <span style={{ fontSize: '12px', fontWeight: 900, color: '#f0b90b', letterSpacing: '1px' }}>724TV</span>
                        </div>
                        {activeChannel?.isLive && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                padding: '3px 8px', borderRadius: '20px',
                                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                            }}>
                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                                <span style={{ fontSize: '8px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.5px' }}>CANLI</span>
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                            onClick={onBack}
                            style={{
                                padding: '5px 10px', borderRadius: '6px', cursor: 'pointer',
                                background: '#111118', border: '1px solid rgba(255,255,255,0.08)',
                                color: '#9ca3af', fontSize: '10px', fontWeight: 800,
                                display: 'flex', alignItems: 'center', gap: '4px',
                                transition: 'all 0.2s',
                            }}
                        >
                            <X style={{ width: 11, height: 11 }} /> KAPAT
                        </button>
                    </div>
                </div>

                {/* ═══ MAIN PANEL: TWO COLUMN GRID ON DESKTOP, STACKED ON MOBILE ═══ */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: '16px',
                    width: '100%',
                }} className="tv-main-grid-flex">
                    
                    {/* LEFT COLUMN: PLAYER & COMPACT INFO BAR */}
                    <div style={{
                        flex: '1 1 100%',
                        minWidth: '280px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        transition: 'all 0.3s ease',
                    }}>
                        
                        {/* VIDEO PLAYER (ASPECT RATIO 16:9 CONTAINER) */}
                        <div style={{
                            width: '100%',
                            position: 'relative',
                            aspectRatio: '16/9', // Responsive standard ratio (takes ~544px width, resulting in 306px height)
                            background: '#000',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,215,0,0.15)',
                            boxShadow: activeChannel?.isLive ? '0 8px 32px rgba(240,185,11,0.08)' : 'none',
                        }}>
                            {activeChannel ? (
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    {getStreamEmbed()}

                                    {/* Gold glow overlay border */}
                                    <div style={{
                                        position: 'absolute', inset: 0, pointerEvents: 'none',
                                        border: '1px solid rgba(240,185,11,0.1)',
                                        boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)',
                                    }} />

                                    {/* ═══ REAL-TIME FLOATING REACTIONS ANIMATION LAYER ═══ */}
                                    <div style={{
                                        position: 'absolute', inset: 0, pointerEvents: 'none',
                                        zIndex: 40, overflow: 'hidden',
                                    }}>
                                        {floatingEmojis.map(item => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '20px',
                                                    fontSize: '28px',
                                                    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                                                    willChange: 'transform, opacity',
                                                    ...item.style
                                                }}
                                            >
                                                {item.emoji}
                                            </div>
                                        ))}
                                    </div>


                                </div>
                            ) : (
                                // Luxury placeholder when offline
                                <div style={{
                                    width: '100%', height: '100%', display: 'flex',
                                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    color: '#f0b90b', gap: '10px',
                                    background: 'radial-gradient(circle, #111118 0%, #060709 100%)',
                                    padding: '16px',
                                }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '50%',
                                        background: 'rgba(240,185,11,0.06)', border: '1px solid rgba(240,185,11,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 0 20px rgba(240,185,11,0.05)',
                                        animation: 'pulse-slow 3s infinite',
                                    }}>
                                        <Tv style={{ width: 22, height: 22, color: '#f0b90b', opacity: 0.8 }} />
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                                            YAYIN YAKINDA BAŞLAYACAK
                                        </h3>
                                        <p style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>
                                            Yayını başlatmak için aktif kanal seçin.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* COMPACT INFO BAR + EMOJI REACTION CONTROLS (60px high) */}
                        {activeChannel && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 16px',
                                borderRadius: '12px',
                                background: 'rgba(17,17,24,0.6)',
                                border: '1px solid rgba(255,255,255,0.03)',
                                height: '60px',
                                boxSizing: 'border-box',
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                                        Şu an oynatılıyor: 724TV
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {[
                                        { symbol: '🔥', icon: <Flame style={{ width: 12, height: 12, color: '#f97316' }} /> },
                                        { symbol: '⚽', icon: <Tv style={{ width: 12, height: 12, color: '#fff' }} /> },
                                        { symbol: '🏆', icon: <Award style={{ width: 12, height: 12, color: '#eab308' }} /> },
                                        { symbol: '🎉', icon: <PartyPopper style={{ width: 12, height: 12, color: '#ec4899' }} /> },
                                        { symbol: '💸', icon: <DollarSign style={{ width: 12, height: 12, color: '#22c55e' }} /> }
                                    ].map(item => (
                                        <button
                                            key={item.symbol}
                                            onClick={() => triggerReaction(item.symbol)}
                                            style={{
                                                width: '26px', height: '26px', borderRadius: '50%',
                                                background: '#111118', border: '1px solid rgba(255,255,255,0.06)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', transition: 'all 0.2s',
                                            }}
                                            className="reaction-button-hover"
                                        >
                                            {item.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>



                </div>



                {/* ═══ ALT BÖLÜM: VODS (GEÇMİŞ YAYINLAR) ═══ */}
                {vods.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginLeft: '4px' }}>
                            GEÇMİŞ YAYINLAR
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'stretch',
                            gap: '12px',
                            overflowX: 'auto',
                            padding: '4px 4px 12px',
                            scrollbarWidth: 'thin',
                        }} className="custom-scrollbar">
                            {vods.map(vod => (
                                <div key={vod.id} style={{
                                    width: '220px', flexShrink: 0, background: '#111118', borderRadius: '12px', overflow: 'hidden',
                                    border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'transform 0.2s',
                                }} className="vod-card-hover" onClick={() => {
                                    // Play VOD: Change active channel to video source
                                    setActiveChannel({
                                        id: vod.id,
                                        name: vod.title,
                                        sourceType: 'video',
                                        videoUrl: vod.video_url,
                                        isLive: false,
                                        category: 'VOD',
                                    } as any);
                                }}>
                                    <div style={{ width: '100%', height: '124px', background: '#0a0a0f', position: 'relative' }}>
                                        {vod.thumbnail_url ? (
                                            <img src={vod.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Tv style={{ width: 24, height: 24, color: '#4b5563' }} />
                                            </div>
                                        )}
                                        <div style={{
                                            position: 'absolute', bottom: '6px', right: '6px',
                                            background: 'rgba(0,0,0,0.8)', padding: '2px 6px', borderRadius: '4px',
                                            fontSize: '8px', color: '#fff', fontWeight: 800
                                        }}>
                                            {vod.views} Görüntülenme
                                        </div>
                                    </div>
                                    <div style={{ padding: '10px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {vod.title}
                                        </div>
                                        <div style={{ fontSize: '9px', color: '#9ca3af' }}>
                                            {vod.created_at ? new Date(vod.created_at).toLocaleDateString() : ''}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ LIVE TICKER (MARQUEE) ═══ */}
                {currentConfig.tickerText && (
                    <div style={{
                        padding: '8px 0',
                        background: '#050505',
                        borderRadius: '8px',
                        border: '1px solid rgba(240,185,11,0.15)',
                        overflow: 'hidden',
                        position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, #f0b90b, transparent)',
                            opacity: 0.5,
                        }} />
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            animation: 'marquee 30s linear infinite',
                            whiteSpace: 'nowrap',
                        }}>
                            <Zap style={{ width: 9, height: 9, color: '#f0b90b', flexShrink: 0 }} />
                            <span style={{
                                fontSize: '9px', fontWeight: 950, color: '#f0b90b',
                                letterSpacing: '1px', textTransform: 'uppercase',
                             }}>
                                {currentConfig.tickerText}
                            </span>
                            <span style={{ color: '#222', margin: '0 15px' }}>|</span>
                            <span style={{
                                fontSize: '9px', fontWeight: 950, color: '#f0b90b',
                                letterSpacing: '1px', textTransform: 'uppercase',
                            }}>
                                {currentConfig.tickerText}
                            </span>
                        </div>
                    </div>
                )}

            </div>

            {/* Custom Embedded CSS rules for cinematic transitions and scrollbars */}
            <style>{`
                @keyframes floatUp {
                    0% {
                        transform: translateY(20px) scale(0.5);
                        opacity: 0;
                    }
                    15% {
                        opacity: 1;
                        transform: translateY(0px) scale(1.2);
                    }
                    80% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-240px) scale(0.6);
                        opacity: 0;
                    }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.95); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.9; transform: scale(1); box-shadow: 0 0 10px rgba(240,185,11,0.05); }
                    50% { opacity: 0.6; transform: scale(1.05); box-shadow: 0 0 25px rgba(240,185,11,0.15); }
                }
                .gift-button-hover:hover {
                    background: rgba(240,185,11,0.1) !important;
                    border-color: rgba(240,185,11,0.3) !important;
                    transform: translateY(-2px);
                }
                .vod-card-hover:hover {
                    transform: translateY(-4px) !important;
                    border-color: rgba(240,185,11,0.4) !important;
                    box-shadow: 0 8px 20px rgba(240,185,11,0.1) !important;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                
                /* Custom scrollbar rules */
                .custom-scrollbar::-webkit-scrollbar {
                    height: 4px;
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.01);
                    border-radius: 99px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(240,185,11,0.2);
                    border-radius: 99px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(240,185,11,0.4);
                }
                
                /* Interactive glow effects */
                .channel-card-hover:hover {
                    border-color: rgba(240,185,11,0.4) !important;
                    background: linear-gradient(135deg, rgba(240,185,11,0.08), rgba(255,255,255,0.02)) !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) !important;
                }

                .reaction-button-hover:hover {
                    border-color: rgba(240,185,11,0.4) !important;
                    background: rgba(240,185,11,0.1) !important;
                    transform: scale(1.1) translateY(-1px);
                    box-shadow: 0 0 10px rgba(240,185,11,0.15) !important;
                }

                .quick-tag-hover:hover {
                    background: rgba(240,185,11,0.08) !important;
                    border-color: rgba(240,185,11,0.2) !important;
                    color: #f0b90b !important;
                }
                
                .chat-input-focus:focus {
                    border-color: rgba(240,185,11,0.4) !important;
                    box-shadow: 0 0 8px rgba(240,185,11,0.1);
                }

                @media (max-width: 768px) {
                    .tv-chat-panel-compact {
                        height: 300px !important;
                        flex: 1 1 100% !important;
                        max-height: 300px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default TV724View;
