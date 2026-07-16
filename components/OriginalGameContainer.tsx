import React, { ReactNode } from 'react';
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
    return (
        <div className="w-full relative flex flex-col bg-[#050505] overflow-hidden font-sans" style={{ height: 'calc(100dvh - var(--header-height, 60px))' }}>
            
            {/* ── BACKGROUND LAYER ── */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Base color / Anthracite Radial Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,41,59,1)_0%,rgba(15,23,42,1)_100%)]"></div>
                {/* Cyber Grid Texture */}
                <div className="absolute inset-0 opacity-5"
                     style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)]"></div>
                {/* Subtle Electric Blue Center Glow */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#3B82F6]/10 blur-[120px] rounded-[100%]"></div>
            </div>

            {/* ── 724BETS CORPORATE WATERMARK ── */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none text-center w-full">
                <h1 className="text-[100px] md:text-[160px] font-black italic tracking-tighter text-white opacity-[0.03] select-none">
                    724BETS
                </h1>
            </div>

            {/* ── TOP NAVIGATION BAR ── */}
            <div className="absolute top-0 w-full flex justify-between items-start px-6 py-6 z-20 pointer-events-none">
                {/* Left: Back to Hub & Rules */}
                <div className="flex flex-col gap-2 pointer-events-auto">
                    <button 
                        onClick={() => onNavigate('originals')}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Lobiye Dön
                    </button>
                    <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-gray-400 hover:text-white px-4 py-1.5 rounded-full transition-all text-[10px] font-bold uppercase tracking-wider w-fit">
                        <HelpCircle className="w-3 h-3" />
                        Nasıl Oynanır
                    </button>
                </div>
                
                {/* Center: Game Title */}
                <div className="hidden md:flex flex-col items-center">
                    <span className="text-[#ffd700] font-black tracking-[0.3em] uppercase text-sm drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                        {title}
                    </span>
                    <span className="text-gray-500 text-[9px] uppercase tracking-widest mt-1">724Bets Original</span>
                </div>

                {/* Right: Provably Fair Badge */}
                <div className="pointer-events-auto">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-green-500/30 text-green-400 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Provably Fair</span>
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
                                    <span className="text-emerald-400 font-black text-base md:text-lg">
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
