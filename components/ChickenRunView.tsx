import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const DIFFICULTIES = {
    'Kolay': [1.10, 1.25, 1.45, 1.65, 1.90, 2.20],
    'Orta': [1.15, 1.37, 1.64, 2.00, 2.46, 3.00],
    'Zor': [1.25, 1.55, 1.95, 2.45, 3.10, 4.00]
};

// Beautiful Vector Chicken SVG facing right
const ChickenSVG = ({ crashed }: { crashed: boolean }) => {
    if (crashed) return <div className="text-5xl text-center flex items-center justify-center w-full h-full">💥</div>;
    return (
        <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
            <g>
                {/* Back Leg */}
                <rect x="10" y="26" width="3" height="5" fill="#F59E0B" rx="1" />
                {/* Front Leg */}
                <rect x="16" y="26" width="3" height="5" fill="#F59E0B" rx="1" />
                {/* Body */}
                <rect x="4" y="12" width="18" height="15" fill="#FFFFFF" rx="4" />
                {/* Tail feathers */}
                <rect x="2" y="10" width="4" height="6" fill="#F3F4F6" rx="1" />
                {/* Head */}
                <rect x="16" y="4" width="12" height="14" fill="#FFFFFF" rx="4" />
                {/* Red Comb (Top) */}
                <rect x="18" y="0" width="8" height="5" fill="#EF4444" rx="2" />
                {/* Red Wattle (Below beak) */}
                <rect x="26" y="14" width="4" height="5" fill="#EF4444" rx="2" />
                {/* Yellow Beak */}
                <rect x="28" y="8" width="4" height="5" fill="#F59E0B" rx="1" />
                {/* Eye */}
                <rect x="22" y="7" width="3" height="4" fill="#111827" rx="1.5" />
                {/* Wing */}
                <rect x="8" y="16" width="10" height="7" fill="#E5E7EB" rx="3" />
            </g>
        </svg>
    );
};

