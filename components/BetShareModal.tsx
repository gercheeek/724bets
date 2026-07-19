import React from 'react';
import { X, Copy, Share2, Star } from 'lucide-react';

interface BetShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    betId: string;
    username: string;
    type: 'Casino' | 'Spor';
}

const CASINO_GAMES = [
    'Wanted Dead or a Wild', 'Gates of Olympus', 'Sweet Bonanza', 
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

    // Random bet amount between 10.00 and 5000.00
    const betAmount = ((seed % 500000) / 100 + 10).toFixed(2);
    
    // Random multiplier (e.g. 1.50x to 5000x)
    const rawMulti = (seed % 100) < 80 
        ? (seed % 500) / 100 + 1.1 
        : (seed % 50000) / 10 + 10;
    const multiplier = rawMulti.toFixed(2);
    
    // Payout
    const payout = (parseFloat(betAmount) * parseFloat(multiplier)).toFixed(2);
    
    const dateStr = new Date().toLocaleDateString('tr-TR') + ' saat ' + new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1a2c38] rounded-lg shadow-2xl w-full max-w-md border border-[#2f4553] overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-[#1f3643] border-b border-[#2f4553]">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#0f1923] p-1.5 rounded">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <span className="text-white font-bold text-lg tracking-wide">Bahis</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-white mb-2 text-center">{gameName}</h2>
                    
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 text-sm">Kullanıcı:</span>
                        <div className="flex items-center gap-1">
                            <Star size={14} className="text-[#00e701] fill-[#00e701]" />
                            <span className="text-white font-medium">{username}</span>
                        </div>
                    </div>
                    
                    <div className="text-gray-400 text-sm mb-4">
                        {dateStr}
                    </div>

                    <div className="flex items-center gap-3 text-gray-400 text-sm mb-6">
                        <span>Bahis No: {betId}</span>
                        <button className="hover:text-white transition-colors" title="Kopyala"><Copy size={14} /></button>
                        <button className="hover:text-white transition-colors" title="Paylaş"><Share2 size={14} /></button>
                    </div>

                    {/* Logo Divider */}
                    <div className="w-full relative flex justify-center items-center mb-6">
                        <div className="absolute w-full h-[1px] bg-[#2f4553]"></div>
                        <div className="bg-[#1a2c38] px-4 relative z-10 text-white font-bold italic text-xl tracking-wider">
                            724BETS
                        </div>
                    </div>

                    {/* Stats Box */}
                    <div className="w-full bg-[#0f1923] rounded flex justify-between p-4 mb-6">
                        <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs mb-1 font-medium">Bahis</span>
                            <div className="flex items-center gap-1 text-white font-mono font-medium">
                                {betAmount} <span className="text-[#ff1f44] text-xs">💎</span>
                            </div>
                        </div>
                        <div className="w-[1px] bg-[#2f4553]"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs mb-1 font-medium">Çarpan</span>
                            <span className="text-white font-mono font-medium">{multiplier}×</span>
                        </div>
                        <div className="w-[1px] bg-[#2f4553]"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-xs mb-1 font-medium">Ödeme</span>
                            <div className="flex items-center gap-1 text-[#00e701] font-mono font-medium">
                                {payout} <span className="text-[#ff1f44] text-xs">💎</span>
                            </div>
                        </div>
                    </div>

                    {/* Play Button */}
                    <button className="w-full bg-[#2f4553] hover:bg-[#3d5668] transition-colors text-white font-semibold py-3 rounded text-sm mb-3">
                        {gameName} oyununu oyna
                    </button>
                    
                    {/* Replay Button */}
                    <button className="w-[60%] bg-[#2f4553] hover:bg-[#3d5668] transition-colors text-white font-semibold py-2 rounded text-sm flex items-center justify-center gap-2">
                        Tekrarı Görüntüle 
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
