import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { ShieldCheck, Target } from 'lucide-react';

const ROULETTE_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

type BetType = 'red' | 'black' | 'even' | 'odd' | 'low' | 'high' | '1st12' | '2nd12' | '3rd12' | 'number';

export default function RouletteView({ siteUser, onAuthRequired }: any) {
    const { playInstantGame, isFunMode, demoBalance, setDemoBalance } = useUser();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [selectedBet, setSelectedBet] = useState<BetType | null>(null);
    const [selectedNumber, setSelectedNumber] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const [spinRotation, setSpinRotation] = useState<number>(0);
    const [resultNumber, setResultNumber] = useState<number | null>(null);
    const [winAmount, setWinAmount] = useState<number | null>(null);

    const handlePlay = async () => {
        if (!isFunMode && !siteUser) return onAuthRequired();
        if (!selectedBet) {
            alert('Lütfen bir bahis türü seçin.');
            return;
        }
        
        if (isFunMode && betAmount > demoBalance) {
            alert('Yetersiz demo bakiye.');
            return;
        }

        setIsPlaying(true);
        setResultNumber(null);
        setWinAmount(null);

        try {
            let winningNum: number;
            let payout: number = 0;

            if (isFunMode) {
                // --- DEMO (MOCK) LOGIC ---
                setDemoBalance(prev => prev - betAmount);
                winningNum = Math.floor(Math.random() * 37);
                
                // Demo Payout Calculation
                if (['red', 'black'].includes(selectedBet)) {
                    if (winningNum !== 0) {
                        const isRedResult = RED_NUMBERS.includes(winningNum);
                        if ((selectedBet === 'red' && isRedResult) || (selectedBet === 'black' && !isRedResult)) {
                            payout = betAmount * 2;
                        }
                    }
                } else if (['even', 'odd'].includes(selectedBet)) {
                    if (winningNum !== 0) {
                        const isEven = winningNum % 2 === 0;
                        if ((selectedBet === 'even' && isEven) || (selectedBet === 'odd' && !isEven)) {
                            payout = betAmount * 2;
                        }
                    }
                } else if (['low', 'high'].includes(selectedBet)) {
                    if (winningNum !== 0) {
                        const isLow = winningNum >= 1 && winningNum <= 18;
                        if ((selectedBet === 'low' && isLow) || (selectedBet === 'high' && !isLow)) {
                            payout = betAmount * 2;
                        }
                    }
                } else if (['1st12', '2nd12', '3rd12'].includes(selectedBet)) {
                    if (winningNum !== 0) {
                        const is1st = winningNum >= 1 && winningNum <= 12;
                        const is2nd = winningNum >= 13 && winningNum <= 24;
                        const is3rd = winningNum >= 25 && winningNum <= 36;
                        if ((selectedBet === '1st12' && is1st) || (selectedBet === '2nd12' && is2nd) || (selectedBet === '3rd12' && is3rd)) {
                            payout = betAmount * 3;
                        }
                    }
                } else if (selectedBet === 'number') {
                    if (winningNum === selectedNumber) {
                        payout = betAmount * 36;
                    }
                }
            } else {
                // --- REAL MONEY LOGIC ---
                let betPayload = {};
                if (['red', 'black'].includes(selectedBet)) {
                    betPayload = { type: 'color', value: selectedBet, amount: betAmount };
                } else if (selectedBet === 'number') {
                    betPayload = { type: 'number', value: selectedNumber, amount: betAmount };
                } else if (['1st12', '2nd12', '3rd12'].includes(selectedBet)) {
                    betPayload = { type: 'dozen', value: selectedBet, amount: betAmount };
                } else {
                    betPayload = { type: 'outside', value: selectedBet, amount: betAmount };
                }

                const data = await playInstantGame(betAmount, 'Roulette', 0, 'none', { bets: [betPayload] });
                winningNum = data.result.number;
                payout = data.win_amount;
            }
            
            const winningIndex = ROULETTE_NUMBERS.indexOf(winningNum);
            const segmentAngle = 360 / ROULETTE_NUMBERS.length;
            const spins = 5;
            const targetRotation = (spins * 360) - (winningIndex * segmentAngle);
            
            setSpinRotation(prev => prev + targetRotation + (360 - (prev % 360)));

            setTimeout(() => {
                setResultNumber(winningNum);
                setWinAmount(payout);
                if (isFunMode && payout > 0) {
                    setDemoBalance(prev => prev + payout);
                }
                setIsPlaying(false);
            }, 4000);
            
        } catch (e: any) {
            alert(e.message || 'Hata oluştu');
            setIsPlaying(false);
        }
    };

    const isRed = (num: number) => RED_NUMBERS.includes(num);

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
                        <span className="text-xs text-[#ffd700] font-mono font-bold">₺{siteUser ? siteUser.balance.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex bg-[#151D24] rounded-md border border-[#2A3744] overflow-hidden focus-within:border-[#3D82F6] transition-colors">
                        <div className="px-3 flex items-center justify-center text-gray-400">₺</div>
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

                {/* Outside Bets Selection */}
                <div className="mb-6">
                    <label className="block text-xs text-gray-400 font-semibold mb-2">Bahis Seçimi (Ödeme: 2x)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setSelectedBet('red')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'red' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] border-red-500' : 'bg-red-950/50 text-red-500 border border-red-900 hover:bg-red-900/50'}`}
                        >
                            Kırmızı
                        </button>
                        <button 
                            onClick={() => setSelectedBet('black')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'black' ? 'bg-black text-white shadow-[0_0_15px_rgba(255,255,255,0.2)] border-gray-500' : 'bg-black/50 text-gray-400 border border-gray-800 hover:bg-black/80'}`}
                        >
                            Siyah
                        </button>
                        <button 
                            onClick={() => setSelectedBet('even')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'even' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            Çift
                        </button>
                        <button 
                            onClick={() => setSelectedBet('odd')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'odd' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            Tek
                        </button>
                        <button 
                            onClick={() => setSelectedBet('low')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'low' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            1-18
                        </button>
                        <button 
                            onClick={() => setSelectedBet('high')}
                            disabled={isPlaying}
                            className={`py-3 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === 'high' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            19-36
                        </button>
                    </div>
                    
                    {/* Dozens */}
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <button 
                            onClick={() => setSelectedBet('1st12')}
                            disabled={isPlaying}
                            className={`py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === '1st12' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            1. Düzine
                        </button>
                        <button 
                            onClick={() => setSelectedBet('2nd12')}
                            disabled={isPlaying}
                            className={`py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === '2nd12' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            2. Düzine
                        </button>
                        <button 
                            onClick={() => setSelectedBet('3rd12')}
                            disabled={isPlaying}
                            className={`py-2 rounded-md font-bold text-xs uppercase tracking-widest transition-all ${selectedBet === '3rd12' ? 'bg-[#3D82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-[#3D82F6]' : 'bg-[#151D24] text-gray-400 border border-[#2A3744] hover:bg-[#1E2933]'}`}
                        >
                            3. Düzine
                        </button>
                    </div>

                    {/* Specific Number */}
                    <div className="mt-4 p-3 bg-[#151D24] rounded-md border border-[#2A3744]">
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-gray-400 font-semibold cursor-pointer flex items-center gap-2" onClick={() => setSelectedBet('number')}>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedBet === 'number' ? 'border-[#3D82F6] bg-[#3D82F6]/20' : 'border-gray-600'}`}>
                                    {selectedBet === 'number' && <div className="w-2 h-2 rounded-full bg-[#3D82F6]"></div>}
                                </div>
                                Belirli Sayı (Ödeme: 36x)
                            </label>
                        </div>
                        <div className="flex items-center gap-2 opacity-100 transition-opacity">
                            <input 
                                type="range" 
                                min="0" 
                                max="36" 
                                value={selectedNumber}
                                onChange={(e) => {
                                    setSelectedNumber(Number(e.target.value));
                                    setSelectedBet('number');
                                }}
                                disabled={isPlaying}
                                className="flex-1 accent-[#3D82F6]"
                            />
                            <div className="w-10 h-10 bg-[#0B0E14] rounded flex items-center justify-center font-black text-[#00E5FF] shadow-inner text-lg">
                                {selectedNumber}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                    <button 
                        onClick={handlePlay}
                        disabled={isPlaying || !selectedBet}
                        className={`w-full font-bold py-3.5 rounded-md transition-colors shadow-lg ${
                            isPlaying || !selectedBet ? 'bg-[#324555] text-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                    >
                        {isPlaying ? 'Çevriliyor...' : 'Bahis (Çevir)'}
                    </button>
                </div>

                {/* Profit */}
                {winAmount !== null && (
                    <div className={`mt-4 bg-[#151D24] rounded-md border px-3 py-3 flex items-center justify-between transition-colors ${winAmount > 0 ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'border-[#2A3744]'}`}>
                        <span className="text-gray-400 text-xs font-bold uppercase">{winAmount > 0 ? 'Kazanç' : 'Kayıp'}</span>
                        <span className={`font-mono text-sm font-bold ${winAmount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {winAmount > 0 ? `+₺${winAmount.toFixed(2)}` : `-₺${betAmount.toFixed(2)}`}
                        </span>
                    </div>
                )}
            </div>

            {/* ── RIGHT MAIN AREA (Premium Game Frame) ── */}
            <div className="flex-1 relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-12 order-1 md:order-2 min-h-[400px] md:min-h-0 bg-[#0B0E14]">
                
                {/* Ambient Casino Lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>
                
                {/* ── CENTERED GAME CONTAINER ── */}
                <div className="w-full max-w-5xl h-full max-h-[700px] bg-gradient-to-b from-[#111620] to-[#0A0D14] relative rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col justify-center items-center border border-[#1E2738]">
                    
                    {/* Top Info Badges */}
                    <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#0099aa] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                            <Target className="w-5 h-5 text-[#0A0D14]" />
                        </div>
                        <span className="text-white font-black tracking-widest text-sm uppercase drop-shadow-md">
                            Roulette
                        </span>
                    </div>
                    
                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-[#0A0D14]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 z-20 shadow-lg">
                        <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                        <span className="text-gray-300 font-bold text-xs uppercase tracking-wider">Adil Oyun</span>
                    </div>

                    {/* Wheel Container */}
                    <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px] mt-8 mb-4">
                        
                        {/* Outer Metallic Ring Background */}
                        <div 
                            className="absolute inset-0 rounded-full shadow-[0_0_80px_rgba(0,229,255,0.05),inset_0_15px_30px_rgba(0,0,0,1)] p-[15px] border-2 border-[#2A3744]" 
                            style={{ background: 'conic-gradient(from 0deg, #1A212D, #0A0D14, #1A212D, #0A0D14, #1A212D)' }}
                        >
                            {/* The Wheel */}
                            <div className="absolute inset-[15px] rounded-full overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,1)] bg-[#05070A]">
                                <svg width="100%" height="100%" viewBox="0 0 500 500" className="drop-shadow-2xl" style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.8))' }}>
                                    <defs>
                                        <filter id="inner-shadow">
                                            <feOffset dx="0" dy="0"/>
                                            <feGaussianBlur stdDeviation="15" result="offset-blur"/>
                                            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                                            <feFlood floodColor="black" floodOpacity="0.9" result="color"/>
                                            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                                            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                                        </filter>
                                        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feGaussianBlur stdDeviation="10" result="blur" />
                                            <feMerge>
                                                <feMergeNode in="blur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                        <radialGradient id="metal-hub" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#2A3744" />
                                            <stop offset="70%" stopColor="#151D24" />
                                            <stop offset="100%" stopColor="#05070A" />
                                        </radialGradient>
                                        <radialGradient id="metal-ring" cx="50%" cy="50%" r="50%">
                                            <stop offset="85%" stopColor="transparent" />
                                            <stop offset="95%" stopColor="rgba(255,255,255,0.05)" />
                                            <stop offset="100%" stopColor="rgba(0,0,0,0.8)" />
                                        </radialGradient>
                                    </defs>
                                    
                                    {/* Wheel Group - This rotates */}
                                    <g 
                                        style={{ 
                                            transform: `rotate(${spinRotation}deg)`, 
                                            transformOrigin: '250px 250px',
                                            transition: isPlaying ? 'transform 4000ms cubic-bezier(0.15, 0.9, 0.15, 1)' : 'none'
                                        }}
                                    >
                                        {/* Sectors */}
                                        {ROULETTE_NUMBERS.map((num, i) => {
                                            const angleStep = 360 / ROULETTE_NUMBERS.length;
                                            const startAngle = -angleStep / 2;
                                            const endAngle = angleStep / 2;
                                            const isGreen = num === 0;
                                            const color = isGreen ? '#00E5FF' : (isRed(num) ? '#E11D48' : '#111827');
                                            const strokeColor = isGreen ? '#00b8cc' : (isRed(num) ? '#be123c' : '#030712');

                                            // Text distance from center
                                            const textRadius = 210;
                                            
                                            // Helper to draw arc
                                            const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
                                              const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                                              return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) };
                                            };
                                            const start = polarToCartesian(250, 250, 248, endAngle);
                                            const end = polarToCartesian(250, 250, 248, startAngle);
                                            const path = `M 250 250 L ${start.x} ${start.y} A 248 248 0 0 0 ${end.x} ${end.y} Z`;

                                            return (
                                                <g key={num} transform={`rotate(${i * angleStep}, 250, 250)`}>
                                                    <path 
                                                        d={path} 
                                                        fill={color} 
                                                        stroke={strokeColor} 
                                                        strokeWidth="0.5"
                                                    />
                                                    {/* Outer edge highlight for depth */}
                                                    <path 
                                                        d={`M ${start.x} ${start.y} A 248 248 0 0 0 ${end.x} ${end.y}`} 
                                                        fill="none" 
                                                        stroke="rgba(0,0,0,0.5)" 
                                                        strokeWidth="10" 
                                                    />
                                                    <text 
                                                        x="250" 
                                                        y={250 - textRadius} 
                                                        textAnchor="middle" 
                                                        dominantBaseline="middle"
                                                        fill={isGreen ? '#0A0D14' : '#ffffff'}
                                                        fontSize="18"
                                                        fontWeight="900"
                                                        letterSpacing="-1"
                                                        style={{ textShadow: isGreen ? '0 0 8px rgba(0,0,0,0.3)' : '0 2px 4px rgba(0,0,0,0.8)' }}
                                                    >
                                                        {num}
                                                    </text>
                                                </g>
                                            );
                                        })}

                                        {/* Gradient Overlay for lighting */}
                                        <circle cx="250" cy="250" r="250" fill="url(#metal-ring)" pointerEvents="none" />

                                        {/* Center Metal Hub covering the pie slices */}
                                        <circle cx="250" cy="250" r="160" fill="url(#metal-hub)" stroke="#05070A" strokeWidth="4" filter="url(#inner-shadow)" />
                                        
                                        {/* Decorative Rings */}
                                        <circle cx="250" cy="250" r="150" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="2" />
                                        <circle cx="250" cy="250" r="110" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="6" />
                                        
                                        {/* Inner Hub Ring */}
                                        <circle cx="250" cy="250" r="80" fill="#0A0D14" stroke="#1E2738" strokeWidth="4" filter="url(#inner-shadow)" />
                                        
                                        {/* Tiny Center Dot */}
                                        <circle cx="250" cy="250" r="15" fill="#00E5FF" opacity="0.8" filter="url(#neon-glow)" />
                                    </g>
                                </svg>
                            </div>
                        </div>

                        {/* Holographic Laser Pointer (SVG) */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
                            <svg width="60" height="100" viewBox="0 0 60 100" style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.8))' }}>
                                {/* Base */}
                                <rect x="15" y="0" width="30" height="12" rx="6" fill="#0A0D14" stroke="#00E5FF" strokeWidth="2" />
                                {/* Emitting Diode */}
                                <circle cx="30" cy="6" r="3" fill="#00E5FF" />
                                {/* Laser Beam */}
                                <path d="M 28 12 L 32 12 L 30 80 Z" fill="#00E5FF" opacity="0.9" />
                                <path d="M 26 12 L 34 12 L 30 85 Z" fill="#00E5FF" opacity="0.5" />
                                <path d="M 22 12 L 38 12 L 30 95 Z" fill="#00E5FF" opacity="0.2" />
                            </svg>
                        </div>
                    </div>

                    {/* Result Display */}
                    {resultNumber !== null && !isPlaying && (
                        <div className="absolute bottom-12 flex flex-col items-center animate-pop-in z-20">
                            <div className={`w-28 h-28 rounded-full border-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.5)] flex items-center justify-center text-5xl font-black text-white ${
                                resultNumber === 0 ? 'bg-gradient-to-b from-[#00E5FF] to-[#0099aa] border-[#0A0D14] text-[#0A0D14] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]' : isRed(resultNumber) ? 'bg-gradient-to-b from-[#E11D48] to-[#9f1239] border-[#0A0D14]' : 'bg-gradient-to-b from-[#1F2937] to-[#111827] border-[#0A0D14]'
                            }`}>
                                {resultNumber}
                            </div>
                            
                            {winAmount !== null && winAmount > 0 && (
                                <div className="mt-6 bg-[#00E5FF] text-[#0A0D14] font-black px-8 py-3 rounded-full uppercase tracking-[0.2em] text-sm animate-[pulse_2s_ease-in-out_infinite] border-2 border-white shadow-[0_0_30px_rgba(0,229,255,0.6)]">
                                    Kazandın +₺{winAmount.toFixed(2)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
