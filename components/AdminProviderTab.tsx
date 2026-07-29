import React from 'react';
import { Gamepad2, BarChart2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const providerData = [
    { name: 'Pragmatic Play', rtp: 96.5, games: 150, volume: 1500000 },
    { name: 'Hacksaw', rtp: 102.3, games: 45, volume: 850000 }, // Over 100% RTP (paying out too much)
    { name: 'Evolution', rtp: 98.2, games: 80, volume: 2200000 },
    { name: 'Play\'n GO', rtp: 94.1, games: 120, volume: 900000 },
    { name: 'NoLimit City', rtp: 95.8, games: 60, volume: 1100000 },
];

export default function AdminProviderTab() {
    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-y-auto custom-scrollbar bg-[#050608]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Gamepad2 className="w-6 h-6 text-[#a855f7]" />
                        Sağlayıcı & RTP Radarı
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1 font-mono">DURUM: <span className="text-[#a855f7]">CANLI ANALİZ</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
                {/* RTP Chart */}
                <div className="lg:col-span-2 bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col">
                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4" />
                        Son 24 Saat Gerçekleşen RTP Oranları
                    </h3>
                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={providerData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis domain={[90, 110]} stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `%${val}`} />
                                <RechartsTooltip 
                                    cursor={{fill: '#ffffff0a'}}
                                    contentStyle={{ backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    formatter={(value: number) => [`%${value}`, 'Gerçekleşen RTP']}
                                />
                                <defs>
                                    <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="4" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                <Bar dataKey="rtp" radius={[4, 4, 0, 0]}>
                                    {providerData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.rtp > 100 ? '#ef4444' : '#a855f7'} 
                                            style={{ filter: entry.rtp > 100 ? 'url(#glow-red)' : 'url(#glow-purple)' }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Heatmap & Alerts */}
                <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col">
                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        Oyun Isı Haritası & Alarmlar
                    </h3>
                    
                    {/* Active Alert */}
                    <div className="p-4 border border-[#ef4444]/30 bg-[#ef4444]/10 rounded-xl mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[#ef4444] font-bold">RTP Anomalisi Tespit Edildi</h4>
                                <p className="text-sm text-zinc-300 mt-1">
                                    <span className="font-bold text-white">Hacksaw</span> sağlayıcısının oyunları son 4 saatte beklenenden daha yüksek dağıtım yapıyor (Gerçekleşen RTP: %102.3).
                                </p>
                            </div>
                        </div>
                    </div>

                    <h4 className="text-xs text-zinc-500 font-bold uppercase mb-3">En Çok Kâr Bırakan Sağlayıcılar</h4>
                    <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                        {[...providerData].sort((a, b) => a.rtp - b.rtp).map((p, idx) => {
                            const iconMap: Record<string, string> = { 'Pragmatic Play': '🎰', 'Hacksaw': '🔪', 'Evolution': '🎲', 'Play\'n GO': '🃏', 'NoLimit City': '💥' };
                            const icon = iconMap[p.name] || '🎮';
                            return (
                                <div key={idx} className="flex items-center justify-between p-3 bg-[#111216] border border-white/5 rounded-lg group hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-lg group-hover:bg-white/10 transition-colors">
                                            {icon}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-sm">{p.name}</div>
                                            <div className="text-xs text-zinc-500 mt-0.5">Hacim: ₺{(p.volume/1000).toFixed(0)}k</div>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-bold font-mono ${p.rtp > 100 ? 'text-[#ef4444] drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-[#00ff88] drop-shadow-[0_0_5px_rgba(0,255,136,0.8)]'}`}>
                                        %{p.rtp}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
