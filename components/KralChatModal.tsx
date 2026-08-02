import React, { useState, useEffect, useRef } from 'react';
import { X, Crown, Megaphone, Trash2, ShieldAlert, Lock, Unlock, Send, Shield, Zap, Activity, Bot, ChevronDown, Coins, Clock, Target, Gift, EyeOff, Star, UploadCloud } from 'lucide-react';
import { triggerGlobalToast } from './GlobalToaster';
import { supabase } from '../utils/supabase';

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

const getUserColor = (username: string) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#38bdf8', '#818cf8', '#a78bfa', '#e879f9', '#f472b6'];
    return colors[Math.abs(hash) % colors.length];
};

const applyBotPersona = (text: string, bot: typeof FIXED_BOTS[0] | null) => {
    if (!bot) return text;
    
    let processedText = text;

    // 1. Typing Style (Metin Mutasyonu)
    if (bot.typingStyle === 'lazy_lower') {
        processedText = processedText.toLowerCase().replace(/[.,!?]/g, '');
    } else if (bot.typingStyle === 'caps_lock_rage') {
        processedText = processedText.toUpperCase() + '!!!';
    } else if (bot.typingStyle === 'boomer') {
        processedText = processedText.toLowerCase() + '....';
    } else if (bot.typingStyle === 'typo_maker') {
        // Simple typo: swap 2 random adjacent characters once if length > 4
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

    // 2. Slang Injection
    if (bot.slang.length > 0 && Math.random() > 0.4) {
        const randomSlang = bot.slang[Math.floor(Math.random() * bot.slang.length)];
        processedText = `${processedText} ${randomSlang}`;
    }

    // 3. Emoji Injection
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
    const [announceText, setAnnounceText] = useState('');
    const [chatInput, setChatInput] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [isSlowMode, setIsSlowMode] = useState(false);

    // Layout Tabs
    const [activeTab, setActiveTab] = useState<'management' | 'economy'>('management');

    // Bot Generator State
    const [botCount, setBotCount] = useState(3);
    const [useEmojis, setUseEmojis] = useState(false);
    
    // Bot Dashboard State
    const [selectedBotId, setSelectedBotId] = useState<number | null>(null);
    const [applyPersona, setApplyPersona] = useState(true);

    // Sniper Mode (Target User)
    const [targetUser, setTargetUser] = useState<{name: string, role: string, x: number, y: number} | null>(null);

    // Rain Effect
    const [isRaining, setIsRaining] = useState(false);

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!isOpen) return;
        // Otomatik rastgele sohbet botları test için durduruldu.
    }, [isOpen, isLocked]);

    if (!isOpen) return null;

    const handleSendAnnounce = () => {
        if (!announceText.trim()) return;
        setMessages(prev => [...prev, {
            id: Date.now(),
            user: 'SİSTEM DUYURUSU',
            role: 'system',
            msg: announceText,
            isPushed: false
        }]);
        triggerGlobalToast('Mega duyuru hazırlandı! Canlıya almak için PUSHLA tuşuna bas.', 'success');
        setAnnounceText('');
    };

    const handlePushToLive = async () => {
        const unpushed = messages.filter(m => !m.isPushed);
        if (unpushed.length === 0) {
            triggerGlobalToast('Aktarılacak yeni mesaj yok!', 'error');
            return;
        }

        const toInsert = unpushed.map(m => ({
            channel_id: '00000000-0000-0000-0000-000000000000', // TR Global Channel
            user_id: `bot_${m.user.toLowerCase()}_${Math.random().toString(36).substring(7)}`,
            username: m.user,
            message: m.msg,
            role: m.role
        }));

        const { error } = await supabase.from('tv_chat').insert(toInsert);
        if (error) {
            triggerGlobalToast('Aktarım başarısız oldu!', 'error');
            console.error(error);
        } else {
            triggerGlobalToast(`${toInsert.length} mesaj canlıya aktarıldı!`, 'success');
            setMessages(messages.map(m => ({ ...m, isPushed: true })));
        }
    };

    const handleClearLiveHistory = async () => {
        const { error } = await supabase.from('tv_chat').delete().eq('channel_id', '00000000-0000-0000-0000-000000000000');
        if (error) {
            triggerGlobalToast('Canlı geçmiş silinemedi!', 'error');
            console.error(error);
        } else {
            triggerGlobalToast('Sohbet geçmişi hem canlıda hem lokalde silindi!', 'success');
            setMessages([]);
        }
    };

    const handleSendMsg = () => {
        if (!chatInput.trim()) return;
        const sender = selectedBotId ? FIXED_BOTS.find(b => b.id === selectedBotId) || null : null;
        const senderName = sender ? sender.isim : 'Yönetici';
        const senderRole = sender ? (sender.rol === 'VIP' ? 'vip' : 'user') : 'admin';
        
        const finalMsg = (applyPersona && sender) ? applyBotPersona(chatInput, sender) : chatInput;
        
        setMessages(prev => [...prev, {
            id: Date.now(),
            user: senderName,
            role: senderRole,
            msg: finalMsg,
            isPushed: false
        }]);
        setChatInput('');
        triggerGlobalToast(`${senderName} adına mesaj hazırlandı!`, 'success');
    };

    const handleAutoHype = () => {
        const hypeMsgs = ["Oha efsane vurdu!", "Helal olsun beyler", "Bugün çok bereketli", "Admin bey drop var mı?", "Kasayı ikiye katladım harika!", "Sweet bonanza coştu", "Kupon efsane duruyor", "Bu site bir harika dostum"];
        
        let cumulativeDelay = 0;
        
        for (let i = 0; i < botCount; i++) {
            cumulativeDelay += Math.floor(Math.random() * 2500) + 1500; // 1.5s to 4.0s random delay
            
            setTimeout(() => {
                let baseText = hypeMsgs[Math.floor(Math.random() * hypeMsgs.length)];
                const randomBot = FIXED_BOTS[Math.floor(Math.random() * FIXED_BOTS.length)];
                
                let finalMsg = applyBotPersona(baseText, randomBot);
                // Optionally add normal emojis if useEmojis is true and it wasn't a spammer/money
                if (useEmojis && randomBot.emojiStyle === 'none') {
                    const emojis = ["🤑", "🔥", "🚀", "💰", "💸", "😎", "🎉", "👑"];
                    finalMsg += " " + emojis[Math.floor(Math.random() * emojis.length)];
                }
                
                setMessages(prev => [...prev, {
                    id: Date.now() + i,
                    user: randomBot.isim,
                    role: randomBot.rol === 'VIP' ? 'vip' : 'user',
                    msg: finalMsg,
                    isPushed: false
                }]);
            }, cumulativeDelay);
        }
        triggerGlobalToast(`${botCount} adet Hype Botu sohbete aktarılıyor...`, 'success');
    };

    const triggerRain = () => {
        setIsRaining(true);
        triggerGlobalToast('Sohbete Para Yağmuru (Drop) Başlatıldı!', 'success');
        
        // Add System Announcement
        setMessages(prev => [...prev, {
            id: Date.now(),
            user: 'Sistem',
            role: 'system',
            msg: "👑 KRAL SOHBETE 5,000₺ YAĞDIRDI! AKTİF OLANLAR KAZANDI! 💸"
        }]);

        setTimeout(() => setIsRaining(false), 5000);
    };

    const handleUserClick = (e: React.MouseEvent, user: string, role: string) => {
        if (role === 'admin' || role === 'system') return; // Cannot target system/admin
        setTargetUser({
            name: user,
            role,
            x: e.clientX,
            y: e.clientY
        });
    };

    const closeTargetMenu = () => setTargetUser(null);

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-0">
            {/* Top Bar (PUSHLA Area) */}
            <div className="absolute top-0 left-0 w-full h-[64px] bg-[#0A0D14]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-4 md:px-8 z-30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                    <h2 className="text-sm md:text-lg font-black text-white tracking-widest uppercase flex flex-col">
                        KRAL KOMUTA MERKEZİ
                    </h2>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4">
                    <button 
                        className="px-4 md:px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-[10px] md:text-[11px] rounded-full uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 animate-pulse hover:animate-none scale-90 md:scale-100"
                        onClick={handlePushToLive}
                    >
                        <UploadCloud className="w-4 h-4" />
                        PUSHLA (Canlıya Al)
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full h-full pt-[64px] flex flex-col xl:flex-row overflow-x-hidden overflow-y-auto xl:overflow-hidden bg-[#0A0D14]" onClick={closeTargetMenu}>
                
                {/* Left Pane: Kral Settings (God Mode) */}
                <div className="w-full xl:w-[380px] 2xl:w-[420px] shrink-0 border-b xl:border-b-0 xl:border-r border-white/5 bg-[#050505] flex flex-col xl:overflow-y-auto z-20 custom-scrollbar relative" onClick={e => e.stopPropagation()}>
                    
                    {/* Admin Tabs Navigation */}
                    <div className="flex items-center border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-30 p-3 gap-2">
                        <button 
                            onClick={() => setActiveTab('management')}
                            className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex flex-col items-center gap-1.5 ${activeTab === 'management' ? 'text-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.15)] border border-yellow-500/30' : 'text-zinc-500 border border-transparent hover:text-zinc-300 hover:bg-white/5'}`}
                        >
                            <ShieldAlert className="w-4 h-4" /> YÖNETİM
                        </button>
                        <button 
                            onClick={() => setActiveTab('economy')}
                            className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex flex-col items-center gap-1.5 ${activeTab === 'economy' ? 'text-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)] border border-amber-500/30' : 'text-zinc-500 border border-transparent hover:text-zinc-300 hover:bg-white/5'}`}
                        >
                            <Gift className="w-4 h-4" /> EKONOMİ
                        </button>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        
                        {/* TAB: MANAGEMENT */}
                        {activeTab === 'management' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                                {/* Mega Announce */}
                                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 relative group">
                                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFD700]/10 blur-[40px] rounded-full group-hover:bg-[#FFD700]/20 transition-colors pointer-events-none"></div>
                                    <h3 className="text-sm font-black text-[#FFD700] uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Megaphone className="w-4 h-4" /> Mega Duyuru (Hazırla)
                                    </h3>
                                    <textarea 
                                        value={announceText}
                                        onChange={(e) => setAnnounceText(e.target.value)}
                                        placeholder="Duyuruyu hazırla, yukarıdan PUSHLA tuşuna bastığında sohbete fırlar..."
                                        className="w-full bg-[#111216]/50 border border-white/5 rounded-xl p-4 text-sm text-yellow-500 placeholder:text-yellow-500/20 focus:outline-none focus:border-[#FFD700]/50 transition-colors resize-none h-24 shadow-inner"
                                    ></textarea>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold max-w-[200px]">Not: "PUSHLA" butonuna basılana kadar kimse görmez.</p>
                                        <button 
                                            onClick={handleSendAnnounce}
                                            className="px-4 py-2 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30 hover:border-[#FFD700]/50 rounded-lg text-xs font-bold transition-all"
                                        >
                                            Hazırla
                                        </button>
                                    </div>
                                </div>

                                {/* Critical Ops */}
                                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHYxMEgweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDUiLz48cGF0aCBkPSJNMCAwbDEwIDEwaDEwbC0xMC0xMHptMjAgMGwxMCAxMGgxMGwtMTAtMTB6IiBmaWxsPSIjZWY0NDQ0IiBmaWxsLW9wYWNpdHk9Ii41Ii8+PC9zdmc+')]"></div>
                                    
                                    <h3 className="text-sm font-black text-rose-500 uppercase tracking-widest mb-4 mt-2 flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4" /> Kritik Operasyonlar
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => { setIsLocked(!isLocked); triggerGlobalToast(isLocked ? 'Sohbet Kilidi Açıldı' : 'Sohbet Kilitlendi!', isLocked ? 'success' : 'error'); }}
                                            className={`w-full p-4 rounded-xl flex items-center justify-between font-bold text-sm transition-all border ${isLocked ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10 text-zinc-300'}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />} 
                                                {isLocked ? "SOHBET KİLİTLİ (AÇ)" : "TÜM SOHBETİ KİLİTLE"}
                                            </span>
                                        </button>

                                        <button 
                                            onClick={() => { setIsSlowMode(!isSlowMode); triggerGlobalToast(isSlowMode ? 'Yavaş Mod Kapatıldı' : 'Yavaş Mod Aktif (5s)', 'success'); }}
                                            className={`w-full p-4 rounded-xl flex items-center justify-between font-bold text-sm transition-all border ${isSlowMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20' : 'bg-white/5 border-white/5 hover:bg-white/10 text-zinc-300'}`}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Clock className="w-4 h-4" /> 
                                                YAVAŞ MOD (SLOW MODE)
                                            </span>
                                        </button>

                                        <button 
                                            onClick={handleClearLiveHistory}
                                            className="w-full p-4 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 text-zinc-300 hover:text-rose-400 font-bold text-sm transition-all flex items-center justify-between group"
                                        >
                                            <span className="flex items-center gap-3">TÜM GEÇMİŞİ TEMİZLE</span>
                                            <Trash2 className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* TAB: ECONOMY */}
                        {activeTab === 'economy' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                {/* Rain Drops */}
                                <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center text-center">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none"></div>
                                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                                        <Coins className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">
                                        Para Yağmuru (Drop)
                                    </h3>
                                    <p className="text-[12px] text-zinc-400 mb-6 font-semibold leading-relaxed max-w-xs">
                                        Sohbetteki aktif üyelere anında rastgele bakiyeler dağıtın. Harika bir animasyon eşliğinde duyuru geçilir.
                                    </p>
                                    
                                    <div className="flex gap-4 w-full">
                                        <div className="flex-1 bg-[#111216] border border-white/5 rounded-xl p-3 text-left">
                                            <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Miktar (₺)</div>
                                            <input type="text" defaultValue="5000" className="w-full bg-transparent text-amber-500 font-black text-lg outline-none" />
                                        </div>
                                        <div className="flex-1 bg-[#111216] border border-white/5 rounded-xl p-3 text-left">
                                            <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Kişi Sayısı</div>
                                            <input type="text" defaultValue="10" className="w-full bg-transparent text-amber-500 font-black text-lg outline-none" />
                                        </div>
                                    </div>

                                    <button 
                                        onClick={triggerRain}
                                        disabled={isRaining}
                                        className="w-full mt-6 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black tracking-[0.2em] text-sm uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex justify-center items-center gap-2 disabled:opacity-50"
                                    >
                                        <Gift className="w-5 h-5" /> {isRaining ? 'YAĞIYOR...' : 'YAĞMURU BAŞLAT'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Middle Area: Bot Dashboard (Kukla Ustası) */}
                <div className="flex flex-1 flex-col bg-[#080808] border-b xl:border-b-0 xl:border-r border-white/5 relative z-10 p-4 sm:p-6 lg:p-8 xl:overflow-y-auto custom-scrollbar">
                    <div className="w-full max-w-5xl mx-auto space-y-8">
                        
                        {/* Dashboard Header */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div>
                                <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-[#00ff88]" />
                                    Gelişmiş Bot & Topluluk Merkezi
                                </h2>
                                <p className="text-xs text-zinc-500 mt-1">Sabit oyuncu veritabanını yönetin ve sohbeti yönlendirin.</p>
                            </div>
                        </div>

                        {/* Top Section: HYPE ENGINE */}
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 relative overflow-hidden group flex flex-col md:flex-row items-center gap-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00ff88]/5 blur-[60px] rounded-full pointer-events-none transition-all group-hover:bg-[#00ff88]/10"></div>
                            
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                                    <Activity className="w-8 h-8 text-[#00ff88]" />
                                </div>
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                <h3 className="text-sm font-black text-[#00ff88] uppercase tracking-widest flex items-center gap-2">
                                    Oto Hype Motoru
                                </h3>
                                
                                <div className="flex flex-col sm:flex-row xl:flex-col 2xl:flex-row gap-4">
                                    <div className="flex-1">
                                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2 block">Sohbete Girecek Bot Sayısı (1-50)</label>
                                        <input 
                                            type="number" 
                                            min="1" max="50"
                                            value={botCount}
                                            onChange={e => setBotCount(Math.max(1, Math.min(50, Number(e.target.value))))}
                                            className="w-full bg-[#111216] border border-white/10 rounded-xl py-3 px-4 text-sm text-[#00ff88] font-black focus:outline-none focus:border-[#00ff88]/50 transition-colors shadow-inner"
                                        />
                                    </div>
                                    <div className="w-full xl:w-[150px]">
                                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-2 block">Emoji Kullanımı</label>
                                        <button 
                                            onClick={() => setUseEmojis(!useEmojis)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all h-[46px] ${useEmojis ? 'bg-[#00ff88]/10 border-[#00ff88]/30 text-[#00ff88]' : 'bg-[#111216] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}
                                        >
                                            {useEmojis ? 'AKTİF' : 'KAPALI'}
                                            <div className={`w-3.5 h-3.5 rounded-full transition-colors ${useEmojis ? 'bg-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.6)]' : 'bg-zinc-600'}`}></div>
                                        </button>
                                    </div>
                                    <div className="w-full xl:w-auto flex items-end">
                                        <button 
                                            onClick={handleAutoHype}
                                            className="w-full sm:w-auto xl:w-full 2xl:w-auto px-8 py-3 h-[46px] bg-gradient-to-r from-[#00ff88] to-[#00cc6a] hover:opacity-90 text-black font-black tracking-widest text-xs uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] flex justify-center items-center gap-2 hover:-translate-y-0.5"
                                        >
                                            <Zap className="w-4 h-4" /> HYPE BAŞLAT
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: ACTIVE BOT GALLERY */}
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <Target className="w-4 h-4 text-[#38bdf8]" />
                                    Kukla Ustası (Aktif Bot Seçicisi)
                                </h3>
                                <span className="text-[10px] bg-white/5 text-zinc-400 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                                    {FIXED_BOTS.length} Kayıtlı Üye
                                </span>
                            </div>

                            {selectedBotId && (
                                <div className="bg-[#38bdf8]/5 border border-[#38bdf8]/30 rounded-xl p-4 mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-[#38bdf8] blur-sm opacity-30 rounded-full animate-pulse"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] relative z-10"></div>
                                    </div>
                                    <span className="text-[13px] text-zinc-300 font-medium">
                                        Sağdaki sohbetten atacağınız tüm mesajlar <strong className="text-[#38bdf8] font-black tracking-wide uppercase px-1">{FIXED_BOTS.find(b => b.id === selectedBotId)?.isim}</strong> adına gönderilecek.
                                    </span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
                                {FIXED_BOTS.map(bot => {
                                    const isSelected = selectedBotId === bot.id;
                                    const isVip = bot.rol === 'VIP';
                                    
                                    return (
                                        <div 
                                            key={bot.id}
                                            onClick={() => setSelectedBotId(isSelected ? null : bot.id)}
                                            className={`relative group p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${isSelected ? 'bg-[#38bdf8]/5 border-[#38bdf8]/50 shadow-[0_0_15px_rgba(56,189,248,0.1)]' : 'bg-[#111111] border-white/5 hover:border-white/10 hover:bg-[#161616]'}`}
                                        >
                                            {/* Minimal Glow for selected state */}
                                            {isSelected && (
                                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#38bdf8]/10 blur-xl pointer-events-none rounded-full"></div>
                                            )}
                                            
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg relative z-10" style={{ backgroundColor: `${bot.avatarRenk}20`, color: bot.avatarRenk, border: `1px solid ${bot.avatarRenk}50` }}>
                                                    {bot.isim.charAt(0)}
                                                    {isVip && (
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border border-yellow-300">
                                                            <Star className="w-2.5 h-2.5 text-black fill-black" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-sm text-white truncate group-hover:text-white transition-colors">{bot.isim}</div>
                                                    <div className={`text-[10px] font-black uppercase tracking-widest ${isVip ? 'text-yellow-500' : 'text-zinc-500'}`}>
                                                        {bot.rol}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-[10px] text-zinc-500 flex items-center justify-between mt-1">
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {bot.uyelikTarihi}</span>
                                            </div>

                                            {/* Inline Personality Info */}
                                            <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-white/5">
                                                <div className="text-[10px] text-zinc-300 font-medium leading-snug line-clamp-2">
                                                    {bot.karakter}
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">DNA Tipi</span>
                                                    <span className="text-[9px] text-[#38bdf8] font-black uppercase tracking-widest">{bot.typingStyle.replace('_', ' ')}</span>
                                                </div>
                                                {(bot as any).slang && (bot as any).slang.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {(bot as any).slang.map((s: string, i: number) => (
                                                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">{s}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Pane: Live Chat - NARROW RIGHT COLUMN EXACTLY LIKE SITE */}
                <div className="w-full xl:w-[350px] shrink-0 flex flex-col bg-[#0A0D14] relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] xl:shadow-[-10px_0_30px_rgba(0,0,0,0.8)] h-[600px] xl:h-auto mt-2 xl:mt-0">
                    
                    {/* Rain Animation Layer */}
                    {isRaining && (
                        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-t-2xl">
                            {Array.from({length: 30}).map((_, i) => (
                                <div 
                                    key={i}
                                    className="absolute animate-in slide-in-from-top fade-out duration-1000 fill-mode-forwards"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        animationDuration: `${1 + Math.random()}s`
                                    }}
                                >
                                    <Coins className="w-6 h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Target User Menu (Sniper Mode) */}
                    {targetUser && (
                        <div 
                            className="fixed z-50 bg-[#111216]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 w-48 animate-in zoom-in-95 duration-200"
                            style={{ 
                                left: Math.min(targetUser.x, window.innerWidth - 200), 
                                top: Math.min(targetUser.y, window.innerHeight - 250)
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="px-3 py-2 border-b border-white/5 mb-2">
                                <div className="text-xs font-black text-white truncate">{targetUser.name}</div>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase">{targetUser.role}</div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-500/10 text-emerald-500 text-xs font-bold transition-colors w-full text-left"
                                        onClick={() => { triggerGlobalToast(`${targetUser.name} VIP yapıldı!`, 'success'); closeTargetMenu(); }}>
                                    <Star className="w-3.5 h-3.5" /> VIP Yap
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-amber-500/10 text-amber-500 text-xs font-bold transition-colors w-full text-left"
                                        onClick={() => { triggerGlobalToast(`${targetUser.name} hesabına hediye gönderildi!`, 'success'); closeTargetMenu(); }}>
                                    <Gift className="w-3.5 h-3.5" /> Hediye At
                                </button>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-zinc-300 text-xs font-bold transition-colors w-full text-left"
                                        onClick={() => { triggerGlobalToast(`Fısıltı gönderildi`, 'success'); closeTargetMenu(); }}>
                                    <Megaphone className="w-3.5 h-3.5" /> Fısılda
                                </button>
                                <div className="h-px w-full bg-white/5 my-1"></div>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-500 text-xs font-bold transition-colors w-full text-left"
                                        onClick={() => { triggerGlobalToast(`${targetUser.name} yasaklandı!`, 'error'); closeTargetMenu(); }}>
                                    <EyeOff className="w-3.5 h-3.5" /> Sustur/Banla
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Header Top Bar for Chat */}
                    <div className="bg-[#0A0D14] px-4 h-[64px] text-white flex items-center justify-between flex-shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-10 border-b border-white/5">
                        <div className="flex items-center gap-2">
                             <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center text-[12px] opacity-90">🇹🇷</span>
                             <span className="text-sm font-semibold text-zinc-300">Türkçe</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#00ff88]">
                            <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
                            ONLINE
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-[#0A0D14]" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.05) transparent' }}>
                        {messages.map((m, idx) => {
                            const isSystem = m.role === 'system';
                            const isMod = m.role === 'admin' || m.role === 'mod';
                            const isVip = m.role === 'vip';
                            const color = getUserColor(m.user);
                            const initial = m.user.charAt(0).toUpperCase();

                            if (isSystem) {
                                return (
                                    <div key={idx} className="bg-[#0f0f0f] border-b border-white/5 px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg rounded-xl mb-4 animate-in fade-in zoom-in duration-300">
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
                                                {m.msg}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div 
                                    key={idx} 
                                    onClick={(e) => handleUserClick(e, m.user, m.role)}
                                    className="group px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl text-left text-[13px] leading-relaxed shadow-[0_4px_15px_rgba(0,0,0,0.4)] transition-all hover:bg-white/[0.04] hover:border-white/10 mb-2.5 backdrop-blur-md relative overflow-hidden border-l-[3px] cursor-pointer" 
                                    style={{ borderLeftColor: isVip ? '#FFD700' : color }}
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
                                            <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 shadow-lg" style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}50` }}>
                                                {initial}
                                            </div>
                                        )}
                                        <span className="font-black tracking-tight text-[13.5px] group-hover:underline decoration-white/20 underline-offset-2" style={{ color: isVip ? '#FFD700' : color, textShadow: `0 0 5px ${isVip ? '#FFD700' : color}66` }}>
                                            {m.user}
                                        </span>
                                    </span>
                                    <span className={`break-words antialiased ml-1 ${isVip ? 'text-yellow-500/90 font-medium' : 'text-slate-300'}`}>
                                        {m.msg}
                                    </span>
                                    
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[#0A0D14] p-1 rounded-md shadow-lg border border-white/5 z-10">
                                        <button className="w-7 h-7 rounded hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-colors" title="Sil" onClick={(e) => { e.stopPropagation(); setMessages(prev => prev.filter(msg => msg.id !== m.id)); }}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 border-t border-white/5 bg-[#0a0d14] relative z-10 flex flex-col gap-2">
                        {selectedBotId && (
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <Bot className="w-3 h-3 text-[#38bdf8]" />
                                    Yapay Zeka Karakteristiği Uygula
                                </span>
                                <button 
                                    onClick={() => setApplyPersona(!applyPersona)}
                                    className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${applyPersona ? 'bg-[#38bdf8]' : 'bg-zinc-700'}`}
                                >
                                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${applyPersona ? 'translate-x-4' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        )}
                        <div className="relative flex items-center bg-[#13131A] rounded-full border border-white/5 shadow-inner">
                            <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMsg()}
                                placeholder="Bir mesaj gönder..."
                                className="w-full bg-transparent border-none py-3 pl-5 pr-20 text-[13px] text-white placeholder:text-zinc-500 focus:outline-none"
                            />
                            <div className="absolute right-2 flex items-center gap-1.5">
                                <button className="p-1.5 text-zinc-500 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                                </button>
                                <button 
                                    onClick={handleSendMsg}
                                    className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:opacity-90 text-black flex items-center justify-center transition-opacity shadow-lg"
                                >
                                    <Send className="w-3.5 h-3.5 ml-0.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
