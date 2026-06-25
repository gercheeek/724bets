import React from 'react';
import { MatchAnalysis } from '../types';
import { Target, PlayCircle } from 'lucide-react';

interface DashboardHeroProps {
    featuredMatch?: MatchAnalysis;
    onNavigate: (view: string) => void;
}

const DashboardHero: React.FC<DashboardHeroProps> = ({ featuredMatch, onNavigate }) => {
    // 1. Fallback / Loading State if no match is available
    if (!featuredMatch) {
        return (
             <section className="relative w-full py-8 md:py-12 mb-6 rounded-3xl overflow-hidden group border border-[#FFC107]/20" style={{ background: 'var(--bg-card)', boxShadow: '0 0 40px rgba(255,193,7,0.05)' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFC107]/5 to-transparent pointer-events-none"></div>
                  <div className="relative z-10 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                          <span className="flex items-center gap-2 text-[#FFC107] text-[10px] font-black uppercase tracking-widest mb-3 animate-pulse"><Target className="w-4 h-4" /> GÜNÜN ÖNE ÇIKAN DÜELLOSU</span>
                          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none mb-4">DEVLER LİGİ HEYECANI BAŞLADI</h2>
                          <p className="text-zinc-400 text-sm font-bold max-w-xl leading-relaxed">Uzmanlarımız tarafından hazırlanan derin xG form istatistikleri ve günün banko tercihleri hazır. Hemen analizleri inceleyin ve kazanmaya başlayın.</p>
                      </div>
                      <button onClick={() => onNavigate('analysis')} className="flex-shrink-0 px-8 py-5 bg-gradient-to-r from-[#f0b90b] to-[#FFC107] text-black font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_20px_rgba(255,193,7,0.4)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,193,7,0.6)] transition-all flex items-center gap-2">
                          <PlayCircle className="w-5 h-5" /> HEMEN TAHMİNLERİ GÖR
                      </button>
                  </div>
             </section>
        )
    }

    // 2. Dynamic Featured Match View
    return (
        <section className="relative w-full py-10 mb-8 md:mb-12 rounded-[32px] overflow-hidden group cursor-pointer border border-[#FFC107]/20 hover:border-[#FFC107]/40 transition-colors" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)' }} onClick={() => onNavigate('analysis')}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/stadium/1200/400')] bg-cover bg-center opacity-10 group-hover:opacity-[0.15] transition-opacity duration-700 blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-[#020503]/80 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFC107]/30 to-transparent"></div>
            
            <div className="relative z-10 px-6 md:px-12 flex flex-col items-center justify-center text-center">
                {/* Badge */}
                <span className="flex items-center gap-2 text-[#FFC107] text-[10px] font-black uppercase tracking-[0.2em] mb-6 px-4 py-1.5 rounded-full border border-[#FFC107]/30 bg-[#FFC107]/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,193,7,0.1)]">
                    <Target className="w-4 h-4 animate-pulse" /> GÜNÜN MAÇI
                </span>
                
                {/* Match Matchup */}
                <div className="flex items-center justify-center gap-4 md:gap-12 w-full max-w-4xl mb-6">
                    <div className="flex-1 flex justify-end">
                        <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-lg" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                            {featuredMatch.homeTeam}
                        </h3>
                    </div>
                    
                    <div className="flex flex-col items-center relative z-20">
                        <span className="text-zinc-400 font-black text-sm mb-2 px-3 py-1 bg-black/50 rounded drop-shadow backdrop-blur">{featuredMatch.matchTime || '21:00'}</span>
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700 flex items-center justify-center text-[#FFC107] font-black italic text-xl md:text-2xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            VS
                        </div>
                    </div>

                    <div className="flex-1 flex justify-start">
                        <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-lg" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}>
                            {featuredMatch.awayTeam}
                        </h3>
                    </div>
                </div>
                
                {/* Snippet / Analysis Preview */}
                <h4 className="text-base md:text-xl font-medium text-zinc-300 italic mb-8 max-w-2xl px-4 line-clamp-2 leading-relaxed">
                    "{featuredMatch.analysisSnippet || 'Uzman analiz ekibimizin detaylı form ve xG istatistiklerine dayalı derin maçı analizi.'}"
                </h4>

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button className="px-8 py-4 bg-gradient-to-r from-[#f0b90b] to-[#FFC107] text-black font-black uppercase tracking-widest text-xs rounded-full shadow-[0_0_30px_rgba(255,193,7,0.3)] group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(255,193,7,0.5)] transition-all duration-300 flex items-center gap-2">
                        <PlayCircle className="w-5 h-5" /> Analizi Görüntüle
                    </button>
                    {featuredMatch.confidence && (
                        <div className="px-6 py-4 rounded-full border border-[#FFC107]/30 text-[#FFC107] font-black text-xs uppercase tracking-widest bg-[#FFC107]/10 backdrop-blur">
                            GÜVEN: %{featuredMatch.confidence}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DashboardHero;
