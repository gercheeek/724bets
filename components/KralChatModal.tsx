import React, { useState, useEffect, useRef } from 'react';
import { X, Crown, Megaphone, Trash2, Lock, Unlock, Send, Zap, Activity, Bot, Coins, Trophy, Settings, UploadCloud, Crosshair, Eye, AlertTriangle } from 'lucide-react';
import { triggerGlobalToast } from './GlobalToaster';
import { supabase } from '../utils/supabase';
import ModernChat from './ModernChat';
import AdminRainControl from './AdminRainControl';

const FIXED_BOTS = [
    { id: 1, isim: 'CryptoKral', rol: 'VIP', uyelikTarihi: '2 Yıllık Üye', karakter: 'Sürekli kasa katlayan, yüksek bahisçi', avatarRenk: '#FFD700', typingStyle: 'perfect', slang: ['kral', 'kardeşim'], emojiStyle: 'money' },
    { id: 2, isim: 'Kaan1907', rol: 'Normal', uyelikTarihi: '6 Aylık Üye', karakter: 'Futbol aşığı, kupon paylaşır', avatarRenk: '#38bdf8', typingStyle: 'lazy_lower', slang: ['aga', 'beyler'], emojiStyle: 'none' },
    { id: 3, isim: 'SlotMaster', rol: 'VIP', uyelikTarihi: '3 Yıllık Üye', karakter: 'Sadece slot oynar, bonanza delisi', avatarRenk: '#e879f9', typingStyle: 'typo_maker', slang: ['hocam', 'usta'], emojiStyle: 'spam' },
    { id: 4, isim: 'Veli_2', rol: 'Normal', uyelikTarihi: '1 Yıllık Üye', karakter: 'Temkinli, garantici oyuncu', avatarRenk: '#4ade80', typingStyle: 'perfect', slang: [], emojiStyle: 'none' },
    { id: 5, isim: 'Selin1903', rol: 'VIP', uyelikTarihi: '4 Aylık Üye', karakter: 'Şans oyunları tutkunu', avatarRenk: '#f472b6', typingStyle: 'lazy_lower', slang: ['kızlar', 'canım'], emojiStyle: 'spam' },
    { id: 6, isim: 'AnalizUzmanı', rol: 'Normal', uyelikTarihi: '1.5 Yıllık Üye', karakter: 'İstatistiklere göre bahis alır', avatarRenk: '#a78bfa', typingStyle: 'perfect', slang: ['dostum', 'istatistik'], emojiStyle: 'none' },
    { id: 7, isim: 'Can_Bey', rol: 'VIP', uyelikTarihi: '5 Yıllık Üye', karakter: 'Ağır abi, büyük oynar', avatarRenk: '#fb923c', typingStyle: 'caps_lock_rage', slang: ['ASLANIM', 'YİĞİDİM'], emojiStyle: 'money' },
    { id: 8, isim: 'ParaBabası', rol: 'VIP', uyelikTarihi: '3 Yıllık Üye', karakter: 'Kayıp yaşasa da umursamaz', avatarRenk: '#34d399', typingStyle: 'perfect', slang: ['koçum', 'boşver'], emojiStyle: 'money' },
    { id: 9, isim: 'KuponcuDayı', rol: 'Normal', uyelikTarihi: '2 Yıllık Üye', karakter: 'Sürekli kombine kupon dener', avatarRenk: '#fbbf24', typingStyle: 'boomer', slang: ['yigenim', 'hayırlısı'], emojiStyle: 'boomer' },
    { id: 10, isim: 'RuletFatihi', rol: 'VIP', uyelikTarihi: '8 Aylık Üye', karakter: 'Sadece rulette sayılara basar', avatarRenk: '#f87171', typingStyle: 'caps_lock_rage', slang: ['BİRADER', 'GELİYOR'], emojiStyle: 'spam' },
    { id: 11, isim: 'TaktikMaktikYok', rol: 'Normal', uyelikTarihi: '1 Aylık Üye', karakter: 'Agresif kayıpçı, hisleriyle oynar', avatarRenk: '#2dd4bf', typingStyle: 'typo_maker', slang: ['yaaa', 'off'], emojiStyle: 'none' },
    { id: 12, isim: 'AviatorCü', rol: 'Normal', uyelikTarihi: '5 Aylık Üye', karakter: 'Uçak oyunlarında profesyonel', avatarRenk: '#818cf8', typingStyle: 'lazy_lower', slang: ['uçtuk', 'patladı'], emojiStyle: 'spam' },
];

interface KralChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const applyBotPersona = (text: string, bot: typeof FIXED_BOTS[0] | null) => {
    if (!bot) return text;
    let processedText = text;
    if (bot.typingStyle === 'lazy_lower') {
        processedText = processedText.toLowerCase().replace(/[.,!?]/g, '');
    } else if (bot.typingStyle === 'caps_lock_rage') {
        processedText = processedText.toUpperCase() + '!!!';
    } else if (bot.typingStyle === 'boomer') {
        processedText = processedText.toLowerCase() + '....';
    } else if (bot.typingStyle === 'typo_maker') {
        if (processedText.length > 4 && Math.random() > 0.3) {
            const idx = Math.floor(Math.random() * (processedText.length - 2)) + 1;
            const chars = processedText.split('');
            const temp = chars[idx];
            chars[idx] = chars[idx + 1];
            chars[idx + 1] = temp;
            processedText = chars.join('');
        }
        processedText = processedText.toLowerCase();
    }
    if (bot.slang.length > 0 && Math.random() > 0.4) {
        const randomSlang = bot.slang[Math.floor(Math.random() * bot.slang.length)];
        processedText = `${processedText} ${randomSlang}`;
    }
    if (bot.emojiStyle === 'money') {
        const moneyEmojis = ['💸', '🤑', '💰'];
        processedText += ' ' + moneyEmojis[Math.floor(Math.random() * moneyEmojis.length)];
    } else if (bot.emojiStyle === 'spam') {
        const spamEmojis = ['🔥', '🚀', '💣', '💯'];
        const e = spamEmojis[Math.floor(Math.random() * spamEmojis.length)];
        processedText += ` ${e}${e}${e}`;
    } else if (bot.emojiStyle === 'boomer') {
        const boomerEmojis = ['👍', '🌹', '🙏', '☕'];
        processedText += ' ' + boomerEmojis[Math.floor(Math.random() * boomerEmojis.length)];
    }
    return processedText;
};

