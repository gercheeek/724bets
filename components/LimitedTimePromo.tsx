import React, { useState, useEffect } from 'react';
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
      <div className="w-full relative overflow-hidden rounded-xl bg-[#0B0E14] border border-[#FF3366]/30 p-1 mb-4 shadow-[0_0_20px_rgba(255,51,102,0.1)] group transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,51,102,0.2)]">
        {/* Background Image & Effects */}
        <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
          <img src="/images/limited_promo_bg_vibrant.jpg" className="w-full h-full object-cover opacity-60 mix-blend-screen scale-105 group-hover:scale-100 transition-transform duration-1000" alt="" />
          {/* Soft radial gradient to focus on content */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0B0E14_80%)]"></div>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 to-[#0B0E14]"></div>
        </div>

        {/* Subtle sweeping light effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1500 z-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-3">
        
        {/* Left Side: Text Only */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full md:w-auto text-center md:text-left">
          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
              <h3 className="text-white font-black text-lg md:text-xl tracking-tight uppercase" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                5.000₺ HOŞ GELDİN BONUSU
              </h3>
              <span className="bg-[#FF3366]/20 text-[#FF3366] border border-[#FF3366]/50 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest hidden sm:inline-block">
                Sınırlı Süre
              </span>
            </div>
            <p className="text-gray-300 text-sm font-medium pl-0 md:pl-7">
              10.000₺ Yap, <strong className="text-white text-base bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">2.500₺ Nakit Çek!</strong>
            </p>
          </div>
        </div>

        {/* Right Side: Promo Input & Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end shrink-0 mt-2 md:mt-0">
          
          {/* Promo Code Input */}
          <div className="relative">
            <input 
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="PROMO KODU"
              className="bg-[#0B0E14]/80 border border-white/20 text-white placeholder-white/30 text-sm font-bold tracking-widest uppercase rounded-lg px-4 py-3 w-[160px] focus:outline-none focus:border-[#FF3366] transition-colors"
            />
          </div>

          {/* Primary CTA Button (Green) */}
          <button 
            onClick={handleClaim}
            className="relative overflow-hidden group/btn bg-[#00FFA3] hover:bg-[#00E676] text-black font-black px-6 py-3 rounded-lg shadow-[0_0_20px_rgba(0,255,163,0.3)] hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 uppercase tracking-wide text-sm"
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
          className="absolute top-2 right-2 text-white/30 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Terms Modal */}
    {showTerms && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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
              className="flex-1 bg-[#00FFA3] hover:bg-[#00E676] text-black font-black py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-colors"
            >
              Şartları Kabul Et
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default LimitedTimePromo;
