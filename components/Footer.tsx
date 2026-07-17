import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0B0E14] border-t border-white/5 py-10 md:py-16 mt-auto font-sans relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-0.5 select-none" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>
              <span className="text-white font-extrabold text-2xl uppercase text-center">724</span>
              <span className="text-[#10B981] font-black text-2xl uppercase text-center">BETS</span>
            </div>
            <p className="text-[#848B9D] text-sm leading-relaxed">
              Premium kripto ve havale odaklı casino deneyimi. Güvenli, hızlı ve adil oyun anlayışıyla sektörün en yenilikçi platformu.
            </p>
            {/* License text */}
            <div className="flex items-start gap-3 mt-2 bg-[#11141D]/50 p-4 rounded-xl border border-white/5">
              <ShieldCheck className="w-8 h-8 text-yellow-500 shrink-0" />
              <p className="text-[11px] text-gray-400 leading-snug">
                Bu web sitesi, Curacao Hükümeti tarafından yetkilendirilmiş ve düzenlenmiş bir Curacao eGaming (Lisans No: 1668/JAZ) lisansı altında faaliyet göstermektedir.
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2 font-['Outfit']">Ödeme Yöntemleri</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Crypto */}
              <div className="bg-[#1A1D24] border border-[#252A35] hover:border-[#F7931A]/50 rounded-lg w-14 h-10 flex items-center justify-center transition-colors group">
                <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029" alt="Bitcoin" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-[#1A1D24] border border-[#252A35] hover:border-[#627EEA]/50 rounded-lg w-14 h-10 flex items-center justify-center transition-colors group">
                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029" alt="Ethereum" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-[#1A1D24] border border-[#252A35] hover:border-[#26A17B]/50 rounded-lg w-14 h-10 flex items-center justify-center transition-colors group">
                <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029" alt="Tether" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-[#1A1D24] border border-[#252A35] hover:border-[#FF0013]/50 rounded-lg w-14 h-10 flex items-center justify-center transition-colors group">
                <img src="https://cryptologos.cc/logos/tron-trx-logo.svg?v=029" alt="Tron" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              <div className="bg-[#1A1D24] border border-[#252A35] hover:border-[#F3BA2F]/50 rounded-lg w-14 h-10 flex items-center justify-center transition-colors group">
                <img src="https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029" alt="Binance Coin" className="h-5 w-auto group-hover:scale-110 transition-transform" />
              </div>
              {/* Fiat/Bank */}
              <div className="bg-[#1A1D24] border border-[#252A35] hover:border-blue-500/30 rounded-lg w-14 h-10 flex items-center justify-center transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3 w-auto brightness-200 grayscale" />
              </div>
              <div className="bg-[#1A1D24] border border-[#252A35] hover:border-red-500/30 rounded-lg w-14 h-10 flex items-center justify-center transition-colors">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4 w-auto" />
              </div>
              <div className="bg-[#1A1D24] border border-[#252A35] hover:border-[#10B981]/50 rounded-lg px-4 h-10 flex items-center justify-center transition-colors">
                <span className="text-white font-bold text-[10px] sm:text-xs tracking-wider">HAVALE / EFT</span>
              </div>
            </div>
            
            {/* Providers */}
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mt-4 mb-2 font-['Outfit']">Güvenilir Sağlayıcılar</h3>
            <div className="flex flex-wrap gap-4 sm:gap-6 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               <span className="text-white font-black text-sm sm:text-base tracking-widest font-['Outfit']">PRAGMATIC PLAY</span>
               <span className="text-white font-black text-sm sm:text-base tracking-widest font-['Outfit']">HACKSAW</span>
               <span className="text-white font-black text-sm sm:text-base tracking-widest font-['Outfit']">EVOLUTION</span>
               <span className="text-white font-black text-sm sm:text-base tracking-widest font-['Outfit']">NOLIMIT CITY</span>
            </div>
          </div>

          {/* Trust & Responsible Gaming */}
          <div className="flex flex-col gap-4 lg:items-end lg:text-right">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-2 font-['Outfit']">Sorumlu Oyun</h3>
            
            <div className="flex flex-wrap lg:justify-end gap-3 mb-2">
              <div className="bg-[#1A1D24] border border-red-500/30 rounded-full w-12 h-12 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                <span className="text-red-500 font-black text-lg">18+</span>
              </div>
              <div className="bg-[#1A1D24] border border-[#10B981]/30 rounded-full w-12 h-12 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,163,0.1)]">
                <Lock className="text-[#10B981] w-5 h-5" />
              </div>
              <div className="bg-[#1A1D24] border border-[#252A35] rounded-full px-4 h-12 flex items-center justify-center gap-2">
                <ShieldAlert className="text-white w-4 h-4" />
                <span className="text-white font-bold text-xs uppercase">GambleAware</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 max-w-xs border-l-2 lg:border-l-0 lg:border-r-2 border-red-500/50 pl-3 lg:pl-0 lg:pr-3 py-1">
              <p className="mb-1 text-gray-400 font-medium">Kumar bağımlılık yapabilir.</p>
              <p>Lütfen sınırlarınızı bilin ve sorumlu bir şekilde oynayın. Yardım için <a href="#" className="text-white hover:text-[#10B981] underline">destek kurumlarına</a> başvurabilirsiniz.</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/5 text-[11px] sm:text-xs text-gray-600 gap-4">
          <div className="flex items-center flex-wrap justify-center gap-3 sm:gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors uppercase tracking-wider">Kullanım Şartları</a>
            <a href="#" className="hover:text-gray-300 transition-colors uppercase tracking-wider">Gizlilik Politikası</a>
            <a href="#" className="hover:text-gray-300 transition-colors uppercase tracking-wider">Sorumlu Oyun</a>
            <a href="#" className="hover:text-gray-300 transition-colors uppercase tracking-wider">KYC Politikası</a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]/50" />
              <span className="tracking-wide">© 2026 724BETS. Tüm Hakları Saklıdır.</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-zinc-500 font-mono tracking-wider">724net v 0.0.1</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
