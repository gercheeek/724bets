import React, { useState, useEffect, useRef } from 'react';
import { Shield, Settings, Trash2, Crown, Globe, MessageSquare, Target, ChevronDown, Flag, Smile, Send, Lock, HelpCircle, X, Trophy, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import ChatChannel from './ChatChannel';
import { supabase } from '../../utils/supabase';
import { SiteUser } from '../../types';
import { useTranslation } from 'react-i18next';

interface ChatContainerProps {
    open: boolean;
    onOpen?: () => void;
    onClose: () => void;
    siteUser: SiteUser | null;
    userRole: string | null;
    isMobile?: boolean;
}

const SERVERS = [
    { id: 'global', name: 'Global Server', icon: <Globe className="w-3.5 h-3.5 text-[#00E5FF]" /> },
    { id: 'tr', name: 'Türkiye', icon: '🇹🇷' },
    { id: 'br', name: 'Brasil', icon: '🇧🇷' },
    { id: 'ar', name: 'Argentina', icon: '🇦🇷' },
];

export default function ChatContainer({ open, onClose, siteUser, userRole, isMobile }: ChatContainerProps) {
    const { i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState(() => {
        const lang = i18n.language ? i18n.language.split('-')[0] : 'tr';
        if (lang === 'pt') return 'br';
        if (lang === 'es') return 'ar';
        return lang || 'global';
    });

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [showSportsRules, setShowSportsRules] = useState(false);
    const [showChatRules, setShowChatRules] = useState(false);
    
    useEffect(() => {
        if (activeTab === 'sports') {
            const hasSeen = localStorage.getItem('hasSeenSportsRules');
            if (!hasSeen) {
                setShowSportsRules(true);
            }
        } else {
            const hasSeenChat = localStorage.getItem('hasSeenChatRules');
            if (!hasSeenChat) {
                setShowChatRules(true);
            }
        }
    }, [activeTab]);
    
    // Chat input state
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Emojis (focused on winning/money)
    const QUICK_EMOJIS = ['💰', '🤑', '💸', '🚀', '🔥', '🏆', '🎉', '💎', '💵', '🟢', '🎰', '🍀'];

    const MOCK_USERS = ["Kral_Alex", "ProBettor", "Veli_Can", "Admin", "GhostBettor"];
    const [mentionSearch, setMentionSearch] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setMessage(val);
        
        const lastWord = val.split(' ').pop();
        if (lastWord !== undefined && lastWord.startsWith('@')) {
            setMentionSearch(lastWord.substring(1));
        } else {
            setMentionSearch(null);
        }
    };

    const insertMention = (username: string) => {
        const words = message.split(' ');
        words.pop();
        const newMsg = [...words, `@${username} `].join(' ');
        setMessage(newMsg);
        setMentionSearch(null);
    };

    // Close popups on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSend = () => {
        if (!message.trim() || activeTab === 'sports') return;
        window.dispatchEvent(new CustomEvent('sendChatMessage', { detail: message }));
        setMessage('');
        setShowEmojiPicker(false);
        setMentionSearch(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const CHANNELS = [
        { id: 'global', name: 'Global', emoji: '🌐' },
        { id: 'tr', name: 'Türkiye', emoji: '🇹🇷' },
        { id: 'br', name: 'Brezilya', emoji: '🇧🇷' },
        { id: 'ar', name: 'Arjantin', emoji: '🇦🇷' },
        { id: 'sports', name: 'Sport', emoji: '⚽' },
    ];

    if (!open) return null;

    return (
        <div id="chat-3-container" className="h-full w-full flex flex-col bg-[#06080C] font-sans text-left relative shadow-[-5px_0_30px_rgba(0,0,0,0.5)]">
            
            {/* Header / Tabs */}
            <div className="bg-[#050505] flex-shrink-0 z-20 relative h-[72px] border-b border-white/5 flex flex-col justify-center gap-1.5">
                
                <div className="flex items-center justify-between pl-3 pr-2 h-full">
                    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded-lg transition-all"
                        >
                            <span className="font-black text-[15px] tracking-wide text-white drop-shadow-sm">
                                {CHANNELS.find(ch => ch.id === activeTab)?.name || 'Global'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-3 w-[220px] bg-[#2b2d31] border border-white/5 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] p-2 z-[100] animate-fade-in flex flex-col gap-1">
                                {CHANNELS.map(ch => {
                                    const isActive = activeTab === ch.id;
                                    return (
                                        <button
                                            key={ch.id}
                                            onClick={() => {
                                                setActiveTab(ch.id);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${isActive ? 'bg-[#35373c]' : 'hover:bg-[#35373c]/50'}`}
                                        >
                                            <span className={`text-[14px] font-bold ${isActive ? 'text-white' : 'text-zinc-300'}`}>{ch.name}</span>
                                            <div className={`w-4 h-4 rounded-full border-[3px] flex items-center justify-center shrink-0 ${isActive ? 'border-[#00E5FF]' : 'border-zinc-500'}`}>
                                                {isActive && <div className="w-2 h-2 rounded-full bg-[#00E5FF]"></div>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white/10 rounded-lg transition-all text-zinc-400 hover:text-white border border-transparent">
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white/10 rounded-lg transition-all text-zinc-400 hover:text-amber-400 border border-transparent">
                            <Trophy className="w-4 h-4" />
                        </button>
                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-transparent hover:bg-white/10 rounded-lg transition-all text-zinc-400 hover:text-white border border-transparent">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Channels Area */}
            <div className="flex-1 overflow-hidden relative bg-[#06080C]">
                

                <ChatChannel 
                    server={activeTab === 'sports' ? 'global' : activeTab} 
                    channelType={activeTab === 'sports' ? 'sports' : 'general'} 
                    siteUser={siteUser} 
                />

                {/* Sports Rules Modal */}
                {showSportsRules && activeTab === 'sports' && (
                    <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#0A0D14] border border-white/5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] w-full max-w-[320px] overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-black text-[15px] text-white tracking-wider uppercase drop-shadow-sm">KURALLAR</h3>
                                <button onClick={() => setShowSportsRules(false)} className="text-zinc-500 hover:text-white transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-md">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div className="text-[13px] text-zinc-300 leading-relaxed border-b border-white/5 pb-3">
                                    <strong className="text-white font-bold text-[14px]">VIP & Moderatör Erişimi</strong>
                                    <span className="block mt-1">Bu alan <span className="text-yellow-500 font-medium">VIP</span> üyelerimiz ve moderatörlerimiz içindir. Yalnızca özenle seçilmiş kuponlar paylaşılabilir.</span>
                                </div>
                                <div className="text-[13px] text-zinc-300 leading-relaxed border-b border-white/5 pb-3">
                                    <strong className="text-white font-bold text-[14px]">1-Tıkla Işınla (Hızlı Kopya)</strong>
                                    <span className="block mt-1">Beğendiğiniz kuponun yanındaki <span className="text-[#00E5FF] font-medium">KUPONU OYNA</span> butonuna dokunarak saniyeler içinde kendi kuponunuza aktarabilirsiniz.</span>
                                </div>
                                <div className="text-[13px] text-zinc-300 leading-relaxed">
                                    <strong className="text-white font-bold text-[14px]">Daima Taze Fırsatlar</strong>
                                    <span className="block mt-1">Süresi dolmuş kuponlar filtrelenir; sadece en güncel ve oynanabilir fırsatları görürsünüz.</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-2">
                                    <button onClick={() => setShowSportsRules(false)} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[14px] tracking-wide rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                        ANLADIM
                                    </button>
                                    <button 
                                        onClick={() => {
                                            localStorage.setItem('hasSeenSportsRules', 'true');
                                            setShowSportsRules(false);
                                        }} 
                                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold text-[12px] tracking-wide rounded-lg transition-all border border-white/10"
                                    >
                                        BİR DAHA GÖSTERME
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* General Chat Rules Modal */}
                {showChatRules && activeTab !== 'sports' && (
                    <div className="absolute inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#0A0D14] border border-white/5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] w-full max-w-[320px] overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-black text-[15px] text-white tracking-wider uppercase drop-shadow-sm">KURALLAR</h3>
                                <button onClick={() => setShowChatRules(false)} className="text-zinc-500 hover:text-white transition-colors p-1 bg-white/5 hover:bg-white/10 rounded-md">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div className="text-[13px] text-zinc-300 leading-relaxed border-b border-white/5 pb-3">
                                    <strong className="text-white font-bold text-[14px]">Saygı & Düzen</strong>
                                    <span className="block mt-1">Sohbette spam yapmak ve rahatsız edici sözler kullanmak yasaktır.</span>
                                </div>
                                <div className="text-[13px] text-zinc-300 leading-relaxed border-b border-white/5 pb-3">
                                    <strong className="text-white font-bold text-[14px]">Bahsetme (@Mention) Sistemi</strong>
                                    <span className="block mt-1">Klavyenizden <span className="text-[#00E5FF] font-medium">@</span> tuşuna basarak sohbetteki aktif kişileri etiketleyebilirsiniz.</span>
                                </div>
                                <div className="text-[13px] text-zinc-300 leading-relaxed">
                                    <strong className="text-white font-bold text-[14px]">Prestijli Seviye Rozetleri</strong>
                                    <span className="block mt-1">VIP statünüze göre isminizin yanında <span className="text-amber-500 font-medium text-[11px]">I, II, III...</span> gibi özel Roma rakamlı rozetler sergilenir.</span>
                                </div>
                                <div className="flex flex-col gap-2 mt-2">
                                    <button onClick={() => setShowChatRules(false)} className="w-full py-3 bg-[#00E5FF] hover:bg-cyan-400 text-black font-black text-[14px] tracking-wide rounded-lg transition-all shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                                        ANLADIM
                                    </button>
                                    <button 
                                        onClick={() => {
                                            localStorage.setItem('hasSeenChatRules', 'true');
                                            setShowChatRules(false);
                                        }} 
                                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold text-[12px] tracking-wide rounded-lg transition-all border border-white/10"
                                    >
                                        BİR DAHA GÖSTERME
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Input Area */}
            <div className="bg-[#050505] p-3 flex-shrink-0 z-20 border-t border-white/5 shadow-[0_-5px_20px_rgba(0,0,0,0.4)]">
                {activeTab === 'sports' ? (
                    <div className="flex gap-2 animate-fade-in">
                        <button 
                            onClick={() => window.dispatchEvent(new CustomEvent('openBetSlip', { detail: { open: true } }))}
                            className="flex-1 flex items-center justify-center gap-2 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 rounded-xl transition-all duration-300 h-[46px] px-4 font-bold tracking-wide shadow-[0_0_15px_rgba(0,229,255,0.1)] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
                        >
                            <Target className="w-4 h-4" />
                            KUPON OLUŞTUR VE PAYLAŞ
                        </button>
                    </div>
                ) : !siteUser ? (
                    <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { message: 'Sohbete katılmak için hemen aramıza katıl!' } }))}
                        className="w-full flex items-center justify-center bg-[#0B0E14] hover:bg-[#0E121A] border border-white/10 hover:border-[#00E5FF]/30 rounded-xl transition-all duration-300 h-[46px] px-4 text-zinc-400 hover:text-white group cursor-pointer shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                    >
                        <Lock className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 group-hover:text-[#00E5FF] transition-all" />
                        <span className="text-[13px] font-bold tracking-wide">Sohbete katılmak için giriş yapın</span>
                    </button>
                ) : (
                    <div className="relative flex items-center bg-[#0B0E14] border border-white/10 focus-within:border-[#00E5FF]/50 focus-within:bg-[#0A0D14] focus-within:shadow-[0_0_20px_rgba(0,229,255,0.15)] rounded-xl transition-all duration-300 h-[46px] px-2 shadow-inner group">
                        
                        {/* Emoji Picker Popup */}
                        {showEmojiPicker && (
                            <div ref={emojiPickerRef} className="absolute bottom-full left-0 mb-3 w-[220px] bg-[#0A0D14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-2.5 z-50 animate-fade-in origin-bottom-left">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-2 px-1">Popüler Emojiler</div>
                                <div className="grid grid-cols-4 gap-1">
                                    {QUICK_EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => {
                                                setMessage(prev => prev + emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            className="w-10 h-10 flex items-center justify-center text-[20px] hover:bg-white/10 rounded-lg transition-colors transform hover:scale-110"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mentions Popup */}
                        {mentionSearch !== null && (
                            <div className="absolute bottom-full left-10 mb-3 w-[200px] bg-[#0A0D14]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] p-1.5 z-50 animate-fade-in origin-bottom-left flex flex-col max-h-[150px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1 px-2 pt-1">Kullanıcılar</div>
                                {MOCK_USERS.filter(u => u.toLowerCase().includes(mentionSearch.toLowerCase())).map(user => (
                                    <button
                                        key={user}
                                        onClick={() => insertMention(user)}
                                        className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                            {user.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-[13px] font-semibold text-zinc-300">{user}</span>
                                    </button>
                                ))}
                                {MOCK_USERS.filter(u => u.toLowerCase().includes(mentionSearch.toLowerCase())).length === 0 && (
                                    <div className="px-3 py-2 text-[12px] text-zinc-500 font-medium">Kullanıcı bulunamadı</div>
                                )}
                            </div>
                        )}

                        <button 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors shrink-0 ${showEmojiPicker ? 'text-[#00E5FF] bg-[#00E5FF]/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                        
                        <input
                            type="text"
                            value={message}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Mesajınızı yazın..."
                            className="flex-1 bg-transparent text-[13px] font-medium text-white focus:outline-none placeholder-zinc-500 px-2 h-full"
                        />
                        
                        <button 
                            onClick={handleSend}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 shrink-0 ${message.trim() ? 'bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black shadow-[0_0_10px_rgba(0,229,255,0.2)]' : 'text-zinc-600 bg-transparent'}`}
                        >
                            <Send className={`w-4 h-4 ml-0.5 ${message.trim() ? '' : 'opacity-50'}`} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
