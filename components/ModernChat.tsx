import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Shield, Smile, Cpu, Target } from 'lucide-react';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import { SiteUser } from '../types';
import { BetShareModal } from './BetShareModal';
import confetti from 'canvas-confetti';

interface ModernChatProps {
    open: boolean;
    onOpen?: () => void;
    onClose: () => void;
    siteUser: SiteUser | null;
    userRole: string | null;
    isMobile?: boolean;
    botsConfig?: any[];
}

const LANGUAGES = [
    { id: '00000000-0000-0000-0000-000000000000', code: 'TR', name: 'Türkçe', flag: 'tr' },
    { id: '00000000-0000-0000-0000-000000000001', code: 'EN', name: 'English', flag: 'gb' },
    { id: '00000000-0000-0000-0000-000000000002', code: 'DE', name: 'Deutsch', flag: 'de' },
    { id: '00000000-0000-0000-0000-000000000003', code: 'ES', name: 'Español', flag: 'es' },
    { id: '00000000-0000-0000-0000-000000000004', code: 'PT', name: 'Português', flag: 'pt' }
];

const GLOBAL_CHANNEL_ID = LANGUAGES[0].id;

const sanitize = (msg: string) => msg.replace(/küfür1|argo1|kötükelime/gi, '***');
const EMOTES: { [key: string]: string } = { ":hehe:": "/emotes/hehe.gif", ":dilMaymun:": "/emotes/dilMaymun.gif" };

const isAuthorized = (role: string | null) => {
    if (!role) return false;
    const r = role.toUpperCase();
    return ['KRAL', 'PATRON', 'ADMIN', 'MODERATOR'].includes(r);
};

const renderMessageText = (msg: any, onBetClick?: (betId: string, user: string, type: 'Casino'|'Spor') => void) => {
  let text = msg.message;
  if (!text || typeof text !== 'string') return '';
  
  text = text.replace('[RAIN_EVENT_END] ', '');

  const betShareRegex = /^(Casino|Spor):\s*#([\d\.]+)\s+(.*)$/i;
  const match = text.match(betShareRegex);
  if (match && onBetClick) {
      const type = match[1] as 'Casino' | 'Spor';
      const betId = match[2];
      const remainingText = match[3];

      return (
          <div className="flex flex-col gap-1.5 mt-0.5">
              <div 
                  onClick={() => onBetClick(betId, msg.username, type)}
                  className="inline-flex items-center gap-1.5 bg-[#050505] hover:bg-[#111] transition-colors rounded px-2.5 py-1 text-sm font-semibold cursor-pointer select-none text-white border border-emerald-500/20 text-emerald-400 w-fit"
              >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6H20M4 12H20M4 18H20" stroke="#00e701" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {type}: #{betId}
              </div>
              <span className="mt-1">{remainingText}</span>
          </div>
      );
  }

  const parts = text.split(/(:\w+:)/g);
  return parts.map((part, index) => {
    if (EMOTES[part]) {
      return (
        <img 
          key={index} 
          src={EMOTES[part]} 
          alt={part} 
          className="inline-block h-6 w-6 align-middle mx-0.5"
        />
      );
    }
    return part;
  });
};

