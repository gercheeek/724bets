import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SportsPromoSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [0, 1, 2];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className="w-full relative group/slider mb-4">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,800;0,900;1,800;1,900&display=swap');
                
                .font-montserrat {
                    font-family: 'Montserrat', sans-serif;
                }

                @keyframes slowPan {
                    0% { transform: scale(1.05) translateX(0) translateY(0); }
                    100% { transform: scale(1.15) translateX(-2%) translateY(-1%); }
                }
                @keyframes pulseGlow {
                    0%, 100% { opacity: 0.6; filter: blur(30px) scale(1); }
                    50% { opacity: 1; filter: blur(45px) scale(1.1); }
                }
                
                @keyframes titleSlideUp {
                    0% { opacity: 0; transform: translateY(40px) skewY(2deg); filter: blur(8px); }
                    100% { opacity: 1; transform: translateY(0) skewY(0); filter: blur(0); }
                }
                @keyframes badgePop {
                    0% { opacity: 0; transform: scale(0.8) translateY(10px); }
                    60% { opacity: 1; transform: scale(1.05) translateY(-2px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes contentFadeIn {
                    0% { opacity: 0; transform: translateX(-30px); filter: blur(5px); }
                    100% { opacity: 1; transform: translateX(0); filter: blur(0); }
                }
                @keyframes graphicSlideIn {
                    0% { opacity: 0; transform: translateX(50px) rotate(5deg) scale(0.9); filter: blur(10px); }
                    100% { opacity: 1; transform: translateX(0) rotate(0) scale(1); filter: blur(0); }
                }
                
                .animate-slow-pan { animation: slowPan 20s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite alternate; }
                .animate-pulse-glow { animation: pulseGlow 5s ease-in-out infinite; }
                
                .anim-active .badge-anim { animation: badgePop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .anim-active .title-anim { animation: titleSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
                .anim-active .desc-anim { animation: contentFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
                .anim-active .graphic-anim { animation: graphicSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
                
                .text-stroke-emerald {
                    -webkit-text-stroke: 2px rgba(52, 211, 153, 0.8);
                    color: transparent;
                }
                
                .text-stroke-yellow {
                    -webkit-text-stroke: 2px rgba(250, 204, 21, 0.8);
                    color: transparent;
                }
                
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                    transform: rotate(180deg);
                }
                
                .premium-text-gradient {
                    background: linear-gradient(135deg, #ffffff 0%, #d4d4d8 50%, #71717a 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                /* Text Gradients for Left Titles */
                .title-gradient-white {
                    background: linear-gradient(to bottom, #ffffff 0%, #d1d5db 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .title-gradient-emerald {
                    background: linear-gradient(to bottom, #34d399 0%, #059669 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .title-gradient-yellow {
                    background: linear-gradient(to bottom, #fde047 0%, #ca8a04 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .title-gradient-cyan {
                    background: linear-gradient(to bottom, #00E5FF 0%, #008899 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            <div className="overflow-hidden rounded-xl relative w-full h-[160px] sm:h-[190px] md:h-[220px] bg-[#1a1c24] shadow-2xl cursor-pointer font-montserrat">
                
                {/* SLIDES CONTAINER */}
                <div 
                    className="w-full h-full flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {/* ================= SLIDE 1: SYNAPSE ESPORTS ================= */}
                    <div className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#0a0f1d]">
                        {/* Vertical Side Text */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-cyan-900/10 flex items-center justify-center border-r border-white/5 z-20 backdrop-blur-sm">
                            <span className="vertical-text text-[10px] font-black text-cyan-400/30 tracking-[0.3em] uppercase">724BETS PARTNERS</span>
                        </div>

                        {/* Background Image */}
                        <div className="absolute top-0 right-0 w-[85%] md:w-[65%] h-full z-[2] overflow-hidden" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop" 
                                className="w-full h-full object-cover opacity-60 mix-blend-screen animate-slow-pan" 
                                alt="Esports" 
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,15,29,0.8)_100%)] pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d] via-[#0a0f1d]/70 to-cyan-900/10 mix-blend-multiply"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-center px-12 md:px-16">
                            <div className={`${currentSlide === 0 ? 'anim-active' : ''}`}>
                                
                                {/* Badge */}
                                <div className="badge-anim inline-flex items-center gap-2 mb-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2.5 py-1 rounded-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"></div>
                                    <span className="text-[#00E5FF] font-bold text-[9px] md:text-[10px] tracking-[0.25em] uppercase">
                                        GLOBAL PARTNERSHIP
                                    </span>
                                </div>
                                
                                {/* Title */}
                                <h2 className="title-anim text-[28px] sm:text-[38px] md:text-[48px] font-black leading-[0.9] tracking-[-0.03em] italic uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-2">
                                    <span className="title-gradient-white">SYNAPSE</span> <br className="hidden sm:block"/>
                                    <span className="title-gradient-cyan">ESPORTS</span>
                                </h2>
                                
                                {/* Description */}
                                <div className="desc-anim border-l-[3px] border-[#00E5FF]/50 pl-3 md:pl-4 mt-2">
                                    <p className="text-gray-300 text-[11px] sm:text-[12px] md:text-[13px] max-w-[280px] sm:max-w-[350px] md:max-w-[420px] font-medium leading-snug tracking-wide">
                                        724bets is proud to be the official global betting partner of Synapse Esports. Bet on all major tournaments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ================= SLIDE 2: ERKEN ÖDEME ================= */}
                    <div className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#0b0e11]">
                        
                        {/* Vertical Side Text */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-emerald-500/5 flex items-center justify-center border-r border-white/5 z-20 backdrop-blur-sm">
                            <span className="vertical-text text-[10px] font-black text-emerald-500/30 tracking-[0.3em] uppercase">YENİ ÖZELLİK</span>
                        </div>

                        {/* Background Image */}
                        <div className="absolute top-0 right-0 w-[85%] md:w-[65%] h-full z-[2] overflow-hidden" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}>
                            <img 
                                src="https://images.unsplash.com/photo-1508344928928-7137b29de218?q=80&w=1200&auto=format&fit=crop" 
                                className="w-full h-full object-cover opacity-50 mix-blend-screen animate-slow-pan" 
                                alt="Stadium Lights" 
                            />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,14,17,0.8)_100%)] pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e11] via-[#0b0e11]/80 to-emerald-900/10 mix-blend-multiply"></div>
                            
                            {/* Massive Abstract Glow */}
                            <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[60px] rounded-full animate-pulse-glow pointer-events-none"></div>
                        </div>

                        {/* Content */}
                        <div className={`absolute inset-0 z-10 flex items-center px-12 md:px-16 ${currentSlide === 1 ? 'anim-active' : ''}`}>
                            {/* LEFT SIDE TEXT */}
                            <div className="w-full md:w-[60%] flex flex-col justify-center">
                                
                                {/* Badge */}
                                <div className="badge-anim inline-flex items-center gap-2 mb-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-sm w-fit">
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_10px_#34d399]"></span>
                                    </span>
                                    <span className="text-emerald-400 font-bold text-[9px] md:text-[10px] tracking-[0.25em] uppercase">
                                        ANINDA NAKİT
                                    </span>
                                </div>
                                
                                {/* Title */}
                                <h2 className="title-anim text-[28px] sm:text-[38px] md:text-[48px] font-black leading-[0.9] tracking-[-0.03em] italic uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-2">
                                    <span className="title-gradient-white">ERKEN</span> <br className="hidden sm:block"/>
                                    <span className="text-zinc-300">ÖDEME</span>
                                </h2>
                                
                                {/* Description */}
                                <div className="desc-anim border-l-[3px] border-white/20 pl-3 md:pl-4 mt-2">
                                    <p className="text-gray-300 text-[11px] sm:text-[12px] md:text-[13px] max-w-[280px] sm:max-w-[350px] md:max-w-[420px] font-medium leading-snug tracking-wide">
                                        Takımınız <strong className="text-white font-bold">2 GOL</strong> öne geçtiği an kuponunuz kazanır. 
                                        Maçın sonucunu beklemeye son!
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT SIDE GRAPHIC */}
                            <div className="hidden md:flex graphic-anim w-[40%] h-full items-center justify-end pr-8">
                                <div className="relative flex items-center">
                                    <div className="absolute -left-6 -top-4 text-[100px] leading-none font-black italic opacity-10 select-none text-white" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)', color: 'transparent' }}>
                                        +2
                                    </div>
                                    <div className="text-[90px] leading-none font-black premium-text-gradient italic relative z-10 select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                                        +2
                                    </div>
                                    <div className="ml-4 flex flex-col">
                                        <div className="w-8 h-[3px] bg-white/40 mb-1.5 shadow-[0_0_8px_rgba(255,255,255,0.2)]"></div>
                                        <div className="text-white font-black text-[14px] tracking-[0.4em] uppercase leading-none">
                                            GOL
                                        </div>
                                        <div className="text-white/40 font-bold text-[10px] tracking-widest uppercase mt-0.5">
                                            FARKI
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ================= SLIDE 3: KAZANCINI İKİYE KATLA ================= */}
                    <div className="w-full h-full flex-shrink-0 relative overflow-hidden bg-[#050b14]">
                        
                        {/* Vertical Side Text */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-cyan-900/10 flex items-center justify-center border-r border-[#00E5FF]/10 z-20 backdrop-blur-sm">
                            <span className="vertical-text text-[10px] font-black text-[#00E5FF]/30 tracking-[0.3em] uppercase">HAFTANIN PROMOSU</span>
                        </div>

                        {/* Background Image */}
                        <div className="absolute top-0 right-0 w-[85%] md:w-[65%] h-full z-[2] overflow-hidden" style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)' }}>
                            <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover opacity-50 mix-blend-screen animate-slow-pan" alt="Football pitch" />
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,11,20,0.9)_100%)] pointer-events-none"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#050b14]/80 to-cyan-900/40 mix-blend-multiply"></div>
                            <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[400px] h-[400px] bg-[#00E5FF]/15 blur-[60px] rounded-full animate-pulse-glow pointer-events-none"></div>
                        </div>
                        <div className={`absolute inset-0 z-10 flex items-center px-12 md:px-16 ${currentSlide === 2 ? 'anim-active' : ''}`}>
                            <div className="w-full md:w-[60%] flex flex-col justify-center">
                                <div className="badge-anim inline-flex items-center gap-2 mb-2 bg-[#00E5FF]/10 border border-[#00E5FF]/20 px-2.5 py-1 rounded-sm w-fit">
                                    <div className="w-1.5 h-1.5 rounded-[1px] bg-[#00E5FF] shadow-[0_0_8px_#00E5FF] rotate-45"></div>
                                    <span className="text-[#00E5FF] font-bold text-[9px] md:text-[10px] tracking-[0.25em] uppercase">VİP KAZANÇ</span>
                                </div>
                                <h2 className="title-anim text-[28px] sm:text-[38px] md:text-[48px] font-black leading-[0.9] tracking-[-0.03em] italic uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-2">
                                    <span className="title-gradient-white">KAZANCINI</span> <br className="hidden sm:block"/>
                                    <span className="title-gradient-cyan">İKİYE KATLA</span>
                                </h2>
                                <div className="desc-anim border-l-[3px] border-[#00E5FF]/50 pl-3 md:pl-4 mt-2">
                                    <p className="text-gray-300 text-[11px] sm:text-[12px] md:text-[13px] max-w-[280px] sm:max-w-[350px] md:max-w-[420px] font-medium leading-snug tracking-wide">
                                        Favori takımınıza bahis yapın, maçı <strong className="text-[#00E5FF] font-bold">2 gol farkla</strong> kazanırsanız, net kazancınızı anında 2'ye katlayalım!
                                    </p>
                                </div>
                            </div>
                            <div className="hidden md:flex graphic-anim w-[40%] h-full items-center justify-end pr-8">
                                <div className="relative flex items-center">
                                    <div className="absolute -left-6 -top-4 text-[100px] leading-none font-black text-stroke-blue italic opacity-50 select-none">2X</div>
                                    <div className="text-[90px] leading-none font-black premium-text-gradient italic relative z-10 select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">2X</div>
                                    <div className="flex flex-col gap-1 z-10 -ml-4 mt-6">
                                        <div className="w-12 h-1 bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] rounded-full"></div>
                                        <div className="text-[#00E5FF] font-black text-[14px] tracking-[0.4em] uppercase leading-none">FREEBET</div>
                                        <div className="text-white/40 font-bold text-[10px] tracking-widest uppercase mt-0.5">KAZANÇ</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Hover Arrows */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-[20]">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length); }}
                        className="w-8 h-8 rounded-full bg-black/60 border border-white/20 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setCurrentSlide((prev) => (prev + 1) % slides.length); }}
                        className="w-8 h-8 rounded-full bg-black/60 border border-white/20 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
