import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Star, Shield, Trash2, Smile, MoreVertical, Menu } from 'lucide-react';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import { SiteUser } from '../types';

interface ModernChatProps {
    open: boolean;
    onOpen?: () => void;
    onClose: () => void;
    siteUser: SiteUser | null;
    userRole: string | null;
    isMobile?: boolean;
    botsConfig?: any[]; // ChatBotConfig[]
}

const GLOBAL_CHANNEL_ID = '00000000-0000-0000-0000-000000000000';

// ANTYGRAVITY 2.0: MODERASYON VE GÜVENLİK MOTORU
const sanitize = (msg: string) => msg.replace(/küfür1|argo1|kötükelime/gi, '***');
const EMOTES: { [key: string]: string } = { ":hehe:": "/emotes/hehe.gif", ":dilMaymun:": "/emotes/dilMaymun.gif" };

const getRoleBadge = (role: string) => {
    switch (role?.toUpperCase()) {
        case 'KRAL': return '👑 ';
        case 'PATRON': return '💼 ';
        case 'ADMIN': return '🛡️ ';
        case 'MODERATOR': return '🔧 ';
        case 'BOT': return '🤖 ';
        default: return '';
    }
};

const isAuthorized = (role: string | null) => {
    if (!role) return false;
    const r = role.toUpperCase();
    return ['KRAL', 'PATRON', 'ADMIN', 'MODERATOR'].includes(r);
};

