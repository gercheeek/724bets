import React from 'react';
import { Activity, AlertOctagon, CheckCircle2, Lock, Shield, ShieldAlert, ShieldCheck, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-[#090b10] border-t border-white/5 py-12 px-4 relative overflow-hidden z-10 font-sans">
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Main Footer Flex */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between items-start mb-12">
          
          {/* Brand & Curacao */}
          <div className="flex flex-col max-w-xs">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <span className="font-extrabold text-3xl tracking-tight lowercase text-[#00ff88] drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]">
                724bets
              </span>
              <div className="w-6 h-6 text-[#00ff88]">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full drop-shadow-[0_0_5px_rgba(0,255,136,0.6)]">
                  <path d="M 50,48 C 30,30 35,10 50,20 C 65,10 70,30 50,48 Z" />
                  <path d="M 46,52 C 30,35 10,40 20,55 C 10,70 30,75 46,52 Z" />
                  <path d="M 54,52 C 70,35 90,40 80,55 C 90,70 70,75 54,52 Z" />
                  <path d="M 50,52 Q 45,75 40,90 L 46,90 Q 51,75 50,52 Z" />
                </svg>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              En prestijli, güvenli ve lisanslı premium kripto bahis platformu. Şeffaflık, hız ve kanıtlanabilir adil sistemlerle oyun dünyasını yeniden tanımlıyoruz.
            </p>
            {/* License Box */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#111622] border border-white/5 hover:border-[#00ff88]/30 transition-colors">
              <div className="w-12 h-12 flex-shrink-0 bg-white/5 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#00ff88]" />
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş Curacao eGaming (Lisans No: 1668/JAZ) altında faaliyet göstermektedir.
              </p>
            </div>
          </div>

          {/* Trust Badges & Payments */}
          <div className="flex flex-col flex-1 max-w-2xl w-full">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" /> %100 Güvenli Ödemeler
            </h4>
            <div className="flex flex-wrap gap-2 mb-10">
              {['btc', 'eth', 'usdt', 'trx', 'bnb'].map((coin) => (
                 <div key={coin} className="w-12 h-12 bg-[#111622] rounded-lg border border-white/5 flex items-center justify-center hover:border-emerald-500/50 hover:-translate-y-1 transition-all cursor-pointer shadow-sm">
                   <img src={`/images/coins/${coin}.png`} alt={coin} className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" onError={(e) => { e.currentTarget.style.display='none' }} />
                 </div>
              ))}
              <div className="px-4 h-12 bg-[#111622] rounded-lg border border-white/5 flex items-center justify-center text-slate-400 font-semibold text-xs hover:text-white transition-colors cursor-pointer">
                Tümünü Gör
              </div>
            </div>

            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" /> Sertifikalar & Sağlayıcılar
            </h4>
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded flex items-center gap-2 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3" /> Provably Fair
              </div>
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold rounded flex items-center gap-2 uppercase tracking-widest">
                <Lock className="w-3 h-3" /> 256-bit SSL Secure
              </div>
              <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-bold rounded flex items-center gap-2 uppercase tracking-widest">
                <Activity className="w-3 h-3" /> RNG Certified
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {['PRAGMATIC PLAY', 'HACKSAW', 'EVOLUTION', 'NOLIMIT CITY'].map(prov => (
                <div key={prov} className="px-3 py-1.5 bg-[#111622] border border-white/5 rounded text-slate-400 text-[10px] font-bold tracking-widest hover:text-white hover:border-white/20 transition-colors">
                  {prov}
                </div>
              ))}
            </div>
          </div>

          {/* Responsible Gaming */}
          <div className="flex flex-col items-start lg:items-end max-w-xs w-full">
            <h4 className="text-white font-bold text-sm tracking-widest uppercase mb-6">Sorumlu Oyun</h4>
            <div className="flex gap-2 mb-6">
              <div className="w-10 h-10 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 font-black text-sm">18+</div>
              <div className="w-10 h-10 rounded-full bg-[#111622] flex items-center justify-center border border-white/5">
                <Shield className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="px-5 py-2.5 bg-black rounded-lg border border-white/10 flex items-center gap-3 mb-6 hover:border-white/30 transition-colors cursor-pointer">
              <AlertOctagon className="w-4 h-4 text-amber-500" />
              <span className="text-slate-300 font-bold text-xs tracking-wider">GAMBLEAWARE</span>
            </div>
            <p className="text-slate-500 text-[10px] leading-relaxed lg:text-right">
              Kumar bağımlılık yapabilir. Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın. Yardım için <a href="#" className="text-white underline hover:text-emerald-500">destek kurumlarına</a> başvurabilirsiniz.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8">
            {['KULLANIM ŞARTLARI', 'GİZLİLİK POLİTİKASI', 'SORUMLU OYUN', 'KYC POLİTİKASI', 'AML POLİTİKASI'].map(link => (
              <a key={link} href="#" className="text-slate-500 text-[11px] font-bold tracking-widest hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              &copy; {new Date().getFullYear()} 724BETS. Tüm Hakları Saklıdır.
            </div>
            <span className="text-slate-600 text-[10px] font-mono">v2.1.0-PRO</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
