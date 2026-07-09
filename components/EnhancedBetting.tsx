import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

const EnhancedBetting: React.FC = () => {
  const gamdomLink = 'https://gamdom.com/r/724bahis';

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-[#f2a900]/10 flex items-center justify-center border border-[#f2a900]/20">
          <Flame className="w-4.5 h-4.5 text-[#f2a900]" />
        </div>
        <h3 className="text-white font-black text-sm uppercase tracking-wider italic flex items-center gap-2">
          GELİŞTİRİLMİŞ BAHİS 
          <span className="text-[10px] bg-[#f2a900]/20 text-[#f2a900] px-2 py-0.5 rounded border border-[#f2a900]/30 not-italic">GAMDOM ÖZEL</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Banner 1 */}
        <a 
          href={gamdomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative rounded-lg overflow-hidden group cursor-pointer border border-[#f2a900]/20 hover:border-[#f2a900]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(242,169,0,0.15)] aspect-[21/9] bg-[#0a0d14]"
        >
          {/* Gamdom Logo Watermark */}
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0">
            <span className="text-9xl font-black text-white">G</span>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent z-10" />
          
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8 z-20">
            <img 
              src="https://cryptologos.cc/logos/gamdom-gmd-logo.png?v=029" 
              alt="Gamdom" 
              className="w-24 sm:w-32 mb-3 object-contain opacity-90"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <h4 className="text-xl sm:text-2xl font-black text-white italic tracking-tight mb-2 leading-tight">
              SPOR BAHİSLERİNDE<br/><span className="text-[#f2a900]">EKSTRA KAZANÇ</span>
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm font-bold mb-4 max-w-[200px] sm:max-w-[250px]">
              Gamdom güvencesiyle yüksek oranlar ve anında çekim avantajı.
            </p>
            
            <div className="flex items-center gap-2 text-[#f2a900] font-black text-xs uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform duration-300">
              HEMEN OYNA <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </a>

        {/* Banner 2 */}
        <a 
          href={gamdomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative rounded-lg overflow-hidden group cursor-pointer border border-[#f2a900]/20 hover:border-[#f2a900]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(242,169,0,0.15)] aspect-[21/9] bg-[#0a0d14]"
        >
          {/* Gamdom Logo Watermark */}
          <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-0">
            <span className="text-9xl font-black text-white">G</span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#000000]/80 to-transparent z-10" />
          
          <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-8 z-20">
            <img 
              src="https://cryptologos.cc/logos/gamdom-gmd-logo.png?v=029" 
              alt="Gamdom" 
              className="w-24 sm:w-32 mb-3 object-contain opacity-90"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <h4 className="text-xl sm:text-2xl font-black text-white italic tracking-tight mb-2 leading-tight">
              VIP ÖDÜLLER VE<br/><span className="text-[#f2a900]">ÖZEL BONUSLAR</span>
            </h4>
            <p className="text-gray-400 text-xs sm:text-sm font-bold mb-4 max-w-[200px] sm:max-w-[250px]">
              724bahis referansıyla katılanlara özel ekstra rakeback ve promosyonlar.
            </p>
            
            <div className="flex items-center gap-2 text-[#f2a900] font-black text-xs uppercase tracking-widest mt-auto group-hover:translate-x-2 transition-transform duration-300">
              AVANTAJLARI YAKALA <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default EnhancedBetting;