export default function KralChatModal({ isOpen, onClose }: KralChatModalProps) {
    const [messages, setMessages] = useState<any[]>([]);
    
    // Announce
    const [announceText, setAnnounceText] = useState('');
    
    // Chat Input
    const [chatInput, setChatInput] = useState('');
    
    // Settings
    const [isLocked, setIsLocked] = useState(false);
    const [isRaining, setIsRaining] = useState(false);

    // Bot Generator State
    const [botCount, setBotCount] = useState(3);
    const [useEmojis, setUseEmojis] = useState(false);
    
    // Bot Dashboard State
    const [selectedBotId, setSelectedBotId] = useState<number | null>(null);
    const [applyPersona, setApplyPersona] = useState(true);

    // Big Win Bot State
    const [bigWinUser, setBigWinUser] = useState('Memuta');
    const [bigWinGame, setBigWinGame] = useState('Sweet Bonanza 1000');
    const [bigWinAmount, setBigWinAmount] = useState('56,332.54');

    // Sidebar Tab State
    const [activeTab, setActiveTab] = useState('godmode');
    
    // --- GOD MODE V2 STATES ---
    const [selectedWhale, setSelectedWhale] = useState<string | null>(null);
    const [autoTriggers, setAutoTriggers] = useState({ lossLimit: false, silentChat: false });
    const [matrixValues, setMatrixValues] = useState({ online: 18492, reward: 4.2 });

    const [showRainControl, setShowRainControl] = useState(false);
    
    // Geçmiş Silme Onay Modal
    const [showClearHistorySettings, setShowClearHistorySettings] = useState(false);
    const [selectedChannelsToClear, setSelectedChannelsToClear] = useState<string[]>(['global', 'tr', 'br', 'ar']);

    const toggleClearChannel = (channelId: string) => {
        setSelectedChannelsToClear(prev => 
            prev.includes(channelId) 
                ? prev.filter(c => c !== channelId) 
                : [...prev, channelId]
        );
    };

    const confirmClearHistory = () => {
        if (selectedChannelsToClear.length === 0) {
            triggerGlobalToast('Lütfen en az bir sunucu seçin!', 'error');
            return;
        }
        const commandText = `[GEÇMİŞİ SİL:${selectedChannelsToClear.join(',')}]`;
        setMessages(prev => [...prev, { id: Date.now(), user: 'SİSTEM', role: 'system', msg: commandText, isPushed: false }]);
        triggerGlobalToast('Geçmişi silme işlemi taslağa eklendi! PUSHLA diyerek onaylayın.', 'info');
        setShowClearHistorySettings(false);
    };

    if (!isOpen) return null;

    const pushToSupabase = async (user: string, role: string, msg: string) => {
        const finalRole = (role === 'user' && Math.random() > 0.4) ? 'VIP' : role;
        const toInsert = [{
            channel_id: 'tr',
            user_id: `bot_${user.toLowerCase()}_${Math.random().toString(36).substring(7)}`,
            username: user,
            message: msg,
            role: finalRole
        }];
        const { error } = await supabase.from('tv_chat').insert(toInsert);
        if (error) {
            triggerGlobalToast('Canlıya aktarım başarısız oldu!', 'error');
        }
    };

    const handlePushToLive = async () => {
        const unpushed = messages.filter(m => !m.isPushed);
        if (unpushed.length === 0) {
            triggerGlobalToast('Aktarılacak taslak mesaj yok!', 'error');
            return;
        }
        
        let hasClearCommand = false;
        const toInsert = [];
        
        for (const m of unpushed) {
            if (m.msg.startsWith('[GEÇMİŞİ SİL')) {
                hasClearCommand = true;
                if (m.msg === '[GEÇMİŞİ SİLME KOMUTU]') {
                    await supabase.from('tv_chat').delete().neq('id', 0);
                } else {
                    const serversStr = m.msg.split(':')[1]?.replace(']', '');
                    if (serversStr) {
                        const servers = serversStr.split(',');
                        await supabase.from('tv_chat').delete().in('channel_id', servers);
                    }
                }
            } else {
                toInsert.push({
                    channel_id: 'tr',
                    user_id: `bot_${m.user.toLowerCase()}_${Math.random().toString(36).substring(7)}`,
                    username: m.user,
                    message: m.msg,
                    role: m.role
                });
            }
        }

        if (toInsert.length > 0) {
            const { error } = await supabase.from('tv_chat').insert(toInsert);
            if (error) {
                triggerGlobalToast('Aktarım başarısız oldu!', 'error');
                return;
            }
        }
        
        triggerGlobalToast(`Taslak işlemler canlıya başarıyla aktarıldı!`, 'success');
        
        if (hasClearCommand) {
            setMessages([]); // Eğer temizleme komutu varsa tüm paneli sıfırla
        } else {
            setMessages(messages.map(m => ({ ...m, isPushed: true })));
        }
    };

    const handleSendAnnounce = (isDraft = false) => {
        if (!announceText.trim()) return;
        if (isDraft) {
            setMessages(prev => [...prev, { id: Date.now(), user: 'SİSTEM DUYURUSU', role: 'system', msg: announceText, isPushed: false }]);
            triggerGlobalToast('Mega duyuru taslağa eklendi!', 'info');
        } else {
            pushToSupabase('SİSTEM DUYURUSU', 'system', announceText);
            triggerGlobalToast('Mega duyuru canlıya yayınlandı!', 'success');
        }
        setAnnounceText('');
    };

    const handleClearLiveHistory = () => {
        setShowClearHistorySettings(true);
    };

    const handleSendBotMsg = (isDraft = false) => {
        if (!chatInput.trim() || !selectedBotId) return;
        const sender = FIXED_BOTS.find(b => b.id === selectedBotId);
        if (!sender) return;
        const finalMsg = applyPersona ? applyBotPersona(chatInput, sender) : chatInput;
        
        if (isDraft) {
            setMessages(prev => [...prev, { id: Date.now(), user: sender.isim, role: sender.rol === 'VIP' ? 'vip' : 'user', msg: finalMsg, isPushed: false }]);
            triggerGlobalToast(`${sender.isim} adına mesaj taslağa eklendi!`, 'info');
        } else {
            pushToSupabase(sender.isim, sender.rol === 'VIP' ? 'vip' : 'user', finalMsg);
            triggerGlobalToast(`${sender.isim} adına mesaj gönderildi!`, 'success');
        }
        setChatInput('');
    };

    const handleSendBigWin = (isDraft = false) => {
        const payload = { username: bigWinUser, game: bigWinGame, amount: bigWinAmount };
        const msg = `[BIG_WIN:${JSON.stringify(payload)}]`;
        if (isDraft) {
            setMessages(prev => [...prev, { id: Date.now(), user: 'Sistem', role: 'system', msg, isPushed: false }]);
            triggerGlobalToast('Büyük Kazanç taslağa eklendi!', 'info');
        } else {
            pushToSupabase('Sistem', 'system', msg);
            triggerGlobalToast('Büyük Kazanç duyurusu canlıya yayınlandı!', 'success');
        }
    };

    const handleAutoHype = (isDraft = false) => {
        const hypeMsgs = ["Oha efsane vurdu!", "Helal olsun beyler", "Bugün çok bereketli", "Admin bey drop var mı?", "Kasayı ikiye katladım harika!", "Sweet bonanza coştu", "Kupon efsane duruyor", "Bu site bir harika dostum"];
        let cumulativeDelay = 0;
        
        if (isDraft) {
            const newDrafts: any[] = [];
            for (let i = 0; i < botCount; i++) {
                let baseText = hypeMsgs[Math.floor(Math.random() * hypeMsgs.length)];
                const randomBot = FIXED_BOTS[Math.floor(Math.random() * FIXED_BOTS.length)];
                let finalMsg = applyBotPersona(baseText, randomBot);
                if (useEmojis && randomBot.emojiStyle === 'none') {
                    const emojis = ["🤑", "🔥", "🚀", "💰", "💸", "😎", "🎉", "👑"];
                    finalMsg += " " + emojis[Math.floor(Math.random() * emojis.length)];
                }
                newDrafts.push({ id: Date.now() + i, user: randomBot.isim, role: randomBot.rol === 'VIP' ? 'vip' : 'user', msg: finalMsg, isPushed: false });
            }
            setMessages(prev => [...prev, ...newDrafts]);
            triggerGlobalToast(`${botCount} adet Hype Botu taslağa eklendi!`, 'info');
        } else {
            for (let i = 0; i < botCount; i++) {
                cumulativeDelay += Math.floor(Math.random() * 2500) + 1500;
                setTimeout(() => {
                    let baseText = hypeMsgs[Math.floor(Math.random() * hypeMsgs.length)];
                    const randomBot = FIXED_BOTS[Math.floor(Math.random() * FIXED_BOTS.length)];
                    let finalMsg = applyBotPersona(baseText, randomBot);
                    if (useEmojis && randomBot.emojiStyle === 'none') {
                        const emojis = ["🤑", "🔥", "🚀", "💰", "💸", "😎", "🎉", "👑"];
                        finalMsg += " " + emojis[Math.floor(Math.random() * emojis.length)];
                    }
                    pushToSupabase(randomBot.isim, randomBot.rol === 'VIP' ? 'vip' : 'user', finalMsg);
                }, cumulativeDelay);
            }
            triggerGlobalToast(`${botCount} adet Hype Botu canlıya aktarılıyor...`, 'success');
        }
    };

    const triggerRain = () => {
        setIsRaining(true);
        triggerGlobalToast('Sohbete Para Yağmuru (Drop) Başlatıldı!', 'success');
        pushToSupabase('Sistem', 'system', "👑 KRAL SOHBETE 5,000₺ YAĞDIRDI! AKTİF OLANLAR KAZANDI! 💸");
        setTimeout(() => setIsRaining(false), 5000);
    };

    const navItems = [
        { id: 'bots', label: 'Kukla Ustası', icon: Bot, color: '#38bdf8' },
        { id: 'godmode', label: 'God Mode', icon: Crosshair, color: '#fbbf24' },
        { id: 'hype', label: 'Oto Hype Motoru', icon: Zap, color: '#00ff88' },
        { id: 'announce', label: 'Mega Duyuru', icon: Megaphone, color: '#eab308' },
        { id: 'bigwin', label: 'Sahte Kazanç', icon: Trophy, color: '#f472b6' },
        { id: 'tools', label: 'Yönetim Araçları', icon: Settings, color: '#a855f7' }
    ];

    return (
        <div className="fixed inset-0 z-[999999] flex overflow-hidden bg-[#0a0f16] pointer-events-auto">
            {/* Animated BG Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-black pointer-events-none"></div>
            
            {/* Main Content Layout */}
            <div className="flex-1 flex flex-col relative z-10 w-full h-full">
                
                {/* Top Header */}
                <div className="h-16 shrink-0 bg-[#0b0d14] border-b border-white/5 flex items-center justify-between px-8 z-50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                            <Crown className="w-5 h-5 text-zinc-300 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                        </div>
                        <div>
                            <h1 className="text-white text-base font-black tracking-widest uppercase bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent">VIP Komuta Merkezi</h1>
                            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Sohbet Yönetim Paneli</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handlePushToLive} 
                            className="h-10 px-6 flex items-center gap-2 rounded-xl bg-[#00E5FF] hover:bg-[#00E5FF] text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                        >
                            <UploadCloud className="w-4 h-4" /> 
                            PUSHLA ({messages.filter(m => !m.isPushed).length})
                        </button>
                        
                        <div className="w-px h-8 bg-white/10 mx-2"></div>
                        
                        <button onClick={onClose} className="w-10 h-10 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 flex items-center justify-center transition-colors border border-rose-500/20">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Dashboard Area */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* Left Sidebar Menu */}
                    <div className="w-64 shrink-0 bg-[#0b0d14]/80 border-r border-white/5 py-6 flex flex-col z-20 backdrop-blur-md">
                        <div className="px-6 mb-4">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-3">PANEL MENÜSÜ</p>
                        </div>
                        <div className="flex-1 flex flex-col gap-1 px-4">
                            {navItems.map(item => {
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-white/10 text-white shadow-inner' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}
                                    >
                                        <item.icon className="w-4 h-4" style={{ color: isActive ? item.color : undefined }} />
                                        {item.label}
                                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }}></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Workspace Area */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-4xl mx-auto">
                            
                            {/* KUKLA USTASI TAB */}
                            {activeTab === 'bots' && (
                                <div className="bg-[#11131a] border border-[#38bdf8]/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Bot className="w-48 h-48 text-[#38bdf8]" /></div>
                                    <div className="relative z-10 flex-1">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 flex items-center justify-center">
                                                <Bot className="w-5 h-5 text-[#38bdf8]" />
                                            </div>
                                            <div>
                                                <h2 className="text-white font-black text-lg tracking-widest uppercase">Kukla Ustası</h2>
                                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">İstediğiniz botun yerine geçip mesja gönderin</p>
                                            </div>
                                        </div>
                                        
                                        {selectedBotId && (
                                            <div className="bg-[#38bdf8]/10 border border-[#38bdf8]/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                                                <span className="text-sm text-zinc-300">Aktif Seçili Bot: <strong className="text-[#38bdf8] uppercase text-base">{FIXED_BOTS.find(b => b.id === selectedBotId)?.isim}</strong></span>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                            {FIXED_BOTS.map(bot => {
                                                const isSelected = selectedBotId === bot.id;
                                                const isVip = bot.rol === 'VIP';
                                                return (
                                                    <div key={bot.id} onClick={() => setSelectedBotId(isSelected ? null : bot.id)} className={`relative group p-4 rounded-xl border transition-all cursor-pointer flex flex-col items-center text-center ${isSelected ? 'bg-[#38bdf8]/10 border-[#38bdf8]/50 shadow-[0_0_20px_rgba(56,189,248,0.15)] scale-[1.02]' : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-black/60'}`}>
                                                        <div className="w-12 h-12 mb-3 rounded-xl flex items-center justify-center font-black text-xl shadow-inner" style={{ backgroundColor: `${bot.avatarRenk}20`, color: bot.avatarRenk }}>
                                                            {bot.isim.charAt(0)}
                                                        </div>
                                                        <div className="font-bold text-sm text-white mb-1 w-full truncate px-2">{bot.isim}</div>
                                                        <div className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isVip ? 'text-zinc-300' : 'text-zinc-500'}`}>{bot.rol}</div>
                                                        <div className="text-[10px] text-zinc-400 line-clamp-2 px-1">{bot.karakter}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        
                                        <div className={`transition-all duration-300 overflow-hidden ${selectedBotId ? 'opacity-100 max-h-[200px]' : 'opacity-0 max-h-0'}`}>
                                            <div className="relative flex items-center bg-black/60 rounded-xl border border-white/10 shadow-inner overflow-hidden">
                                                <input 
                                                    type="text" 
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSendBotMsg(false)}
                                                    placeholder={`${FIXED_BOTS.find(b => b.id === selectedBotId)?.isim} olarak mesaj yazın...`}
                                                    className="w-full bg-transparent border-none py-5 pl-6 pr-44 text-base text-[#38bdf8] placeholder:text-zinc-600 focus:outline-none"
                                                />
                                                <div className="absolute right-2 flex items-center gap-2">
                                                    <button onClick={() => handleSendBotMsg(true)} className="h-10 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors text-[10px] font-bold tracking-wider uppercase border border-white/5">
                                                        TASLAK
                                                    </button>
                                                    <button onClick={() => handleSendBotMsg(false)} className="h-10 px-6 rounded-lg bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black flex items-center justify-center transition-colors font-black text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                                                        YAYINLA <Send className="w-3.5 h-3.5 ml-2" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GOD MODE TAB */}
                            {activeTab === 'godmode' && (
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
                                   
                                   {/* SÜTUN 1: GERÇEK ÜYE AVCISI & HEDEFLEME */}
                                   <div className="xl:col-span-1 bg-[#11131a] border border-[#fbbf24]/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col">
                                      <div className="absolute inset-0 bg-gradient-to-b from-[#fbbf24]/5 to-transparent pointer-events-none"></div>
                                      <div className="flex items-center gap-3 mb-4 relative z-10">
                                         <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/10 flex items-center justify-center border border-[#fbbf24]/30 shrink-0">
                                            <Crosshair className="w-5 h-5 text-[#fbbf24]" />
                                         </div>
                                         <div>
                                            <h3 className="text-white font-black tracking-widest uppercase text-sm">Gerçek Üye Avcısı</h3>
                                            <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Tıkla ve Hedef Al</p>
                                         </div>
                                      </div>
                                      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 relative z-10 pr-2 pb-4">
                                         {[
                                            { user: 'Ahmet_34', game: 'Sweet Bonanza', action: 'Kayıpta, sinirli', color: 'rose' },
                                            { user: 'KralVeli', game: 'Canlı Rulet', action: '15.000₺ kazandı', color: 'emerald' },
                                            { user: 'SelimBey', game: 'Gates of Olympus', action: 'Yeni deposit yaptı', color: 'blue' },
                                            { user: 'Canan99', game: 'Sohbet Odası', action: 'Sohbeti izliyor', color: 'zinc' },
                                            { user: 'BüyükOyuncu', game: 'Blackjack', action: 'Yüksek Bahis', color: 'purple' }
                                         ].map((u, i) => (
                                            <div key={i} className="flex flex-col gap-2">
                                                <div 
                                                    onClick={() => setSelectedWhale(selectedWhale === u.user ? null : u.user)}
                                                    className={`bg-black/40 border rounded-xl p-3 flex justify-between items-center transition-all cursor-pointer group ${selectedWhale === u.user ? 'border-[#fbbf24]/50 bg-[#fbbf24]/5' : 'border-white/5 hover:border-[#fbbf24]/30 hover:bg-white/5'}`}
                                                >
                                                   <div>
                                                      <div className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${selectedWhale === u.user ? 'text-[#fbbf24]' : 'text-white group-hover:text-[#fbbf24]'}`}>
                                                          {u.user} 
                                                          <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                                                      </div>
                                                      <div className="text-[10px] text-zinc-500 mt-0.5">{u.game}</div>
                                                   </div>
                                                   <div className={`text-[9px] font-black uppercase tracking-widest text-${u.color}-400 bg-${u.color}-500/10 border border-${u.color}-500/20 px-2 py-1 rounded shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]`}>
                                                      {u.action}
                                                   </div>
                                                </div>
                                                
                                                {selectedWhale === u.user && (
                                                    <div className="pl-4 pr-1 animate-in slide-in-from-top-2 duration-300">
                                                        <div className="bg-[#0b0d14] rounded-lg border border-white/5 p-3 space-y-2 relative">
                                                            <div className="absolute -left-4 top-4 w-4 h-px bg-white/10"></div>
                                                            <div className="absolute -left-4 top-0 bottom-4 w-px bg-white/10"></div>
                                                            <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-2 border-b border-white/5 pb-2">Hedef: {u.user}</p>
                                                            <button onClick={() => { pushToSupabase('CengizHan', 'user', `@${u.user} kanka ben de demin 5k ezdim ama az önce Sweet Bonanza'da tek spinde 20k aldım, şans dönüyor sabret.`); triggerGlobalToast('Moral botu ateşlendi!', 'success'); setSelectedWhale(null); }} className="w-full text-left p-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-[10px] text-indigo-400 font-bold transition-colors flex items-center gap-2">
                                                                <Bot className="w-3 h-3" /> Moral Verici Bot Gönder
                                                            </button>
                                                            <button onClick={() => { pushToSupabase('SlotMaster', 'user', `@${u.user} oha harika vurmuşsun kral, hangi oyunda vurdun taktik ver`); triggerGlobalToast('Kıskançlık botu ateşlendi!', 'success'); setSelectedWhale(null); }} className="w-full text-left p-2 rounded bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-emerald-500/20 text-[10px] text-[#00E5FF] font-bold transition-colors flex items-center gap-2">
                                                                <Zap className="w-3 h-3" /> Kıskançlık Tufanı Yarat
                                                            </button>
                                                            <button onClick={() => { triggerGlobalToast('Ghost Mode ile X-Ray paneli yakında!', 'info'); }} className="w-full text-left p-2 rounded bg-zinc-500/10 hover:bg-zinc-500/20 border border-zinc-500/20 text-[10px] text-zinc-400 font-bold transition-colors flex items-center gap-2">
                                                                <Eye className="w-3 h-3" /> Ghost Mode İncele
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                         ))}
                                      </div>
                                   </div>

                                   {/* SÜTUN 2: MAKROLAR & OTO-TETİKLEYİCİLER */}
                                   <div className="xl:col-span-1 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-4">
                                      
                                      {/* MAKRO SENARYOLAR */}
                                      <div className="bg-[#11131a] border border-rose-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden shrink-0">
                                         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none"></div>
                                         <div className="flex items-center gap-3 mb-4 relative z-10">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center border border-rose-500/30 shrink-0">
                                               <Zap className="w-5 h-5 text-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]" />
                                            </div>
                                            <div>
                                               <h3 className="text-white font-black tracking-widest uppercase text-sm">Makrolar</h3>
                                               <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Manuel Yönlendirme</p>
                                            </div>
                                         </div>
                                         <div className="flex flex-col gap-3 relative z-10">
                                            <button onClick={() => { 
                                                pushToSupabase('Ahmet33', 'user', 'oha beee inanılmaz vurdum sonunda!!'); 
                                                setTimeout(() => pushToSupabase('Veli_Can', 'user', 'kasa katlandı valla helal olsun'), 1800); 
                                                setTimeout(() => pushToSupabase('ZenginBey', 'user', 'hocam bende 10k aldım çekim verdim bile'), 4500); 
                                                setTimeout(() => pushToSupabase('CemalAbi', 'user', 'vay be şansa bak'), 7200); 
                                                setTimeout(() => pushToSupabase('EfeCan', 'user', 'ben de giriyorum hemen!!'), 9000); 
                                                triggerGlobalToast('FOMO Makrosu ateşlendi!', 'success'); 
                                            }} className="bg-[#00E5FF]/5 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#00E5FF]/10 p-3 rounded-xl flex flex-col gap-1 transition-all group text-left shadow-lg">
                                               <div className="text-[#00E5FF] font-black tracking-wider uppercase text-xs">FOMO Tetikleyici</div>
                                               <div className="text-[10px] text-zinc-400 font-medium">5 bot aynı anda "İnanılmaz vurdu!" yazar.</div>
                                            </button>
                                            <button onClick={() => { 
                                                pushToSupabase('Kemal_99', 'user', 'şans işi kardeşim ben demin aldım sabret'); 
                                                setTimeout(() => pushToSupabase('AyşeT', 'user', 'aynen son spinde bende 10x yakaladım boş yapma'), 2500); 
                                                setTimeout(() => pushToSupabase('KralAdam', 'user', 'kasa katlamak kolay değil sabredicen'), 5000); 
                                                triggerGlobalToast('İsyan Bastırıcı Makrosu ateşlendi!', 'success'); 
                                            }} className="bg-rose-500/5 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/10 p-3 rounded-xl flex flex-col gap-1 transition-all group text-left shadow-lg">
                                               <div className="text-rose-400 font-black tracking-wider uppercase text-xs">İsyan Bastırıcı</div>
                                               <div className="text-[10px] text-zinc-400 font-medium">Küfredene 3 bot "Ben demin aldım" der.</div>
                                            </button>
                                            <button onClick={() => { 
                                                setTimeout(() => pushToSupabase('CryptoWhale_ETH', 'VIP', '5.000$ yatırdım, VIP manager süper bonus verdi bakalım ne olacak 🚀'), 1000); 
                                                setTimeout(() => pushToSupabase('Ahmet33', 'user', 'oha 5000 dolar mı'), 3500); 
                                                setTimeout(() => pushToSupabase('CemalAbi', 'user', 'balina geldi beyler savulun'), 5500); 
                                                triggerGlobalToast('Sahte Balina Makrosu ateşlendi!', 'success'); 
                                            }} className="bg-blue-500/5 border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/10 p-3 rounded-xl flex flex-col gap-1 transition-all group text-left shadow-lg">
                                               <div className="text-blue-400 font-black tracking-wider uppercase text-xs">Sahte Balina</div>
                                               <div className="text-[10px] text-zinc-400 font-medium">Sohbete "5.000$ yatırdım" elit botu girer.</div>
                                            </button>
                                         </div>
                                      </div>

                                      {/* OTO TETİKLEYİCİLER */}
                                      <div className="bg-[#11131a] border border-blue-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex-1">
                                         <div className="flex items-center gap-3 mb-4 relative z-10">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shrink-0">
                                               <Activity className="w-5 h-5 text-blue-500" />
                                            </div>
                                            <div>
                                               <h3 className="text-white font-black tracking-widest uppercase text-sm">Oto-Tetik</h3>
                                               <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Yapay Zeka Kuralları</p>
                                            </div>
                                         </div>
                                         <div className="space-y-4 relative z-10">
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                                <div>
                                                    <div className="text-[11px] font-bold text-white mb-0.5">3 Üst Üste Kayıp</div>
                                                    <div className="text-[9px] text-zinc-500">İsyan bastırıcı bot devreye girsin</div>
                                                </div>
                                                <button onClick={() => setAutoTriggers(p => ({ ...p, lossLimit: !p.lossLimit }))} className={`w-10 h-5 rounded-full relative transition-colors ${autoTriggers.lossLimit ? 'bg-blue-500' : 'bg-white/10'}`}>
                                                    <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white transition-all ${autoTriggers.lossLimit ? 'left-5' : 'left-0.5'}`}></div>
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                                <div>
                                                    <div className="text-[11px] font-bold text-white mb-0.5">Sohbet 1dk Sessizse</div>
                                                    <div className="text-[9px] text-zinc-500">Balina botu gelip hype yaratsın</div>
                                                </div>
                                                <button onClick={() => setAutoTriggers(p => ({ ...p, silentChat: !p.silentChat }))} className={`w-10 h-5 rounded-full relative transition-colors ${autoTriggers.silentChat ? 'bg-blue-500' : 'bg-white/10'}`}>
                                                    <div className={`absolute top-0.5 bottom-0.5 w-4 rounded-full bg-white transition-all ${autoTriggers.silentChat ? 'left-5' : 'left-0.5'}`}></div>
                                                </button>
                                            </div>
                                         </div>
                                      </div>
                                   </div>

                                   {/* SÜTUN 3: MATRIX & KRİZ SİMÜLASYONU */}
                                   <div className="xl:col-span-1 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-4">
                                       
                                      {/* MATRIX MODE */}
                                      <div className="bg-[#11131a] border border-cyan-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden shrink-0">
                                         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] mix-blend-screen pointer-events-none"></div>
                                         <div className="flex items-center gap-3 mb-4 relative z-10">
                                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 shrink-0">
                                               <Activity className="w-5 h-5 text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
                                            </div>
                                            <div>
                                               <h3 className="text-white font-black tracking-widest uppercase text-sm">Matrix Mode</h3>
                                               <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">İstatistikleri Oynat</p>
                                            </div>
                                         </div>
                                         
                                         <div className="flex flex-col gap-4 relative z-10">
                                            <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden group">
                                               <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-1">Anlık Gözüken Online</div>
                                               <div className="text-3xl font-black text-cyan-400 tracking-tighter drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-baseline gap-1">
                                                  {matrixValues.online.toLocaleString('tr-TR')} <span className="text-[10px] text-cyan-500/50 animate-pulse">●</span>
                                               </div>
                                               <div className="flex gap-2 mt-3 w-full">
                                                  <button onClick={() => setMatrixValues(p => ({ ...p, online: p.online - 1000 }))} className="flex-1 bg-white/5 hover:bg-white/10 py-1.5 rounded-lg text-[10px] font-bold text-white transition-colors border border-white/5">-1K</button>
                                                  <button onClick={() => setMatrixValues(p => ({ ...p, online: p.online + 1000 }))} className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 py-1.5 rounded-lg text-[10px] font-bold transition-colors border border-cyan-500/30">+1K</button>
                                               </div>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden group">
                                               <div className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-1">Dağıtılan Sahte Ödül</div>
                                               <div className="text-3xl font-black text-[#00E5FF] tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">₺{matrixValues.reward.toFixed(1)}M</div>
                                               <div className="flex gap-2 mt-3 w-full">
                                                  <button onClick={() => setMatrixValues(p => ({ ...p, reward: 0 }))} className="flex-1 bg-white/5 hover:bg-white/10 py-1.5 rounded-lg text-[10px] font-bold text-white transition-colors border border-white/5">Sıfırla</button>
                                                  <button onClick={() => setMatrixValues(p => ({ ...p, reward: p.reward + 1.5 }))} className="flex-1 bg-[#00E5FF]/20 hover:bg-[#00E5FF]/40 text-[#00E5FF] py-1.5 rounded-lg text-[10px] font-bold transition-colors border border-emerald-500/30">Arttır</button>
                                               </div>
                                            </div>
                                         </div>
                                      </div>

                                      {/* KRİZ / COŞKU SİMÜLASYONU */}
                                      <div className="bg-[#11131a] border border-fuchsia-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex-1">
                                         <div className="flex items-center gap-3 mb-4 relative z-10">
                                            <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/30 shrink-0">
                                               <Megaphone className="w-5 h-5 text-fuchsia-500" />
                                            </div>
                                            <div>
                                               <h3 className="text-white font-black tracking-widest uppercase text-sm">Kriz Masası</h3>
                                               <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider">Sistem Çöktü İllüzyonu</p>
                                            </div>
                                         </div>
                                         <div className="space-y-3 relative z-10">
                                            <button onClick={() => { pushToSupabase('Sistem', 'system', '[SİSTEM UYARISI] Aşırı kazanç yoğunluğu sebebiyle para çekme işlemlerinde 5 dakika gecikme olabilir. Anlayışınız için teşekkürler.'); triggerGlobalToast('Sistem yoğunluğu uyarısı atıldı!', 'success'); }} className="w-full text-left p-3 rounded-xl bg-fuchsia-500/5 hover:bg-fuchsia-500/10 border border-fuchsia-500/20 transition-all flex flex-col gap-1">
                                                <div className="text-fuchsia-400 font-black text-[11px] uppercase tracking-wider">Aşırı Kazanç Gecikmesi</div>
                                                <div className="text-[9px] text-zinc-400">Herkese çok kazandıkları için çekimlerin geciktiğini söyler.</div>
                                            </button>
                                            <button onClick={() => setShowRainControl(true)} className="w-full text-left p-3 rounded-xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 transition-all flex flex-col gap-1">
                                                 <div className="text-zinc-300 font-black text-[11px] uppercase tracking-wider">Gerçek Para Yağmuru Yarat</div>
                                                 <div className="text-[9px] text-zinc-400">Gelişmiş kontrol paneli ile aktif kullanıcılara yağmur başlat.</div>
                                            </button>
                                         </div>
                                      </div>

                                   </div>
                                </div>
                            )}

                            {/* OTO HYPE TAB */}
                            {activeTab === 'hype' && (
                                <div className="bg-[#11131a] border border-[#00ff88]/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Zap className="w-48 h-48 text-[#00ff88]" /></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-[#00ff88]" />
                                            </div>
                                            <div>
                                                <h2 className="text-white font-black text-lg tracking-widest uppercase">Oto Hype Motoru</h2>
                                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Sohbete otomatik destek mesajları atar</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col gap-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Bot Sayısı (1-50)</label>
                                                    <input type="number" min="1" max="50" value={botCount} onChange={e => setBotCount(parseInt(e.target.value) || 1)} className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-5 text-base text-[#00ff88] font-black focus:outline-none focus:border-[#00ff88]/30 transition-colors" />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Emoji Modu</label>
                                                    <button onClick={() => setUseEmojis(!useEmojis)} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border text-sm font-bold transition-all h-[58px] ${useEmojis ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]' : 'bg-black/40 border-white/5 text-zinc-400'}`}>
                                                        {useEmojis ? 'AKTİF' : 'KAPALI'}
                                                        <div className={`w-3.5 h-3.5 rounded-full ${useEmojis ? 'bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.6)]' : 'bg-zinc-600'}`}></div>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-4">
                                                <button onClick={() => handleAutoHype(true)} className="py-4 bg-zinc-800 border border-white/5 hover:bg-zinc-700 text-zinc-300 font-bold tracking-widest text-xs uppercase rounded-xl transition-all flex justify-center items-center">
                                                    Taslağa Al
                                                </button>
                                                <button onClick={() => handleAutoHype(false)} className="py-4 bg-[#00ff88]/10 border border-[#00ff88]/50 hover:bg-[#00ff88] hover:text-black text-[#00ff88] font-black tracking-widest text-xs uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.1)] flex justify-center items-center gap-2">
                                                    <Zap className="w-4 h-4" /> CANLIYA AT
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MEGA DUYURU TAB */}
                            {activeTab === 'announce' && (
                                <div className="bg-[#11131a] border border-yellow-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Megaphone className="w-48 h-48 text-zinc-300" /></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                                <Megaphone className="w-5 h-5 text-zinc-300" />
                                            </div>
                                            <div>
                                                <h2 className="text-white font-black text-lg tracking-widest uppercase">Mega Duyuru</h2>
                                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Tüm oyuncuların göreceği sistem duyurusu</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="bg-black/40 border border-white/5 rounded-xl p-2">
                                                <textarea 
                                                    value={announceText}
                                                    onChange={e => setAnnounceText(e.target.value)}
                                                    className="w-full bg-transparent p-4 text-base text-zinc-300 font-bold focus:outline-none min-h-[150px] placeholder:text-zinc-300/30 resize-none"
                                                    placeholder="Herkese açık duyuru yazın..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={() => handleSendAnnounce(true)} className="py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase rounded-xl transition-all border border-white/5">
                                                    Taslak
                                                </button>
                                                <button onClick={() => handleSendAnnounce(false)} className="py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:opacity-90 text-black font-black text-xs uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                                    YAYINLA
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SAHTE KAZANÇ TAB */}
                            {activeTab === 'bigwin' && (
                                <div className="bg-[#11131a] border border-[#f472b6]/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Trophy className="w-48 h-48 text-[#f472b6]" /></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-[#f472b6]/10 flex items-center justify-center">
                                                <Trophy className="w-5 h-5 text-[#f472b6]" />
                                            </div>
                                            <div>
                                                <h2 className="text-white font-black text-lg tracking-widest uppercase">Sahte Kazanç (Bot)</h2>
                                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Sohbete yapay kazanç duyurusu ekle</p>
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">Kullanıcı Adı</label>
                                                <input type="text" placeholder="Kullanıcı Adı" value={bigWinUser} onChange={e => setBigWinUser(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-5 text-sm text-white focus:border-[#f472b6]/50 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">Oynanan Oyun</label>
                                                <input type="text" placeholder="Oyun" value={bigWinGame} onChange={e => setBigWinGame(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-5 text-sm text-white focus:border-[#f472b6]/50 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2 block">Kazanılan Miktar</label>
                                                <input type="text" placeholder="Miktar" value={bigWinAmount} onChange={e => setBigWinAmount(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-xl py-4 px-5 text-sm text-[#00ff88] font-black focus:border-[#f472b6]/50 outline-none" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-6">
                                                <button onClick={() => handleSendBigWin(true)} className="py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase rounded-xl transition-all border border-white/5">
                                                    Taslak
                                                </button>
                                                <button onClick={() => handleSendBigWin(false)} className="py-4 bg-[#f472b6]/10 border border-[#f472b6]/30 hover:bg-[#f472b6] hover:text-black text-[#f472b6] font-black text-xs uppercase rounded-xl transition-all">
                                                    YAYINLA
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* YÖNETİM ARAÇLARI TAB */}
                            {activeTab === 'tools' && (
                                <div className="bg-[#11131a] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Settings className="w-48 h-48 text-zinc-400" /></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                <Settings className="w-5 h-5 text-zinc-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-white font-black text-lg tracking-widest uppercase">Yönetim Araçları</h2>
                                                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Sohbeti kilitle, geçmişi sil, etkinlik yap</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Economy */}
                                            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                                <Crown className="w-10 h-10 text-zinc-300 mb-4 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                                <h3 className="text-zinc-300 font-bold text-sm uppercase mb-2">Sohbet Yağmuru</h3>
                                                <p className="text-xs text-zinc-400 mb-6 px-4">Aktif kullanıcılara rastgele bakiye (drop) dağıtır.</p>
                                                <button onClick={triggerRain} disabled={isRaining} className="w-full py-4 bg-amber-500/10 border border-amber-500/30 text-zinc-300 hover:bg-amber-500 hover:text-black font-black text-xs uppercase rounded-xl transition-all disabled:opacity-50">
                                                    {isRaining ? 'YAĞIYOR...' : 'PARA YAĞDIR'}
                                                </button>
                                            </div>
                                            
                                            {/* Chat Control */}
                                            <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                                <Trash2 className="w-10 h-10 text-rose-500 mb-4" />
                                                <h3 className="text-rose-500 font-bold text-sm uppercase mb-2">Canlı Geçmiş</h3>
                                                <p className="text-xs text-zinc-400 mb-6 px-4">Global sohbet geçmişini herkes için kalıcı siler.</p>
                                                <button onClick={handleClearLiveHistory} className="w-full py-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-black text-xs uppercase rounded-xl transition-all">
                                                    GECMİŞİ SİL
                                                </button>
                                            </div>
                                            
                                            {/* Lock Chat */}
                                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center md:col-span-2">
                                                {isLocked ? <Lock className="w-10 h-10 text-rose-500 mb-4" /> : <Unlock className="w-10 h-10 text-[#00E5FF] mb-4" />}
                                                <h3 className="text-white font-bold text-sm uppercase mb-2">Sohbet Kilidi</h3>
                                                <p className="text-xs text-zinc-400 mb-6 px-4">VIP harici kullanıcıların global sohbete yazmasını engeller.</p>
                                                <button onClick={() => setIsLocked(!isLocked)} className={`w-full max-w-sm mx-auto py-4 font-black text-xs uppercase rounded-xl border transition-all ${isLocked ? 'bg-rose-500/20 border-rose-500/40 text-rose-500' : 'bg-[#00E5FF]/10 border-emerald-500/30 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black'}`}>
                                                    {isLocked ? 'KİLİTLİ (AÇMAK İÇİN TIKLA)' : 'SOHBETİ KİLİTLE'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Rain Modal (KralChatModal Overlay) */}
            {showRainControl && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
                    zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
                }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', animation: 'scaleIn 0.3s ease-out' }}>
                        <button 
                            onClick={() => setShowRainControl(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', zIndex: 10 }}
                        >
                            <X size={20} />
                        </button>
                        <AdminRainControl adminId={'KRAL_KOMUTA'} />
                    </div>
                </div>
            )}

            {/* Clear History Confirmation Modal */}
            {showClearHistorySettings && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
                    zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
                }}>
                    <div className="bg-[#1a1d24] border border-rose-500/30 rounded-2xl p-6 w-full max-w-[400px] shadow-[0_0_50px_rgba(244,63,94,0.1)] relative" style={{ animation: 'scaleIn 0.3s ease-out' }}>
                        <button 
                            onClick={() => setShowClearHistorySettings(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <h2 className="text-white font-black text-lg">Geçmişi Sil</h2>
                                <p className="text-zinc-500 text-xs">Hangi sunucuların sohbeti temizlensin?</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mb-8">
                            {[
                                { id: 'global', name: 'Global Server' },
                                { id: 'tr', name: 'Türkiye' },
                                { id: 'br', name: 'Brasil' },
                                { id: 'ar', name: 'Argentina' }
                            ].map(ch => (
                                <label key={ch.id} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-[#11131a] hover:bg-white/5 cursor-pointer transition-colors group">
                                    <span className="text-zinc-300 font-semibold text-sm group-hover:text-white transition-colors">{ch.name}</span>
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${selectedChannelsToClear.includes(ch.id) ? 'bg-rose-500 border-rose-500' : 'border-zinc-600 bg-black/50'}`}>
                                        {selectedChannelsToClear.includes(ch.id) && <X className="w-3 h-3 text-white" style={{ transform: 'rotate(45deg)' }} />}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={selectedChannelsToClear.includes(ch.id)} 
                                        onChange={() => toggleClearChannel(ch.id)}
                                        className="hidden" 
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowClearHistorySettings(false)} className="flex-1 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-sm transition-all">
                                İPTAL
                            </button>
                            <button onClick={confirmClearHistory} className="flex-[2] py-3.5 bg-rose-500 hover:bg-rose-400 text-white rounded-xl font-black text-sm shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all">
                                EMİNİM, SEÇİLİ SUNUCULARI SİL
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Right Pane: Live Chat Preview (Read-only view for Admin) */}
            <div className="w-[360px] shrink-0 flex flex-col bg-[#0b0e14] border-l border-white/5 relative z-40 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                <ModernChat 
                    open={true}
                    onClose={() => {}}
                    siteUser={{ role: 'admin' }} 
                    userRole="admin"
                    isMobile={false}
                    botsConfig={[]}
                    previewMessages={messages.filter(m => !m.isPushed).map(m => ({
                        id: `draft_${m.id}`,
                        user_id: `draft_${m.id}`,
                        username: m.user,
                        message: m.msg,
                        role: m.role,
                        created_at: new Date(m.id).toISOString(),
                        isDraft: true
                    }))}
                />
            </div>
        </div>
    );
}
