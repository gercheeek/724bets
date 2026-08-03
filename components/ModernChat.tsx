import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Shield, Smile, Cpu, Target, ChevronDown, MessageCircle, MoreVertical, Heart, CornerUpLeft, Trash2, VolumeX, Ban, User, Check, Star, Trophy } from 'lucide-react';
import { supabase, getGlobalConfig, updateGlobalConfig } from '../utils/supabase';
import { triggerGlobalToast } from './GlobalToaster';
import { useTranslation } from 'react-i18next';
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

const RainDropMessage = ({ rainMsg }: { rainMsg: string }) => {
    const [claimed, setClaimed] = useState(false);

    return (
        <div className="my-3 w-full relative group mx-auto animate-in fade-in zoom-in duration-500">
            {/* Animated border glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00e701] to-[#00f0ff] rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
            
            {/* Main Card */}
            <div className="relative bg-[#0a0f16] border border-[#1f2937] rounded-lg p-4 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#00e701]/10 to-transparent opacity-50"></div>
                
                {/* Content */}
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
    const [showComments, setShowComments] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        if (showDetails || showComments) {
            setTimeout(() => {
                const wrapper = document.getElementById('modern-chat-wrapper');
                if (wrapper) {
                    wrapper.scrollTo({
                        top: wrapper.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 50);
        }
    }, [showDetails, showComments]);

    return (
        <div className="bg-gradient-to-b from-[#161922] to-[#0f1117] border border-white/10 border-l-[3px] border-l-[#00E5FF] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.6)] mt-1 w-full max-w-sm relative transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_40px_rgba(0,229,255,0.15)] hover:-translate-y-0.5">
            {/* Glowing Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#00E5FF]/50 via-[#00E5FF]/10 to-transparent"></div>
            
            {/* Bet Header (Clickable for details) */}
            <div 
                className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-colors relative"
                onClick={() => setShowDetails(!showDetails)}
            >
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]" />
                    <span className="text-[#00E5FF] text-[12px] font-black tracking-widest uppercase drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">{payload.type || 'SPOR'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-zinc-400/80 text-[10px] font-black tracking-[0.2em]">KUPON #{payload.id?.split('-').pop()}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${showDetails ? 'rotate-180 text-white drop-shadow-md' : ''}`} />
                </div>
            </div>
            
            {/* Bet Details (Hidden when collapsed) */}
            {showDetails && (
                <div className="p-4 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1.5">
                             <span className="text-zinc-400 text-[9px] uppercase font-bold tracking-widest">{payload.league || 'İSPANYA LA LIGA'}</span>
                             <span className="text-zinc-600 text-[10px]">•</span>
                             {(() => {
                                 const timeStr = payload.time || '';
                                 const isLive = timeStr.toUpperCase().includes('CANLI');
                                 return (
                                     <span className={`${isLive ? 'text-rose-500' : 'text-[#00E5FF]'} text-[9px] uppercase font-bold tracking-widest flex items-center gap-1.5`}>
                                         <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-[#00E5FF] opacity-80'}`}></div>
                                         {timeStr || 'Bugün 22:00'}
                                     </span>
                                 );
                             })()}
                        </div>
                        <h4 className="text-white font-bold text-[14px] leading-snug">{payload.title}</h4>
                    </div>
                    
                    <div className="flex flex-col gap-2 pl-3 border-l-2 border-white/10 mb-5 relative">
                        {payload.picks && payload.picks.map((pick:any, i:number) => (
                            <div key={i} className="bg-gradient-to-r from-black/60 to-black/20 px-3.5 py-3 rounded-lg border border-white/5 flex items-center justify-between group backdrop-blur-sm shadow-inner transition-colors hover:border-white/10">
                                <div>
                                    <span className="text-white text-[13.5px] font-bold block leading-tight mb-1">{pick.name || pick.text}</span>
                                    <span className="text-[#00E5FF]/90 text-[9.5px] font-black tracking-[0.15em] uppercase">{pick.market || pick.detail}</span>
                                </div>
                                <div className="flex items-center justify-center bg-gradient-to-b from-[#1a1d24] to-[#12141a] border border-white/10 rounded-md px-3.5 py-1.5 min-w-[50px] shadow-[0_2px_10px_rgba(0,0,0,0.5)] group-hover:border-[#00E5FF]/40 transition-colors">
                                    <span className="text-white font-black text-[14px]">{pick.odd ? pick.odd.toFixed(2) : (payload.totalOdds || payload.odds)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-between bg-gradient-to-r from-[#101218] via-[#141822] to-[#101218] p-4 rounded-xl border border-white/10 relative overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTEwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>
                        <div className="flex flex-col relative z-10">
                            <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Toplam Oran</span>
                            <span className="text-white font-black text-[18px] tracking-tight drop-shadow-md">{payload.totalOdds || payload.odds}</span>
                        </div>
                        <div className="flex flex-col text-right relative z-10">
                            <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-[0.2em] mb-1">Olası Kazanç</span>
                            <span className="text-[#00E676] font-black text-[19px] tracking-tight drop-shadow-[0_0_10px_rgba(0,230,118,0.4)]">{payload.potentialWin ? `₺${payload.potentialWin.toLocaleString()}` : payload.win}</span>
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] hover:brightness-110 text-[#0A0D14] text-[12px] font-black py-3.5 rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 transform active:scale-[0.98]">
                        BU KUPONU OYNA
                        <ChevronDown className="w-4 h-4 -rotate-90" strokeWidth={3} />
                    </button>
                </div>
            )}

            {/* Comments Toggle */}
            <div className={`p-2.5 bg-transparent hover:bg-white/[0.02] transition-colors ${showDetails ? 'border-t border-white/5' : ''}`}>
                <button 
                    onClick={() => setShowComments(!showComments)}
                    className="w-full flex items-center justify-center gap-1.5 text-zinc-400 hover:text-white text-[12px] font-bold transition-all py-1 group"
                >
                    <MessageCircle className="w-3.5 h-3.5 group-hover:text-[#00E5FF] transition-colors" />
                    {showComments ? 'Yorumları Gizle' : `Yorumlar (${replies.length})`}
                </button>
            </div>

            {/* Comments Area */}
            {showComments && (
                <div className="border-t border-white/5 bg-black/40 p-2.5 flex flex-col gap-2.5">
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {replies.length === 0 && <span className="text-zinc-500 text-[10px] italic pl-1 block text-center py-2">Henüz yorum yok. İlk yorumu sen yap!</span>}
                        {replies.map((r:any) => {
                             const isMod = r.role?.toUpperCase() === 'ADMIN' || r.role?.toUpperCase() === 'MODERATOR';
                             return (
                            <div key={r.id} className="bg-white/[0.03] rounded-lg p-2 border border-white/5 flex gap-1.5 backdrop-blur-sm">
                                <span className={`text-[10px] font-black shrink-0 ${isMod ? 'text-[#10b981]' : 'text-[#00E5FF]'}`}>{r.username}:</span>
                                <span className="text-zinc-300 text-[11px] leading-relaxed break-words">{r.message.replace(`[BET_REPLY:${payload.id}] `, '')}</span>
                            </div>
                        )})}
                    </div>
                    <div className="flex items-center gap-2 mt-1 relative">
                        <input 
                            type="text" 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && replyText.trim()) {
                                    onReply(payload.id, replyText);
                                    setReplyText('');
                                }
                            }}
                            placeholder="Yorum yaz..."
                            className="flex-1 bg-black/60 border border-white/10 rounded-lg pl-3 pr-2 py-2 text-[11px] text-white focus:border-[#00E5FF]/50 focus:bg-black outline-none transition-all focus:shadow-[0_0_15px_rgba(0,229,255,0.1)]"
                        />
                        <button 
                            onClick={() => {
                                if(replyText.trim()){
                                    onReply(payload.id, replyText);
                                    setReplyText('');
                                }
                            }}
                            className="absolute right-1 top-1 bottom-1 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] px-3 rounded-md font-black text-[10px] uppercase transition-colors"
                        >
                            Gönder
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const getUserColor = (username: string) => {
    if (!username) return '#05D9E8'; // Default Cyan
    const colors = [
        '#FF2A6D', // Neon Pink
        '#05D9E8', // Cyan
        '#FFC000', // Gold/Yellow
        '#B026FF', // Neon Purple
        '#FF9D00', // Orange
        '#00FF9D', // Mint
        '#FF3366', // Rose
        '#33CCFF'  // Light Blue
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
    const [activeLang, setActiveLang] = useState(LANGUAGES[0]);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const [selectedBet, setSelectedBet] = useState<{ id: string | number, user: string, type?: string } | null>(null);
    
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

    const handleSendReply = async (betId: string, replyText: string) => {
        if (!siteUser) return;
        
        const myUserId = siteUser.id || `anon_${Math.random().toString(36).substr(2, 9)}`;
        const myUsername = siteUser.username || siteUser.email?.split('@')[0] || 'Misafir';
        const role = userRole || (siteUser.role?.toLowerCase() === 'admin' ? 'admin' : 'user');

        const finalMessage = sanitize(`[BET_REPLY:${betId}] ${replyText.trim()}`);

        const msgObj = {
            channel_id: activeLang.id,
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
        <div id="tour-chat" className="h-full w-full flex flex-col bg-[#0A0D14] font-sans text-left relative shadow-[-5px_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Header */}
            <div className="bg-[#0A0D14] px-4 h-[64px] text-white flex items-center justify-between flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-10 border-b border-white/5">
                <div className="flex items-center gap-3 relative">
                     <button className="flex items-center gap-2 bg-[#0a0d14] border border-white/5 hover:border-white/10 px-3 py-1.5 rounded-xl transition-all text-sm font-semibold text-zinc-300 hover:text-white" onClick={() => setShowLangMenu(!showLangMenu)}>
                         <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-[12px] opacity-90">🇹🇷</span>
                         Türkçe
                         <ChevronDown className="w-3.5 h-3.5 ml-1 text-zinc-500" />
                     </button>
                     {showLangMenu && (
                        <div className="absolute top-full left-0 mt-2 bg-[#0a0d14] border border-white/10 rounded-xl shadow-2xl p-2 z-50 min-w-[150px]">
                            {LANGUAGES.map(lang => (
                                <div key={lang.id} className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer text-sm font-semibold text-slate-300 transition-colors flex items-center gap-2">
                                    <span className="text-[12px] opacity-80">{lang.code === 'TR' ? '🇹🇷' : lang.code === 'EN' ? '🇬🇧' : lang.code === 'DE' ? '🇩🇪' : lang.code === 'ES' ? '🇪🇸' : '🇵🇹'}</span>
                                    {lang.name}
                                </div>
                            ))}
                        </div>
                     )}
                </div>
                <div className="flex items-center gap-4 text-zinc-500">
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 flex items-center justify-center bg-[#0a0d14] border border-white/5 hover:bg-white/10 transition-all rounded-full text-zinc-400 hover:text-white"
                        title="Kapat"
                    >
                        <X className="w-4 h-4" />
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
                id="modern-chat-wrapper" 
                className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-[#0A0D14] transition-all"
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
                        } else if (isBigWin) {
                            let payload: any = null;
                            try {
                                const jsonStr = msg.message.replace('[BIG_WIN:', '').replace(/\]$/, '');
                                payload = JSON.parse(jsonStr);
                            } catch(e) {}
                            
                            if (payload) {
                                return (
                                    <div key={msg.id || i} className="mb-2.5 px-3 py-3 bg-[#11141A]/90 border border-white/5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.4)] flex items-start gap-3 relative overflow-hidden group">
                                        {/* Icon */}
                                        <div className="flex flex-col items-center gap-1.5 shrink-0 z-10 pt-0.5">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                                <Trophy className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-500">
                                                {new Date(msg.created_at || Date.now()).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        {/* Content */}
                                        <div className="flex flex-col z-10 flex-1">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="bg-[#00E676] text-[#0A0D14] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">BOT</span>
                                                <span className="text-white text-xs font-semibold">Büyük Kazanç</span>
                                            </div>
                                            <p className="text-[#E2E8F0] text-[13px] leading-relaxed font-medium">
                                                <span className="font-bold text-white">{payload.username}</span> kullanıcısı <span className="font-bold text-white underline decoration-white/20 underline-offset-2">{payload.game}</span> oynarken <span className="font-bold text-[#00E676]">${payload.amount}</span> kazandı
                                            </p>
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
                            className={`px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-left text-[13px] leading-relaxed shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all hover:bg-white/[0.04] hover:border-white/10 mb-2.5 backdrop-blur-md relative overflow-hidden border-l-[3px] ${isMentioned ? 'bg-[#00E5FF]/[0.08] shadow-[0_0_15px_rgba(0,229,255,0.2)]' : ''} ${(isMod && siteUser && isAuthorized(siteUser.role) && userName !== siteUser.username) ? 'cursor-pointer' : ''}`}
                            style={{ borderLeftColor: isVip ? '#FFD700' : userColor }}
                        >
                            <span className="inline-flex items-center gap-1.5 mr-1.5 align-middle">
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
                                    className="font-black tracking-tight text-[13.5px] hover:underline decoration-white/20 underline-offset-2"
                                    style={{ color: isVip ? '#FFD700' : userColor, textShadow: `0 0 5px ${isVip ? '#FFD700' : userColor}66` }}
                                >
                                    {userName}
                                </span>
                            </span>
                            <span className={`break-words antialiased ml-1 text-[13px] md:text-[14px] leading-relaxed ${isVip ? 'text-yellow-500/90 font-medium' : isSystem ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                                {renderMessageText(msg, (betId, user, type) => setSelectedBet({ id: betId, user, type }))}
                            </span>
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

            {/* Input Footer Area */}
            <div className="p-4 bg-[#0A0D14] flex-shrink-0 z-10 relative border-t border-white/5">
                {!siteUser ? (
                    <input 
                        type="text"
                        disabled
                        placeholder={t('chat.login_required', 'Mesaj göndermek için lütfen giriş yapın')}
                        className="w-full bg-[#0a0d14] border border-white/10 text-[12px] font-semibold text-center text-slate-500 rounded-full px-5 py-3.5 cursor-not-allowed shadow-inner"
                    />
                ) : (
                    <div className="flex flex-col gap-2">
                        {/* Tip & Rain Toolbar Removed - Will be moved to admin panel later */}
                        
                        <form onSubmit={handleSendMessage} className="relative flex items-center bg-[#161A24] border border-white/10 focus-within:border-[#00E5FF]/50 focus-within:bg-[#0A0D14] focus-within:shadow-[0_0_20px_rgba(0,229,255,0.1)] rounded-full overflow-hidden transition-all duration-300 h-[46px]">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={t('chat.placeholder', 'Bir mesaj gönder...')}
                                className="flex-1 bg-transparent text-[13px] font-medium text-white focus:outline-none placeholder-zinc-500 pl-5 pr-3"
                            />
                            <div className="flex items-center pr-1.5 gap-1 h-full shrink-0">
                                <button type="button" className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5">
                                    <Smile className="w-4 h-4" />
                                </button>
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
        </div>
    );
};

export default ModernChat;
