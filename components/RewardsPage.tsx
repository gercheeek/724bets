import React, { useRef, useState, useEffect } from 'react';
import { 
  Shield, Gamepad2, Gift, Zap, Star, Coins, Crown, 
  Trophy, Target, Flag, Users, ArrowRight, ChevronLeft,
  ChevronDown, UserPlus, Sword
} from 'lucide-react';

import { SiteUser } from '../types';
import PromoCodeView from './PromoCodeView';

interface RewardsPageProps {
  onBack?: () => void;
  siteUser?: SiteUser | null;
}

const BrandShamrock = ({ className = "", style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" fill="url(#emerald-gradient)" className={className} style={style}>
    <defs>
      <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#047857" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#glow)">
       <path d="M 50,48 C 30,30 35,10 50,20 C 65,10 70,30 50,48 Z" />
       <path d="M 46,52 C 30,35 10,40 20,55 C 10,70 30,75 46,52 Z" />
       <path d="M 54,52 C 70,35 90,40 80,55 C 90,70 70,75 54,52 Z" />
       <path d="M 50,52 Q 45,75 40,90 L 46,90 Q 51,75 50,52 Z" />
    </g>
  </svg>
);


const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden mb-3 hover:border-emerald-500/20 hover:bg-zinc-900/80 transition-all duration-300">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none">
        <span className="font-bold text-white text-[15px]">{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 transition-colors ${isOpen ? 'bg-[#00E5FF]/20' : ''}`}>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#00E5FF]' : 'text-zinc-400'}`} />
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};


const RewardsPage: React.FC<RewardsPageProps> = ({ onBack, siteUser }) => {
  const [faqTab, setFaqTab] = useState('siralamalar');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white overflow-y-auto pb-24 font-sans selection:bg-[#2dd4bf]/30">
      
      {/* Global Background Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full relative z-10">
        


        {/* START OF CONSTRAINED CONTENT */}
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col gap-12 pb-10">
        
        {/* EMBEDDED PROMO CODE SECTION */}
        <section className="w-full -mx-4 sm:mx-0">
           <PromoCodeView siteUser={siteUser || null} isEmbedded={true} />
        </section>

        {/* 4. DAHASI DA VAR */}
        <section>
          <div className="flex items-end justify-between mb-8">
             <div>
               <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Dahası da var!</h2>
               <p className="text-zinc-300 text-sm font-bold mt-2 tracking-[0.15em] uppercase flex items-center gap-2">
                 <Zap className="w-4 h-4" /> Sınırları zorlayan etkinlikler
               </p>
             </div>
          </div>
          
          <style>{`
            @keyframes spin-slow {
               100% { transform: rotate(360deg); }
            }
          `}</style>
          
          <div className="flex justify-center">
            {/* Hediye Çekilişleri Card with Animated Border */}
            <div className="group relative rounded-[2rem] p-1 overflow-hidden h-[260px] cursor-pointer shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] hover:shadow-[0_30px_60px_-15px_rgba(234,179,8,0.2)] transition-shadow duration-700 w-full max-w-2xl">
               {/* Animated Gradient Border Layer */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-br from-yellow-500/0 via-white/30 to-yellow-500/0 opacity-0 group-hover:opacity-100 animate-[spin-slow_4s_linear_infinite_reverse] transition-opacity duration-700 pointer-events-none"></div>
               
               <div className="absolute inset-[2px] rounded-[calc(2rem-2px)] bg-[#0A0C10] z-10 overflow-hidden">
                  {/* Background Image */}
                  <img src="/images/limited_promo_bg_vibrant.jpg" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700 mix-blend-screen group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#050505]/90 to-transparent"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col items-start justify-between z-20">
                     <div className="space-y-2 mt-auto mb-5">
                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-xl group-hover:text-zinc-200 transition-colors">Hediye Çekilişleri</h3>
                        <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-[85%] drop-shadow-md">Kim efsanevi ganimetleri sevmez ki? Bir tanesini açma şansınız. Hemen katılın.</p>
                     </div>
                     <button className="relative overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-black px-6 py-2.5 rounded-full text-xs transition-all duration-300 shadow-[0_10px_20px_rgba(234,179,8,0.2)] group-hover:shadow-[0_15px_30px_rgba(234,179,8,0.5)] group-hover:scale-[1.03] flex items-center gap-2">
                        <span className="relative z-10 flex items-center gap-2">
                           Çekilişlere Git
                           <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* 5. SSS */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-10">
             <div>
               <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Sıkça Sorulan Sorular</h2>
               <p className="text-zinc-500 text-sm font-medium mt-2">Aklınıza takılan her şey burada</p>
             </div>
          </div>
          <div className="flex gap-8 border-b border-white/10 mb-10">
             <button onClick={() => setFaqTab('siralamalar')} className={`pb-4 text-sm font-extrabold transition-all border-b-2 uppercase tracking-wide ${faqTab === 'siralamalar' ? 'text-zinc-300 border-yellow-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>Sıralamalar</button>
             <button onClick={() => setFaqTab('oduller')} className={`pb-4 text-sm font-extrabold transition-all border-b-2 uppercase tracking-wide ${faqTab === 'oduller' ? 'text-zinc-300 border-yellow-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}>Ödüller</button>
          </div>
          <div className="space-y-2">
             <FaqItem question="724Bets Sıralamaları nedir ve nasıl çalışır?" answer="Sıralamalar, sadakat programımızın bir parçasıdır. Her rütbe, size daha iyi ödüller ve VIP avantajlar sunar. VIP kulübüne dahil olduğunuzda sadece oynamakla kalmaz, kazancınızı katlarsınız." />
             <FaqItem question="Daha yüksek bir rütbeye nasıl terfi edebilirim?" answer="Kumarhane veya spor bahislerinde oynayarak anında XP kazanırsınız. Belirli bir XP eşiğini geçtiğinizde sistem sizi otomatik olarak bir üst seviyeye taşır ve yeni rütbenizin ödülleri anında hesabınıza yansır." />
             <FaqItem question="Kazandığım rütbeyi kaybedebilir miyim?" answer="Asla! 724Bets'te ulaştığınız bir rütbeyi veya VIP seviyesini kaybetmezsiniz. Emeğiniz ve sadakatiniz bizimle kalıcı olarak ödüllendirilir." />
          </div>
        </section>

        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
