import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Shield, Smile, Cpu, Target, ChevronDown, MessageCircle, MoreVertical, Heart, CornerUpLeft, Trash2, VolumeX, Ban, User, Check, Star, Trophy, Settings, UserX, Flag, ExternalLink, Sparkles, Plus, Medal, ArrowRight, Activity, Ticket, Image as ImageIcon, ChevronRight, Share2, Crown, Flame, Snowflake, Train } from 'lucide-react';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import { triggerGlobalToast } from './GlobalToaster';
import { useTranslation } from 'react-i18next';
import { SiteUser } from '../types';
import { BetShareModal } from './BetShareModal';
import confetti from 'canvas-confetti';
import GifPicker from './GifPicker';
import CanvasRainEngine from './chat/CanvasRainEngine';
import RainEventBanner from './chat/RainEventBanner';
import SystemRainResultMessage from './chat/SystemRainResultMessage';
import AdminRainControl from './AdminRainControl';
import { useRainEvent } from '../hooks/useRainEvent';

const POPULAR_EMOJIS = [
    '😀','😃','😄','😁','😆','😅','😂','🤣','🥲','☺️',
    '😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗',
    '😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓',
    '😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕',
    '🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤',
    '😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰',
    '😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑',
    '👍','👎','👏','🙌','👐','🤲','🤝','🙏','🔥','💯',
    '💸','💵','💶','💷','💎','🚀','🌙','☀️','⭐','🌟'
];

const CHANNELS = [
    { id: 'global', name: 'Global', emoji: '🌐' },
    { id: 'tr', name: 'Türkiye', emoji: '🇹🇷' },
    { id: 'br', name: 'Brezilya', emoji: '🇧🇷' },
    { id: 'ar', name: 'Arjantin', emoji: '🇦🇷' },
    { id: 'sports', name: 'Sport', emoji: '⚽' },
];

interface ModernChatProps {
    open: boolean;
    onOpen?: () => void;
    onClose: () => void;
    siteUser: SiteUser | null;
    userRole: string | null;
    isMobile?: boolean;
    botsConfig?: any[];
    previewMessages?: any[];
}

const GLOBAL_CHANNEL_ID = 'global';

const sanitize = (msg: string) => msg.replace(/küfür1|argo1|kötükelime/gi, '***');
const EMOTES: { [key: string]: string } = { ":hehe:": "/emotes/hehe.gif", ":dilMaymun:": "/emotes/dilMaymun.gif" };

const isAuthorized = (role: string | null) => {
    if (!role) return false;
    const r = role.toUpperCase();
    return ['KRAL', 'PATRON', 'ADMIN', 'MODERATOR', 'YÖNETİCİ', 'YONETICI'].includes(r);
};

