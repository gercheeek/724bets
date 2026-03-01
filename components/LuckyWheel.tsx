import React, { useState, useEffect, useRef } from 'react';
import { Gift, Timer, Zap, Trophy, TrendingUp, Smartphone, Gamepad2, Coins, ChevronRight, History, Star, Info } from 'lucide-react';
import { WheelReward } from '../types';

interface LuckyWheelProps {
    onSpinComplete?: (reward: WheelReward) => void;
    config?: {
        rewards: WheelReward[];
        spinCooldownHours: number;
        lastSpinTime: number;
    };
}

const DEFAULT_REWARDS: WheelReward[] = [
    { id: '1', label: '100 TL NAKİT', type: 'nakit', value: '100', weight: 10, color: '#10b981' },
    { id: '2', label: '50 FREESPIN', type: 'freespin', value: '50', weight: 20, color: '#3b82f6' },
    { id: '3', label: '1000 TL BONUS', type: 'bonus', value: '1000', weight: 5, color: '#8b5cf6' },
    { id: '4', label: 'PAS', type: 'pas', value: '0', weight: 15, color: '#4b5563' },
    { id: '5', label: 'PLAYSTATION 5', type: 'ps5', value: '1', weight: 1, color: '#ef4444' },
    { id: '6', label: '500 TL FREEBET', type: 'freebet', value: '500', weight: 10, color: '#f59e0b' },
    { id: '7', label: '50 TL NAKİT', type: 'nakit', value: '50', weight: 25, color: '#10b981' },
    { id: '8', label: 'IPHONE 17 PRO', type: 'iphone', value: '1', weight: 1, color: '#ef4444' },
];

