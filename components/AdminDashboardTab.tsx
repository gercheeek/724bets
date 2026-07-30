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

const riskData = [
    { time: '08:00', amount: 12000 },
    { time: '10:00', amount: 35000 },
    { time: '12:00', amount: 42000 },
    { time: '14:00', amount: 29000 },
    { time: '16:00', amount: 51000 },
    { time: '18:00', amount: 38000 },
    { time: '20:00', amount: 45200 },
];

const playersData = [
    { time: '08:00', amount: 420 },
    { time: '10:00', amount: 680 },
    { time: '12:00', amount: 850 },
    { time: '14:00', amount: 720 },
    { time: '16:00', amount: 950 },
    { time: '18:00', amount: 1100 },
    { time: '20:00', amount: 1204 },
];

export default function AdminDashboardTab() {
    const [liveLogs, setLiveLogs] = useState<{id: number, text: string, type: 'success' | 'warning' | 'info', badge?: string, icon?: string}[]>([]);
    const [activeMetric, setActiveMetric] = useState<'pnl' | 'risk' | 'players'>('pnl');

    // Simulate Live WebSocket Logs
    useEffect(() => {
        const interval = setInterval(() => {
            const logsGen = [
                { text: 'TRX 500 Yatırım Onaylandı', type: 'success', badge: 'YATIRIM', icon: '💰' },
                { text: 'Kullanıcı ahmet12 giriş yaptı', type: 'info', badge: 'SİSTEM', icon: '🖥️' },
                { text: '1,250 USDT Çekim Onaylandı', type: 'success', badge: 'VIP', icon: '👑' },
                { text: 'Aynı IP\'den 3. Giriş Denemesi', type: 'warning', badge: 'FRAUD', icon: '🛑' },
                { text: 'GS-FB Maçına Yüklü Bahis', type: 'info', badge: 'BAHİS', icon: '🎯' },
                { text: 'RTP Anomalisi (Hacksaw)', type: 'warning', badge: 'RİSK', icon: '⚠️' }
            ];
            
            const randomLog = logsGen[Math.floor(Math.random() * logsGen.length)];
            const newLog = {
                id: Date.now(),
                text: randomLog.text,
                type: randomLog.type as 'success' | 'warning' | 'info',
                badge: randomLog.badge,
                icon: randomLog.icon
            };
            
            setLiveLogs(prev => [newLog, ...prev].slice(0, 50));
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-3 sm:p-4 text-white h-full flex flex-col relative overflow-y-auto bg-[#050608] custom-scrollbar">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-white/5 gap-3">
                <div>
                    <h2 className="text-lg font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#00ff88]" />
                        Komuta Merkezi
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">SİSTEM DURUMU: <span className="text-[#00ff88]">OPTİMAL (OTOMASYON AKTİF)</span></p>
                </div>
                
                {/* Panic Buttons (SUPER_ADMIN) */}
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                    <button className="flex items-center gap-2 bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/30 text-[#ef4444] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                        <ShieldAlert className="w-3.5 h-3.5" /> Tüm Çekimleri Durdur
                    </button>
                    <button className="flex items-center gap-2 bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-[#f59e0b] px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                        <Activity className="w-3.5 h-3.5" /> Sağlayıcı Kapat
                    </button>
                    <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                        <Zap className="w-3.5 h-3.5" /> Bakıma Al
                    </button>
                </div>
            </div>

            {/* KPIs - Compact V3 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
                <button 
                    onClick={() => setActiveMetric('pnl')}
                    className={`text-left bg-[#0b0c10] border transition-all rounded p-2 shadow-sm relative overflow-hidden group ${activeMetric === 'pnl' ? 'border-[#00ff88]/50 shadow-[0_0_10px_rgba(0,255,136,0.1)] bg-[#00ff88]/5' : 'border-white/5 hover:border-[#00ff88]/30'}`}
                >
                    <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 group-hover:opacity-40 transition-opacity" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,20 L10,15 L20,18 L30,12 L40,16 L50,8 L60,10 L70,5 L80,8 L90,2 L100,0 L100,20 Z" fill="url(#pnl-grad)" />
                        <defs><linearGradient id="pnl-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00ff88"/><stop offset="100%" stopColor="transparent"/></linearGradient></defs>
                    </svg>
                    <div className="flex justify-between items-start mb-1.5 relative z-10">
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-wider">Günlük Net PNL</p>
                        <TrendingUp className={`w-3 h-3 ${activeMetric === 'pnl' ? 'text-[#00ff88] animate-pulse' : 'text-zinc-600'}`} />
                    </div>
                    <div className="flex items-end gap-1.5 relative z-10">
                        <h3 className="text-base font-black text-white font-mono">₺165,420</h3>
                        <span className="text-[#00ff88] text-[9px] font-bold flex items-center mb-0.5"><ArrowUpRight className="w-2 h-2" /> 12.5%</span>
                    </div>
                </button>

                <button 
                    onClick={() => setActiveMetric('risk')}
                    className={`text-left bg-[#0b0c10] border transition-all rounded p-2 shadow-sm relative overflow-hidden group ${activeMetric === 'risk' ? 'border-[#ef4444]/50 shadow-[0_0_10px_rgba(239,68,68,0.1)] bg-[#ef4444]/5' : 'border-white/5 hover:border-[#ef4444]/30'}`}
                >
                    <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 group-hover:opacity-40 transition-opacity" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,20 L15,10 L30,15 L45,5 L60,12 L75,2 L90,8 L100,0 L100,20 Z" fill="url(#risk-grad)" />
                        <defs><linearGradient id="risk-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="transparent"/></linearGradient></defs>
                    </svg>
                    <div className="flex justify-between items-start mb-1.5 relative z-10">
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-wider">Aktif Risk Yükü</p>
                        <ShieldAlert className={`w-3 h-3 ${activeMetric === 'risk' ? 'text-[#ef4444] animate-pulse' : 'text-zinc-600'}`} />
                    </div>
                    <div className="flex items-end gap-1.5 relative z-10">
                        <h3 className="text-base font-black text-white font-mono">₺45,200</h3>
                        <span className="text-[#ef4444] text-[9px] font-bold flex items-center mb-0.5"><ArrowUpRight className="w-2 h-2" /> 5.2%</span>
                    </div>
                </button>

                <button 
                    onClick={() => setActiveMetric('players')}
                    className={`text-left bg-[#0b0c10] border transition-all rounded p-2 shadow-sm relative overflow-hidden group ${activeMetric === 'players' ? 'border-[#3b82f6]/50 shadow-[0_0_10px_rgba(59,130,246,0.1)] bg-[#3b82f6]/5' : 'border-white/5 hover:border-[#3b82f6]/30'}`}
                >
                    <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 group-hover:opacity-40 transition-opacity" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,20 L20,18 L40,12 L60,15 L80,5 L100,2 L100,20 Z" fill="url(#players-grad)" />
                        <defs><linearGradient id="players-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="transparent"/></linearGradient></defs>
                    </svg>
                    <div className="flex justify-between items-start mb-1.5 relative z-10">
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-wider">Aktif Oyuncu</p>
                        <Users className={`w-3 h-3 ${activeMetric === 'players' ? 'text-[#3b82f6] animate-pulse' : 'text-zinc-600'}`} />
                    </div>
                    <div className="flex items-end gap-1.5 relative z-10">
                        <h3 className="text-base font-black text-white font-mono">1,204</h3>
                        <span className="text-zinc-400 text-[9px] font-bold mb-0.5">Anlık</span>
                    </div>
                </button>

                <div className="bg-[#0b0c10] border border-white/5 hover:border-[#eab308]/30 transition-colors rounded p-2 shadow-sm relative overflow-hidden group">
                    <svg className="absolute bottom-0 left-0 w-full h-1/2 opacity-20 group-hover:opacity-40 transition-opacity" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <path d="M0,20 L15,18 L30,19 L45,15 L60,16 L75,12 L90,14 L100,10 L100,20 Z" fill="url(#pending-grad)" />
                        <defs><linearGradient id="pending-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#eab308"/><stop offset="100%" stopColor="transparent"/></linearGradient></defs>
                    </svg>
                    <div className="flex justify-between items-start mb-1.5 relative z-10">
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-wider">Bekleyen İşlem</p>
                        <Zap className="w-3 h-3 text-[#eab308]" />
                    </div>
                    <div className="flex items-end gap-1.5 relative z-10">
                        <h3 className="text-base font-black text-white font-mono">3</h3>
                        <span className="text-zinc-400 text-[9px] font-bold mb-0.5">Manuel Onay</span>
                    </div>
                </div>
                
                <div className="bg-[#0b0c10] border border-white/5 hover:border-[#10b981]/30 transition-colors rounded p-2 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-1.5">
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-wider">Ort. Çekim Onayı</p>
                        <TrendingUp className="w-3 h-3 text-[#10b981]" />
                    </div>
                    <div className="flex items-end gap-1.5">
                        <h3 className="text-base font-black text-white font-mono">4.2<span className="text-xs">dk</span></h3>
                        <span className="text-[#10b981] text-[9px] font-bold mb-0.5">SLA: HARİKA</span>
                    </div>
                </div>

                <div className="bg-[#0b0c10] border border-white/5 hover:border-[#8b5cf6]/30 transition-colors rounded p-2 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-1.5">
                        <p className="text-zinc-500 text-[9px] font-black uppercase tracking-wider">Destek Sırası</p>
                        <Users className="w-3 h-3 text-[#8b5cf6]" />
                    </div>
                    <div className="flex items-end gap-1.5">
                        <h3 className="text-base font-black text-white font-mono">12</h3>
                        <span className="text-zinc-400 text-[9px] font-bold mb-0.5">Bekleme: 1.5dk</span>
                    </div>
                </div>
            </div>

            {/* Main Area: Chart & Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-[220px]">
                
                {/* Dynamic Chart */}
                <div className="lg:col-span-2 bg-[#0b0c10] border border-white/5 rounded p-3 shadow-sm flex flex-col relative">
                    
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-wider">
                            {activeMetric === 'pnl' && 'Net PNL Eğrisi'}
                            {activeMetric === 'risk' && 'Aktif Risk Yükü'}
                            {activeMetric === 'players' && 'Oyuncu Trafiği'}
                        </h3>
                        <div className="flex gap-1.5 text-[8px] font-bold">
                            <button className="bg-white/10 text-white px-1.5 py-0.5 rounded">12S</button>
                            <button className="text-zinc-500 hover:text-white px-1.5 py-0.5">24S</button>
                            <button className="text-zinc-500 hover:text-white px-1.5 py-0.5">7G</button>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activeMetric === 'pnl' ? pnlData : activeMetric === 'risk' ? riskData : playersData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={activeMetric === 'pnl' ? '#00ff88' : activeMetric === 'risk' ? '#ef4444' : '#3b82f6'} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={activeMetric === 'pnl' ? '#00ff88' : activeMetric === 'risk' ? '#ef4444' : '#3b82f6'} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="time" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => activeMetric === 'players' ? value : `₺${value/1000}k`} />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '11px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: activeMetric === 'pnl' ? '#00ff88' : activeMetric === 'risk' ? '#ef4444' : '#3b82f6', fontWeight: 'bold' }}
                                    formatter={(value: number) => [activeMetric === 'players' ? value : `₺${value.toLocaleString()}`, activeMetric.toUpperCase()]}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke={activeMetric === 'pnl' ? '#00ff88' : activeMetric === 'risk' ? '#ef4444' : '#3b82f6'} 
                                    strokeWidth={3} 
                                    fillOpacity={1} 
                                    fill="url(#colorMetric)" 
                                    style={{ filter: `drop-shadow(0 0 8px ${activeMetric === 'pnl' ? 'rgba(0,255,136,0.3)' : activeMetric === 'risk' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'})` }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Activity Feed */}
                <div className="bg-[#0b0c10] border border-white/5 rounded p-3 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-zinc-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_5px_rgba(0,255,136,0.6)]"></span>
                            Canlı İşlem Akışı
                        </h3>
                        <div className="flex gap-1">
                            <button className="text-[7px] bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded text-zinc-300 transition-colors">TÜMÜ</button>
                            <button className="text-[7px] bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded text-[#eab308] transition-colors">UYARI</button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1.5 space-y-1">
                        {liveLogs.map((log) => (
                            <div key={log.id} className="text-[10px] font-mono p-2 rounded border border-white/5 bg-[#111216] animate-in fade-in slide-in-from-top-2 duration-300 hover:border-white/10 cursor-pointer flex items-start gap-2">
                                <div className="mt-0.5 text-xs">{log.icon || '🔹'}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider ${
                                            log.type === 'success' ? 'bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/20' : 
                                            log.type === 'warning' ? 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20' : 
                                            'bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20'
                                        }`}>
                                            {log.badge || 'SİSTEM'}
                                        </span>
                                        <span className="text-zinc-600 text-[9px]">{new Date(log.id).toLocaleTimeString('tr-TR')}</span>
                                    </div>
                                    <span className="text-zinc-300 leading-tight block">{log.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Area: API Health */}
            <div className="mt-4 bg-[#0b0c10] border border-white/5 rounded-lg p-4 shadow-lg mb-4">
                <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-3">Sağlayıcı (API) Sağlık Durumu</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                        { name: 'Evolution', ping: '12ms', status: 'optimal', color: '#00ff88' },
                        { name: 'Pragmatic Play', ping: '45ms', status: 'optimal', color: '#00ff88' },
                        { name: 'EGT', ping: '120ms', status: 'warning', color: '#eab308' },
                        { name: 'Sportsradar', ping: '18ms', status: 'optimal', color: '#00ff88' },
                        { name: 'NetEnt', ping: 'ERR', status: 'error', color: '#ef4444' }
                    ].map((api, i) => (
                        <div key={i} className="flex flex-col p-2 bg-[#111216] border border-white/5 rounded-lg hover:border-white/10 transition-colors">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-white text-[11px]">{api.name}</span>
                                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: api.color, boxShadow: `0 0 8px ${api.color}80` }}></div>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className={`text-[10px] font-mono font-bold`} style={{ color: api.color }}>{api.ping}</span>
                                <span className="text-[9px] text-zinc-500 uppercase">{api.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
