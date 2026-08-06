import React, { useState, useEffect } from 'react';
import { Timer, Users, Swords, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TournamentDetailView from './TournamentDetailView';

const CustomTrophy = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 4h12M6 4v7a6 6 0 0 0 12 0V4M6 4H3v3a3 3 0 0 0 3 3h0" />
    <path d="M18 4h3v3a3 3 0 0 1-3 3h0M12 17v4M8 21h8" />
  </svg>
);

interface Tournament {
  id: string;
  title: string;
  desc: string;
  prize: string;
  status: 'active' | 'upcoming' | 'ended';
  timeInfo: string;
  participants?: number;
  image: string;
}

const getTournaments = (t: any): Tournament[] => [
  {
    id: '1',
    title: t('promo_view.gates_title'),
    desc: t('promo_view.gates_desc'),
    prize: '$97,83',
    status: 'active',
    timeInfo: '05g 20s 01d',
    participants: 273,
    image: '/images/slots/bigbass.webp',
  },
  {
    id: '2',
    title: t('promo_view.le_series_title'),
    desc: t('promo_view.le_series_desc'),
    prize: '$222,52',
    status: 'active',
    timeInfo: '05g 20s 01d',
    participants: 36,
    image: '/images/slots/doghouse.webp',
  },
  {
    id: '3',
    title: t('promo_view.weekend_title'),
    desc: t('promo_view.weekend_desc'),
    prize: '$5.754,71',
    status: 'upcoming',
    timeInfo: '17s 01d',
    participants: 142,
    image: '/images/slots/fruitshop.webp',
  },
  {
    id: '4',
    title: t('promo_view.hacksaw_title'),
    desc: t('promo_view.hacksaw_desc'),
    prize: '$644,79',
    status: 'upcoming',
    timeInfo: '17s 32d',
    participants: 89,
    image: '/images/slots/legiongold.webp',
  },
  {
    id: '5',
    title: t('promo_view.gates_title'),
    desc: t('promo_view.gates_desc'),
    prize: '$97,83',
    status: 'upcoming',
    timeInfo: '06g 03s 02d',
    participants: 412,
    image: '/images/slots/bigbass.webp',
  },
  {
    id: '6',
    title: t('promo_view.le_series_title'),
    desc: t('promo_view.le_series_desc'),
    prize: '$222,52',
    status: 'upcoming',
    timeInfo: '06g 05s 32d',
    participants: 67,
    image: '/images/slots/doghouse.webp',
  },
  {
    id: '7',
    title: t('promo_view.weekend_title'),
    desc: t('promo_view.weekend_desc'),
    prize: '$5.687,98',
    status: 'ended',
    timeInfo: '2026.07.26',
    participants: 843,
    image: '/images/slots/fruitshop.webp',
  },
  {
    id: '8',
    title: t('promo_view.hacksaw_title'),
    desc: t('promo_view.hacksaw_desc'),
    prize: '$642,51',
    status: 'ended',
    timeInfo: '2026.07.30',
    participants: 512,
    image: '/images/slots/legiongold.webp',
  },
  {
    id: '9',
    title: t('promo_view.gates_title'),
    desc: t('promo_view.gates_desc'),
    prize: '$96,81',
    status: 'ended',
    timeInfo: '2026.07.29',
    participants: 310,
    image: '/images/slots/bigbass.webp',
  }
];

const MOCK_NAMES = ["Al***92", "Kral***", "ProGamer", "Dark***X", "X-Bet", "Lucky***", "Can***11", "VegasKing"];

const parseTimeInfo = (timeInfo: string, t: any) => {
  if (timeInfo.includes('.')) {
    return { type: 'ended', date: timeInfo };
  }
  
  const parts = timeInfo.split(' ');
  const result = [];
  
  for (const part of parts) {
    if (part.endsWith('g')) result.push({ value: part.replace('g', ''), label: t('promo_view.day') });
    else if (part.endsWith('s')) result.push({ value: part.replace('s', ''), label: t('promo_view.hour') });
    else if (part.endsWith('d')) result.push({ value: part.replace('d', ''), label: t('promo_view.minute') });
  }
  
  if (result.length === 0) {
     return { type: 'unknown', value: timeInfo };
  }
  
  return { type: 'active', parts: result };
};

