import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PredictionItem, getTeamTheme } from './PredictionsDashboard';
import { Flame, TrendingUp, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

// ─── Single prediction slide ─────────────────────────────────────────────────
function PredictionSlide({ p, idx }: { p: PredictionItem; idx: number }) {
    const theme = getTeamTheme(p.question);
    const hasTheme = !!theme;
    const primary   = theme?.primary   ?? '#0a1628';
    const secondary = theme?.secondary ?? '#0f2040';
    const logoUrl   = theme?.logoUrl   ?? '';

    const displayItems = p.options && p.options.length > 0
        ? p.options.slice(0, 4)
        : p.subMarkets && p.subMarkets.length > 0
            ? p.subMarkets.slice(0, 4).map(s => ({ id: s.id, name: s.name, probability: s.probability }))
            : [];

    const topItem = displayItems.length > 0
        ? [...displayItems].sort((a, b) => b.probability - a.probability)[0]
        : null;

    return (
        <div
            className="relative w-full overflow-hidden rounded-[20px] cursor-pointer select-none group"
            style={{ height: '220px' }}
        >
            {/* ── BACKGROUND ─────────────────────────────────────────── */}
            <div className="absolute inset-0 bg-[#060B14]">
                {/* Dynamic Base Gradient */}
                <div
                    className="absolute inset-0 opacity-80"
                    style={{
                        background: hasTheme
                            ? `linear-gradient(110deg, ${primary}99 0%, ${primary}40 40%, ${secondary}15 100%)`
                            : 'linear-gradient(110deg, #1A2540 0%, #060B14 100%)',
                    }}
                />

                {/* Cinematic Lighting Orbs */}
                <div
                    className="absolute -top-32 -left-20 w-[500px] h-[500px] rounded-full opacity-40 blur-[120px] mix-blend-screen animate-pulse"
                    style={{ background: primary, animationDuration: '4s' }}
                />
                <div
                    className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full opacity-30 blur-[130px] mix-blend-screen animate-pulse"
                    style={{ background: secondary, animationDuration: '6s', animationDelay: '1s' }}
                />

                {/* Cyber/Tech Grid Texture */}
                <div
                    className="absolute inset-0 opacity-[0.05] mix-blend-overlay group-hover:opacity-[0.08] transition-opacity duration-700"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                        backgroundSize: '30px 30px',
                        backgroundPosition: 'center center'
                    }}
                />

                {/* Top highlight & Vignette */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />
            </div>

            {/* ── LOGO (Watermark Style) ────────────────────── */}
            {logoUrl && (
                <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[60%] h-[150%] pointer-events-none z-0 overflow-hidden flex items-center justify-end">
                    <img
                        src={logoUrl}
                        alt=""
                        className="object-contain mix-blend-screen grayscale-[20%] opacity-[0.18] blur-[1px] group-hover:blur-0 group-hover:opacity-[0.25] transition-all duration-[1500ms] ease-out scale-[1.15]"
                        style={{
                            WebkitMaskImage: 'radial-gradient(ellipse at center right, black 20%, transparent 75%)',
                            maskImage: 'radial-gradient(ellipse at center right, black 20%, transparent 75%)',
                        }}
                    />
                </div>
            )}

            {/* ── CONTENT (with Safe Zones) ──────────────────────────────────────────────── */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between px-14 py-5">

                {/* TOP ROW — badge + volume (Clean layout) */}
                <div className="flex items-center justify-between w-full relative z-20">
                    <div className="inline-flex items-center gap-1.5 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-md shadow-sm">
                        <Flame className="w-3 h-3 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,1)] animate-pulse" />
                        <span className="text-white/90 font-bold text-[8.5px] tracking-[0.2em] uppercase">Öne Çıkan Piyasa</span>
                    </div>
                    
                    <div className="flex items-center gap-2.5 bg-transparent backdrop-blur-sm px-3 py-1 rounded-md">
                        <span className="text-[8.5px] text-zinc-400 tracking-[0.1em] uppercase font-bold">Toplam Havuz</span>
                        <div className="w-[1px] h-3 bg-white/10" />
                        <div className="flex items-baseline gap-1">
                            <span className="text-emerald-400 font-black text-[10px] drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">₺</span>
                            <span className="text-white font-black text-[14px] tracking-tight drop-shadow-sm">{p.volumePlayed.replace('₺', '').trim()}</span>
                        </div>
                    </div>
                </div>

                {/* MIDDLE — question */}
                <div className="w-[80%] mt-3 mb-3">
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/70 font-black leading-[1.1] tracking-tight drop-shadow-md line-clamp-2"
                        style={{ fontSize: 'clamp(20px, 2.2vw, 28px)' }}
                    >
                        {p.question}
                    </h2>
                </div>

                {/* BOTTOM — options bar (Frameless & Compact) */}
                <div className="flex items-center gap-4 w-fit max-w-full overflow-x-auto pb-1 scrollbar-hide">
                    {displayItems.slice(0, 4).map((item, i) => {
                        const isTop = topItem && item.id === topItem.id;
                        
                        // Vary the charts so they don't look identical
                        const chartPaths = [
                            "M0,28 L20,18 L40,22 L60,10 L80,12 L100,2",
                            "M0,28 L20,24 L40,26 L60,16 L80,20 L100,12",
                            "M0,20 L20,15 L40,25 L60,20 L80,28 L100,18",
                            "M0,15 L20,10 L40,20 L60,15 L80,25 L100,15",
                        ];
                        const pathString = isTop ? chartPaths[0] : chartPaths[(i % 3) + 1];

                        const hue = (item.name.length * 137.5) % 360;
                        const iconBg = isTop ? primary : `hsl(${hue}, 70%, 50%)`;

                        return (
                            <div
                                key={item.id || i}
                                className={`relative flex flex-col justify-between min-w-[110px] px-2 py-1.5 transition-all duration-300 group/card hover:-translate-y-1 ${
                                    isTop
                                        ? 'bg-white/[0.02] rounded-lg'
                                        : 'bg-transparent hover:bg-white/[0.02] rounded-lg'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-1.5">
                                        <div 
                                            className="w-1 h-1 rounded-full shadow-sm opacity-80"
                                            style={{ backgroundColor: iconBg, boxShadow: `0 0 4px ${iconBg}` }}
                                        />
                                        <span className={`text-[9px] font-bold uppercase tracking-widest truncate max-w-[65px] ${isTop ? 'text-white drop-shadow-sm' : 'text-zinc-400 group-hover/card:text-zinc-300'} transition-colors`}>
                                            {item.name}
                                        </span>
                                    </div>
                                    {isTop && (
                                        <div className="flex items-center gap-0.5 bg-emerald-500/10 px-1 py-0.5 rounded">
                                            <TrendingUp className="w-2 h-2 text-emerald-400 animate-bounce" style={{ animationDuration: '2s' }} />
                                            <span className="text-[6.5px] font-black text-emerald-400 uppercase tracking-widest drop-shadow-sm">Favori</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex items-end justify-between mt-0.5">
                                    <span className={`font-black text-[18px] leading-none tracking-tight transition-transform duration-300 group-hover/card:scale-105 origin-bottom-left ${isTop ? 'text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-500 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]' : 'text-white drop-shadow-sm'}`}>
                                        {item.probability}%
                                    </span>
                                    {/* Abstract line chart visual */}
                                    <svg className="w-9 h-3.5 opacity-50 transition-transform duration-500 group-hover/card:scale-110 group-hover/card:opacity-80 origin-bottom-right" viewBox="0 0 100 30" preserveAspectRatio="none">
                                        <defs>
                                            <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor={isTop ? "#34d399" : "#ffffff"} stopOpacity="0.1" />
                                                <stop offset="100%" stopColor={isTop ? "#10b981" : "#ffffff"} stopOpacity="0.8" />
                                            </linearGradient>
                                        </defs>
                                        <path d={pathString} 
                                              fill="none" 
                                              stroke={`url(#grad-${i})`}
                                              strokeWidth="4" 
                                              strokeLinecap="round" 
                                              strokeLinejoin="round" 
                                              className={isTop ? "drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]" : ""}
                                        />
                                    </svg>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── Promo slide ─────────────────────────────────────────────────────────────
function PromoSlide() {
    return (
        <div
            className="relative w-full overflow-hidden rounded-[20px] cursor-pointer group"
            style={{ height: '220px', background: '#060B14' }}
        >
            {/* Photo */}
            <div
                className="absolute top-0 right-0 w-[60%] h-full z-0 overflow-hidden"
                style={{
                    maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
                }}
            >
                <img
                    src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1400&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-30 mix-blend-screen group-hover:scale-105 transition-transform duration-[10s]"
                    alt="Football"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060B14] via-[#060B14]/60 to-cyan-900/40 mix-blend-multiply" />
            </div>

            {/* Orb */}
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00E5FF] opacity-15 blur-[130px] rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none mix-blend-screen" />

            {/* Top shimmer */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

            {/* Content (with Safe Zones) */}
            <div className="absolute inset-0 z-10 flex flex-col justify-center px-14">
                <div className="inline-flex items-center gap-1.5 mb-2 bg-[#00E5FF]/10 px-2.5 py-1 rounded-md w-fit">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] animate-pulse" />
                    <span className="text-[#00E5FF] font-bold text-[8.5px] tracking-[0.2em] uppercase">Anında Nakit</span>
                </div>
                <h2 className="font-black uppercase italic tracking-tight leading-[0.95] drop-shadow-md mb-2"
                    style={{ fontSize: 'clamp(22px, 3.5vw, 36px)' }}
                >
                    <span className="text-white block">ERKEN</span>
                    <span className="text-[#00E5FF] block drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">ÖDEME</span>
                </h2>
                <div className="border-l-[3px] border-[#00E5FF]/50 pl-3">
                    <p className="text-zinc-300 text-[11px] max-w-[280px] font-medium leading-relaxed">
                        Takımın <strong className="text-white font-bold">2 gol</strong> öne geçtiği an kuponun kazanır.
                    </p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <button className="flex items-center gap-1.5 bg-gradient-to-r from-[#00E5FF] to-cyan-400 text-black font-black text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] active:scale-95">
                        <Zap className="w-3.5 h-3.5" />
                        Hemen Katıl
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Slider ─────────────────────────────────────────────────────────────
const SLIDE_DURATION = 7000;

export default function PredictionsPromoSlider({ predictions = [] }: { predictions?: PredictionItem[] }) {
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const slideRef    = useRef<ReturnType<typeof setInterval> | null>(null);

    const slides = useMemo(() => {
        const top = [...predictions]
            .filter(p => p.status === 'active')
            .sort((a, b) => b.rawVolume - a.rawVolume)
            .slice(0, 6);

        const predSlides = top.map((p, i) => ({
            id: p.id || `pred_${i}`,
            content: <PredictionSlide p={p} idx={i} />,
        }));

        // Weave in 1 promo after index 2
        const result = [...predSlides];
        result.splice(Math.min(2, result.length), 0, {
            id: 'promo_erken',
            content: <PromoSlide />,
        });

        return result;
    }, [predictions]);

    const goTo = (idx: number) => {
        setCurrent(idx);
        setProgress(0);
        if (progressRef.current) clearInterval(progressRef.current);
        if (slideRef.current) clearInterval(slideRef.current);
        startProgress();
        startSlideInterval();
    };

    // Reset slider when data changes to prevent out-of-bounds empty screens
    useEffect(() => {
        setCurrent(0);
        setProgress(0);
        if (progressRef.current) clearInterval(progressRef.current);
        if (slideRef.current) clearInterval(slideRef.current);
        if (slides.length > 1) {
            startProgress();
            startSlideInterval();
        }
    }, [predictions, slides.length]);

    const startProgress = () => {
        const step = 100 / (SLIDE_DURATION / 50);
        progressRef.current = setInterval(() => {
            setProgress(p => {
                if (p >= 100) return 0;
                return p + step;
            });
        }, 50);
    };

    const startSlideInterval = () => {
        slideRef.current = setInterval(() => {
            setCurrent(c => (c + 1) % slides.length);
            setProgress(0);
        }, SLIDE_DURATION);
    };

    useEffect(() => {
        return () => {
            if (progressRef.current) clearInterval(progressRef.current);
            if (slideRef.current) clearInterval(slideRef.current);
        };
    }, []);

    if (slides.length === 0) return null;

    return (
        <div className="w-full relative group/slider mb-8">
            <style>{`
                @keyframes slowPan {
                    0%   { transform: scale(1.05) translate3d(0,0,0); }
                    100% { transform: scale(1.15) translate3d(-2%,-1%,0); }
                }
            `}</style>

            {/* SLIDER TRACK */}
            <div className="overflow-hidden rounded-[20px] w-full border border-white/[0.04] shadow-2xl relative">
                <div
                    className="flex"
                    style={{
                        transform: `translateX(-${current * 100}%)`,
                        transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {slides.map(slide => (
                        <div key={slide.id} className="w-full flex-shrink-0">
                            {slide.content}
                        </div>
                    ))}
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/5 rounded-b-[20px] overflow-hidden z-30 pointer-events-none">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-none shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* DOTS (Moved slightly up to stay off buttons) */}
            {slides.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 pointer-events-none">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goTo(idx)}
                            className={`pointer-events-auto rounded-full transition-all duration-300 ${
                                idx === current
                                    ? 'w-5 h-1.5 bg-white'
                                    : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            )}

            {/* ARROWS (Bigger, more distinct) */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-white/70 opacity-0 group-hover/slider:opacity-100 hover:bg-black/60 hover:text-white hover:scale-110 transition-all z-40 shadow-xl"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => goTo((current + 1) % slides.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl flex items-center justify-center text-white/70 opacity-0 group-hover/slider:opacity-100 hover:bg-black/60 hover:text-white hover:scale-110 transition-all z-40 shadow-xl"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}
        </div>
    );
}
