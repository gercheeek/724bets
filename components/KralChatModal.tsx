import React, { useState, useEffect, useRef } from 'react';
import { X, Crown, Megaphone, Trash2, Lock, Unlock, Send, Zap, Activity, Bot, Coins, Trophy, Settings, UploadCloud } from 'lucide-react';
import { triggerGlobalToast } from './GlobalToaster';
import { supabase } from '../utils/supabase';
import ModernChat from './ModernChat';

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
    const [activeTab, setActiveTab] = useState('bots');

    if (!isOpen) return null;

    const pushToSupabase = async (user: string, role: string, msg: string) => {
        const toInsert = [{
            channel_id: '00000000-0000-0000-0000-000000000000',
            user_id: `bot_${user.toLowerCase()}_${Math.random().toString(36).substring(7)}`,
            username: user,
            message: msg,
            role: role
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
        const toInsert = unpushed.map(m => ({
            channel_id: '00000000-0000-0000-0000-000000000000',
            user_id: `bot_${m.user.toLowerCase()}_${Math.random().toString(36).substring(7)}`,
            username: m.user,
            message: m.msg,
            role: m.role
        }));
        const { error } = await supabase.from('tv_chat').insert(toInsert);
        if (error) {
            triggerGlobalToast('Aktarım başarısız oldu!', 'error');
        } else {
            triggerGlobalToast(`${toInsert.length} taslak mesaj canlıya aktarıldı!`, 'success');
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

    const handleClearLiveHistory = async () => {
        const { error } = await supabase.from('tv_chat').delete().eq('channel_id', '00000000-0000-0000-0000-000000000000');
        if (error) {
            triggerGlobalToast('Canlı geçmiş silinemedi!', 'error');
        } else {
            triggerGlobalToast('Sohbet geçmişi silindi!', 'success');
            setMessages([]);
        }
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
                            <Crown className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                        </div>
                        <div>
                            <h1 className="text-white text-base font-black tracking-widest uppercase bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent">VIP Komuta Merkezi</h1>
                            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Sohbet Yönetim Paneli</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handlePushToLive} 
                            className="h-10 px-6 flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
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
                                                        <div className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isVip ? 'text-yellow-500' : 'text-zinc-500'}`}>{bot.rol}</div>
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
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none"><Megaphone className="w-48 h-48 text-yellow-500" /></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                                                <Megaphone className="w-5 h-5 text-yellow-500" />
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
                                                    className="w-full bg-transparent p-4 text-base text-yellow-500 font-bold focus:outline-none min-h-[150px] placeholder:text-yellow-500/30 resize-none"
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
                                                <Crown className="w-10 h-10 text-amber-500 mb-4 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                                <h3 className="text-amber-500 font-bold text-sm uppercase mb-2">Sohbet Yağmuru</h3>
                                                <p className="text-xs text-zinc-400 mb-6 px-4">Aktif kullanıcılara rastgele bakiye (drop) dağıtır.</p>
                                                <button onClick={triggerRain} disabled={isRaining} className="w-full py-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-xs uppercase rounded-xl transition-all disabled:opacity-50">
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
                                                {isLocked ? <Lock className="w-10 h-10 text-rose-500 mb-4" /> : <Unlock className="w-10 h-10 text-emerald-500 mb-4" />}
                                                <h3 className="text-white font-bold text-sm uppercase mb-2">Sohbet Kilidi</h3>
                                                <p className="text-xs text-zinc-400 mb-6 px-4">VIP harici kullanıcıların global sohbete yazmasını engeller.</p>
                                                <button onClick={() => setIsLocked(!isLocked)} className={`w-full max-w-sm mx-auto py-4 font-black text-xs uppercase rounded-xl border transition-all ${isLocked ? 'bg-rose-500/20 border-rose-500/40 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black'}`}>
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

            {/* Right Pane: Live Chat Preview (Read-only view for Admin) */}
            <div className="w-[360px] shrink-0 flex flex-col bg-[#0b0e14] border-l border-white/5 relative z-40 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                <ModernChat 
                    open={true}
                    onClose={() => {}}
                    siteUser={{ role: 'admin' }} 
                    userRole="admin"
                    isMobile={false}
                    botsConfig={[]}
                />
            </div>
        </div>
    );
}
