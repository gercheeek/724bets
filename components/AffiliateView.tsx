import React, { useState } from 'react';
import { Users, Copy, Check, Zap, Infinity, SlidersHorizontal, Headphones, Play, ArrowRight, ShieldCheck, Globe, CreditCard } from 'lucide-react';

interface AffiliateViewProps {
  onNavigate?: (view: string) => void;
  onAuthRequired?: () => void;
}

const AffiliateView: React.FC<AffiliateViewProps> = ({ onNavigate, onAuthRequired }) => {
  const [copied, setCopied] = useState(false);
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
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-24">
          
          {/* Left Content */}
          <div className="flex-1 flex flex-col w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131823] border border-white/5 w-fit mb-6">
              <Users className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-[12px] font-bold text-white tracking-wide uppercase">Ortaklık Programı</span>
            </div>

            <h1 className="text-[40px] md:text-[56px] font-black leading-[1.1] tracking-tight text-white mb-6">
              Sektörün En Çok <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981] italic">Kazandıran</span> Ağı.
            </h1>
            
            <p className="text-[16px] md:text-[18px] text-[#8b92a5] font-medium leading-relaxed max-w-[500px] mb-10">
              <span className="text-white font-bold">%60'a varan</span> ömür boyu komisyon fırsatı ile kendi işinizin patronu olun. Dünyanın en iyi dönüştüren platformuna oyuncu yönlendirin ve limitsiz kazanın.
            </p>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap items-center gap-6 md:gap-10 mb-10 pb-10 border-b border-white/5">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-5 h-5 text-[#00E5FF]" />
                  <span className="text-xl font-bold">5M+</span>
                </div>
                <span className="text-[12px] font-semibold text-[#8b92a5] uppercase tracking-wider">Aktif Oyuncu</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white">
                  <CreditCard className="w-5 h-5 text-[#10B981]" />
                  <span className="text-xl font-bold">100+</span>
                </div>
                <span className="text-[12px] font-semibold text-[#8b92a5] uppercase tracking-wider">Ödeme Yöntemi</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-white">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  <span className="text-xl font-bold">17+</span>
                </div>
                <span className="text-[12px] font-semibold text-[#8b92a5] uppercase tracking-wider">Dil Seçeneği</span>
              </div>
            </div>

            {/* Link Copy Area */}
            <div className="flex flex-col gap-3 max-w-[450px]">
              <label className="text-[13px] font-bold text-white tracking-wide">Size Özel Davet Linkiniz</label>
              <div className="flex items-center bg-[#131823] border border-white/10 rounded-xl p-1.5 focus-within:border-[#00E5FF]/50 focus-within:shadow-[0_0_15px_rgba(0,229,255,0.1)] transition-all">
                <input 
                  type="text" 
                  readOnly 
                  value={referralLink}
                  className="flex-1 bg-transparent border-none outline-none text-white font-medium px-4 text-[15px] truncate"
                />
                <button 
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 bg-[#1b2230] hover:bg-[#252d3d] text-white px-5 py-3 rounded-lg font-bold text-[14px] transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Content - Promo Visual/Video Placeholder */}
          <div className="flex-1 w-full relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-[#131823] to-[#0A0D14] border border-white/5 shadow-2xl group flex items-center justify-center">
              {/* Decorative graphic inside placeholder */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#00E5FF] to-[#10B981] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.3)] mb-6 cursor-pointer hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 text-[#0A0D14] ml-1" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-white italic mb-2">Tanıtım Videosu</h3>
                <p className="text-[#8b92a5] font-medium text-sm">Sistemin nasıl çalıştığını izleyin</p>
              </div>
            </div>

            {/* Floating Earnings Box */}
            <div className="absolute -bottom-8 -left-8 bg-[#131823] p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl animate-[bounce_4s_infinite_ease-in-out]">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                <span className="text-[11px] font-bold text-[#8b92a5] uppercase tracking-wider">Son Kazanç</span>
              </div>
              <div className="text-2xl font-black text-white">
                $4,250.<span className="text-[#8b92a5] text-lg">00</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURES GRID */}
        <div className="mt-10">
          <div className="text-center mb-16">
            <h2 className="text-[32px] font-black text-white tracking-tight mb-4">Ayrıcalıklı <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#10B981]">Avantajlar</span></h2>
            <p className="text-[#8b92a5] font-medium text-[16px] max-w-[600px] mx-auto">
              Ortaklarımıza sektördeki en iyi şartları sağlıyoruz. Hemen katılın ve aradaki farkı kendiniz görün.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="bg-[#131823] border border-white/5 rounded-2xl p-8 hover:bg-[#1b2230] hover:border-white/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#0A0D14] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#00E5FF]/10 transition-all">
                <Zap className="w-7 h-7 text-[#00E5FF]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Anında Ödemeler</h3>
              <p className="text-[#8b92a5] text-[14px] leading-relaxed font-medium">
                Kazançlarınızı bekletmiyoruz. Bakiyenizi istediğiniz an kripto veya fiat para birimleriyle hızlıca çekin.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#131823] border border-white/5 rounded-2xl p-8 hover:bg-[#1b2230] hover:border-white/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#0A0D14] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#10B981]/10 transition-all">
                <Infinity className="w-7 h-7 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ömür Boyu Komisyon</h3>
              <p className="text-[#8b92a5] text-[14px] leading-relaxed font-medium">
                Getirdiğiniz oyuncular platformda aktif kaldığı sürece, hiçbir kesinti olmadan %60'a varan pay almaya devam edin.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#131823] border border-white/5 rounded-2xl p-8 hover:bg-[#1b2230] hover:border-white/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#0A0D14] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all">
                <SlidersHorizontal className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Özel Anlaşmalar</h3>
              <p className="text-[#8b92a5] text-[14px] leading-relaxed font-medium">
                Sizin hacminize ve trafiğinize uygun, RevShare, CPA veya Hibrit modeller ile tamamen özelleştirilmiş kazanç yapıları.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#131823] border border-white/5 rounded-2xl p-8 hover:bg-[#1b2230] hover:border-white/10 transition-all duration-300 group">
              <div className="w-14 h-14 bg-[#0A0D14] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-yellow-500/10 transition-all">
                <Headphones className="w-7 h-7 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">7/24 VIP Destek</h3>
              <p className="text-[#8b92a5] text-[14px] leading-relaxed font-medium">
                Size özel atanmış Affiliate Manager'ınız ile pazarlama materyallerine ve anlık desteğe 7/24 kesintisiz ulaşın.
              </p>
            </div>

          </div>
        </div>

        {/* CTA BOTTOM */}
        <div className="mt-24 bg-gradient-to-r from-[#131823] to-[#1b2230] border border-white/10 rounded-3xl p-10 md:p-14 flex flex-col items-center text-center relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
           <h2 className="text-[32px] md:text-[40px] font-black text-white italic tracking-tight mb-4 relative z-10">Kazanmaya Başlamaya Hazır Mısınız?</h2>
           <p className="text-[#8b92a5] text-lg font-medium max-w-[500px] mb-8 relative z-10">
             Sadece 1 dakikada hesabınızı oluşturun, linkinizi alın ve hemen oyuncu getirmeye başlayın.
           </p>
           <button onClick={onAuthRequired} className="relative z-10 bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] text-[#0A0D14] font-black text-[16px] px-10 py-4 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:scale-105 hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all flex items-center gap-2">
             Hemen Başvur <ArrowRight className="w-5 h-5" />
           </button>
        </div>

      </div>
    </div>
  );
};

export default AffiliateView;
