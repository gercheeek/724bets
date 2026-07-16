import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, ArrowRight, X, Info } from 'lucide-react';

const LimitedTimePromo = () => {
  const [promoCode, setPromoCode] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Still keep the logic to only show to new members once (if they close it or use it, it can be hidden forever)
  useEffect(() => {
    if (localStorage.getItem('promoClaimed') === 'true' || localStorage.getItem('promoClosed') === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleClaim = () => {
    if (promoCode.trim().length > 0) {
      setShowTerms(true);
    } else {
      // Focus or alert to enter code
      alert('Lütfen önce promosyon kodunu giriniz.');
    }
  };

  const handleAcceptTerms = () => {
    localStorage.setItem('promoClaimed', 'true');
    setShowTerms(false);
    setIsVisible(false);
    // Proceed with bonus claiming logic (e.g. open deposit modal)
    window.dispatchEvent(new Event('openDepositModal'));
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="w-full relative overflow-hidden rounded-2xl bg-[#0F121A] border border-[#2A2E3D] p-1 mb-6 shadow-xl group transition-all duration-500">
        {/* Background Image & Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-[14px]">
          <img src="/images/limited_promo_bg_vibrant.jpg" className="w-full h-full object-cover opacity-40 mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-1000" alt="" />
          {/* Rich Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F121A] via-[#0F121A]/70 to-[#0F121A]"></div>
          {/* Subtle Green Glow */}
          <div className="absolute right-0 top-0 w-1/3 h-full bg-[#00FFA3]/5 blur-[100px] pointer-events-none"></div>
        </div>

        {/* Subtle sweeping light effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1500 z-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-4">
        
        {/* Left Side: Text Only */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-auto text-center md:text-left">
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1.5">
              <Sparkles className="w-6 h-6 text-[#00FFA3] drop-shadow-[0_0_8px_rgba(0,255,163,0.5)]" />
              <h3 className="text-white font-black text-xl md:text-2xl tracking-tight uppercase">
                5.000₺ HOŞ GELDİN BONUSU
              </h3>
              <span className="bg-gradient-to-r from-[#FF3366] to-[#E62E5C] text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest hidden sm:inline-block shadow-[0_0_10px_rgba(255,51,102,0.3)]">
                Özel Teklif
              </span>
            </div>
            <p className="text-[#848B9D] text-sm md:text-base font-medium">
              10.000₺ Yap, <strong className="text-white">2.500₺ Nakit Çek!</strong>
            </p>
          </div>
        </div>

        {/* Right Side: Promo Input & Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end shrink-0">
          
          {/* Sleek Promo Code Input */}
          <div className="relative">
            <input 
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="PROMO KODU"
              className="bg-[#1A1D29] border border-[#2A2E3D] text-white placeholder-[#848B9D] text-[13px] font-bold tracking-widest uppercase rounded-lg px-5 py-3.5 w-[200px] focus:outline-none focus:border-[#00FFA3] focus:shadow-[0_0_15px_rgba(0,255,163,0.15)] transition-all"
            />
          </div>

          {/* Primary CTA Button */}
          <button 
            onClick={handleClaim}
            className="relative overflow-hidden group/btn bg-[#00FFA3] hover:bg-[#00E676] text-[#0F121A] font-black px-8 py-3.5 rounded-lg shadow-[0_0_20px_rgba(0,255,163,0.2)] hover:shadow-[0_0_30px_rgba(0,255,163,0.4)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 uppercase tracking-widest text-[13px]"
          >
            <span className="relative z-10">KULLAN</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 -translate-x-[100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
          </button>
        </div>
        
        {/* Close button for new members who don't want it */}
        <button 
          onClick={() => {
            localStorage.setItem('promoClosed', 'true');
            setIsVisible(false);
          }}
          className="absolute top-3 right-3 text-[#848B9D] hover:text-white transition-colors bg-[#1A1D29] rounded-full p-1 border border-[#2A2E3D]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Terms Modal */}
    {showTerms && typeof document !== 'undefined' && createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-[#1A1D29] border border-[#2A2E3D] rounded-2xl p-6 w-full max-w-md relative shadow-2xl animate-in fade-in zoom-in duration-300">
          <button 
            onClick={() => setShowTerms(false)}
            className="absolute top-4 right-4 text-[#848B9D] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#FF3366]/20 flex items-center justify-center">
              <Info className="w-5 h-5 text-[#FF3366]" />
            </div>
            <h2 className="text-xl font-black text-white">KAMPANYA ŞARTLARI</h2>
          </div>
          
          <div className="space-y-4 text-sm text-[#848B9D]">
            <p>
              Tebrikler! <strong>{promoCode}</strong> kodunu başarıyla girdiniz. Bu 5.000₺ Hoş Geldin Bonusu kampanyasına katılmak üzeresiniz.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Bonus sadece yeni üyelere ve ilk yatırıma özeldir.</li>
              <li>Bonusu çekilebilir nakde dönüştürmek için bakiyenizi en az 10.000₺ yapmalısınız.</li>
              <li>Çevrim şartları tamamlandığında en fazla 2.500₺ nakit çekim yapabilirsiniz.</li>
              <li>Bu kampanya diğer bonuslarla birleştirilemez.</li>
            </ul>
          </div>
          
          <div className="mt-8 flex gap-3">
            <button 
              onClick={() => setShowTerms(false)}
              className="flex-1 bg-transparent border border-[#2A2E3D] hover:bg-[#2A2E3D] text-white font-bold py-3 rounded-xl transition-colors"
            >
              Vazgeç
            </button>
            <button 
              onClick={handleAcceptTerms}
              className="flex-1 bg-[#00FFA3] hover:bg-[#00E676] text-[#0F121A] font-black py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-colors"
            >
              Kabul Et
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default LimitedTimePromo;