const LuckyWheel: React.FC<LuckyWheelProps> = ({ onSpinComplete, config }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<WheelReward | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [canSpin, setCanSpin] = useState(false);

    const rewards = config?.rewards || DEFAULT_REWARDS;
    const cooldownMs = (config?.spinCooldownHours || 6) * 60 * 60 * 1000;
    const lastSpin = config?.lastSpinTime || 0;

    useEffect(() => {
        const timer = setInterval(() => {
            const now = Date.now();
            const diff = lastSpin + cooldownMs - now;

            if (diff <= 0) {
                setCanSpin(true);
                setTimeLeft('00:00:00');
            } else {
                setCanSpin(false);
                const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
                const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
                setTimeLeft(`${h}:${m}:${s}`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [lastSpin, cooldownMs]);

    const handleSpin = () => {
        if (!canSpin || isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        // Weighted random selection
        const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
        let random = Math.random() * totalWeight;
        let selectedIdx = 0;

        for (let i = 0; i < rewards.length; i++) {
            random -= rewards[i].weight;
            if (random <= 0) {
                selectedIdx = i;
                break;
            }
        }

        const reward = rewards[selectedIdx];
        const segmentAngle = 360 / rewards.length;
        const extraSpins = 5 + Math.floor(Math.random() * 5);
        // Calculate final rotation to stop at the middle of the selected segment
        // Note: wheel starts at 0, arrow is at top (270deg offset logic common in wheels)
        const targetRotation = rotation + (extraSpins * 360) + (selectedIdx * segmentAngle) + (segmentAngle / 2);

        setRotation(targetRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setResult(reward);
            onSpinComplete?.(reward);
        }, 5000);
    };

    return (
        <div className="relative min-h-screen bg-[#0B0B0F] overflow-hidden pt-32 pb-20 px-6">
            <div className="absolute inset-0 premium-bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#FFC107]/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="relative max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Side: Stats and Info */}
                <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
                    <div className="glass-card p-8 rounded-[32px] border-[#FFC107]/10">
                        <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 text-[#FFC107]" /> KAZANIM SEVİYESİ
                        </h3>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black text-white italic">
                                    <span>500 TL YATIRIM</span>
                                    <span className="text-[#FFC107]">0 / 500</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[20%] bg-gradient-to-r from-[#FFC107] to-amber-400 rounded-full shadow-[0_0_15px_rgba(255,193,7,0.3)]" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black text-white italic">
                                    <span>5000 TL YATIRIM</span>
                                    <span className="text-zinc-600">0 / 5000</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[5%] bg-zinc-800 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                                * Her yatırımınız sizi bir üst kazanım seviyesine taşır ve çark ödüllerini katlar.
                            </p>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[32px] border-[#FFC107]/10">
                        <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <Star className="w-3.5 h-3.5 text-[#FFC107]" /> SEMBOL ÖDÜLLERİ
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'IPHONE 17 PRO MAX', progress: '2 / 5', icon: <Smartphone className="w-4 h-4" /> },
                                { label: 'PLAYSTATION 5', progress: '0 / 3', icon: <Gamepad2 className="w-4 h-4" /> },
                                { label: '5000₺ NAKİT', progress: '0 / 3', icon: <Coins className="w-4 h-4" /> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-black rounded-lg text-[#FFC107]">{item.icon}</div>
                                        <span className="text-[11px] font-bold text-white tracking-tight">{item.label}</span>
                                    </div>
                                    <span className="text-[10px] font-black text-[#FFC107]">{item.progress}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center: The Wheel */}
                <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
                    <div className="text-center mb-12 animate-fade-in-up">
                        <h2 className="text-[42px] md:text-[56px] font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                            ŞANS <span className="text-[#FFC107]">ÇARKI</span>
                        </h2>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FFC107]/50" />
                            <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-[0.4em]">HAZİNEYİ KEŞFET</p>
                            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#FFC107]/50" />
                        </div>
                    </div>

                    <div className="relative group">
                        {/* Wheel Container */}
                        <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] rounded-full p-4 bg-gradient-to-b from-amber-400 to-[#FFC107] shadow-[0_0_80px_rgba(255,193,7,0.2)] animate-float">
                            <div className="absolute inset-2 md:inset-4 rounded-full bg-[#111118] border-8 border-[#0B0B0F]/50 flex items-center justify-center overflow-hidden">
                                {/* The Spinning Core */}
                                <div
                                    className="relative w-full h-full transition-transform duration-[5000ms] cubic-bezier(0.15, 0, 0.15, 1)"
                                    style={{ transform: `rotate(-${rotation}deg)` }}
                                >
                                    {rewards.map((reward, i) => (
                                        <div
                                            key={reward.id}
                                            className="absolute top-0 left-1/2 -ml-[1px] w-[2px] h-[50%] origin-bottom"
                                            style={{ transform: `rotate(${(i * (360 / rewards.length))}deg)` }}
                                        >
                                            <div
                                                className="absolute top-0 left-[-150px] w-[300px] text-center pt-8 md:pt-12"
                                                style={{ transform: `rotate(${((360 / rewards.length) / 2)}deg)` }}
                                            >
                                                <span className="text-[10px] md:text-xs font-black text-white italic uppercase tracking-tighter whitespace-nowrap opacity-80"
                                                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                                    {reward.label}
                                                </span>
                                            </div>
                                            {/* Divider lines */}
                                            <div className="w-full h-full bg-white/10" />
                                        </div>
                                    ))}
                                </div>

                                {/* Gradient Overlay for segments */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFC107]/5 to-transparent pointer-events-none" />
                            </div>

                            {/* Center Badge */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#111118] border-4 border-[#FFC107] shadow-[0_0_30px_rgba(255,193,7,0.5)] z-20 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-[#FFC107] mb-1" />
                                    <span className="text-[8px] md:text-[10px] font-black text-white italic">724</span>
                                </div>
                            </div>

                            {/* Needle / Selector */}
                            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-8 h-12 md:w-10 md:h-14 z-30 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
                                <div className="w-full h-full bg-[#FFC107] clip-path-needle shadow-[inset_0_2px_5px_rgba(255,255,255,0.5)]"
                                    style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }} />
                            </div>
                        </div>

                        {/* Spin Controls */}
                        <div className="mt-16 flex flex-col items-center gap-6">
                            <div className="flex items-center gap-4 bg-[#111118] border border-white/5 px-8 py-4 rounded-2xl shadow-xl">
                                <Timer className="w-5 h-5 text-[#FFC107]" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">YENİ HAK İÇİN KALAN</span>
                                    <span className="text-lg font-black text-white italic tracking-widest font-mono">{timeLeft}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSpin}
                                disabled={!canSpin || isSpinning}
                                className={`group relative h-20 px-20 rounded-[28px] font-black text-lg uppercase tracking-tight transition-all duration-500 flex items-center justify-center gap-3 overflow-hidden
                                ${canSpin && !isSpinning
                                        ? 'bg-[#FFC107] text-black shadow-[0_20px_50px_rgba(255,193,7,0.3)] hover:shadow-[0_25px_60px_rgba(255,193,7,0.5)] hover:-translate-y-1 active:scale-95'
                                        : 'bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <Zap className={`w-6 h-6 ${canSpin && !isSpinning ? 'animate-pulse' : ''}`} />
                                {isSpinning ? 'ŞANSIN DÖNÜYOR...' : 'ŞİMDİ ÇEVİR'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: History and Activity */}
                <div className="lg:col-span-3 space-y-8 order-3">
                    <div className="glass-card p-8 rounded-[32px] border-[#FFC107]/10 h-fit">
                        <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                            <History className="w-3.5 h-3.5 text-[#FFC107]" /> CANLI KAZANIMLAR
                        </h3>
                        <div className="space-y-4 max-h-[400px] overflow-hidden">
                            {[
                                { user: 'Ahmet***', reward: '500 TL Freebet', time: '2 dk önce' },
                                { user: 'Selin***', reward: '100 TL Nakit', time: '5 dk önce' },
                                { user: 'Mehmet***', reward: '50 Freespin', time: '12 dk önce' },
                                { user: 'Buse***', reward: '1000 TL Bonus', time: '15 dk önce' },
                                { user: 'Can***', reward: '50 TL Nakit', time: '20 dk önce' },
                                { user: 'Deniz***', reward: '100 TL Freebet', time: '25 dk önce' }
                            ].map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 animate-fade-in-up"
                                    style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[11px] font-black text-white italic">{log.user}</span>
                                        <span className="text-[10px] font-bold text-[#FFC107] uppercase">{log.reward}</span>
                                    </div>
                                    <span className="text-[9px] text-zinc-600 font-bold">{log.time}</span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-black text-[10px] uppercase rounded-2xl transition-all flex items-center justify-center gap-2 tracking-widest">
                            TÜM GEÇMİŞİ GÖR <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="glass-card p-6 rounded-[28px] bg-gradient-to-br from-[#FFC107]/10 to-transparent border-[#FFC107]/20">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-[#FFC107] rounded-xl text-black">
                                <Info className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-xs uppercase italic mb-1">NASIL ÇALIŞIR?</h4>
                                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                                    Her 6 saatte bir siteye gelerek ücretsiz çevrim hakkı kazanın. Yatırım yaptıkça sembol ödüllere ve daha büyük nakit hediyelere yaklaşın!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Reward Modal / Toast (Simulated) */}
            {result && !isSpinning && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setResult(null)} />
                    <div className="relative glass-card w-full max-w-lg p-12 rounded-[48px] text-center border-[#FFC107]/30 shadow-[0_0_100px_rgba(255,193,7,0.2)] animate-scale-in">
                        <div className="w-24 h-24 bg-[#FFC107] rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,193,7,0.5)]">
                            <Trophy className="w-12 h-12 text-black" />
                        </div>
                        <h3 className="text-zinc-500 font-black text-sm uppercase tracking-[0.4em] mb-2 italic">TEBRİKLER!</h3>
                        <div className="text-[42px] md:text-[56px] font-black text-white italic uppercase tracking-tighter leading-none mb-8">
                            {result.label} <span className="text-[#FFC107]">KAZANDIN!</span>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium italic mb-10 max-w-xs mx-auto">
                            Ödülünüz hesabınıza tanımlanmıştır. Bol şanslar dileriz!
                        </p>
                        <button
                            onClick={() => setResult(null)}
                            className="w-full h-16 bg-[#FFC107] text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_15px_40px_rgba(255,193,7,0.3)] transition-all active:scale-95"
                        >
                            ÖDÜLÜ AL VE KAPAT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LuckyWheel;
