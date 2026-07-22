import React, { useState, useEffect } from 'react';
import { 
    MessageSquare, Gift, CloudRain, Shield, Ban, VolumeX, CheckCircle2, 
    X, AlertTriangle, Play, Pause, Calendar, DollarSign, Users, Target
} from 'lucide-react';

interface ChatMessage {
    id: string;
    user: string;
    msg: string;
    time: Date;
    isVip: boolean;
}

export default function AdminMarketingTab() {
    const [activeSubTab, setActiveSubTab] = useState<'chat' | 'promos'>('chat');

    // Chat Tab State
    const [chatLogs, setChatLogs] = useState<ChatMessage[]>([]);
    const [isRainModalOpen, setIsRainModalOpen] = useState(false);
    const [rainAmount, setRainAmount] = useState('');
    const [rainPeople, setRainPeople] = useState('');
    const [showToast, setShowToast] = useState(false);

    // Promo Tab State
    const [promos, setPromos] = useState([
        { id: 'race', title: '100.000$ Haftalık Yarış', active: true, pool: 100000, endDays: 2 },
        { id: 'raffle', title: 'Haftalık Çekiliş (Raffle)', active: true, pool: 50000, endDays: 5 },
        { id: 'welcome', title: 'Hoş Geldin Bonusu', active: false, pool: 5000, endDays: 30 }
    ]);

    // Simulate Chat Stream
    useEffect(() => {
        const users = ['crypto_king', 'bet_master', 'lucky99', 'anon_user', 'whale_007', 'slot_hunter'];
        const messages = ['Selam beyler', 'Bugün slotlar çok iyi', 'Kasa katlandı!', 'Admin rain please :D', 'Hangi oyun kazandırıyor?', 'Plinko girmeyin :(', '1000x yakaladım!!'];
        
        const interval = setInterval(() => {
            if (activeSubTab !== 'chat') return; // Pause if not on tab
            const newMsg: ChatMessage = {
                id: Math.random().toString(),
                user: users[Math.floor(Math.random() * users.length)] + Math.floor(Math.random() * 99),
                msg: messages[Math.floor(Math.random() * messages.length)],
                time: new Date(),
                isVip: Math.random() > 0.8
            };
            setChatLogs(prev => [newMsg, ...prev].slice(0, 30));
        }, 3000);

        return () => clearInterval(interval);
    }, [activeSubTab]);

    const handleRainStart = () => {
        if (!rainAmount || !rainPeople) return;
        setIsRainModalOpen(false);
        setShowToast(true);
        setRainAmount('');
        setRainPeople('');
        setTimeout(() => setShowToast(false), 3000);
        
        // Add a system message to chat
        const sysMsg: ChatMessage = {
            id: 'sys_' + Math.random(),
            user: 'SİSTEM',
            msg: `🌧️ Admin ${rainAmount}₺ değerinde YAĞMUR başlattı! (${rainPeople} Kişi)`,
            time: new Date(),
            isVip: true
        };
        setChatLogs(prev => [sysMsg, ...prev]);
    };

    const togglePromo = (id: string) => {
        setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p));
    };

    const updatePromoField = (id: string, field: 'pool' | 'endDays', val: number) => {
        setPromos(promos.map(p => p.id === id ? { ...p, [field]: val } : p));
    };

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-hidden">
            
            {/* Header & Inner Tabs (Shadcn UI Tabs style) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-zinc-800 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        Etkinlik & Chat Yönetimi
                    </h2>
                    <p className="text-sm text-zinc-400 mt-1">Topluluk dinamikleri ve aktif promosyon motorları</p>
                </div>

                <div className="bg-[#111318] p-1 rounded-xl border border-zinc-800 flex shadow-inner">
                    <button 
                        onClick={() => setActiveSubTab('chat')}
                        className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            activeSubTab === 'chat' 
                            ? 'bg-[#0ea5e9] text-white shadow-[0_0_15px_rgba(14,165,233,0.3)]' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Chat Komuta
                    </button>
                    <button 
                        onClick={() => setActiveSubTab('promos')}
                        className={`px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            activeSubTab === 'promos' 
                            ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]' 
                            : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        <Gift className="w-4 h-4" />
                        Kampanyalar
                    </button>
                </div>
            </div>

            {/* TAB 1: Chat Komuta Merkezi */}
            {activeSubTab === 'chat' && (
                <div className="flex-1 flex flex-col min-h-0 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    
                    {/* Log Window */}
                    <div className="flex-1 bg-[#111318] border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-lg shadow-black/50">
                        <div className="px-4 py-3 border-b border-zinc-800 bg-[#15171e] flex items-center justify-between">
                            <h3 className="font-bold text-zinc-300 text-sm flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-400" /> Canlı Chat Akışı
                            </h3>
                            <span className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                CANLI
                            </span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 flex flex-col-reverse">
                            {chatLogs.map(log => (
                                <div key={log.id} className={`group flex items-start justify-between p-3 rounded-xl transition-all ${log.user === 'SİSTEM' ? 'bg-[#0ea5e9]/10 border border-[#0ea5e9]/30' : 'bg-[#1a1c24] border border-transparent hover:border-zinc-700'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className="text-xs font-mono text-zinc-500 mt-0.5">{log.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit', second:'2-digit' })}</div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`font-bold text-sm ${log.user === 'SİSTEM' ? 'text-[#0ea5e9]' : 'text-zinc-200'}`}>{log.user}</span>
                                                {log.isVip && log.user !== 'SİSTEM' && <span className="bg-[#f0b90b]/10 text-[#f0b90b] text-[9px] font-black px-1.5 py-0.5 rounded border border-[#f0b90b]/20">VIP</span>}
                                            </div>
                                            <div className={`text-sm ${log.user === 'SİSTEM' ? 'text-[#0ea5e9] font-medium' : 'text-zinc-400'}`}>{log.msg}</div>
                                        </div>
                                    </div>
                                    
                                    {log.user !== 'SİSTEM' && (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10 rounded transition-colors" title="Sustur (Mute)">
                                                <VolumeX className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Uzaklaştır (Ban)">
                                                <Ban className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {chatLogs.length === 0 && <div className="text-center text-zinc-600 text-sm py-10">Chat akışı başlatılıyor...</div>}
                        </div>
                    </div>

                    {/* Rain Action */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-emerald-500/20"></div>
                        
                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2 mb-2">
                                    <CloudRain className="w-6 h-6" />
                                    Rain (Yağmur) Başlat
                                </h3>
                                <p className="text-zinc-400 text-sm">Online üyelere anında bakiye dağıtarak sohbeti canlandırın ve sadakati artırın.</p>
                            </div>
                            
                            <button 
                                onClick={() => setIsRainModalOpen(true)}
                                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all flex items-center justify-center gap-3 shrink-0"
                            >
                                <CloudRain className="w-6 h-6" />
                                YENİ YAĞMUR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Kampanyalar ve Yarışlar */}
            {activeSubTab === 'promos' && (
                <div className="flex-1 overflow-y-auto pr-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {promos.map(promo => (
                            <div key={promo.id} className={`bg-[#111318] border rounded-2xl p-6 transition-all shadow-lg ${promo.active ? 'border-purple-500/30 shadow-purple-500/5' : 'border-zinc-800 opacity-60 grayscale-[50%]'}`}>
                                
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl ${promo.active ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-500'}`}>
                                            <Gift className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-lg text-white">{promo.title}</h3>
                                    </div>

                                    {/* Active/Passive Switch */}
                                    <button 
                                        onClick={() => togglePromo(promo.id)}
                                        className={`w-14 h-7 rounded-full transition-colors relative flex items-center ${promo.active ? 'bg-purple-600' : 'bg-zinc-700'}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white absolute transition-all ${promo.active ? 'left-[34px]' : 'left-[4px]'}`}></div>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5" /> Ödül Havuzu
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                                            <input 
                                                type="number" 
                                                value={promo.pool}
                                                onChange={e => updatePromoField(promo.id, 'pool', Number(e.target.value))}
                                                disabled={!promo.active}
                                                className="w-full bg-[#15171e] border border-zinc-800 rounded-lg pl-8 pr-4 py-2.5 text-white font-mono focus:border-purple-500 outline-none transition-colors disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> Bitişe Kalan Süre (Gün)
                                        </label>
                                        <input 
                                            type="number" 
                                            value={promo.endDays}
                                            onChange={e => updatePromoField(promo.id, 'endDays', Number(e.target.value))}
                                            disabled={!promo.active}
                                            className="w-full bg-[#15171e] border border-zinc-800 rounded-lg px-4 py-2.5 text-white font-mono focus:border-purple-500 outline-none transition-colors disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Rain Dialog (Modal) */}
            {isRainModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0f1115] border border-emerald-500/30 w-full max-w-md rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-[#15171e]">
                            <div className="flex items-center gap-3">
                                <CloudRain className="w-5 h-5 text-emerald-400" />
                                <h3 className="text-lg font-bold text-white">Rain Başlat</h3>
                            </div>
                            <button onClick={() => setIsRainModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5" /> Dağıtılacak Toplam Tutar (₺)
                                    </label>
                                    <input 
                                        type="number"
                                        value={rainAmount}
                                        onChange={e => setRainAmount(e.target.value)}
                                        placeholder="Örn: 5000"
                                        className="w-full bg-[#1a1c24] border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white font-mono text-lg outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5" /> Kaç Kişiye Dağıtılacak?
                                    </label>
                                    <input 
                                        type="number"
                                        value={rainPeople}
                                        onChange={e => setRainPeople(e.target.value)}
                                        placeholder="Örn: 100"
                                        className="w-full bg-[#1a1c24] border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-white font-mono text-lg outline-none transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setIsRainModalOpen(false)}
                                    className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    İptal
                                </button>
                                <button 
                                    onClick={handleRainStart}
                                    disabled={!rainAmount || !rainPeople}
                                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                                >
                                    <CloudRain className="w-5 h-5" />
                                    Onayla
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {showToast && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-10 fade-in duration-300">
                    <div className="bg-[#111318] border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)] px-6 py-4 rounded-2xl flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-full">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">Yağmur Başarıyla Başlatıldı!</h4>
                            <p className="text-emerald-400 text-xs font-mono mt-0.5">{rainAmount}₺ havuz, {rainPeople} kişiye dağıtılıyor.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