const renderMessageText = (text: string) => {
  if (!text) return '';
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


const ModernChat: React.FC<ModernChatProps> = ({ open, onOpen, onClose, siteUser, userRole, isMobile, botsConfig }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [mutedUsers, setMutedUsers] = useState<any[]>([]);
    const [activeMutePopup, setActiveMutePopup] = useState<string | null>(null);
    const [muteReason, setMuteReason] = useState('');
    const [lastMsgTime, setLastMsgTime] = useState(0);
    const [chatEnabled, setChatEnabled] = useState(true);
    const [rateLimitSec, setRateLimitSec] = useState(15);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Interactive States
    const [pinnedMessage, setPinnedMessage] = useState<{ text: string; username: string; role: string; } | null>(null);
    const [eventWidget, setEventWidget] = useState<{ show: boolean; title: string; brandName: string; promoName: string; prizeAmount: string; ctaText: string; ctaUrl: string; } | null>(null);
    const [activePoll, setActivePoll] = useState<{ question: string; options: string[]; votes: number[]; isActive: boolean; } | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [isEventCollapsed, setIsEventCollapsed] = useState(false);
    const [isPollCollapsed, setIsPollCollapsed] = useState(false);

    useEffect(() => {
        const handleOutsideClick = () => {
            setActiveMenuId(null);
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    useEffect(() => {
        if (activePoll) {
            const voted = localStorage.getItem(`poll_voted_${activePoll.question}`);
            setHasVoted(!!voted);
        }
    }, [activePoll]);

    const handlePinMessage = async (text: string, username: string, role: string) => {
        const newPin = { text, username, role };
        setPinnedMessage(newPin);
        try {
            const currentSettings = await getGlobalConfig('chat_settings') || {};
            const updatedSettings = {
                ...currentSettings,
                pinnedMessage: newPin
            };
            await updateGlobalConfig('chat_settings', updatedSettings);
        } catch (e) {
            console.error("Failed to pin message:", e);
        }
    };

    const handleUnpin = async () => {
        setPinnedMessage(null);
        try {
            const currentSettings = await getGlobalConfig('chat_settings') || {};
            const updatedSettings = {
                ...currentSettings,
                pinnedMessage: null
            };
            await updateGlobalConfig('chat_settings', updatedSettings);
        } catch (e) {
            console.error("Failed to unpin message:", e);
        }
    };

    const handleVote = async (optionIdx: number) => {
        if (!activePoll) return;
        const updatedVotes = [...activePoll.votes];
        updatedVotes[optionIdx] += 1;
        
        const newPoll = {
            ...activePoll,
            votes: updatedVotes
        };
        
        setActivePoll(newPoll);
        setHasVoted(true);
        localStorage.setItem(`poll_voted_${activePoll.question}`, 'true');

        try {
            const currentSettings = await getGlobalConfig('chat_settings') || {};
            const updatedSettings = {
                ...currentSettings,
                poll: newPoll
            };
            await updateGlobalConfig('chat_settings', updatedSettings);
        } catch (e) {
            console.error("Failed to submit vote:", e);
        }
    };

    // Fetch messages & subscribe to realtime updates
    useEffect(() => {
        if (!open) {
            setIsConnected(false);
            return;
        }

        let isMounted = true;

        const loadData = async () => {
            try {
                // Fetch last 100 messages for global channel
                const { data, error } = await supabase
                    .from('tv_chat')
                    .select('*')
                    .eq('channel_id', GLOBAL_CHANNEL_ID)
                    .order('created_at', { ascending: true })
                    .limit(100);

                if (error) throw error;

                if (isMounted) {
                    setMessages(data || []);
                    setIsConnected(true);
                    // Scroll to bottom
                    setTimeout(() => {
                        if (chatContainerRef.current) {
                            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                        }
                    }, 100);
                }
            } catch (err) {
                console.error('Error loading global chat:', err);
                if (isMounted) setIsConnected(true);
            }
        };

        const fetchMutes = async () => {
            try {
                const data = await getGlobalConfig('tv_mutes');
                if (data && Array.isArray(data.mutedUsers) && isMounted) {
                    setMutedUsers(data.mutedUsers);
                }
            } catch (e) {
                console.error("Load mutes failed in global chat:", e);
            }
        };

        loadData();
        fetchMutes();

        // Load chat settings for kill-switch and rate limit
        const loadChatSettings = async () => {
            try {
                const settings = await getGlobalConfig('chat_settings');
                if (settings && isMounted) {
                    setChatEnabled(settings.chat_enabled !== false);
                    setRateLimitSec(settings.rate_limit_seconds || 15);
                    setPinnedMessage(settings.pinnedMessage || null);
                    setEventWidget(settings.eventWidget || null);
                    setActivePoll(settings.poll || null);
                }
            } catch (e) {
                console.error('Chat settings load error:', e);
            }
        };
        loadChatSettings();
        const settingsInterval = setInterval(loadChatSettings, 30000);

        // Realtime Subscription
        const channel = supabase.channel('global-chat-room')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tv_chat' }, (payload) => {
                const m = payload.new;
                if (m.channel_id === GLOBAL_CHANNEL_ID && isMounted) {
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
    }, [open]);

    // Gelişmiş Bot Yönetimi Simülasyonu
    useEffect(() => {
        if (!open || !botsConfig || botsConfig.length === 0) return;
        
        const intervals: NodeJS.Timeout[] = [];

        botsConfig.forEach(bot => {
            if (!bot.isActive) return;
            
            bot.scenarios.forEach((scen: any) => {
                if (!scen.isActive) return;
                
                // Interval dk -> milisaniye
                const ms = (scen.intervalMinutes || 1) * 60 * 1000;
                
                const interval = setInterval(() => {
                    const newBotMsg = {
                        id: `bot_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,
                        username: bot.name,
                        role: bot.role,
                        message: scen.text,
                        botColor: bot.color, // Özel rengini mesaja ekliyoruz
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

        // Kill-switch check
        if (!chatEnabled && userRole !== 'admin') {
            alert('Sohbet şu anda yönetici tarafından kapatılmıştır.');
            return;
        }

        // Rate limiting (skip for admins)
        if (userRole !== 'admin') {
            const now = Date.now();
            const elapsed = (now - lastMsgTime) / 1000;
            if (elapsed < rateLimitSec) {
                const remaining = Math.ceil(rateLimitSec - elapsed);
                alert(`Lütfen yavaşlayın! ${remaining} saniye sonra tekrar mesaj atabilirsiniz.`);
                return;
            }
        }

        // Mute Check
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
            channel_id: GLOBAL_CHANNEL_ID,
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

    // ANTYGRAVITY 2.0: MODERASYON VE GÜVENLİK MOTORU
    const deleteMessage = async (msgId: string) => { await supabase.from('tv_chat').delete().eq('id', msgId); };
    const banUser = async (userId: string) => { await supabase.from('profiles').update({ role: 'banned' }).eq('id', userId); };

    // Admin commands
    const handleBanUser = async (targetUserId: string, targetUsername: string) => {
        try {
            await banUser(targetUserId);
            setActiveMutePopup(null);
            alert(`${targetUsername} başarıyla yasaklandı (Ban).`);
        } catch (e) {
            console.error("Ban user error:", e);
            alert("Kullanıcı yasaklanırken bir hata oluştu.");
        }
    };

    const handleMuteUser = async (targetUserId: string, targetUsername: string, days: number) => {
        if (!muteReason.trim()) {
            alert('Ceza nedeni girmek zorunludur!');
            return;
        }
        try {
            const muteUntil = days === -1 ? null : new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
            const mutedUntilTs = days === -1 ? -1 : Date.now() + days * 24 * 60 * 60 * 1000;

            let finalUserId = targetUserId;
            if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(finalUserId)) {
                const { data: memberData } = await supabase.from('members').select('id').eq('username', targetUsername).single();
                if (memberData?.id) {
                    finalUserId = memberData.id;
                } else {
                    alert('Kullanıcı veritabanında bulunamadı (Geçersiz UUID).');
                    return;
                }
            }

            // Insert into chat_bans table
            await supabase.from('chat_bans').insert({
                user_id: finalUserId,
                username: targetUsername,
                ban_type: 'mute',
                mute_until: muteUntil,
                reason: muteReason.trim(),
                admin_id: 'admin',
                admin_username: 'Yönetici',
                is_active: true
            });

            // Insert log
            await supabase.from('chat_moderation_logs').insert({
                action: 'mute_user',
                admin_id: 'admin',
                admin_username: 'Yönetici',
                target_user_id: finalUserId,
                target_username: targetUsername,
                details: { duration_days: days, reason: muteReason.trim() }
            });

            const mutesData = await getGlobalConfig('tv_mutes');
            let currentMutes = mutesData && Array.isArray(mutesData.mutedUsers) ? mutesData.mutedUsers : [];
            currentMutes = currentMutes.filter((m: any) => m.userId !== targetUserId);

            currentMutes.push({ userId: targetUserId, username: targetUsername, mutedUntil: mutedUntilTs });

            await updateGlobalConfig('tv_mutes', { mutedUsers: currentMutes });
            setMutedUsers(currentMutes);
            setActiveMutePopup(null);
            setMuteReason('');
            const durationText = days === -1 ? 'kalıcı olarak' : `${days} gün`;
            alert(`${targetUsername} adlı kullanıcı ${durationText} susturuldu. Neden: ${muteReason.trim()}`);
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
            alert("Kullanıcının cezası kaldırıldı.");
        } catch (e) {
            console.error("Unmute user error:", e);
        }
    };

    const handleDeleteMessage = async (msgId: string) => {
        try {
            await deleteMessage(msgId);
            setMessages(prev => prev.filter(m => m.id !== msgId));
        } catch (error) {
            console.error("Delete message error:", error);
        }
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    };

    const getRoleColor = (role: string, username?: string, msgObj?: any) => {
        if (msgObj && msgObj.botColor) return msgObj.botColor;
        const r = role?.toUpperCase();
        if (r === 'ADMIN') return '#EF4444'; // Kırmızı admin
        if (r === 'VIP') return '#38BDF8'; // Mavi VIP
        if (r === 'SYSTEM' || r === 'BOT') return '#10B981'; // Neon yeşil bot
        return '#10B981'; // Neon yeşil normal üyeler için
    };

    const getRoleBadge = (role: string, msgObj?: any) => {
        const r = role?.toUpperCase();
        
        if (r === 'ADMIN') {
            const color = msgObj?.botColor || '#10B981';
            return (
                <span 
                    className="px-1 py-0.5 rounded text-[8px] font-black text-black tracking-wider leading-none mr-1.5 uppercase"
                    style={{ background: `linear-gradient(to right, ${color}, #fff)` }}
                >
                    ADMIN
                </span>
            );
        }
        if (r === 'SYSTEM' || r === 'BOT') {
            const color = msgObj?.botColor || '#10B981';
            return (
                <span 
                    className="px-1 py-0.5 rounded text-[8px] font-black text-black tracking-wider leading-none mr-1.5 uppercase"
                    style={{ background: `linear-gradient(to right, ${color}, #fff)` }}
                >
                    SİSTEM
                </span>
            );
        }
        if (r === 'VIP') {
            return <Star className="w-2.5 h-2.5 text-sky-400 mr-1 flex-shrink-0 fill-sky-400" />;
        }
        return null;
    };

    const isLoggedIn = !!(siteUser || userRole);

    if (!open && !isMobile) {
        return null;
    }

    // ANTYGRAVITY 2.0: MODERASYON VE GÜVENLİK MOTORU
    const isAdmin = isAuthorized(userRole);
    return (
        <div id="tour-chat" className="h-full w-full flex flex-col bg-[#0F1219] shadow-2xl font-sans text-left">
            {/* Header */}
            <div className="bg-[#0F1219] px-4 py-3 text-white flex items-center justify-between flex-shrink-0 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#252A33] px-3 py-1.5 rounded text-xs font-bold hover:bg-[#2C323D] cursor-pointer transition-colors">
                        <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-4 h-3 rounded-sm object-cover" />
                        <span>Türkçe</span>
                        <span className="text-[10px] ml-1">▼</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                    <div className="flex items-center gap-1.5 text-xs font-bold hover:text-white transition-colors cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <span>2.485</span>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-white/5 active:scale-95 transition-all rounded text-zinc-400 hover:text-white"
                        title="Kapat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Pinned Message Bar */}
            {pinnedMessage && pinnedMessage.text && (
                <div className="bg-[#10B981]/10 px-4 py-3 flex items-center justify-between gap-3 text-left">
                    <div className="flex items-start gap-2 min-w-0">
                        <span className="text-[12px] mt-0.5 text-[#10B981]">📌</span>
                        <div className="min-w-0">
                            <div className="text-[10px] font-bold text-[#10B981] flex items-center gap-1">
                                <span>Sabitlendi</span>
                                <span className="text-[8px] text-zinc-500">•</span>
                                <span style={{ color: getRoleColor(pinnedMessage.role) }}>{pinnedMessage.username}</span>
                            </div>
                            <div className="text-xs text-gray-200 font-medium truncate max-w-[285px]" title={pinnedMessage.text}>
                                {pinnedMessage.text}
                            </div>
                        </div>
                    </div>
                    {isAdmin && (
                        <button 
                            onClick={handleUnpin}
                            className="text-[9px] font-black text-rose-400 hover:text-rose-500 uppercase tracking-wider flex-shrink-0"
                        >
                            Kaldır
                        </button>
                    )}
                </div>
            )}
            {/* Sticky Widgets Area (Event, Poll) */}
            {((eventWidget && eventWidget.show) || (activePoll && activePoll.isActive)) && (
                <div className="bg-[#0F1219] p-3 space-y-3 flex-shrink-0">
                    {/* Event Card */}
                    {eventWidget && eventWidget.show && (
                        <div className="bg-[#131C28] rounded-xl border-l-4 border-[#10B981] p-3 flex flex-col gap-2 transition-all">
                            <div 
                                onClick={() => setIsEventCollapsed(!isEventCollapsed)}
                                className="flex items-center justify-between text-xs font-bold text-white cursor-pointer select-none"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px]">🎫</span>
                                    <span>{eventWidget.title}</span>
                                </div>
                                <span className="text-[9px] text-gray-400 hover:text-white">
                                    {isEventCollapsed ? 'Göster ▼' : 'Gizle ▲'}
                                </span>
                            </div>
                            
                            {!isEventCollapsed && (
                                <div className="space-y-2 pt-2 mt-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center text-[10px]">🛡️</span>
                                        <span className="text-xs font-bold text-white">{eventWidget.brandName}</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-400 font-medium">{eventWidget.promoName}</span>
                                            <span className="text-xs font-black text-[#10B981]">{eventWidget.prizeAmount}</span>
                                        </div>
                                        {eventWidget.ctaUrl && (
                                            <a 
                                                href={eventWidget.ctaUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-[#111317] hover:bg-emerald-500 hover:text-black text-white font-bold text-[9px] py-1.5 px-3 rounded transition-all text-center"
                                            >
                                                {eventWidget.ctaText || 'Katıl'}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Poll Card */}
                    {activePoll && activePoll.isActive && (
                         <div className="bg-[#131C28] rounded-xl border-l-4 border-[#10B981] p-3 flex flex-col gap-2 transition-all">
                             <div 
                                 onClick={() => setIsPollCollapsed(!isPollCollapsed)}
                                 className="flex items-center justify-between text-xs font-bold text-sky-400 cursor-pointer select-none"
                             >
                                 <div className="flex items-center gap-1.5">
                                     <span className="text-[10px]">📊</span>
                                     <span>Sohbet Anketi</span>
                                 </div>
                                 <span className="text-[9px] text-gray-400 hover:text-white">
                                     {isPollCollapsed ? 'Göster ▼' : 'Gizle ▲'}
                                 </span>
                             </div>

                             {!isPollCollapsed && (
                                 <div className="space-y-2 pt-2 mt-2">
                                     <div className="text-xs font-bold text-white">
                                         {activePoll.question}
                                     </div>
                                     {hasVoted ? (
                                         <div className="space-y-1.5">
                                             {activePoll.options.map((opt: string, idx: number) => {
                                                 const totalVotes = activePoll.votes.reduce((a: number, b: number) => a + b, 0) || 1;
                                                 const percentage = Math.round((activePoll.votes[idx] / totalVotes) * 100);
                                                 return (
                                                     <div key={idx} className="space-y-0.5">
                                                         <div className="flex justify-between text-[9px] text-gray-300 font-bold">
                                                             <span>{opt}</span>
                                                             <span>%{percentage} ({activePoll.votes[idx]} Oy)</span>
                                                         </div>
                                                         <div className="w-full bg-[#111317] rounded-full h-1 overflow-hidden">
                                                             <div className="bg-[#10B981] h-1 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                         </div>
                                                     </div>
                                                 );
                                             })}
                                         </div>
                                     ) : (
                                         <div className="flex flex-col gap-1.5">
                                             {activePoll.options.map((opt: string, idx: number) => (
                                                 <button 
                                                     key={idx}
                                                     onClick={() => handleVote(idx)}
                                                     className="w-full bg-[#0F1219] hover:bg-[#10B981]/10 hover:text-white text-slate-300 font-bold text-[9px] py-2 px-3 rounded-xl text-left transition-all border-none"
                                                 >
                                                     {opt}
                                                 </button>
                                             ))}
                                         </div>
                                     )}
                                 </div>
                             )}
                         </div>
                     )}
                </div>
            )}
            {/* Messages Area */}
            <div 
                ref={chatContainerRef} 
                id="new-chat-container" 
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,255,163,0.12) transparent' }}
            >


                {!isConnected ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-ping" />
                            Bağlanıyor...
                        </p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-gray-500">Henüz mesaj yok. İlk mesajı sen yaz!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => (
                        <div 
                            key={msg.id || i} 
                            className={`p-3 flex flex-row gap-3 relative group text-left cursor-default border-b border-white/5 hover:bg-[#10B981]/5 transition-colors ${
                                msg.role?.toUpperCase() === 'ADMIN' ? 'bg-[#092b19]/20' : 
                                (msg.role?.toUpperCase() === 'SYSTEM' || msg.role?.toUpperCase() === 'BOT') ? 'bg-transparent' : 
                                'bg-transparent'
                            }`}
                            onContextMenu={(e) => {
                                if (isAdmin) {
                                    e.preventDefault();
                                    setActiveMenuId(activeMenuId === msg.id ? null : msg.id);
                                    setActiveMutePopup(null);
                                }
                            }}
                        >
                            {/* Avatar placeholder - using DiceBear for now based on username */}
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 overflow-hidden mt-1 border border-white/10">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.username}`} alt={msg.username} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">
                                        {formatTime(msg.created_at)}
                                    </span>
                                    {msg.role?.toUpperCase() === 'ADMIN' && !msg.botColor && (
                                        <span className="bg-gradient-to-br from-[#10B981] to-[#00CC82] text-black px-1.5 py-0.5 rounded-sm text-[9px] font-black leading-none text-center shadow-[0_4px_12px_rgba(0,255,163,0.3)]">
                                            ADM
                                        </span>
                                    )}
                                    <span 
                                        className="text-xs font-bold tracking-wide" 
                                        style={{ color: getRoleColor(msg.role, msg.username, msg) }}
                                    >
                                        {getRoleBadge(msg.role, msg)}{msg.username || 'Misafir'}
                                    </span>
                                </div>
                                <div className={`text-[12px] leading-relaxed break-words pr-4 antialiased ${
                                    (msg.role?.toUpperCase() === 'SYSTEM' || msg.role?.toUpperCase() === 'ADMIN') ? 'font-bold' : 'text-zinc-300 font-normal'
                                }`} style={{ color: (msg.role?.toUpperCase() === 'SYSTEM' || msg.role?.toUpperCase() === 'ADMIN') ? (msg.botColor || '#10B981') : undefined }}>
                                    {renderMessageText(msg.message)}
                                </div>
                            </div>

                            {/* Admin actions block (Three Dots / Context Menu) */}
                            {isAdmin && (
                              <div className="absolute right-2 top-2 z-50">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuId(activeMenuId === msg.id ? null : msg.id);
                                    setActiveMutePopup(null);
                                  }}
                                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity p-0.5 rounded hover:bg-white/5"
                                  title="İşlemler"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>

                                {activeMenuId === msg.id && (
                                  <div className="absolute right-0 mt-1 bg-[#1A1D24] rounded-lg shadow-2xl py-1 w-28 z-50 text-[10px] font-bold text-gray-200">
                                    <button 
                                      onClick={() => {
                                        handlePinMessage(msg.message, msg.username, msg.role || 'member');
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 hover:bg-white/5 hover:text-[#10B981] transition-colors flex items-center gap-1.5"
                                    >
                                      📌 Sabitle
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleDeleteMessage(msg.id);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 hover:bg-white/5 hover:text-red-400 transition-colors flex items-center gap-1.5"
                                    >
                                      🗑️ Sil
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setActiveMutePopup(msg.id);
                                        setActiveMenuId(null);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 hover:bg-white/5 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
                                    >
                                      🚫 Sustur
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {activeMutePopup === msg.id && (
                                <div style={{ position: 'absolute', right: '40px', bottom: '24px', background: '#111317', borderRadius: '8px', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.8)', minWidth: '220px' }}>
                                    <div style={{ padding: '12px' }}>
                                        <input value={muteReason} onChange={(e) => setMuteReason(e.target.value)} placeholder="Ceza nedeni (zorunlu)" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '8px 10px', fontSize: '10px', color: '#fff', outline: 'none', border: 'none' }} />
                                    </div>
                                    <button onClick={() => handleMuteUser(msg.user_id, msg.username, 7)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>1 Hafta Sustur</button>
                                    <button onClick={() => handleMuteUser(msg.user_id, msg.username, 30)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>1 Ay Sustur</button>
                                    <button onClick={() => handleMuteUser(msg.user_id, msg.username, 60)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>2 Ay Sustur</button>
                                    <button onClick={() => handleMuteUser(msg.user_id, msg.username, -1)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>Kalıcı Sustur</button>
                                    <button onClick={() => handleUnmuteUser(msg.user_id)} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: 'none', color: '#10b981', fontSize: '11px', textAlign: 'left', cursor: 'pointer', marginTop: '4px' }}>Cezayı Kaldır</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Input Footer Area */}
            <div className="p-3 bg-[#0F1219] flex flex-col gap-3 flex-shrink-0 mt-0 border-t border-white/5">
                {/* Message Input */}
                {!siteUser ? (
                    <div className="p-2 flex flex-col items-center justify-center gap-2">
                        <input 
                            type="text"
                            disabled
                            placeholder="Sohbete katılmak için Giriş Yap veya Üye Ol"
                            className="w-full bg-[#1C1F26] border border-white/5 text-[11px] font-bold text-center text-gray-500 rounded px-4 py-3 cursor-not-allowed"
                        />
                    </div>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex flex-col gap-2 w-full">
                        <div className="relative flex items-center bg-[#1C1F26] border border-transparent focus-within:border-emerald-500 rounded overflow-hidden transition-all duration-300">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Start typing.."
                                className="flex-1 bg-transparent text-sm text-gray-200 focus:outline-none placeholder-zinc-500 px-4 py-3"
                            />
                            <div className="flex items-center pr-2 gap-1 h-full">
                                <button type="button" className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded hover:bg-white/5" title="Emoji">
                                    <Smile className="w-4 h-4" />
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="text-emerald-500 hover:text-emerald-400 disabled:opacity-30 disabled:hover:text-emerald-500 transition-colors p-1.5 rounded hover:bg-emerald-500/10 ml-1"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ModernChat;
