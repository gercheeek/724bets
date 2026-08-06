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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#0A0D14]/90 backdrop-blur-[2px] animate-fade-in">
      {/* Modal Container: Flat dark theme */}
      <div className="bg-[#181B21] w-full max-w-[440px] rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all my-auto border border-white/5 font-['Inter',sans-serif]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 relative z-10">
          <h2 className="text-white font-medium text-[15px]">Bahis Yap</h2>
          <button onClick={onClose} className="btn-icon-modern !w-8 !h-8 !rounded-lg">
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
          
          {/* Game Rules / Multipliers explanation */}
          {data.rules && (
            <div className="mb-5 p-3.5 bg-[#0A0D14] rounded-xl border border-white/5 text-[12px] text-gray-400 leading-relaxed font-sans">
              <span className="font-bold text-[#00E5FF] block mb-1">Kurallar & Çarpanlar</span>
              {data.rules}
            </div>
          )}

          {/* Logo Divider (Rainbet in screenshot, using 724bets) */}
          <div className="flex items-center justify-center mb-5">
            <span className="text-white/30 font-black tracking-widest text-lg lowercase italic">724bets</span>
          </div>

          {/* Amounts Table */}
          <div className="bg-[#20242D] rounded-lg overflow-hidden mb-5">
             <div className="grid grid-cols-3 border-b border-white/5">
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
             <div className="grid grid-cols-3 bg-white/5">
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
          <div className="relative bg-[#0A0D14] rounded-xl flex items-center justify-center py-8 mb-5 border border-white/5 shadow-inner">
             {/* Badge floating top center */}
             <div className="absolute -top-3.5 bg-[#20242D] border border-white/5 rounded-full px-4 py-1 text-[#00E5FF] text-sm font-semibold shadow-md">
                 {data.payout}
             </div>
             
             {/* Giant Multiplier */}
             <span className="text-[#00E5FF] text-[48px] font-black tracking-tight">{data.multiplier}</span>
          </div>

          {/* Play Action Area */}
          <div className="flex flex-col gap-3 mt-4 mb-2">
              <button 
                onClick={onClose}
                className="w-full bg-[#00E5FF] hover:brightness-110 text-[#0A0D14] font-black text-[15px] uppercase tracking-wider py-4 rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                  {data.type === 'slot' || data.type === 'keno' ? 'HEMEN OYNA' : 'BAHİS AL'}
                  <ExternalLink className="w-5 h-5" />
              </button>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-[#20242D]/50 border-t border-white/5 p-4 flex items-center justify-between cursor-pointer hover:bg-[#20242D] transition-colors group">
            <span className="text-gray-300 text-[13px] font-medium">Kanıtlanabilir Şekilde Adil</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
        </div>

      </div>
    </div>,
    document.body
  );
};

export default BetDetailsModal;
