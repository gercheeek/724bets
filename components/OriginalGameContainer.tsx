import React, { ReactNode, useState, useRef } from 'react';
import { ChevronLeft, ShieldCheck, HelpCircle } from 'lucide-react';

interface OriginalGameContainerProps {
    title: string;
    siteUser: any;
    children: ReactNode;         // The main game area (cards, plinko board, etc)
    leftControls?: ReactNode;    // Left side of bottom bar (bet inputs, chips)
    centerControls?: ReactNode;  // Center of bottom bar (Action buttons)
    rightControls?: ReactNode;   // Optional overrides for right side, though balance is default
    onNavigate: (view: string) => void;
}

export default function OriginalGameContainer({ 
    title, 
    siteUser, 
    children, 
    leftControls, 
    centerControls, 
    rightControls,
    onNavigate
}: OriginalGameContainerProps) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    };

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="w-full relative flex flex-col bg-[#0A0C10] overflow-hidden font-sans min-h-[calc(100vh-60px)] arcade-cursor-global"
        >
            
            {/* Global Cursor Spotlight (Flashlight Effect) */}
            <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
                style={{
                  background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 255, 255, 0.05), transparent 50%)`
                }}
            ></div>
            {/* ── BACKGROUND LAYER ── */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#020202]">
                 {/* Subtle magenta glow top right */}
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d946ef]/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
                 <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            {/* ── 724BETS CORPORATE WATERMARK ── */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none text-center w-full">
                <h1 className="text-[100px] md:text-[160px] font-arcade italic tracking-tighter text-[#00ffff] opacity-[0.02] select-none" style={{ WebkitTextStroke: '1px #00ffff' }}>
                    724BETS
                </h1>
            </div>

            {/* ── TOP NAVIGATION BAR ── */}
            <div className="absolute top-0 w-full flex justify-between items-start px-6 py-6 z-20 pointer-events-none">
                {/* Left: Back to Hub & Rules */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                    <button 
                        onClick={() => onNavigate('originals')}
                        className="flex items-center gap-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 backdrop-blur-md border border-[#00ffff]/30 text-[#00ffff] px-4 py-2 rounded-full transition-all text-[10px] font-arcade uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Lobiye Dön
                    </button>
                    <button className="flex items-center gap-2 bg-[#ff00ff]/10 hover:bg-[#ff00ff]/20 backdrop-blur-md border border-[#ff00ff]/30 text-[#ff00ff] px-4 py-1.5 rounded-full transition-all text-[8px] font-arcade uppercase tracking-wider w-fit shadow-[0_0_10px_rgba(255,0,255,0.2)] mt-1">
                        <HelpCircle className="w-3 h-3" />
                        Nasıl Oynanır
                    </button>
                </div>
                
                {/* Center: Game Title */}
                <div className="hidden md:flex flex-col items-center">
                    <span className="text-[#00ffff] font-arcade tracking-[0.2em] uppercase text-xl drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                        {title}
                    </span>
                    <span className="text-[#ff00ff] text-[8px] font-arcade uppercase tracking-widest mt-2 drop-shadow-[0_0_5px_rgba(255,0,255,0.4)]">724Bets Original</span>
                </div>

                {/* Right: Provably Fair Badge */}
                <div className="pointer-events-auto mt-1">
                    <div className="flex items-center gap-2 bg-[#00ffff]/5 backdrop-blur-md border border-[#00ffff]/30 text-[#00ffff] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,255,0.15)]">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[8px] font-arcade uppercase tracking-wider">Provably Fair</span>
                    </div>
                </div>
            </div>

            {/* ── GAME AREA (Dynamic Content) ── */}
            <div className="flex-1 w-full relative z-10 flex flex-col pt-24 pb-8">
                {children}
            </div>

            {/* ── UNIFIED BOTTOM CONTROL PANEL ── */}
            <div className="w-full flex justify-center pb-4 md:pb-6 z-30 px-2 md:px-4 mt-auto">
                <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-3xl md:rounded-full p-4 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] w-full max-w-5xl">
                    
                    {/* Left Controls (Bets, Chips) */}
                    <div className="flex items-center w-full md:w-auto flex-1 justify-center md:justify-start">
                        {leftControls}
                    </div>

                    {/* Center Controls (Action Buttons) */}
                    <div className="flex items-center justify-center shrink-0 w-full md:w-auto border-y md:border-y-0 border-white/5 py-2 md:py-0">
                        {centerControls}
                    </div>

                    {/* Right Controls (Balance) */}
                    <div className="flex items-center md:flex-col md:items-end w-full md:w-auto flex-1 justify-between md:justify-end">
                        {rightControls ? rightControls : (
                            <>
                                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest md:mb-1">Bakiye</span>
                                <div className="bg-black/80 px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-white/10 shadow-inner flex items-center gap-2">
                                    <span className="text-[#00E5FF] font-black text-base md:text-lg">
                                        ${siteUser ? siteUser.balance.toFixed(2) : '0.00'}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}
