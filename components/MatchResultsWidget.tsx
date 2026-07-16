import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MatchResult {
  home: string;
  away: string;
  homeScore?: number;
  awayScore?: number;
  time?: string;
  date: string;
  status: 'Bitti' | 'Canlı' | 'Yaklaşan';
  tournament: string;
}

export const FLAG_CODES: Record<string, string> = {
  'Kanada': 'ca', 'Katar': 'qa', 'Meksika': 'mx', 'Güney Kore': 'kr',
  'Amerika Birleşik Devletleri': 'us', 'Avustralya': 'au', 'İskoçya': 'gb-sct',
  'Fas': 'ma', 'Brezilya': 'br', 'Haiti': 'ht', 'Türkiye': 'tr',
  'Paraguay': 'py', 'Hollanda': 'nl', 'İsveç': 'se', 'Almanya': 'de',
  'Fildişi Sahili': 'ci', 'Ekvador': 'ec', 'Curacao': 'cw', 'Tunus': 'tn',
  'Japonya': 'jp', 'İspanya': 'es', 'Suudi Arabistan': 'sa', 'Belçika': 'be',
  'İran': 'ir', 'Uruguay': 'uy', 'Cape Verde': 'cv', 'Yeni Zelanda': 'nz',
  'Mısır': 'eg', 'Arjantin': 'ar', 'Avusturya': 'at', 'Fransa': 'fr',
  'Irak': 'iq', 'Norveç': 'no', 'Senegal': 'sn', 'Ürdün': 'jo',
  'Cezayir': 'dz', 'Portekiz': 'pt', 'Özbekistan': 'uz', 'İngiltere': 'gb-eng',
  'Gana': 'gh', 'Panama': 'pa', 'Hırvatistan': 'hr', 'Kolombiya': 'co',
  'DR Kongo': 'cd', 'Demokratik Kongo': 'cd', 'Bosna-Hersek': 'ba', 'İsviçre': 'ch', 'Çekya': 'cz',
  'Güney Afrika': 'za'
};

export const getFlagUrl = (country: string) => {
  const code = FLAG_CODES[country];
  return code ? `https://flagcdn.com/w80/${code}.png` : '';
};

const matches: MatchResult[] = [
  // Dünün Maçları
  { home: 'Kanada', away: 'Katar', homeScore: 6, awayScore: 0, status: 'Bitti', tournament: 'Tur 1 | Grup A', date: '19 Haz' },
  { home: 'Meksika', away: 'Güney Kore', homeScore: 1, awayScore: 0, status: 'Bitti', tournament: 'Tur 1 | Grup B', date: '19 Haz' },
  { home: 'Amerika Birleşik Devletleri', away: 'Avustralya', homeScore: 2, awayScore: 0, status: 'Bitti', tournament: 'Tur 1 | Grup C', date: '19 Haz' },
  // Bugünün Maçları
  { home: 'İskoçya', away: 'Fas', homeScore: 0, awayScore: 1, status: 'Bitti', tournament: 'Tur 1 | Grup D', date: '20 Haz' },
  { home: 'Brezilya', away: 'Haiti', homeScore: 3, awayScore: 0, status: 'Bitti', tournament: 'Tur 1 | Grup E', date: '20 Haz' },
  { home: 'Türkiye', away: 'Paraguay', homeScore: 0, awayScore: 1, status: 'Bitti', tournament: 'Tur 1 | Grup F', date: '20 Haz' },
  // Yaklaşan Maçlar
  { home: 'Hollanda', away: 'İsveç', time: '20:00', date: '20 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup G' },
  { home: 'Almanya', away: 'Fildişi Sahili', time: '23:00', date: '20 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup H' },
  // 21 Haz
  { home: 'Ekvador', away: 'Curacao', time: '03:00', date: '21 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup I' },
  { home: 'Tunus', away: 'Japonya', time: '07:00', date: '21 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup J' },
  { home: 'İspanya', away: 'Suudi Arabistan', time: '19:00', date: '21 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup K' },
  { home: 'Belçika', away: 'İran', time: '22:00', date: '21 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup L' },
  // 22 Haz
  { home: 'Uruguay', away: 'Cape Verde', time: '01:00', date: '22 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup A' },
  { home: 'Yeni Zelanda', away: 'Mısır', time: '04:00', date: '22 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup B' },
  { home: 'Arjantin', away: 'Avusturya', time: '20:00', date: '22 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup C' },
  // 23 Haz
  { home: 'Fransa', away: 'Irak', time: '00:00', date: '23 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup D' },
  { home: 'Norveç', away: 'Senegal', time: '03:00', date: '23 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup E' },
  { home: 'Ürdün', away: 'Cezayir', time: '06:00', date: '23 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup F' },
  { home: 'Portekiz', away: 'Özbekistan', time: '20:00', date: '23 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup G' },
  { home: 'İngiltere', away: 'Gana', time: '23:00', date: '23 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup H' },
  // 24 Haz
  { home: 'Panama', away: 'Hırvatistan', time: '02:00', date: '24 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup I' },
  { home: 'Kolombiya', away: 'DR Kongo', time: '05:00', date: '24 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup J' },
  { home: 'Bosna-Hersek', away: 'Katar', time: '22:00', date: '24 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup K' },
  { home: 'İsviçre', away: 'Kanada', time: '22:00', date: '24 Haz', status: 'Yaklaşan', tournament: 'Tur 1 | Grup L' },
  // 25 Haz
  { home: 'İskoçya', away: 'Brezilya', time: '01:00', date: '25 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup A' },
  { home: 'Fas', away: 'Haiti', time: '01:00', date: '25 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup B' },
  { home: 'Çekya', away: 'Meksika', time: '04:00', date: '25 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup C' },
  { home: 'Güney Afrika', away: 'Güney Kore', time: '04:00', date: '25 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup D' },
  { home: 'Curacao', away: 'Fildişi Sahili', time: '23:00', date: '25 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup E' },
  { home: 'Ekvador', away: 'Almanya', time: '23:00', date: '25 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup F' },
  // 26 Haz
  { home: 'Japonya', away: 'İsveç', time: '02:00', date: '26 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup G' },
  { home: 'Tunus', away: 'Hollanda', time: '02:00', date: '26 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup H' },
  { home: 'Paraguay', away: 'Avustralya', time: '05:00', date: '26 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup I' },
  { home: 'Türkiye', away: 'Amerika Birleşik Devletleri', time: '05:00', date: '26 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup J' },
  { home: 'Norveç', away: 'Fransa', time: '22:00', date: '26 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup K' },
  { home: 'Senegal', away: 'Irak', time: '22:00', date: '26 Haz', status: 'Yaklaşan', tournament: 'Tur 2 | Grup L' },
  // 27 Haz
  { home: 'Cape Verde', away: 'Suudi Arabistan', time: '03:00', date: '27 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup A' },
  { home: 'Uruguay', away: 'İspanya', time: '03:00', date: '27 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup B' },
  { home: 'Yeni Zelanda', away: 'Belçika', time: '06:00', date: '27 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup C' },
  { home: 'Mısır', away: 'İran', time: '06:00', date: '27 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup D' },
  // 28 Haz
  { home: 'Hırvatistan', away: 'Gana', time: '00:00', date: '28 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup E' },
  { home: 'Panama', away: 'İngiltere', time: '00:00', date: '28 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup F' },
  { home: 'Kolombiya', away: 'Portekiz', time: '02:30', date: '28 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup G' },
  { home: 'DR Kongo', away: 'Özbekistan', time: '02:30', date: '28 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup H' },
  { home: 'Cezayir', away: 'Avusturya', time: '05:00', date: '28 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup I' },
  { home: 'Ürdün', away: 'Arjantin', time: '05:00', date: '28 Haz', status: 'Yaklaşan', tournament: 'Tur 3 | Grup J' },
];

