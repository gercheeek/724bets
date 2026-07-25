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



      </div>
    </footer>
  );
};

export default Footer;