const PremiumTimer = ({ timeInfo, status }: { timeInfo: string, status: string }) => {
  const { t } = useTranslation();
  const parsed = parseTimeInfo(timeInfo, t);
  
  if (status === 'ended' || parsed.type === 'ended') return null; 
  if (parsed.type === 'unknown') return <div className="text-zinc-500 font-mono text-[10px] sm:text-[11px]">{parsed.value}</div>;
  
  const activeColor = status === 'active' ? 'text-[#00E5FF]' : 'text-[#FF9F1C]';
  const iconBg = status === 'active' ? 'bg-[#00E5FF]/20 shadow-[0_0_12px_rgba(0,229,255,0.4)]' : 'bg-[#FF9F1C]/20 shadow-[0_0_12px_rgba(255,159,28,0.4)]';
  
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 p-1 pr-3 sm:pr-4 rounded-full bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-md shadow-[inset_0_2px_10px_rgba(255,255,255,0.02),0_4px_15px_rgba(0,0,0,0.5)]">
      {/* Glowing Icon Circle */}
      <div className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full ${iconBg}`}>
        <Timer className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${activeColor}`} />
      </div>
      
      {/* Time Parts */}
      <div className="flex gap-1.5 sm:gap-2">
         {parsed.parts?.map((p, i) => (
            <div key={i} className="flex items-baseline gap-[1px]">
               <span className="font-mono font-black text-white/95 text-[11px] sm:text-[13px] tracking-tight">{p.value}</span>
               <span className={`font-bold text-[7px] sm:text-[8px] uppercase tracking-wider ${activeColor} opacity-90`}>{p.label.charAt(0)}</span>
            </div>
         ))}
      </div>
    </div>
  );
};

