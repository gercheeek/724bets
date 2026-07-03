import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Star, Shield, Trash2, Smile } from 'lucide-react';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import { SiteUser } from '../types';

interface ModernChatProps {
    open: boolean;
    onClose: () => void;
    siteUser: SiteUser | null;
    userRole: string | null;
    isMobile?: boolean;
}

const GLOBAL_CHANNEL_ID = '00000000-0000-0000-0000-000000000000';

// ANTYGRAVITY 2.0: MODERASYON VE GÜVENLİK MOTORU
const sanitize = (msg: string) => msg.replace(/küfür1|argo1|kötükelime/gi, '***');
const EMOTES: { [key: string]: string } = { ":hehe:": "/emotes/hehe.gif", ":dilMaymun:": "/emotes/dilMaymun.gif" };

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


const ModernChat: React.FC<ModernChatProps> = ({ open, onClose, siteUser, userRole, isMobile }) => {
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

        const { error } = await supabase.from('tv_chat').insert(msgObj);
        if (error) {
            console.error("Global chat insert error:", error);
        } else {
            setLastMsgTime(Date.now());
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

    const getRoleColor = (role: string) => {
        if (role === 'admin') return '#FFD700';
        if (role === 'vip') return '#00BFFF';
        return '#f3f4f6';
    };

    const getRoleBadge = (role: string) => {
        if (role === 'admin') {
            return (
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 px-1 py-0.5 rounded text-[8px] font-black text-black tracking-wider leading-none mr-1.5 uppercase">
                    ADMIN
                </span>
            );
        }
        if (role === 'vip') {
            return <Star className="w-2.5 h-2.5 text-sky-400 mr-1 flex-shrink-0 fill-sky-400" />;
        }
        return null;
    };

    if (!open) return null;

    const isLoggedIn = !!(siteUser || userRole);
    // ANTYGRAVITY 2.0: MODERASYON VE GÜVENLİK MOTORU
    const isAdmin = true; // Gerçek sistemde bu, Supabase'den gelen role değerine bağlı olacak
    return (
        <div id="modern-chat-inject" className="h-full w-full flex flex-col bg-[#1a1a1c] md:border-l border-white/5 shadow-2xl font-sans text-left">
            {/* Header */}
            <div className="bg-[#1a1a1c] p-4 text-white font-bold flex items-center gap-3 border-b border-white/5 flex-shrink-0">
                {isMobile && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" title="Kapat">
                        <X className="w-5 h-5" />
                    </button>
                )}
                <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">💬</span>
                    <span className="text-sm font-semibold tracking-wide">Sohbet</span>
                </div>
            </div>

            {/* Messages Area */}
            <div 
                ref={chatContainerRef} 
                id="new-chat-container" 
                className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
            >
                {/* Telegram Join Card */}
                <div className="bg-[#242427] border border-white/5 rounded-lg p-3 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Send className="w-4 h-4 text-sky-400 rotate-45" />
                        <span>Telegram'da Bize Katıl!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 bg-[#1a1a1a] p-1 rounded-md">
                        <button className="bg-white/10 text-white text-[11px] font-semibold py-1 rounded shadow-sm">
                            Sohbet
                        </button>
                        <button className="text-gray-400 hover:text-white text-[11px] font-semibold py-1 rounded transition-colors">
                            Duyuru
                        </button>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/10 px-2 py-1.5 rounded text-center">
                        telegram gel aksakalli
                    </div>
                </div>

                {/* Event Card */}
                <div className="bg-[#242427] border border-white/5 rounded-lg p-3 flex flex-col gap-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-white border-b border-white/5 pb-2">
                        <span className="text-[10px]">🎫</span>
                        <span>Yeni Etkinlik</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center text-xs">🛡️</span>
                        <span className="text-xs font-bold text-white">Gamdom</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-400 font-medium">Kod Etkinliği</span>
                        <span className="text-sm font-black text-amber-400">920.000 TL</span>
                    </div>
                    <button className="w-full bg-[#1a1a1a] hover:bg-[#1a1a1a]/80 text-white font-bold text-[10px] py-1.5 rounded transition-all">
                        Etkinliğe Katıl
                    </button>
                </div>

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
                        <div key={msg.id || i} className="bg-[#242427] border border-white/5 rounded-lg p-3 flex flex-col gap-1.5 relative group text-left">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-white/10 px-1 py-0.5 rounded text-[9px] font-black text-gray-300 min-w-[16px] text-center">
                                    {msg.role === 'admin' ? '99' : (Math.abs((msg.username || 'User').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)) % 10) + 1}
                                </span>
                                <span 
                                    className="text-xs font-bold" 
                                    style={{ color: getRoleColor(msg.role) }}
                                >
                                    {msg.username}
                                </span>
                                <span className="text-[9px] text-gray-500 ml-auto">
                                    {formatTime(msg.created_at)}
                                </span>
                            </div>
                            <div className="text-xs text-gray-300 leading-relaxed break-words">
                                {renderMessageText(msg.message)}
                            </div>

                            {/* Admin actions block */}
                            {isAdmin && (
                              <div className="opacity-0 group-hover:opacity-100 flex gap-2 text-[10px] absolute right-3 bottom-2 bg-[#242427] pl-2 transition-opacity duration-150">
                                <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 font-bold hover:underline">SİL</button>
                                <button onClick={() => setActiveMutePopup(activeMutePopup === msg.id ? null : msg.id)} className="text-amber-500 font-bold hover:underline">CEZA</button>
                              </div>
                            )}

                            {activeMutePopup === msg.id && (
                                <div style={{ position: 'absolute', right: '40px', bottom: '24px', background: '#111116', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', zIndex: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', minWidth: '220px' }}>
                                    <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <input value={muteReason} onChange={(e) => setMuteReason(e.target.value)} placeholder="Ceza nedeni (zorunlu)" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 8px', fontSize: '10px', color: '#fff', outline: 'none' }} />
                                    </div>
                                    <button onClick={() => handleMuteUser(msg.user_id, msg.username, 7)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>1 Hafta Sustur</button>
                                    <button onClick={() => handleMuteUser(msg.user_id, msg.username, 30)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>1 Ay Sustur</button>
                                    <button onClick={() => handleMuteUser(msg.user_id, msg.username, 60)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>2 Ay Sustur</button>
                                    <button onClick={() => handleMuteUser(msg.user_id, msg.username, -1)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '11px', textAlign: 'left', cursor: 'pointer' }}>Kalıcı Sustur</button>
                                    <button onClick={() => handleUnmuteUser(msg.user_id)} style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#10b981', fontSize: '11px', textAlign: 'left', cursor: 'pointer', borderTop: '1px solid rgba(255,255,255,0.05)' }}>Cezayı Kaldır</button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Input Footer Area */}
            <div className="p-4 bg-[#1a1a1a] border-t border-white/5 flex flex-col gap-3 flex-shrink-0">
                {isLoggedIn ? (
                    <form onSubmit={handleSendMessage} className="flex flex-col gap-2 w-full">
                        <div className="relative flex items-center bg-[#242427] border border-white/5 rounded-lg overflow-hidden px-3 py-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Bir mesaj yazın..."
                                className="flex-1 bg-transparent text-sm text-gray-200 focus:outline-none placeholder-gray-500"
                            />
                            <button type="button" className="text-gray-400 hover:text-white transition-colors px-1" title="Emoji">
                                <Smile className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="self-end px-5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-emerald-500 text-xs font-bold text-white transition-all active:scale-95 uppercase tracking-wider"
                        >
                            Gönder
                        </button>
                    </form>
                ) : (
                    <div className="flex flex-col gap-2 w-full">
                        <div className="relative flex items-center bg-[#242427] border border-white/5 rounded-lg px-3 py-2.5 cursor-not-allowed">
                            <span className="flex-1 text-xs text-gray-400">Giriş yapmanız gerekmektedir.</span>
                            <Smile className="w-4 h-4 text-gray-500" />
                        </div>
                        <button
                            disabled
                            className="self-end px-5 py-1.5 rounded bg-emerald-500/20 text-emerald-500/50 text-xs font-bold transition-all cursor-not-allowed uppercase tracking-wider"
                        >
                            Gönder
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModernChat;
