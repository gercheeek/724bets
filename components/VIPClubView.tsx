import React, { useState, useEffect } from 'react';
import { Crown, Shield, Zap, Target, Star, Gift, ChevronRight, CheckCircle2, Lock, Flame, Diamond, TrendingUp, Gem, Trophy } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VIPClubViewProps {
  onNavigate?: (view: string) => void;
  siteUser?: any;
}

const VIPClubView: React.FC<VIPClubViewProps> = ({ onNavigate, siteUser }) => {
  const { t } = useTranslation();
  // Mock Data for Gamification
  const currentDeposit = 12500;
  const nextLevelDeposit = 20000;
  const progressPercent = (currentDeposit / nextLevelDeposit) * 100;
  
  const currentLevel = { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: Crown };
  const nextLevel = { name: 'Platinum', color: 'from-slate-300 to-slate-500', icon: Diamond };

  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGuestView, setIsGuestView] = useState(true);
  const [guestVolume, setGuestVolume] = useState(10000);
  const [selectedTier, setSelectedTier] = useState<number>(4); // Default to Diamond

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4); // 4 slides
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getCalculatedVIP = (volume: number) => {
    if (volume >= 250000) return { name: 'Diamond', icon: Diamond, cashback: '%15' };
    if (volume >= 100000) return { name: 'Platinum', icon: Diamond, cashback: '%10' };
    if (volume >= 25000) return { name: 'Gold', icon: Crown, cashback: '%5' };
    if (volume >= 5000) return { name: 'Silver', icon: Shield, cashback: '%2' };
    return { name: 'Bronze', icon: Star, cashback: '%0' };
  };

  const calculatedVIP = getCalculatedVIP(guestVolume);

  const headerSlides = [
    {
      title: t('vip.slide1_title'),
      highlight: t('vip.slide1_highlight'),
      desc: t('vip.slide1_desc'),
      bgImage: "/images/vip/vip_casino.webp"
    },
    {
      title: t('vip.slide2_title'),
      highlight: t('vip.slide2_highlight'),
      desc: t('vip.slide2_desc'),
      bgImage: "/images/vip/vip_casino.webp"
    },
    {
      title: t('vip.slide3_title'),
      highlight: t('vip.slide3_highlight'),
      desc: t('vip.slide3_desc'),
      bgImage: "/images/vip/vip_stadium.webp"
    },
    {
      title: t('vip.slide4_title'),
      highlight: t('vip.slide4_highlight'),
      desc: t('vip.slide4_desc'),
      bgImage: "/images/vip/vip_concierge.webp"
    }
  ];

  const handleClaim = (taskId: string) => {
    if (!claimedTasks.includes(taskId)) {
      setClaimedTasks([...claimedTasks, taskId]);
    }
  };

  const tasks = [
    { id: 'task-1', title: 'Günün Ziyareti', desc: 'Bugün 3 farklı sponsorumuzun sitesine giriş yap.', progress: 3, target: 3, reward: '50 XP', xpReward: 50 },
    { id: 'task-2', title: 'Hacim Şampiyonu', desc: 'Herhangi bir partner sitemizde 100$ bahis hacmi oluştur.', progress: 65, target: 100, reward: '100 XP + Çekiliş Bileti', xpReward: 100 },
    { id: 'task-3', title: 'Profilini Tamamla', desc: 'Telefon numaranı ve Telegram hesabını profilinle eşleştir.', progress: 1, target: 2, reward: '200 XP', xpReward: 200 },
  ];

  const benefits = [
    { level: 'Bronze', req: '0 ₺', cashback: '%0', support: t('vip.support_standard'), withdrawal: t('vip.withdrawal_normal') },
    { level: 'Silver', req: '25.000 ₺', cashback: '%2', support: t('vip.support_priority'), withdrawal: t('vip.withdrawal_fast') },
    { level: 'Gold', req: '100.000 ₺', cashback: '%5', support: t('vip.support_vip'), withdrawal: t('vip.withdrawal_very_fast') },
    { level: 'Platinum', req: '250.000 ₺', cashback: '%10', support: t('vip.support_manager'), withdrawal: t('vip.withdrawal_instant') },
    { level: 'Diamond', req: '750.000 ₺', cashback: '%15', support: t('vip.support_manager'), withdrawal: t('vip.withdrawal_unlimited') },
  ];

  return (
    <div className="w-full h-full min-h-[calc(100vh-140px)] flex flex-col items-center relative overflow-hidden pb-24 bg-[#06080D]">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-[#00E5FF]/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#0077FF]/5 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 lg:pt-12">
        



        {/* MAIN VIP HERO (Guest View) */}
        {isGuestView ? (
          <div className="relative w-full max-w-6xl mx-auto rounded-[20px] overflow-hidden mb-8 lg:mb-12 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 mt-2 lg:mt-4 shadow-xl border border-white/5">
            
            {/* Cinematic Background Images */}
            {headerSlides.map((slide, idx) => (
              <div
                key={`hero-bg-${idx}`}
                className={`absolute inset-0 transition-all duration-1000 ease-out z-0 ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img src={slide.bgImage} alt={slide.title} className={`w-full h-full object-cover transition-transform duration-[15000ms] ease-out ${idx === currentSlide ? 'scale-110' : 'scale-100'} opacity-40`} />
                
                {/* Gradients to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-[#06080D]/70 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#06080D]/95 via-[#06080D]/60 to-[#06080D]/10"></div>
              </div>
            ))}
            
            {/* Ambient Background Glow for the new Hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.06),transparent_60%)] pointer-events-none mix-blend-screen z-0" />
            
            {/* Left Copy - Auto Slider */}
            <div className="flex-1 text-center lg:text-left z-10 max-w-lg flex flex-col justify-center min-h-[220px] lg:min-h-[240px]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-4 shadow-xl self-center lg:self-start transition-all hover:bg-black/60">
                <Lock className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span className="text-[#00E5FF] text-[9px] font-black tracking-widest uppercase drop-shadow-md">{t('vip.badge_private')}</span>
              </div>
              
              <div className="relative w-full h-[140px] lg:h-[180px]">
                {headerSlides.map((slide, idx) => (
                  <div 
                    key={idx}
                    className={`transition-all duration-700 absolute top-0 left-0 right-0 ${
                      idx === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-white mb-2 tracking-tighter leading-[1.1] drop-shadow-2xl">
                      {slide.title} <br className="hidden lg:block" /> 
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF] drop-shadow-xl">
                        {slide.highlight}
                      </span>
                    </h2>
                    
                    <p className="text-zinc-300 font-medium text-sm leading-relaxed max-w-sm mx-auto lg:mx-0 drop-shadow-md">
                      {slide.desc}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col items-center lg:items-start mt-2">
                <button 
                  onClick={() => onNavigate?.('deposit')}
                  className="relative inline-flex items-center justify-center px-5 py-2.5 font-bold text-[10px] tracking-widest text-black uppercase bg-gradient-to-r from-[#00E5FF] to-white rounded-full overflow-hidden shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-transform hover:scale-105 group mb-4"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {t('vip.first_deposit')} <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                {/* Slider Indicators for Left Copy */}
                <div className="flex items-center gap-3">
                  {headerSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`transition-all duration-300 rounded-full h-1.5 ${
                        idx === currentSlide 
                          ? 'w-8 bg-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.8)]' 
                          : 'w-3 bg-white/20 hover:bg-white/50 cursor-pointer'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Interactive Premium Calculator */}
            <div className="w-full lg:w-[340px] shrink-0 z-10 relative mx-auto lg:mx-0 group">
              <div className="absolute -inset-10 bg-[#00E5FF]/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen transition-opacity duration-700 opacity-30 group-hover:opacity-50" />
              
              <div className="bg-black/20 backdrop-blur-3xl rounded-[20px] border border-white/10 p-5 lg:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-1">
                <h3 className="text-zinc-300 font-black text-[9px] uppercase tracking-widest mb-4 flex items-center justify-center gap-2 drop-shadow-md">
                  <TrendingUp className="w-4 h-4 text-[#00E5FF]" /> {t('vip.monthly_volume')}
                </h3>
                
                {/* Big Number Centered properly */}
                <div className="text-center mb-5">
                  <span className="text-2xl text-white font-black tracking-tight drop-shadow-md">
                    {guestVolume.toLocaleString()} <span className="text-sm text-zinc-500">₺</span>
                  </span>
                </div>

                {/* Laser Slider */}
                <div className="relative mb-5 group">
                  {/* Track */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 rounded-full -translate-y-1/2"></div>
                  
                  {/* Glowing Fill */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 rounded-full -translate-y-1/2 bg-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.8)] pointer-events-none"
                    style={{ width: `${(guestVolume / 500000) * 100}%` }}
                  ></div>

                  <input 
                    type="range" 
                    min="1000" 
                    max="500000" 
                    step="1000"
                    value={guestVolume}
                    onChange={(e) => setGuestVolume(Number(e.target.value))}
                    className="w-full h-1 appearance-none cursor-pointer outline-none relative z-10 bg-transparent"
                  />
                  <style dangerouslySetInnerHTML={{__html: `
                    input[type=range]::-webkit-slider-thumb {
                      -webkit-appearance: none;
                      appearance: none;
                      width: 12px;
                      height: 12px;
                      border-radius: 50%;
                      background: #fff;
                      cursor: pointer;
                      box-shadow: 0 0 10px rgba(0,229,255,1), 0 0 15px rgba(0,229,255,0.5);
                      border: 1px solid #00E5FF;
                      transition: transform 0.2s;
                    }
                    input[type=range]::-webkit-slider-thumb:hover {
                      transform: scale(1.2);
                    }
                  `}} />
                </div>
                
                {/* Min/Max Values */}
                <div className="flex justify-between items-center text-[9px] font-bold text-zinc-600 mb-6 px-1">
                  <span>1.000 ₺</span>
                  <span>500.000+ ₺</span>
                </div>

                {/* Result Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors group/card">
                    <span className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest block mb-1.5">{t('vip.reached_level')}</span>
                    <span className="text-white font-black text-sm flex items-center gap-1.5 transition-transform group-hover/card:translate-x-1">
                      {calculatedVIP.name} <calculatedVIP.icon className="w-3.5 h-3.5 text-[#00E5FF]" />
                    </span>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors group/card">
                    <span className="text-zinc-500 text-[8px] uppercase font-bold tracking-widest block mb-1.5">{t('vip.cashback')}</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#00E5FF] font-black text-lg transition-transform group-hover/card:translate-x-1 inline-block">
                      {calculatedVIP.cashback}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-4xl mx-auto rounded-[24px] p-6 lg:p-8 mb-16 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/10 rounded-full blur-[60px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              {/* Current Level */}
              <div className="flex items-center gap-5 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-8">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <currentLevel.icon className="w-8 h-8 text-[#00E5FF]" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-black border border-[#00E5FF]/50 px-2.5 py-1 rounded-md text-[9px] font-black uppercase text-[#00E5FF] shadow-lg tracking-widest">
                    LVL 3
                  </div>
                </div>
                <div>
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] block mb-1">{t('vip.current_level')}</span>
                  <h2 className="text-2xl font-black text-white tracking-tight">{currentLevel.name}</h2>
                  <span className="text-emerald-400 font-bold text-xs">{currentDeposit.toLocaleString()} ₺ Toplam Yatırım</span>
                </div>
              </div>

              {/* Progress */}
              <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-white font-black text-xl">{progressPercent.toFixed(1)}%</span>
                  <div className="flex flex-col items-end">
                    <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mb-1">{t('vip.next_level')}</span>
                    <span className="text-white font-black text-[12px] flex items-center gap-1.5">
                      {nextLevel.name} <nextLevel.icon className="w-4 h-4 text-[#00E5FF]" />
                    </span>
                  </div>
                </div>
                
                {/* Laser Progress Bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute left-0 top-0 h-full bg-[#00E5FF] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.8)] transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-zinc-500 text-[11px] font-medium mt-3 text-right">
                  Sonraki seviyeye <strong className="text-white font-bold">{(nextLevelDeposit - currentDeposit).toLocaleString()} ₺ Yatırım</strong> kaldı
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIP TIERS SHOWCASE (Persuasion Mode) */}
        <div className="relative max-w-7xl mx-auto px-4 z-20">
          <div className="text-center mb-8">
            <h3 className="text-lg md:text-xl font-bold flex items-center justify-center gap-2 mb-3 tracking-[0.3em] drop-shadow-md text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-400">
              <Diamond className="w-4 h-4 text-zinc-300 drop-shadow-sm" strokeWidth={1.5} />
              {t('vip.reach_peak')}
            </h3>
            <p className="text-[#9CA3AF] text-xs md:text-sm font-medium max-w-xl mx-auto leading-relaxed">
              {t('vip.peak_desc')}
            </p>
          </div>

          <div className="w-full overflow-x-auto pb-8 mb-12 relative z-20" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
            <div className="flex flex-row items-end justify-between gap-2 lg:gap-4 min-h-[360px] min-w-[700px] lg:min-w-0 relative">
              
              {benefits.map((tier, idx) => {
                const heights = ['h-[180px]', 'h-[220px]', 'h-[260px]', 'h-[300px]', 'h-[340px]'];
                const cardHeight = heights[idx];
                
                const isDiamond = tier.level === 'Diamond';
                
                const glowColor = isDiamond ? 'bg-[#00E5FF]' :
                                  tier.level === 'Platinum' ? 'bg-indigo-400' :
                                  tier.level === 'Gold' ? 'bg-yellow-500' :
                                  tier.level === 'Silver' ? 'bg-slate-300' :
                                  'bg-[#cd7f32]';
                                  
                const borderColor = isDiamond ? 'border-[#00E5FF]/50' :
                                    tier.level === 'Platinum' ? 'border-indigo-400/50' :
                                    tier.level === 'Gold' ? 'border-yellow-500/50' :
                                    tier.level === 'Silver' ? 'border-slate-300/50' :
                                    'border-[#cd7f32]/50';

                const gradientText = isDiamond ? 'from-white via-[#00E5FF] to-[#0099ff]' :
                                     tier.level === 'Platinum' ? 'from-white via-indigo-200 to-indigo-500' : 
                                     tier.level === 'Gold' ? 'from-[#ffeaa7] via-yellow-400 to-yellow-600' :
                                     tier.level === 'Silver' ? 'from-white to-slate-400' :
                                     'from-[#f0a969] to-[#cd7f32]';

                const hexColors = ['#cd7f32', '#94a3b8', '#eab308', '#818cf8', '#00E5FF'];
                const hexColor = hexColors[idx];
                const nextHexColor = idx < 4 ? hexColors[idx + 1] : hexColor;

                return (
                  <div key={idx} className={`flex-1 flex flex-col justify-end group relative z-10 w-full ${cardHeight}`}>
                    
                    {/* Dynamic Connector Line to Next Pillar */}
                    {idx < benefits.length - 1 && (
                      <div className="absolute top-[-40px] left-1/2 w-[calc(100%+0.5rem)] lg:w-[calc(100%+1rem)] h-[40px] pointer-events-none z-0">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                          <line x1="0" y1="40" x2="100%" y2="0" stroke={`url(#grad-${idx})`} strokeWidth="1.5" className="opacity-50" />
                          <defs>
                            <linearGradient id={`grad-${idx}`} x1="0" y1="1" x2="1" y2="0">
                              <stop offset="0%" stopColor={hexColor} />
                              <stop offset="100%" stopColor={nextHexColor} />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )}

                    {/* Hover Glow Behind Pillar */}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 ${glowColor}/5 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>

                    <div className={`w-full h-full relative rounded-t-sm border-t-2 border-l border-r ${borderColor} border-l-white/5 border-r-white/5 bg-gradient-to-b from-white/[0.04] to-[#0a0a0a]/80 backdrop-blur-md transition-all duration-500 group-hover:from-white/[0.08] flex flex-col items-center justify-between p-3 lg:p-4 overflow-hidden shadow-2xl`}>
                      
                      {/* Top Accent Glow */}
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 ${glowColor}/20 blur-[15px] transition-opacity opacity-50 group-hover:opacity-100`}></div>
                      
                      {/* Pedestal Base Line */}
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-30 group-hover:opacity-80 transition-opacity duration-500"></div>
                      
                      {/* Level Name & Requirement */}
                      <div className="flex flex-col items-center mt-1 z-10 w-full text-center">
                        <span className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-br ${gradientText} mb-2 drop-shadow-sm`}>
                          {tier.level.toUpperCase()}
                        </span>
                        <div className="flex flex-col items-center bg-black/40 px-3 py-1.5 rounded-md border border-white/5 w-[85%] mx-auto backdrop-blur-sm">
                           <span className="text-[10px] lg:text-[11px] font-mono font-bold text-zinc-300 tracking-wider drop-shadow-md">{tier.req}</span>
                           <span className="text-[6px] lg:text-[7px] text-zinc-500 uppercase tracking-[0.3em] mt-0.5">Yatırım Şartı</span>
                        </div>
                      </div>

                      {/* Cashback Metric - Huge Typography */}
                      <div className="flex flex-col items-center my-auto z-10">
                         <span className={`text-3xl lg:text-4xl xl:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 drop-shadow-sm group-hover:scale-110 transition-transform duration-700 ease-out`}>
                           {tier.cashback}
                         </span>
                         <span className="text-[7px] lg:text-[8px] text-zinc-400 uppercase font-black tracking-[0.3em] mt-2">{t('vip.cashback_upper')}</span>
                      </div>

                      {/* Lower Metrics - Pure Typography */}
                      <div className="w-full flex flex-col gap-2 mt-auto z-10 opacity-70 group-hover:opacity-100 transition-opacity border-t border-white/10 pt-3 pb-1">
                         <div className="flex flex-col items-center text-center">
                           <span className="text-white text-[9px] lg:text-[10px] font-bold tracking-widest">{tier.withdrawal.toUpperCase()}</span>
                           <span className="text-zinc-600 text-[7px] font-black uppercase tracking-[0.2em] mt-1">{t('vip.withdrawal_speed')}</span>
                         </div>
                         <div className="flex flex-col items-center text-center pt-2 border-t border-white/5">
                           <span className="text-white text-[9px] lg:text-[10px] font-bold tracking-widest">{tier.support.toUpperCase()}</span>
                           <span className="text-zinc-600 text-[7px] font-black uppercase tracking-[0.2em] mt-1">{t('vip.support')}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center pb-12 mt-8">
            <button 
              onClick={() => onNavigate?.('deposit')}
              className="relative inline-flex items-center justify-center px-10 py-5 font-black text-sm tracking-widest text-[#00E5FF] uppercase bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#00E5FF]/30 rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.15)] hover:shadow-[0_0_50px_rgba(0,229,255,0.3)] transition-all hover:bg-[#00E5FF]/10 group"
            >
              <div className="absolute inset-0 bg-[#00E5FF]/10 mix-blend-screen group-hover:translate-x-full transition-transform duration-700 ease-out -skew-x-12 -translate-x-full"></div>
              <span className="relative z-10 flex items-center gap-3">
                <Crown className="w-5 h-5" /> {t('vip.join_club')} <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VIPClubView;
