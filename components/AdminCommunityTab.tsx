import React, { useState, useEffect } from 'react';
import { MessageSquare, CloudRain, Gift, Zap, TrendingUp, Users, Activity, Trash2, VolumeX, Ban, ChevronRight, Coins, Send } from 'lucide-react';
import { triggerGlobalToast } from './GlobalToaster';

const mockChatMessages = [
    { id: 1, user: 'Ahmet123', msg: 'Bonanza yine vermedi be...', sentiment: 'negative' },
    { id: 2, user: 'CryptoKral', msg: '1000x yakaladım! 🎉', sentiment: 'positive' },
    { id: 3, user: 'Ayse_TR', msg: 'Rain ne zaman atılacak admin?', sentiment: 'neutral' },
    { id: 4, user: 'Vip_Hakan', msg: 'Para çekimim 1 dakikada geldi helal.', sentiment: 'positive' },
    { id: 5, user: 'Mehmet_Z', msg: 'Kayıp bonusu istiyorum', sentiment: 'negative' },
];

export default function AdminCommunityTab() {
    const [messages, setMessages] = useState(mockChatMessages);
    
    // Drop/Rain States
    const [rainConfig, setRainConfig] = useState(false);
    const [dropConfig, setDropConfig] = useState(false);
    const [amount, setAmount] = useState('500');
    const [usersCount, setUsersCount] = useState('50');

    // Chart mock data
    const [chartData, setChartData] = useState<number[]>(Array(24).fill(0).map(() => Math.floor(Math.random() * 100)));

    useEffect(() => {
        const interval = setInterval(() => {
            const users = ['Veli_2', 'Can_Bey', 'Selin1903', 'HakanVIP', 'KriptoGenc', 'SlotMaster'];
            const msgs = ['Bugün şansım yaver gidiyor', 'Admin drop pls', 'Yine patladık', 'Canlı destek harika', 'Rain var mı?', 'Olympus max win verdi!!!'];
            const sentiments: ('positive' | 'negative' | 'neutral')[] = ['positive', 'neutral', 'negative', 'positive', 'neutral', 'positive'];
            
            const r = Math.floor(Math.random() * users.length);
            const newMsg = {
                id: Date.now(),
                user: users[r],
                msg: msgs[r],
                sentiment: sentiments[r]
            };
            
            setMessages(prev => [newMsg, ...prev].slice(0, 50));

            // Update chart slightly to simulate live
            setChartData(prev => {
                const newData = [...prev.slice(1), Math.floor(Math.random() * 100)];
                return newData;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = (type: string, user: string, id: number) => {
        if(type === 'delete') {
            setMessages(prev => prev.filter(m => m.id !== id));
            triggerGlobalToast(`Mesaj silindi: ${user}`, 'success');
        } else if (type === 'mute') {
            triggerGlobalToast(`${user} 10 dakika susturuldu.`, 'success');
        } else if (type === 'ban') {
            triggerGlobalToast(`${user} kalıcı olarak yasaklandı!`, 'error');
        }
    };

    const triggerRain = () => {
        triggerGlobalToast(`Rain Başarıyla Gönderildi! (${usersCount} kişiye ${amount} $)`, 'success');
        setRainConfig(false);
    };

    const triggerDrop = () => {
        triggerGlobalToast(`Promosyon Kodu Sohbete Gönderildi!`, 'success');
        setDropConfig(false);
    };

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-y-auto custom-scrollbar bg-[#050608]">
            {/* Header & Live Metrics */}
            <div className="flex flex-col mb-6 gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-[#00E5FF]" />
                            Topluluk Komuta Merkezi
                        </h2>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
                            <span className="text-xs text-[#00ff88] font-bold tracking-widest uppercase">Canlı Yayın Aktif</span>
                        </div>
                    </div>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#111216] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Anlık Aktif Kullanıcı</p>
                            <p className="text-2xl font-black text-white">4,152</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#00E5FF]" />
                        </div>
                    </div>
                    <div className="bg-[#111216] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Bugün Atılan Mesaj</p>
                            <p className="text-2xl font-black text-white">128.4K</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-pink-500" />
                        </div>
                    </div>
                    <div className="bg-[#111216] border border-white/5 rounded-xl p-4 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Dağıtılan Drop</p>
                            <p className="text-2xl font-black text-[#00ff88]">$ 12,450</p>
                        </div>
                        <div className="w-10 h-10 rounded-lg bg-[#00ff88]/10 flex items-center justify-center">
                            <Gift className="w-5 h-5 text-[#00ff88]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
                
                {/* Chat Feed & Sentiment (Live Moderation) */}
                <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col h-[500px]">
                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-pink-500" /> Canlı Sohbet Monitörü
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                            <span className="text-[#00ff88]">Poz: %65</span>
                            <span className="text-zinc-500">Nöt: %20</span>
                            <span className="text-[#ef4444]">Neg: %15</span>
                        </div>
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1.5">
                        {messages.map((m) => {
                            const isPos = m.sentiment === 'positive';
                            const isNeg = m.sentiment === 'negative';
                            return (
                            <div key={m.id} className={`group relative p-2.5 rounded-lg bg-[#111216]/80 hover:bg-[#1a1c23] border-l-2 transition-all flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${isPos ? 'border-l-[#00ff88] bg-[#00ff88]/[0.02]' : isNeg ? 'border-l-[#ef4444] bg-[#ef4444]/[0.02]' : 'border-l-zinc-500'}`}>
                                <div className="flex flex-col min-w-0 pr-4">
                                    <span className="font-bold text-xs text-white truncate">{m.user}</span>
                                    <span className={`text-[11px] truncate ${isNeg ? 'text-rose-200' : 'text-zinc-400'}`}>{m.msg}</span>
                                </div>
                                <div className="hidden group-hover:flex items-center gap-1 shrink-0 bg-[#0b0c10] p-1 rounded-md border border-white/10 shadow-lg">
                                    <button onClick={() => handleAction('delete', m.user, m.id)} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors" title="Sil"><Trash2 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleAction('mute', m.user, m.id)} className="p-1.5 hover:bg-white/10 rounded text-zinc-400 hover:text-amber-400 transition-colors" title="Sustur"><VolumeX className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleAction('ban', m.user, m.id)} className="p-1.5 hover:bg-rose-500/20 rounded text-zinc-400 hover:text-rose-500 transition-colors" title="Banla"><Ban className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>

                {/* Right Column: Drop Command & Chart */}
                <div className="flex flex-col gap-6 h-[500px]">
                    {/* Command Center */}
                    <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg">
                        <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-400" /> Operasyon Merkezi
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {!rainConfig ? (
                                <button 
                                    onClick={() => { setRainConfig(true); setDropConfig(false); }}
                                    className="relative overflow-hidden p-5 rounded-xl border border-[#00ff88]/20 bg-[#00ff88]/5 hover:bg-[#00ff88]/10 hover:border-[#00ff88]/40 transition-all group flex flex-col items-center justify-center gap-2"
                                >
                                    <CloudRain className="w-8 h-8 text-[#00ff88] group-hover:-translate-y-1 transition-transform" />
                                    <span className="font-bold text-[#00ff88] text-sm">Rain Gönder</span>
                                </button>
                            ) : (
                                <div className="col-span-2 p-4 rounded-xl border border-[#00ff88]/30 bg-[#00ff88]/5 animate-in fade-in zoom-in-95">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-[#00ff88] font-bold text-sm flex items-center gap-2"><CloudRain className="w-4 h-4"/> Rain Ayarları</h4>
                                        <button onClick={() => setRainConfig(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                                    </div>
                                    <div className="flex gap-3 mb-3">
                                        <div className="flex-1 bg-black/50 rounded-lg p-2 border border-white/10">
                                            <label className="text-[10px] text-zinc-500 font-bold uppercase">Toplam Tutar ($)</label>
                                            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-transparent text-white font-bold text-sm outline-none mt-1" />
                                        </div>
                                        <div className="flex-1 bg-black/50 rounded-lg p-2 border border-white/10">
                                            <label className="text-[10px] text-zinc-500 font-bold uppercase">Kişi Sayısı</label>
                                            <input type="number" value={usersCount} onChange={e=>setUsersCount(e.target.value)} className="w-full bg-transparent text-white font-bold text-sm outline-none mt-1" />
                                        </div>
                                    </div>
                                    <button onClick={triggerRain} className="w-full py-2.5 bg-[#00ff88] text-black font-black uppercase tracking-wider rounded-lg hover:bg-[#00cc6a] transition-colors text-sm flex items-center justify-center gap-2">
                                        <Send className="w-4 h-4" /> Yağmuru Başlat
                                    </button>
                                </div>
                            )}

                            {!dropConfig && !rainConfig ? (
                                <button 
                                    onClick={() => { setDropConfig(true); setRainConfig(false); }}
                                    className="p-5 rounded-xl border border-[#f59e0b]/20 bg-[#f59e0b]/5 hover:bg-[#f59e0b]/10 hover:border-[#f59e0b]/40 transition-all group flex flex-col items-center justify-center gap-2"
                                >
                                    <Gift className="w-8 h-8 text-[#f59e0b] group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-[#f59e0b] text-sm">Kod (Drop) Dağıt</span>
                                </button>
                            ) : dropConfig && !rainConfig ? (
                                <div className="col-span-2 p-4 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/5 animate-in fade-in zoom-in-95">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-[#f59e0b] font-bold text-sm flex items-center gap-2"><Gift className="w-4 h-4"/> Drop Ayarları</h4>
                                        <button onClick={() => setDropConfig(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                                    </div>
                                    <div className="bg-black/50 rounded-lg p-2 border border-white/10 mb-3">
                                        <label className="text-[10px] text-zinc-500 font-bold uppercase">Promosyon Kodu</label>
                                        <input type="text" placeholder="Örn: 724WIN" className="w-full bg-transparent text-white font-bold text-sm outline-none mt-1" />
                                    </div>
                                    <button onClick={triggerDrop} className="w-full py-2.5 bg-[#f59e0b] text-black font-black uppercase tracking-wider rounded-lg hover:bg-[#d97706] transition-colors text-sm flex items-center justify-center gap-2">
                                        <Send className="w-4 h-4" /> Sohbet'e Gönder
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Live Chart */}
                    <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex-1 flex flex-col min-h-0">
                         <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#00E5FF]" /> Canlı Etkileşim Trafiği
                        </h3>
                        <div className="flex-1 flex items-end gap-1.5 sm:gap-2">
                            {chartData.map((val, idx) => (
                                <div key={idx} className="flex-1 bg-[#111216] rounded-t-sm relative group h-full flex items-end">
                                    <div 
                                        className="w-full rounded-t-sm transition-all duration-500 relative"
                                        style={{ 
                                            height: `${Math.max(5, val)}%`, 
                                            backgroundColor: val > 80 ? '#ef4444' : val > 50 ? '#00E5FF' : '#00ff88',
                                            opacity: 0.8
                                        }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            {val}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            <span>24s Önce</span>
                            <span>Şimdi</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Quick helper to render X icon if missing
const X = ({className}: {className?:string}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