const TournamentCard = ({ tournament, onClick }: { tournament: Tournament, onClick: () => void }) => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState(() =>
    Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      score: Math.floor(Math.random() * 10000) + 10000 - (i * 2000),
    }))
  );

  useEffect(() => {
    if (tournament.status !== 'active') return;
    const interval = setInterval(() => {
      setLeaderboard(prev => {
        const newScores = prev.map(p => ({
          ...p,
          score: p.score + Math.floor(Math.random() * 500)
        })).sort((a, b) => b.score - a.score);
        return newScores;
      });
    }, 3000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [tournament.status]);

  return (
    <div 
      onClick={onClick}
      className={`flex flex-col sm:flex-row bg-[#0d1017] backdrop-blur-xl rounded-[20px] sm:rounded-[24px] relative overflow-hidden group shadow-2xl border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,229,255,0.2)] transition-all duration-300 cursor-pointer ${tournament.status === 'ended' ? 'opacity-50 grayscale hover:grayscale-0 border-white/10 hover:border-white/20' : ''}`}
    >
      <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)] pointer-events-none z-20" />

      {/* Image Side */}
      <div className="w-full sm:w-[150px] md:w-[180px] h-[160px] sm:h-auto relative overflow-hidden shrink-0 bg-[#0A0C10]">
        <img 
          src={tournament.image} 
          alt={tournament.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a0a0a] to-transparent sm:hidden pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent hidden sm:block pointer-events-none" />
        
        {/* Status badge */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-white z-20">
           {tournament.status === 'active' ? (
             <span className="text-[#00E5FF] flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-[#00E5FF] animate-pulse"/> {t('promo_view.active')}</span>
           ) : tournament.status === 'upcoming' ? (
             <span className="text-[#FF9F1C]">{t('promo_view.upcoming')}</span>
           ) : (
             <span className="text-zinc-400">{t('promo_view.ended')}</span>
           )}
        </div>

        {/* Hover Leaderboard Overlay over Image (Replaces right column) */}
        {tournament.status !== 'ended' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-center p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
             <div className="text-[9px] sm:text-[10px] font-bold text-white/90 uppercase tracking-widest mb-3 flex items-center justify-between">
               <span>{t('promo_view.live_leaderboard')}</span>
               <span className="text-[#00E5FF] text-[7px] sm:text-[8px] animate-pulse flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> {t('promo_view.live')}
               </span>
             </div>
             <div className="space-y-1.5 sm:space-y-2">
             {leaderboard.slice(0, 3).map((player, idx) => (
               <div key={player.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className={`text-[8px] sm:text-[10px] font-black w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-amber-500/20 text-zinc-300 shadow-[0_0_8px_rgba(255,191,0,0.4)]' : 'bg-white/10 text-white'}`}>{idx + 1}</span>
                    <span className="text-[10px] sm:text-[11px] text-zinc-100 font-medium truncate max-w-[60px] sm:max-w-[70px]">{player.name}</span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono font-bold text-[#00E5FF]">
                    {player.score.toLocaleString()} <span className="text-[7px] sm:text-[8px] opacity-60">{t('promo_view.pts')}</span>
                  </div>
               </div>
             ))}
             </div>
          </div>
        )}
      </div>

      {/* Content Side - Minimalist */}
      <div className="flex flex-col justify-center flex-1 p-4 md:p-5 relative z-10 min-w-0">
        <h3 className="text-gray-100 font-bold text-[15px] sm:text-[16px] md:text-[18px] leading-snug mb-1 group-hover:text-white transition-colors duration-300 truncate">
          {tournament.title}
        </h3>
        {/* Subtitle/Desc is completely hidden to keep it minimal and clean */}
        
        <div className="flex items-end justify-between mt-3 sm:mt-4 gap-2">
           {/* Prize Section */}
           <div className="min-w-0">
             <div className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 sm:mb-1">Ödül Havuzu</div>
             <div className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 font-black text-[18px] sm:text-[20px] md:text-[22px] tracking-tighter drop-shadow-sm truncate">
               {tournament.prize}
             </div>
           </div>

           {/* Timer Section */}
           <div className="shrink-0">
             <PremiumTimer timeInfo={tournament.timeInfo} status={tournament.status} />
           </div>
        </div>
      </div>
    </div>
  );
};

const getSliderData = (t: any) => [
  {
    id: 1,
    titleHighlight: t('promo_view.slide1_title'),
    heading1: t('promo_view.slide1_h1'),
    headingHighlight: t('promo_view.slide1_hhl'),
    heading2: t('promo_view.slide1_h2'),
    subHeading: t('promo_view.slide1_sub'),
    desc: t('promo_view.slide1_desc'),
    image: "/images/slots/fruitshop.webp",
    themeColor: "text-[#00E5FF]",
    highlightColor: "text-[#00E5FF]",
  },
  {
    id: 2,
    titleHighlight: t('promo_view.slide2_title'),
    heading1: t('promo_view.slide2_h1'),
    headingHighlight: t('promo_view.slide2_hhl'),
    heading2: t('promo_view.slide2_h2'),
    subHeading: t('promo_view.slide2_sub'),
    desc: t('promo_view.slide2_desc'),
    image: "/images/slots/bigbass.webp",
    themeColor: "text-[#FF9F1C]",
    highlightColor: "text-white",
  },
  {
    id: 3,
    titleHighlight: t('promo_view.slide3_title'),
    heading1: t('promo_view.slide3_h1'),
    headingHighlight: t('promo_view.slide3_hhl'),
    heading2: t('promo_view.slide3_h2'),
    subHeading: t('promo_view.slide3_sub'),
    desc: t('promo_view.slide3_desc'),
    image: "/images/slots/doghouse.webp",
    themeColor: "text-[#EC4899]",
    highlightColor: "text-pink-400",
  },
  {
    id: 4,
    titleHighlight: t('promo_view.slide4_title'),
    heading1: t('promo_view.slide4_h1'),
    headingHighlight: t('promo_view.slide4_hhl'),
    heading2: t('promo_view.slide4_h2'),
    subHeading: t('promo_view.slide4_sub'),
    desc: t('promo_view.slide4_desc'),
    image: "/images/slots/legiongold.webp",
    themeColor: "text-[#EF4444]",
    highlightColor: "text-red-500",
  }
];

const HeroSlider = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const sliderData = getSliderData(t);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full rounded-2xl md:rounded-[24px] overflow-hidden mb-8 md:mb-10 min-h-[220px] md:h-[280px] lg:h-[320px] border border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.5)] group">
       {/* Background Images */}
        {getSliderData(t).map((slide, idx) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
             <img src={slide.image} alt={slide.titleHighlight} className={`absolute inset-0 w-full h-full object-cover opacity-50 md:opacity-60 transition-transform duration-[10000ms] ease-out ${currentSlide === idx ? 'scale-100' : 'scale-105'}`} />
            
            {/* Gradients for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080D] via-[#06080D]/90 md:via-[#06080D]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-transparent to-transparent md:opacity-50" />
            
            {/* Subtle glow based on theme */}
            <div className={`absolute top-0 left-0 w-full h-full opacity-20 mix-blend-screen bg-gradient-to-br from-transparent to-black pointer-events-none`} />
            
            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 z-20 pointer-events-none">
              <div className={`max-w-2xl transform transition-all duration-1000 delay-200 ${currentSlide === idx ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                 <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2 md:mb-3 leading-[1.2] text-white/90 drop-shadow-lg tracking-tight">
                   {slide.heading1}
                   <span className={`${slide.highlightColor} drop-shadow-[0_0_15px_currentColor] font-black`}>{slide.headingHighlight}</span>
                   {slide.heading2}
                 </h1>
                 <p className="text-zinc-300 text-[11px] sm:text-xs md:text-sm leading-relaxed max-w-lg font-medium drop-shadow hidden sm:block opacity-90">
                   {slide.desc}
                 </p>
              </div>
            </div>
            
            {/* Glassmorphism Button */}
            <div className={`absolute bottom-6 right-6 sm:bottom-8 sm:right-10 md:bottom-10 md:right-16 z-30 transform transition-all duration-1000 delay-300 ${currentSlide === idx ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
                 <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/40 text-white font-bold py-2.5 px-6 md:py-3 md:px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] text-xs md:text-sm flex items-center gap-2 group">
                    <span>{t('promo_view.play_now')}</span>
                    <svg className="w-3 h-3 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                 </button>
            </div>

         </div>
       ))}

       {/* Slider Controls / Dots */}
       <div className="absolute bottom-4 md:bottom-8 left-5 sm:left-8 md:left-16 flex gap-2 z-20">
         {getSliderData(t).map((_, idx) => (
           <button 
             key={idx}
             onClick={() => setCurrentSlide(idx)}
             className={`h-1.5 md:h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)] ${currentSlide === idx ? 'w-10 md:w-12 bg-white' : 'w-2.5 md:w-3 bg-white/30 hover:bg-white/60'}`}
             aria-label={`Go to slide ${idx + 1}`}
           />
         ))}
       </div>
    </div>
  );
};

