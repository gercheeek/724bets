import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DemoTimerOverlayProps {
    siteUser: any;
    onAuthRequired: () => void;
}

const DemoTimerOverlay: React.FC<DemoTimerOverlayProps> = ({ siteUser, onAuthRequired }) => {
    const { t } = useTranslation();
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (siteUser?.id?.toString().startsWith('guest_')) {
            // 3 minutes = 180,000 ms
            const timer = setTimeout(() => {
                setIsExpired(true);
            }, 180000);
            return () => clearTimeout(timer);
        } else {
            setIsExpired(false);
        }
    }, [siteUser]);

    if (!isExpired) return null;

    return (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-xl animate-fade-in pointer-events-auto">
            <div className="bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-md w-full text-center">
                <div className="w-16 h-16 bg-[#c6ff00]/20 rounded-full flex items-center justify-center mb-6">
                    <svg viewBox="0 0 100 100" fill="currentColor" className="w-10 h-10 text-[#c6ff00]">
                        <path d="M 50,45 C 35,25 40,10 50,18 C 60,10 65,25 50,45 Z" />
                        <path d="M 47,48 C 25,35 15,45 25,55 C 15,65 25,75 47,48 Z" />
                        <path d="M 53,48 C 75,35 85,45 75,55 C 85,65 75,75 53,48 Z" />
                        <path d="M 50,50 C 45,65 40,75 35,70 C 45,70 50,60 50,50 Z" />
                    </svg>
                </div>
                <h2 className="text-white text-2xl font-bold mb-4">
                    {t('Demo Time Expired', 'Deneme Süreniz Doldu!')}
                </h2>
                <p className="text-white/70 mb-8 text-lg">
                    {t('To continue winning, register now!', 'Oyunları test ettiğiniz için teşekkürler. Gerçek parayla oynamak ve kazanmaya devam etmek için hemen üye olun!')}
                </p>
                <button 
                    onClick={onAuthRequired}
                    className="w-full bg-[#c6ff00] hover:bg-[#a6d900] text-black font-bold py-4 rounded-xl text-lg transition-transform hover:scale-105 active:scale-95"
                >
                    {t('Register Now', 'Hemen Üye Ol')}
                </button>
            </div>
        </div>
    );
};

export default DemoTimerOverlay;
