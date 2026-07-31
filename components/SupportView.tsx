import React, { useState } from 'react';
import { Crown, Lock, ArrowRight, Sparkles, Headphones, ShieldCheck, Zap } from 'lucide-react';
import VipLoginModal from './VipLoginModal';
import JobApplicationModal from './JobApplicationModal';
import { useTranslation } from 'react-i18next';

const SupportView: React.FC = () => {
  const { t } = useTranslation();
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobModalDefaultPosition, setJobModalDefaultPosition] = useState<'support' | 'marketing'>('support');

  return (
    <div className="w-full text-white min-h-[calc(100vh-100px)] font-sans relative flex flex-col items-center justify-start pt-4 pb-12 px-4 overflow-hidden">
      {/* Background Ambient Glows (Borderless) */}
      <div className="absolute inset-0 bg-[#04060A] z-0 pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.08),transparent_70%)] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06),transparent_70%)] rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col gap-5 w-full max-w-[1000px] mx-auto mt-2">
        
        {/* VIP SPECIAL SUPPORT BANNER (Borderless, Next-Level Layout) */}
        <div className="w-full bg-gradient-to-r from-[#031920] via-[#071118] to-[#040A12] rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-full md:w-[400px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.12),transparent_70%)] blur-[60px] pointer-events-none"></div>

          {/* VIP Representative Image with Soft Mask Fade */}
          <div className="absolute top-0 right-0 h-full w-full md:w-1/2 pointer-events-none z-0 opacity-10 md:opacity-80 group-hover:opacity-100 transition-opacity duration-700 md:[mask-image:linear-gradient(to_right,transparent_0%,black_40%,black_100%)]">
            <img 
              src="/images/vip-rep-office.jpg" 
              alt="VIP Temsilcisi" 
              className="w-full h-full object-cover object-[70%_20%] md:group-hover:scale-105 transition-transform duration-1000" 
            />
          </div>

          {/* Content Box */}
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left max-w-[500px] mx-auto md:mx-0">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 backdrop-blur-md mb-3 md:mb-4">
              <span className="text-[10px] font-black tracking-widest text-[#00E5FF] uppercase">{t('support_vip.badge')}</span>
            </div>

            {/* Title */}
            <h2 className="font-black text-2xl md:text-3xl lg:text-4xl tracking-tight mb-2 md:mb-3 text-white drop-shadow-md">
              {t('support_vip.title')}
            </h2>

            {/* Description */}
            <p className="text-[13px] md:text-[14px] text-zinc-300 font-medium mb-6 leading-relaxed px-2 md:px-0">
              {t('support_vip.desc')}
            </p>

            {/* CTA Button */}
            <button 
              onClick={() => setIsVipModalOpen(true)} 
              className="w-full md:w-auto bg-[#00E5FF] hover:bg-[#00cce6] text-[#002b30] px-6 py-3.5 rounded-xl text-[13px] font-black uppercase tracking-wider hover:scale-[1.02] transition-all duration-300 shadow-[0_0_25px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2.5 group/btn"
            >
              <Lock size={14} className="text-[#002b30]" />
              <span>{t('support_vip.btn')}</span>
              <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* LIVE SUPPORT & AUTH BANNER (Borderless, Compact & Balanced) */}
        <div className="w-full bg-[#060911]/90 backdrop-blur-xl rounded-3xl p-5 md:p-7 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          {/* Subtle Ambient Light */}
          <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none blur-[40px]"></div>

          {/* Left Side: Agent Avatar & Info */}
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 relative z-10 w-full md:w-auto">
            <div className="relative shrink-0">
              <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-[2px] shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <div className="w-full h-full bg-[#060911] rounded-full overflow-hidden">
                  <img src="/images/support-agent-male.jpg" alt="Agent" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#060911] shadow-[0_0_8px_rgba(16,185,129,1)]"></span>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-1 md:mb-0.5">
                <ShieldCheck size={16} className="text-emerald-400" />
                <h3 className="text-white font-black tracking-tight text-lg md:text-xl">{t('support_live.title')}</h3>
              </div>
              <p className="text-[12px] md:text-[13px] text-zinc-400 font-medium px-2 md:px-0">
                {t('support_live.desc')}
              </p>
            </div>
          </div>

          {/* Right Side: Action Buttons (Borderless, Sleek) */}
          <div className="flex flex-row items-center justify-center gap-3 relative z-10 w-full md:w-auto md:justify-end shrink-0">
            <button className="flex-1 md:flex-none bg-white/5 hover:bg-white/10 text-white font-bold tracking-wider text-[11px] md:text-[12px] uppercase px-4 md:px-6 py-3.5 md:py-3 rounded-xl transition-all whitespace-nowrap text-center">
              {t('support_live.login')}
            </button>
            <button className="flex-1 md:flex-none bg-[#10b981] hover:bg-[#0ea5e9] text-[#022c22] hover:text-white font-black tracking-wider text-[11px] md:text-[12px] uppercase px-4 md:px-6 py-3.5 md:py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-1.5 md:gap-2 group/reg whitespace-nowrap">
              <span>{t('support_live.register')}</span>
              <ArrowRight size={14} className="group-hover/reg:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* CAREERS BANNER */}
        <div className="w-full bg-gradient-to-r from-[#050C17] via-[#09101C] to-[#03060A] rounded-3xl p-6 md:p-10 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/5 mt-2">
          
          {/* Intense Ambient Glows */}
          <div className="absolute top-0 right-0 w-full md:w-[600px] h-full bg-[radial-gradient(ellipse_at_right,rgba(0,229,255,0.08),transparent_70%)] pointer-events-none" />
          
          {/* WFH Team Image with Cinematic Mask */}
          <div className="absolute top-0 right-0 h-full w-full md:w-[55%] pointer-events-none z-0 opacity-20 md:opacity-70 group-hover:opacity-100 transition-opacity duration-700 md:[mask-image:linear-gradient(to_right,transparent_0%,black_30%,black_100%)]">
            <img 
              src="/images/wfh-support.jpg" 
              alt="Evden Çalışan Destek Ekibi" 
              className="w-full h-full object-cover object-center md:group-hover:scale-105 transition-transform duration-1000" 
            />
          </div>

          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-[65%] gap-5">
            
            <div className="flex flex-col items-center md:items-start w-full">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E5FF]/10 backdrop-blur-md mb-4 border border-[#00E5FF]/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <span className="text-[10px] font-black tracking-widest text-[#00E5FF] uppercase">{t('careers.badge')}</span>
              </div>
              
              <h2 className="font-black text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4 text-white drop-shadow-lg leading-tight">
                {t('careers.title_part1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-blue-500">{t('careers.title_part2')}</span> {t('careers.title_part3')}
              </h2>
              
              <div className="flex flex-col gap-3">
                <p className="text-[14px] md:text-[15px] text-zinc-300 font-medium max-w-[550px] leading-relaxed">
                  {t('careers.desc1')}
                </p>
                <p className="text-[13px] md:text-[14px] text-zinc-400 font-medium max-w-[550px] leading-relaxed">
                  <strong className="text-[#00E5FF]">{t('careers.desc2_strong')}</strong> {t('careers.desc2_rest')}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full shrink-0 mt-2">
              <div className="flex flex-col gap-1 w-full sm:w-auto">
                <button 
                  onClick={() => {
                    setJobModalDefaultPosition('support');
                    setIsJobModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-[#020408] hover:bg-[#0A0E17] border border-white/10 text-zinc-300 hover:text-white font-bold tracking-wider text-[11px] md:text-[12px] uppercase px-8 py-3.5 md:py-3.5 rounded-xl transition-all whitespace-nowrap text-center shadow-inner"
                >
                  {t('careers.support_btn')}
                </button>
                <span className="text-[10px] text-[#00E5FF] font-bold text-center mt-1">{t('careers.wfh_chance')}</span>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-auto sm:self-start">
                <button 
                  onClick={() => {
                    setJobModalDefaultPosition('marketing');
                    setIsJobModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-[#020408] hover:bg-[#0A0E17] border border-white/10 text-zinc-300 hover:text-white font-bold tracking-wider text-[11px] md:text-[12px] uppercase px-8 py-3.5 md:py-3.5 rounded-xl transition-all whitespace-nowrap text-center shadow-inner"
                >
                  {t('careers.marketing_btn')}
                </button>
                <span className="text-[10px] text-zinc-500 font-bold text-center mt-1"> </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modals */}
      <VipLoginModal 
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
      />

      <JobApplicationModal 
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        defaultPosition={jobModalDefaultPosition}
      />
    </div>
  );
};

export default SupportView;