const MatchResultsWidget: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Group matches by date
  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {} as Record<string, MatchResult[]>);

  // For the day text map
  const getDayShort = (dateStr: string) => {
    // Basic hardcoded map for demo based on date
    const days: Record<string, string> = {
      '19 Haz': 'Cuma', '20 Haz': 'Cmt', '21 Haz': 'Paz', '22 Haz': 'Pzt',
      '23 Haz': 'Salı', '24 Haz': 'Çarş', '25 Haz': 'Perş', '26 Haz': 'Cuma',
      '27 Haz': 'Cmt', '28 Haz': 'Paz'
    };
    return days[dateStr] || '';
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 mb-8 mt-2 relative group">
      
      {/* Desktop Navigation Arrows */}
      <button 
        onClick={scrollLeft}
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1A1D24] rounded-full items-center justify-center z-10 text-gray-400 hover:text-white hover:bg-[#22262F] transition-colors shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button 
        onClick={scrollRight}
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1A1D24] rounded-full items-center justify-center z-10 text-gray-400 hover:text-white hover:bg-[#22262F] transition-colors shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="flex items-center gap-3 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 pt-2 px-1"
        style={{ scrollBehavior: 'smooth' }}
      >
        {Object.entries(groupedMatches).map(([date, dayMatches]) => (
          <React.Fragment key={date}>
            <div className="flex flex-col items-center justify-center shrink-0 min-w-[55px] bg-[#1A1D24]/80 backdrop-blur-md rounded-lg snap-center h-[90px] self-center shadow-lg">
              <span className="text-[10px] font-bold text-gray-500 mb-1">{getDayShort(date)}</span>
              <span className="text-xs font-black text-white text-center leading-tight">{date.split(' ')[0]}<br/>{date.split(' ')[1]}</span>
            </div>

            {/* Matches for this date */}
            {dayMatches.map((m, idx) => (
              <div 
                key={`${date}-${idx}`} 
                className="flex flex-col items-center p-5 bg-[#1A1D24] rounded-lg min-w-[270px] max-w-[270px] shrink-0 snap-center shadow-lg shadow-black/40 hover:bg-[#22262F] transition-colors cursor-pointer"
              >
                {/* Top Info */}
                <div className="text-[9px] font-bold text-gray-500 mb-3 uppercase tracking-wider">
                  {m.tournament}
                </div>

                {/* Match Teams & Score */}
                <div className="flex items-center justify-between w-full">
                  {/* Home Team */}
                  <div className="flex flex-col items-center w-[35%]">
                    <div className="w-[42px] h-[30px] rounded overflow-hidden shadow-sm mb-2">
                      <img 
                        src={getFlagUrl(m.home)} 
                        alt={m.home}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 text-center truncate w-full px-1">
                      {m.home}
                    </span>
                  </div>

                  {/* Score / Status / Time */}
                  <div className="flex flex-col items-center justify-center w-[30%] -mt-1">
                    <span className="text-lg font-black text-white tabular-nums tracking-wider mb-0.5">
                      {m.status === 'Bitti' ? `${m.homeScore} : ${m.awayScore}` : (m.time || '-:-')}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${m.status === 'Bitti' ? 'text-gray-500' : 'text-[#10B981]'}`}>
                      {m.status}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center w-[35%]">
                    <div className="w-[42px] h-[30px] rounded overflow-hidden shadow-sm mb-2">
                      <img 
                        src={getFlagUrl(m.away)} 
                        alt={m.away}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 text-center truncate w-full px-1">
                      {m.away}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

    </div>
  );
};

export default MatchResultsWidget;
