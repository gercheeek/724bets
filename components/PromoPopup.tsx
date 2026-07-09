import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { WelcomePopupConfig } from '../types';

interface PromoPopupProps {
    onClose: () => void;
    config: WelcomePopupConfig;
}

const PromoPopup: React.FC<PromoPopupProps> = ({ onClose, config }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Animate in
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 350);
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{
                background: 'rgba(0,0,0,0.88)',
                backdropFilter: 'blur(8px)',
                transition: 'opacity 0.35s ease',
                opacity: visible ? 1 : 0,
            }}
            onClick={handleClose}
        >
            {/* Popup card */}
            <div
                className="relative w-full max-w-sm md:max-w-lg rounded-lg overflow-hidden"
                style={{
                    background: 'linear-gradient(145deg, #020804 0%, #0c0a00 50%, #020804 100%)',
                    border: '2px solid rgba(240,185,11,0.7)',
                    boxShadow: '0 0 80px rgba(240,185,11,0.3), 0 0 200px rgba(240,185,11,0.1)',
                    transform: visible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
                    transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Top shimmer */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(90deg, transparent, #f0b90b, transparent)',
                }} />

                {/* Glow orbs */}
                <div style={{
                    position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)',
                    width: '350px', height: '350px', borderRadius: '50%',
                    background: 'rgba(240,185,11,0.08)', filter: 'blur(60px)', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', left: '-40px', top: '30%',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'rgba(240,185,11,0.05)', filter: 'blur(40px)', pointerEvents: 'none',
                }} />

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-[50] w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative z-10 p-6 md:p-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full text-black animate-pulse"
                            style={{ background: 'linear-gradient(90deg, #f0b90b, #ffd357)' }}>
                            🥇 ANA SPONSORUMUZ
                        </span>
                        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border text-amber-400"
                            style={{ borderColor: 'rgba(240,185,11,0.4)' }}>
                            🟢 CANLI
                        </span>
                    </div>

                    {/* Logo + Brand name */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #f0b90b, #d9a508)', boxShadow: '0 0 30px rgba(240,185,11,0.5)' }}>
                            <span className="text-black font-black text-[10px] md:text-xs uppercase tracking-tighter leading-tight text-center">724<br />BETS</span>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none mb-1 shadow-sm"
                                style={{ color: '#f0b90b' }}>
                                {config.title}
                            </h2>
                            <p className="text-zinc-400 text-xs md:text-sm font-bold">{config.subtitle}</p>
                        </div>
                    </div>

                    {/* Offer highlight */}
                    <div className="rounded-lg p-4 md:p-5 mb-6"
                        style={{
                            background: 'linear-gradient(135deg, rgba(240,185,11,0.08), rgba(240,185,11,0.03))',
                            border: '1px solid rgba(240,185,11,0.2)',
                        }}>
                        <div className="text-2xl md:text-4xl font-black text-white mb-2">
                            {config.offerMain}
                        </div>
                        <p className="text-zinc-400 text-xs md:text-sm font-bold">
                            {config.offerSub}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        {[
                            { icon: '⚡', label: 'Anında Ödeme' },
                            { icon: '🔒', label: 'Lisanslı & Güvenli' },
                            { icon: '📞', label: '7/24 Destek' },
                            { icon: '🏆', label: 'Yüksek Oranlar' },
                        ].map((f, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg text-center"
                                style={{ background: 'rgba(240,185,11,0.06)', border: '1px solid rgba(240,185,11,0.15)' }}>
                                <span className="text-xl">{f.icon}</span>
                                <span className="text-zinc-300 text-[10px] font-black uppercase tracking-widest">{f.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={config.buttonLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: 'linear-gradient(135deg, #f0b90b 0%, #ffd357 50%, #f0b90b 100%)',
                                boxShadow: '0 0 30px rgba(240,185,11,0.5)',
                                textDecoration: 'none',
                                color: '#000'
                            }}
                        >
                            {config.buttonText}
                        </a>
                        <button
                            onClick={handleClose}
                            className="py-4 px-6 rounded-lg font-black text-xs uppercase tracking-widest transition-all hover:bg-white/5 active:scale-95"
                            style={{
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.6)',
                            }}
                        >
                            SİTEYE DEVAM ET
                        </button>
                    </div>

                    <p className="text-center text-zinc-700 text-[9px] font-bold uppercase tracking-widest mt-4">
                        18+ · Sorumlu Oynayın · Koşullar Geçerlidir
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PromoPopup;
