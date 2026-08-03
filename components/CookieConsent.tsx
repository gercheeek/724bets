import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[9999] flex items-center justify-between bg-[#1a1d27] border border-white/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 sm:p-5 w-[calc(100%-48px)] sm:w-[600px] animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="flex items-center gap-4">
                <span className="text-2xl drop-shadow-md">🍪</span>
                <p className="text-zinc-300 text-sm md:text-[15px] font-medium leading-snug pr-4">
                    Size mümkün olan en iyi deneyimi sunmak için çerezleri kullanıyoruz
                </p>
            </div>
            <button 
                onClick={handleAccept}
                className="shrink-0 bg-[#252936] hover:bg-[#2d3242] border border-white/10 rounded-lg px-5 md:px-6 py-2.5 md:py-3 text-white text-sm md:text-[15px] font-bold transition-all active:scale-95 whitespace-nowrap"
            >
                Kabul etmek
            </button>
        </div>
    );
};

export default CookieConsent;
