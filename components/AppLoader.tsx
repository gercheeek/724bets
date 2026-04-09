import React, { useEffect, useState } from 'react';

const AppLoader: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + 2.5, 100)); // 40 steps, 100ms each = 4000ms
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[99999] bg-[#020503] flex flex-col items-center justify-center transition-opacity duration-500">
            {/* Logo Pulsing Effect */}
            <div className="relative mb-12 animate-float">
                <div className="absolute inset-0 bg-[#FFC107] blur-[100px] opacity-20 animate-pulse pointer-events-none"></div>
                <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter" style={{ background: 'linear-gradient(135deg, #f0b90b 0%, #FFC107 50%, #d4a008 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(240,185,11,0.4))' }}>
                    724BETS
                </h1>
            </div>

            {/* Loading Bar */}
            <div className="w-64 max-w-[80vw] bg-zinc-900 rounded-full h-1.5 overflow-hidden mb-4 relative border border-zinc-800">
                <div className="absolute top-0 left-0 h-full bg-[#FFC107] transition-all duration-[100ms] ease-linear" style={{ width: `${progress}%`, boxShadow: '0 0 15px rgba(255,193,7,0.8)' }}></div>
            </div>

            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
                Profesyonel Analizler Hazırlanıyor <span className="opacity-0 lg:animate-[ping_1.5s_infinite]">...</span>
            </p>
        </div>
    );
};

export default AppLoader;
