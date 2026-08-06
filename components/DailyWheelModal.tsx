import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SiteUser } from '../types';
import { X, Crown, Clock, Gift, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerGlobalToast } from './GlobalToaster';

interface DailyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteUser: SiteUser | null;
  onUpdateUser?: (u: SiteUser) => void;
}

const PRIZES = [
  { id: 1, name: "PAS", color: "#0A0D14", textColor: "#ef4444" },
  { id: 2, name: "10₺ BONUS", color: "#161B26", textColor: "#00E5FF" },
  { id: 3, name: "PAS", color: "#0A0D14", textColor: "#ef4444" },
  { id: 4, name: "25₺ BONUS", color: "#161B26", textColor: "#00E5FF" },
  { id: 5, name: "PAS", color: "#0A0D14", textColor: "#ef4444" },
  { id: 6, name: "10 FREESPIN", color: "#161B26", textColor: "#00E5FF" },
  { id: 7, name: "PAS", color: "#0A0D14", textColor: "#ef4444" },
  { id: 8, name: "50₺ BONUS", color: "#161B26", textColor: "#00E5FF" },
  { id: 9, name: "PAS", color: "#0A0D14", textColor: "#ef4444" },
  { id: 10, name: "10.000₺ İKRAMİYE", color: "#FFD700", textColor: "#000000" }
];

