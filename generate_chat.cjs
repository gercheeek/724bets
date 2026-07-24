const fs = require('fs');

const content = `import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Shield, Smile, Cpu, Target, ChevronDown, Users, Crown, Star, User, MoreVertical, Trash2, Ban, Reply, AtSign } from 'lucide-react';
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
const EMOTES: { [key: string]: string } = { ":hehe:": "/emotes/hehe.gif", ":dilMaymun:": "/emotes/dilMaymun.gif", ":pepega:": "/emotes/pepega.png", ":pogchamp:": "/emotes/pogchamp.png" };

const isAuthorized = (role: string | null) => {
    if (!role) return false;
    const r = role.toUpperCase();
    return ['KRAL', 'PATRON', 'ADMIN', 'MODERATOR'].includes(r);
};

const maskUsername = (username?: string) => {
    if (!username) return 'Misafir';
    if (username.length <= 4) return username;
    return username.substring(0, 2) + '*'.repeat(username.length - 4) + username.substring(username.length - 2);
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
    
    // New Gen Chat States
    const [replyTo, setReplyTo] = useState<{username: string, text: string} | null>(null);
    const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);
    const [showEmotes, setShowEmotes] = useState(false);
    
    const isSystemOrCountdown = (msg: any) => {
        if (!msg || !msg.message || typeof msg.message !== 'string') return false;
        const text = msg.message;
        const role = (msg.role || '').toLowerCase();
        const user = (msg.username || '').toLowerCase();
        
        return (
            role === 'system' || role === 'system_announcement' ||
            user === 'system' || user === 'sistem' || text.includes('⏳') ||
            /geri sayım/i.test(text) || /\[DUYURU\]/i.test(text) ||
            /\[ANNOUNCEMENT\]/i.test(text) || /\[SİSTEM\]/i.test(text) || /^⏳\\s*\\d+/i.test(text)
        );
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
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
                    .limit(50);
                
                if (data) data.reverse();

                if (isMounted) {
                    setMessages(prev => {
                        const localBots = prev.filter(m => m.id && (m.id.startsWith('group_bot_') || m.id.startsWith('tip_')));
                        const merged = [...(data || []), ...localBots];
                        return merged.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                    });
                    setIsConnected(true);
                    setTimeout(scrollToBottom, 100);
                }
            } catch (err) {
                console.error('Error loading chat:', err);
                if (isMounted) setIsConnected(true);
            }
        };

        const fetchMutes = async () => {
            try {
                const data = await getGlobalConfig('tv_mutes');
                if (data && Array.isArray(data.mutedUsers) && isMounted) {
                    setMutedUsers(data.mutedUsers);
                }
            } catch (e) {}
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
            } catch (e) {}
        };
        loadChatSettings();
        const settingsInterval = setInterval(loadChatSettings, 30000);

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
                    setTimeout(scrollToBottom, 50);
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

    const triggerRainAnimation = () => {
        const duration = 4000;
        const animationEnd = Date.now() + duration;
        const frame = () => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return;
            confetti({ particleCount: 5, angle: 90, spread: 90, origin: { x: Math.random(), y: -0.1 }, colors: ['#FFD700', '#FFA500', '#00e701'], shapes: ['circle', 'square'], gravity: 1.5, scalar: 1.2, ticks: 400, zIndex: 9999 });
            requestAnimationFrame(frame);
        };
        frame();
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!siteUser) { alert("Sohbet edebilmek için giriş yapmalısınız."); return; }
        if (mutedUsers.includes(siteUser.username)) { alert("Sohbetten banlandınız veya geçici olarak susturuldunuz."); return; }
        if (!chatEnabled && !isAuthorized(userRole)) { alert("Sohbet şu anda yöneticiler tarafından devredışı bırakıldı."); return; }
        if (!newMessage.trim()) return;

        const now = Date.now();
        if (!isAuthorized(userRole) && now - lastMsgTime < rateLimitSec * 1000) {
            alert(\`Çok hızlı mesaj gönderiyorsunuz. Lütfen \${rateLimitSec} saniye bekleyin.\`);
            return;
        }

        let finalMsg = sanitize(newMessage.trim());
        if (replyTo) {
            finalMsg = \`[REPLY:\${replyTo.username}] \${finalMsg}\`;
        }

        const msgObj = {
            channel_id: activeLang.id,
            user_id: siteUser.id,
            username: siteUser.username,
            role: userRole || 'user',
            message: finalMsg
        };

        setNewMessage('');
        setReplyTo(null);
        setShowEmotes(false);
        setLastMsgTime(now);

        try {
            await supabase.from('tv_chat').insert([msgObj]);
        } catch (error) {
            console.error('Message send error:', error);
            alert("Mesaj gönderilemedi, lütfen tekrar deneyin.");
        }
    };

    // Inline Admin Controls
    const deleteMessage = async (id: string) => {
        if (!isAuthorized(userRole)) return;
        try {
            await supabase.from('tv_chat').delete().eq('id', id);
        } catch (e) {
            console.error(e);
        }
    };

    const muteUser = async (username: string) => {
        if (!isAuthorized(userRole) || !username) return;
        if (!confirm(\`\${username} adlı kullanıcıyı susturmak istediğinize emin misiniz?\`)) return;
        
        try {
            const data = await getGlobalConfig('tv_mutes');
            const currentMutes = data?.mutedUsers || [];
            if (!currentMutes.includes(username)) {
                currentMutes.push(username);
                await updateGlobalConfig('tv_mutes', { mutedUsers: currentMutes });
                setMutedUsers(currentMutes);
                alert(\`\${username} susturuldu.\`);
            }
        } catch (e) {
            console.error("Mute error", e);
        }
    };

    const handleMention = (username: string) => {
        setNewMessage(prev => prev + \`@\${username} \`);
    };

    const renderMessageTextNew = (msg: any) => {
        let text = msg.message;
        if (!text || typeof text !== 'string') return null;
        text = text.replace('[RAIN_EVENT_END] ', '');
        
        let replyContext = null;
        const replyMatch = text.match(/^\\[REPLY:([^\\]]+)\\]\\s*(.*)$/);
        if (replyMatch) {
            replyContext = replyMatch[1];
            text = replyMatch[2];
        }

        // Mention highlight
        const mentionRegex = new RegExp(\`@\${siteUser?.username}\`, 'gi');
        const hasMention = siteUser && text.match(mentionRegex);

        const betShareRegex = /^(Casino|Spor):\\s*#([\\d\\.]+)\\s+(.*)$/i;
        const betMatch = text.match(betShareRegex);
        
        let content = null;
        if (betMatch) {
            const type = betMatch[1] as 'Casino' | 'Spor';
            const betId = betMatch[2];
            const remainingText = betMatch[3];
            content = (
                <div className="flex flex-col gap-1.5 mt-0.5">
                    <div onClick={() => setSelectedBet({id: betId, user: msg.username, type})} className="inline-flex items-center gap-1.5 bg-[#0A0D12] hover:bg-[#11151C] transition-colors rounded px-2.5 py-1 text-[13px] font-bold cursor-pointer select-none border border-emerald-500/30 text-emerald-400 w-fit shadow-sm">
                        <Target className="w-3.5 h-3.5" />
                        {type}: #{betId}
                    </div>
                    <span className="mt-1">{remainingText}</span>
                </div>
            );
        } else {
            const parts = text.split(/(:\\w+:)/g);
            content = parts.map((part, index) => {
                if (EMOTES[part]) {
                    return <img key={index} src={EMOTES[part]} alt={part} className="inline-block h-6 w-6 align-middle mx-0.5" />;
                }
                if (part.startsWith('@')) {
                    const isMe = siteUser && part.toLowerCase() === \`@\${siteUser.username.toLowerCase()}\`;
                    return <span key={index} className={\`font-bold \${isMe ? 'text-[#00E701] bg-[#00E701]/10 px-1 rounded' : 'text-blue-400'}\`}>{part}</span>;
                }
                return part;
            });
        }

        return (
            <div className="flex flex-col">
                {replyContext && (
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1 bg-white/5 w-fit px-2 py-0.5 rounded border-l-2 border-gray-600">
                        <Reply className="w-3 h-3" />
                        <span>Yanıt: <b>{maskUsername(replyContext)}</b></span>
                    </div>
                )}
                <div className={\`\${hasMention ? 'bg-[#00E701]/5 p-1 rounded-sm' : ''}\`}>
                    {content}
                </div>
            </div>
        );
    };

    const finalMessages = messages.slice(-50);

    return (
        <div className="h-full w-full flex flex-col bg-[#0F111A]">
            {/* New Gen Header */}
            <div className="bg-[#141722] px-4 h-[65px] flex items-center justify-between flex-shrink-0 relative z-30 shadow-md">
                <div className="flex items-center gap-3">
                    <div 
                        onClick={() => setShowLangMenu(!showLangMenu)}
                        className="flex items-center gap-2 bg-[#1f2330] px-3 py-1.5 rounded-lg text-[13px] font-semibold hover:bg-[#2a2f40] cursor-pointer transition-all text-gray-200 border border-white/5"
                    >
                        <img src={\`https://flagcdn.com/w20/\${activeLang.flag}.png\`} alt={activeLang.code} className="w-4 h-3 rounded-sm object-cover" />
                        <span>{activeLang.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-1" />
                    </div>
                    {showLangMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                            <div className="absolute top-[50px] left-4 w-40 bg-[#1f2330] rounded-xl shadow-2xl z-20 py-2 overflow-hidden border border-white/10">
                                {LANGUAGES.map(lang => (
                                    <div 
                                        key={lang.id}
                                        onClick={() => { setActiveLang(lang); setShowLangMenu(false); }}
                                        className={\`flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold cursor-pointer transition-colors \${activeLang.id === lang.id ? 'bg-[#2a2f40] text-white border-l-2 border-[#00E701]' : 'text-gray-400 hover:bg-[#2a2f40] hover:text-white border-l-2 border-transparent'}\`}
                                    >
                                        <img src={\`https://flagcdn.com/w20/\${lang.flag}.png\`} alt={lang.code} className="w-5 h-3.5 rounded-sm object-cover shadow-sm" />
                                        <span>{lang.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5 bg-[#00E701]/10 text-[#00E701] px-2.5 py-1 rounded-full text-xs font-bold border border-[#00E701]/20">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#00E701] animate-pulse"></div>
                       <span>{Math.floor(Math.random() * 500) + 1500}</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-[#1f2330] hover:bg-red-500/20 transition-all rounded-full text-gray-400 hover:text-red-400">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-[#0F111A] scroll-smooth"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}
            >
                {!isConnected ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-[#00E701] animate-ping" />
                            <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Sohbete Bağlanılıyor...</span>
                        </div>
                    </div>
                ) : finalMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-600 font-medium bg-white/5 px-4 py-2 rounded-xl">Burada henüz kimse yok. İlk mesajı sen gönder!</p>
                    </div>
                ) : (
                    finalMessages.map((msg, i) => {
                        const isSystem = isSystemOrCountdown(msg);
                        
                        if (isSystem) {
                            return (
                                <div key={msg.id || i} className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border-l-2 border-amber-500 flex items-start gap-3 relative overflow-hidden group shadow-sm">
                                     <div className="text-amber-500 mt-0.5"><Cpu className="w-5 h-5" /></div>
                                     <div className="flex-1 min-w-0">
                                         <h4 className="text-amber-500 font-black text-[11px] uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                                             SİSTEM DUYURUSU
                                         </h4>
                                         <div className="text-gray-200 text-[13px] font-medium leading-relaxed break-words">
                                             {msg.message}
                                         </div>
                                     </div>
                                </div>
                            );
                        }

                        const isMod = msg.role?.toUpperCase() === 'ADMIN' || msg.role?.toUpperCase() === 'MODERATOR' || msg.role?.toUpperCase() === 'KRAL';
                        const time = new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
                        const defaultAvatar = \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${msg.username || 'Misafir'}&backgroundColor=2A2E38\`;

                        return (
                            <div 
                                key={msg.id || i} 
                                onMouseEnter={() => setHoveredMsgId(msg.id)}
                                onMouseLeave={() => setHoveredMsgId(null)}
                                className="group relative p-2.5 rounded-xl hover:bg-[#161925] transition-colors flex items-start gap-3"
                            >
                                {/* Admin/Mod Hover Actions */}
                                {hoveredMsgId === msg.id && (
                                    <div className="absolute right-2 top-2 flex items-center gap-1 bg-[#1a1e2d] border border-white/10 rounded-lg p-1 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setReplyTo({username: msg.username, text: msg.message}); }} className="p-1.5 text-gray-400 hover:text-[#00E701] hover:bg-white/5 rounded-md transition-colors tooltip" title="Yanıtla">
                                            <Reply className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleMention(msg.username)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-white/5 rounded-md transition-colors tooltip" title="Bahset">
                                            <AtSign className="w-3.5 h-3.5" />
                                        </button>
                                        {isAuthorized(userRole) && (
                                            <>
                                                <button onClick={() => deleteMessage(msg.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-white/5 rounded-md transition-colors" title="Mesajı Sil">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => muteUser(msg.username)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-white/5 rounded-md transition-colors" title="Sustur (Mute)">
                                                    <Ban className="w-3.5 h-3.5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-col items-center shrink-0 gap-1 mt-1">
                                    <div className="w-8 h-8 rounded-lg bg-[#1a1e2d] overflow-hidden flex items-center justify-center ring-1 ring-white/10">
                                        <img src={defaultAvatar} alt="avatar" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        {isMod ? (
                                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 uppercase">
                                                <Shield className="w-3 h-3" /> YÖNETİCİ
                                            </span>
                                        ) : (
                                            <span className="text-[#87909F]">
                                                <User className="w-3.5 h-3.5" />
                                            </span>
                                        )}
                                        <span 
                                            onClick={() => handleMention(msg.username)}
                                            className={\`font-bold text-[13px] tracking-wide truncate max-w-[140px] cursor-pointer hover:underline \${isMod ? 'text-amber-500' : 'text-gray-200'}\`}
                                        >
                                            {maskUsername(msg.username)}
                                        </span>
                                        <span className="text-[#6C7381] text-[10px] font-medium ml-auto">
                                            {time}
                                        </span>
                                    </div>
                                    
                                    <div className={\`text-[13px] leading-relaxed break-words \${isMod ? 'text-white' : 'text-gray-300'}\`}>
                                        {renderMessageTextNew(msg)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Chat Input Area */}
            <div className="p-3 bg-[#141722] border-t border-white/5 relative z-30">
                {replyTo && (
                    <div className="mb-2 flex items-center justify-between bg-[#1a1e2d] border border-white/10 px-3 py-2 rounded-lg">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <Reply className="w-4 h-4 text-[#00E701]" />
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] text-[#00E701] font-bold">Yanıtlanıyor: {maskUsername(replyTo.username)}</span>
                                <span className="text-xs text-gray-400 truncate">{replyTo.text}</span>
                            </div>
                        </div>
                        <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {!siteUser ? (
                    <button 
                        onClick={() => window.dispatchEvent(new Event('openLoginModal'))}
                        className="w-full bg-[#1a1e2d] hover:bg-[#202538] border border-white/10 text-white font-medium text-[13px] rounded-xl px-4 py-3 transition-all flex items-center justify-between group"
                    >
                        <span className="text-gray-400 group-hover:text-white transition-colors">Sohbete katılmak için giriş yapın...</span>
                        <Send className="w-5 h-5 text-[#00E701] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                ) : (
                    <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#1a1e2d] focus-within:bg-[#202538] focus-within:ring-1 focus-within:ring-[#00E701]/30 border border-white/5 rounded-xl overflow-visible transition-all h-[46px] shadow-inner">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={chatEnabled || isAuthorized(userRole) ? "Mesajınızı yazın..." : "Sohbet devredışı."}
                            disabled={!chatEnabled && !isAuthorized(userRole)}
                            className="flex-1 bg-transparent text-[13px] font-medium text-white focus:outline-none placeholder-gray-500 px-4 disabled:opacity-50"
                        />
                        <div className="flex items-center pr-1.5 gap-1 h-full shrink-0 relative">
                            {/* Emote Picker Trigger */}
                            <button 
                                type="button" 
                                onClick={() => setShowEmotes(!showEmotes)}
                                className={\`transition-colors p-1.5 rounded-lg \${showEmotes ? 'text-[#00E701] bg-[#00E701]/10' : 'text-gray-500 hover:text-white hover:bg-white/5'}\`}
                            >
                                <Smile className="w-5 h-5" />
                            </button>
                            
                            {/* Emote Popover */}
                            {showEmotes && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowEmotes(false)}></div>
                                    <div className="absolute bottom-[55px] right-0 w-64 bg-[#1f2330] rounded-xl shadow-2xl z-50 p-3 border border-white/10 grid grid-cols-4 gap-2">
                                        {Object.entries(EMOTES).map(([code, url]) => (
                                            <div 
                                                key={code}
                                                onClick={() => { setNewMessage(prev => prev + \` \${code} \`); setShowEmotes(false); }}
                                                className="aspect-square bg-[#1a1e2d] hover:bg-[#2a2f40] rounded-lg flex items-center justify-center cursor-pointer border border-white/5 transition-colors"
                                            >
                                                <img src={url} alt={code} className="w-8 h-8 object-contain" />
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={(!newMessage.trim() && !replyTo) || (!chatEnabled && !isAuthorized(userRole))}
                                className="text-[#00E701] disabled:text-gray-600 disabled:bg-transparent bg-[#00E701]/10 hover:bg-[#00E701]/20 transition-all p-2 rounded-lg ml-0.5"
                            >
                                <Send className="w-5 h-5" />
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
`

fs.writeFileSync('components/ModernChat.tsx', content);
console.log("ModernChat.tsx updated successfully.");
