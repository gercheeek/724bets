import React from 'react';
import { X, Copy, Heart, Share2, ChevronRight, CheckCircle2 } from 'lucide-react';

interface BetShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    betId: string;
    username: string;
    type: 'Casino' | 'Spor';
}

const CASINO_GAMES = [
    'Wanted Dead or a Wild', 'Crash', 'Gates of Olympus', 'Sweet Bonanza', 
    'Sugar Rush', 'The Dog House Megaways', 'Starlight Princess',
    'Big Bass Splash', 'Book of Dead'
];

// Hash string to number for consistent randomness
const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

export const BetShareModal: React.FC<BetShareModalProps> = ({ isOpen, onClose, betId, username, type }) => {
    if (!isOpen) return null;

    // Pseudo-random generation based on betId for consistency
    const seed = hashString(betId);
    
    const gameName = type === 'Casino' 
        ? CASINO_GAMES[seed % CASINO_GAMES.length] 
        : 'Çoklu Bahis (Kombine)';

    // Random bet amount between 10.00 and 500.00
    const betAmount = ((seed % 50000) / 100 + 10).toFixed(2);
    
    // Random multiplier
    const rawMulti = (seed % 100) < 80 
        ? (seed % 500) / 100 + 1.1 
        : (seed % 5000) / 10 + 10;
    const multiplier = rawMulti.toFixed(2);
    
    // Payout (Profit in this context based on screenshot)
    const profitCrypto = (parseFloat(betAmount) * parseFloat(multiplier) * 0.0023).toFixed(6);
    const profitFiat = (parseFloat(betAmount) * parseFloat(multiplier)).toFixed(2);
    
    const dateStr = new Date().toLocaleDateString('tr-TR', {day: '2-digit', month: '2-digit', year: 'numeric'}) + ' ' + new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit', second: '2-digit'});

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div 
                className="bg-[#24262b] rounded-2xl shadow-2xl w-full max-w-[400px] flex flex-col font-sans"
                onClick={e => e.stopPropagation()}
            >
                
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.03]">
                    <span className="text-white font-bold text-[16px]">Bahis Kuponu</span>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full p-1">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col">
                    
                    {/* Top Profit Section */}
                    <div className="flex flex-col items-center mb-6">
                        <span className="text-slate-400 text-[14px] font-medium mb-1">Kar</span>
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <Share2 className="w-4 h-4 text-slate-400 absolute right-6 cursor-pointer hover:text-white" />
                            <div className="w-5 h-5 bg-[#00E5FF] rounded-full flex items-center justify-center shrink-0">
                                <span className="text-black text-[10px] font-black">₺</span>
                            </div>
                            <span className="text-[#00E5FF] text-[22px] font-black tracking-tight">{profitCrypto} TRY</span>
                        </div>
                        <span className="text-slate-500 text-[13px] font-medium">£{profitFiat}</span>
                    </div>
                    
                    {/* Bet & Payout Stats */}
                    <div className="flex justify-between items-center w-full px-4 mb-6">
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-slate-400 text-[12px] font-medium mb-1">Bahis Miktarı</span>
                            <span className="text-white text-[14px] font-bold">£{betAmount}</span>
                        </div>
                        <div className="flex flex-col items-center flex-1">
                            <span className="text-slate-400 text-[12px] font-medium mb-1">Ödeme</span>
                            <span className="text-white text-[14px] font-bold">{multiplier}x</span>
                        </div>
                    </div>

                    {/* Dotted Divider */}
                    <div className="w-full border-b-2 border-dashed border-white/5 mb-6"></div>

                    {/* User & Bet Info */}
                    <div className="flex items-center gap-3 mb-6 bg-white/[0.02] p-3 rounded-xl border border-white/[0.03]">
                        <div className="w-10 h-10 rounded-full bg-[#1C1E22] overflow-hidden shrink-0 flex items-center justify-center border border-white/5">
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${username}&backgroundColor=7e22ce`} alt={username} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 text-[12px]">
                                <span className="text-slate-300 font-semibold truncate">{username}</span>
                                <span className="text-slate-500 font-medium">On {dateStr}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <span>Bahis Kimliği:</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />
                                <span className="truncate">{betId}</span>
                                <Copy className="w-3 h-3 text-slate-500 cursor-pointer hover:text-white shrink-0 ml-1" />
                            </div>
                        </div>
                    </div>

                    {/* Game Link */}
                    <div className="flex items-center justify-between bg-[#1C1E22] p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-colors mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center font-black text-white text-[10px] uppercase shadow-inner text-center leading-tight p-1">
                                {gameName.split(' ')[0]}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-[14px]">{gameName}</span>
                                <span className="text-slate-500 text-[12px] font-medium">Orijinal Oyun</span>
                            </div>
                        </div>
                        <div className="flex items-center text-slate-400 text-[12px] font-medium group-hover:text-white transition-colors">
                            şimdi oyna <ChevronRight className="w-4 h-4 ml-0.5" />
                        </div>
                    </div>

                    {/* Footer Detail Link */}
                    <div className="w-full border-t border-white/[0.03] pt-4 mt-2">
                        <div className="flex items-center justify-between text-slate-300 text-[13px] font-semibold cursor-pointer hover:text-white transition-colors">
                            Oyun Detayı <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
