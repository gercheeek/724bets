import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, ShieldAlert, Users, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';

const pnlData = [
    { time: '08:00', amount: 15000 },
    { time: '10:00', amount: 25000 },
    { time: '12:00', amount: 18000 },
    { time: '14:00', amount: 45000 },
    { time: '16:00', amount: 85000 },
    { time: '18:00', amount: 120000 },
    { time: '20:00', amount: 165000 },
];

export default function AdminDashboardTab() {
    const [liveLogs, setLiveLogs] = useState<{id: number, text: string, type: 'success' | 'warning' | 'info'}[]>([]);

    // Simulate Live WebSocket Logs
    useEffect(() => {
        let counter = 0;
        const interval = setInterval(() => {
            const types: ('success' | 'warning' | 'info')[] = ['success', 'info', 'success', 'warning'];
            const messages = [
                'TRX 500 Yatırım Onaylandı (Otomatik)',
                'Kullanıcı ahmet12 giriş yaptı (IP: 192.168.1.5)',
                '1,250 USDT Çekim Onaylandı (VIP Üye - Oto)',
                'Şüpheli İşlem: Aynı IP\'den 3. Giriş Denemesi',
                'Yeni Kupon: GS - FB Maçına Yüklü Bahis (25,000 TL)'
            ];
            
            const newLog = {
                id: Date.now(),
                text: messages[Math.floor(Math.random() * messages.length)],
                type: types[Math.floor(Math.random() * types.length)]
            };
            
            setLiveLogs(prev => [newLog, ...prev].slice(0, 50));
            counter++;
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-y-auto bg-[#050608]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Activity className="w-6 h-6 text-[#00ff88]" />
                        Komuta Merkezi
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1 font-mono">SİSTEM DURUMU: <span className="text-[#00ff88]">OPTİMAL (OTOMASYON AKTİF)</span></p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#0b0c10] border border-white/5 hover:border-[#00ff88]/30 transition-colors rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Günlük Net PNL</p>
                        <TrendingUp className="w-4 h-4 text-[#00ff88]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white font-mono">₺165,420</h3>
                        <span className="text-[#00ff88] text-xs font-bold flex items-center mb-1"><ArrowUpRight className="w-3 h-3" /> 12.5%</span>
                    </div>
                </div>

                <div className="bg-[#0b0c10] border border-white/5 hover:border-[#ef4444]/30 transition-colors rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ef4444]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Aktif Risk Yükü</p>
                        <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white font-mono">₺45,200</h3>
                        <span className="text-[#ef4444] text-xs font-bold flex items-center mb-1"><ArrowUpRight className="w-3 h-3" /> 5.2%</span>
                    </div>
                </div>

                <div className="bg-[#0b0c10] border border-white/5 hover:border-[#3b82f6]/30 transition-colors rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Aktif Oyuncu</p>
                        <Users className="w-4 h-4 text-[#3b82f6]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white font-mono">1,204</h3>
                        <span className="text-zinc-400 text-xs font-bold mb-1">Anlık</span>
                    </div>
                </div>

                <div className="bg-[#0b0c10] border border-white/5 hover:border-[#eab308]/30 transition-colors rounded-xl p-5 shadow-lg relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#eab308]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Bekleyen İşlem</p>
                        <Zap className="w-4 h-4 text-[#eab308]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-3xl font-black text-white font-mono">3</h3>
                        <span className="text-zinc-400 text-xs font-bold mb-1">Manuel Onay</span>
                    </div>
                </div>
            </div>

            {/* Main Area: Chart & Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
                
                {/* PNL Chart */}
                <div className="lg:col-span-2 bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col">
                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-6">Net PNL Eğrisi (Son 12 Saat)</h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={pnlData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="time" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${value/1000}k`} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#00ff88', fontWeight: 'bold' }}
                                    formatter={(value: number) => [`₺${value.toLocaleString()}`, 'PNL']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#00ff88" strokeWidth={3} fillOpacity={1} fill="url(#colorPnl)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col overflow-hidden">
                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
                        Canlı İşlem Akışı
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                        {liveLogs.map((log) => (
                            <div key={log.id} className="text-xs font-mono p-2.5 rounded border border-white/5 bg-[#111216] animate-in fade-in slide-in-from-top-2 duration-300">
                                <span className={`mr-2 font-bold ${
                                    log.type === 'success' ? 'text-[#00ff88]' : 
                                    log.type === 'warning' ? 'text-[#eab308]' : 'text-[#3b82f6]'
                                }`}>
                                    [{new Date(log.id).toLocaleTimeString('tr-TR')}]
                                </span>
                                <span className="text-zinc-300">{log.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
