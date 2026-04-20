import React, { useState, useEffect, useRef } from 'react';
import { TVConfig, TVChannel, TVChatMessage } from '../types';
import { supabase } from '../utils/supabase';
import { Send, Users, MessageSquare, Tv, Zap, Crown, Star, Shield, X } from 'lucide-react';

interface TV724ViewProps {
    config: TVConfig;
    siteUser: any;
    userRole: string | null;
    onBack: () => void;
}

const TV724View: React.FC<TV724ViewProps> = ({ config, siteUser, userRole, onBack }) => {
    const [activeChannel, setActiveChannel] = useState<TVChannel | null>(null);
    const [messages, setMessages] = useState<TVChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showChat, setShowChat] = useState(true);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Force scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Initialize with first active channel
    useEffect(() => {
        if (config?.channels?.length > 0) {
            const liveChannels = config.channels.filter(c => c.isActive).sort((a, b) => a.order - b.order);
            if (liveChannels.length > 0 && !activeChannel) {
                setActiveChannel(liveChannels[0]);
            }
        }
    }, [config]);

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

    const sendMessage = async () => {
        if (!newMessage.trim() || !siteUser || !activeChannel) return;

        const chatRole = userRole === 'admin' ? 'admin' : (userRole === 'vip' ? 'vip' : 'user');

        try {
            await supabase.from('tv_chat').insert({
                channel_id: activeChannel.id,
                user_id: siteUser.id || siteUser.username,
                username: siteUser.username || siteUser.name || 'Anonim',
                message: newMessage.trim(),
                role: chatRole,
            });
            setNewMessage('');
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

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return '#FFD700';
            case 'vip': return '#00BFFF';
            default: return '#e5e5e5';
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Crown style={{ width: 10, height: 10, color: '#FFD700' }} />;
            case 'vip': return <Star style={{ width: 10, height: 10, color: '#00BFFF' }} />;
            default: return null;
        }
    };

    const activeChannels = (config?.channels || []).filter(c => c.isActive).sort((a, b) => a.order - b.order);

    const getStreamEmbed = () => {
        if (!activeChannel) return null;
        if (activeChannel.platform === 'kick') {
            return (
                <iframe
                    src={`https://player.kick.com/${activeChannel.streamUrl}`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allowFullScreen
                    allow="autoplay; encrypted-media; fullscreen"
                    title={activeChannel.name}
                />
            );
        }
        // custom/direct URL
        return (
            <iframe
                src={activeChannel.streamUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen"
                title={activeChannel.name}
            />
        );
    };

    const formatTime = (ts: number) => {
        const d = new Date(ts);
        return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    if (!config?.isActive) return null;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000',
            paddingBottom: '40px',
        }}>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* ═══ TOP BAR ═══ */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderBottom: '1px solid #1a1a1a',
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(20px)',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    marginTop: '10px',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '6px 14px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.08))',
                        border: '1px solid rgba(255,215,0,0.25)',
                    }}>
                        <Tv style={{ width: 18, height: 18, color: '#FFD700' }} />
                        <span style={{ fontSize: '16px', fontWeight: 900, color: '#FFD700', letterSpacing: '2px' }}>724TV</span>
                    </div>
                    {activeChannel?.isLive && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '4px 10px', borderRadius: '20px',
                            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                        }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                            <span style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase' }}>CANLI</span>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => setShowChat(!showChat)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                            background: showChat ? 'rgba(255,215,0,0.1)' : '#111',
                            border: `1px solid ${showChat ? 'rgba(255,215,0,0.3)' : '#222'}`,
                            color: showChat ? '#FFD700' : '#666',
                            fontSize: '10px', fontWeight: 800,
                        }}
                    >
                        <MessageSquare style={{ width: 14, height: 14 }} />
                        SOHBET
                    </button>
                    <button
                        onClick={onBack}
                        style={{
                            padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                            background: '#111', border: '1px solid #222',
                            color: '#999', fontSize: '10px', fontWeight: 800,
                            display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                    >
                        <X style={{ width: 14, height: 14 }} /> KAPAT
                    </button>
                </div>
            </div>

                {/* ═══ CHANNEL SELECTOR ═══ */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 20px',
                    overflowX: 'auto',
                    borderBottom: '1px solid #111',
                    background: '#050505',
                }}>
                {activeChannels.map(ch => (
                    <button
                        key={ch.id}
                        onClick={() => setActiveChannel(ch)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 16px', borderRadius: '12px', cursor: 'pointer',
                            flexShrink: 0,
                            background: activeChannel?.id === ch.id
                                ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,165,0,0.05))'
                                : '#0a0a0a',
                            border: `1px solid ${activeChannel?.id === ch.id ? 'rgba(255,215,0,0.4)' : '#1a1a1a'}`,
                            transition: 'all 0.3s',
                        }}
                    >
                        {/* Channel thumbnail */}
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: '#111', overflow: 'hidden',
                            border: `2px solid ${activeChannel?.id === ch.id ? '#FFD700' : '#222'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {ch.thumbnailUrl ? (
                                <img src={ch.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Tv style={{ width: 14, height: 14, color: '#444' }} />
                            )}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{
                                fontSize: '11px', fontWeight: 800,
                                color: activeChannel?.id === ch.id ? '#FFD700' : '#ccc',
                            }}>
                                {ch.name}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span style={{
                                    fontSize: '8px', fontWeight: 700,
                                    color: ch.isLive ? '#22c55e' : '#666',
                                    textTransform: 'uppercase',
                                }}>
                                    {ch.isLive ? '● CANLI' : '○ OFFLINE'}
                                </span>
                                <span style={{ fontSize: '8px', color: '#444' }}>·</span>
                                <span style={{ fontSize: '8px', color: '#555', fontWeight: 700 }}>{ch.category}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

                {/* ═══ MAIN CONTENT: VIDEO + CHAT ═══ */}
                <div style={{
                    display: 'flex',
                    gap: '0',
                    padding: '0',
                    height: '560px',
                    background: '#000',
                    overflow: 'hidden',
                }}>
                {/* VIDEO PLAYER */}
                <div style={{
                    flex: 1,
                    position: 'relative',
                    background: '#000',
                    borderRight: showChat ? '1px solid #1a1a1a' : 'none',
                }}>
                    {activeChannel ? (
                        <>
                            {/* Stream embed */}
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                {getStreamEmbed()}

                                {/* Gold glow border effect */}
                                <div style={{
                                    position: 'absolute', inset: 0, pointerEvents: 'none',
                                    border: '1px solid rgba(255,215,0,0.15)',
                                    boxShadow: 'inset 0 0 60px rgba(255,215,0,0.03)',
                                }} />
                            </div>

                            {/* Stream info overlay at bottom */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                padding: '12px 16px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                pointerEvents: 'none',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>{activeChannel.name}</span>
                                    <span style={{
                                        fontSize: '9px', fontWeight: 700, color: '#000',
                                        background: '#FFD700', padding: '1px 6px', borderRadius: '4px',
                                    }}>{activeChannel.category}</span>
                                </div>
                                {activeChannel.viewerCount && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Users style={{ width: 12, height: 12, color: '#ef4444' }} />
                                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>
                                            {activeChannel.viewerCount.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            width: '100%', height: '100%', display: 'flex',
                            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            color: '#333', gap: '12px',
                        }}>
                            <Tv style={{ width: 48, height: 48, opacity: 0.3 }} />
                            <span style={{ fontSize: '14px', fontWeight: 700 }}>Kanal seçin</span>
                        </div>
                    )}
                </div>

                {/* ═══ CHAT PANEL ═══ */}
                {showChat && config.chatEnabled && (
                    <div style={{
                        width: '320px',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'rgba(8,8,8,0.95)',
                        backdropFilter: 'blur(20px)',
                    }}>
                        {/* Chat Header */}
                        <div style={{
                            padding: '12px 16px',
                            background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,165,0,0.05))',
                            borderBottom: '1px solid rgba(255,215,0,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield style={{ width: 14, height: 14, color: '#FFD700' }} />
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#FFD700', letterSpacing: '1px' }}>
                                    724TV VIP SOHBET
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Users style={{ width: 10, height: 10, color: '#22c55e' }} />
                                <span style={{ fontSize: '9px', fontWeight: 700, color: '#22c55e' }}>
                                    {messages.length > 0 ? 'AKTİF' : '—'}
                                </span>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div
                            ref={chatContainerRef}
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '8px 12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                            }}
                        >
                            {messages.length === 0 && (
                                <div style={{
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center',
                                    height: '100%', color: '#333', gap: '8px',
                                }}>
                                    <MessageSquare style={{ width: 24, height: 24, opacity: 0.3 }} />
                                    <span style={{ fontSize: '11px', fontWeight: 700 }}>
                                        Sohbet başlatın!
                                    </span>
                                </div>
                            )}

                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    style={{
                                        padding: '6px 8px',
                                        borderRadius: '6px',
                                        background: msg.role === 'admin'
                                            ? 'rgba(255,215,0,0.04)'
                                            : 'transparent',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                        {getRoleBadge(msg.role)}
                                        <span style={{
                                            fontSize: '10px', fontWeight: 800,
                                            color: getRoleColor(msg.role),
                                        }}>
                                            {msg.username}
                                        </span>
                                        <span style={{ fontSize: '8px', color: '#333', marginLeft: 'auto' }}>
                                            {formatTime(msg.timestamp)}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: '11px', color: '#bbb',
                                        lineHeight: '1.4', wordBreak: 'break-word',
                                    }}>
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div style={{
                            padding: '10px 12px',
                            borderTop: '1px solid #1a1a1a',
                            background: '#0a0a0a',
                        }}>
                            {siteUser ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Mesajınızı yazın..."
                                        maxLength={200}
                                        style={{
                                            flex: 1, padding: '8px 12px', borderRadius: '8px',
                                            border: '1px solid #1a1a1a', background: '#111',
                                            color: '#fff', fontSize: '11px', outline: 'none',
                                        }}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim()}
                                        style={{
                                            padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                                            background: newMessage.trim()
                                                ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                                                : '#1a1a1a',
                                            border: 'none',
                                            color: newMessage.trim() ? '#000' : '#444',
                                            display: 'flex', alignItems: 'center',
                                        }}
                                    >
                                        <Send style={{ width: 14, height: 14 }} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center', padding: '8px',
                                    color: '#555', fontSize: '10px', fontWeight: 700,
                                }}>
                                    Sohbete katılmak için giriş yapın
                                </div>
                            )}
                        </div>
                    </div>
                )}
                </div>
            </div>

            {/* ═══ LIVE TICKER ═══ */}
            {config.tickerText && (
                <div style={{
                    padding: '8px 0',
                    background: '#050505',
                    borderTop: '1px solid rgba(255,215,0,0.15)',
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
                        opacity: 0.5,
                    }} />
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        animation: 'marquee 30s linear infinite',
                        whiteSpace: 'nowrap',
                    }}>
                        <Zap style={{ width: 12, height: 12, color: '#FFD700', flexShrink: 0 }} />
                        <span style={{
                            fontSize: '11px', fontWeight: 800, color: '#FFD700',
                            letterSpacing: '1px',
                        }}>
                            {config.tickerText}
                        </span>
                        <span style={{ color: '#333', margin: '0 20px' }}>|</span>
                        <span style={{
                            fontSize: '11px', fontWeight: 800, color: '#FFD700',
                            letterSpacing: '1px',
                        }}>
                            {config.tickerText}
                        </span>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export default TV724View;
