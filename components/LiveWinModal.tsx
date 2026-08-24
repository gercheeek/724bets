import React, { useEffect } from 'react';
import { X, Copy, ExternalLink } from 'lucide-react';
import { LiveWin } from '../utils/liveWinsData';
import { createPortal } from 'react-dom';

interface LiveWinModalProps {
    win: LiveWin;
    onClose: () => void;
}

const LiveWinModal: React.FC<LiveWinModalProps> = ({ win, onClose }) => {
    // Generate realistic mock data for the modal based on the win - Memoized to prevent flickering on re-renders
    const { betAmount, multiplier, dateStr, timeStr } = React.useMemo(() => {
        const amt = win.amount > 500 ? (win.amount / (Math.random() * 50 + 10)) : (win.amount / (Math.random() * 5 + 1.1));
        const mult = win.amount / amt;
        const now = new Date();
        return {
            betAmount: amt,
            multiplier: mult,
            dateStr: now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }),
            timeStr: now.toLocaleTimeString('tr-TR', { hour: 'numeric', minute: '2-digit', hour12: true })
        };
    }, [win.id, win.amount]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const modalContent = (
        <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Modal */}
            <div className="relative w-full max-w-[420px] bg-[#1a1c24] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#15171d]">
                    <h3 className="text-white font-bold text-lg">Bahis Detayı</h3>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col gap-5">
                    {/* Game Info Row */}
                    <div className="flex gap-4">
                        <div className="w-[85px] h-[114px] rounded-lg overflow-hidden shrink-0 shadow-md">
                            {win.image.startsWith('linear-gradient') ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-2 relative" style={{ background: win.image }}>
                                    <h4 className="text-white font-black text-sm tracking-wide text-center drop-shadow-md relative z-10 uppercase">{win.gameName}</h4>
                                </div>
                            ) : (
                                <img src={win.image} alt={win.gameName} className="w-full h-full object-cover" />
                            )}
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                            <div>
                                <h4 className="text-white font-bold text-base leading-tight">{win.gameName}</h4>
                                <span className="text-zinc-400 text-xs font-semibold uppercase">{win.provider}</span>
                            </div>
                            
                            <div className="flex flex-col gap-1 mt-1">
                                <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                                    <span className="text-zinc-500 w-20">Bahis Kimliği:</span>
                                    <span className="font-mono text-zinc-300 truncate max-w-[80px]">{win.id.replace('win-', '')}</span>
                                    <Copy size={12} className="text-zinc-500 cursor-pointer hover:text-white" />
                                    <ExternalLink size={12} className="text-zinc-500 cursor-pointer hover:text-white" />
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                                    <span className="text-zinc-500 w-20">Bahis yapan:</span>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2.5 h-2.5 bg-[#d6a863]/20 flex items-center justify-center rounded-[2px] rotate-45 border border-[#d6a863]/50">
                                            <span className="-rotate-45 text-[6px] text-[#d6a863]">♦</span>
                                        </div>
                                        <span className="font-semibold text-white">{win.username}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                                    <span className="text-zinc-500 w-20">Tarihinde:</span>
                                    <span>{dateStr} da {timeStr}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo Watermark */}
                    <div className="flex justify-center my-1 opacity-50">
                         <span className="text-white font-black tracking-widest italic text-lg drop-shadow-md">724bets</span>
                    </div>

                    {/* Stats Table */}
                    <div className="w-full bg-[#111318] rounded-xl border border-white/5 overflow-hidden">
                        <div className="grid grid-cols-3 p-3 border-b border-white/5">
                            <span className="text-zinc-400 text-[11px] font-bold text-center">Miktar</span>
                            <span className="text-zinc-400 text-[11px] font-bold text-center">Çarpan</span>
                            <span className="text-zinc-400 text-[11px] font-bold text-center">Ödeme</span>
                        </div>
                        <div className="grid grid-cols-3 p-3 bg-white/[0.02]">
                            <span className="text-white text-sm font-bold text-center">₺{betAmount.toFixed(2)}</span>
                            <span className="text-emerald-400 text-sm font-bold text-center">{multiplier.toFixed(2)}x</span>
                            <span className="text-white text-sm font-bold text-center">₺{win.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default LiveWinModal;