export default function ChickenRunView({ siteUser, setSiteUser, onAuthRequired }: any) {
    const [betAmount, setBetAmount] = useState<number>(0);
    const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTIES>('Orta');
    const [isPlaying, setIsPlaying] = useState(false);
    const [step, setStep] = useState(0); 
    const [crashed, setCrashed] = useState(false);
    const [showExplosion, setShowExplosion] = useState(false);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const multipliers = DIFFICULTIES[difficulty];
    const lanes = multipliers.length;

    // Traffic simulation
    const [cars, setCars] = useState<Array<{id: number, lane: number, y: number, speed: number, color: string}>>([]);

    useEffect(() => {
        let animationFrameId: number;
        let lastTime = performance.now();
        const colors = ['#E12836', '#10b981', '#F59E0B', '#06b6d4', '#8B5CF6']; // Random car colors

        const updateCars = (time: number) => {
            const deltaTime = (time - lastTime) / 1000;
            lastTime = time;

            setCars(prevCars => {
                let newCars = prevCars.map(car => ({
                    ...car,
                    y: car.y + (car.speed * deltaTime)
                })).filter(car => car.y < 120); // Remove if off screen bottom (0 is top, 100 is bottom)

                // Very occasional traffic (approx 1 car every 4-5 seconds)
                if (Math.random() < 0.003 && newCars.length < 2) {
                    newCars.push({
                        id: Math.random(),
                        lane: Math.floor(Math.random() * lanes),
                        y: -20, // Start above screen
                        speed: 15 + Math.random() * 20, // % per second (slower, more manageable)
                        color: colors[Math.floor(Math.random() * colors.length)]
                    });
                }

                return newCars;
            });

            animationFrameId = requestAnimationFrame(updateCars);
        };

        animationFrameId = requestAnimationFrame(updateCars);
        return () => cancelAnimationFrame(animationFrameId);
    }, [lanes]);

    const handlePlay = () => {
        if (!siteUser) return onAuthRequired();
        if ((siteUser && siteUser.balance < betAmount)) {
            alert('Yetersiz Bakiye');
            return;
        }

        const newBalance = siteUser.balance - betAmount;
        setSiteUser({ ...siteUser, balance: newBalance });
        supabase.from('site_users').update({ balance: newBalance }).eq('id', siteUser.id).then();

        setIsPlaying(true);
        setCrashed(false);
        setShowExplosion(false);
        setWinAmount(null);
        setStep(0);
    };

    const handleNextStep = () => {
        if (!isPlaying || crashed) return;

        // Survive chance depends on difficulty
        const surviveChance = difficulty === 'Kolay' ? 0.90 : difficulty === 'Orta' ? 0.85 : 0.75;
        const survived = Math.random() < surviveChance;
        
        if (!survived) {
            setStep(prev => prev + 1); // Jump into the lane
            setCrashed(true); // Trigger crash car
            setIsPlaying(false);
            setWinAmount(0);
            
            // Show explosion slightly after the car spawns and hits
            setTimeout(() => {
                setShowExplosion(true);
            }, 300);
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleCashOut = () => {
        if (!isPlaying || crashed || step === 0) return;
        
        const won = betAmount * multipliers[step - 1];
        setWinAmount(won);
        setCrashed(true);
        setIsPlaying(false);

        if (siteUser) {
            const newBalance = siteUser.balance + won;
            setSiteUser({ ...siteUser, balance: newBalance });
            supabase.from('site_users').update({ balance: newBalance }).eq('id', siteUser.id).then();
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full bg-[#10171E] text-white font-sans overflow-y-auto md:overflow-hidden">
            
            {/* ── LEFT SIDEBAR (Controls) ── */}
            <div className="w-full md:w-[320px] bg-[#222E3A] border-r border-[#151D24] p-4 flex flex-col shrink-0 z-20 shadow-2xl order-2 md:order-1 h-auto md:h-full overflow-y-auto">
                
                {/* Tabs */}
                <div className="flex bg-[#151D24] rounded-full p-1 mb-6">
                    <button className="flex-1 bg-[#324555] text-white text-sm font-semibold rounded-full py-2 shadow-sm">Manuel</button>
                    <button className="flex-1 text-gray-400 hover:text-white text-sm font-semibold rounded-full py-2 transition-colors">Oto</button>
                </div>

                {/* Bet Amount */}
                <div className="mb-4 relative">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Bahis Tutarı</label>
                        <span className="text-xs text-gray-300 font-mono">${siteUser ? siteUser.balance.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex bg-[#151D24] rounded-md border border-[#2A3744] overflow-hidden focus-within:border-[#3D82F6] transition-colors">
                        <div className="px-3 flex items-center justify-center text-gray-400">$</div>
                        <input 
                            type="number" 
                            value={betAmount || ''}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            disabled={isPlaying}
                            placeholder="0.00"
                            className="flex-1 bg-transparent text-white font-mono text-sm py-3 outline-none"
                        />
                        <div className="flex">
                            <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#2A3744] transition-colors" onClick={() => setBetAmount(betAmount / 2)}>½</button>
                            <button className="px-3 text-xs font-bold text-gray-300 hover:bg-[#2A3744] border-l border-[#2A3744] transition-colors" onClick={() => setBetAmount(betAmount * 2)}>2x</button>
                        </div>
                    </div>
                </div>

                {/* Difficulty */}
                <div className="mb-6">
                    <label className="block text-xs text-gray-400 font-semibold mb-2">Zorluk Seviyesi</label>
                    <div className="relative">
                        <select 
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as keyof typeof DIFFICULTIES)}
                            disabled={isPlaying}
                            className="w-full bg-[#151D24] text-white text-sm font-semibold py-3 px-4 rounded-md appearance-none border border-[#2A3744] outline-none focus:border-[#3D82F6]"
                        >
                            <option value="Kolay">Kolay</option>
                            <option value="Orta">Orta</option>
                            <option value="Zor">Zor</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    {!isPlaying ? (
                        <button 
                            onClick={handlePlay}
                            className="w-full bg-[#3D82F6] hover:bg-[#2B6CE0] text-white font-bold py-3.5 rounded-md transition-colors shadow-lg"
                        >
                            Bahis
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={handleNextStep}
                                disabled={crashed || step >= lanes}
                                className="w-full bg-[#00E5FF] hover:bg-emerald-600 text-white font-bold py-3 rounded-md transition-colors shadow-lg"
                            >
                                {step === 0 ? 'Başla' : 'İlerle'}
                            </button>
                            <button 
                                onClick={handleCashOut}
                                disabled={crashed || step === 0}
                                className="w-full bg-[#324555] hover:bg-[#3d5466] text-white font-bold py-3 rounded-md transition-colors shadow-lg mt-2"
                            >
                                Bozdur (${(betAmount * (step > 0 ? multipliers[step-1] : 0)).toFixed(2)})
                            </button>
                        </>
                    )}
                </div>

                {/* Total Profit */}
                <div className="mt-4 pt-4 border-t border-[#151D24]">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs text-gray-400 font-semibold">Toplam Kâr ({step > 0 && !crashed ? multipliers[step-1].toFixed(2) : '1.00'}x)</label>
                        <span className="text-xs text-gray-300 font-mono">${winAmount ? winAmount.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="bg-[#151D24] rounded-md border border-[#2A3744] px-3 py-3 flex items-center">
                        <span className="text-gray-400 mr-2">$</span>
                        <span className="text-white font-mono text-sm">{winAmount ? winAmount.toFixed(2) : '0.00'}</span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT MAIN AREA (Centered Game Frame) ── */}
            <div className="flex-1 bg-[#10171E] relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-12 order-1 md:order-2 min-h-[400px] md:min-h-0">
                
                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl h-full max-h-[700px] bg-[#151C23] relative rounded-3xl shadow-2xl overflow-hidden flex border-[6px] border-[#1C252D]">
                    
                    {/* Left Sidewalk */}
                    <div className="w-[120px] bg-[#1C252D] border-r-[4px] border-[#25323D] relative flex flex-col items-center z-10">
                        {/* Traffic Light */}
                        <div className="mt-12 relative flex flex-col items-center">
                            <div className="w-16 h-8 bg-[#11181F] rounded-full p-1.5 flex gap-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10 border border-[#2A3642]">
                                <div className="w-5 h-5 rounded-full bg-yellow-500 shadow-[0_0_15px_#EAB308]" />
                                <div className="w-5 h-5 rounded-full bg-[#1A232A]" />
                            </div>
                            <div className="w-4 h-16 bg-[#25323D] -mt-2 rounded-b-sm border-x border-[#1A232A]" />
                            <div className="w-12 h-6 bg-[#25323D] -mt-1 rounded-full border border-[#1A232A]" />
                        </div>

                        {/* Crosswalk */}
                        <div className="absolute top-[60%] -right-[100px] w-[100px] h-32 flex flex-col justify-between py-2 z-0 opacity-20 pointer-events-none">
                            {[1,2,3,4].map(i => <div key={i} className="h-4 w-full bg-white rounded-full" />)}
                        </div>

                        {/* Bush */}
                        <div className="absolute bottom-[20%] w-20 h-16 bg-[#16272B] rounded-t-full rounded-b-3xl border-4 border-[#0F1C1F] flex items-center justify-center">
                             <div className="w-12 h-8 bg-[#1E363B] rounded-full opacity-50" />
                        </div>
                    </div>

                    {/* The Lanes */}
                    <div className="flex-1 flex relative">
                        {multipliers.map((mult, idx) => (
                            <div key={idx} className="flex-1 relative border-r border-dashed border-[#263544] flex flex-col justify-end items-center pb-[5%] z-0">
                                
                                {/* Manhole Cover */}
                                <div className="w-14 h-10 rounded-full border-[3px] border-[#212E3B] bg-[#182129] flex flex-col items-center justify-center gap-1 mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                                    <div className="w-8 h-0.5 bg-[#212E3B] rounded-full" />
                                    <div className="w-8 h-0.5 bg-[#212E3B] rounded-full" />
                                    <div className="w-8 h-0.5 bg-[#212E3B] rounded-full" />
                                </div>

                                {/* Multiplier Badge */}
                                <div className={`px-4 py-1.5 rounded-full font-mono text-sm font-bold shadow-lg transition-colors ${
                                    step > idx 
                                        ? 'bg-[#314354] text-[#89A1B8]' 
                                        : step === idx && isPlaying
                                            ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                                            : 'bg-[#222E3A] text-gray-400 border border-[#2B3A47]'
                                }`}>
                                    {mult.toFixed(2)}x
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Ambient Cars */}
                    {cars.map(car => (
                        <div key={car.id} 
                             className="absolute w-[60px] h-[100px] z-10 transition-transform"
                             style={{ 
                                 left: `calc(120px + (100% - 120px) / ${lanes} * ${car.lane} + ((100% - 120px) / ${lanes} - 60px) / 2)`,
                                 top: `${car.y}%`
                             }}>
                            <div className="w-full h-full relative">
                                <div className="absolute inset-0 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] border border-black/50" style={{ backgroundColor: car.color }} />
                                <div className="absolute top-[20%] left-[10%] right-[10%] h-[15%] bg-[#1A242D] rounded-t-lg rounded-b-sm border-t-2 border-white/20" />
                                <div className="absolute bottom-[20%] left-[15%] right-[15%] h-[10%] bg-[#1A242D] rounded-b-lg rounded-t-sm" />
                                <div className="absolute top-1 left-[15%] w-3 h-2 bg-yellow-100 rounded-full blur-[1px]" />
                                <div className="absolute top-1 right-[15%] w-3 h-2 bg-yellow-100 rounded-full blur-[1px]" />
                                <div className="absolute bottom-1 left-[15%] w-3 h-2 bg-red-400 rounded-full" />
                                <div className="absolute bottom-1 right-[15%] w-3 h-2 bg-red-400 rounded-full" />
                                <div className="absolute top-[30%] -left-1.5 w-2 h-4 bg-black/50 rounded-l-md" />
                                <div className="absolute top-[30%] -right-1.5 w-2 h-4 bg-black/50 rounded-r-md" />
                            </div>
                        </div>
                    ))}

                    {/* The Killer Car */}
                    {crashed && winAmount === 0 && step > 0 && (
                        <div className="absolute w-[60px] h-[100px] z-30 pointer-events-none"
                             style={{ 
                                 left: `calc(120px + (100% - 120px) / ${lanes} * ${step - 1} + ((100% - 120px) / ${lanes} - 60px) / 2)`,
                                 animation: 'killerCarDrive 0.6s linear forwards'
                             }}>
                            <div className="w-full h-full relative">
                                <div className="absolute inset-0 bg-[#E12836] rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.8)] border border-[#B01A27]" />
                                <div className="absolute top-[20%] left-[10%] right-[10%] h-[15%] bg-[#1A242D] rounded-t-lg rounded-b-sm border-t-2 border-white/20" />
                                <div className="absolute bottom-[20%] left-[15%] right-[15%] h-[10%] bg-[#1A242D] rounded-b-lg rounded-t-sm" />
                                <div className="absolute top-1 left-[15%] w-3 h-2 bg-yellow-100 rounded-full blur-[1px] shadow-[0_-20px_40px_#fef08a]" />
                                <div className="absolute top-1 right-[15%] w-3 h-2 bg-yellow-100 rounded-full blur-[1px] shadow-[0_-20px_40px_#fef08a]" />
                                <div className="absolute top-[30%] -left-1.5 w-2 h-4 bg-[#B01A27] rounded-l-md" />
                                <div className="absolute top-[30%] -right-1.5 w-2 h-4 bg-[#B01A27] rounded-r-md" />
                            </div>
                        </div>
                    )}

                    {/* Render The Chicken 🐔 */}
                    {step > 0 && (
                        <div className={`absolute w-[60px] h-[60px] z-20 flex items-center justify-center transition-all duration-300 ease-out ${
                                isPlaying && !crashed ? 'animate-bounce' : ''
                            }`}
                            style={{
                                left: `calc(120px + (100% - 120px) / ${lanes} * ${step - 1} + ((100% - 120px) / ${lanes} - 60px) / 2)`,
                                bottom: `calc(5% + 45px)` // align precisely above manhole
                            }}>
                            <ChickenSVG crashed={showExplosion} />
                        </div>
                    )}
                    
                    {/* Starting Position Chicken */}
                    {step === 0 && !crashed && (
                         <div className="absolute w-[60px] h-[60px] z-20 flex items-center justify-center left-[30px] bottom-[calc(5%+45px)] animate-pulse">
                             <ChickenSVG crashed={false} />
                         </div>
                    )}

                    {/* Overlay Results */}
                    {crashed && winAmount === 0 && (
                        <div className="absolute inset-0 z-50 bg-red-900/40 flex items-center justify-center pointer-events-none">
                             <div className="text-4xl font-black text-white bg-[#1A242D] px-8 py-4 rounded-xl border border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] whitespace-nowrap">
                                 YAKALANDINIZ!
                             </div>
                        </div>
                    )}
                    {crashed && winAmount !== null && winAmount > 0 && (
                        <div className="absolute inset-0 z-50 bg-emerald-900/40 flex items-center justify-center pointer-events-none">
                             <div className="flex flex-col items-center text-3xl font-black text-white bg-[#1A242D] px-12 py-6 rounded-xl border border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] whitespace-nowrap">
                                 KAZANDINIZ!
                                 <span className="text-[#00E5FF] text-4xl mt-2 font-mono">${winAmount.toFixed(2)}</span>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes killerCarDrive {
                    0% { top: -20%; }
                    100% { top: 120%; }
                }
            `}</style>
        </div>
    );
}
