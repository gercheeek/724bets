import React, { useState } from 'react';
import { Users, Copy, Check, Zap, Infinity, SlidersHorizontal, Headphones, Play, ArrowRight, ShieldCheck, Globe, CreditCard, X } from 'lucide-react';

interface AffiliateViewProps {
  onNavigate?: (view: string) => void;
  onAuthRequired?: () => void;
}

const AffiliateView: React.FC<AffiliateViewProps> = ({ onNavigate, onAuthRequired }) => {
  const [copied, setCopied] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const referralLink = 'https://724bahis.net/?c=vip_partner_code';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-140px)] bg-[#0A0D14] flex flex-col items-center relative overflow-hidden pb-20">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00E5FF]/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 lg:pt-20">
        
        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-16">
          
          {/* Left Content */}
          <div className="flex-1 flex flex-col w-full relative z-10">
            {/* Advanced Animated Badge */}
            <div className="relative inline-flex overflow-hidden rounded-full p-[1px] mb-6 shadow-[0_0_20px_rgba(0,229,255,0.2)] w-fit">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#00E5FF_50%,transparent_100%)]" />
              <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#0A0D14] px-4 py-2 backdrop-blur-3xl gap-2">
                <Users className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                <span className="text-[#00E5FF] text-[11px] font-black tracking-[0.2em] uppercase">VIP Ortaklık Programı</span>
              </div>
            </div>

            <h1 className="text-[32px] md:text-[46px] font-black leading-[1.1] tracking-tight text-white mb-5 drop-shadow-md">
              Sektörün En Çok <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981] italic drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">Kazandıran</span> Ağı.
            </h1>
            
            <p className="text-[14px] md:text-[15px] text-[#8b92a5] font-medium leading-relaxed max-w-[500px] mb-8">
              <span className="text-white font-bold">%60'a varan</span> ömür boyu komisyon fırsatı ile kendi işinizin patronu olun. Dünyanın en iyi dönüştüren platformuna oyuncu yönlendirin ve limitsiz kazanın.
            </p>

            {/* Link Copy Area */}
            <div className="flex flex-col gap-2 max-w-[450px] mb-10">
              <label className="text-[10px] font-black text-[#8b92a5] tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span> Size Özel Davet Linkiniz
              </label>
              <div className="flex items-center bg-[#0d1017] border border-[#00E5FF]/20 rounded-xl p-1.5 focus-within:border-[#00E5FF]/60 focus-within:shadow-[0_0_25px_rgba(0,229,255,0.2)] transition-all relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink}
                  className="flex-1 bg-transparent border-none outline-none text-white font-semibold px-4 text-[13px] truncate relative z-10"
                />
                <button 
                  onClick={handleCopy}
                  className="relative z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-[#00E5FF] to-[#0077FF] text-[#0A0D14] px-5 py-2.5 rounded-lg font-black text-[12px] transition-all hover:scale-105 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>

            {/* Sleek Stats Bar */}
            <div className="flex flex-row items-center justify-between bg-[#131823]/60 backdrop-blur-md border border-white/5 rounded-2xl py-3 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-transparent flex items-center justify-center border border-[#00E5FF]/30 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">
                  <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white leading-none">5M+</span>
                  <span className="text-[9px] font-bold text-[#8b92a5] uppercase tracking-wider mt-1">Aktif Oyuncu</span>
                </div>
              </div>
              
              <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-transparent flex items-center justify-center border border-[#10B981]/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">
                  <CreditCard className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white leading-none">100+</span>
                  <span className="text-[9px] font-bold text-[#8b92a5] uppercase tracking-wider mt-1">Ödeme Yöntemi</span>
                </div>
              </div>
              
              <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-transparent flex items-center justify-center border border-indigo-500/30 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]">
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white leading-none">17+</span>
                  <span className="text-[9px] font-bold text-[#8b92a5] uppercase tracking-wider mt-1">Dil Seçeneği</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Content - Promo Visual/Video Placeholder */}
          <div className="flex-1 w-full relative mt-8 lg:mt-0">
            <div 
              onClick={() => setIsVideoOpen(true)}
              className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden bg-[#0d1017] border border-[#00E5FF]/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] group flex items-center justify-center cursor-pointer"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF] to-[#10B981] opacity-20 blur-lg group-hover:opacity-30 transition-opacity"></div>
              
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
              
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-[#0a0d14]/40 backdrop-blur-[2px]">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#00E5FF] to-[#10B981] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.4)] mb-5 cursor-pointer group-hover:scale-110 transition-transform duration-500 ease-out relative">
                  <div className="absolute inset-0 bg-[#00E5FF] rounded-full animate-ping opacity-30"></div>
                  <Play className="w-8 h-8 text-[#0A0D14] ml-1 relative z-10" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-white italic mb-1 drop-shadow-md">Tanıtım Videosu</h3>
                <p className="text-[#8b92a5] font-medium text-[13px]">Sistemin nasıl çalıştığını izleyin</p>
              </div>
            </div>

            {/* Floating Earnings Box */}
            <div className="absolute -bottom-6 -left-6 bg-[#131823]/90 p-4 rounded-xl border border-[#10B981]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-[bounce_4s_infinite_ease-in-out]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_5px_#10B981]"></div>
                <span className="text-[9px] font-black text-[#8b92a5] uppercase tracking-widest">Son Kazanç</span>
              </div>
              <div className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                $4,250.<span className="text-[#8b92a5] text-sm">00</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-8">
          <div className="text-center mb-10">
            <h2 className="text-[24px] font-black text-white tracking-tight mb-2">Ayrıcalıklı <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981]">Avantajlar</span></h2>
            <p className="text-[#8b92a5] font-medium text-[13px] max-w-[500px] mx-auto">
              Ortaklarımıza sektördeki en iyi şartları sağlıyoruz. Hemen katılın ve aradaki farkı kendiniz görün.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Feature 1 */}
            <div className="relative bg-[#0d1017]/60 border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 group backdrop-blur-xl hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(0,229,255,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#00E5FF]/10 rounded-full blur-[40px] group-hover:bg-[#00E5FF]/30 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* Advanced Animated Icon Box */}
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem] p-[1px] mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#00E5FF_80%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 to-transparent opacity-50"></div>
                  <div className="relative h-full w-full rounded-[1.25rem] bg-[#0A0D14] flex items-center justify-center backdrop-blur-xl border border-white/5">
                    <Zap className="w-7 h-7 text-[#00E5FF] group-hover:drop-shadow-[0_0_12px_#00E5FF] transition-all" />
                  </div>
                </div>
                <h3 className="text-[18px] font-black text-white mb-3 tracking-tight group-hover:text-[#00E5FF] transition-colors">Anında Ödemeler</h3>
                <p className="text-[#8b92a5] text-[13px] leading-relaxed font-medium">
                  Kazançlarınızı bekletmiyoruz. Bakiyenizi istediğiniz an hızlıca çekin.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative bg-[#0d1017]/60 border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 group backdrop-blur-xl hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-[#10B981]/10 rounded-full blur-[40px] group-hover:bg-[#10B981]/30 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* Advanced Animated Icon Box */}
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem] p-[1px] mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#10B981_80%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-transparent opacity-50"></div>
                  <div className="relative h-full w-full rounded-[1.25rem] bg-[#0A0D14] flex items-center justify-center backdrop-blur-xl border border-white/5">
                    <Infinity className="w-7 h-7 text-[#10B981] group-hover:drop-shadow-[0_0_12px_#10B981] transition-all" />
                  </div>
                </div>
                <h3 className="text-[18px] font-black text-white mb-3 tracking-tight group-hover:text-[#10B981] transition-colors">Ömür Boyu Komisyon</h3>
                <p className="text-[#8b92a5] text-[13px] leading-relaxed font-medium">
                  Aktif oyunculardan kesintisiz %60'a varan pay almaya devam edin.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative bg-[#0d1017]/60 border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 group backdrop-blur-xl hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(168,85,247,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/30 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* Advanced Animated Icon Box */}
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem] p-[1px] mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#A855F7_80%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-50"></div>
                  <div className="relative h-full w-full rounded-[1.25rem] bg-[#0A0D14] flex items-center justify-center backdrop-blur-xl border border-white/5">
                    <SlidersHorizontal className="w-7 h-7 text-purple-400 group-hover:drop-shadow-[0_0_12px_#A855F7] transition-all" />
                  </div>
                </div>
                <h3 className="text-[18px] font-black text-white mb-3 tracking-tight group-hover:text-purple-400 transition-colors">Özel Anlaşmalar</h3>
                <p className="text-[#8b92a5] text-[13px] leading-relaxed font-medium">
                  RevShare, CPA veya Hibrit modeller ile özelleştirilmiş kazanç yapıları.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="relative bg-[#0d1017]/60 border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 group backdrop-blur-xl hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_rgba(234,179,8,0.15)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-yellow-500/10 rounded-full blur-[40px] group-hover:bg-yellow-500/30 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="relative z-10">
                {/* Advanced Animated Icon Box */}
                <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-[1.25rem] p-[1px] mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#EAB308_80%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-50"></div>
                  <div className="relative h-full w-full rounded-[1.25rem] bg-[#0A0D14] flex items-center justify-center backdrop-blur-xl border border-white/5">
                    <Headphones className="w-7 h-7 text-yellow-400 group-hover:drop-shadow-[0_0_12px_#EAB308] transition-all" />
                  </div>
                </div>
                <h3 className="text-[18px] font-black text-white mb-3 tracking-tight group-hover:text-yellow-400 transition-colors">7/24 VIP Destek</h3>
                <p className="text-[#8b92a5] text-[13px] leading-relaxed font-medium">
                  Size özel Affiliate Manager ile anlık desteğe kesintisiz ulaşın.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* CTA BOTTOM */}
        <div className="mt-16 bg-[#0d1017]/60 backdrop-blur-2xl border border-[#00E5FF]/20 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between text-center md:text-left relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] group">
           {/* Animated Background Effects */}
           <div className="absolute -inset-1 bg-gradient-to-r from-[#00E5FF]/20 to-[#10B981]/20 opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
           
           {/* Moving gradient orb */}
           <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#00E5FF]/10 to-[#10B981]/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
           
           <div className="relative z-10 mb-10 md:mb-0">
             {/* Advanced Animated Badge */}
             <div className="relative inline-flex overflow-hidden rounded-full p-[1px] mb-6 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
               <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#00E5FF_50%,transparent_100%)]" />
               <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-[#0A0D14] px-4 py-2 backdrop-blur-3xl gap-2">
                 <Zap className="w-4 h-4 text-[#00E5FF] animate-pulse" />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-white text-[11px] font-black tracking-[0.2em] uppercase">Limitleri Kaldırın</span>
               </div>
             </div>
             
             <h2 className="text-[28px] md:text-[38px] font-black text-white tracking-tight mb-4 drop-shadow-md">
               Kazanmaya Başlamaya <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981] italic drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">Hazır Mısınız?</span>
             </h2>
             <p className="text-[#8b92a5] text-[15px] font-medium max-w-[450px] leading-relaxed mx-auto md:mx-0">
               Sadece <strong className="text-white">1 dakikada</strong> hesabınızı oluşturun, özel linkinizi alın ve sınırsız oyuncu getirerek hemen kazanmaya başlayın.
             </p>
           </div>
           
           {/* Premium Button */}
           <div className="relative z-10 shrink-0">
             {/* Button Glow behind */}
             <div className="absolute -inset-2 bg-gradient-to-r from-[#00E5FF] to-[#10B981] rounded-2xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
             
             <button 
               onClick={onAuthRequired} 
               className="relative flex items-center justify-center gap-3 w-full md:w-auto bg-gradient-to-r from-[#00E5FF] to-[#10B981] text-[#0A0D14] font-black text-[16px] px-10 py-5 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_10px_20px_rgba(0,229,255,0.3)] hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_15px_30px_rgba(0,229,255,0.5)] transition-all duration-300"
             >
               Hemen Başvur <ArrowRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0A0D14]/90 backdrop-blur-xl transition-opacity"
            onClick={() => setIsVideoOpen(false)}
          ></div>
          
          {/* Video Container */}
          <div className="relative w-full max-w-5xl aspect-[16/9] bg-black rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,229,255,0.2)] border border-white/10 flex flex-col z-10 animate-[scaleIn_0.3s_ease-out]">
            {/* Close Button */}
            <button 
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-[#00E5FF]/20 border border-white/10 hover:border-[#00E5FF]/50 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-all group"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            
            {/* Video Element: Using YouTube iframe for 100% reliability */}
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1" 
              title="724Bets Affiliate Promo" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>

            {/* Fake Captions Overlay for the "English Narration" feel */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm px-6 py-2 rounded-lg border border-white/10">
                <p className="text-white font-medium text-lg tracking-wide drop-shadow-md">
                  <span className="text-[#00E5FF]">"</span> Welcome to the industry's highest converting affiliate network. <span className="text-[#00E5FF]">"</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AffiliateView;
