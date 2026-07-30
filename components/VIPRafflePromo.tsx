import React, { useState, useEffect } from 'react';
import { Ticket, Flame, Trophy, AlertCircle, Gift, Clock, Coins, Users } from 'lucide-react';

interface VIPRafflePromoProps {
  loyalty: { tickets: number; deposit: number };
  onOpenDepositModal: () => void;
  onBuyTicket: () => void;
  buyMsg: string;
  totalSoldInMatrix: number;
  totalPoolSize: number;
  targetDateStr: string;
  onOpenArenaModal?: () => void;
}

const VIPRafflePromo: React.FC<VIPRafflePromoProps> = ({
  loyalty,
  onOpenDepositModal,
  onBuyTicket,
  buyMsg,
  totalSoldInMatrix,
  totalPoolSize,
  targetDateStr,
  onOpenArenaModal
}) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAllPrizes, setShowAllPrizes] = useState(false);
  const [activeToastIndex, setActiveToastIndex] = useState(0);

  const toasts = [
    { icon: '🚀', text: <><span className="text-white font-bold font-mono">u***k</span> az önce <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">$150</span> yatırdı ve <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">3 bilet</span> kazandı!</> },
    { icon: '🔥', text: <><span className="text-white font-bold font-mono">a***r</span> az önce <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">$50</span> yatırdı ve <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">1 bilet</span> kazandı!</> },
    { icon: '⚡', text: <><span className="text-white font-bold font-mono">k***9</span> az önce <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">$500</span> yatırdı ve <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">10 bilet</span> kazandı!</> },
    { icon: '⭐', text: <><span className="text-white font-bold font-mono">m***t</span> az önce <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">$100</span> yatırdı ve <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">2 bilet</span> kazandı!</> },
  ];

  const progressPercent = (totalSoldInMatrix / totalPoolSize) * 100;
  const remainingTickets = totalPoolSize - totalSoldInMatrix;

  const slides = [
    {
      badge: "YILIN VIP ETKİNLİĞİ",
      title: "Milyonluk Ödül Havuzu",
      highlight: "$20.000",
      bgImage: "/images/raffle/raffle_bg_1_1784885265917.webp",
    },
    {
      badge: "KAZANMA ŞANSINI ARTIR",
      title: "Her $50 Yatırım = 1 Bilet",
      highlight: "ŞİMDİ KAZAN!",
      bgImage: "/images/raffle/raffle_bg_2_1784885277775.webp",
    },
    {
      badge: "LİDERLİK TABLOSU",
      title: "Canlı Akış & Rekabet",
      highlight: "ZİRVEYE ÇIK",
      bgImage: "/images/raffle/raffle_bg_3_1784885287128.webp",
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDateStr) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  return (
    <div className="w-full flex-1 m-0 p-0 relative font-sans bg-[#050508] flex flex-col">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes marqueeUp {
          0% { transform: translateY(0%); }
          100% { transform: translateY(-50%); }
        }
        @keyframes progressStripes {
          0% { background-position: 1rem 0; }
          100% { background-position: 0 0; }
        }
        .progress-striped {
          background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
          background-size: 1rem 1rem;
          animation: progressStripes 1s linear infinite;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        .glass-panel {
          background: rgba(20, 20, 25, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.02);
        }
        .gold-gradient-text {
          background: linear-gradient(to right, #FDF0D5, #D4AF37, #FDF0D5);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.05) translate(-1%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-ken-burns {
          animation: kenBurns 20s ease-in-out infinite alternate;
        }
      `}</style>
      
      {/* Background Ambient Glow (Subtle) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col flex-1 w-full overflow-hidden">
        
        {/* HEADER SECTION - ULTRA BRIGHT SLIDER */}
        <div className="w-full border-b border-white/10 relative overflow-hidden flex flex-col items-center text-center min-h-[200px] md:min-h-[250px] justify-center bg-black">
          
          {/* Slider Backgrounds */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050508]">
            {slides.map((slide, index) => (
              <div 
                key={`bg-${index}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === activeSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={slide.bgImage} 
                  alt="" 
                  className="w-full h-full object-cover opacity-[0.35] mix-blend-screen animate-ken-burns"
                />
              </div>
            ))}
             
             {/* Base dark gradient overlay for text readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/60 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/80 via-transparent to-[#050508]/80" />
             
             {/* Geometric Grid / Stars for extra texture */}
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-60 mix-blend-overlay" />
          </div>

          <div className="w-full max-w-[1400px] mx-auto p-4 md:p-12 relative z-10 flex flex-col items-center justify-center flex-1">
             
             <div className="relative w-full h-[160px] md:h-[180px] flex items-center justify-center">
               {slides.map((slide, index) => (
                 <div 
                   key={index}
                   className={`absolute transition-all duration-1000 ease-in-out flex flex-col items-center justify-center w-full ${
                     index === activeSlide 
                       ? 'opacity-100 transform translate-y-0 scale-100' 
                       : 'opacity-0 transform translate-y-12 scale-95 pointer-events-none'
                   }`}
                 >
                    <div className="relative group px-6 py-4 md:px-12 md:py-5 rounded-[2rem] flex flex-col items-center max-w-4xl w-full mx-4 overflow-hidden border border-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
                      {/* Ultra Premium Glass Background */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-[#050508]/60 to-[#000000]/90 backdrop-blur-[50px]" />
                      
                      {/* Premium Top Inner Border Highlight */}
                      <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.8)] pointer-events-none" />
                      
                      {/* Subtle Ambient Glow inside the card */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[200px] bg-amber-500/10 rounded-[100%] blur-[80px] pointer-events-none transition-opacity duration-1000 opacity-40 group-hover:opacity-70" />
                      
                      {/* Edge Lighting (Dynamic on hover) */}
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-300/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      
                      <div className="relative z-10 flex flex-col items-center w-full">
                        <div className="group/badge relative inline-flex items-center justify-center px-4 py-1 mb-2 text-sm font-semibold transition-all duration-300">
                          {/* Gradient Border Mask */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/40 via-amber-200/10 to-amber-500/40 p-[1px]">
                            <div className="absolute inset-0 h-full w-full rounded-full bg-black/40 backdrop-blur-xl" />
                          </div>
                          {/* Ambient Glow */}
                          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500" />
                          
                          {/* Content */}
                          <span className="relative z-10 flex items-center gap-3 tracking-[0.2em] text-[10px] uppercase">
                             <span className="relative flex h-2 w-2">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_10px_rgba(245,166,35,1)]"></span>
                             </span>
                             <span className="bg-gradient-to-r from-amber-100 to-amber-400 bg-clip-text text-transparent font-black drop-shadow-sm">{slide.badge}</span>
                          </span>
                        </div>
                        
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white/90 leading-tight mb-0.5 tracking-tight">
                          {slide.title}
                        </h1>
                        
                        <div className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter gold-gradient-text drop-shadow-2xl">
                          {slide.highlight}
                        </div>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
             
             {/* Slider Indicators */}
             <div className="flex items-center gap-3 mt-auto absolute bottom-8">
               {slides.map((_, i) => (
                 <button 
                   key={i}
                   onClick={() => setActiveSlide(i)}
                   className={`h-1.5 rounded-full transition-all duration-500 ${i === activeSlide ? 'w-10 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,1)]' : 'w-3 bg-white/30 hover:bg-white/60'}`}
                 />
               ))}
             </div>
          </div>
        </div>

        {/* VERTICAL CONTENT SECTION */}
        <div className="w-full max-w-[1000px] mx-auto flex-1 flex flex-col gap-16 py-16 px-6 md:px-8">
          
          {/* LÜKS BİLET HAVUZU BANNER */}
          <div className="flex flex-col items-center justify-start relative">
             <h2 className="text-amber-500 text-lg md:text-xl font-black uppercase tracking-widest mb-6 w-full text-center flex items-center gap-2 justify-center drop-shadow-[0_0_10px_rgba(245,166,35,0.6)]">
               <Ticket className="w-6 h-6 animate-pulse" /> VIP Bilet Havuzu
             </h2>
             <div className="w-full bg-[#030407]/90 backdrop-blur-2xl rounded-3xl p-6 lg:p-10 border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.02)] relative overflow-hidden group flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 mix-blend-overlay" />
                 <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 
                 <div className="relative z-10 flex flex-col gap-2 text-center md:text-left">
                    <div className="text-slate-300 font-bold text-sm tracking-widest uppercase">Durum</div>
                    <div className="text-white font-black text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">1000 Bilet / 50 Kazanan</div>
                 </div>

                 <button 
                    onClick={onOpenArenaModal}
                    className="relative z-10 w-full md:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-300 text-amber-950 font-black text-sm md:text-base uppercase tracking-widest shadow-[0_0_20px_rgba(245,166,35,0.4)] hover:shadow-[0_0_30px_rgba(245,166,35,0.6)] transition-all transform hover:-translate-y-1 animate-sweep flex items-center justify-center gap-3"
                 >
                    <Ticket className="w-5 h-5" /> Biletini Seç (Havuzu Aç)
                 </button>
             </div>
          </div>

{/* MIDDLE COLUMN: Prizes */}
          <div className="flex flex-col items-center justify-start relative">
            <h2 className="text-[#A0A0AB] text-[11px] font-semibold uppercase tracking-widest mb-4 w-full text-left md:text-center flex items-center gap-2 justify-start md:justify-center">
              <Trophy className="w-4 h-4 text-yellow-500/70" /> Ödül Dağılımı
            </h2>
            
            <div className="w-full flex flex-col gap-5">
              {/* 1st Prize */}
              <div className="glass-panel rounded-3xl p-6 lg:p-8 flex items-center justify-between border-amber-500/30 hover:bg-amber-500/5 transition-colors group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 flex items-center justify-center border border-yellow-500/30">
                    <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.8)] group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-[#A0A0AB] text-[10px] font-semibold uppercase tracking-wider mb-1">1. Şanslı</div>
                    <div className="text-amber-100/90 font-bold text-lg">Altın Kupa</div>
                  </div>
                </div>
                <div className="text-2xl font-black gold-gradient-text drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">$10.000</div>
              </div>

              {/* 2nd - 5th Prize */}
              <div className="glass-panel rounded-3xl p-6 lg:p-8 flex items-center justify-between border-slate-400/20 hover:bg-slate-400/5 transition-colors group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300/10 to-slate-500/10 flex items-center justify-center border border-slate-400/20">
                    <Trophy className="w-6 h-6 text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.6)] group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="text-[#A0A0AB] text-[10px] font-semibold uppercase tracking-wider mb-1">2. - 5. Şanslılar</div>
                    <div className="text-amber-100/90 font-bold text-lg">Gümüş Kupa</div>
                  </div>
                </div>
                <div className="text-xl font-black text-slate-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">$5.000</div>
              </div>

              {showAllPrizes && (
                <>
                  {/* 6th - 20th Prizes */}
                  <div className="glass-panel rounded-3xl p-6 lg:p-8 flex items-center justify-between border-amber-600/20 hover:bg-amber-600/5 transition-colors group animate-[scaleIn_0.3s_ease-out]">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Gift className="w-5 h-5 text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.6)] group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <div className="text-[#A0A0AB] text-[10px] font-semibold uppercase tracking-wider mb-1">6. - 20. Şanslılar</div>
                        <div className="text-slate-300 font-medium text-base">Standart Ödül</div>
                      </div>
                    </div>
                    <div className="text-lg font-black text-amber-500 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)]">$1.000</div>
                  </div>

                  {/* 21st - 50th Prizes */}
                  <div className="glass-panel rounded-3xl p-6 lg:p-8 flex items-center justify-between border-slate-600/20 hover:bg-slate-600/5 transition-colors group animate-[scaleIn_0.3s_ease-out]">
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Gift className="w-5 h-5 text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.4)] group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <div className="text-[#A0A0AB] text-[10px] font-semibold uppercase tracking-wider mb-1">21. - 50. Şanslılar</div>
                        <div className="text-slate-300 font-medium text-base">Teselli Ödülü</div>
                      </div>
                    </div>
                    <div className="text-lg font-black text-slate-400 drop-shadow-[0_0_5px_rgba(148,163,184,0.3)]">$500</div>
                  </div>
                </>
              )}
              
              <button 
                onClick={() => setShowAllPrizes(!showAllPrizes)}
                className="mt-2 text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-1 w-full py-4 rounded-xl border border-amber-500/20 hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(251,191,36,0.1)]"
              >
                {showAllPrizes ? 'GİZLE' : 'TÜM 50 ÖDÜLÜ GÖR'}
              </button>
            </div>
          </div>

          {/* LEFT COLUMN: Your Status (Şans Metresi & Bakiye) */}
          <div className="flex flex-col gap-8">
            <h2 className="text-[#A0A0AB] text-[11px] font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-500/70" /> Senin Durumun
            </h2>
            
            {/* Luck Meter */}
            <div className="glass-panel rounded-3xl p-8 lg:p-10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex justify-between items-end mb-6 relative z-10">
                 <div>
                    <div className="text-[#A0A0AB] text-[10px] font-semibold uppercase tracking-widest mb-1">Biletleriniz</div>
                    <div className="text-slate-100 font-bold text-3xl leading-none">{loyalty.tickets}</div>
                 </div>
                 <div className="text-right">
                    <div className="text-[#A0A0AB] text-[10px] font-semibold uppercase tracking-widest mb-1">Şans Metresi</div>
                    <div className={`font-black text-lg ${loyalty.tickets > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      %{loyalty.tickets > 0 ? (loyalty.tickets * 0.5).toFixed(1) : '0'}
                    </div>
                 </div>
               </div>
               
               <div className="w-full h-2 bg-[#0A0A0E] rounded-full overflow-hidden border border-white/5 relative z-10 mb-4">
                 <div 
                   className="h-full rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-1000"
                   style={{ width: `${Math.min((loyalty.tickets / 10) * 100, 100)}%` }}
                 />
               </div>
               
               <div className="text-center relative z-10">
                 {loyalty.tickets === 0 ? (
                   <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider animate-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">Şansını artırmak için bilet al!</span>
                 ) : (
                   <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">Daha çok bilet = Daha çok şans!</span>
                 )}
               </div>
            </div>

            {/* Deposit Progress */}
            <div className="glass-panel rounded-3xl p-8 lg:p-10 flex flex-col gap-5 relative overflow-hidden">
               <div className="flex items-center justify-between mb-2">
                 <div className="text-[#A0A0AB] text-[10px] font-semibold uppercase tracking-widest">Geçerli Yatırımınız</div>
                 <div className="text-slate-100 font-bold text-2xl">${loyalty.deposit.toLocaleString('en-US')}</div>
               </div>
               
               <div className="w-full h-2 bg-[#0A0A0E] rounded-full overflow-hidden border border-white/5 relative z-10 mb-1">
                 <div 
                   className="h-full rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,166,35,0.8)] transition-all duration-1000"
                   style={{ width: `${Math.min((loyalty.deposit % 50) / 50 * 100, 100)}%` }}
                 />
               </div>
               
               <div className="text-center text-[11px] text-[#A0A0AB] font-medium uppercase tracking-wider mb-2">
                 1 Bilet kazanmak için <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">${50 - (loyalty.deposit % 50)}</span> daha yatırın!
               </div>

               <button 
                  onClick={onOpenDepositModal}
                  className="mt-2 w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-amber-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]"
               >
                 Yatırım Yap & Bilet Kazan
               </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Leaderboard & Status */}
          <div className="flex flex-col gap-8">
             <h2 className="text-[#A0A0AB] text-[11px] font-semibold uppercase tracking-widest mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-emerald-500/70" /> Canlı Durum</div>
                {remainingTickets <= 200 ? (
                  <div className="flex items-center gap-1 bg-red-600/20 text-red-500 px-3 py-1.5 rounded-lg border border-red-500/50 animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" /> <span className="font-black text-xs tracking-wider drop-shadow-[0_0_5px_rgba(239,68,68,1)]">SON {remainingTickets} BİLET!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {remainingTickets} BİLET KALDI
                  </div>
                )}
             </h2>

             {/* Progress */}
             <div className="glass-panel rounded-3xl p-8 lg:p-10">
               <div className="flex justify-between items-end mb-4">
                 <span className="text-[10px] text-[#A0A0AB] font-semibold uppercase tracking-widest">Havuz Doluluk Oranı</span>
                 <span className="text-lg font-bold text-slate-200">{totalSoldInMatrix} / {totalPoolSize}</span>
               </div>
               <div className="w-full h-4 bg-[#0A0A0E] rounded-full overflow-hidden border border-white/5 relative mb-2">
                 <div 
                   className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_15px_rgba(245,166,35,0.6)] progress-striped"
                   style={{ width: `${progressPercent}%` }}
                 />
               </div>
             </div>

             {/* Live Leaderboard */}
             <div className="flex-1 min-h-[220px] glass-panel rounded-3xl p-8 lg:p-10 flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <span className="text-[11px] font-semibold text-amber-500 uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                    <AlertCircle className="w-4 h-4" /> Canlı Akış
                  </span>
                  <span className="text-[9px] text-[#A0A0AB] font-semibold tracking-widest uppercase">
                    LIVE
                  </span>
                </div>
                
                <div className="flex-1 overflow-hidden relative flex flex-col justify-end min-h-[120px]">
                  {toasts.map((toast, index) => (
                    <div 
                      key={index}
                      className={`absolute bottom-0 w-full flex items-center gap-5 bg-gradient-to-r from-white/[0.05] to-transparent p-4 rounded-xl border-l-2 border-amber-500 shadow-[0_0_20px_rgba(245,166,35,0.1)] transition-all duration-500 ${
                        index === activeToastIndex 
                          ? 'opacity-100 transform translate-y-0 z-20 animate-fade-in-up' 
                          : 'opacity-0 transform translate-y-4 pointer-events-none z-10'
                      }`}
                    >
                      <span className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" role="img" aria-label="icon">{toast.icon}</span>
                      <span className="text-[#A0A0AB] text-[13px] leading-tight font-medium">{toast.text}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
                  </div>

        {/* BOTTOM ACTION BAR */}
        <div className="w-full bg-white/[0.02] border-t border-white/5">
          <div className="w-full max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
           
           {/* Timer */}
           <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
               <Clock className="w-5 h-5 text-zinc-400" />
             </div>
             <div>
               <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Sonraki Çekilişe Kalan Zaman</div>
               <div className="flex gap-2 text-2xl font-black text-white font-mono tracking-wider">
                 <span>{timeLeft.hours.toString().padStart(2, '0')}</span><span className="text-white/30">:</span>
                 <span>{timeLeft.minutes.toString().padStart(2, '0')}</span><span className="text-white/30">:</span>
                 <span className="text-amber-400">{timeLeft.seconds.toString().padStart(2, '0')}</span>
               </div>
             </div>
           </div>

           {/* Buttons */}
           <div className="flex flex-col sm:flex-row items-center gap-5 w-full md:w-auto">
             <button 
                onClick={onOpenDepositModal}
                className="w-full sm:w-auto px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
             >
               <Gift className="w-5 h-5" />
               Yatırım Yap & Bilet Kazan
             </button>
           </div>
          </div>
        </div>
        
        {buyMsg && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs font-bold px-4 py-2 rounded-lg backdrop-blur-md border ${buyMsg.includes('✅') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {buyMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default VIPRafflePromo;
