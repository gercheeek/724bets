import React, { useState, useEffect } from 'react';
import { Target, Activity, AlertCircle, ArrowUpRight, ArrowDownRight, UserCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const pnlData = [
    { time: '00:00', amount: 45000 },
    { time: '04:00', amount: 32000 },
    { time: '08:00', amount: -15000 },
    { time: '12:00', amount: 12000 },
    { time: '16:00', amount: 55000 },
    { time: '20:00', amount: 89000 },
    { time: '24:00', amount: 105000 },
];

const mockHighRollers = [
    { id: 1, user: 'VIP_Kral', game: 'Sweet Bonanza', bet: 25000, payout: 0, time: '1sn önce' },
    { id: 2, user: 'CryptoBoss', game: 'Baccarat Live', bet: 50000, payout: 100000, time: '12sn önce' },
    { id: 3, user: 'Whale_99', game: 'Roulette', bet: 12000, payout: 36000, time: '45sn önce' },
    { id: 4, user: 'AhmetVIP', game: 'Gates of Olympus', bet: 15000, payout: 0, time: '1dk önce' },
    { id: 5, user: 'Dubaian', game: 'Blackjack', bet: 100000, payout: 250000, time: '2dk önce' },
];

export default function AdminWhaleTab() {
    const [liveBets, setLiveBets] = useState(mockHighRollers);

    // Simulate Live Bets Feed
    useEffect(() => {
        const interval = setInterval(() => {
            const games = ['Sweet Bonanza', 'Baccarat Live', 'Roulette', 'Gates of Olympus', 'Blackjack', 'Crazy Time'];
            const users = ['VIP_Kral', 'CryptoBoss', 'Whale_99', 'AhmetVIP', 'Dubaian', 'HighRoller23', 'Satoshi_Tr'];
            
            const bet = Math.floor(Math.random() * 50000) + 10000;
            const isWin = Math.random() > 0.6;
            const multiplier = isWin ? (Math.random() * 3 + 1) : 0;
            const payout = Math.floor(bet * multiplier);

            const newBet = {
                id: Date.now(),
                user: users[Math.floor(Math.random() * users.length)],
                game: games[Math.floor(Math.random() * games.length)],
                bet,
                payout,
                time: 'Şimdi'
            };
            
            setLiveBets(prev => [newBet, ...prev].slice(0, 8));
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-y-auto custom-scrollbar bg-[#050608]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Target className="w-6 h-6 text-[#3b82f6]" />
                        VIP Balina Radarı
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1 font-mono">DURUM: <span className="text-[#3b82f6]">AKTİF İZLEME</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
                
                {/* PNL Chart */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden group">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Bugünkü VIP P&L</p>
                                <Activity className="w-4 h-4 text-[#00ff88]" />
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-3xl font-black text-white font-mono">₺105,000</h3>
                                <span className="text-[#00ff88] text-xs font-bold flex items-center mb-1"><ArrowUpRight className="w-3 h-3" /> +15%</span>
                            </div>
                        </div>

                        <div className="bg-[#0b0c10] border border-[#ef4444]/20 rounded-xl p-5 shadow-lg relative overflow-hidden group animate-pulse">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[#ef4444] text-xs font-bold uppercase tracking-wider">Otomatik VIP Aksiyonu</p>
                                <AlertCircle className="w-4 h-4 text-[#ef4444]" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg">
                                   <UserCheck className="w-6 h-6 text-zinc-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">"VIP_Kral" Kayıp Serisinde</h3>
                                    <p className="text-xs text-zinc-400">%15 Cashback Teklif Et</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex-1 flex flex-col min-h-[300px]">
                        <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-6">VIP Kümülatif P&L (Son 24 Saat)</h3>
                        <div className="flex-1 w-full min-h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={pnlData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorWhalePnl" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                    <XAxis dataKey="time" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${value/1000}k`} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                        formatter={(value: number) => [`₺${value.toLocaleString()}`, 'VIP PNL']}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWhalePnl)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* High Roller Bets */}
                <div className="bg-[#0b0c10] border border-white/5 rounded-xl p-5 shadow-lg flex flex-col overflow-hidden">
                    <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse"></span>
                        High Roller Canlı Akış
                    </h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {liveBets.map((bet) => (
                            <div key={bet.id} className="p-3 rounded border border-white/5 bg-[#111216] flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-white flex items-center gap-2">
                                        <span className="p-1 bg-[#3b82f6]/20 text-[#3b82f6] rounded text-[9px] uppercase tracking-wider">VIP</span>
                                        {bet.user}
                                    </span>
                                    <span className="text-[10px] text-zinc-500">{bet.time}</span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs text-zinc-400">{bet.game}</span>
                                    <div className="text-right flex items-center gap-2">
                                        <span className="text-xs font-mono text-zinc-300">₺{bet.bet.toLocaleString()}</span>
                                        {bet.payout > 0 ? (
                                            <span className="text-sm font-black font-mono text-[#00ff88] flex items-center gap-0.5">
                                                <ArrowUpRight className="w-3 h-3" />
                                                ₺{bet.payout.toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="text-xs font-bold font-mono text-zinc-600 flex items-center gap-0.5">
                                                <ArrowDownRight className="w-3 h-3" />
                                                ₺0
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
