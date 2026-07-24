import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, ExternalLink, Link as LinkIcon, Diamond, ArrowRight, Shield } from 'lucide-react';

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
  payoutRaw?: number;
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

const BetDetailsModal: React.FC<Props> = ({ data, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] animate-fade-in">
      {/* Modal Container: #26293E is roughly the dark purple-gray from screenshot */}
      <div className="bg-[#272B3E] w-full max-w-[440px] rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all my-auto border border-white/5 font-['Inter',sans-serif]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 relative z-10">
          <h2 className="text-white font-medium text-[15px]">Bahis Yap</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col relative z-10">
          
          {/* Game Info & User Header */}
          <div className="flex gap-4 items-start mb-6">
            <div className="w-[84px] h-[112px] rounded-lg overflow-hidden shrink-0 bg-[#0F121A]">
              <img src={data.image} alt={data.game} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex flex-col flex-1 pt-1">
              <h3 className="text-white font-medium text-[17px] leading-tight mb-0.5">{data.game}</h3>
              <p className="text-gray-400 text-[13px] mb-3">{data.provider}</p>
              
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-gray-400 text-[13px]">Bahis Kimliği:</span>
                <span className="text-gray-300 text-[13px] font-medium truncate max-w-[110px]">{data.id}</span>
                <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-white cursor-pointer ml-1" />
                <LinkIcon className="w-3.5 h-3.5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
              
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-gray-400 text-[13px]">Bahis yapan</span>
                <div className="flex items-center gap-1">
                  <Diamond className={`w-3.5 h-3.5 text-blue-400`} fill="currentColor" />
                  <span className="text-gray-300 text-[13px] font-medium">{data.user.replace('Üye #', 'user')}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 text-[13px]">tarihinde</span>
                <span className="text-gray-400 text-[13px]">{data.time}</span>
              </div>
            </div>
          </div>

          {/* Logo Divider (Rainbet in screenshot, using 724bets) */}
          <div className="flex items-center justify-center mb-5">
            <span className="text-white/30 font-black tracking-widest text-lg lowercase italic">724bets</span>
          </div>

          {/* Amounts Table */}
          <div className="bg-[#2E3349] rounded-lg overflow-hidden mb-5">
             <div className="grid grid-cols-3 border-b border-[#26293E]">
                <div className="text-center py-2.5">
                    <span className="text-gray-300 text-[13px] font-medium">Miktar</span>
                </div>
                <div className="text-center py-2.5">
                    <span className="text-gray-300 text-[13px] font-medium">Çarpan</span>
                </div>
                <div className="text-center py-2.5">
                    <span className="text-gray-300 text-[13px] font-medium">Ödeme</span>
                </div>
             </div>
             <div className="grid grid-cols-3 bg-[#333852]">
                <div className="text-center py-3">
                    <span className="text-gray-300 text-[13px] font-medium">{data.betAmount}</span>
                </div>
                <div className="text-center py-3">
                    <span className="text-gray-300 text-[13px] font-medium">{data.multiplier}</span>
                </div>
                <div className="text-center py-3">
                    <span className="text-gray-300 text-[13px] font-medium">{data.payout}</span>
                </div>
             </div>
          </div>

          {/* Large Multiplier Area */}
          <div className="relative bg-[#1A1D29] rounded-xl flex items-center justify-center py-8 mb-5 border border-white/5 shadow-inner">
             {/* Badge floating top center */}
             <div className="absolute -top-3.5 bg-[#1F2333] border border-[#2E3349] rounded-full px-4 py-1 text-[#00E676] text-sm font-semibold shadow-md">
                 {data.payout}
             </div>
             
             {/* Giant Multiplier */}
             <span className="text-[#00E676] text-[48px] font-black tracking-tight">{data.multiplier}</span>
          </div>

          {/* Hedef Çarpan */}
          <div className="flex flex-col items-center justify-center gap-2 mb-2">
              <span className="text-gray-300 text-[13px]">Hedef Çarpan</span>
              <div className="bg-[#1F2333] border border-white/5 rounded-md px-6 py-2 text-gray-300 text-[13px] font-medium min-w-[100px] text-center">
                  2.00
              </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#2E3349]/50 border-t border-[#26293E] p-4 flex items-center justify-between cursor-pointer hover:bg-[#2E3349] transition-colors group">
            <span className="text-gray-300 text-[13px] font-medium">Kanıtlanabilir Şekilde Adil</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </div>

      </div>
    </div>,
    document.body
  );
};

export default BetDetailsModal;
