import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, AlertTriangle, AlertCircle, Crosshair, ArrowUpRight, TrendingDown, Eye } from 'lucide-react';

interface LiveBet {
    id: string;
    time: Date;
    player: string;
    game: string;
    wager: number;
    multiplier: number;
    payout: number;
    isWin: boolean;
}

interface FraudAlert {
    id: string;
    time: Date;
    type: 'high_roller' | 'win_streak' | 'suspicious_ip';
    title: string;
    description: string;
    severity: 'yellow' | 'red';
}

const GAMES = ['Gates of Olympus', 'Sweet Bonanza', 'Roulette', 'Blackjack', 'Crash', 'Plinko', 'Dice'];
const PLAYERS = ['crypto_king', 'bet_master99', 'lucky_strike', 'whale_007', 'anon_user', 'jackpot_hunter'];

export default function AdminLiveRadarTab() {
    const [liveBets, setLiveBets] = useState<LiveBet[]>([]);
    const [alerts, setAlerts] = useState<FraudAlert[]>([]);

    useEffect(() => {
        // Initial mock data
        setLiveBets([
            generateMockBet(), generateMockBet(), generateMockBet()
        ].sort((a, b) => b.time.getTime() - a.time.getTime()));

        // Simulation Interval
        const interval = setInterval(() => {
            const newBet = generateMockBet();
            
            setLiveBets(prev => {
                const updated = [newBet, ...prev];
                return updated.slice(0, 30); // Keep last 30 bets
            });

            // Randomly generate an alert (15% chance per tick)
            if (Math.random() < 0.15 || newBet.wager >= 5000) {
                generateAlert(newBet);
            }

        }, 2000); // New bet every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const generateMockBet = (): LiveBet => {
        const isWin = Math.random() < 0.3; // 30% win rate
        const wager = Math.floor(Math.random() * (Math.random() < 0.9 ? 1000 : 8000)) + 10;
        const multiplier = isWin ? (Math.random() * 10 + 1.1) : 0;
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            time: new Date(),
            player: PLAYERS[Math.floor(Math.random() * PLAYERS.length)] + Math.floor(Math.random() * 100),
            game: GAMES[Math.floor(Math.random() * GAMES.length)],
            wager: wager,
            multiplier: Number(multiplier.toFixed(2)),
            payout: isWin ? wager * multiplier : 0,
            isWin
        };
    };

    const generateAlert = (triggerBet: LiveBet) => {
        const types = ['high_roller', 'win_streak', 'suspicious_ip'];
        let type = types[Math.floor(Math.random() * types.length)];
        let title = '';
        let description = '';
        let severity: 'yellow' | 'red' = 'yellow';

        // Force high roller if wager >= 5000
        if (triggerBet.wager >= 5000) {
            type = 'high_roller';
        }

        switch (type) {
            case 'high_roller':
                title = 'Yüksek Hacim (High Roller)';
                description = `${triggerBet.player} tek seferde ${triggerBet.wager.toLocaleString('tr-TR')} ₺ bahis aldı!`;
                severity = triggerBet.wager >= 10000 ? 'red' : 'yellow';
                break;
            case 'win_streak':
                title = 'Anormal Kazanç Serisi';
                description = `${triggerBet.player} üst üste yüksek çarpan yakalıyor. Son 5 elde %400 büyüme!`;
                severity = 'yellow';
                break;
            case 'suspicious_ip':
                title = 'Şüpheli İşlem (Multi-Account)';
                description = `Aynı IP (192.168.1.${Math.floor(Math.random() * 255)}) üzerinden 3 farklı hesap giriş denemesi!`;
                severity = 'red';
                break;
        }

        const newAlert: FraudAlert = {
            id: Math.random().toString(36).substr(2, 9),
            time: new Date(),
            type: type as any,
            title,
            description,
            severity
        };

        setAlerts(prev => {
            const updated = [newAlert, ...prev];
            return updated.slice(0, 15); // Keep last 15 alerts
        });
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);

    return (
        <div className="p-4 sm:p-6 text-white h-full flex flex-col relative">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/50 relative">
                        <Crosshair className="w-6 h-6 text-indigo-400" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-2">
                            Canlı Radar <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-black animate-pulse">LIVE</span>
                        </h2>
                        <p className="text-sm text-zinc-400">Sistemdeki tüm canlı hareketler ve risk analizleri</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00E5FF]"></div> Sinyal Alınıyor</div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> AI Devrede</div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                
                {/* LEFT COLUMN: Live Bets Feed */}
                <div className="bg-[#111318] border border-zinc-800 rounded-2xl p-5 flex flex-col h-full shadow-lg shadow-black/50 overflow-hidden">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#00E5FF]" />
                        Canlı Bahis Akışı
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {liveBets.map(bet => (
                            <div key={bet.id} className="animate-in slide-in-from-top-2 fade-in duration-300">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#15171e] border border-zinc-800 hover:border-zinc-700 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`text-xs font-mono w-14 text-zinc-500`}>
                                            {bet.time.toLocaleTimeString('tr-TR', { hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{bet.player}</div>
                                            <div className="text-xs text-zinc-400">{bet.game}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-3 text-sm font-mono">
                                            <span className="text-zinc-400">{formatCurrency(bet.wager)}</span>
                                            {bet.isWin ? (
                                                <>
                                                    <span className="text-[#00E5FF] font-bold bg-[#00E5FF]/10 px-1.5 py-0.5 rounded">{bet.multiplier}x</span>
                                                    <span className="text-[#00E5FF] font-black">{formatCurrency(bet.payout)}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-zinc-600 px-1.5 py-0.5 rounded">0.00x</span>
                                                    <span className="text-zinc-600">{formatCurrency(0)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: Fraud Alerts */}
                <div className="bg-[#111318] border border-zinc-800 rounded-2xl p-5 flex flex-col h-full shadow-lg shadow-black/50 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all"></div>
                    
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 relative z-10">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        Risk & Dolandırıcılık Alarmları
                    </h3>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent relative z-10">
                        {alerts.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 gap-3">
                                <ShieldAlert className="w-12 h-12 opacity-20" />
                                <p className="text-sm font-medium">Şu an için sistem temiz.</p>
                            </div>
                        )}
                        {alerts.map(alert => (
                            <div key={alert.id} className="animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-lg ${
                                    alert.severity === 'red' 
                                    ? 'bg-red-500/10 border-red-500/30 shadow-red-500/10' 
                                    : 'bg-amber-500/10 border-amber-500/30 shadow-amber-500/10'
                                }`}>
                                    <div className="mt-1">
                                        {alert.severity === 'red' 
                                            ? <AlertCircle className="w-5 h-5 text-red-400" />
                                            : <AlertTriangle className="w-5 h-5 text-zinc-300" />
                                        }
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className={`font-bold text-sm ${alert.severity === 'red' ? 'text-red-400' : 'text-zinc-300'}`}>
                                                {alert.title}
                                            </h4>
                                            <span className="text-xs font-mono opacity-50 text-white">
                                                {alert.time.toLocaleTimeString('tr-TR')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-300 leading-relaxed">
                                            {alert.description}
                                        </p>
                                        <div className="mt-3 flex items-center gap-2">
                                            <button className="text-xs px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/5 flex items-center gap-1.5">
                                                <Eye className="w-3 h-3" /> İncele
                                            </button>
                                            <button className="text-xs px-3 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors border border-white/5 flex items-center gap-1.5">
                                                Yok Say
                                            </button>
                                        </div>
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