export const DailyWheelModal: React.FC<DailyWheelModalProps> = ({ isOpen, onClose, siteUser, onUpdateUser }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [cooldown, setCooldown] = useState<number>(0);
  const [showWin, setShowWin] = useState(false);
  const [wonPrize, setWonPrize] = useState<any>(null);

  const numPrizes = PRIZES.length;
  const anglePerSlice = 360 / numPrizes;

  useEffect(() => {
    if (isOpen) {
      const lastSpin = localStorage.getItem('last_daily_spin');
      if (lastSpin) {
        const elapsed = Date.now() - parseInt(lastSpin);
        const remaining = 24 * 60 * 60 * 1000 - elapsed;
        if (remaining > 0) {
          setCooldown(remaining);
        } else {
          setCooldown(0);
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleSpin = () => {
    if (!siteUser) {
        window.dispatchEvent(new CustomEvent('openLoginModal'));
        return;
    }
    if (cooldown > 0) return;
    if (isSpinning) return;

    setIsSpinning(true);
    setShowWin(false);

    // PSYCHOLOGICAL NEAR MISS LOGIC
    let targetIndex = 1; // 10₺ Bonus

    const baseSpins = 5; 
    
    // The prize at index 1 is at rotation: 360 - (1 * 36) = 324 degrees.
    // If the wheel stops at 324 degrees, index 1 is exactly at the top.
    const targetAngle = 360 - (targetIndex * anglePerSlice); 
    
    // Near Miss: Add a slight offset to make it look like it just passed the 10.000₺ jackpot (index 9).
    // The jackpot is at index 9. We want it to look close. Actually index 1 is next to index 0 (PAS) and index 2 (PAS).
    // Wait, PRIZES[0] is PAS, PRIZES[1] is 10₺, PRIZES[2] is PAS.
    // Let's just make it stop right on the edge of PAS.
    const nearMissOffset = anglePerSlice * 0.45; 
    
    const finalRotation = wheelRotation + (baseSpins * 360) + targetAngle + nearMissOffset;

    setWheelRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(PRIZES[targetIndex]);
      setShowWin(true);
      localStorage.setItem('last_daily_spin', Date.now().toString());
      setCooldown(24 * 60 * 60 * 1000);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#10b981', '#FFD700']
      });

      if (onUpdateUser) {
        onUpdateUser({ ...siteUser, balance: siteUser.balance + 10 });
      }

    }, 5000);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070A]/90 backdrop-blur-md p-4 animate-fade-in">
      {/* Glow Behind Modal */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="bg-[#0b0e14] border border-[#00E5FF]/30 w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.1)] relative flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-white/50 hover:text-white bg-black/50 p-2 rounded-full backdrop-blur-md border border-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Info & Psychology */}
        <div className="w-full md:w-5/12 p-8 flex flex-col justify-center relative border-b md:border-b-0 md:border-r border-[#00E5FF]/10 bg-gradient-to-br from-[#00E5FF]/5 to-transparent">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent"></div>
          
          <div className="flex items-center gap-2 mb-4">
             <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <Crown className="w-5 h-5 text-[#00E5FF]" />
             </div>
             <div>
                <h2 className="text-xl font-black text-white tracking-wider">VIP ŞANS ÇARKI</h2>
                <p className="text-[10px] text-[#00E5FF] font-bold tracking-[0.2em]">GÜNLÜK ÜCRETSİZ HAK</p>
             </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            Her gün giriş yap, <strong className="text-white">10.000₺ İkramiye</strong> kazanma şansını yakala! Sadık VIP üyelerimize özel günlük ödül havuzu.
          </p>

          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 shadow-inner relative overflow-hidden">
             <div className="absolute right-0 top-0 w-32 h-32 bg-[#00E5FF]/5 rounded-full blur-3xl"></div>
             <h3 className="text-xs font-bold text-gray-300 mb-3 flex items-center gap-2"><Gift className="w-4 h-4 text-[#00E5FF]" /> Olası Ödüller</h3>
             <ul className="text-xs text-gray-400 space-y-2 font-medium">
               <li className="flex justify-between items-center"><span className="text-zinc-300">10.000₺ VIP İkramiye</span> <span>%0.01</span></li>
               <li className="flex justify-between items-center"><span className="text-white">50₺ Bonus</span> <span>%5.00</span></li>
               <li className="flex justify-between items-center"><span className="text-white">25₺ Bonus</span> <span>%15.00</span></li>
               <li className="flex justify-between items-center"><span className="text-white">10 FreeSpin</span> <span>%25.00</span></li>
               <li className="flex justify-between items-center"><span className="text-red-400">PAS</span> <span>%54.99</span></li>
             </ul>
          </div>

          {siteUser ? (
             <div className="flex flex-col gap-2 relative z-10">
                 {cooldown > 0 ? (
                     <button disabled className="w-full py-4 rounded-xl bg-gray-900/50 border border-gray-700 text-gray-500 font-black tracking-widest text-sm flex flex-col items-center justify-center gap-1 cursor-not-allowed">
                         <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> YENİ HAK İÇİN BEKLEYİN</span>
                         <span className="text-lg text-white font-mono">{formatTime(cooldown)}</span>
                     </button>
                 ) : (
                     <button onClick={handleSpin} disabled={isSpinning} className={`w-full py-4 rounded-xl font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] ${isSpinning ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' : 'bg-[#00E5FF] hover:bg-[#00c9e0] text-black border border-[#00E5FF]/50'}`}>
                         <Sparkles className="w-5 h-5" /> {isSpinning ? 'ÇEVRİLİYOR...' : 'ŞANSINI DENE (ÜCRETSİZ)'}
                     </button>
                 )}
             </div>
          ) : (
             <button onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('openLoginModal')); }} className="w-full py-4 rounded-xl bg-[#00E5FF] hover:bg-[#00c9e0] text-black font-black tracking-[0.1em] uppercase transition-all shadow-[0_0_15px_rgba(0,229,255,0.4)] flex items-center justify-center gap-2 relative z-10">
                 GİRİŞ YAP VE ÇEVİR
             </button>
          )}
        </div>

        {/* Right Side: The Wheel */}
        <div className="w-full md:w-7/12 p-8 flex items-center justify-center relative min-h-[400px] overflow-hidden">
          {/* Cyberpunk background grid/lines */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Pointer */}
          <div className="absolute top-[20px] sm:top-[30px] left-1/2 -translate-x-1/2 z-30 drop-shadow-[0_5px_15px_rgba(0,229,255,0.8)]">
             <div className="w-8 h-12 bg-gradient-to-b from-white to-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,1)]" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
          </div>

          <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full p-2 bg-gradient-to-b from-[#00E5FF]/30 to-transparent shadow-[0_0_50px_rgba(0,229,255,0.2)] flex items-center justify-center z-10">
            
            <div className="absolute inset-0 rounded-full border-4 border-[#161B26] z-20 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]"></div>

            <div 
              className="w-full h-full rounded-full relative overflow-hidden transition-transform ease-[cubic-bezier(0.1,0.7,0.1,1)] z-10"
              style={{ 
                transform: `rotate(${wheelRotation}deg)`, 
                transitionDuration: isSpinning ? '5s' : '0s' 
              }}
            >
               {/* Drawing Slices with Conic Gradient */}
               <div className="absolute inset-0 rounded-full" style={{
                 background: `conic-gradient(
                   ${PRIZES.map((p, i) => `${p.color} ${i * anglePerSlice}deg ${(i + 1) * anglePerSlice}deg`).join(', ')}
                 )`
               }}></div>

               {/* Overlay Lines and Text */}
               {PRIZES.map((prize, i) => {
                  const rotation = i * anglePerSlice;
                  const isJackpot = prize.name.includes("10.000₺");
                  // Rotate text so it sits in the middle of the slice.
                  // slice starts at i*angle, ends at (i+1)*angle. Center is i*angle + angle/2.
                  // We rotate the container by that center angle, and push text up.
                  const sliceCenter = rotation + (anglePerSlice / 2);

                  return (
                    <div 
                      key={i} 
                      className="absolute inset-0 pointer-events-none"
                      style={{ transform: `rotate(${sliceCenter}deg)` }}
                    >
                      {/* Line Separator */}
                      <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-[#00E5FF]/20 origin-bottom" style={{ transform: `rotate(-${anglePerSlice/2}deg)` }}></div>
                      
                      {/* Text */}
                      <div className="absolute top-[20px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                        {isJackpot && <div className="absolute -inset-4 bg-yellow-500/20 blur-md rounded-full"></div>}
                        <span 
                          className={`font-black uppercase drop-shadow-md relative z-10 ${isJackpot ? 'text-zinc-300 text-[14px]' : 'text-[11px]'}`}
                          style={{ color: prize.textColor }}
                        >
                           {prize.name}
                        </span>
                      </div>
                    </div>
                  );
               })}
            </div>
            
            {/* Center Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0A0C10] border-4 border-[#00E5FF] z-30 shadow-[0_0_20px_rgba(0,229,255,0.6)] flex items-center justify-center">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-[#00E5FF] drop-shadow-[0_0_5px_rgba(0,229,255,1)]" />
            </div>

          </div>

          {/* Win Overlay */}
          {showWin && wonPrize && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl animate-fade-in p-6">
                <div className="bg-[#0b0e14] border border-[#00E5FF]/40 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(0,229,255,0.3)] max-w-sm w-full relative">
                    <button onClick={() => setShowWin(false)} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X className="w-5 h-5"/></button>
                    <div className="w-20 h-20 mx-auto bg-[#00E5FF]/10 rounded-full flex items-center justify-center border border-[#00E5FF]/30 mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                        <Gift className="w-10 h-10 text-[#00E5FF]" />
                    </div>
                    <h3 className="text-[#00E5FF] font-black tracking-widest text-sm mb-1 uppercase">TEBRİKLER</h3>
                    <p className="text-3xl font-black text-white mb-6 drop-shadow-md">{wonPrize.name}</p>
                    <p className="text-gray-400 text-xs mb-6">Ödülünüz hesabınıza başarıyla tanımlandı. Yarın tekrar çevirmeyi unutmayın!</p>
                    <button onClick={() => setShowWin(false)} className="w-full py-3 rounded-xl bg-[#00E5FF] text-black font-black tracking-widest uppercase hover:bg-[#00c9e0] transition-colors shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                        DEVAM ET
                    </button>
                </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