const RainDropMessage = ({ rainMsg }: { rainMsg: string }) => {
    const [claimed, setClaimed] = useState(false);

    return (
        <div className="my-3 w-full relative group mx-auto animate-in fade-in zoom-in duration-500">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00e701] to-[#00f0ff] rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
            
            <div className="relative bg-[#0a0f16] border border-[#1f2937] rounded-lg p-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#00e701]/10 to-transparent opacity-50"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-2.5">
                    <div className="text-3xl animate-bounce mt-1 drop-shadow-lg">💸</div>
                    
                    <p className="text-white font-extrabold text-[13px] leading-relaxed tracking-wide drop-shadow-md">
                        {rainMsg}
                    </p>
                    
                    <button 
                        disabled={claimed}
                        onClick={() => {
                            if (claimed) return;
                            import('canvas-confetti').then((confetti) => confetti.default({
                                particleCount: 150,
                                spread: 80,
                                origin: { y: 0.6 },
                                colors: ['#00e701', '#00f0ff', '#ffffff', '#fbbf24']
                            }));
                            setClaimed(true);
                        }}
                        className={`mt-2 px-6 py-2 text-[11px] font-black rounded-md uppercase tracking-[0.2em] transition-all duration-300 w-full max-w-[200px] ${
                            claimed 
                                ? 'bg-[#1f2937] text-gray-500 cursor-not-allowed border border-[#374151]' 
                                : 'bg-gradient-to-r from-[#00e701] to-[#00c801] text-black hover:shadow-[0_0_20px_rgba(0,231,1,0.6)] hover:scale-105 active:scale-95'
                        }`}
                    >
                        {claimed ? 'TOPLANDI' : 'HEMEN TOPLA'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const SharedBetCard = ({ payload, replies, onReply }: any) => {
    const [showDetails, setShowDetails] = useState(false);

    const seed = parseInt(String(payload.id)?.split('-').pop()?.replace(/\D/g,'') || '123', 10);
    const winAmount = ((seed % 1000) / 100 + 0.1).toFixed(7);
    const multiplier = ((seed % 500) / 100 + 1.1).toFixed(2);
    const gameTitle = payload.type === 'Casino' ? `${payload.title || 'Crash'} Vay Anasına` : payload.title || 'Spor Bahsi';

    return (
        <div className="bg-[#161B26] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] mt-1 w-full max-w-[320px] relative font-sans border border-[#00E5FF]/10">
            <div 
                className="p-4 cursor-pointer transition-colors"
                onClick={() => setShowDetails(!showDetails)}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,215,0,0.3)] relative overflow-hidden">
                        <div className="absolute top-1 left-2 text-white text-[10px] animate-pulse">✨</div>
                        <div className="absolute bottom-2 right-1 text-white text-[14px] animate-pulse delay-75">✨</div>
                        <div className="text-yellow-600 text-[20px] drop-shadow-sm mt-1 z-10">👑</div>
                        <div className="absolute inset-0 bg-white/20 mix-blend-overlay"></div>
                    </div>
                    <span className="text-white font-bold text-[15px] truncate pr-2 leading-tight tracking-wide">
                        {gameTitle}
                    </span>
                </div>
                
                <div className="bg-[#0A0C10] rounded-xl px-4 py-3.5 flex items-center justify-between mb-4 hover:bg-white/5 transition-colors shadow-inner">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#00E5FF] rounded-full flex items-center justify-center text-[#1A2C38] font-black text-[12px] shadow-sm">₺</div>
                        <span className="text-[#00E5FF] font-bold text-[16px] tracking-tight">{winAmount} TRY</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white font-bold opacity-80" />
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-slate-400 text-[13px] font-medium">Ödeme</span>
                    <span className="text-white font-bold text-[14px]">{multiplier} x</span>
                </div>
                
                <div className="flex items-center gap-4 text-slate-500 mt-1">
                    <Heart className="w-5 h-5 cursor-pointer hover:text-rose-500 hover:scale-110 transition-all" />
                    <Share2 className="w-5 h-5 cursor-pointer hover:text-white hover:scale-110 transition-all" />
                </div>
            </div>
        </div>
    );
};

export const getUserColor = (username: string) => {
    if (!username) return '#00E5FF';
    const colors = [
        '#00E5FF', '#00BFFF', '#87CEFA', '#F0F8FF', '#D3D3D3', '#00FF9D', '#05D9E8', '#33CCFF'
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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
                  className="inline-flex items-center gap-1.5 bg-[#0A0C10] hover:bg-[#111] transition-colors rounded px-2.5 py-1 text-sm font-semibold cursor-pointer select-none text-[#00E5FF] border border-emerald-500/20 w-fit"
                  style={{ borderColor: `${getUserColor(msg.username)}40`, color: getUserColor(msg.username) }}
              >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase" style={{ backgroundColor: getUserColor(msg.username) }}>
                      {msg.username?.charAt(0)}
                  </div>
                  {type}: #{betId}
              </div>
              <span className="mt-1">{remainingText}</span>
          </div>
      );
  }

  if (text.startsWith('[RAIN_EVENT]')) {
      const rainMsg = text.replace('[RAIN_EVENT]', '').trim();
      return <RainDropMessage rainMsg={rainMsg} />;
  }

    if (text === '[GIF]') {
        return null;
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

const ModernChat: React.FC<ModernChatProps> = ({ open, onClose, siteUser, userRole, isMobile, botsConfig, previewMessages }) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [mutedUsers, setMutedUsers] = useState<any[]>([]);
    const [lastMsgTime, setLastMsgTime] = useState(0);
    const [chatEnabled, setChatEnabled] = useState(true);
    const [rateLimitSec, setRateLimitSec] = useState(15);
    const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showChannelDropdown, setShowChannelDropdown] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    
    const { activeEvent } = useRainEvent();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
                setShowGifPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [selectedBet, setSelectedBet] = useState<{ id: string | number, user: string, type?: string } | null>(null);
    const [rainModalData, setRainModalData] = useState<any[] | null>(null);
    const [isScrolledUp, setIsScrolledUp] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isTreasureDropping, setIsTreasureDropping] = useState(false);
    const isScrolledUpRef = useRef(false);
    
    // Admin Panel State
    const [showAdminRainControl, setShowAdminRainControl] = useState(false);

    // Top Winners State
    const [showTopWinners, setShowTopWinners] = useState(false);
    const MOCK_TOP_WINNERS = [
        { name: 'uebraqroym4k', amount: '₺90.581.888,82', rank: 1, avatar: '🦖' },
        { name: 'Hani01', amount: '₺22.244.113,09', rank: 2, avatar: '🐊' },
        { name: 'Uylzjghqmwcc', amount: '₺17.055.619,56', rank: 3, avatar: '🦕' },
    ];

    // Admin context menu state
    const [adminMenu, setAdminMenu] = useState<{msgId: string, username: string, x: number, y: number} | null>(null);

    // Global click listener to close admin menu
    useEffect(() => {
        const handleClickOutside = () => setAdminMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);
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
        const handleShare = (e: any) => {
            if (e.detail?.message) {
                setNewMessage(e.detail.message);
                const chatWrapper = document.getElementById('modern-chat-wrapper');
                if (chatWrapper) {
                    chatWrapper.classList.add('ring-2', 'ring-[#06b6d4]', 'ring-offset-2', 'ring-offset-[#0A0D14]');
                    setTimeout(() => chatWrapper.classList.remove('ring-2', 'ring-[#06b6d4]', 'ring-offset-2', 'ring-offset-[#0A0D14]'), 2000);
                }
            }
        };
        window.addEventListener('shareBetEvent', handleShare);
        return () => window.removeEventListener('shareBetEvent', handleShare);
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const isUp = scrollHeight - scrollTop - clientHeight > 50;
        
        if (isUp !== isScrolledUpRef.current) {
            setIsScrolledUp(isUp);
        }
        isScrolledUpRef.current = isUp;

        if (!isUp) {
            setUnreadCount(0);
        }
    };

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
        setIsScrolledUp(false);
        isScrolledUpRef.current = false;
        setUnreadCount(0);
    };

    useEffect(() => {
        if (!open) {
            setIsConnected(false);
            return;
        }

        setMessages(prev => {
             // When channel changes, wipe old messages so we get a fresh slate.
             // We only preserve system/admin static bots (group_bot_, tip_) if any.
             const keepBots = prev.filter(m => m.id && (String(m.id).startsWith('group_bot_') || String(m.id).startsWith('tip_')));
             return [...keepBots].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        });

        let isMounted = true;

        const loadData = async () => {
            if (isMounted) setIsConnected(true);
            try {
                const { data } = await supabase
                    .from('tv_chat')
                    .select('*')
                    .eq('channel_id', activeChannel.id)
                    .order('created_at', { ascending: false })
                    .limit(25);
                
                if (data) {
                    data.reverse();
                }

                if (isMounted) {
                    setMessages(prev => {
                        const localBots = prev.filter(m => m.id && (m.id.startsWith('group_bot_') || m.id.startsWith('tip_') || m.id.startsWith('fake_bot_')));
                        const merged = [...(data || []), ...localBots];
                        

                        return merged.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                    });
                    setIsConnected(true);
                    setTimeout(() => {
                        if (chatContainerRef.current && !isScrolledUpRef.current) {
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
                if (m.channel_id === activeChannel.id && isMounted) {
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
    }, [open, activeChannel.id]);





    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim()) return;

        const myUserId = siteUser?.id || userRole || 'guest';
        const myUsername = siteUser?.username || (userRole === 'admin' ? 'Yönetici' : 'Misafir');
        const role = userRole || 'user';

        if (!siteUser && userRole !== 'admin') {
            window.dispatchEvent(new CustomEvent('openLoginModal'));
            return;
        }

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
            channel_id: activeChannel.id,
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

    const handleSendReply = async (betId: string, replyText: string) => {
        if (!siteUser) return;
        
        const myUserId = siteUser.id || `anon_${Math.random().toString(36).substr(2, 9)}`;
        const myUsername = siteUser.username || siteUser.email?.split('@')[0] || 'Misafir';
        const role = userRole || (siteUser.role?.toLowerCase() === 'admin' ? 'admin' : 'user');

        const finalMessage = sanitize(`[BET_REPLY:${betId}] ${replyText.trim()}`);

        const msgObj = {
            channel_id: activeChannel.id,
            user_id: myUserId,
            username: myUsername,
            message: finalMessage,
            role: role
        };

        try {
            const { data, error } = await supabase.from('tv_chat').insert(msgObj).select();
            if (!error && data && data[0]) {
                setMessages(prev => {
                    if (prev.some(msg => msg.id === data[0].id)) return prev;
                    return [...prev, data[0]];
                });
            }
        } catch (err) {
            console.error("Global chat reply error:", err);
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

    const allMessages = [...messages, ...(previewMessages || [])].sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
        return timeA - timeB;
    });
    const displayMessages = allMessages.filter(m => !isSystemOrCountdown(m) && m.role !== 'system_win').slice(-60); // 🚀 Performans: Sadece son 60 mesaj render edilecek
    const mainMessages = displayMessages.filter(m => !(m.message || '').startsWith('[BET_REPLY:'));

    return (
        <div id="modern-chat-wrapper" className="flex flex-col h-full bg-[#0B0E14]/90 backdrop-blur-xl relative transition-shadow duration-300 border-l border-white/5">
            <CanvasRainEngine active={!!activeEvent} />
            <style>{`
                @keyframes chatPopIn {
                    0% { opacity: 0; transform: translateY(15px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .chat-msg-animate {
                    animation: chatPopIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>
            
            {/* Chat Header */}
            <div className="bg-[#0A0C10] pl-3 pr-2 h-[72px] text-white flex items-center justify-between flex-shrink-0 shadow-[0_4px_30px_rgba(0,0,0,0.8)] z-[100] border-b border-white/5 relative">
                
                {/* Channel Dropdown */}
                <div className="relative w-full pr-4 z-50">
                    <button 
                        onClick={() => setShowChannelDropdown(!showChannelDropdown)}
                        className="flex items-center justify-between w-full bg-[#121620] hover:bg-[#1a1f29] border border-white/5 rounded-lg px-3 py-2 transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[16px] leading-none">{activeChannel.emoji}</span>
                            <span className="text-[13px] font-bold text-zinc-200">{activeChannel.name} Odası</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showChannelDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showChannelDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-[#0A0C10] border border-[#00E5FF]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden py-1">
                            {CHANNELS.map(ch => (
                                <button
                                    key={ch.id}
                                    onClick={() => { setActiveChannel(ch); setShowChannelDropdown(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
                                        activeChannel.id === ch.id 
                                            ? 'bg-[#00E5FF]/10 text-[#00E5FF]' 
                                            : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                                    }`}
                                >
                                    <span className="text-[16px] leading-none">{ch.emoji}</span>
                                    <span className="text-[13px] font-bold">{ch.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Right Icons */}
                <div className="flex items-center gap-1.5 pl-2 pr-1 relative shrink-0 bg-gradient-to-l from-[#06080C] via-[#06080C] to-transparent z-10 h-full">
                    {/* Global Rain Info Icon */}
                    <div className="relative group">
                         <div className="btn-icon-modern !w-8 !h-8 !rounded-lg cursor-help">
                             <div className="w-4 h-4 rounded-full border border-zinc-400 text-zinc-400 flex items-center justify-center text-[10px] font-bold transition-all duration-300 group-hover:border-white group-hover:text-white">i</div>
                         </div>
                         <div className="absolute top-full right-0 mt-2 w-[220px] bg-[#0A0C10] border border-[#00E5FF]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-xl p-3 text-slate-200 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            Her 1 saat içinde iki kez, günde toplam 48 kez <span className="text-[#00E5FF] font-bold">50$</span> (1 kişiye 25$, kalanı 5 kişiye 5'er$) sohbet katılımcılarına rastgele dağıtılır.
                         </div>
                     </div>

                    {/* Admin Rain Control Button */}
                    {isAuthorized(userRole) && (
                        <button 
                            onClick={() => setShowAdminRainControl(true)}
                            className="btn-icon-modern !w-8 !h-8 !rounded-lg"
                            title="Admin Yağmur Kontrolü"
                        >
                            <span className="text-xl">🌧️</span>
                        </button>
                    )}

                    {/* Top Winners Trophy */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowTopWinners(!showTopWinners)}
                            className={`btn-icon-modern !w-8 !h-8 !rounded-lg ${showTopWinners ? 'active' : ''}`}
                            title="En Çok Kazananlar"
                        >
                            <Trophy className="w-4 h-4 text-zinc-300 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" strokeWidth={2.5} />
                        </button>

                        {/* Top Winners Dropdown */}
                        {showTopWinners && (
                            <div className="absolute top-full right-0 mt-2 w-[280px] bg-[#222429] border border-white/[0.05] shadow-[0_15px_40px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden z-[99]">
                                {/* Header */}
                                <div className="bg-[#1a1d24] py-3 flex items-center justify-center gap-2 border-b border-white/5 shadow-sm">
                                    <Star className="w-3.5 h-3.5 text-zinc-500" fill="currentColor" />
                                    <span className="text-white text-[12px] font-bold tracking-wider">BUGÜN EN BÜYÜK KAZANAN</span>
                                    <Star className="w-3.5 h-3.5 text-zinc-500" fill="currentColor" />
                                </div>
                                {/* List */}
                                <div className="p-3 flex flex-col gap-2.5">
                                    {MOCK_TOP_WINNERS.map((winner, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {/* Rank Medal */}
                                                <div className="relative w-4 h-4 flex items-center justify-center">
                                                    {winner.rank === 1 && <span className="text-zinc-300 text-lg drop-shadow-sm leading-none">🏅</span>}
                                                    {winner.rank === 2 && <span className="text-slate-300 text-lg drop-shadow-sm leading-none">🥈</span>}
                                                    {winner.rank === 3 && <span className="text-amber-700 text-lg drop-shadow-sm leading-none">🥉</span>}
                                                </div>
                                                {/* Avatar */}
                                                <div className="w-7 h-7 rounded-full bg-[#111] flex items-center justify-center text-sm shadow-sm border border-white/5 overflow-hidden">
                                                    {winner.avatar}
                                                </div>
                                                {/* Name */}
                                                <span className="text-white font-semibold text-[13px]">{winner.name}</span>
                                            </div>
                                            {/* Amount */}
                                            <div className="bg-[#1C1F24] px-2.5 py-1.5 rounded text-[#00E5FF] font-bold text-[12px] tracking-wide shadow-inner border border-white/[0.02]">
                                                {winner.amount}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }} 
                        className="btn-icon-modern !w-7 !h-7 !rounded-lg ml-1 shrink-0 relative z-[99] cursor-pointer pointer-events-auto"
                        title="Kapat"
                    >
                        <X className="w-4 h-4 pointer-events-none" />
                    </button>
                </div>
            </div>

            {/* Admin Rain Modal */}
            {showAdminRainControl && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'var(--bg-overlay)', backdropFilter: 'blur(5px)',
                    zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
                }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <button 
                            onClick={() => setShowAdminRainControl(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}
                        >
                            <X size={20} />
                        </button>
                        <AdminRainControl adminId={siteUser?.id || 'admin'} />
                    </div>
                </div>
            )}

            <RainEventBanner currentUserId={siteUser?.id || userRole || 'guest'} />

            {/* Sticky Announcement / Countdown Bar */}
            {activeAnnouncement && (
                <div className="bg-[#0b0e14] border-b border-[#00E5FF]/20 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(0,229,255,0.05)] relative z-20 shrink-0 animate-fade-in overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/[0.03] to-transparent pointer-events-none"></div>
                    
                    <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-[#00E5FF] opacity-20"></span>
                            <Crown className="text-[#00E5FF] w-4 h-4 relative z-10 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-[#00E5FF] uppercase tracking-[0.2em] leading-none drop-shadow-md">SİSTEM DUYURUSU</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                            </div>
                            <p className="text-[13px] text-white font-semibold truncate leading-snug tracking-wide">
                                {activeAnnouncement.text.replace(/👑/g, '').trim()}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveAnnouncement(null)} 
                        className="text-white/40 hover:text-white p-1.5 hover:bg-white/5 rounded-lg shrink-0 transition-colors relative z-10"
                        title="Duyuruyu Kapat"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Messages Area */}
            <div 
                ref={chatContainerRef} 
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar bg-[#0A0C10] transition-all relative"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}
            >
                {!isConnected ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-ping" />
                            Bağlanıyor...
                        </p>
                    </div>
                ) : mainMessages.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-gray-500">Henüz mesaj yok.</p>
                    </div>
                ) : (
                    mainMessages.map((msg, i) => {
                        const isAdmin = msg.role?.toUpperCase() === 'ADMIN' || (msg.username || '').toLowerCase() === 'yönetici' || (msg.username || '').toLowerCase() === 'admin';
                        const isMod = msg.role?.toUpperCase() === 'MODERATOR' || msg.role?.toUpperCase() === 'MOD';
                        const isSystem = msg.role?.toUpperCase() === 'SYSTEM';
                        const isVip = msg.role?.toUpperCase() === 'VIP';
                        const isBetShare = (msg.message || '').startsWith('[BET_SHARE:');
                        const isMentioned = siteUser && (msg.message || '').includes(`@${siteUser.username}`);
                        const isRealUser = msg.user_id && !msg.user_id.startsWith('bot_') && !isAdmin && !isMod && !isSystem;
                        
                        const userName = msg.username || 'Misafir';
                        const userColor = isAdmin ? '#ef4444' : isMod ? '#00E5FF' : getUserColor(userName);

                        // Roman numeral VIP calculation (I, II, III, IV, V)
                        const romanLevels = ['I', 'II', 'III', 'IV', 'V'];
                        let romanVip = 'I';
                        if (msg.vipLevel && romanLevels.includes(String(msg.vipLevel).toUpperCase())) {
                            romanVip = String(msg.vipLevel).toUpperCase();
                        } else {
                            let hash = 0;
                            for (let chIdx = 0; chIdx < userName.length; chIdx++) hash = userName.charCodeAt(chIdx) + ((hash << 5) - hash);
                            romanVip = romanLevels[Math.abs(hash) % 5];
                        }

                        if (isBetShare) {
                            let payload = null;
                            try {
                                const jsonStr = msg.message.replace('[BET_SHARE:', '').replace(/\]$/, '');
                                payload = JSON.parse(jsonStr);
                            } catch(e) {}
                            
                            if (payload) {
                                const replies = messages.filter(m => (m.message || '').startsWith(`[BET_REPLY:${payload.id}]`));
                                return (
                                    <div key={msg.id || i} className="mb-2 chat-msg-animate">
                                        <div className="flex items-center gap-1.5 px-1 mb-0.5">
                                            {isAdmin ? (
                                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-600/30 to-rose-900/40 text-red-400 px-2 py-0.5 rounded text-[9px] font-black tracking-widest border border-red-500/50 uppercase shadow-sm flex-shrink-0 leading-none">
                                                    <Crown className="w-2.5 h-2.5 text-red-400" /> KRAL
                                                </span>
                                            ) : isMod ? (
                                                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#00E5FF]/20 to-transparent text-[#00E5FF] px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest border border-[#00E5FF]/30 uppercase flex-shrink-0 leading-none">
                                                    <Shield className="w-2.5 h-2.5" /> MOD
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center justify-center bg-[#181C24] text-amber-400/90 border border-amber-500/20 px-1 py-0.5 rounded text-[9px] font-black leading-none shrink-0">
                                                    {romanVip}
                                                </span>
                                            )}
                                            <span 
                                                className="font-black tracking-tight text-[12.5px]" 
                                                style={{ color: userColor }}
                                            >
                                                {userName}
                                            </span>
                                            <span className="text-slate-400 text-[10.5px] ml-1">bir kupon paylaştı</span>
                                        </div>
                                        <div className="ml-0.5">
                                            <SharedBetCard 
                                                payload={payload} 
                                                replies={replies} 
                                                onReply={handleSendReply} 
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        } else if (msg.role === 'rain_result') {
                            let payload: any = null;
                            try {
                                payload = JSON.parse(msg.message);
                            } catch(e) {}
                            
                            if (payload) {
                                return (
                                    <SystemRainResultMessage 
                                        key={msg.id || i} 
                                        payload={payload} 
                                        currentUserId={siteUser?.id || userRole || 'guest'} 
                                    />
                                );
                            }
                        } else if (msg.role === 'SYSTEM_WIN_RAIN') {
                            let payload: any = null;
                            try {
                                payload = JSON.parse(msg.message);
                            } catch(e) {}
                            
                            if (payload) {
                                return (
                                    <div key={msg.id || i} className="mb-2 mt-0.5 flex gap-2 px-1 chat-msg-animate">
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="font-bold text-[#b0bec5] text-[12px]">724bot</span>
                                                <span className="text-[9.5px] font-bold text-slate-500">
                                                    {new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                            <div className="bg-[#161B26] rounded-xl overflow-hidden shadow-lg border border-[#00E5FF]/10 relative group/card">
                                                <div className="p-2.5 flex flex-col gap-2 relative z-10">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 shrink-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-sm">
                                                            <span className="text-white text-xs font-black">🏆</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-black text-[12px] tracking-wide">Tebrikler!</span>
                                                            <span className="text-[#00E5FF] font-bold text-[11.5px]">@{payload.winner}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        }

                        return (
                        <div 
                            key={msg.id || i} 
                            onClick={(e) => {
                                if (isMod && siteUser && isAuthorized(siteUser.role) && userName !== siteUser.username) {
                                    e.stopPropagation();
                                    setAdminMenu({
                                        msgId: msg.id || String(i),
                                        username: userName,
                                        x: e.clientX,
                                        y: e.clientY
                                    });
                                }
                            }}
                            className={`group px-2 py-1 bg-transparent rounded-lg text-left transition-colors duration-200 hover:bg-white/[0.02] mb-0.5 relative flex flex-col chat-msg-animate ${isMentioned ? 'bg-[#00E5FF]/5' : ''} ${isRealUser ? 'bg-white/[0.01]' : ''} ${(isMod && siteUser && isAuthorized(siteUser.role) && userName !== siteUser.username) ? 'cursor-pointer' : ''} ${msg.isDraft ? 'opacity-80 scale-[0.98]' : ''}`}
                        >
                            {/* Message Content Column (Profil resimleri kaldırıldı, tam genişlik) */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                    {isAdmin ? (
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#00E5FF]/20 to-transparent text-[#00E5FF] px-2 py-0.5 rounded text-[9px] font-black tracking-widest border border-[#00E5FF]/50 uppercase shadow-sm">
                                            <Crown className="w-2.5 h-2.5 text-[#00E5FF]" /> KRAL
                                        </span>
                                    ) : isMod ? (
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#00E5FF]/20 to-transparent text-[#00E5FF] px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest border border-[#00E5FF]/30 uppercase">
                                            <Shield className="w-2.5 h-2.5" /> MOD
                                        </span>
                                    ) : isVip ? (
                                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-transparent text-zinc-300 px-1.5 py-0.5 rounded text-[8.5px] font-black tracking-widest border border-amber-500/30 uppercase">
                                            <Star className="w-2 h-2 fill-amber-400" /> VIP
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center justify-center bg-[#181C24] text-amber-400/90 border border-amber-500/20 px-1.5 py-0.5 rounded text-[9px] font-black leading-none shrink-0 shadow-sm">
                                            {romanVip}
                                        </span>
                                    )}

                                    <span 
                                        className={`font-black tracking-tight text-[12.5px] hover:underline decoration-white/20 underline-offset-2 truncate max-w-full ${isAdmin ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`}
                                        style={{ color: isAdmin ? '#ffffff' : isVip ? '#FFD700' : userColor }}
                                    >
                                        {userName}
                                    </span>
                                    <span className="text-[9.5px] font-bold text-slate-500 ml-1">
                                        {new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <div className={`break-words antialiased text-[12.5px] leading-snug ${isVip ? 'text-zinc-300/90 font-medium' : isSystem ? 'text-zinc-300 font-bold' : 'text-[#e2e8f0]'}`}>
                                    {renderMessageText(msg, (betId, user, type) => setSelectedBet({ id: betId, user, type }))}
                                </div>
                                
                                {/* Hover Reply & Action Bar */}
                                {!isSystem && (
                                    <div className="flex justify-end items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {['👍', '🔥', '🚀'].map(emoji => (
                                            <button 
                                                key={emoji}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    triggerGlobalToast(`${emoji} Reaksiyon gönderildi`, 'success');
                                                }}
                                                className="text-zinc-400 hover:text-white text-[13px] transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-lg border border-transparent hover:border-white/20 hover:scale-110 active:scale-95"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNewMessage(`@${userName} `);
                                            }}
                                            className="text-zinc-400 hover:text-[#00E5FF] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors bg-white/5 hover:bg-[#00E5FF]/10 px-2.5 py-1 rounded-lg border border-transparent hover:border-[#00E5FF]/30 ml-1"
                                            title="Yanıtla"
                                        >
                                            <MessageCircle className="w-3 h-3" /> Yanıtla
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )})
                )}
            </div>

    {/* Admin Context Menu */}
    {adminMenu && (
        <div 
            className="fixed z-[9999] bg-[#0A0C10]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden w-44 animate-in fade-in zoom-in-95 duration-200"
            style={{ top: Math.min(adminMenu.y, window.innerHeight - 200), left: Math.min(adminMenu.x, window.innerWidth - 180) }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">İşlem:</span>
                <div className="text-[12px] font-bold text-white truncate">@{adminMenu.username}</div>
            </div>
            <div className="flex flex-col py-1">
                <button 
                    onClick={async () => {
                        const { error } = await supabase.from('tv_chat').delete().eq('id', adminMenu.msgId);
                        if (!error) {
                            triggerGlobalToast(`Mesaj silindi: ${adminMenu.username}`, 'success');
                            setMessages(prev => prev.filter(m => m.id !== adminMenu.msgId));
                        } else {
                            triggerGlobalToast('Mesaj silinemedi!', 'error');
                        }
                        setAdminMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Mesajı Sil
                </button>
                <button 
                    onClick={() => {
                        triggerGlobalToast(`${adminMenu.username} 10 dakika susturuldu.`, 'success');
                        setAdminMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <VolumeX className="w-3.5 h-3.5 text-zinc-300" /> Sustur (10dk)
                </button>
                <button 
                    onClick={() => {
                        triggerGlobalToast(`${adminMenu.username} sessizce gölgelendi (Shadowban).`, 'info');
                        setAdminMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                    <VolumeX className="w-3.5 h-3.5 text-indigo-400" /> Gölge Sustur (Shadowban)
                </button>
                <button 
                    onClick={() => {
                        triggerGlobalToast(`${adminMenu.username} kalıcı olarak yasaklandı!`, 'error');
                        setAdminMenu(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors border-t border-white/5"
                >
                    <Ban className="w-3.5 h-3.5" /> Kullanıcıyı Yasakla
                </button>
            </div>
        </div>
    )}

    {/* Bottom Input Area */}
    <div className="p-3 bg-transparent border-t border-white/5 relative shrink-0">
        
        {/* Floating New Messages Button */}
        {isScrolledUp && unreadCount > 0 && (
            <div className="absolute -top-12 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <button 
                    onClick={scrollToBottom}
                    className="pointer-events-auto bg-[#00E5FF] hover:bg-[#00c853] text-[#0A0D14] px-4 py-1.5 rounded-full text-[13px] font-black tracking-tight shadow-[0_4px_15px_rgba(0,230,118,0.4)] flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 animate-bounce"
                >
                    {unreadCount} yeni mesajlar <ChevronDown className="w-4 h-4" />
                </button>
            </div>
        )}

        {userRole === 'GUEST' ? (
            <input 
                type="text"
                disabled
                placeholder={t('chat.login_required', 'Mesaj göndermek için lütfen giriş yapın')}
                className="w-full bg-[#0A0C10] border border-white/10 text-[12px] font-semibold text-center text-slate-500 rounded-full px-5 py-3.5 cursor-not-allowed shadow-inner"
            />
        ) : (
            <div className="flex flex-col gap-2">
                        {/* Tip & Rain Toolbar Removed - Will be moved to admin panel later */}
                        
                        <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#181B21] border border-transparent focus-within:bg-[#20242D] focus-within:border-white/5 rounded-full transition-all duration-300 h-[46px] overflow-hidden">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={t('chat.placeholder', 'Bir mesaj gönder...')}
                                className="flex-1 bg-transparent text-[13px] font-medium text-white focus:outline-none placeholder-zinc-500 pl-5 pr-3"
                            />
                            <div className="flex items-center pr-1.5 gap-1 h-full shrink-0 relative" ref={emojiPickerRef}>
                                <button type="button" onClick={() => { setShowEmojiPicker(!showEmojiPicker); }} className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
                                    <Smile className="w-4 h-4" />
                                </button>
                                
                                {showEmojiPicker && (
                                    <div className="absolute bottom-[50px] right-0 bg-[#161a24] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2 z-[100] w-[260px]">
                                        <div className="grid grid-cols-7 gap-1 h-[200px] overflow-y-auto scrollbar-hide">
                                            {POPULAR_EMOJIS.map(emoji => (
                                                <button
                                                    key={emoji}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewMessage(prev => prev + emoji);
                                                        setShowEmojiPicker(false);
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg cursor-pointer text-lg transition-colors"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="text-[#0A0D14] bg-[#00E5FF] disabled:bg-white/5 disabled:text-white/20 hover:brightness-110 transition-all p-2 rounded-full"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            
            <BetShareModal 
                isOpen={!!selectedBet} 
                onClose={() => setSelectedBet(null)}
                betId={selectedBet?.id || ''}
                username={selectedBet?.user || ''}
                type={selectedBet?.type || 'Casino'}
            />
            
            {/* Rain Details Modal */}
            {rainModalData && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="bg-[#1C1E22] w-full max-w-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                            <span className="text-white font-bold text-[15px]">Tüm</span>
                            <button 
                                onClick={() => setRainModalData(null)}
                                className="btn-icon-modern !w-8 !h-8 !rounded-lg shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar flex flex-col gap-3">
                            {rainModalData.map((r: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-[#2A2C31] px-3 py-2.5 rounded-lg border border-white/[0.02]">
                                    <span className="text-[#00E5FF] font-bold text-[14px]">@{r.user}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-white font-bold text-[14px]">{r.amount}</span>
                                        <div className="w-4 h-4 bg-[#00E5FF] rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                            <span className="text-black text-[9px] font-black">₺</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModernChat;
