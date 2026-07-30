import React, { useState, useEffect } from 'react';
import { Crown, Shield, Zap, Target, Star, Gift, ChevronRight, CheckCircle2, Lock, Flame, Diamond, TrendingUp, Gem, Trophy } from 'lucide-react';

interface VIPClubViewProps {
  onNavigate?: (view: string) => void;
  siteUser?: any;
}

const VIPClubView: React.FC<VIPClubViewProps> = ({ onNavigate, siteUser }) => {
  // Mock Data for Gamification
  const currentXP = 4250;
  const nextLevelXP = 5000;
  const progressPercent = (currentXP / nextLevelXP) * 100;
  
  const currentLevel = { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: Crown };
  const nextLevel = { name: 'Platinum', color: 'from-slate-300 to-slate-500', icon: Diamond };

  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGuestView, setIsGuestView] = useState(true);
  const [guestVolume, setGuestVolume] = useState(10000);

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
      title: "724BETS",
      highlight: "VIP KULÜBÜ",
      desc: "Sadakatinizin karşılığını altın standartta alın. Görevleri tamamlayın, seviye atlayın ve ayrıcalıkların kilidini açın.",
      icon: Crown,
      bgImage: "/images/vip/vip_casino.webp"
    },
    {
      title: "ÖZEL",
      highlight: "ETKİNLİKLER",
      desc: "Sadece VIP üyelere özel turnuvalar, sürpriz tatiller ve lüks ödüllerle dolu bir dünya sizi bekliyor.",
      icon: Gem,
      bgImage: "/images/vip/vip_stadium.webp"
    },
    {
      title: "KİŞİSEL",
      highlight: "ASİSTAN",
      desc: "7/24 size özel hizmet veren kişisel hesap yöneticiniz ile tüm işlemlerinizde öncelik kazanın.",
      icon: Trophy,
      bgImage: "/images/vip/vip_concierge.webp"
    }
  ];

  const handleClaim = (taskId: string) => {
    if (!claimedTasks.includes(taskId)) {
      setClaimedTasks([...claimedTasks, taskId]);
      // In a real app, you would add XP here via API
    }
  };

  const tasks = [
    { id: 'task-1', title: 'Günün Ziyareti', desc: 'Bugün 3 farklı sponsorumuzun sitesine giriş yap.', progress: 3, target: 3, reward: '50 XP', xpReward: 50 },
    { id: 'task-2', title: 'Hacim Şampiyonu', desc: 'Herhangi bir partner sitemizde 100$ bahis hacmi oluştur.', progress: 65, target: 100, reward: '100 XP + Çekiliş Bileti', xpReward: 100 },
    { id: 'task-3', title: 'Profilini Tamamla', desc: 'Telefon numaranı ve Telegram hesabını profilinle eşleştir.', progress: 1, target: 2, reward: '200 XP', xpReward: 200 },
  ];

  const benefits = [
    { level: 'Bronze', req: '0 XP', cashback: '%0', support: 'Standart', withdrawal: 'Normal' },
    { level: 'Silver', req: '1,000 XP', cashback: '%2', support: 'Öncelikli', withdrawal: 'Hızlı' },
    { level: 'Gold', req: '3,000 XP', cashback: '%5', support: 'VIP', withdrawal: 'Çok Hızlı' },
    { level: 'Platinum', req: '5,000 XP', cashback: '%10', support: 'Özel Menajer', withdrawal: 'Anında' },
    { level: 'Diamond', req: '15,000 XP', cashback: '%15', support: 'Özel Menajer', withdrawal: 'Limitsiz & Anında' },
  ];

  return (
    <div className="w-full h-full min-h-[calc(100vh-140px)] flex flex-col items-center relative overflow-hidden pb-24">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] bg-[#00E5FF]/5 rounded-full blur-[180px] mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-[#0077FF]/5 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 lg:pt-16">
        
        {/* Subtle Toggle for Testing (Top Right) */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-[#0A0D14]/50 p-1 rounded-md border border-white/5 z-50">
          <button 
            onClick={() => setIsGuestView(true)}
            className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${isGuestView ? 'bg-white/10 text-white' : 'text-[#8b92a5] hover:text-white'}`}
          >
            Guest View
          </button>
          <button 
            onClick={() => setIsGuestView(false)}
            className={`px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all ${!isGuestView ? 'bg-white/10 text-white' : 'text-[#8b92a5] hover:text-white'}`}
          >
            Member View
          </button>
        </div>
        
        {/* HEADER SECTION - CINEMATIC HOLOGRAPHIC HERO */}
        <div className="relative w-full max-w-[900px] mx-auto mb-12 mt-2">
          {/* Massive Ambient Glow */}
          <div className="absolute -inset-10 bg-gradient-to-r from-[#00E5FF]/10 via-[#10B981]/5 to-[#0077FF]/10 blur-[100px] opacity-70 pointer-events-none rounded-[50%]"></div>
          
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] bg-[#05070a]">
            
            {/* Background Images with Heavy Cinematic Grading */}
            {headerSlides.map((slide, idx) => (
              <div
                key={`bg-${idx}`}
                className={`absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${
                  idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
              >
                <img src={slide.bgImage} alt={slide.title} className="w-full h-full object-cover opacity-[0.4] mix-blend-luminosity grayscale-[30%]" />
                {/* Deep volumetric fog gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-transparent to-[#05070a]"></div>
                {/* Neon tint wash */}
                <div className="absolute inset-0 bg-[#00E5FF]/5 mix-blend-color"></div>
              </div>
            ))}
            
            {/* Holographic Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

            {/* Advanced Particles & Moving Beams */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 mix-blend-screen">
              {/* Dynamic Glows */}
              <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-[#00E5FF] rounded-full blur-[60px] animate-[pulse_4s_ease-in-out_infinite] opacity-30 mix-blend-screen"></div>
              <div className="absolute top-[50%] right-[15%] w-40 h-40 bg-[#10B981] rounded-full blur-[70px] animate-[pulse_6s_ease-in-out_infinite_1s] opacity-25 mix-blend-screen"></div>
              <div className="absolute bottom-[10%] left-[40%] w-24 h-24 bg-[#0077FF] rounded-full blur-[50px] animate-[pulse_5s_ease-in-out_infinite_2s] opacity-30 mix-blend-screen"></div>
              
              {/* Sweeping Lights */}
              <div className="absolute top-1/3 -left-[100%] w-[50%] h-[2px] bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_15px_#00E5FF] opacity-60" style={{ animation: 'shimmer 5s infinite linear' }}></div>
              <div className="absolute bottom-1/3 -right-[100%] w-[50%] h-[2px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent shadow-[0_0_15px_#10B981] opacity-60" style={{ animation: 'shimmer 7s infinite linear reverse' }}></div>
              
              {/* Floating Orbs */}
              <div className="absolute top-[30%] left-[10%] w-1.5 h-1.5 bg-white rounded-full blur-[1px] shadow-[0_0_10px_#fff]" style={{ animation: 'pulse 3s infinite alternate, shimmer 10s infinite linear' }}></div>
              <div className="absolute bottom-[40%] right-[20%] w-1 h-1 bg-white rounded-full blur-[0.5px] shadow-[0_0_8px_#fff]" style={{ animation: 'pulse 4s infinite alternate, shimmer 12s infinite linear reverse' }}></div>
            </div>

            <div className="relative px-6 py-10 lg:py-16 z-10 flex flex-col items-center justify-center text-center min-h-[250px]">
              {headerSlides.map((slide, idx) => (
                <div 
                  key={idx}
                  className={`absolute w-full px-6 flex flex-col items-center justify-center transition-all duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
                    idx === currentSlide ? 'opacity-100 translate-y-0 scale-100 z-10' : 'opacity-0 translate-y-12 scale-95 -z-10'
                  }`}
                >
                  <div className="relative inline-flex items-center justify-center mb-5">
                    <div className="absolute inset-0 bg-[#00E5FF] rounded-full blur-[20px] animate-pulse opacity-40 mix-blend-screen"></div>
                    <div className="relative w-14 h-14 bg-[#0a0d14]/80 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 shadow-[inset_0_0_30px_rgba(255,255,255,0.1),0_0_30px_rgba(0,229,255,0.3)]">
                      <slide.icon className="w-6 h-6 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                    </div>
                  </div>
                  
                  {/* Holographic Typography */}
                  <h1 className="text-[26px] md:text-[36px] lg:text-[44px] font-black leading-[1.1] tracking-tighter text-white mb-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                    {slide.title} <br className="hidden sm:block"/>
                    <span className="relative inline-block mt-1 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E5FF] to-[#10B981] pb-1">
                      {slide.highlight}
                      {/* Shine effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 bg-clip-text text-transparent animate-[shimmer_3s_infinite_linear] blur-[1px]"></span>
                    </span>
                  </h1>
                  
                  <p className="text-[13px] lg:text-[15px] text-zinc-400 font-medium leading-relaxed max-w-[550px] mx-auto mt-2">
                    {slide.desc}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Elegant Slider Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3 z-20">
              {headerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-500 rounded-full h-1.5 ${
                    idx === currentSlide 
                      ? 'w-10 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' 
                      : 'w-2 bg-white/20 hover:bg-white/40 cursor-pointer'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* PROGRESS HERO OR GUEST HERO */}
        {isGuestView ? (
          <div className="relative w-full max-w-[900px] mx-auto p-4 lg:p-0 mb-12 overflow-hidden bg-transparent mt-8">
            {/* Massive Deep Ambient Glows for the entire section */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
              
              {/* Left Column: Marketing Copy */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left relative lg:pl-6">
                
                <div className="relative z-10">
                  {/* Advanced Animated Badge */}
                  <div className="relative inline-flex overflow-hidden rounded-full p-[1.5px] mb-6 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#00E5FF_50%,transparent_100%)]" />
                    <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#05070a] px-4 py-2 backdrop-blur-3xl gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-white text-[11px] font-black tracking-[0.2em] uppercase">Özel VIP Kulübü</span>
                    </div>
                  </div>
                  
                  <h2 className="text-[28px] lg:text-[36px] font-black text-white mb-4 tracking-tight leading-[1.15] drop-shadow-2xl">
                    VIP KULÜBÜNÜN KAPILARI <br className="hidden lg:block" /> 
                    <span className="relative inline-block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00E5FF] to-[#10B981] drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                      SİZİN İÇİN ARALANIYOR
                    </span>
                  </h2>
                  
                  <p className="text-[#8b92a5] font-medium text-[14px] lg:text-[15px] leading-relaxed max-w-[450px] mb-8 drop-shadow-sm">
                    724BETS'te sadece bahis yapmazsınız; oynadıkça nakit iade, özel menajer ve lüks ödüller kazanırsınız. Sizi bekleyen ayrıcalıkları hemen keşfedin.
                  </p>
                  
                  <div className="relative inline-block group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF] to-[#10B981] rounded-[1.25rem] blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700 animate-pulse"></div>
                    <button 
                      onClick={() => onNavigate?.('deposit')}
                      className="relative z-10 inline-flex items-center justify-center px-8 py-4 font-black text-[14px] tracking-[0.1em] text-white bg-[#0a0d14]/80 backdrop-blur-xl border border-white/20 rounded-[1.25rem] overflow-hidden shadow-[inset_0_0_20px_rgba(0,229,255,0.2),0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[inset_0_0_40px_rgba(0,229,255,0.4),0_15px_40px_rgba(0,229,255,0.3)] hover:border-[#00E5FF]/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/10 to-[#10B981]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        İLK YATIRIMINIZI YAPIN <ChevronRight className="w-4 h-4 text-[#00E5FF] group-hover:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Interactive Tactile Calculator */}
              <div className="w-full lg:w-[400px] shrink-0 z-10 relative group perspective-[1000px]">
                {/* Outer Holographic Glow (Unified) */}
                <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF] to-[#10B981] opacity-[0.05] blur-3xl rounded-[2rem] group-hover:opacity-[0.1] transition-opacity duration-1000 animate-[pulse_6s_ease-in-out_infinite]"></div>
                
                {/* Main Seamless Panel (No Borders) */}
                <div className="w-full p-6 relative z-10 transform-gpu transition-transform duration-700 hover:rotate-y-[-2deg] hover:rotate-x-[2deg]">
                  
                  {/* Subtle Grid overlay mapped to container for seamless feel */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none rounded-[1.5rem]" style={{ maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)', WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 80%)' }}></div>

                  <div className="absolute top-[-40px] right-[-40px] w-[150px] h-[150px] bg-[#00E5FF]/10 rounded-full blur-[50px] pointer-events-none mix-blend-screen animate-[pulse_5s_ease-in-out_infinite]"></div>
                  
                  <h3 className="text-[#8b92a5] font-black text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center justify-center gap-2 relative z-10 drop-shadow-sm">
                    <TrendingUp className="w-4 h-4 text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" /> Aylık Tahmini Hacminiz
                  </h3>
                  
                  {/* Tactile Slider */}
                  <div className="relative mb-8 px-2 z-10">
                    {/* Deep groove for slider */}
                    <div className="absolute top-1/2 left-0 right-0 h-3.5 bg-[#030406] rounded-full -translate-y-1/2 shadow-[inset_0_5px_10px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.05)] border border-white/5"></div>
                    
                    {/* Glowing Track Fill */}
                    <div 
                      className="absolute top-1/2 left-0 h-2.5 rounded-full -translate-y-1/2 bg-gradient-to-r from-[#00E5FF] to-[#10B981] shadow-[0_0_15px_rgba(0,229,255,0.5)] pointer-events-none transition-all duration-100 ease-out"
                      style={{ width: `${(guestVolume / 500000) * 100}%` }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/50 blur-[1px] mix-blend-overlay"></div>
                    </div>

                    <input 
                      type="range" 
                      min="1000" 
                      max="500000" 
                      step="1000"
                      value={guestVolume}
                      onChange={(e) => setGuestVolume(Number(e.target.value))}
                      className="w-full h-3.5 rounded-full appearance-none cursor-pointer outline-none relative z-10 bg-transparent"
                    />
                    <style dangerouslySetInnerHTML={{__html: `
                      input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 24px;
                        height: 24px;
                        border-radius: 50%;
                        background: radial-gradient(circle at 30% 30%, #ffffff, #e2e8f0);
                        cursor: pointer;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.8), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.8), 0 0 15px rgba(0,229,255,0.6);
                        border: 1px solid rgba(255,255,255,0.5);
                        transition: transform 0.1s, box-shadow 0.1s;
                        position: relative;
                        z-index: 20;
                      }
                      input[type=range]::-webkit-slider-thumb:hover {
                        transform: scale(1.15);
                        box-shadow: 0 4px 15px rgba(0,0,0,0.8), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,1), 0 0 25px rgba(0,229,255,1);
                      }
                    `}} />
                  </div>
                  
                  {/* Values */}
                  <div className="flex justify-between items-center text-[10px] font-black text-[#64748b] mb-8 z-10 relative px-2">
                    <span className="drop-shadow-sm">1.000 ₺</span>
                    <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2">
                      <span className="text-2xl lg:text-3xl text-transparent bg-clip-text bg-gradient-to-b from-white to-[#cbd5e1] font-black tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        {guestVolume.toLocaleString()} <span className="text-xl text-[#8b92a5]">₺</span>
                      </span>
                    </div>
                    <span className="drop-shadow-sm">500.000+ ₺</span>
                  </div>

                  {/* 3D Result Slots */}
                  <div className="grid grid-cols-2 gap-4 text-left relative z-10">
                    <div className="bg-[#030406]/80 rounded-xl p-4 border border-white/5 shadow-[inset_0_8px_20px_rgba(0,0,0,0.8),0_1px_5px_rgba(255,255,255,0.02)] transition-transform duration-500 hover:-translate-y-1 group/card relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                      <span className="text-[#64748b] text-[9px] uppercase font-black tracking-[0.15em] block mb-2 relative z-10">ULAŞACAĞINIZ SEVİYE</span>
                      <span className="text-white font-black text-base lg:text-lg flex items-center gap-2 transition-transform duration-500 group-hover/card:translate-x-1 relative z-10">
                        {calculatedVIP.name} <calculatedVIP.icon className="w-4 h-4 text-[#00E5FF] drop-shadow-[0_0_6px_rgba(0,229,255,0.8)]" />
                      </span>
                    </div>
                    
                    <div className="bg-[#030406]/80 rounded-xl p-4 border border-white/5 shadow-[inset_0_8px_20px_rgba(0,0,0,0.8),0_1px_5px_rgba(255,255,255,0.02)] transition-transform duration-500 hover:-translate-y-1 group/card relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                      <span className="text-[#64748b] text-[9px] uppercase font-black tracking-[0.15em] block mb-2 relative z-10">NAKİT İADE</span>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981] font-black text-xl drop-shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-transform duration-500 group-hover/card:translate-x-1 relative z-10">
                        {calculatedVIP.cashback}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full max-w-[800px] mx-auto rounded-2xl p-5 lg:p-6 mb-16 overflow-hidden border border-[#00E5FF]/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl bg-gradient-to-br from-[#151a25]/80 to-[#0d1017]/90">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 relative z-10">
              {/* Current Level Info */}
              <div className="flex items-center gap-4 border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 lg:pr-6">
                <div className="relative shrink-0">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-[#00E5FF] via-white to-[#0077FF] p-[1.5px] shadow-[0_0_15px_rgba(0,229,255,0.2)]`}>
                    <div className="w-full h-full bg-[#0A0D14] rounded-full flex items-center justify-center">
                      <currentLevel.icon className="w-7 h-7 text-[#00E5FF]" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#151a25] border border-[#00E5FF]/40 px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-[#00E5FF] shadow-lg tracking-[0.2em]">
                    LVL 3
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#8b92a5] font-black uppercase tracking-[0.2em] text-[9px] mb-0.5">Mevcut Seviyen</span>
                  <h2 className="text-xl font-black text-white">{currentLevel.name}</h2>
                  <span className="text-[#00E5FF] font-bold text-xs mt-0.5">{currentXP.toLocaleString()} XP</span>
                </div>
              </div>

              {/* Progress Bar Area */}
              <div className="flex-1 w-full max-w-[400px]">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-white font-black text-base">{progressPercent.toFixed(1)}%</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[#8b92a5] text-[8px] font-black uppercase tracking-[0.2em]">Sonraki Seviye</span>
                    <span className="text-white font-bold text-[11px] flex items-center gap-1">
                      {nextLevel.name} <nextLevel.icon className="w-3 h-3 text-[#00E5FF]" />
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-[#0077FF] via-[#00E5FF] to-white rounded-full relative transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,229,255,0.6)]"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/40 blur-[2px]"></div>
                  </div>
                </div>
                <p className="text-[#8b92a5] text-[10px] font-bold mt-2 text-right">
                  Sonraki seviyeye <strong className="text-white">{(nextLevelXP - currentXP).toLocaleString()} XP</strong> kaldı
                </p>
              </div>
            </div>
          </div>
        )}

        {/* QUESTS SECTION (Gamification) */}
        <div className="mb-16 max-w-[1000px] mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00E5FF]" />
              VIP GÖREVLERİ
            </h3>
            <span className="bg-[#00E5FF]/5 text-[#00E5FF] px-2 py-1 rounded text-[9px] uppercase font-black tracking-widest border border-[#00E5FF]/20">
              Günlük Yenilenir
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {tasks.map((task) => {
              const isCompleted = task.progress >= task.target;
              const isClaimed = claimedTasks.includes(task.id);
              const taskProgressPercent = Math.min((task.progress / task.target) * 100, 100);

              return (
                <div key={task.id} className={`bg-gradient-to-br from-[#1c2230]/60 to-[#0a0d14]/80 backdrop-blur-xl border-t border-t-white/10 border-l border-l-white/5 border-r border-r-black/50 border-b border-b-black/50 ${isCompleted && !isClaimed && !isGuestView ? 'border-[#00E5FF]/60 shadow-[0_0_25px_rgba(0,229,255,0.2)]' : ''} rounded-xl p-5 relative overflow-hidden group transition-all duration-300 hover:border-[#00E5FF]/50 hover:shadow-[0_15px_40px_rgba(0,229,255,0.2)]`}>
                  
                  {isClaimed && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 bg-white/10 border border-white/40 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white font-black tracking-wide text-[10px] uppercase">Ödül Alındı</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-3">
                      <h4 className="text-[15px] font-black text-white mb-1 group-hover:text-[#00E5FF] transition-colors">{task.title}</h4>
                      <p className="text-[#8b92a5] text-[12px] font-medium leading-relaxed">{task.desc}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 bg-[#0a0d14] px-3 py-1.5 rounded-lg border border-[#00E5FF]/20 shadow-[inset_0_0_10px_rgba(0,229,255,0.05)]">
                      <span className="text-[#00E5FF] font-black text-[12px] flex items-center gap-1.5 drop-shadow-[0_0_5px_rgba(0,229,255,0.3)]">
                        <Star className="w-3.5 h-3.5" fill="currentColor" /> {task.xpReward}
                      </span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                      <span className="text-[#8b92a5]">İlerleme</span>
                      <span className={isCompleted ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-[#00E5FF]'}>{task.progress} / {task.target}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#050505] rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-gradient-to-r from-white to-[#E2E8F0] shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-gradient-to-r from-[#0077FF] via-[#00E5FF] to-[#10B981]'}`}
                        style={{ width: `${taskProgressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <button 
                    disabled={isGuestView || !isCompleted || isClaimed}
                    onClick={() => handleClaim(task.id)}
                    className={`w-full py-2.5 rounded-lg font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isGuestView ? 'bg-white/5 border border-white/10 text-[#8b92a5] hover:bg-white/10 hover:text-white cursor-pointer' :
                      isClaimed ? 'bg-[#0a0d14] text-[#4b5563] cursor-not-allowed border border-white/5' :
                      isCompleted ? 'bg-gradient-to-r from-[#00E5FF] to-[#10B981] text-[#0a0d14] shadow-[0_5px_20px_rgba(0,229,255,0.3)] hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(0,229,255,0.5)] cursor-pointer' : 
                      'bg-transparent border border-white/5 text-[#4b5563] cursor-not-allowed'
                    }`}
                  >
                    {isGuestView ? (
                      <>
                        <Lock className="w-3.5 h-3.5" /> Kilidi Açmak İçin Yatırım Yap
                      </>
                    ) : isClaimed ? 'Toplandı' : isCompleted ? 'Ödülü Al' : 'Devam Ediyor'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* BENEFITS TABLE */}
        <div className="relative">
          <div className="text-center mb-8">
            <h3 className="text-xl font-black text-white flex items-center justify-center gap-2 mb-1">
              <Gift className="w-5 h-5 text-[#00E5FF]" />
              SEVİYE AYRICALIKLARI
            </h3>
            <p className="text-[#8b92a5] text-xs font-bold uppercase tracking-widest">
              {isGuestView ? "Seviye atladıkça kilidini açacağınız ödüller" : "Mevcut ayrıcalıklarınız ve hedefleriniz"}
            </p>
          </div>

          <div className="w-full overflow-x-auto custom-scrollbar pb-4">
            <div className="min-w-[800px] bg-gradient-to-b from-[#151a25]/90 to-[#0d1017]/90 backdrop-blur-xl rounded-xl border border-[#00E5FF]/20 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-5 bg-black/60 border-b border-white/5 p-4">
                <div className="text-[#8b92a5] font-black text-[10px] uppercase tracking-[0.2em]">Seviye & XP</div>
                <div className="text-[#8b92a5] font-black text-[10px] uppercase tracking-[0.2em] text-center">Nakit İade (Cashback)</div>
                <div className="text-[#8b92a5] font-black text-[10px] uppercase tracking-[0.2em] text-center">Özel Destek</div>
                <div className="text-[#8b92a5] font-black text-[10px] uppercase tracking-[0.2em] text-center">Çekim Hızı</div>
                <div className="text-[#8b92a5] font-black text-[10px] uppercase tracking-[0.2em] text-right">Durum</div>
              </div>
              
              {benefits.map((tier, idx) => {
                const isCurrent = !isGuestView && tier.level === currentLevel.name;
                const isPassed = !isGuestView && ['Bronze', 'Silver'].includes(tier.level); // Logic mock
                const isLocked = isGuestView || (!isCurrent && !isPassed);

                return (
                  <div key={idx} className={`grid grid-cols-5 items-center p-4 border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02] ${isCurrent ? 'bg-[#00E5FF]/5 relative' : ''}`}>
                    {isCurrent && <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#0077FF] via-[#00E5FF] to-white shadow-[0_0_15px_#00E5FF]"></div>}
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLocked ? 'bg-black/50 border border-white/5' : 'bg-gradient-to-br from-[#00E5FF]/20 to-transparent border border-[#00E5FF]/30'}`}>
                        {isLocked ? <Lock className="w-4 h-4 text-[#4b5563]" /> : <Flame className={`w-4 h-4 ${isCurrent ? 'text-[#00E5FF]' : 'text-white'}`} />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-black text-sm uppercase tracking-wide ${isCurrent ? 'text-[#00E5FF]' : isLocked && !isGuestView ? 'text-[#8b92a5]' : 'text-white'}`}>{tier.level}</span>
                        <span className="text-[#64748b] text-[10px] font-bold">{tier.req}</span>
                      </div>
                    </div>
                    
                    <div className={`text-center font-black text-base ${isLocked && !isGuestView ? 'text-[#4b5563]' : isCurrent ? 'text-[#00E5FF]' : 'text-white'}`}>
                      {tier.cashback}
                    </div>
                    
                    <div className={`text-center font-bold text-xs ${isLocked && !isGuestView ? 'text-[#4b5563]' : 'text-slate-300'}`}>
                      {tier.support}
                    </div>

                    <div className={`text-center font-bold text-xs ${isLocked && !isGuestView ? 'text-[#4b5563]' : 'text-slate-300'}`}>
                      {tier.withdrawal}
                    </div>

                    <div className="flex justify-end">
                      {isCurrent ? (
                         <span className="bg-gradient-to-r from-[#00E5FF]/20 to-transparent text-[#00E5FF] border border-[#00E5FF]/30 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(0,229,255,0.2)]">Aktif</span>
                      ) : isPassed ? (
                         <span className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"><CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı</span>
                      ) : (
                         <span className={`${isGuestView ? 'text-[#00E5FF]' : 'text-[#4b5563]'} font-black text-[10px] uppercase tracking-widest flex items-center gap-1`}><Lock className="w-3 h-3" /> {isGuestView ? 'Hedef' : 'Kilitli'}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VIPClubView;
