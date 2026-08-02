import React, { useState } from 'react';
import { Users, Copy, Check, Zap, Infinity, SlidersHorizontal, Headphones, Play, ArrowRight, ShieldCheck, Globe, CreditCard, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AffiliateViewProps {
  onNavigate?: (view: string) => void;
  onAuthRequired?: () => void;
}

const AffiliateView: React.FC<AffiliateViewProps> = ({ onNavigate, onAuthRequired }) => {
  const { t } = useTranslation();
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
                <span className="text-[#00E5FF] text-[11px] font-black tracking-[0.2em] uppercase">{t('affiliate.badge')}</span>
              </div>
            </div>

            <h1 className="text-[38px] md:text-[56px] font-black leading-[1.1] tracking-tight text-white mb-5 drop-shadow-md">
              {t('affiliate.hero_title_1')} <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981] drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">{t('affiliate.hero_title_2')}</span> {t('affiliate.hero_title_3')}
            </h1>
            
            <p className="text-[14px] md:text-[15px] text-[#8b92a5] font-medium leading-relaxed max-w-[500px] mb-8">
              <span className="text-white font-bold">{t('affiliate.hero_desc_1')}</span> {t('affiliate.hero_desc_2')}
            </p>

            {/* Link Copy Area */}
            <div className="flex flex-col gap-2 max-w-[450px] mb-10">
              <label className="text-[10px] font-black text-[#8b92a5] tracking-widest uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span> {t('affiliate.invite_link')}
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
                  {copied ? t('affiliate.copied') : t('affiliate.copy')}
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
                  <span className="text-[9px] font-bold text-[#8b92a5] uppercase tracking-wider mt-1">{t('affiliate.active_players')}</span>
                </div>
              </div>
              
              <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-transparent flex items-center justify-center border border-[#10B981]/30 shadow-[inset_0_0_10px_rgba(16,185,129,0.2)]">
                  <CreditCard className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white leading-none">100+</span>
                  <span className="text-[9px] font-bold text-[#8b92a5] uppercase tracking-wider mt-1">{t('affiliate.payment_methods')}</span>
                </div>
              </div>
              
              <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-transparent flex items-center justify-center border border-indigo-500/30 shadow-[inset_0_0_10px_rgba(99,102,241,0.2)]">
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white leading-none">17+</span>
                  <span className="text-[9px] font-bold text-[#8b92a5] uppercase tracking-wider mt-1">{t('affiliate.languages')}</span>
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
                <h3 className="text-2xl font-black text-white italic mb-1 drop-shadow-md">{t('affiliate.promo_video')}</h3>
                <p className="text-[#8b92a5] font-medium text-[13px]">{t('affiliate.promo_video_desc')}</p>
              </div>
            </div>

            {/* Floating Earnings Box */}
            <div className="absolute -bottom-6 -left-6 bg-[#131823]/90 p-4 rounded-xl border border-[#10B981]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-[bounce_4s_infinite_ease-in-out]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_5px_#10B981]"></div>
                <span className="text-[9px] font-black text-[#8b92a5] uppercase tracking-widest">{t('affiliate.last_earning')}</span>
              </div>
              <div className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                $4,250.<span className="text-[#8b92a5] text-sm">00</span>
              </div>
            </div>
          </div>
        </div>

        {/* AFFILIATE DASHBOARD WIDGETS */}
        <div className="mt-8 mb-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-black text-white tracking-tight">Ortaklık Paneli (Özet)</h2>
            <button className="text-[12px] font-bold text-[#00E5FF] hover:text-white transition-colors flex items-center gap-1">
              Tüm Verileri Gör <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat Card 1 */}
            <div className="bg-[#131823]/80 border border-white/5 rounded-2xl p-5 hover:border-[#00E5FF]/30 transition-colors shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#00E5FF]/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Toplam Kazanç</div>
              <div className="text-3xl font-black text-white mb-2">$12,450<span className="text-zinc-500 text-lg">.00</span></div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <TrendingUp className="w-4 h-4" /> +14.5% bu ay
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-[#131823]/80 border border-white/5 rounded-2xl p-5 hover:border-[#10B981]/30 transition-colors shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#10B981]/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Aktif Oyuncular</div>
              <div className="text-3xl font-black text-white mb-2">1,204</div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <TrendingUp className="w-4 h-4" /> +82 yeni üye
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-[#131823]/80 border border-white/5 rounded-2xl p-5 hover:border-[#A855F7]/30 transition-colors shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#A855F7]/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Dönüşüm Oranı</div>
              <div className="text-3xl font-black text-white mb-2">24.8%</div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <TrendingUp className="w-4 h-4" /> +2.1% artış
              </div>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-[#131823]/80 border border-white/5 rounded-2xl p-5 hover:border-[#EAB308]/30 transition-colors shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#EAB308]/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
              <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Tıklanmalar</div>
              <div className="text-3xl font-black text-white mb-2">45.2K</div>
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <TrendingDown className="w-4 h-4" /> -1.2% azalış
              </div>
            </div>
          </div>
          
          {/* Chart Mockup */}
          <div className="w-full h-64 bg-[#131823]/80 border border-white/5 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between overflow-hidden">
             <div className="flex justify-between items-center z-10">
               <span className="text-white font-bold">Kazanç Grafiği (Son 30 Gün)</span>
               <div className="flex gap-2">
                 <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-bold text-zinc-400 transition-colors">Haftalık</button>
                 <button className="px-3 py-1 bg-[#00E5FF]/20 text-[#00E5FF] rounded text-xs font-bold transition-colors">Aylık</button>
               </div>
             </div>
             {/* Simple CSS Chart Graphic */}
             <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-between px-6 pb-4 opacity-50 z-0">
               {[40, 60, 45, 80, 50, 70, 90, 65, 85, 100].map((h, i) => (
                 <div key={i} className="w-1/12 bg-gradient-to-t from-[#00E5FF]/30 to-transparent rounded-t-sm transition-all duration-1000" style={{ height: `${h}%` }}></div>
               ))}
             </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-8">
          <div className="text-center mb-10">
            <h2 className="text-[24px] font-black text-white tracking-tight mb-2">{t('affiliate.advantages')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981]">{t('affiliate.advantages_highlight')}</span></h2>
            <p className="text-[#8b92a5] font-medium text-[13px] max-w-[500px] mx-auto">
              {t('affiliate.advantages_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Feature 1 */}
            <div className="relative pt-6 group">
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#00E5FF] to-[#10B981] group-hover:w-full transition-all duration-700 ease-out"></div>
              
              <div className="relative z-10">
                <h3 className="text-[20px] font-black text-white mb-4 tracking-tight group-hover:text-[#00E5FF] transition-colors">{t('affiliate.feature1_title')}</h3>
                <p className="text-[#8b92a5] text-[14px] leading-relaxed font-medium">
                  {t('affiliate.feature1_desc')}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative pt-6 group">
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#10B981] to-[#00E5FF] group-hover:w-full transition-all duration-700 ease-out"></div>
              
              <div className="relative z-10">
                <h3 className="text-[20px] font-black text-white mb-4 tracking-tight group-hover:text-[#10B981] transition-colors">{t('affiliate.feature2_title')}</h3>
                <p className="text-[#8b92a5] text-[14px] leading-relaxed font-medium">
                  {t('affiliate.feature2_desc')}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative pt-6 group">
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#A855F7] to-[#00E5FF] group-hover:w-full transition-all duration-700 ease-out"></div>
              
              <div className="relative z-10">
                <h3 className="text-[20px] font-black text-white mb-4 tracking-tight group-hover:text-[#A855F7] transition-colors">{t('affiliate.feature3_title')}</h3>
                <p className="text-[#8b92a5] text-[14px] leading-relaxed font-medium">
                  {t('affiliate.feature3_desc')}
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="relative pt-6 group">
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-gradient-to-r from-[#EAB308] to-[#10B981] group-hover:w-full transition-all duration-700 ease-out"></div>
              
              <div className="relative z-10">
                <h3 className="text-[20px] font-black text-white mb-4 tracking-tight group-hover:text-[#EAB308] transition-colors">{t('affiliate.feature4_title')}</h3>
                <p className="text-[#8b92a5] text-[14px] leading-relaxed font-medium">
                  {t('affiliate.feature4_desc')}
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
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-white text-[11px] font-black tracking-[0.2em] uppercase">{t('affiliate.cta_badge')}</span>
               </div>
             </div>
             
             <h2 className="text-[28px] md:text-[38px] font-black text-white tracking-tight mb-4 drop-shadow-md">
               {t('affiliate.cta_title_1')} <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981] italic drop-shadow-[0_0_10px_rgba(0,229,255,0.3)]">{t('affiliate.cta_title_2')}</span>
             </h2>
             <p className="text-[#8b92a5] text-[15px] font-medium max-w-[450px] leading-relaxed mx-auto md:mx-0">
               {t('affiliate.cta_desc_1')} <strong className="text-white">{t('affiliate.cta_desc_2')}</strong> {t('affiliate.cta_desc_3')}
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
               {t('affiliate.apply_now')} <ArrowRight className="w-5 h-5" />
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
