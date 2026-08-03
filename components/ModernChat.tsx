import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Shield, Smile, Cpu, Target, ChevronDown, MessageCircle, MoreVertical, Heart, CornerUpLeft, Trash2, VolumeX, Ban, User, Check, Star, Trophy, Settings, UserX, Flag, ExternalLink, Sparkles, Plus, Medal, ArrowRight, Activity, Ticket, Image as ImageIcon, ChevronRight, Share2 } from 'lucide-react';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import { triggerGlobalToast } from './GlobalToaster';
import { useTranslation } from 'react-i18next';
import { SiteUser } from '../types';
import { BetShareModal } from './BetShareModal';
import confetti from 'canvas-confetti';
import GifPicker from './GifPicker';

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
    { id: 'sports', name: 'Sports', emoji: '⚽' },
    { id: 'en', name: 'English', emoji: '🇬🇧' },
    { id: 'zh-Hant', name: '繁體中文', emoji: '🇹🇼' },
    { id: 'zh-Hans', name: '简体中文', emoji: '🇨🇳' },
    { id: 'pt', name: 'Português', emoji: '🇧🇷' },
    { id: 'id', name: 'Indonesian', emoji: '🇮🇩' },
    { id: 'tr', name: 'Türkçe', emoji: '🇹🇷' },
];

interface ModernChatProps {
    open: boolean;
    onOpen?: () => void;
    onClose: () => void;
    siteUser: SiteUser | null;
    userRole: string | null;
    isMobile?: boolean;
    botsConfig?: any[];
}

const GLOBAL_CHANNEL_ID = 'global';

const sanitize = (msg: string) => msg.replace(/küfür1|argo1|kötükelime/gi, '***');
const EMOTES: { [key: string]: string } = { ":hehe:": "/emotes/hehe.gif", ":dilMaymun:": "/emotes/dilMaymun.gif" };

