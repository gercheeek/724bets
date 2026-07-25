import React from 'react';
import { Mail, Send, Twitter, Instagram, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0A0D14] border-t border-white/5 py-12 px-6 lg:px-12 relative z-10 font-sans">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 mb-16">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-5 flex flex-col items-start">
             {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
              <span className="font-extrabold text-3xl tracking-tight lowercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
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
            <p className="text-zinc-400 text-[13px] mb-8 leading-relaxed max-w-sm">
              En iyi kripto casino seçenekleri arasında tanınan bir marka olan 724bets, RBGAMING N.V. Firmasının marka adıdır Firma Adresi: Zuikertuintjeweg Z/N, Willemstad, Curacao
            </p>
            
            <div className="flex flex-col gap-3 mb-8">
              <a href="mailto:support@724bets.com" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px]">
                <Mail className="w-4 h-4 text-[#00ff88]" /> support@724bets.com
              </a>
              <a href="mailto:marketing@724bets.com" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px]">
                <Mail className="w-4 h-4 text-[#a855f7]" /> marketing@724bets.com
              </a>
            </div>

            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#00ff88]/50 transition-all hover:bg-[#00ff88]/10 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                <Send className="w-4 h-4" /> {/* Telegram */}
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#00ff88]/50 transition-all hover:bg-[#00ff88]/10 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                <Twitter className="w-4 h-4" /> {/* X */}
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-[#00ff88]/50 transition-all hover:bg-[#00ff88]/10 hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                <Instagram className="w-4 h-4" /> {/* Instagram */}
              </a>
            </div>
          </div>

          {/* Col 2: 724BETS */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-white text-[13px] font-bold tracking-wider mb-6 uppercase">724BETS</h4>
            <div className="flex flex-col gap-4">
              {['Ödüller', 'Promosyonlar', 'Kanıtlanabilir Şekilde Adil', 'Bize Ulaşın'].map(link => (
                <a key={link} href="#" className="text-zinc-400 text-[13px] hover:text-[#00ff88] transition-colors">{link}</a>
              ))}
            </div>
          </div>

          {/* Col 3: KAYNAKLAR */}
          <div className="lg:col-span-2 flex flex-col mt-10 lg:mt-0">
            <h4 className="text-white text-[13px] font-bold tracking-wider mb-6 uppercase">KAYNAKLAR</h4>
            <div className="flex flex-col gap-4">
              {['Sorumlu Kumar', 'Erişilebilirlik', 'Etik Kuralları', 'Şikayet Politikası'].map(link => (
                <a key={link} href="#" className="text-zinc-400 text-[13px] hover:text-[#00ff88] transition-colors">{link}</a>
              ))}
            </div>
          </div>

          {/* Col 4: YASAL */}
          <div className="lg:col-span-3 flex flex-col mt-10 lg:mt-0">
            <h4 className="text-white text-[13px] font-bold tracking-wider mb-6 uppercase">YASAL</h4>
            <div className="flex flex-col gap-4">
              {['KPAM', 'Bahis Merkezi Kuralları', 'Çerez Politikası', 'Yayıncı Politikası', 'Feragatname', 'Gizlilik Politikası', 'Hizmet Şartları'].map(link => (
                <a key={link} href="#" className="text-zinc-400 text-[13px] hover:text-[#00ff88] transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-8"></div>

        {/* Middle Section: Payment Methods */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center flex-wrap gap-4 flex-1">
             {/* Yellow Interac-like box */}
             <div className="w-10 h-10 bg-[#FFB800] rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-black font-extrabold text-[10px] leading-none transform -rotate-45">BANK<br/>TR</span>
             </div>
             
             {['btc', 'eth', 'trx', 'ltc', 'sol', 'usdt', 'xrp', 'bnb'].map((coin) => (
                 <div key={coin} className="w-10 h-10 bg-[#151922] rounded-full border border-white/5 flex items-center justify-center hover:border-emerald-500/50 hover:-translate-y-1 transition-all cursor-pointer shadow-sm overflow-hidden flex-shrink-0">
                   <img src={`/images/coins/${coin}.png`} alt={coin} className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.style.display='none' }} />
                 </div>
              ))}
              
              <div className="w-10 h-10 bg-[#0052FF] rounded-full flex items-center justify-center hover:-translate-y-1 transition-all cursor-pointer shadow-sm overflow-hidden flex-shrink-0">
                <span className="text-white font-bold text-lg leading-none">O</span>
              </div>
              <div className="w-10 h-10 bg-[#0033AD] rounded-full flex items-center justify-center hover:-translate-y-1 transition-all cursor-pointer shadow-sm overflow-hidden flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              </div>

              <span className="text-zinc-500 text-[13px] ml-2 mt-2 md:mt-0">ve daha fazlası...</span>
          </div>
        </div>

        {/* Bottom Section: Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Card 1 */}
           <div className="bg-[#151922] rounded-xl border border-white/5 p-4 md:p-5 flex items-center gap-4 hover:border-white/10 transition-colors">
             <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center text-white font-black text-sm shrink-0">18+</div>
             <span className="text-zinc-300 text-sm font-medium">Sorumlu Kumar</span>
           </div>
           
           {/* Card 2 */}
           <div className="bg-[#151922] rounded-xl border border-white/5 p-4 md:p-5 flex items-center gap-4 hover:border-white/10 transition-colors">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
               <Shield className="w-5 h-5 text-[#151922]" />
             </div>
             <span className="text-zinc-300 text-sm font-medium">Kanıtlanabilir Şekilde Adil</span>
           </div>

           {/* Card 3 */}
           <div className="bg-[#151922] rounded-xl border border-white/5 p-4 md:p-5 flex items-center gap-4 hover:border-white/10 transition-colors cursor-pointer group">
             {/* Fake License Icon */}
             <div className="w-10 h-10 rounded bg-gradient-to-br from-[#FF3B30] to-[#FF9500] flex flex-col items-center justify-center text-white leading-none relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                <span className="text-[20px] font-bold">C</span>
                <span className="text-[5px] uppercase font-bold mt-1 tracking-widest absolute bottom-1">Valid</span>
             </div>
             <div className="flex flex-col">
                <span className="text-zinc-300 text-sm font-medium">Lisanslı</span>
                <span className="text-zinc-500 text-[10px]">Click to verify</span>
             </div>
           </div>

           {/* Card 4 */}
           <div className="bg-[#151922] rounded-xl border border-white/5 p-4 md:p-5 flex items-center gap-4 hover:border-white/10 transition-colors">
             {/* GameCheck Icon */}
             <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-[#151922] flex items-center justify-center">
                   <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </div>
                </div>
             </div>
             <span className="text-zinc-300 text-sm font-bold tracking-widest">GAME<span className="font-light text-zinc-500">CHECK</span></span>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
