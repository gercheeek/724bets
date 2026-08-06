import React, { useState } from 'react';
import { Mail, Send, Twitter, Instagram } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [adminClickCount, setAdminClickCount] = useState(0);

  const handleAdminClick = (e: React.MouseEvent, linkId: string) => {
    e.preventDefault();
    if (linkId === 'iletisim') {
      const newCount = adminClickCount + 1;
      setAdminClickCount(newCount);
      if (newCount >= 10) {
        window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'admin' }));
        setAdminClickCount(0);
      }
    }
  };

  const brandLinks = [
    { key: 'rewards', id: 'ödüller' },
    { key: 'promotions', id: 'promosyonlar' },
    { key: 'provably_fair', id: 'adil' },
    { key: 'admin_login', id: 'admin' },
    { key: 'contact', id: 'iletisim' }
  ];

  const resourceLinks = [
    { key: 'responsible_gaming' },
    { key: 'accessibility' },
    { key: 'code_of_ethics' },
    { key: 'complaints' }
  ];

  const legalLinks = [
    { key: 'kpam' },
    { key: 'betting_rules' },
    { key: 'cookie_policy' },
    { key: 'publisher_policy' },
    { key: 'disclaimer' },
    { key: 'privacy_policy' },
    { key: 'terms_of_service' }
  ];

  return (
    <footer className="w-full bg-[#0A0C10] border-t border-white/5 pt-10 pb-28 md:py-12 px-6 lg:px-12 relative z-10 font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Top Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-y-10 gap-x-6 lg:gap-6 mb-8 md:mb-16">
          {/* Col 1: Brand Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-5 flex flex-col items-start">
             {/* Logo */}
            <div className="flex items-center gap-2 mb-6 cursor-pointer select-none group font-black text-3xl tracking-tight" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
              <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                724
              </span>
              <span className="text-[#00E5FF] flex ml-[1px]">
                <span>b</span><span>e</span><span>t</span><span>s</span>
              </span>
            </div>
            <p className="text-zinc-400 text-[13px] mb-6 leading-relaxed max-w-sm">
              {t('footer.about')}
            </p>

            {/* Payment Methods */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
               <div className="px-2.5 py-1 rounded-md border border-white/5 bg-white/[0.02] text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-white hover:bg-white/10 transition-colors cursor-default">BTC</div>
               <div className="px-2.5 py-1 rounded-md border border-white/5 bg-white/[0.02] text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-white hover:bg-white/10 transition-colors cursor-default">ETH</div>
               <div className="px-2.5 py-1 rounded-md border border-white/5 bg-white/[0.02] text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-white hover:bg-white/10 transition-colors cursor-default">USDT</div>
               <div className="px-2.5 py-1 rounded-md border border-white/5 bg-white/[0.02] text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-white hover:bg-white/10 transition-colors cursor-default">HAVALE</div>
               <div className="px-2.5 py-1 rounded-md border border-white/5 bg-white/[0.02] text-zinc-500 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-white hover:bg-white/10 transition-colors cursor-default">PAPARA</div>
            </div>
            
            <div className="flex flex-col gap-3 mb-8">
              <a href="mailto:support@724bets.com" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px]">
                <Mail className="w-4 h-4 text-[#1075fc]" /> support@724bets.com
              </a>
              <a href="mailto:marketing@724bets.com" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px]">
                <Mail className="w-4 h-4 text-[#a855f7]" /> marketing@724bets.com
              </a>
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-[#0A0D14] hover:bg-[#00E5FF] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:-translate-y-1">
                <Send className="w-4 h-4" /> {/* Telegram */}
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-[#0A0D14] hover:bg-[#00E5FF] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:-translate-y-1">
                <Twitter className="w-4 h-4" /> {/* X */}
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-[#0A0D14] hover:bg-[#00E5FF] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:-translate-y-1">
                <Instagram className="w-4 h-4" /> {/* Instagram */}
              </a>
            </div>
          </div>

          {/* Col 2: 724BETS */}
          <div className="col-span-1 lg:col-span-2 flex flex-col">
            <h4 className="text-white text-[13px] font-bold tracking-wider mb-4 md:mb-6 uppercase">{t('footer.brand_title')}</h4>
            <div className="flex flex-col gap-3 md:gap-4">
              {brandLinks.map(link => (
                <a 
                  key={link.key} 
                  href="#" 
                  onClick={(e) => {
                    if (link.id === 'admin') {
                      e.preventDefault();
                      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: 'admin' }));
                    } else if (link.id === 'iletisim') {
                      handleAdminClick(e, link.id);
                    }
                  }}
                  className="text-zinc-400 text-[13px] hover:text-[#00E5FF] transition-colors"
                >
                  {t(`footer.${link.key}`)}
                </a>
              ))}
            </div>
          </div>

          {/* Col 3: KAYNAKLAR */}
          <div className="col-span-1 lg:col-span-2 flex flex-col">
            <h4 className="text-white text-[13px] font-bold tracking-wider mb-4 md:mb-6 uppercase">{t('footer.resources_title')}</h4>
            <div className="flex flex-col gap-3 md:gap-4">
              {resourceLinks.map(link => (
                <a key={link.key} href="#" className="text-zinc-400 text-[13px] hover:text-[#00E5FF] transition-colors">
                  {t(`footer.${link.key}`)}
                </a>
              ))}
            </div>
          </div>

          {/* Col 4: YASAL */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3 flex flex-col">
            <h4 className="text-white text-[13px] font-bold tracking-wider mb-4 md:mb-6 uppercase">{t('footer.legal_title')}</h4>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
              {legalLinks.map(link => (
                <a key={link.key} href="#" className="text-zinc-400 text-[13px] hover:text-[#1075fc] transition-colors">
                  {t(`footer.${link.key}`)}
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