const isAuthorized = (role: string | null) => {
    if (!role) return false;
    const r = role.toUpperCase();
    return ['KRAL', 'PATRON', 'ADMIN', 'MODERATOR'].includes(r);
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

    const seed = parseInt(payload.id?.split('-').pop()?.replace(/\D/g,'') || '123', 10);
    const winAmount = ((seed % 1000) / 100 + 0.1).toFixed(7);
    const multiplier = ((seed % 500) / 100 + 1.1).toFixed(2);
    const gameTitle = payload.type === 'Casino' ? `${payload.title || 'Crash'} Vay Anasına` : payload.title || 'Spor Bahsi';

    return (
        <div className="bg-[#222429] rounded-2xl overflow-hidden shadow-lg mt-1 w-full max-w-[320px] relative font-sans border border-white/[0.02]">
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
                
                <div className="bg-[#2D3035] rounded-xl px-4 py-3.5 flex items-center justify-between mb-4 hover:bg-[#32363b] transition-colors shadow-inner">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#00E676] rounded-full flex items-center justify-center text-[#1A2C38] font-black text-[12px] shadow-sm">₺</div>
                        <span className="text-[#00E676] font-bold text-[16px] tracking-tight">{winAmount} TRY</span>
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
    if (!username) return '#05D9E8';
    const colors = [
        '#FF2A6D', '#05D9E8', '#FFC000', '#B026FF', '#FF9D00', '#00FF9D', '#FF3366', '#33CCFF'
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
                  className="inline-flex items-center gap-1.5 bg-[#050505] hover:bg-[#111] transition-colors rounded px-2.5 py-1 text-sm font-semibold cursor-pointer select-none text-emerald-400 border border-emerald-500/20 w-fit"
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

  const isGif = text.includes('.giphy.com/') || text.includes('.tenor.com/');
  if (isGif) {
      return (
          <div className="mt-1 overflow-hidden rounded-xl border border-white/5 bg-black/40 inline-block w-full max-w-[200px]">
              <img src={text} alt="gif" className="w-full h-auto object-cover" />
          </div>
      );
  }

  if (text === '[GIF]') {
      return (
          <div className="mt-1.5 w-[140px] h-[90px] bg-white/5 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0">
              <span className="text-[14px] font-black text-white/30 tracking-widest uppercase">GIF</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
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
    const [showGifPicker, setShowGifPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

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

    const displayMessages = messages.filter(m => !isSystemOrCountdown(m) && m.role !== 'system_win');
    const mainMessages = displayMessages.filter(m => !(m.message || '').startsWith('[BET_REPLY:'));

    return (
        <div id="modern-chat-wrapper" className="flex flex-col h-full bg-[#0a0d14] relative transition-shadow duration-300">
            
            {/* Chat Header */}
            <div className="bg-[#0A0D14] px-4 h-[64px] text-white flex items-center justify-between flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-[100] border-b border-white/5 relative">
                <div className="flex items-center gap-3 relative">
                     <button className="flex items-center gap-2 bg-[#0a0d14] border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-xl transition-all text-sm font-semibold text-zinc-300 hover:text-white" onClick={() => setShowLangMenu(!showLangMenu)}>
                         <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-[12px] opacity-90">{activeChannel.emoji || '🇹🇷'}</span>
                         {activeChannel.name || 'Türkçe'}
                         <ChevronDown className="w-3.5 h-3.5 ml-1 text-zinc-500" />
                     </button>
                     {/* Info Icon Moved to Right Side */}
                     {showLangMenu && (
                        <div className="absolute top-full left-0 mt-2 bg-[#1a1f29] border border-white/10 rounded-xl shadow-2xl py-2 z-50 min-w-[160px]">
                            {CHANNELS.map(ch => (
                                <div 
                                    key={ch.id} 
                                    onClick={() => { setActiveChannel(ch); setShowLangMenu(false); }}
                                    className={`px-3 py-2.5 hover:bg-white/5 cursor-pointer text-sm font-semibold transition-colors flex items-center justify-between gap-2 ${activeChannel.id === ch.id ? 'text-[#00e5ff] bg-white/[0.02]' : 'text-slate-300'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[14px] opacity-90">{ch.emoji}</span>
                                        {ch.name}
                                    </div>
                                    {activeChannel.id === ch.id && <div className="w-2 h-2 rounded-full bg-[#00e5ff]"></div>}
                                </div>
                            ))}
                        </div>
                     )}
                </div>
                
                <div className="flex items-center gap-1.5 pr-1 relative">
                    {/* Global Rain Info Icon */}
                    <div className="relative group">
                         <div className="w-8 h-8 rounded-[10px] bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center cursor-help">
                             <div className="w-4 h-4 rounded-full border border-zinc-400 text-zinc-400 flex items-center justify-center text-[10px] font-bold transition-all duration-300 group-hover:border-white group-hover:text-white">i</div>
                         </div>
                         <div className="absolute top-full right-0 mt-2 w-[220px] bg-[#0A0D14] border border-[#00E5FF]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-xl p-3 text-slate-200 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                             Her 1 saat içinde iki kez, günde toplam 48 kez <span className="text-[#00E676] font-bold">50$</span> (1 kişiye 25$, kalanı 5 kişiye 5'er$) sohbet katılımcılarına rastgele dağıtılır.
                         </div>
                     </div>

                    {/* Top Winners Trophy */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowTopWinners(!showTopWinners)}
                            className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors ${showTopWinners ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
                            title="En Çok Kazananlar"
                        >
                            <Trophy className="w-4 h-4 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]" strokeWidth={2.5} />
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
                                                    {winner.rank === 1 && <span className="text-amber-400 text-lg drop-shadow-sm leading-none">🏅</span>}
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
                                            <div className="bg-[#1C1F24] px-2.5 py-1.5 rounded text-[#00E676] font-bold text-[12px] tracking-wide shadow-inner border border-white/[0.02]">
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
                        onClick={onClose} 
                        className="w-8 h-8 rounded-[10px] flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white ml-0.5"
                        title="Kapat"
                    >
                        <X className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                </div>
            </div>

            {/* Sticky Announcement / Countdown Bar */}
            {activeAnnouncement && (
                <div className="bg-[#0f0f0f] border-b border-white/5 px-3.5 py-2.5 flex items-center justify-between gap-2.5 shadow-lg relative z-20 shrink-0 animate-fade-in">
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
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-[#0A0D14] transition-all relative"
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
                        const isMod = msg.role?.toUpperCase() === 'ADMIN' || msg.role?.toUpperCase() === 'MODERATOR' || (msg.username || '').toLowerCase() === 'yönetici' || (msg.username || '').toLowerCase() === 'admin';
                        const isSystem = msg.role?.toUpperCase() === 'SYSTEM';
                        const isVip = msg.role?.toUpperCase() === 'VIP';
                        const isBetShare = (msg.message || '').startsWith('[BET_SHARE:');
                        const isBigWin = (msg.message || '').startsWith('[BIG_WIN:');
                        const isMentioned = siteUser && (msg.message || '').includes(`@${siteUser.username}`);
                        
                        const userName = msg.username || 'Misafir';
                        const userColor = isMod ? '#10b981' : getUserColor(userName);
                        const initial = userName.charAt(0).toUpperCase();

                        if (isBetShare) {
                            let payload = null;
                            try {
                                const jsonStr = msg.message.replace('[BET_SHARE:', '').replace(/\]$/, '');
                                payload = JSON.parse(jsonStr);
                            } catch(e) {}
                            
                            if (payload) {
                                const replies = messages.filter(m => (m.message || '').startsWith(`[BET_REPLY:${payload.id}]`));
                                return (
                                    <div key={msg.id || i} className="mb-4">
                                        <div className="flex items-center gap-1.5 px-2 mb-1">
                                            {isMod ? (
                                                <span className="inline-flex items-center gap-1 bg-[#10b981]/10 text-[#10b981] px-1.5 py-0.5 rounded flex-shrink-0 text-[10px] font-black tracking-widest leading-none border border-[#10b981]/20 uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">
                                                    <Shield className="w-3 h-3" /> MOD
                                                </span>
                                            ) : isVip ? (
                                                <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded flex-shrink-0 text-[10px] font-black tracking-widest leading-none border border-yellow-500/20 uppercase drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">
                                                    <Star className="w-3 h-3 fill-yellow-500" /> VIP
                                                </span>
                                            ) : (
                                                <div 
                                                    className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 shadow-lg"
                                                    style={{ backgroundColor: `${userColor}20`, color: userColor, border: `1px solid ${userColor}50` }}
                                                >
                                                    {initial}
                                                </div>
                                            )}
                                            <span 
                                                className="font-black tracking-tight text-[13.5px]" 
                                                style={{ color: userColor, textShadow: `0 0 5px ${userColor}66` }}
                                            >
                                                {userName}
                                            </span>
                                            <span className="text-slate-400 text-[11px] ml-1">bir kupon paylaştı</span>
                                        </div>
                                        <div className="ml-1">
                                            <SharedBetCard 
                                                payload={payload} 
                                                replies={replies} 
                                                onReply={handleSendReply} 
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        } else if (msg.role === 'SYSTEM_WIN_RAIN') {
                            let payload: any = null;
                            try {
                                payload = JSON.parse(msg.message);
                            } catch(e) {}
                            
                            if (payload) {
                                return (
                                    <div key={msg.id || i} className="mb-3 mt-1 flex gap-3 px-1">
                                        {/* Avatar */}
                                        <div className="shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-[#1C1E22] overflow-hidden flex items-center justify-center border border-white/5 shadow-md">
                                                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=bcgame&backgroundColor=ff3366" alt="bc.game" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col min-w-0">
                                            {/* Header */}
                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                <span className="font-bold text-[#b0bec5] text-[13px]">724bot</span>
                                                <span className="text-[10px] font-bold text-slate-500">
                                                    {new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                            </div>
                                            
                                            {/* Card Body */}
                                            <div className="bg-[#1C1F24] rounded-xl overflow-hidden shadow-lg border border-white/5 relative group/card">
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                                                {/* Top Inner padding */}
                                                <div className="p-3 flex flex-col gap-2.5 relative z-10">
                                                    
                                                    {/* Title Row */}
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 shrink-0 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)] relative overflow-hidden">
                                                            {/* Fake coins in circle */}
                                                            <div className="absolute w-1.5 h-3 bg-yellow-400 rounded-full rotate-45 -ml-2 mb-1"></div>
                                                            <div className="absolute w-2 h-4 bg-yellow-400 rounded-full -rotate-12"></div>
                                                            <div className="absolute w-1.5 h-3 bg-yellow-400 rounded-full rotate-45 ml-2 mt-1"></div>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-white font-black text-[13px] tracking-wide">Tebrikler!</span>
                                                            <span className="text-[#00E676] font-bold text-[12px]">@{payload.winner}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Won In Box */}
                                                    <div className="bg-black/20 rounded-lg py-2 flex flex-col items-center justify-center border border-white/5 shadow-inner">
                                                        <div className="text-white text-[13px] font-bold flex items-center gap-1">
                                                            Won <span className="text-[#00E676]">${payload.amount}</span>
                                                        </div>
                                                        <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
                                                            in <span className="text-[#00E676]">{payload.game}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Rain Section */}
                                                    <div className="flex flex-col gap-1.5 mt-1">
                                                        <div className="text-[#00E5FF] text-[11px] font-bold flex items-center justify-center gap-1 relative group pb-1.5 border-b border-[#00E5FF]/10 w-full whitespace-nowrap">
                                                            <div className="flex items-center gap-1">
                                                                <span>💧</span>
                                                                <span className="uppercase tracking-wider">İşte şanslı yağmur geliyor</span>
                                                                <span>💧</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1 pt-0.5">
                                                            {payload.rain && payload.rain.slice(0, 3).map((r: any, idx: number) => (
                                                                <div key={idx} className="flex justify-between items-center px-1.5 py-1 rounded hover:bg-white/5 transition-colors">
                                                                    <span className="text-[#00E676] font-bold text-[12px] truncate">@{r.user}</span>
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-white font-black text-[12px]">{r.amount}</span>
                                                                        <div className="w-3.5 h-3.5 bg-gradient-to-br from-[#00E676] to-emerald-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                                                                            <span className="text-black text-[8px] font-black leading-none">$</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        {payload.rain && payload.rain.length > 3 && (
                                                            <button 
                                                                onClick={() => setRainModalData(payload.rain)}
                                                                className="relative overflow-hidden w-full bg-gradient-to-r from-[#2A2E35] to-[#22252b] hover:from-[#32373F] hover:to-[#2A2E35] border border-white/5 hover:border-white/10 transition-all text-slate-300 py-2 rounded-lg text-[11px] font-bold mt-1 flex items-center justify-center gap-1.5 group/btn shadow-sm"
                                                            >
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                                                <span className="relative z-10">Daha fazlasını görüntüle</span>
                                                                <ChevronDown className="relative z-10 w-3.5 h-3.5 -rotate-90 text-[#00E5FF] group-hover/btn:text-white transition-colors group-hover/btn:translate-x-0.5 drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                </div>
                                                
                                                {/* Bottom Footer (Bet ID) */}
                                                <div className="bg-[#131518] px-3 py-2 mt-0.5 flex justify-between items-center text-slate-500 text-[10px] font-semibold cursor-pointer hover:bg-[#1A1D21] hover:text-slate-400 transition-colors border-t border-[#00E676]/10 relative z-10">
                                                    <span className="truncate">Bahis kimliği: {payload.betId}</span>
                                                    <ChevronDown className="w-3 h-3 -rotate-90 shrink-0 opacity-50" />
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
                            className={`px-3 py-2.5 bg-[#1C1F24]/80 border border-white/5 rounded-2xl text-left shadow-sm transition-all hover:bg-white/[0.04] hover:border-white/10 mb-2.5 backdrop-blur-md relative overflow-hidden flex gap-3 items-start ${isMentioned ? 'bg-[#00E5FF]/[0.08] shadow-[0_0_15px_rgba(0,229,255,0.2)]' : ''} ${(isMod && siteUser && isAuthorized(siteUser.role) && userName !== siteUser.username) ? 'cursor-pointer' : ''}`}
                        >
                            {/* Avatar Column */}
                            <div className="shrink-0 mt-0.5">
                                {isMod ? (
                                     <div className="w-8 h-8 rounded-full bg-[#10b981]/20 border border-[#10b981]/50 flex items-center justify-center">
                                         <Shield className="w-4 h-4 text-[#10b981]" />
                                     </div>
                                ) : (
                                     <div className="w-8 h-8 rounded-full bg-[#141822] border flex items-center justify-center overflow-hidden" style={{ borderColor: `${userColor}50` }}>
                                         {msg.avatarUrl ? (
                                             <img src={msg.avatarUrl} alt={userName} className="w-full h-full object-cover" />
                                         ) : (
                                             <span className="font-bold text-[11px]" style={{ color: userColor }}>{initial}</span>
                                         )}
                                     </div>
                                )}
                            </div>
                            
                            {/* Message Content Column */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                    {isMod && (
                                        <span className="inline-flex items-center gap-1 bg-[#10b981]/10 text-[#10b981] px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest border border-[#10b981]/20 uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">
                                            MOD
                                        </span>
                                    )}
                                    {isVip && (
                                        <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest border border-yellow-500/20 uppercase drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">
                                            VIP
                                        </span>
                                    )}
                                    {!isMod && !isVip && msg.vipLevel && (
                                        <span className="inline-flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300 px-1.5 py-0.5 rounded flex-shrink-0 text-[10px] font-black tracking-widest leading-none border border-indigo-500/20 shadow-sm">
                                            {msg.vipLevel}
                                        </span>
                                    )}
                                    <span 
                                        className="font-black tracking-tight text-[13px] hover:underline decoration-white/20 underline-offset-2 truncate max-w-full"
                                        style={{ color: isVip ? '#FFD700' : userColor }}
                                    >
                                        {userName}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 ml-1.5 mt-0.5">
                                        {new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <div className={`break-words antialiased text-[13px] leading-relaxed ${isVip ? 'text-yellow-500/90 font-medium' : isSystem ? 'text-amber-400 font-bold' : 'text-[#e2e8f0]'}`}>
                                    {renderMessageText(msg, (betId, user, type) => setSelectedBet({ id: betId, user, type }))}
                                </div>
                            </div>
                        </div>
                    )})
                )}
            </div>

    {/* Admin Context Menu */}
    {adminMenu && (
        <div 
            className="fixed z-[9999] bg-[#0A0D14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden w-44 animate-in fade-in zoom-in-95 duration-200"
            style={{ top: Math.min(adminMenu.y, window.innerHeight - 200), left: Math.min(adminMenu.x, window.innerWidth - 180) }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">İşlem:</span>
                <div className="text-[12px] font-bold text-white truncate">@{adminMenu.username}</div>
            </div>
            <div className="flex flex-col py-1">
                <button 
                    onClick={() => {
                        triggerGlobalToast(`Mesaj silindi: ${adminMenu.username}`, 'success');
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
                    <VolumeX className="w-3.5 h-3.5 text-amber-400" /> Sustur (10dk)
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
    <div className="p-3 bg-[#0A0D14] border-t border-white/5 relative shrink-0">
        
        {/* Floating New Messages Button */}
        {isScrolledUp && unreadCount > 0 && (
            <div className="absolute -top-12 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <button 
                    onClick={scrollToBottom}
                    className="pointer-events-auto bg-[#00E676] hover:bg-[#00c853] text-[#0A0D14] px-4 py-1.5 rounded-full text-[13px] font-black tracking-tight shadow-[0_4px_15px_rgba(0,230,118,0.4)] flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 animate-bounce"
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
                className="w-full bg-[#0a0d14] border border-white/10 text-[12px] font-semibold text-center text-slate-500 rounded-full px-5 py-3.5 cursor-not-allowed shadow-inner"
            />
        ) : (
            <div className="flex flex-col gap-2">
                        {/* Tip & Rain Toolbar Removed - Will be moved to admin panel later */}
                        
                        <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#161A24] border border-white/10 focus-within:border-[#00E5FF]/50 focus-within:bg-[#0A0D14] focus-within:shadow-[0_0_20px_rgba(0,229,255,0.1)] rounded-full transition-all duration-300 h-[46px]">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={t('chat.placeholder', 'Bir mesaj gönder...')}
                                className="flex-1 bg-transparent text-[13px] font-medium text-white focus:outline-none placeholder-zinc-500 pl-5 pr-3"
                            />
                            <div className="flex items-center pr-1.5 gap-1 h-full shrink-0 relative" ref={emojiPickerRef}>
                                <button type="button" onClick={() => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); }} className="text-zinc-500 hover:text-white transition-colors px-1.5 py-1 rounded hover:bg-white/5 flex items-center justify-center">
                                    <div className="border border-current rounded-[4px] px-1 text-[8px] font-black uppercase tracking-widest leading-none flex items-center h-[18px]">GIF</div>
                                </button>
                                <button type="button" onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); }} className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
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

                                {showGifPicker && (
                                    <GifPicker onSelect={(gif) => {
                                        setNewMessage(gif);
                                        setShowGifPicker(false);
                                        // Auto-submit gif if user wants, but currently we just set it in input.
                                        // User can press Enter to send. Or we can auto-submit:
                                        // Wait, the form submit uses newMessage state, which might not be updated synchronously.
                                        // Best to just put it in input, but BC Game sends it immediately.
                                    }} />
                                )}
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="text-[#0A0D14] bg-gradient-to-br from-[#00E5FF] to-[#00b3cc] disabled:bg-none disabled:bg-[#121212] disabled:text-gray-600 hover:brightness-110 transition-all p-2 rounded-full shadow-[0_2px_10px_rgba(0,229,255,0.3)]"
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
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 max-h-[60vh] overflow-y-auto custom-scrollbar flex flex-col gap-3">
                            {rainModalData.map((r: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center bg-[#2A2C31] px-3 py-2.5 rounded-lg border border-white/[0.02]">
                                    <span className="text-[#00E676] font-bold text-[14px]">@{r.user}</span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-white font-bold text-[14px]">{r.amount}</span>
                                        <div className="w-4 h-4 bg-[#00E676] rounded-full flex items-center justify-center shrink-0 shadow-sm">
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