export default function PromoView() {
  const { t } = useTranslation();
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const tournaments = getTournaments(t);

  if (selectedTournament) {
    return <TournamentDetailView tournament={selectedTournament} onBack={() => setSelectedTournament(null)} />;
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-[#0A0C10] text-white p-4 md:p-6 lg:p-8 font-sans pb-32 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#00E5FF]/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <HeroSlider />

        {/* Tournaments Sections */}
        <div className="space-y-12">
          {/* Active Tournaments */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#00E5FF] rounded-full shadow-[0_0_10px_rgba(0,229,255,0.5)]"></div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-md">{t('promo_view.active_tournaments')}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {tournaments.filter(t => t.status === 'active').map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  onClick={() => setSelectedTournament(tournament)} 
                />
              ))}
            </div>
          </section>

          {/* Upcoming Tournaments */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#FF9F1C] rounded-full shadow-[0_0_10px_rgba(255,159,28,0.5)]"></div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-md">{t('promo_view.upcoming_tournaments')}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {tournaments.filter(t => t.status === 'upcoming').map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  onClick={() => setSelectedTournament(tournament)} 
                />
              ))}
            </div>
          </section>

          {/* Ended Tournaments */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-zinc-600 rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white drop-shadow-md opacity-80">{t('promo_view.ended_tournaments')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tournaments.filter(t => t.status === 'ended').map((tournament) => (
                <TournamentCard 
                  key={tournament.id} 
                  tournament={tournament} 
                  onClick={() => setSelectedTournament(tournament)} 
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
