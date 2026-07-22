import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-[#050505] border-t border-[#1b2335] py-10 md:py-16 mt-auto font-sans relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-0.5 select-none" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
              <span className="text-[#06b6d4] font-extrabold text-2xl lowercase text-center">724bets</span>
              <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full border-[2px] md:border-[3px] border-[#06b6d4] ml-1.5 -mt-3 md:-mt-4">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-[#06b6d4] w-3 h-3 md:w-3.5 md:h-3.5">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            </div>
            <p className="text-[#848B9D] text-sm leading-relaxed">
              {t("footer_desc")}
            </p>
            {/* License text */}
            <div className="flex items-start gap-3 mt-2 bg-[#11141D]/50 p-4 rounded-xl border border-white/5">
              <ShieldCheck className="w-8 h-8 text-yellow-500 shrink-0" />
              <p className="text-[11px] text-gray-400 leading-snug">
                {t("footer_license")}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3 font-['Outfit']">{t("payment_methods")}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Crypto */}
              <div className="bg-[#0e1320] border border-[#1b2335] hover:border-[#F7931A]/50 rounded-xl w-14 h-10 flex items-center justify-center transition-colors shadow-sm group">
                <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029" alt="Bitcoin" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-[#0e1320] border border-[#1b2335] hover:border-[#627EEA]/50 rounded-xl w-14 h-10 flex items-center justify-center transition-colors shadow-sm group">
                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029" alt="Ethereum" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-[#0e1320] border border-[#1b2335] hover:border-[#26A17B]/50 rounded-xl w-14 h-10 flex items-center justify-center transition-colors shadow-sm group">
                <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029" alt="Tether" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-[#0e1320] border border-[#1b2335] hover:border-[#FF0013]/50 rounded-xl w-14 h-10 flex items-center justify-center transition-colors shadow-sm group">
                <img src="https://cryptologos.cc/logos/tron-trx-logo.svg?v=029" alt="Tron" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-[#0e1320] border border-[#1b2335] hover:border-[#F3BA2F]/50 rounded-xl w-14 h-10 flex items-center justify-center transition-colors shadow-sm group">
                <img src="https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029" alt="Binance Coin" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              {/* Fiat/Bank */}
              <div className="bg-[#0e1320] border border-[#1b2335] hover:border-slate-500/30 rounded-xl w-14 h-10 flex items-center justify-center transition-colors shadow-sm">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 w-auto brightness-200 grayscale opacity-80" />
              </div>
              <div className="bg-[#0e1320] border border-[#1b2335] hover:border-slate-500/30 rounded-xl w-14 h-10 flex items-center justify-center transition-colors shadow-sm">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 w-auto opacity-80 grayscale" />
              </div>
              <div className="bg-[#0e1320] border border-[#1b2335] hover:border-[#06b6d4]/50 rounded-xl px-4 h-10 flex items-center justify-center transition-colors shadow-sm">
                <span className="text-slate-300 font-bold text-[10px] sm:text-xs tracking-wider">{t("bank_transfer")}</span>
              </div>
            </div>
            
            {/* Providers */}
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mt-6 mb-3 font-['Outfit']">{t("trusted_providers")}</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
               <div className="px-3 py-1.5 bg-[#0e1320] border border-[#1b2335] rounded-lg text-[11px] font-bold text-slate-400 tracking-wider hover:text-white transition-colors cursor-default shadow-sm">PRAGMATIC PLAY</div>
               <div className="px-3 py-1.5 bg-[#0e1320] border border-[#1b2335] rounded-lg text-[11px] font-bold text-slate-400 tracking-wider hover:text-white transition-colors cursor-default shadow-sm">HACKSAW</div>
               <div className="px-3 py-1.5 bg-[#0e1320] border border-[#1b2335] rounded-lg text-[11px] font-bold text-slate-400 tracking-wider hover:text-white transition-colors cursor-default shadow-sm">EVOLUTION</div>
               <div className="px-3 py-1.5 bg-[#0e1320] border border-[#1b2335] rounded-lg text-[11px] font-bold text-slate-400 tracking-wider hover:text-white transition-colors cursor-default shadow-sm">NOLIMIT CITY</div>
            </div>
          </div>

          {/* Trust & Responsible Gaming */}
          <div className="flex flex-col gap-4 lg:items-end lg:text-right">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2 font-['Outfit']">{t("responsible_gaming")}</h3>
            
            <div className="flex flex-wrap lg:justify-end gap-3 mb-2 mt-1">
              <div className="bg-[#0e1320] border border-red-500/20 rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                <span className="text-red-500/80 font-black text-lg">18+</span>
              </div>
              <div className="bg-[#0e1320] border border-[#1b2335] rounded-full w-12 h-12 flex items-center justify-center shadow-sm">
                <Lock className="text-slate-400 w-5 h-5" />
              </div>
              <div className="bg-[#0e1320] border border-[#1b2335] rounded-full px-4 h-12 flex items-center justify-center gap-2 shadow-sm">
                <ShieldAlert className="text-slate-400 w-4 h-4" />
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">GambleAware</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 max-w-xs border-l-2 lg:border-l-0 lg:border-r-2 border-red-500/50 pl-3 lg:pl-0 lg:pr-3 py-1">
              <p className="mb-1 text-gray-400 font-medium">{t("gambling_addictive")}</p>
              <p>{t('gambling_limits')} {t('gambling_help_1')} <a href="#" className="text-white hover:text-[#06b6d4] underline">{t('gambling_help_link')}</a> {t('gambling_help_2')}</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-[#1b2335] text-[11px] sm:text-xs text-slate-500 gap-4">
          <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors uppercase tracking-wider">{t("terms_conditions")}</a>
            <a href="#" className="hover:text-gray-300 transition-colors uppercase tracking-wider">{t("privacy_policy")}</a>
            <a href="#" className="hover:text-gray-300 transition-colors uppercase tracking-wider">{t("responsible_gaming")}</a>
            <a href="#" className="hover:text-gray-300 transition-colors uppercase tracking-wider">{t("kyc_policy")}</a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
              <span className="tracking-wide text-[11px] text-slate-500">{t("all_rights_reserved")}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] sm:text-[10px] text-slate-600 font-mono tracking-wider">724bets v2.0.1</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-admin'))}
                className="px-3 py-1.5 bg-[#0e1320] border border-[#1b2335] hover:border-slate-500/50 rounded-lg text-[10px] sm:text-[11px] text-slate-400 hover:text-white font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Lock className="w-3 h-3" />
                Yönetici
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-finance'))}
                className="px-3 py-1.5 bg-[#0e1320] border border-[#1b2335] hover:border-slate-500/50 rounded-lg text-[10px] sm:text-[11px] text-slate-400 hover:text-white font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <TrendingUp className="w-3 h-3" />
                Finans
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
