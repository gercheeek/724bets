import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, ExternalLink, Link as LinkIcon, Diamond, Info } from 'lucide-react';

export interface BetDetailData {
  id: string;
  game: string;
  provider: string;
  image: string;
  user: string;
  userRank: number;
  time: string;
  betAmount: string;
  multiplier: string;
  payout: string;
  type: 'slot' | 'blackjack' | 'keno' | 'dice';
  cards?: { player: string[], dealer: string[], playerScore: number, dealerScore: number };
  kenoNumbers?: { selected: number[], hits: number[] };
  diceRoll?: number;
  rules?: string;
  path?: string;
}

interface Props {
  data: BetDetailData;
  onClose: () => void;
}

const getRankColor = (rank: number) => {
  if (rank > 80) return 'text-yellow-400';
  if (rank > 50) return 'text-gray-300';
  if (rank > 20) return 'text-[#CD7F32]';
  return 'text-blue-400';
};

const BetDetailsModal: React.FC<Props> = ({ data, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [siteUser, setSiteUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('site_current_member') || localStorage.getItem('siteUser');
    if (userStr) {
      try {
        setSiteUser(JSON.parse(userStr));
      } catch (e) {
        setSiteUser(true); // fallback
      }
    }
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1D212B] w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden border border-[#2A2E3D] flex flex-col transform transition-all my-auto relative">
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.1)] pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2E3D] relative z-10">
          <h2 className="text-white font-semibold text-base">Bahis Detayı</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-5 relative z-10">
          
          {/* Game Info & User */}
          <div className="flex gap-6">
            <div className="w-28 h-32 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.5)] bg-[#0F121A]">
              <img src={data.image} alt={data.game} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col flex-1 justify-center py-2">
              <h3 className="text-white font-black text-2xl leading-tight tracking-wide">{data.game}</h3>
              <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">{data.provider}</p>
              
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-gray-500 text-xs w-20">Bahis Kimliği:</span>
                <span className="text-gray-300 text-xs font-mono truncate max-w-[100px]">{data.id}</span>
                <Copy className="w-3 h-3 text-gray-500 hover:text-white cursor-pointer" />
                <LinkIcon className="w-3 h-3 text-gray-500 hover:text-white cursor-pointer ml-1" />
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-gray-500 text-xs w-20">Bahis yapan</span>
                <div className="flex items-center gap-1">
                  <Diamond className={`w-3 h-3 ${getRankColor(data.userRank)}`} fill="currentColor" />
                  <span className="text-gray-300 text-xs font-bold">{data.user}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs w-20">Tarih:</span>
                <span className="text-gray-400 text-xs">{data.time}</span>
              </div>
            </div>
          </div>

          {/* Logo Divider */}
          <div className="flex items-center justify-center -my-1">
            <span className="text-gray-600 font-black tracking-widest text-lg opacity-40 lowercase">724bets</span>
          </div>

          {/* Amounts Table */}
          <div className="bg-[#151821] rounded-xl border border-[#2A2E3D] p-1 flex">
            <div className="flex-1 flex flex-col items-center justify-center p-2 border-r border-[#2A2E3D]/50">
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Miktar</span>
              <span className="text-gray-300 text-sm font-bold">{data.betAmount}</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-2 border-r border-[#2A2E3D]/50">
              <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Çarpan</span>
              <span className="text-white text-sm font-bold">{data.multiplier}</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-2 bg-[#06b6d4]/5 rounded-r-lg">
              <span className="text-[#06b6d4]/70 text-[10px] uppercase font-bold tracking-wider mb-1">Kazanç</span>
              <span className="text-[#06b6d4] text-sm font-black drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">{data.payout}</span>
            </div>
          </div>

          {/* Dynamic Visual Area */}
          <div className="w-full flex items-center justify-center min-h-[120px]">
            {/* BLACKJACK VISUAL */}
            {data.type === 'blackjack' && data.cards && (
              <div className="flex flex-col items-center gap-3 w-full bg-[#151821] py-4 rounded-xl border border-[#2A2E3D]">
                {/* Dealer */}
                <div className="flex gap-2 relative">
                   <div className="absolute -left-10 top-1/2 -translate-y-1/2 bg-[#2A2E3D] text-gray-300 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                     {data.cards.dealerScore}
                   </div>
                   {data.cards.dealer.map((card, i) => (
                     <div key={i} className="w-12 h-16 bg-white rounded flex items-center justify-center text-lg font-black shadow-md border border-gray-200">
                       <span className={card.includes('♥') || card.includes('♦') ? 'text-red-500' : 'text-black'}>{card}</span>
                     </div>
                   ))}
                </div>
                <div className="bg-[#2A2E3D] text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded">VS</div>
                {/* Player */}
                <div className="flex gap-2 relative">
                   <div className="absolute -left-10 top-1/2 -translate-y-1/2 bg-[#06b6d4]/20 text-[#06b6d4] border border-[#06b6d4]/30 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                     {data.cards.playerScore}
                   </div>
                   {data.cards.player.map((card, i) => (
                     <div key={i} className="w-12 h-16 bg-white rounded flex items-center justify-center text-lg font-black shadow-md border border-gray-200">
                       <span className={card.includes('♥') || card.includes('♦') ? 'text-red-500' : 'text-black'}>{card}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* KENO VISUAL */}
            {data.type === 'keno' && data.kenoNumbers && (
              <div className="w-full grid grid-cols-8 gap-1 p-3 bg-[#151821] rounded-xl border border-[#2A2E3D]">
                 {Array.from({ length: 40 }).map((_, i) => {
                   const num = i + 1;
                   const isSelected = data.kenoNumbers!.selected.includes(num);
                   const isHit = data.kenoNumbers!.hits.includes(num);
                   
                   let bg = "bg-[#1D212B] text-gray-500";
                   if (isSelected && isHit) bg = "bg-[#06b6d4] text-black shadow-[0_0_8px_rgba(0,255,163,0.5)]";
                   else if (isSelected) bg = "bg-[#ef3434] text-white";
                   else if (isHit) bg = "bg-purple-500/20 text-purple-400 border border-purple-500/30";
                   
                   return (
                     <div key={num} className={`aspect-square flex items-center justify-center rounded-[4px] text-[10px] font-bold transition-all ${bg}`}>
                       {num}
                     </div>
                   );
                 })}
              </div>
            )}

            {/* SLOT / DEFAULT VISUAL */}
            {data.type === 'slot' && (
               <div className="w-full h-[120px] rounded-xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-[#2A2E3D] flex items-center justify-center">
                  <img src={data.image} className="absolute inset-0 w-full h-full object-cover blur-[2px] opacity-30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151821] via-transparent to-transparent"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-[#06b6d4] font-black text-4xl drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]">{data.multiplier}</span>
                    <span className="text-gray-400 text-xs font-bold tracking-widest mt-1 uppercase">KAZANÇ ÇARPANI</span>
                  </div>
               </div>
            )}
          </div>

          {/* Game Rules Section */}
          {data.rules && (
            <div className="bg-[#050505] rounded-lg p-3 flex items-start gap-3 border border-white/5">
              <Info className="w-4 h-4 text-[#06b6d4] shrink-0 mt-0.5" />
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {data.rules}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-1">
            {!siteUser ? (
              <button 
                onClick={() => {
                  onClose();
                  // Dispatch custom event to open auth modal to 'register'
                  const event = new CustomEvent('openAuthModal', { detail: 'register' });
                  window.dispatchEvent(event);
                }}
                className="flex-1 bg-[#10b981] hover:bg-[#00E676] text-black font-black text-sm px-4 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                KAYIT OL VE OYNA
              </button>
            ) : siteUser.balance <= 0 ? (
              <button 
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new Event('openDepositModal'));
                }}
                className="flex-1 bg-[#10b981] hover:bg-[#00E676] text-black font-black text-sm px-4 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                BAKİYE YÜKLE
              </button>
            ) : (
              <button 
                onClick={() => {
                  onClose();
                  if (data.path) {
                    window.history.pushState(null, '', `/${data.path}`);
                    window.dispatchEvent(new Event('popstate'));
                  }
                }}
                className="flex-1 bg-[#06b6d4] hover:bg-[#00E676] text-black font-black text-sm px-4 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                ŞİMDİ OYNA
              </button>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#151821] px-5 py-3 border-t border-[#2A2E3D] flex justify-between items-center cursor-pointer hover:bg-[#111111] transition-colors group">
          <span className="text-gray-400 text-xs font-semibold group-hover:text-gray-300">Kanıtlanabilir Şekilde Adil (Provably Fair)</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300" />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BetDetailsModal;