const ModernChat: React.FC<ModernChatProps> = ({ open, onClose, siteUser, userRole, isMobile, botsConfig }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [mutedUsers, setMutedUsers] = useState<any[]>([]);
    const [lastMsgTime, setLastMsgTime] = useState(0);
    const [chatEnabled, setChatEnabled] = useState(true);
    const [rateLimitSec, setRateLimitSec] = useState(15);
    const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [selectedBet, setSelectedBet] = useState<{ id: string, user: string, type: 'Casino' | 'Spor' } | null>(null);
    const [activeAnnouncement, setActiveAnnouncement] = useState<{ id?: string, text: string, timestamp: number } | null>(null);

    const isSystemOrCountdown = (msg: any) => {
        if (!msg || !msg.message || typeof msg.message !== 'string') return false;
        const text = msg.message;
        const role = (msg.role || '').toLowerCase();
        const user = (msg.username || '').toLowerCase();
        
        return (
            role === 'system' ||
            role === 'system_announcement' ||
            user === 'system' ||
            user === 'sistem' ||
            text.includes('⏳') ||
            /geri sayım/i.test(text) ||
            /\[DUYURU\]/i.test(text) ||
            /\[ANNOUNCEMENT\]/i.test(text) ||
            /\[SİSTEM\]/i.test(text) ||
            /^⏳\s*\d+/i.test(text)
        );
    };

    useEffect(() => {
        if (!open) {
            setIsConnected(false);
            return;
        }

        let isMounted = true;

        const loadData = async () => {
            if (isMounted) setIsConnected(true);
            try {
                const { data } = await supabase
                    .from('tv_chat')
                    .select('*')
                    .eq('channel_id', activeLang.id)
                    .order('created_at', { ascending: false })
                    .limit(25);
                
                if (data) {
                    data.reverse();
                }

                if (isMounted) {
                    setMessages(prev => {
                        const localBots = prev.filter(m => m.id && (m.id.startsWith('group_bot_') || m.id.startsWith('tip_')));
                        const merged = [...(data || []), ...localBots];
                        return merged.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                    });
                    setIsConnected(true);
                    setTimeout(() => {
                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                    }, 100);
                }
            } catch (err) {
                console.error('Error loading global chat:', err);
                if (isMounted) {
                    setIsConnected(true);
                }
            }
        };

        const fetchMutes = async () => {
            try {
                const data = await getGlobalConfig('tv_mutes');
                if (data && Array.isArray(data.mutedUsers) && isMounted) {
                    setMutedUsers(data.mutedUsers);
                }
            } catch (e) {
                console.error("Load mutes failed:", e);
            }
        };

        loadData();
        fetchMutes();

        const loadChatSettings = async () => {
            try {
                const settings = await getGlobalConfig('chat_settings');
                if (settings && isMounted) {
                    setChatEnabled(settings.chat_enabled !== false);
                    setRateLimitSec(settings.rate_limit_seconds || 15);
                }
            } catch (e) {
                console.error('Chat settings load error:', e);
            }
        };
        loadChatSettings();
        const settingsInterval = setInterval(loadChatSettings, 30000);

        const triggerRainAnimation = () => {
            const duration = 4000;
            const animationEnd = Date.now() + duration;

            const frame = () => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return;

                confetti({
                    particleCount: 5,
                    angle: 90,
                    spread: 90,
                    origin: { x: Math.random(), y: -0.1 },
                    colors: ['#FFD700', '#FFA500', '#00e701'],
                    shapes: ['circle', 'square'],
                    gravity: 1.5,
                    scalar: 1.2,
                    ticks: 400,
                    zIndex: 9999
                });
                requestAnimationFrame(frame);
            };
            frame();
        };

        const channel = supabase.channel('global-chat-room')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tv_chat' }, (payload) => {
                const m = payload.new;
                if (m.channel_id === activeLang.id && isMounted) {
                    if (m.message && typeof m.message === 'string' && m.message.includes('[RAIN_EVENT_END]')) {
                        triggerRainAnimation();
                    }
                    setMessages(prev => {
                        if (prev.some(msg => msg.id === m.id)) return prev;
                        return [...prev, m];
                    });
                    setTimeout(() => {
                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                    }, 50);
                }
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'tv_chat' }, (payload) => {
                if (isMounted) {
                    setMessages(prev => prev.filter(m => m.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            isMounted = false;
            clearInterval(settingsInterval);
            supabase.removeChannel(channel);
        };
    }, [open, activeLang.id]);

    useEffect(() => {
        if (!open || !botsConfig || botsConfig.length === 0) return;
        
        const intervals: NodeJS.Timeout[] = [];

        botsConfig.forEach(bot => {
            if (!bot.isActive) return;
            
            bot.scenarios.forEach((scen: any) => {
                if (!scen.isActive) return;
                
                const ms = (scen.intervalMinutes || 1) * 60 * 1000;
                
                const interval = setInterval(() => {
                    const newBotMsg = {
                        id: `bot_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
                        username: bot.name,
                        role: bot.role,
                        message: scen.text,
                        botColor: bot.color,
                        created_at: new Date().toISOString(),
                        channel_id: GLOBAL_CHANNEL_ID
                    };
                    
                    setMessages(prev => {
                        const updated = [...prev, newBotMsg];
                        setTimeout(() => {
                            if (chatContainerRef.current) {
                                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                            }
                        }, 50);
                        return updated;
                    });
                }, ms);
                
                intervals.push(interval);
            });
        });

        return () => {
            intervals.forEach(clearInterval);
        };
    }, [open, botsConfig]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim()) return;

        const myUserId = siteUser?.id || userRole || 'guest';
        const myUsername = siteUser?.username || 'Misafir';
        const role = userRole || 'user';

        if (!chatEnabled && userRole !== 'admin') {
            alert('Sohbet şu anda yönetici tarafından kapatılmıştır.');
            return;
        }

        if (userRole !== 'admin') {
            const now = Date.now();
            const elapsed = (now - lastMsgTime) / 1000;
            if (elapsed < rateLimitSec) {
                const remaining = Math.ceil(rateLimitSec - elapsed);
                alert(`Lütfen yavaşlayın! ${remaining} saniye sonra tekrar mesaj atabilirsiniz.`);
                return;
            }
        }

        try {
            const mutesData = await getGlobalConfig('tv_mutes');
            const currentMutes = mutesData && Array.isArray(mutesData.mutedUsers) ? mutesData.mutedUsers : [];
            setMutedUsers(currentMutes);

            const muteRecord = currentMutes.find((m: any) => m.userId === myUserId);
            if (muteRecord) {
                const nowTime = Date.now();
                if (muteRecord.mutedUntil === -1) {
                    alert("Sohbetten süresiz olarak uzaklaştırıldınız.");
                    return;
                } else if (nowTime < muteRecord.mutedUntil) {
                    const remainingMin = Math.ceil((muteRecord.mutedUntil - nowTime) / 60000);
                    alert(`Sohbetten geçici olarak uzaklaştırıldınız. Kalan süre: ${remainingMin} dakika.`);
                    return;
                }
            }
        } catch (err) {
            console.error("Mute check error:", err);
        }

        const finalMessage = sanitize(newMessage.trim());

        const msgObj = {
            channel_id: activeLang.id,
            user_id: myUserId,
            username: myUsername,
            message: finalMessage,
            role: role
        };

        setNewMessage('');

        try {
            const { data, error } = await supabase.from('tv_chat').insert(msgObj).select();
            if (error) {
                console.error("Global chat insert error:", error);
            } else if (data && data[0]) {
                setLastMsgTime(Date.now());
                setMessages(prev => {
                    if (prev.some(msg => msg.id === data[0].id)) return prev;
                    return [...prev, data[0]];
                });
                setTimeout(() => {
                    if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                    }
                }, 50);
            }
        } catch (err) {
            console.error("Global chat send error:", err);
        }
    };

    useEffect(() => {
        if (!messages || messages.length === 0) return;
        const systemMsgs = messages.filter(isSystemOrCountdown);
        if (systemMsgs.length > 0) {
            const latest = systemMsgs[systemMsgs.length - 1];
            const cleanText = (latest.message || '').replace('[RAIN_EVENT_END] ', '').trim();
            if (cleanText) {
                setActiveAnnouncement({
                    id: latest.id,
                    text: cleanText,
                    timestamp: Date.now()
                });
            }
        }
    }, [messages]);

    if (!open && !isMobile) {
        return null;
    }

    const displayMessages = messages.filter(m => !isSystemOrCountdown(m) && m.role !== 'system_win');

    return (
        <div id="tour-chat" className="h-full w-full flex flex-col bg-[#0a0e17] font-sans text-left relative">
            
            {/* Header */}
            <div className="bg-[#0a0e17] px-4 h-[64px] text-white flex items-center justify-between flex-shrink-0 border-b border-[#1b2335]">
                <div className="flex items-center gap-3 relative">
                    <div 
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="flex items-center gap-2 bg-[#131926] border border-[#1b2335] px-3 py-1.5 rounded-md text-[13px] font-semibold hover:bg-[#1c2538] cursor-pointer transition-all shadow-inner relative z-20 text-slate-300"
                    >
                        <img src={`https://flagcdn.com/w20/${activeLang.flag}.png`} alt={activeLang.code} className="w-4 h-3 rounded-sm object-cover shadow-sm" />
                        <span className="text-gray-300">{activeLang.name}</span>
                        <span className="text-[10px] ml-2 text-gray-500">▼</span>
                    </div>

                    {/* Language Dropdown */}
                    {showLangMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                            <div className="absolute top-full mt-2 left-0 w-40 bg-[#050505] border border-white/[0.02] rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                                {LANGUAGES.map(lang => (
                                    <div 
                                        key={lang.id}
                                        onClick={() => { setActiveLang(lang); setShowLangMenu(false); }}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors ${activeLang.id === lang.id ? 'bg-[#111] text-white' : 'text-gray-500 hover:bg-[#111] hover:text-white'}`}
                                    >
                                        <img src={`https://flagcdn.com/w20/${lang.flag}.png`} alt={lang.code} className="w-5 h-3.5 rounded-sm object-cover shadow-sm" />
                                        <span>{lang.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center bg-[#050505] border border-white/[0.02] hover:bg-[#111] transition-all rounded-full text-zinc-500 hover:text-white"
                        title="Kapat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Sticky Announcement / Countdown Bar */}
            {activeAnnouncement && (
                <div className="bg-[#131926] border-b border-[#1b2335] px-3.5 py-2.5 flex items-center justify-between gap-2.5 shadow-lg relative z-20 shrink-0 animate-fade-in">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 shrink-0">
                            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-amber-400 opacity-60"></span>
                            <span className="text-amber-400 text-xs font-bold relative z-10">⏳</span>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none">Sistem Duyurusu</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            </div>
                            <p className="text-xs text-slate-200 font-semibold truncate leading-snug">
                                {activeAnnouncement.text}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveAnnouncement(null)} 
                        className="text-slate-500 hover:text-slate-200 p-1.5 hover:bg-white/5 rounded-lg shrink-0 transition-colors"
                        title="Duyuruyu Kapat"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Messages Area */}
            <div 
                ref={chatContainerRef} 
                id="new-chat-container" 
                className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-[#0a0e17]"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}
            >
                {!isConnected ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-ping" />
                            Bağlanıyor...
                        </p>
                    </div>
                ) : displayMessages.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-gray-500">Henüz mesaj yok.</p>
                    </div>
                ) : (
                    displayMessages.map((msg, i) => {
                        const isMod = msg.role?.toUpperCase() === 'ADMIN' || msg.role?.toUpperCase() === 'MODERATOR';
                        
                        return (
                        <div 
                            key={msg.id || i} 
                            className="px-3 py-2.5 bg-[#0e1320] border border-[#1b2335] rounded-xl text-left text-[13px] text-slate-300 leading-relaxed shadow-sm"
                        >
                            <span className="inline-flex items-center gap-1.5 mr-1.5 align-middle">
                                {isMod ? (
                                    <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded flex-shrink-0 text-[10px] font-bold tracking-wider leading-none border border-emerald-500/20 uppercase">
                                        <Shield className="w-3 h-3" /> MOD
                                    </span>
                                ) : (
                                    <span className="text-slate-500 flex-shrink-0"><Target className="w-3.5 h-3.5" /></span>
                                )}
                                <span className={`font-semibold tracking-tight ${isMod ? 'text-emerald-400' : 'text-slate-200'}`}>
                                    {msg.username || 'Misafir'}:
                                </span>
                            </span>
                            <span className="break-words antialiased text-slate-300">
                                {renderMessageText(msg, (betId, user, type) => setSelectedBet({ id: betId, user, type }))}
                            </span>
                        </div>
                    )})
                )}
            </div>

            {/* Input Footer Area */}
            <div className="p-3 bg-[#0a0e17] border-t border-[#1b2335] flex-shrink-0 z-10 relative">
                {!siteUser ? (
                    <input 
                        type="text"
                        disabled
                        placeholder="Giriş Yap"
                        className="w-full bg-[#131926] border border-[#1b2335] text-[13px] font-medium text-center text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed"
                    />
                ) : (
                    <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#131926] border border-[#1b2335] focus-within:border-[#3b8def]/50 rounded-xl overflow-hidden transition-all h-12 shadow-inner">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Bir mesaj gönder..."
                            className="flex-1 bg-transparent text-[13px] font-medium text-white focus:outline-none placeholder-zinc-700 px-3"
                        />
                        <div className="flex items-center pr-1.5 gap-1 h-full shrink-0">
                            <button type="button" className="text-zinc-600 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5 bg-[#0a0a0a]">
                                <Smile className="w-4 h-4" />
                            </button>
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="text-white bg-[#38b75e] disabled:bg-[#121212] disabled:text-gray-600 hover:bg-[#2fa350] transition-all p-2 rounded-md"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </div>
                    </form>
                )}
            </div>
            
            <BetShareModal 
                isOpen={!!selectedBet} 
                onClose={() => setSelectedBet(null)}
                betId={selectedBet?.id || ''}
                username={selectedBet?.user || ''}
                type={selectedBet?.type || 'Casino'}
            />
        </div>
    );
};

export default ModernChat;
