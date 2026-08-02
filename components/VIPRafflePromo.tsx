import React, { useState, useEffect } from 'react';
import { Ticket, Flame, Trophy, AlertCircle, Gift, Clock, Coins, Users, UserCircle, ArrowRight, Star, Sparkles, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VIPRafflePromoProps {
  loyalty: { tickets: number; deposit: number };
  onOpenDepositModal: () => void;
  onBuyTicket: () => void;
  buyMsg: string;
  totalSoldInMatrix: number;
  totalPoolSize: number;
  targetDateStr: string;
  onOpenArenaModal?: () => void;
  isGuest?: boolean;
  onLoginRequired?: () => void;
}

const VIPRafflePromo: React.FC<VIPRafflePromoProps> = ({
  loyalty,
  onOpenDepositModal,
  onBuyTicket,
  buyMsg,
  totalSoldInMatrix,
  totalPoolSize,
  targetDateStr,
  onOpenArenaModal,
  isGuest = false,
  onLoginRequired
}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showAllPrizes, setShowAllPrizes] = useState(false);
  const [activePrize, setActivePrize] = useState(0);
  const [activeToastIndex, setActiveToastIndex] = useState(0);
  const [visiblePurchases, setVisiblePurchases] = useState<any[]>([]);

  const PRIZES = [
    { id: 1, name: 'Rolex Daytona', edition: "'Panda' Edition", value: '$30.000', desc: t('raffle.winner_1_desc', 'Zamanın ötesinde lüks tasarımıyla Rolex Daytona, büyük çekilişin 1 numaralı kazananına hediye edilecek.'), img: '/images/raffle/rolex_daytona.jpg', label: t('raffle.winner_1', '1. ŞANSLI') },
    { id: 2, name: '$10.000 Nakit', edition: 'VIP Cash', value: '$10.000', desc: 'Büyük ödülü kaçıranlara teselli değil, tam 10.000 dolar nakit servet. 2. şanslı kazananın olacak.', img: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1000&auto=format&fit=crop', label: '2. ŞANSLI' },
    { id: 3, name: 'iPhone 15 Pro Max', edition: '1TB Titanium', value: '$1.599', desc: 'En son teknoloji cebinizde. Özel titanyum kasa. 3. şanslı kazananın olacak.', img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop', label: '3. ŞANSLI' }
  ];

  const toasts = [
    { icon: '•', text: <><span className="text-white font-bold font-mono">u***k</span> {t('raffle.toast_just')} <span className="text-[#10b981] font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">$150</span> {t('raffle.toast_deposited')} <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">3 {t('raffle.toast_tickets')}</span> {t('raffle.toast_won')}</> },
    { icon: '•', text: <><span className="text-white font-bold font-mono">a***r</span> {t('raffle.toast_just')} <span className="text-[#10b981] font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">$50</span> {t('raffle.toast_deposited')} <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">1 {t('raffle.toast_tickets')}</span> {t('raffle.toast_won')}</> },
    { icon: '•', text: <><span className="text-white font-bold font-mono">k***9</span> {t('raffle.toast_just')} <span className="text-[#10b981] font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">$500</span> {t('raffle.toast_deposited')} <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">10 {t('raffle.toast_tickets')}</span> {t('raffle.toast_won')}</> },
    { icon: '•', text: <><span className="text-white font-bold font-mono">m***t</span> {t('raffle.toast_just')} <span className="text-[#10b981] font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">$100</span> {t('raffle.toast_deposited')} <span className="text-amber-400 font-bold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">2 {t('raffle.toast_tickets')}</span> {t('raffle.toast_won')}</> },
  ];

  const progressPercent = (totalSoldInMatrix / totalPoolSize) * 100;
  const remainingTickets = totalPoolSize - totalSoldInMatrix;

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
  
  useEffect(() => {
    // FOMO Live Feed logic
    const initialPurchases = [
      { id: 1, user: 'u***k', amount: '$150', tickets: 3, time: '12 sn önce' },
      { id: 2, user: 'a***r', amount: '$50', tickets: 1, time: '45 sn önce' },
      { id: 3, user: 'k***9', amount: '$500', tickets: 10, time: '2 dk önce' },
    ];
    setVisiblePurchases(initialPurchases);

    const fomoInterval = setInterval(() => {
        const names = ['Ahmet_VIP', 'Kaan1907', 'SlotMaster', 'Selin1903', 'ParaBabası', 'Veli_2', 'KuponcuDayı'];
        const amounts = [50, 100, 150, 250, 500, 1000];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        const tickets = randomAmount / 50;
        const newPurchase = {
            id: Date.now(),
            user: names[Math.floor(Math.random() * names.length)],
            amount: `$${randomAmount}`,
            tickets,
            time: 'Şimdi'
        };
        setVisiblePurchases(prev => [newPurchase, ...prev].slice(0, 4));
    }, Math.floor(Math.random() * 5000) + 3000); // 3-8 seconds random interval

    return () => clearInterval(fomoInterval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative font-sans overflow-hidden bg-[#03060C]">
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        
        /* Ultra-premium, perfectly tuned glassmorphism */
        .glass-panel {
          background: rgba(10, 15, 25, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.04);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        .hero-glow {
          background: radial-gradient(circle at 50% -10%, rgba(0, 229, 255, 0.08) 0%, rgba(0, 229, 255, 0) 50%);
        }
        
        .green-glow {
          background: radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0) 50%);
        }
        
        .text-gradient-cyan {
            background: linear-gradient(to right, #E2E8F0, #00E5FF);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Ambient Lights - Softened for elegance */}
      <div className="absolute inset-0 pointer-events-none z-0 hero-glow" />
      <div className="absolute inset-0 pointer-events-none z-0 green-glow" />
      
      {/* ─── SCROLLABLE CONTENT ─── */}
      <div className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center">
        
        {/* HERO SECTION - Tightly proportioned */}
        <div className="w-full max-w-[1200px] flex flex-col items-center text-center pt-10 pb-8 px-6 relative">
            {/* Watermark $20K - Pushed to background safely */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] md:text-[180px] font-black italic leading-none text-white opacity-[0.02] pointer-events-none select-none z-0 tracking-tighter">
                $20K
            </div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 bg-[#00E5FF]/5 border border-[#00E5FF]/15 px-3 py-1.5 rounded-full mb-4 backdrop-blur-md animate-fade-in-up">
                    <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span className="text-[#00E5FF] font-black text-[10px] tracking-[0.2em] uppercase">{t('raffle.week_promo', 'Haftanın Özel Çekilişi')}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4 animate-fade-in-up drop-shadow-lg" style={{ animationDelay: '0.1s' }}>
                    <span className="text-white">{t('raffle.grand', 'BÜYÜK')} </span> 
                    <span className="text-gradient-cyan">{t('raffle.prize_pool', 'ÖDÜL HAVUZU')}</span>
                </h1>
                
                <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-medium mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {t('raffle.pool_desc')}
                </p>
            </div>
        </div>

        {/* MAIN CONTENT GRID - Elegant spacing, no overlap */}
        <div className="w-full max-w-[1200px] px-4 md:px-6 pb-24 flex flex-col lg:flex-row gap-6 relative z-20 mt-4">
            
            {/* LEFT COLUMN - CTA & PRIZES */}
            <div className="flex-1 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                
                {/* 1. MASTER CTA CARD - Golden ratio proportions */}
                <div className="glass-panel rounded-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 to-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex flex-col gap-2 text-center md:text-left flex-1">
                            <div className="text-[#00E5FF] font-bold text-[10px] tracking-widest uppercase flex items-center justify-center md:justify-start gap-1.5">
                                <Ticket className="w-3.5 h-3.5" /> {t('raffle.ticket_status')}
                            </div>
                            <div className="text-white font-black text-3xl md:text-4xl tracking-tight leading-none">
                                1000 {t('raffle.tickets')} <span className="text-zinc-700 mx-1">/</span> <span className="text-gradient-cyan">50 {t('raffle.winners')}</span>
                            </div>
                            <div className="text-zinc-500 text-[13px] font-medium mt-1">{t('raffle.pool_full')}</div>
                        </div>

                        <button 
                            onClick={isGuest ? onLoginRequired : onOpenArenaModal}
                            className="w-full md:w-auto relative overflow-hidden rounded-xl bg-[#00E5FF] hover:bg-[#00cce6] text-[#041E24] px-7 py-3.5 flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] group/btn hover:scale-[1.02]"
                        >
                            <Ticket className="w-4 h-4 text-[#041E24]" />
                            <span className="font-black text-[13px] uppercase tracking-widest">{t('raffle.pick_ticket')}</span>
                        </button>
                    </div>
                </div>

                {/* 2. PRIZE SHOWCASE (INTERACTIVE CAROUSEL) */}
                <div className="flex flex-col gap-4 mt-2">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2.5">
                            <Trophy className="w-4 h-4 text-[#00E5FF]" />
                            <h3 className="text-white font-black text-[15px] uppercase tracking-widest">{t('raffle.vip_showcase')}</h3>
                        </div>
                        {/* Carousel Indicators */}
                        <div className="flex items-center gap-2">
                            {PRIZES.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setActivePrize(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${activePrize === idx ? 'w-6 bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.6)]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* GRAND PRIZE CAROUSEL */}
                    <div className="glass-panel rounded-2xl overflow-hidden relative group border-[#00E5FF]/20 shadow-[0_0_30px_rgba(0,229,255,0.05)]">
                        <div className="flex flex-col md:flex-row items-stretch gap-0 relative z-10 min-h-[220px]">
                            {/* Image Side */}
                            <div className="w-full md:w-[240px] h-[200px] md:h-auto bg-[#03060B] relative flex items-center justify-center overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#00E5FF]/10 to-transparent z-10 pointer-events-none" />
                                <img 
                                    src={PRIZES[activePrize].img} 
                                    alt={PRIZES[activePrize].name} 
                                    className="w-[110%] h-[110%] object-cover mix-blend-screen animate-[pulse_5s_infinite] transition-all duration-700" 
                                />
                                <div className="absolute top-3 left-3 z-20 bg-[#0A0F1A]/90 border border-[#00E5FF]/40 text-[#00E5FF] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                                    {PRIZES[activePrize].label}
                                </div>
                            </div>
                            
                            {/* Content Side */}
                            <div className="flex-1 flex flex-col p-6 text-center md:text-left justify-center relative bg-gradient-to-l from-transparent to-[#00E5FF]/5">
                                {/* Navigation Arrows */}
                                <button onClick={() => setActivePrize((prev) => (prev - 1 + PRIZES.length) % PRIZES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 hidden md:flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20 backdrop-blur-sm border border-white/10"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                                <button onClick={() => setActivePrize((prev) => (prev + 1) % PRIZES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 hidden md:flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20 backdrop-blur-sm border border-white/10"><ChevronRight className="w-5 h-5" /></button>

                                <div className="md:px-10">
                                    <h4 className="text-3xl font-black text-white mb-1 drop-shadow-md">{PRIZES[activePrize].name}</h4>
                                    <div className="text-gradient-cyan text-sm font-bold tracking-widest uppercase">{PRIZES[activePrize].edition}</div>
                                    <p className="text-zinc-400 text-[13px] leading-relaxed mt-4 mb-5 max-w-md mx-auto md:mx-0">
                                        {PRIZES[activePrize].desc}
                                    </p>
                                    <div className="mt-auto">
                                        <div className="inline-block bg-[#050810] border border-[#00E5FF]/20 px-5 py-2.5 rounded-xl shadow-[inset_0_0_20px_rgba(0,229,255,0.05)]">
                                            <span className="text-[#00E5FF]/70 text-[9px] font-black uppercase tracking-widest block mb-0.5">{t('raffle.value')}</span>
                                            <span className="text-2xl font-black text-white tracking-wider">{PRIZES[activePrize].value}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN - DASHBOARD WIDGETS - Tight, compact layouts */}
            <div className="w-full lg:w-[340px] shrink-0 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                
                {/* STATUS DASHBOARD OR GUEST WIDGET */}
                {isGuest ? (
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border-[#00E5FF]/20 bg-[#00E5FF]/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/10 rounded-bl-full pointer-events-none blur-xl" />
                        
                        <div className="flex items-center gap-2 mb-6 relative z-10">
                            <Sparkles className="w-5 h-5 text-[#00E5FF]" />
                            <h3 className="text-white font-black text-[15px] uppercase tracking-widest">{t('raffle.guest_title')}</h3>
                        </div>

                        <div className="flex flex-col gap-5 mb-7 relative z-10">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#00E5FF]/20 flex items-center justify-center shrink-0">
                                    <span className="text-[#00E5FF] font-black text-[12px]">1</span>
                                </div>
                                <div className="pt-0.5">
                                    <h4 className="text-white font-bold text-[13px]">{t('raffle.guest_step1_title')}</h4>
                                    <p className="text-zinc-400 text-[11px] mt-0.5">{t('raffle.guest_step1_desc')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#00E5FF]/20 flex items-center justify-center shrink-0">
                                    <span className="text-[#00E5FF] font-black text-[12px]">2</span>
                                </div>
                                <div className="pt-0.5">
                                    <h4 className="text-white font-bold text-[13px]">{t('raffle.guest_step2_title')}</h4>
                                    <p className="text-zinc-400 text-[11px] mt-0.5">{t('raffle.guest_step2_desc')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-[#00E5FF]/20 flex items-center justify-center shrink-0">
                                    <span className="text-[#00E5FF] font-black text-[12px]">3</span>
                                </div>
                                <div className="pt-0.5">
                                    <h4 className="text-white font-bold text-[13px]">{t('raffle.guest_step3_title')}</h4>
                                    <p className="text-zinc-400 text-[11px] mt-0.5">{t('raffle.guest_step3_desc')}</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={onLoginRequired}
                            className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#10b981] text-[#041E24] px-4 py-3.5 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:shadow-[0_0_30px_rgba(0,229,255,0.45)] group/btn hover:scale-[1.02] font-black uppercase text-[12px] tracking-wider z-10"
                        >
                            <span>{t('raffle.guest_cta')}</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                ) : (
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#10b981]/5 rounded-bl-full pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-6">
                        <UserCircle className="w-4 h-4 text-[#10b981]" />
                        <h3 className="text-white font-black text-[13px] uppercase tracking-widest">{t('raffle.your_status')}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-[#030509] rounded-xl p-4 border border-white/5 flex flex-col items-center text-center">
                            <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-1.5">{t('raffle.your_tickets')}</span>
                            <span className="text-3xl font-black text-white leading-none">{loyalty.tickets}</span>
                        </div>
                        <div className="bg-[#030509] rounded-xl p-4 border border-[#10b981]/20 flex flex-col items-center text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[#10b981]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-[#10b981]/80 text-[9px] font-black uppercase tracking-widest mb-1.5">{t('raffle.luck_meter', 'Kazanma Şansı')}</span>
                            <span className={`text-3xl font-black leading-none ${loyalty.tickets > 0 ? 'text-[#10b981]' : 'text-zinc-600 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]'}`}>
                                %{totalSoldInMatrix > 0 ? ((loyalty.tickets / totalSoldInMatrix) * 100).toFixed(1) : '0.0'}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-5">
                        <div className="flex justify-between items-end mb-1.5">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{t('raffle.deposit_progress')}</span>
                            <span className="text-[11px] font-black text-white">${loyalty.deposit.toLocaleString('en-US')} / $50</span>
                        </div>
                        <div className="w-full h-2 bg-[#030509] rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#10b981] transition-all duration-1000"
                                style={{ width: `${Math.min((loyalty.deposit % 50) / 50 * 100, 100)}%` }}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={onOpenDepositModal}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        {t('raffle.deposit_win')}
                    </button>
                </div>
                )}

                {/* LIVE FEED WIDGET (FOMO) */}
                <div className="glass-panel rounded-2xl p-6 relative flex flex-col overflow-hidden border-t border-[#10b981]/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#10b981]/5 rounded-bl-full pointer-events-none blur-[40px]" />
                    
                    <div className="flex justify-between items-center mb-5 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                            <h3 className="text-white font-black text-[13px] uppercase tracking-widest">Canlı Akış</h3>
                        </div>
                        <div className="text-[#10b981] font-black text-[11px] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20">
                            {totalSoldInMatrix}/{totalPoolSize}
                        </div>
                    </div>

                    <div className="w-full h-1.5 bg-[#030509] rounded-full overflow-hidden mb-4 relative z-10">
                        <div 
                            className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-[#10b981] transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <div className="flex-1 relative h-[160px] rounded-xl overflow-hidden z-10 flex flex-col gap-2">
                        {/* Fading overlay at bottom to mask scrolling */}
                        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0A0F19] to-transparent z-20 pointer-events-none" />
                        
                        {visiblePurchases.map((purchase, index) => (
                            <div 
                                key={purchase.id}
                                className={`flex items-center gap-3 bg-[#030509]/80 backdrop-blur-sm p-3 rounded-lg border border-white/5 shadow-md transition-all duration-500 animate-fade-in-up`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-8 h-8 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center shrink-0">
                                    <Ticket className="w-3.5 h-3.5 text-[#10b981]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-end mb-0.5">
                                        <span className="text-white font-bold font-mono text-[11px] truncate">{purchase.user}</span>
                                        <span className="text-zinc-500 text-[9px] font-semibold">{purchase.time}</span>
                                    </div>
                                    <div className="text-zinc-400 text-[10px] leading-tight">
                                        <span className="text-[#10b981] font-bold">{purchase.amount}</span> yatırdı, 
                                        <span className="text-amber-400 font-bold ml-1">{purchase.tickets} Bilet</span> aldı.
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COUNTDOWN WIDGET */}
                <div className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#00E5FF]" />
                        <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest leading-tight">
                            {t('raffle.next_draw').split(' ')[0]} <br/> {t('raffle.next_draw').split(' ')[1] || ''}
                        </div>
                    </div>
                    <div className="flex gap-1 text-[17px] font-black text-white font-mono tracking-wider">
                        <span>{timeLeft.hours.toString().padStart(2, '0')}</span><span className="text-zinc-600">:</span>
                        <span>{timeLeft.minutes.toString().padStart(2, '0')}</span><span className="text-zinc-600">:</span>
                        <span className="text-[#00E5FF]">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
            
        </div>
      </div>
      
      {/* Toast Alert overlay for buy success/fail */}
      {buyMsg && (
        <div className={`absolute top-6 left-1/2 -translate-x-1/2 text-center text-[11px] font-black tracking-widest uppercase px-6 py-3 rounded-xl backdrop-blur-md border z-50 shadow-xl ${buyMsg.includes('✅') ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {buyMsg}
        </div>
      )}
    </div>
  );
};

export default VIPRafflePromo;
