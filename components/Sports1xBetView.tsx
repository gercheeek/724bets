import React, { useEffect, useState, useRef } from 'react';
import { useBetting } from '../contexts/BettingContext';
import { useBetSlip } from '../contexts/BetSlipContext';
import { Star, ChevronRight, Trophy } from 'lucide-react';

interface Sports1xBetViewProps {
  activeSport?: string;
  onSelectMatch?: (match: any) => void;
  feedType?: 'live' | 'prematch';
}

const OddsButton: React.FC<{ match: any, market: string, oddKey: string, val: string | number, isSelected: boolean, onToggle: (e: React.MouseEvent) => void }> = ({ match, market, oddKey, val, isSelected, onToggle }) => {
  const prevValRef = useRef<number | null>(null);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const numericVal = parseFloat(String(val));
    if (!isNaN(numericVal) && prevValRef.current !== null) {
      if (numericVal > prevValRef.current) {
        setTrend('up');
      } else if (numericVal < prevValRef.current) {
        setTrend('down');
      }
      
      const timer = setTimeout(() => setTrend(null), 2000);
      return () => clearTimeout(timer);
    }
    prevValRef.current = isNaN(numericVal) ? null : numericVal;
  }, [val]);

  const formattedVal = React.useMemo(() => {
    const numericVal = parseFloat(String(val).replace(',', '.'));
    if (!isNaN(numericVal)) {
      return numericVal.toFixed(2);
    }
    return val;
  }, [val]);

  if (val === '-' || val === undefined || val === null || val === 'kilitli') {
    return (
      <div className="w-[58px] sm:w-[65px] md:w-[80px] h-[38px] md:h-[44px] bg-[#0a0a0a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center rounded-lg md:rounded-xl text-xs text-zinc-600 cursor-not-allowed relative overflow-hidden shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={`relative group w-[58px] sm:w-[65px] md:w-[80px] h-[38px] md:h-[44px] flex items-center justify-center rounded-lg md:rounded-xl cursor-pointer transition-all duration-300 shrink-0 ${
        isSelected 
          ? 'bg-[color:var(--theme-accent)] shadow-[0_0_15px_var(--theme-accent-glow)] scale-105' 
          : 'bg-gradient-to-b from-[#1c1c1c] to-[#121212] shadow-[0_2px_4px_rgba(0,0,0,0.5)] hover:from-[#262626] hover:to-[#1a1a1a] hover:shadow-[0_4px_12px_rgba(0,0,0,0.8)]'
      }`}
    >
      <div className="relative flex items-center justify-center gap-1 z-10">
          <span className={`text-[12px] md:text-[14px] font-black leading-tight transition-colors ${
            trend === 'up' ? 'text-[#10b981]' : 
            trend === 'down' ? 'text-[#ef4444]' : 
            isSelected ? 'text-black' : 'text-zinc-300 group-hover:text-white'
          }`}>
             {formattedVal}
          </span>
          {trend === 'up' && <span className="absolute -right-2.5 md:-right-3.5 text-[#10b981] text-[8px] md:text-[9px]">▲</span>}
          {trend === 'down' && <span className="absolute -right-2.5 md:-right-3.5 text-[#ef4444] text-[8px] md:text-[9px]">▼</span>}
      </div>
    </button>
  );
};

const CustomFlag = ({ leagueName }: { leagueName: string }) => {
  const name = leagueName.toUpperCase();
  
  const FlagWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-[18px] h-[13px] rounded-[2px] overflow-hidden flex items-center justify-center shadow-sm relative shrink-0">
      {children}
    </div>
  );

  if (name.includes('TÜRKİYE') || name.includes('TURKEY') || name.includes('SÜPER LİG')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 1200 800" className="w-full h-full object-cover">
          <rect width="1200" height="800" fill="#E30A17"/>
          <circle cx="425" cy="400" r="200" fill="#fff"/>
          <circle cx="475" cy="400" r="160" fill="#E30A17"/>
          <polygon fill="#fff" points="700,400 604.89,369.09 634.27,273.89 575.52,354.72 479.59,325 539.09,405 479.59,485 575.52,455.28 634.27,536.11 604.89,440.91"/>
        </svg>
      </FlagWrapper>
    );
  }
  
  if (name.includes('İNGİLTERE') || name.includes('ENGLAND') || name.includes('PREMİER')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
          <rect width="5" height="3" fill="#fff"/>
          <rect width="1" height="3" x="2" fill="#ce1124"/>
          <rect width="5" height="1" y="1" fill="#ce1124"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('ALMANYA') || name.includes('GERMANY') || name.includes('BUNDESLİGA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
          <rect width="5" height="3" fill="#000"/>
          <rect width="5" height="1" y="1" fill="#d00"/>
          <rect width="5" height="1" y="2" fill="#fc0"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('İSPANYA') || name.includes('SPAIN') || name.includes('LA LİGA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#c60b1e"/>
          <rect width="3" height="1" y="0.5" fill="#ffc400"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('İTALYA') || name.includes('ITALY') || name.includes('SERİE A')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#009246"/>
          <rect width="2" height="2" x="1" fill="#fff"/>
          <rect width="1" height="2" x="2" fill="#ce2b37"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('FRANSA') || name.includes('FRANCE') || name.includes('LİGUE')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#002395"/>
          <rect width="2" height="2" x="1" fill="#fff"/>
          <rect width="1" height="2" x="2" fill="#ed2939"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('HOLLANDA') || name.includes('NETHERLANDS') || name.includes('EREDİVİSİE')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#21468b"/>
          <rect width="3" height="1.33" fill="#fff"/>
          <rect width="3" height="0.66" fill="#ae1c28"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('PORTEKİZ') || name.includes('PORTUGAL')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#da291c"/>
          <rect width="1.2" height="2" fill="#046a38"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('BREZİLYA') || name.includes('BRAZIL')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 10 7" className="w-full h-full object-cover">
          <rect width="10" height="7" fill="#009c3b"/>
          <polygon points="5,0.6 9.1,3.5 5,6.4 0.9,3.5" fill="#ffdf00"/>
          <circle cx="5" cy="3.5" r="1.5" fill="#002776"/>
        </svg>
      </FlagWrapper>
    );
  }
  
  if (name.includes('ARJANTİN') || name.includes('ARGENTINA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#74acdf"/>
          <rect width="3" height="0.66" y="0.66" fill="#fff"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('AVUSTRALYA') || name.includes('AUSTRALIA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 2520 1260" className="w-full h-full object-cover">
          <rect width="2520" height="1260" fill="#012169"/>
          <path stroke="#fff" strokeWidth="120" d="M0 0l1260 630M0 630L1260 0"/>
          <path stroke="#e4002b" strokeWidth="80" d="M0 0l1260 630M0 630L1260 0"/>
          <path stroke="#fff" strokeWidth="200" d="M630 0v630M0 315h1260"/>
          <path stroke="#e4002b" strokeWidth="120" d="M630 0v630M0 315h1260"/>
        </svg>
      </FlagWrapper>
    );
  }
  
  if (name.includes('NİJERYA') || name.includes('NIGERIA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#008751"/>
          <rect width="1" height="2" x="1" fill="#fff"/>
        </svg>
      </FlagWrapper>
    );
  }
  
  if (name.includes('KORE') || name.includes('KOREA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#fff"/>
          <circle cx="1.5" cy="1" r="0.5" fill="#cd2e3a"/>
          <path d="M 1 1 A 0.5 0.5 0 0 0 2 1 Z" fill="#0f64cd"/>
        </svg>
      </FlagWrapper>
    );
  }
  
  if (name.includes('JAPONYA') || name.includes('JAPAN')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#fff"/>
          <circle cx="1.5" cy="1" r="0.6" fill="#bc002d"/>
        </svg>
      </FlagWrapper>
    );
  }
  
  if (name.includes('UKRAYNA') || name.includes('UKRAINE')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#0057b7"/>
          <rect width="3" height="1" y="1" fill="#ffd700"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('RUSYA') || name.includes('RUSSIA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#d52b1e"/>
          <rect width="3" height="1.33" fill="#0039a6"/>
          <rect width="3" height="0.66" fill="#fff"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('ÇİN') || name.includes('CHINA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#ee1c25"/>
          <polygon points="0.5,0.2 0.6,0.6 0.9,0.6 0.7,0.8 0.8,1.2 0.5,0.9 0.2,1.2 0.3,0.8 0.1,0.6 0.4,0.6" fill="#ffff00"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('ANGOLA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#000"/>
          <rect width="3" height="1" fill="#c8102e"/>
          <circle cx="1.5" cy="1" r="0.4" fill="none" stroke="#ffcd00" strokeWidth="0.1"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (/\b(ABD|USA|MLS)\b/i.test(name) || name.includes('AMERİKA B.B') || name.includes('AMERİKA BİRLEŞİK')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 19 10" className="w-full h-full object-cover">
          <rect width="19" height="10" fill="#bf0a30"/>
          <rect width="19" height="1" y="1" fill="#fff"/>
          <rect width="19" height="1" y="3" fill="#fff"/>
          <rect width="19" height="1" y="5" fill="#fff"/>
          <rect width="19" height="1" y="7" fill="#fff"/>
          <rect width="19" height="1" y="9" fill="#fff"/>
          <rect width="7.6" height="5.38" fill="#002868"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('BELÇİKA') || name.includes('BELGIUM')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#ed2939"/>
          <rect width="2" height="2" fill="#fcd116"/>
          <rect width="1" height="2" fill="#000"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('MEKSİKA') || name.includes('MEXICO')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#ce1126"/>
          <rect width="2" height="2" fill="#fff"/>
          <rect width="1" height="2" fill="#006847"/>
          <circle cx="1.5" cy="1" r="0.3" fill="#8c734b"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('İSVEÇ') || name.includes('SWEDEN')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 16 10" className="w-full h-full object-cover">
          <rect width="16" height="10" fill="#004b87"/>
          <rect width="16" height="2" y="4" fill="#ffcd00"/>
          <rect width="2" height="10" x="5" fill="#ffcd00"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('NORVEÇ') || name.includes('NORWAY')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 22 16" className="w-full h-full object-cover">
          <rect width="22" height="16" fill="#ba0c2f"/>
          <rect width="22" height="4" y="6" fill="#fff"/>
          <rect width="4" height="16" x="6" fill="#fff"/>
          <rect width="22" height="2" y="7" fill="#00205b"/>
          <rect width="2" height="16" x="7" fill="#00205b"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('DANİMARKA') || name.includes('DENMARK')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 37 28" className="w-full h-full object-cover">
          <rect width="37" height="28" fill="#c60c30"/>
          <rect width="37" height="4" y="12" fill="#fff"/>
          <rect width="4" height="28" x="12" fill="#fff"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('POLONYA') || name.includes('POLAND')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 8 5" className="w-full h-full object-cover">
          <rect width="8" height="5" fill="#dc143c"/>
          <rect width="8" height="2.5" fill="#fff"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('İSVİÇRE') || name.includes('SWITZERLAND')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 1 1" className="w-full h-full object-cover">
          <rect width="1" height="1" fill="#ff0000"/>
          <rect width="0.2" height="0.6" x="0.4" y="0.2" fill="#fff"/>
          <rect width="0.6" height="0.2" x="0.2" y="0.4" fill="#fff"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('AVUSTURYA') || name.includes('AUSTRIA')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 3 2" className="w-full h-full object-cover">
          <rect width="3" height="2" fill="#ed2939"/>
          <rect width="3" height="0.66" y="0.66" fill="#fff"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('İSKOÇYA') || name.includes('SCOTLAND')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 5 3" className="w-full h-full object-cover">
          <rect width="5" height="3" fill="#0065bd"/>
          <path stroke="#fff" strokeWidth="0.6" d="M0 0l5 3M0 3L5 0"/>
        </svg>
      </FlagWrapper>
    );
  }

  if (name.includes('YUNANİSTAN') || name.includes('GREECE')) {
    return (
      <FlagWrapper>
        <svg viewBox="0 0 27 18" className="w-full h-full object-cover">
          <rect width="27" height="18" fill="#0d5eaf"/>
          <rect width="27" height="2" y="2" fill="#fff"/>
          <rect width="27" height="2" y="6" fill="#fff"/>
          <rect width="27" height="2" y="10" fill="#fff"/>
          <rect width="27" height="2" y="14" fill="#fff"/>
          <rect width="10" height="10" fill="#0d5eaf"/>
          <rect width="2" height="10" x="4" fill="#fff"/>
          <rect width="10" height="2" y="4" fill="#fff"/>
        </svg>
      </FlagWrapper>
    );
  }

  // Emoji Fallbacks for everything else
  const l = name.toLocaleLowerCase('tr-TR');
  let emoji = '🌍';
  
  if (l.includes('kolombiya')) emoji = '🇨🇴';
  else if (l.includes('şili')) emoji = '🇨🇱';
  else if (l.includes('peru')) emoji = '🇵🇪';
  else if (l.includes('uruguay')) emoji = '🇺🇾';
  else if (l.includes('paraguay')) emoji = '🇵🇾';
  else if (l.includes('ekvador')) emoji = '🇪🇨';
  else if (l.includes('venezuela')) emoji = '🇻🇪';
  else if (l.includes('bolivya')) emoji = '🇧🇴';
  else if (l.includes('romanya')) emoji = '🇷🇴';
  else if (l.includes('bulgaristan')) emoji = '🇧🇬';
  else if (l.includes('sırbistan')) emoji = '🇷🇸';
  else if (l.includes('hırvatistan')) emoji = '🇭🇷';
  else if (l.includes('slovenya')) emoji = '🇸🇮';
  else if (l.includes('slovakya')) emoji = '🇸🇰';
  else if (l.includes('çekya') || l.includes('çek cumhuriyeti')) emoji = '🇨🇿';
  else if (l.includes('macaristan')) emoji = '🇭🇺';
  else if (l.includes('finlandiya')) emoji = '🇫🇮';
  else if (l.includes('izlanda')) emoji = '🇮🇸';
  else if (l.includes('galler')) emoji = '🏴󠁧󠁢󠁷󠁬󠁳󠁿';
  else if (l.includes('irlanda')) emoji = '🇮🇪';
  else if (l.includes('kanada')) emoji = '🇨🇦';
  else if (l.includes('yeni zelanda')) emoji = '🇳🇿';
  else if (l.includes('suudi arabistan') || l.includes('suudi')) emoji = '🇸🇦';
  else if (l.includes('katar')) emoji = '🇶🇦';
  else if (l.includes('b.a.e.') || l.includes('birleşik arap')) emoji = '🇦🇪';
  else if (l.includes('fas')) emoji = '🇲🇦';
  else if (l.includes('mısır')) emoji = '🇪🇬';
  else if (l.includes('cezayir')) emoji = '🇩🇿';
  else if (l.includes('tunus')) emoji = '🇹🇳';
  else if (l.includes('güney afrika')) emoji = '🇿🇦';
  else if (l.includes('hindistan')) emoji = '🇮🇳';
  else if (l.includes('tayland')) emoji = '🇹🇭';
  else if (l.includes('vietnam')) emoji = '🇻🇳';
  else if (l.includes('endonezya')) emoji = '🇮🇩';
  else if (l.includes('malezya')) emoji = '🇲🇾';
  else if (l.includes('singapur')) emoji = '🇸🇬';
  else if (l.includes('filipinler')) emoji = '🇵🇭';
  else if (l.includes('özbekistan')) emoji = '🇺🇿';
  else if (l.includes('kazakistan')) emoji = '🇰🇿';
  else if (l.includes('azerbaycan')) emoji = '🇦🇿';
  else if (l.includes('gürcistan')) emoji = '🇬🇪';
  else if (l.includes('ermenistan')) emoji = '🇦🇲';
  else if (l.includes('kıbrıs')) emoji = '🇨🇾';
  else if (l.includes('israil')) emoji = '🇮🇱';
  else if (l.includes('iran')) emoji = '🇮🇷';
  else if (l.includes('irak')) emoji = '🇮🇶';
  else if (l.includes('suriye')) emoji = '🇸🇾';
  else if (l.includes('lübnan')) emoji = '🇱🇧';
  else if (l.includes('ürdün')) emoji = '🇯🇴';
  else if (l.includes('şampiyonlar') || l.includes('uefa') || l.includes('avrupa')) emoji = '🇪🇺';
  else if (l.includes('libertadores') || l.includes('conmebol') || l.includes('sudamericana')) emoji = '🌎';
  else if (l.includes('dostluk') || l.includes('hazırlık') || l.includes('uluslararası') || l.includes('world')) emoji = '🌍';
  else if (l.includes('asya')) emoji = '🌏';
  else if (l.includes('afrika')) emoji = '🌍';
  else if (l.includes('fildişi')) emoji = '🇨🇮';
  else if (l.includes('kamerun')) emoji = '🇨🇲';
  else if (l.includes('gana')) emoji = '🇬🇭';
  else if (l.includes('senegal')) emoji = '🇸🇳';

  if (emoji !== '🌍' || l.includes('dostluk') || l.includes('uluslararası') || l.includes('hazırlık') || l.includes('world')) {
    return (
      <FlagWrapper>
        <div className="w-full h-full bg-white/5 flex items-center justify-center text-[13px] leading-none">
          {emoji}
        </div>
      </FlagWrapper>
    );
  }

  // Default Icon for unknown leagues
  return (
    <FlagWrapper>
      <div className="w-full h-full bg-white/5 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </FlagWrapper>
  );
};

const Sports1xBetView: React.FC<Sports1xBetViewProps> = ({ activeSport, onSelectMatch, feedType = 'live' }) => {
  const { global1xBetMatches, global1xBetPreMatches } = useBetting();
  const { betSlip, addSelection, removeSelection } = useBetSlip();

  const sourceMatches = feedType === 'prematch' ? global1xBetPreMatches : global1xBetMatches;

  const [collapsedLeagues, setCollapsedLeagues] = useState<Record<string, boolean>>({});
  const [starredLeagues, setStarredLeagues] = useState<string[]>([]);

  const toggleLeague = (leagueName: string) => {
    setCollapsedLeagues(prev => ({
      ...prev,
      [leagueName]: !prev[leagueName]
    }));
  };

  const toggleStar = (e: React.MouseEvent, leagueName: string) => {
    e.stopPropagation();
    setStarredLeagues(prev => 
      prev.includes(leagueName) ? prev.filter(l => l !== leagueName) : [...prev, leagueName]
    );
  };

  const getOddsButton = (match: any, market: string, label: string, oddKey: string) => {
    const val = match.odds[oddKey];
    
    // Create unique selection id based on match id and odd key
    const selectionId = `${match.id}_${oddKey}`;
    const isSelected = betSlip.some(b => b.id === selectionId);

    const handleToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isSelected) {
        removeSelection(selectionId);
      } else {
        const title = market === '1x2' ? 'Maç Sonucu' : market === 'dc' ? 'Çifte Şans' : 'Toplam Gol';
        addSelection({
          id: selectionId,
          matchId: match.id,
          matchName: `${match.homeTeam} vs ${match.awayTeam}`,
          selectionName: `${title}: ${label}`,
          odd: parseFloat(String(val).replace(',', '.')) || 1.00
        });
        window.dispatchEvent(new CustomEvent('open-betslip'));
      }
    };

    return (
      <OddsButton 
        key={`${match.id}-${oddKey}`}
        match={match}
        market={market}
        oddKey={oddKey}
        val={val}
        isSelected={isSelected}
        onToggle={handleToggle}
      />
    );
  };

  const filteredMatches = (sourceMatches || []).filter((match: any) => {
    if (!activeSport || activeSport === 'Tüm Sporlar' || activeSport === 'All Sports') return true;
    
    const searchSport = activeSport.toLowerCase();
    const matchSport = (match.sport || '').toLowerCase();
    const leagueName = (match.league || '').toLowerCase();
    const homeTeam = (match.homeTeam || '').toLowerCase();
    const awayTeam = (match.awayTeam || '').toLowerCase();
    
    const isEsportOrVirtual = 
      matchSport.includes('esport') || 
      matchSport.includes('e-sport') || 
      matchSport.includes('efootball') ||
      leagueName.includes('esport') || 
      leagueName.includes('fifa') || 
      leagueName.includes('cyber') || 
      leagueName.includes('virtual') ||
      leagueName.includes('sanal') ||
      leagueName.includes('sub') ||
      homeTeam.includes('(sub)') ||
      awayTeam.includes('(sub)');

    if (searchSport.includes('espor') || searchSport.includes('e-spor')) {
       return isEsportOrVirtual;
    }
    
    if (searchSport.includes('futbol') || searchSport.includes('soccer')) {
       if (isEsportOrVirtual) return false;
       return matchSport.includes('futbol') || matchSport.includes('soccer') || matchSport.includes('football');
    }
    if (searchSport.includes('tenis') || searchSport.includes('tennis')) {
       return matchSport.includes('tenis') || matchSport.includes('tennis');
    }
    if (searchSport.includes('basket')) {
       return matchSport.includes('basket');
    }
    return matchSport.includes(searchSport) || searchSport.includes(matchSport);
  });

  // Group by League
  const leagues = filteredMatches.reduce((acc: any, match: any) => {
    if (!acc[match.league]) acc[match.league] = [];
    acc[match.league].push(match);
    return acc;
  }, {});

  const leagueKeys = Object.keys(leagues);
  const starredKeys = leagueKeys.filter(k => starredLeagues.includes(k));
  const unstarredKeys = leagueKeys.filter(k => !starredLeagues.includes(k));
  
  const sortedLeagueEntries = [...starredKeys, ...unstarredKeys].map(k => [k, leagues[k]]);

  return (
    <div className="w-full text-white font-sans pb-20">
      <div className="flex flex-col mt-2 gap-3">
        {sortedLeagueEntries.map(([leagueName, matches]: [string, any]) => {
          const lLower = leagueName.toLocaleLowerCase('tr-TR');
          const isPremium = lLower.includes('şampiyonlar') || 
                            lLower.includes('premier') || 
                            lLower.includes('la liga') || 
                            lLower.includes('serie a') || 
                            lLower.includes('bundesliga') || 
                            lLower.includes('nba') || 
                            lLower.includes('euroleague') || 
                            lLower.includes('avrupa') || 
                            lLower.includes('dünya kupası') ||
                            lLower.includes('libertadores');

          return (
          <div key={leagueName} className={`flex flex-col rounded-2xl overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.8)] transition-all duration-300 ${isPremium ? 'bg-gradient-to-b from-[#111111] to-[#000000] shadow-[inset_0_1px_0_rgba(0,229,255,0.15),0_8px_30px_rgba(0,0,0,0.8)]' : 'bg-gradient-to-b from-[#161616] to-[#050505]'}`}>
            
            {/* LEAGUE HEADER */}
            <div 
              onClick={() => toggleLeague(leagueName)}
              className={`px-5 py-4 flex items-center justify-between cursor-pointer transition-all duration-300 relative overflow-hidden group ${isPremium ? 'hover:bg-[#1a1a1a]/80' : 'hover:bg-[#1a1a1a]/60'}`}
            >
                {isPremium && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#00E5FF] to-transparent opacity-80 shadow-[0_0_15px_#00E5FF]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,#00E5FF_0%,transparent_60%)] opacity-[0.05] pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-300" />
                  </>
                )}

                <div className="flex items-center gap-3 relative z-10">
                  <div 
                    onClick={(e) => toggleStar(e, leagueName)}
                    className="flex items-center justify-center p-1 rounded-md hover:bg-white/10 transition-colors"
                  >
                      <Star className={`w-4 h-4 ${starredLeagues.includes(leagueName) ? 'text-[color:var(--theme-accent)] fill-[color:var(--theme-accent)] drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-zinc-500 hover:text-white'}`} />
                  </div>
                  
                  <CustomFlag leagueName={leagueName} />

                  <span className={`text-[13px] uppercase tracking-wide flex items-center gap-2 ${isPremium ? 'font-extrabold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 'font-bold text-zinc-300'}`}>
                     {leagueName}
                     {isPremium && (
                       <span className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest bg-gradient-to-r from-[#00E5FF]/20 to-[#0055FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 ml-2 shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                         POPÜLER
                       </span>
                     )}
                  </span>
                  <span className={`hidden md:flex ml-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest ${isPremium ? 'text-white/70 bg-white/10' : 'text-zinc-500 bg-white/5'}`}>
                    {matches.length} MAÇ
                  </span>
                </div>
                <div className="text-zinc-500 hover:text-white transition-colors relative z-10">
                  <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${collapsedLeagues[leagueName] ? 'rotate-90' : 'rotate-270'}`} />
                </div>
            </div>

            {/* MATCHES LIST */}
            <div className={`transition-all duration-300 ${collapsedLeagues[leagueName] ? 'hidden' : 'block'}`}>
              {matches.map((match: any) => (
                <div key={match.id} className="hover:bg-[#1a1a1a]/60 hover:shadow-[inset_0_0_20px_rgba(0,229,255,0.05)] transition-all duration-300 p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 relative group/match cursor-pointer" onClick={() => onSelectMatch && onSelectMatch(match)}>
                  
                  {/* LEFT SIDE: Time & Teams */}
                  <div className="flex items-center w-full md:w-[350px] xl:w-[400px] gap-3 shrink-0">
                    
                    {/* TIME & LIVE INDICATOR */}
                    <div className="flex flex-col items-center justify-center w-[45px] shrink-0 text-center">
                      {(match.time || '').includes("'") ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[12px] md:text-[13px] font-black text-sports-accent drop-shadow-[0_0_8px_rgba(0,255,200,0.4)]">{match.time}</span>
                          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 shadow-inner">
                            <span className="relative flex h-1 w-1 md:h-1.5 md:w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sports-accent opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1 w-1 md:h-1.5 md:w-1.5 bg-sports-accent"></span>
                            </span>
                            <span className="text-[8px] md:text-[9px] text-sports-accent font-black tracking-widest uppercase">Live</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-[10px] md:text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{match.time.split(' ')[0]}</span>
                          <span className="text-[12px] md:text-[13px] text-zinc-300 font-black mt-0.5">{match.time.split(' ')[1]}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* TEAMS & SCOREBOARD */}
                    <div className="flex flex-col flex-1 min-w-0 gap-2 md:gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-[13px] md:text-[14px] font-semibold text-zinc-200 group-hover/match:text-white transition-colors truncate">{match.homeTeam}</span>
                        </div>
                        <span className="text-[14px] md:text-[15px] font-black text-sports-accent shrink-0 ml-2">{match.scoreHome !== undefined && match.scoreHome !== '-' ? match.scoreHome : '0'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-[13px] md:text-[14px] font-semibold text-zinc-200 group-hover/match:text-white transition-colors truncate">{match.awayTeam}</span>
                        </div>
                        <span className="text-[14px] md:text-[15px] font-black text-sports-accent shrink-0 ml-2">{match.scoreAway !== undefined && match.scoreAway !== '-' ? match.scoreAway : '0'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* RIGHT SIDE: ODDS DESKTOP TABLE */}
                  <div className="flex-1 w-full flex items-center justify-between md:justify-center xl:justify-center gap-2 md:gap-8 overflow-x-auto pb-1 md:pb-0 hide-scrollbar pt-2 md:pt-0 mt-1 md:mt-0 md:border-0">
                      {/* 1X2 Block */}
                      <div className="flex items-center gap-1.5 md:gap-2 relative">
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                          <span className="text-[10px] md:text-[11px] text-zinc-500 font-bold tracking-widest uppercase">1</span>
                          {getOddsButton(match, "1x2", "1", "1")}
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                          <span className="text-[10px] md:text-[11px] text-zinc-500 font-bold tracking-widest uppercase">X</span>
                          {getOddsButton(match, "1x2", "X", "X")}
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                          <span className="text-[10px] md:text-[11px] text-zinc-500 font-bold tracking-widest uppercase">2</span>
                          {getOddsButton(match, "1x2", "2", "2")}
                        </div>
                        
                        {/* Removed vertical separator line */}
                      </div>

                      {/* U/O Block */}
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                          <span className="text-[9px] md:text-[11px] text-zinc-500 font-bold tracking-widest uppercase truncate max-w-[58px] md:max-w-none">ÜST {match.odds?.tP ? `(${match.odds.tP})` : ''}</span>
                          {getOddsButton(match, "ou", "Üst", "tU")}
                        </div>
                        <div className="flex flex-col items-center gap-1 md:gap-2">
                          <span className="text-[9px] md:text-[11px] text-zinc-500 font-bold tracking-widest uppercase truncate max-w-[58px] md:max-w-none">ALT {match.odds?.tP ? `(${match.odds.tP})` : ''}</span>
                          {getOddsButton(match, "ou", "Alt", "tA")}
                        </div>
                      </div>
                      
                      {/* MORE ODDS LINK (Desktop Only) */}
                      <div className="hidden md:flex shrink-0 ml-auto items-center">
                         <button className="h-[44px] min-w-[55px] px-3 text-[13px] text-zinc-400 font-bold hover:text-white rounded-xl bg-gradient-to-b from-[#1c1c1c] to-[#121212] hover:shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-300">
                             +{match.marketCount || (match.id ? (isNaN(Number(match.id)) ? 145 : (Number(match.id) % 150) + 80) : 145)}
                         </button>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          );
        })}

        {Object.keys(leagues).length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center bg-[#101318]/90 backdrop-blur-xl rounded-2xl">
            <div className="w-12 h-12 border-4 border-white/10 border-t-sports-accent rounded-full animate-spin mb-4"></div>
            <span className="text-zinc-400 font-bold tracking-widest uppercase">Canlı Bülten Yükleniyor...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sports1xBetView;
