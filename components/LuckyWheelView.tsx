import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LuckyWheelConfig, LuckyWheelPrize, SiteUser, LuckyWheelFakeWinner } from '../types';
import { Trophy, Users, Coins, X, LogIn, ChevronLeft, ChevronRight, RotateCcw, FastForward, Info, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LuckyWheelViewProps {
  config: LuckyWheelConfig;
  siteUser: SiteUser | null;
  onNavigate?: (v: string) => void;
}

const getSliceIcon = (name: string): string => {
  const u = name.toUpperCase();
  if (u.includes('NAKİT') || u.includes('NAKIT')) return '💰';
  if (u.includes('FREESPIN') || u.includes('FREE SPIN')) return '🎰';
  if (u.includes('FREEBET') || u.includes('FREE BET')) return '🎟️';
  if (u.includes('BONUS')) return '🎁';
  if (u.includes('IPHONE') || u.includes('PHONE')) return '📱';
  if (u.includes('PLAYSTATION') || u.includes('PS5') || u.includes('PS')) return '🎮';
  if (u.includes('BOŞ') || u.includes('PAS')) return '❌';
  if (u.includes('ELMAS') || u.includes('DIAMOND')) return '💎';
  if (u.includes('JOKER')) return '🃏';
  return '⭐';
};

/* 724bets Premium Games & Custom Pas Graphics */
const getSliceImage = (idx: number, prizeName: string) => {
  if (prizeName.toUpperCase().includes('PAS')) return '/originals/pas_slice_bg.jpg';
  const premiumGames = [
    '/images/flat-keno.jpg',
    '/images/flat-roulette.jpg',
    '/images/flat-blackjack.jpg',
    '/images/flat-plinko.jpg',
    '/images/flat-mission.jpg'
  ];
  // Using idx to cycle through the 5 flat images
  return premiumGames[idx % premiumGames.length];
};

const LuckyWheelView: React.FC<LuckyWheelViewProps> = ({ config, siteUser, onNavigate }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinPhase, setSpinPhase] = useState<'idle' | 'accelerating' | 'maxSpeed' | 'decelerating'>('idle');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [wonPrize, setWonPrize] = useState<LuckyWheelPrize | null>(null);
  const [tickets, setTickets] = useState(siteUser ? 5 : 1);
  const [isTurbo, setIsTurbo] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [fakeFeed, setFakeFeed] = useState<LuckyWheelFakeWinner[]>(config.fakeWinners || []);
  const [newEntryId, setNewEntryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'casino' | 'spor'>('casino');
  const [promoScrollEnabled, setPromoScrollEnabled] = useState(true);

  const prizes = config.prizes;
  const numPrizes = prizes.length;
  const anglePerSlice = 360 / numPrizes;

  const wheelRef = useRef<HTMLDivElement>(null);

  /* ── Audio ────────────────────────────────────────── */
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playTick = useCallback(() => {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }, [getCtx]);

  const playWinSound = useCallback(() => {
    try {
      const ctx = getCtx();
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.8);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.9);
      });
    } catch {}
  }, [getCtx]);

  /* ── 60FPS DOM Tracking for Active Slice ──────────── */
  useEffect(() => {
    let rafId: number;
    const trackActiveSlice = () => {
      if (wheelRef.current) {
        const st = window.getComputedStyle(wheelRef.current);
        const tr = st.getPropertyValue('transform');
        let currentRot = 0;
        if (tr !== 'none') {
          const values = tr.split('(')[1].split(')')[0].split(',');
          const a = parseFloat(values[0]);
          const b = parseFloat(values[1]);
          currentRot = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        }
        if (currentRot < 0) currentRot += 360;

        let bestIndex = 0;
        let minDiff = 999;
        for (let i = 0; i < numPrizes; i++) {
          const sliceMid = (i * anglePerSlice) + (anglePerSlice / 2);
          const absMid = (sliceMid + currentRot) % 360;
          const diff = Math.min(absMid, 360 - absMid);
          if (diff < minDiff) {
            minDiff = diff;
            bestIndex = i;
          }
        }

        for (let i = 0; i < numPrizes; i++) {
          const overlay = document.getElementById(`slice-overlay-${i}`);
          const content = document.getElementById(`slice-content-${i}`);
          if (i === bestIndex) {
            overlay?.classList.add('slice-active-overlay');
            content?.classList.add('slice-active-content');
          } else {
            overlay?.classList.remove('slice-active-overlay');
            content?.classList.remove('slice-active-content');
          }
        }
      }
      rafId = requestAnimationFrame(trackActiveSlice);
    };
    rafId = requestAnimationFrame(trackActiveSlice);
    return () => cancelAnimationFrame(rafId);
  }, [numPrizes, anglePerSlice]);

  /* ── Spin Logic ──────────────────────────────────── */
  const handleSpin = () => {
    if (isSpinning || tickets <= 0 || !siteUser) {
      if (!siteUser) handleRegisterClick();
      return;
    }

    setIsSpinning(true);
    setTickets(prev => prev - 1);
    setShowWinModal(false);

    const totalWeight = prizes.reduce((a, p) => a + p.weight, 0);
    let random = Math.random() * totalWeight;
    let winIndex = 0;
    for (let i = 0; i < prizes.length; i++) {
      if (random < prizes[i].weight) { winIndex = i; break; }
      random -= prizes[i].weight;
    }

    const spins = isTurbo ? 6 : 20; // Massive spins for 9.5s
    const sliceAngle = 360 / numPrizes;
    const targetAngle = 360 - (winIndex * sliceAngle) - (sliceAngle / 2);
    const normalizedCurrent = wheelRotation % 360;
    let delta = targetAngle - normalizedCurrent;
    if (delta <= 0) delta += 360;
    const totalRotation = wheelRotation + (spins * 360) + delta;
    setWheelRotation(totalRotation);

    const spinDuration = isTurbo ? 2500 : 9500;
    
    // Manage Cinematic Phases
    if (!isTurbo) {
      setSpinPhase('accelerating');
      setTimeout(() => setSpinPhase('maxSpeed'), 1500);
      setTimeout(() => setSpinPhase('decelerating'), 7000);
    } else {
      setSpinPhase('accelerating');
      setTimeout(() => setSpinPhase('maxSpeed'), 500);
      setTimeout(() => setSpinPhase('decelerating'), 1500);
    }

    let elapsed = 0;
    const tickSequence = () => {
      if (elapsed >= spinDuration) return;
      const progress = elapsed / spinDuration;
      let period = 30;
      if (!isTurbo) {
        if (progress < 0.2) period = 100 - (progress * 5 * 80); // Accel
        else if (progress < 0.6) period = 20; // Fast
        else period = 20 + Math.pow((progress - 0.6) / 0.4, 3) * 600; // Decel
      } else {
        period = 25 + progress * 80;
      }
      playTick();
      elapsed += period;
      tickIntervalRef.current = setTimeout(tickSequence, period);
    };
    tickSequence();

    setTimeout(() => {
      if (tickIntervalRef.current) clearTimeout(tickIntervalRef.current);
      setIsSpinning(false);
      setSpinPhase('idle');
      setWonPrize(prizes[winIndex]);
      setShowWinModal(true);
      playWinSound();
      confetti({ particleCount: 250, spread: 160, origin: { y: 0.4 }, colors: ['#10b981', '#fbbf24', '#ffffff', '#8b5cf6'], zIndex: 100, gravity: 0.8, startVelocity: 45 });
    }, spinDuration);
  };

  /* ── Fake feed ───────────────────────────────────── */
  useEffect(() => {
    if (!config.enableFakeFeed) return;
    const interval = setInterval(() => {
      const rp = prizes[Math.floor(Math.random() * prizes.length)];
      const names = ["win***24", "bet***99", "pro***11", "king***7", "ace***55", "vip***01", "livo***88"];
      const id = Date.now().toString();
      setFakeFeed(prev => [{ id, username: names[Math.floor(Math.random() * names.length)], prizeName: rp.name, time: 'ŞİMDİ' }, ...prev].slice(0, 15));
      setNewEntryId(id);
      setTimeout(() => setNewEntryId(null), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [config.enableFakeFeed, prizes]);

  const handleRegisterClick = () => {
    window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'register' }));
  };

  const promoResults = fakeFeed.map((w) => ({
    prize: w.prizeName,
    id: (1692000000 + Math.floor(Math.random() * 100000)).toString(),
  }));

  const specialPrizes = prizes.filter(p => {
    const u = p.name.toUpperCase();
    return u.includes('NAKİT') || u.includes('NAKIT') || u.includes('PLAYSTATION') || u.includes('PS5') || u.includes('IPHONE') || u.includes('ELMAS');
  }).slice(0, 3);

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-80px)] bg-[#030712] text-gray-200 overflow-hidden relative font-sans selection:bg-emerald-500/30">

      {/* Global background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.08)_0%,_rgba(3,7,18,1)_70%)] pointer-events-none"></div>

      <style>{`
        .glass-scrollbar::-webkit-scrollbar { width: 4px; }
        .glass-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .glass-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .glass-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        .prize-scroll::-webkit-scrollbar { display: none; }
        .prize-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
          100% { box-shadow: 0 0 0 30px rgba(16, 185, 129, 0); }
        }
        .pulse-green { animation: pulse-green 2s infinite cubic-bezier(0.4, 0, 0.2, 1); }

        /* Dynamic Slice Animation Classes */
        .slice-overlay { fill: rgba(0,0,0,0.4); transition: fill 0.3s ease-out; }
        .slice-active-overlay { fill: rgba(0,0,0,0.85) !important; }

        .slice-content { opacity: 0.9; transform: scale(1); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; }
        .slice-active-content { opacity: 1 !important; transform: scale(1.15) !important; filter: brightness(1.3); pointer-events: auto; }
      `}</style>

      {/* ═══════════ TOP BAR (Glassmorphism) ═══════════ */}
      <div className="w-full flex items-center justify-between px-4 sm:px-6 py-3 shrink-0 z-20 border-b border-white/10 bg-slate-900/30 backdrop-blur-xl shadow-lg">
        <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/5 shadow-inner">
          <button onClick={() => setActiveTab('casino')} className={`px-6 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'casino' ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-300/30' : 'text-gray-400 hover:text-white border border-transparent'}`}>Casino</button>
          <button onClick={() => setActiveTab('spor')} className={`px-6 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'spor' ? 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-300/30' : 'text-gray-400 hover:text-white border border-transparent'}`}>Spor</button>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900/80 via-emerald-950/40 to-slate-900/80 border border-emerald-500/30 px-6 py-2 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
          <span className="text-sm font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 tracking-widest uppercase">WONDER WHEEL</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Aktivite</span>
          <div className={`w-11 h-6 rounded-xl relative cursor-pointer transition-colors duration-300 border ${promoScrollEnabled ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-slate-800 border-slate-700'}`} onClick={() => setPromoScrollEnabled(!promoScrollEnabled)}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-xl bg-white shadow-md transition-transform duration-300 ${promoScrollEnabled ? 'left-[22px]' : 'left-1'}`}></div>
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN 3-COLUMN LAYOUT ═══════════ */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative z-10">
        
        {/* Background Dimmer when spinning */}
        <div 
          className={`absolute inset-0 z-40 pointer-events-none transition-all duration-[2000ms] ease-out ${
            isSpinning ? 'backdrop-blur-md bg-black/80' : 'backdrop-blur-none bg-transparent'
          }`}
        />

        {/* ──── LEFT PANEL (Glassmorphism) ──── */}
        <div className="hidden lg:flex w-[260px] xl:w-[280px] flex-col shrink-0 border-r border-white/10 p-5 gap-6 overflow-y-auto glass-scrollbar bg-slate-900/30 backdrop-blur-xl shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          <div>
            <h3 className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 uppercase tracking-[0.2em] mb-4">KAZANIM SEVİYELERİ</h3>
            <div className="flex items-center gap-5 mb-4">
              {/* Circle progress 1 */}
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                  <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="36" cy="36" r="32" fill="none" stroke="url(#progress-grad)" strokeWidth="6" strokeDasharray={`${0} ${2 * Math.PI * 32}`} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))' }} />
                  <defs>
                    <linearGradient id="progress-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">0</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">20000</span>
                </div>
              </div>
              {/* Circle progress 2 */}
              <div className="relative w-20 h-20">
                <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                  <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="36" cy="36" r="32" fill="none" stroke="url(#progress-grad)" strokeWidth="6" strokeDasharray={`${0} ${2 * Math.PI * 32}`} strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">0</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">50000</span>
                </div>
                <div className="absolute -top-1 -right-1 bg-slate-800 rounded-full p-1 border border-white/10 shadow-lg">
                  <Info className="w-3 h-3 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-300 font-bold bg-black/40 rounded-xl px-4 py-2.5 border border-white/5 shadow-inner">
              <span className="text-emerald-400 drop-shadow-[0_0_2px_rgba(16,185,129,0.8)] flex-1">20000 TL PRAGMATIC PLAY</span>
              <span className="text-white shrink-0">50000 TL</span>
            </div>
          </div>

          <div className="mt-2">
            <h3 className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 uppercase tracking-[0.2em] mb-1">ÖZEL ÖDÜLLER</h3>
            <p className="text-[10px] text-amber-400 font-black mb-4 tracking-wider drop-shadow-[0_0_3px_rgba(251,191,36,0.5)]">LIVO WONDER WHEEL</p>

            <div className="flex flex-col gap-3">
              {specialPrizes.length > 0 ? specialPrizes.map((sp, i) => (
                <div key={sp.id} className="group flex items-center gap-3 bg-black/30 backdrop-blur-md border border-white/5 rounded-xl px-3 py-3 shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-white/5 hover:border-amber-500/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-black border border-white/10 flex items-center justify-center text-xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">{getSliceIcon(sp.name)}</div>
                  <span className="text-xs font-black text-gray-200 flex-1 leading-tight tracking-wide">{sp.name}</span>
                  <span className="text-[11px] text-amber-400 font-black shrink-0 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">0 / {i === 2 ? 5 : 3}</span>
                </div>
              )) : (
                <div className="text-xs text-gray-500 font-medium italic text-center py-4">Özel ödül bulunmuyor.</div>
              )}
            </div>
          </div>
        </div>

        {/* ──── CENTER PANEL (WHEEL 3D Area) ──── */}
        <div className="flex-1 flex flex-col items-center justify-between min-h-0 overflow-hidden px-4 py-4 relative z-50">
          <style>{`
            @keyframes camera-shake {
              0% { transform: translate(0, 0) rotate(0deg); }
              25% { transform: translate(1px, 1px) rotate(0.2deg); }
              50% { transform: translate(-1px, -2px) rotate(-0.2deg); }
              75% { transform: translate(-2px, 1px) rotate(0deg); }
              100% { transform: translate(1px, -1px) rotate(-0.2deg); }
            }
            .animate-camera-shake {
              animation: camera-shake 0.1s infinite;
            }
          `}</style>
          <div className="flex-1 flex items-center justify-center w-full min-h-0 relative">
            <div className={`relative w-full max-w-[420px] sm:max-w-[480px] max-h-[52vh] aspect-square flex items-center justify-center ${spinPhase === 'maxSpeed' ? 'animate-camera-shake' : ''}`}>

              {/* Pointer (Premium 3D Mechanical Arrow) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-[25px] z-50 filter">
                  <div 
                    className="w-[45px] h-[55px] bg-center bg-contain bg-no-repeat relative z-50 pointer-events-none"
                    style={{
                      backgroundImage: 'url("https://spider.betlivo303.com/Common/GetImage/000000000000000000000000e40936802367015d11bfbc010e16508d34d6282095844c7dc7f115548fd1037873fa6d422780ba5db908b58dc1da352d20382022ba09bb3d31cb37e34e/Pointer")',
                      filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.9))'
                    }}
                  ></div>
              </div>

              {/* 3D Wheel Assembly */}
              <div className="absolute inset-0 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.9),_0_0_80px_rgba(16,185,129,0.15)] bg-[#030712]">
                
                {/* Harmonious Premium Frame (Solid background, NO GAPS) */}
                <div className="absolute inset-[-14px] rounded-full overflow-hidden" style={{
                  background: 'linear-gradient(145deg, #1e293b, #020617)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.1)'
                }}>
                  {/* Neon Edge right exactly on the wheel boundary */}
                  <div className="absolute inset-[13px] rounded-full border-[4px] border-[#10b981]/80 shadow-[0_0_20px_rgba(16,185,129,0.6),_inset_0_0_10px_rgba(16,185,129,0.3)] pointer-events-none z-30"></div>
                </div>

                {/* Sleek integrated notches (placed perfectly using geometry) */}
                <div className="absolute inset-0 rounded-full pointer-events-none z-20">
                  {Array.from({ length: numPrizes }).map((_, i) => {
                    const angle = (i / numPrizes) * 360 + (anglePerSlice / 2);
                    const rad = (angle * Math.PI) / 180;
                    const r = 50.8; // Exactly covers the gap
                    const x = 50 + r * Math.sin(rad);
                    const y = 50 - r * Math.cos(rad);
                    return (
                      <div key={i} className="absolute z-20" style={{ 
                        left: `${x}%`, top: `${y}%`,
                        width: '3px',
                        height: '14px',
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        background: 'linear-gradient(to bottom, #10b981, #065f46)',
                        boxShadow: '0 0 8px rgba(16,185,129,0.8)',
                        borderRadius: '2px'
                      }}></div>
                    );
                  })}
                </div>

                {/* Rotating SVG Wheel */}
                <div 
                  ref={wheelRef}
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transition: isSpinning ? `transform ${isTurbo ? '2.5s' : '9.5s'} cubic-bezier(0.4, 0.0, 0.1, 1)` : 'none'
                  }}>
                  <svg viewBox="-50 -50 100 100" className="w-full h-full transform -rotate-90">
                    <defs>
                      <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#facc15" floodOpacity="0.8" />
                      </filter>

                      <filter id="bg-blur" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.2" />
                        <feColorMatrix type="matrix" values="0.3 0 0 0 0   0 0.3 0 0 0   0 0 0.3 0 0   0 0 0 1 0" />
                      </filter>

                      <radialGradient id="spoke-grad" cx="0" cy="0" r="50" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fde047" stopOpacity="0"/>
                        <stop offset="20%" stopColor="#facc15" stopOpacity="0.8"/>
                        <stop offset="70%" stopColor="#ca8a04" stopOpacity="1"/>
                        <stop offset="95%" stopColor="#713f12" stopOpacity="0.5"/>
                        <stop offset="100%" stopColor="#451a03" stopOpacity="0"/>
                      </radialGradient>

                      {/* Glossy reflection for the entire wheel dome */}
                      <linearGradient id="glass-reflection" x1="10%" y1="0%" x2="90%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                        <stop offset="25%" stopColor="rgba(255,255,255,0.15)" />
                        <stop offset="25.1%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                      </linearGradient>

                      {/* Generate Patterns for image slices (Fix for WebKit clipPath bug) */}
                      {prizes.map((prize, idx) => {
                        const startAngle = idx * anglePerSlice;
                        const midAngle = startAngle + anglePerSlice / 2;
                        return (
                          <pattern id={`slice-pat-${idx}`} key={`pat-${idx}`} patternUnits="userSpaceOnUse" width="100" height="100" x="-50" y="-50">
                            {/* Base color fallback */}
                            <rect width="100" height="100" fill="#0f172a" />
                            
                            <image 
                              href={getSliceImage(idx, prize.name)} 
                              x="-25" y="-25" width="50" height="50" 
                              transform={`rotate(${midAngle}) translate(28, 0)`}
                              preserveAspectRatio="xMidYMid slice" 
                              filter={prize.name.toUpperCase().includes('PAS') ? 'none' : 'url(#bg-blur)'}
                            />
                            {prize.name.toUpperCase().includes('JOKER') && (
                              <rect width="100" height="100" fill="#10b981" fillOpacity="0.45" />
                            )}
                          </pattern>
                        );
                      })}
                    </defs>

                    {/* Slices Rendering */}
                    {prizes.map((prize, idx) => {
                      const startAngle = idx * anglePerSlice;
                      const endAngle = (idx + 1) * anglePerSlice;
                      const x1 = 50 * Math.cos((Math.PI * startAngle) / 180);
                      const y1 = 50 * Math.sin((Math.PI * startAngle) / 180);
                      const x2 = 50 * Math.cos((Math.PI * endAngle) / 180);
                      const y2 = 50 * Math.sin((Math.PI * endAngle) / 180);
                      const largeArcFlag = anglePerSlice > 180 ? 1 : 0;
                      
                      const midAngle = startAngle + anglePerSlice / 2;
                      const icon = getSliceIcon(prize.name);
                      const displayName = prize.name.length > 16 ? prize.name.substring(0, 14) + '…' : prize.name;
                      
                      const flip = midAngle > 90 && midAngle < 270;
                      const textRot = flip ? -90 : 90;

                      return (
                        <g key={prize.id}>
                          {/* 1. Slot Game Background Image properly mapped using pattern fill */}
                          <path
                            d={`M 0 0 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={`url(#slice-pat-${idx})`}
                          />
                          
                          {/* 2. Dynamic Dark Overlay (dims inactive, extra dark for active) */}
                          <path
                            id={`slice-overlay-${idx}`}
                            className="slice-overlay"
                            d={`M 0 0 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          />

                          {/* 3. Premium 3D Metallic Divider (Spoke) */}
                          <g>
                            {/* Dark Bevel Shadow */}
                            <line x1="0" y1="0" x2={x1} y2={y1} stroke="rgba(0,0,0,0.8)" strokeWidth="1.2" />
                            {/* Glowing Gold Core */}
                            <line x1="0" y1="0" x2={x1} y2={y1} stroke="url(#spoke-grad)" strokeWidth="0.6" filter="url(#gold-glow)"/>
                          </g>

                          {/* 4. Dynamic Text/Icon Content (pops up when active) */}
                          <g transform={`rotate(${midAngle})`}>
                              <g transform={`translate(42, 0) rotate(${flip ? 180 : 0})`}>
                                  <g 
                                    id={`slice-content-${idx}`} 
                                    className="slice-content"
                                    style={{
                                      opacity: (spinPhase === 'accelerating' || spinPhase === 'maxSpeed') ? 0 : 1,
                                      transition: 'opacity 1.5s ease-in-out'
                                    }}
                                  >
                                      {prize.name.toUpperCase().includes('PAS') ? (
                                        <text
                                          x="0" y="2"
                                          fontSize="8.5"
                                          fontWeight="900"
                                          fill="#ef4444"
                                          textAnchor={flip ? "start" : "end"}
                                          letterSpacing="1px"
                                          style={{ fontFamily: 'Inter, sans-serif', filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.8)) drop-shadow(0 2px 2px rgba(0,0,0,1))', WebkitTextStroke: '0.2px #fff' }}
                                        >
                                          PAS
                                        </text>
                                      ) : prize.name.toUpperCase().includes('JOKER') ? (
                                        <text
                                          x="0" y="2"
                                          fontSize="7"
                                          fontWeight="900"
                                          fill="#10b981"
                                          textAnchor={flip ? "start" : "end"}
                                          letterSpacing="2px"
                                          style={{ fontFamily: 'Inter, sans-serif', filter: 'drop-shadow(0 0 10px rgba(16,185,129,1)) drop-shadow(0 2px 2px rgba(0,0,0,1))', WebkitTextStroke: '0.5px #fff' }}
                                        >
                                          JOKER
                                        </text>
                                      ) : (
                                        <text
                                          x="0" y="1.5"
                                          fontSize={Math.min(4.5, 42 / displayName.length)}
                                          fontWeight="900"
                                          fill={prize.type === 'cash' ? '#fde047' : prize.type === 'freespin' ? '#e879f9' : '#ffffff'}
                                          textAnchor={flip ? "start" : "end"}
                                          letterSpacing="1px"
                                          style={{ 
                                            fontFamily: 'Inter, system-ui, sans-serif', 
                                            textRendering: 'geometricPrecision',
                                            WebkitTextStroke: '0.2px rgba(0,0,0,0.5)', 
                                            filter: prize.type === 'freespin' ? 'drop-shadow(0 0 8px rgba(192,132,252,1)) drop-shadow(0 2px 2px rgba(0,0,0,1))' : 
                                                    prize.type === 'cash' ? 'drop-shadow(0 0 8px rgba(250,204,21,1)) drop-shadow(0 2px 2px rgba(0,0,0,1))' : 
                                                    'drop-shadow(0 0 8px rgba(59,130,246,1)) drop-shadow(0 2px 2px rgba(0,0,0,1))' 
                                          }}
                                        >
                                          {displayName.toUpperCase()}
                                        </text>
                                      )}
                                  </g>
                              </g>
                          </g>
                        </g>
                      );
                    })}

                    {/* Glossy Glass Dome overlay applied on top of all slices */}
                    <circle cx="0" cy="0" r="50" fill="url(#glass-reflection)" pointerEvents="none" />
                  </svg>
                </div>
                
                {/* 724bets Optical Illusion Hologram (Orbital Rings) */}
                <div 
                  className={`absolute inset-0 z-10 pointer-events-none transition-all duration-1000 ${spinPhase === 'maxSpeed' ? 'opacity-100 scale-100' : 'opacity-0 scale-75 blur-md'}`}
                >
                  <svg viewBox="-50 -50 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                    <defs>
                      <path id="orbit-path-1" d="M 0,-34 A 34,34 0 1,1 0,34 A 34,34 0 1,1 0,-34" />
                      <path id="orbit-path-2" d="M 0,-42 A 42,42 0 1,0 0,42 A 42,42 0 1,0 0,-42" />
                    </defs>
                    
                    {/* Inner glowing orbit */}
                    <g className="animate-[spin_1.5s_linear_infinite]">
                      <text fontSize="6.5" fontWeight="900" fill="#10b981" letterSpacing="0.2em" className="uppercase mix-blend-screen opacity-100">
                        <textPath href="#orbit-path-1" startOffset="0%">
                          724BETS • 724BETS • 724BETS • 724BETS • 
                        </textPath>
                      </text>
                    </g>
                    
                    {/* Outer contrasting orbit */}
                    <g className="animate-[spin_2.5s_linear_infinite_reverse]">
                      <text fontSize="4.5" fontWeight="900" fill="transparent" stroke="#facc15" strokeWidth="0.3" letterSpacing="0.4em" className="uppercase opacity-80">
                        <textPath href="#orbit-path-2" startOffset="0%">
                          PREMIUM • CASINO • ORIGINAL • LIVO • 
                        </textPath>
                      </text>
                    </g>
                    
                    {/* Core Energy Flare */}
                    <circle cx="0" cy="0" r="28" fill="rgba(16,185,129,0.2)" filter="blur(6px)" className="animate-pulse" />
                  </svg>
                </div>

                {/* --- PRO CENTER HUB DESIGN (IMAGE BASED) --- */}
                <button
                  onClick={siteUser ? handleSpin : handleRegisterClick}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] z-20 rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.05] active:scale-95 ${isSpinning ? 'pointer-events-none scale-95 opacity-90' : ''} bg-gradient-to-b from-[#082b15] to-[#021106] flex items-center justify-center shadow-[0_15px_35px_rgba(0,0,0,0.9),_inset_0_4px_10px_rgba(255,255,255,0.1),_inset_0_-10px_20px_rgba(0,0,0,0.9)] border-[2px] border-[#10b981]/20 overflow-hidden`}
                >
                    {/* Glassy Mirror Shine (Ayna Parlaması) */}
                    <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent rounded-t-full pointer-events-none z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-0 mix-blend-overlay"></div>

                    <svg viewBox="0 0 100 100" className="w-[55%] h-[55%] text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)] relative z-10" fill="currentColor">
                      {/* 3-leaf clover (Shamrock) */}
                      <path d="M 50,48 C 30,30 35,10 50,20 C 65,10 70,30 50,48 Z" />
                      <path d="M 46,52 C 30,35 10,40 20,55 C 10,70 30,75 46,52 Z" />
                      <path d="M 54,52 C 70,35 90,40 80,55 C 90,70 70,75 54,52 Z" />
                      <path d="M 50,52 Q 45,75 40,90 L 46,90 Q 51,75 50,52 Z" />
                    </svg>
                </button>

              </div>
            </div>
          </div>

          {/* Controls Below Wheel (Glassmorphism) */}
          <div className="flex items-center justify-center gap-4 mt-6 shrink-0 z-20">
            <button
              onClick={() => setIsAutoSpin(!isAutoSpin)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-md ${isAutoSpin ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-slate-900/40 border-white/10 text-gray-400 hover:bg-slate-800/60 hover:text-white hover:border-white/20 hover:shadow-lg'}`}
            >
              <RotateCcw className="w-4 h-4" />
              OTOMATİK SPİN
            </button>
            <button
              onClick={() => setIsTurbo(!isTurbo)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-md ${isTurbo ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'bg-slate-900/40 border-white/10 text-gray-400 hover:bg-slate-800/60 hover:text-white hover:border-white/20 hover:shadow-lg'}`}
            >
              <FastForward className="w-4 h-4" />
              TURBO MODU
            </button>
          </div>
        </div>

        {/* ──── RIGHT PANEL (Glassmorphism) ──── */}
        <div className="hidden lg:flex w-[260px] xl:w-[280px] flex-col shrink-0 border-l border-white/10 overflow-hidden bg-slate-900/30 backdrop-blur-xl shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-5 border-b border-white/10 bg-black/20">
            <h3 className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 uppercase tracking-[0.2em]">CANLI KAZANANLAR</h3>
          </div>
          <div className="flex-1 overflow-y-auto glass-scrollbar p-3">
            {promoResults.map((pr, idx) => (
              <div key={idx} className={`flex flex-col gap-1 px-4 py-3 mb-2 rounded-xl border border-white/5 bg-black/20 hover:bg-black/40 transition-colors ${idx === 0 && newEntryId ? 'bg-gradient-to-r from-emerald-900/40 to-transparent border-emerald-500/30 shadow-[inset_4px_0_0_#10b981]' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[12px] font-black ${idx === 0 && newEntryId ? 'text-emerald-400 drop-shadow-[0_0_3px_rgba(16,185,129,0.5)]' : 'text-gray-200'}`}>{pr.prize}</span>
                  <span className="text-[9px] font-bold text-gray-500 bg-black/50 px-2 py-0.5 rounded-md">ŞİMDİ</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>@{pr.id.substring(0,6)}***</span>
                  <span>TR</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ WIN MODAL (Glassmorphism) ═══════════ */}
      {showWinModal && wonPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-xl">
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 max-w-sm w-full text-center relative shadow-[0_30px_80px_rgba(0,0,0,1),_0_0_40px_rgba(16,185,129,0.2)] backdrop-blur-2xl">
            <button onClick={() => setShowWinModal(false)} className="absolute top-5 right-5 p-2 bg-black/40 hover:bg-black/60 rounded-xl transition-colors border border-white/10">
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-800 to-black rounded-2xl flex items-center justify-center mb-6 border border-amber-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5),_inset_0_2px_10px_rgba(255,255,255,0.1)] group">
              <span className="text-5xl drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] transform transition-transform group-hover:scale-110 duration-500">{getSliceIcon(wonPrize.name)}</span>
            </div>

            <h3 className="text-3xl font-black text-white mb-2 tracking-wider drop-shadow-md">{wonPrize.name}</h3>
            <p className="text-emerald-400 font-black tracking-[0.3em] mb-8 text-[10px] uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">KAZANDINIZ</p>

            {!siteUser ? (
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6 shadow-inner">
                <p className="text-xs font-bold text-gray-400 mb-5 leading-relaxed">Ödülünüzü hemen bakiyenize eklemek için giriş yapın.</p>
                <button onClick={handleRegisterClick} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-black rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase">
                  <LogIn className="w-4 h-4" /> KAYIT OL & AL
                </button>
              </div>
            ) : (
              <button onClick={() => setShowWinModal(false)} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-white font-black rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.4)] tracking-[0.2em] uppercase text-[11px]">
                ÖDÜLÜ TOPLA
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuckyWheelView;
