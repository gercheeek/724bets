import React, { useState, useEffect } from 'react';
import { MessageSquare, CloudRain, Gift, Zap, TrendingUp, Users } from 'lucide-react';

const mockChatMessages = [
    { id: 1, user: 'Ahmet123', msg: 'Bonanza yine vermedi be...', sentiment: 'negative' },
    { id: 2, user: 'CryptoKral', msg: '1000x yakaladım! 🎉', sentiment: 'positive' },
    { id: 3, user: 'Ayse_TR', msg: 'Rain ne zaman atılacak admin?', sentiment: 'neutral' },
    { id: 4, user: 'Vip_Hakan', msg: 'Para çekimim 1 dakikada geldi helal.', sentiment: 'positive' },
    { id: 5, user: 'Mehmet_Z', msg: 'Kayıp bonusu istiyorum', sentiment: 'negative' },
];

export default function AdminCommunityTab() {
    const [messages, setMessages] = useState(mockChatMessages);
    const [rainActive, setRainActive] = useState(false);

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
            
            setMessages(prev => [newMsg, ...prev].slice(0, 15));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const triggerRain = () => {
        setRainActive(true);
        setTimeout(() => setRainActive(false), 3000);
    };

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-y-auto custom-scrollbar bg-[#050608]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-[#ec4899]" />
                        Topluluk & Drop Kontrolü
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1 font-mono">DURUM: <span className="text-[#ec4899]">CHAT CANLI AKIŞI AKTİF</span></p>
                </div>
                
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#111216] border border-white/5 rounded-lg text-sm">
                        <Users className="w-4 h-4 text-zinc-400" />
                        <span className="font-bold">4,152</span>
                        <span className="text-zinc-500">Sohbet Aktif</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
                
                {/* Chat Feed & Sentiment */}
                <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col">
                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Global Sohbet Akışı
                        </div>
                        <div className="flex items-center gap-4 text-xs font-mono">
                            <span className="text-[#00ff88]">Pozitif: %65</span>
                            <span className="text-[#ef4444]">Negatif: %15</span>
                            <span className="text-zinc-500">Nötr: %20</span>
                        </div>
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {messages.map((m) => (
                            <div key={m.id} className="p-3 rounded bg-[#111216] border border-white/5 flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm text-[#ec4899]">{m.user}</span>
                                    <span className={`w-2 h-2 rounded-full ${m.sentiment === 'positive' ? 'bg-[#00ff88]' : m.sentiment === 'negative' ? 'bg-[#ef4444]' : 'bg-zinc-500'}`}></span>
                                </div>
                                <span className="text-sm text-zinc-300">{m.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Command Center */}
                <div className="flex flex-col gap-6">
                    <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg">
                        <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Drop Komuta Merkezi
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={triggerRain}
                                disabled={rainActive}
                                className="relative overflow-hidden p-6 rounded-xl border border-[#00ff88]/30 bg-[#00ff88]/10 hover:bg-[#00ff88]/20 transition-all group flex flex-col items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {rainActive ? (
                                    <CloudRain className="w-10 h-10 text-[#00ff88] animate-bounce" />
                                ) : (
                                    <CloudRain className="w-10 h-10 text-[#00ff88] group-hover:-translate-y-1 transition-transform" />
                                )}
                                <span className="font-bold text-[#00ff88]">Kripto Yağmuru (Rain) At</span>
                                <span className="text-xs text-[#00ff88]/70">Chatteki aktif 50 kişiye rastgele TRX</span>
                            </button>

                            <button className="p-6 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 transition-all group flex flex-col items-center justify-center gap-3">
                                <Gift className="w-10 h-10 text-[#f59e0b] group-hover:scale-110 transition-transform" />
                                <span className="font-bold text-[#f59e0b]">Bonus Kodu Dağıt (Drop)</span>
                                <span className="text-xs text-[#f59e0b]/70">Özel promo kodunu ekrana bas</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex-1">
                         <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Sohbet Etkileşim Grafiği
                        </h3>
                        <div className="flex items-center justify-center h-40 border border-dashed border-white/10 rounded-lg text-zinc-600 font-mono text-sm">
                            (Grafik Yükleniyor...)
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
