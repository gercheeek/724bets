import React, { useState, useEffect } from 'react';
import { Trophy, Timer, Users, Swords, Calendar } from 'lucide-react';
import TournamentDetailView from './TournamentDetailView';

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

const tournaments: Tournament[] = [
  {
    id: '1',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    status: 'active',
    timeInfo: '05g 20s 01d',
    participants: 273,
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  },
  {
    id: '2',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'active',
    timeInfo: '05g 20s 01d',
    participants: 36,
    image: '/images/promos/sweet_bonanza_promo_1785470716975.jpg',
  },
  {
    id: '3',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.754,71',
    status: 'upcoming',
    timeInfo: '17s 01d',
    participants: 142,
    image: '/images/promos/weekend_multiplier_promo_1785470757275.jpg',
  },
  {
    id: '4',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$644,79',
    status: 'upcoming',
    timeInfo: '17s 32d',
    participants: 89,
    image: '/images/promos/hacksaw_promo_1785470736175.jpg',
  },
  {
    id: '5',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$97,83',
    status: 'upcoming',
    timeInfo: '06g 03s 02d',
    participants: 412,
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  },
  {
    id: '6',
    title: 'Le Serisi Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$222,52',
    status: 'upcoming',
    timeInfo: '06g 05s 32d',
    participants: 67,
    image: '/images/promos/sweet_bonanza_promo_1785470716975.jpg',
  },
  {
    id: '7',
    title: 'HAFTASONU ÇARPAN TURNUVASI 5.000 EURO',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$5.687,98',
    status: 'ended',
    timeInfo: '2026.07.26',
    participants: 843,
    image: '/images/promos/weekend_multiplier_promo_1785470757275.jpg',
  },
  {
    id: '8',
    title: 'Hacksaw Turnuvası',
    desc: 'Bahislerin toplamına göre puanlar,...',
    prize: '$642,51',
    status: 'ended',
    timeInfo: '2026.07.30',
    participants: 512,
    image: '/images/promos/hacksaw_promo_1785470736175.jpg',
  },
  {
    id: '9',
    title: 'Gates of Olympus Turnuvası',
    desc: 'Daha yüksek kazanma çarpanı için...',
    prize: '$96,81',
    status: 'ended',
    timeInfo: '2026.07.29',
    participants: 310,
    image: '/images/promos/gates_of_olympus_promo_1785470699172.jpg',
  }
];

const MOCK_NAMES = ["Al***92", "Kral***", "ProGamer", "Dark***X", "X-Bet", "Lucky***", "Can***11", "VegasKing"];

const parseTimeInfo = (timeInfo: string) => {
  if (timeInfo.includes('.')) {
    return { type: 'ended', date: timeInfo };
  }
  
  const parts = timeInfo.split(' ');
  const result = [];
  
  for (const part of parts) {
    if (part.endsWith('g')) result.push({ value: part.replace('g', ''), label: 'GÜN' });
    else if (part.endsWith('s')) result.push({ value: part.replace('s', ''), label: 'SAAT' });
    else if (part.endsWith('d')) result.push({ value: part.replace('d', ''), label: 'DAKİKA' });
  }
  
  if (result.length === 0) {
     return { type: 'unknown', value: timeInfo };
  }
  
  return { type: 'active', parts: result };
};

