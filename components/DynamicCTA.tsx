import React from 'react';
import { Trophy, Zap, TrendingUp, ShieldCheck, Target, CheckCircle2 } from 'lucide-react';

interface DynamicCTAProps {
    onNavigate: (view: string) => void;
}

const PRAISE_ITEMS = [
    { icon: <Trophy className="w-5 h-5 text-[#f0b90b]" />, text: "Yapay Zeka Destekli Kusursuz Analizler" },
    { icon: <ShieldCheck className="w-5 h-5 text-[#f0b90b]" />, text: "Güvenilir & Lisanslı Seçenekler" },
    { icon: <TrendingUp className="w-5 h-5 text-[#f0b90b]" />, text: "%85 Üzeri Başarı Oranı" },
    { icon: <Zap className="w-5 h-5 text-[#f0b90b]" />, text: "Anlık Form ve Sakatlık Takibi" },
    { icon: <Target className="w-5 h-5 text-[#f0b90b]" />, text: "Sıfır Hata Payı Hedefiyle Sistemli Kazanç" },
    { icon: <CheckCircle2 className="w-5 h-5 text-[#f0b90b]" />, text: "Uzman Editör Onaylı Kuponlar" },
];

const DynamicCTA: React.FC<DynamicCTAProps> = ({ onNavigate }) => {
    return (
        <section className="relative w-full overflow-hidden bg-[#060606] border-y border-zinc-800/60 py-16 flex flex-col items-center justify-center min-h-[300px]">

            {/* Background radial gradient for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(240,185,11,0.03)_0%,transparent_70%)] pointer-events-none" />

            {/* Main Premium Text */}
            <div className="relative z-10 text-center mb-10 px-4">
                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight uppercase leading-tight">
                    Kazanç Tesadüf Değil, <br className="md:hidden" />
                    <span className="text-[#f0b90b] drop-shadow-[0_0_15px_rgba(240,185,11,0.3)] border-b-4 border-[#f0b90b] pb-1 inline-block mt-2 md:mt-0">
                        STRATEJİ İŞİDİR.
                    </span>
                </h2>
                <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed">
                    724Bets, sadece sıradan tahminler paylaşmaz. Kusursuz istatistik, anlık takım formu, xG verileri ve yapay zeka destekli detaylı maç içi senaryolarla profesyonel analizler üretir.
                </p>
            </div>

            {/* Interactive Infinite Marquee */}
            <div className="w-full relative flex overflow-x-hidden mb-12">
                <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-[#060606] to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-[#060606] to-transparent" />

                <div className="animate-marquee whitespace-nowrap flex items-center shrink-0">
                    {[...PRAISE_ITEMS, ...PRAISE_ITEMS, ...PRAISE_ITEMS].map((item, index) => (
                        <div
                            key={`marquee-item-${index}`}
                            className="group mx-4 flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800/80 px-6 py-3 rounded-full hover:border-[#f0b90b]/50 hover:bg-[#111] hover:scale-105 transition-all duration-300 cursor-default"
                        >
                            <div className="group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(240,185,11,0.5)] transition-all duration-300">{item.icon}</div>
                            <span className="font-bold text-zinc-300 tracking-wide text-sm group-hover:text-white transition-colors">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Action Button */}
            <div className="relative z-10">
                <button
                    onClick={() => onNavigate('analysis')}
                    className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-black bg-[#f0b90b] rounded-full overflow-hidden hover:scale-[1.02] transform transition-all duration-300 shadow-[0_0_40px_rgba(240,185,11,0.2)] hover:shadow-[0_0_60px_rgba(240,185,11,0.4)]"
                >
                    {/* Button Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer" />

                    <span className="relative flex items-center gap-3 text-[15px] tracking-[0.15em] uppercase">
                        HEMEN ANALİZLERİ GÖR
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </span>
                </button>
            </div>
        </section>
    );
};

export default DynamicCTA;
