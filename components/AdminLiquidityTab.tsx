import React, { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, PieChart, TrendingUp, AlertTriangle } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const cryptoBalances = [
    { name: 'Bitcoin (BTC)', value: 4500000, color: '#f7931a' },
    { name: 'Ethereum (ETH)', value: 2800000, color: '#627eea' },
    { name: 'Tether (USDT)', value: 8500000, color: '#26a17b' },
    { name: 'Tron (TRX)', value: 1200000, color: '#ff0013' },
];

export default function AdminLiquidityTab() {
    const totalAssets = cryptoBalances.reduce((acc, curr) => acc + curr.value, 0);
    const totalLiabilities = 11500000; // Kullanıcıların toplam bakiyesi
    const liquidityRatio = ((totalAssets / totalLiabilities) * 100).toFixed(2);
    
    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative overflow-y-auto custom-scrollbar bg-[#050608]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-white/5 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-[#26a17b]" />
                        Kripto Likidite Matrisi
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1 font-mono">GÜVENLİK: <span className="text-[#26a17b]">SÜPER ADMİN YETKİSİ ONAYLANDI</span></p>
                </div>
            </div>

            {/* KPIs - Compact V3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-[#0b0c10] border border-white/5 rounded-lg p-3 shadow-md relative overflow-hidden group hover:border-[#00ff88]/30 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Toplam Sıcak Cüzdan (Assets)</p>
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00ff88]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-xl font-black text-white font-mono">₺{(totalAssets / 1000000).toFixed(1)}M</h3>
                    </div>
                </div>

                <div className="bg-[#0b0c10] border border-[#ef4444]/20 rounded-lg p-3 shadow-md relative overflow-hidden group hover:border-[#ef4444]/50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[#ef4444] text-[10px] font-black uppercase tracking-wider">Kullanıcı Bakiyesi (Liabilities)</p>
                        <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-xl font-black text-white font-mono">₺{(totalLiabilities / 1000000).toFixed(1)}M</h3>
                    </div>
                </div>

                <div className="bg-[#0b0c10] border border-[#3b82f6]/20 rounded-lg p-3 shadow-md relative overflow-hidden group hover:border-[#3b82f6]/50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-[#3b82f6] text-[10px] font-black uppercase tracking-wider">Likidite Karşılama Oranı</p>
                        <TrendingUp className="w-3.5 h-3.5 text-[#3b82f6]" />
                    </div>
                    <div className="flex items-end gap-2">
                        <h3 className="text-xl font-black text-[#00ff88] font-mono">%{liquidityRatio}</h3>
                        <span className="text-zinc-400 text-[10px] font-bold mb-0.5">GÜVENLİ BÖLGE</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                {/* Hot Wallets Distribution */}
                <div className="bg-[#0b0c10] border border-white/5 rounded-lg p-3 shadow-md flex flex-col">
                    <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                        <PieChart className="w-3.5 h-3.5" />
                        Sıcak Cüzdan Dağılımı
                    </h3>
                    <div className="flex-1 w-full min-h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={cryptoBalances}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {cryptoBalances.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip 
                                    formatter={(value: number) => `₺${(value/1000000).toFixed(1)}M`}
                                    contentStyle={{ backgroundColor: '#111318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '11px' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Network Fees & Status */}
                <div className="bg-[#0b0c10] border border-white/5 rounded-lg p-3 shadow-md flex flex-col">
                     <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-3">Ağ Durumu ve Gas Ücretleri</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                         {cryptoBalances.map((coin, idx) => (
                             <div key={idx} className="flex flex-col justify-center p-2 bg-[#111216] border border-white/5 rounded-lg">
                                 <div className="flex items-center gap-2 mb-1">
                                     <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: coin.color, boxShadow: `0 0 8px ${coin.color}80` }}></div>
                                     <span className="font-bold text-white text-[11px]">{coin.name}</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                     <span className="text-[9px] text-zinc-500">Ağ: <span className={`font-bold ${idx === 1 ? 'text-[#ef4444]' : 'text-[#00ff88]'}`}>{idx === 1 ? 'YÜKSEK' : 'NORMAL'}</span></span>
                                     <span className="text-[9px] text-zinc-400">{idx === 0 ? '10-20 dk' : idx === 3 ? 'Anında' : '1-3 dk'}</span>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
    );
}