const PremiumTimer = ({ timeInfo, status }: { timeInfo: string, status: string }) => {
  const parsed = parseTimeInfo(timeInfo);
  
  if (status === 'ended' || parsed.type === 'ended') {
    return null; 
  }
  
  if (parsed.type === 'unknown') {
    return (
      <div className="mt-auto pt-2">
        <span className="text-zinc-400 font-mono text-sm">{parsed.value}</span>
      </div>
    );
  }
  
  const activeColor = status === 'active' ? 'text-[#00E5FF]' : 'text-[#FF9F1C]';
  const labelText = status === 'active' ? 'BİTMESİNE KALAN SÜRE' : 'BAŞLAMASINA KALAN SÜRE';
  const boxBg = status === 'active' ? 'bg-gradient-to-br from-[#00E5FF]/[0.08] to-transparent border-[#00E5FF]/20' : 'bg-gradient-to-br from-[#FF9F1C]/[0.08] to-transparent border-[#FF9F1C]/20';
  const numberGlow = status === 'active' ? 'drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'drop-shadow-[0_0_8px_rgba(255,159,28,0.5)]';
  const labelColor = status === 'active' ? 'text-[#00E5FF]/70' : 'text-[#FF9F1C]/70';
  
  return (
    <div className="mt-auto flex flex-col gap-2 md:gap-2.5 pb-2">
      <div className={`flex items-center gap-1.5 text-[8.5px] md:text-[10px] font-extrabold ${activeColor} uppercase tracking-wider md:tracking-[0.15em] whitespace-nowrap drop-shadow-sm`}>
        <Timer className="w-3 h-3 md:w-3.5 md:h-3.5" />
        {labelText}
      </div>
      <div className="flex gap-1.5 md:gap-2 w-full">
        {parsed.parts?.map((p, i) => (
          <div key={i} className={`flex-1 flex flex-col items-center justify-center border rounded-lg md:rounded-[10px] py-1.5 md:py-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_12px_rgba(0,0,0,0.4)] ${boxBg}`}>
            <span className={`font-mono text-lg md:text-xl font-black text-white tracking-wider ${numberGlow}`}>{p.value}</span>
            <span className={`text-[7px] md:text-[8px] font-bold mt-0.5 uppercase tracking-wider md:tracking-[0.2em] ${labelColor}`}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TournamentCard = ({ tournament, onClick }: { tournament: Tournament, onClick: () => void }) => {
  // Mock live leaderboard state
  const [leaderboard, setLeaderboard] = useState(() =>
    Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      name: MOCK_NAMES[Math.floor(Math.random() * MOCK_NAMES.length)],
      score: Math.floor(Math.random() * 10000) + 10000 - (i * 2000),
    }))
  );

  // Live simulation effect
  useEffect(() => {
    if (tournament.status !== 'active') return;
    
    // Randomize update interval between 3 to 6 seconds for varied, organic feel
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
      className={`flex flex-col bg-[#0c0c0c] rounded-[20px] relative overflow-hidden group shadow-2xl ring-1 ring-white/5 hover:ring-white/10 hover:-translate-y-1 hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,1)] transition-all duration-500 cursor-pointer ${tournament.status === 'ended' ? 'opacity-50 grayscale hover:grayscale-0' : ''}`}
    >
      {/* Inner highlight for premium feel */}
      <div className="absolute inset-0 rounded-[20px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] pointer-events-none z-20" />

      {/* Image Header */}
      <div className="w-full h-[180px] relative overflow-hidden shrink-0">
        <img 
          src={tournament.image} 
          alt={tournament.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Smooth gradient fade into the card body */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0c0c0c] to-transparent pointer-events-none" />
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-1 relative z-10 bg-[#0c0c0c]">
        <h3 className="text-gray-100 font-semibold text-[1.1rem] leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors duration-300">
          {tournament.title}
        </h3>
        <p className="text-zinc-500 text-[13px] mb-5 line-clamp-2 leading-relaxed">{tournament.desc}</p>
        
        {/* Prize Section */}
        <div className="mb-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ödül Havuzu</div>
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 font-black text-3xl tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            {tournament.prize}
          </div>
        </div>
        
        {/* Premium Countdown Timer */}
        <PremiumTimer timeInfo={tournament.timeInfo} status={tournament.status} />

        {/* Mini Live Leaderboard */}
        {tournament.status !== 'ended' && (
          <div className="pt-3 mt-1 border-t border-white/5 space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Canlı Liderlik
            </div>
            {leaderboard.map((player, idx) => (
              <div key={player.id} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] rounded-md px-3 py-2 transition-colors duration-300 gap-3">
                 <div className="flex items-center gap-2.5 min-w-0 flex-1">
                   <span className={`shrink-0 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm ${
                     idx === 0 ? 'bg-amber-500/20 text-amber-500 ring-1 ring-amber-500/30' : 
                     idx === 1 ? 'bg-zinc-300/20 text-zinc-300 ring-1 ring-zinc-300/30' : 
                     'bg-orange-900/40 text-orange-400 ring-1 ring-orange-500/30'
                   }`}>{idx + 1}</span>
                   <span className="text-[11.5px] text-zinc-200 font-semibold truncate">{player.name}</span>
                 </div>
                 <div className="text-[11px] font-mono font-bold text-emerald-400/90 whitespace-nowrap shrink-0 flex items-baseline gap-1">
                   <span>{player.score.toLocaleString()}</span>
                   <span className="text-[9px] text-emerald-500/70 uppercase tracking-wider font-sans">pts</span>
                 </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Ended Footer (Participants only) */}
        {tournament.status === 'ended' && tournament.participants !== undefined && (
          <div className="pt-4 border-t border-white/5 flex items-center justify-end">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-400 bg-black/20 px-2.5 py-1.5 rounded-md">
              <Users className="w-3.5 h-3.5" /> {tournament.participants} Katılımcı
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SLIDER_DATA = [
  {
    id: 1,
    titleHighlight: "Milyonluk Turnuvalar",
    heading1: "Toplam ",
    headingHighlight: "25.000.000₺",
    heading2: " Nakit Ödül!",
    subHeading: "ŞİMDİ PAYINI AL",
    desc: "Her gün binlerce kullanıcı dev nakit ödüller ve bedava dönüşler kazanıyor. Hayatını değiştirecek o büyük ödülü sadece tek bir spinde sen kazan! Hemen üye ol, sınırsız nakit yağmuruna katıl.",
    image: "/images/promos/weekend_multiplier_promo_1785470757275.jpg",
    themeColor: "text-[#00E5FF]",
    highlightColor: "text-emerald-400",
  },
  {
    id: 2,
    titleHighlight: "Efsanevi Ödüller",
    heading1: "Zeus'un Öfkesiyle ",
    headingHighlight: "Çarpanları",
    heading2: " Yakala!",
    subHeading: "BÜYÜK VURGUN ZAMANI",
    desc: "Olimpos'un kapıları devasa kazançlar için aralandı. En yüksek çarpanları bul, liderlik tablosuna adını yazdır ve Zeus'un hazinesinden payını hemen al!",
    image: "/images/promos/gates_of_olympus_promo_1785470699172.jpg",
    themeColor: "text-[#FF9F1C]",
    highlightColor: "text-[#FFD700]",
  },
  {
    id: 3,
    titleHighlight: "Tatlı Kazançlar",
    heading1: "Şeker Gibi ",
    headingHighlight: "Bedava Dönüşler",
    heading2: " Seni Bekliyor!",
    subHeading: "SINIRSIZ EĞLENCE",
    desc: "Rengarenk şekerlerin ardındaki dev kazançları keşfet. Her patlayan şekerle ödül havuzuna bir adım daha yaklaş. Bu tatlı serüvende yerini ayırt!",
    image: "/images/promos/sweet_bonanza_promo_1785470716975.jpg",
    themeColor: "text-[#EC4899]",
    highlightColor: "text-pink-400",
  },
  {
    id: 4,
    titleHighlight: "Karanlık Tema",
    heading1: "Vahşi Batı'da ",
    headingHighlight: "Büyük Ödül",
    heading2: " Avı!",
    subHeading: "KURALLARI SEN KOY",
    desc: "Karanlık sokaklarda, vahşi batının acımasız atmosferinde hayatta kal ve büyük ikramiyeyi vur. Cesaretin varsa, bu ölümcül turnuvada yerini al!",
    image: "/images/promos/hacksaw_promo_1785470736175.jpg",
    themeColor: "text-[#EF4444]",
    highlightColor: "text-red-500",
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDER_DATA.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full rounded-2xl md:rounded-[30px] overflow-hidden mb-10 h-[300px] md:h-[400px] border border-white/[0.05] shadow-2xl group">
       {/* Background Images */}
       {SLIDER_DATA.map((slide, idx) => (
         <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img src={slide.image} alt={slide.titleHighlight} className="absolute inset-0 w-full h-full object-cover opacity-40 md:opacity-50 transform scale-105 transition-transform duration-[10000ms] ease-linear" style={{ transform: currentSlide === idx ? 'scale(1)' : 'scale(1.1)' }} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080D] via-[#06080D]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[#06080D]/30" />
            
            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-4xl">
               <div className="flex items-center gap-2 mb-3 opacity-90 transform translate-y-0 transition-transform duration-700">
                 <Trophy className={`w-3.5 h-3.5 md:w-4 md:h-4 ${slide.themeColor}`} />
                 <span className={`${slide.themeColor} text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase`}>
                   {slide.titleHighlight}
                 </span>
               </div>
               
               <h1 className="text-[22px] md:text-[38px] lg:text-[44px] font-extrabold leading-[1.1] tracking-tight text-white mb-4">
                 {slide.heading1} <span className={slide.highlightColor}>{slide.headingHighlight}</span> {slide.heading2} <br/>
                 <span className={slide.themeColor}>{slide.subHeading}</span>
               </h1>
               
               <p className="text-zinc-300 text-xs md:text-[15px] font-medium leading-relaxed max-w-[550px] opacity-90">
                 {slide.desc}
               </p>
            </div>
         </div>
       ))}

       {/* Slider Controls / Dots */}
       <div className="absolute bottom-5 md:bottom-8 left-6 md:left-16 flex gap-2 z-20">
         {SLIDER_DATA.map((_, idx) => (
           <button 
             key={idx}
             onClick={() => setCurrentSlide(idx)}
             className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 md:w-10 bg-white' : 'w-2 md:w-3 bg-white/30 hover:bg-white/50'}`}
           />
         ))}
       </div>
    </div>
  );
};

export default function PromoView() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  if (selectedTournament) {
    return <TournamentDetailView tournament={selectedTournament} onBack={() => setSelectedTournament(null)} />;
  }

  return (
    <div className="flex-1 w-full min-h-screen bg-[#06080D] text-white p-4 md:p-6 lg:p-8 font-sans pb-32 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-[#00E5FF]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <HeroSlider />

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard 
              key={tournament.id} 
              tournament={tournament} 
              onClick={() => setSelectedTournament(tournament)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
