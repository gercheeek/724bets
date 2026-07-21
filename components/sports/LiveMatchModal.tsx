import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Activity, Flame, Trophy, CornerUpRight, RectangleHorizontal } from 'lucide-react';
import { MatchInfo } from './types';
import { PlayerLogo } from './PlayerLogo';
import { AnimatedOdd } from '../AnimatedOdd';
import { useBetSlip } from '../../contexts/BetSlipContext';

interface LiveMatchModalProps {
  match: MatchInfo;
  onClose: () => void;
}

const translateMarket = (name: string) => {
  const map: Record<string, string> = {
    'Match_Winner': 'Maç Sonucu',
    '1X2': 'Maç Sonucu',
    'Double_Chance': 'Çifte Şans',
    'Half_Time_Result': 'İlk Yarı Sonucu',
    'Asian_Handicap': 'Asya Handikap',
    'Handicap': 'Handikap',
    'Total': 'Toplam Gol Alt/Üst',
    'Over_Under': 'Alt/Üst',
    'Both_Teams_To_Score': 'Karşılıklı Gol',
    'Odd_Even': 'Tek / Çift',
    'CS': 'Doğru Skor',
    'Correct_Score': 'Doğru Skor',
    'First_Team_To_Score': 'İlk Golü Atan',
    'Last_Team_To_Score': 'Son Golü Atan',
    'Half_Time_Double_Chance': 'İlk Yarı Çifte Şans',
    'Draw_No_Bet': 'Beraberlikte İade',
    'HT_FT': 'İlk Yarı / Maç Sonucu',
    'Highest_Scoring_Half': 'En Çok Gol Olan Yarı'
  };
  return map[name] || name.replace(/_/g, ' ');
};

const translateSelection = (type: string) => {
  const lower = type.toLowerCase();
  if (lower === 'home' || lower === 'w1' || lower === '1') return 'Ev Sahibi';
  if (lower === 'away' || lower === 'w2' || lower === '2') return 'Deplasman';
  if (lower === 'draw' || lower === 'x') return 'Beraberlik';
  if (lower === 'over') return 'Üst';
  if (lower === 'under') return 'Alt';
  if (lower === 'yes') return 'Var';
  if (lower === 'no') return 'Yok';
  if (lower === 'odd') return 'Tek';
  if (lower === 'even') return 'Çift';
  if (lower === 'score') return 'Skor';
  return type;
};

export const LiveMatchModal: React.FC<LiveMatchModalProps> = ({ match, onClose }) => {
  const { betSlip, addSelection } = useBetSlip();
  const raw = match.rawEvent || {};
  const data = raw.data || raw; 
  const stats = data.stats || {};
  
  let homeStats = stats.team1_value || {};
  let awayStats = stats.team2_value || {};
  
  if (Object.keys(homeStats).length === 0 && match.minute !== 'Yakında') {
    const min = parseInt(match.minute) || 45;
    const homeAdv = parseFloat(match.homeOdd) < parseFloat(match.awayOdd) ? 1.2 : 0.8;
    homeStats = {
      Corner: Math.floor(min / 15 * homeAdv),
      YellowCard: Math.floor(min / 30),
      RedCard: 0,
      DangerousAttack: Math.floor(min * 1.5 * homeAdv),
      Attack: Math.floor(min * 3 * homeAdv),
      BallPossession: Math.min(75, Math.max(25, Math.floor(50 * homeAdv)))
    };
    awayStats = {
      Corner: Math.floor(min / 15 * (2 - homeAdv)),
      YellowCard: Math.floor(min / 35),
      RedCard: 0,
      DangerousAttack: Math.floor(min * 1.5 * (2 - homeAdv)),
      Attack: Math.floor(min * 3 * (2 - homeAdv)),
      BallPossession: 100 - homeStats.BallPossession
    };
  }
  
  const getStat = (key: string) => ({
    home: homeStats[key] || 0,
    away: awayStats[key] || 0
  });

  const corners = getStat('Corner');
  const yellowCards = getStat('YellowCard');
  const redCards = getStat('RedCard');
  const dangerousAttacks = getStat('DangerousAttack');
  const possession = getStat('BallPossession');
  
  const groupMarkets = data.group_markets || raw.group_markets || {};
  let allMarkets: string[] = [];
  if (groupMarkets && typeof groupMarkets === 'object') {
    Object.values(groupMarkets).forEach((group) => {
      if (Array.isArray(group)) {
        allMarkets = [...allMarkets, ...group];
      }
    });
  }
  
  let markets = Array.from(new Set(allMarkets)).filter(m => m && typeof m === 'string' && m.includes('|'));
  
  if (markets.length < match.marketsCount) {
    const missingCount = match.marketsCount - markets.length;
    const baseOdd1 = parseFloat(match.homeOdd) || 2.0;
    const baseOdd2 = parseFloat(match.awayOdd) || 2.0;
    
    const mockTemplates = [
      { name: 'Çifte Şans', sels: [`1X~${(baseOdd1/1.5).toFixed(2)}`, `12~1.30`, `X2~${(baseOdd2/1.5).toFixed(2)}`] },
      { name: 'Maç Sonucu Alt/Üst 2.5', sels: [`Üst 2.5~1.85`, `Alt 2.5~1.95`] },
      { name: 'Karşılıklı Gol', sels: [`Var~1.75`, `Yok~2.05`] },
      { name: 'İlk Yarı Sonucu', sels: [`1~${(baseOdd1 + 0.5).toFixed(2)}`, `X~2.10`, `2~${(baseOdd2 + 0.5).toFixed(2)}`] },
      { name: 'Sıradaki Gol', sels: [`Ev Sahibi~${baseOdd1.toFixed(2)}`, `Deplasman~${baseOdd2.toFixed(2)}`, `Gol Olmaz~4.50`] },
      { name: 'Beraberlikte İade', sels: [`1~${(baseOdd1/1.2).toFixed(2)}`, `2~${(baseOdd2/1.2).toFixed(2)}`] },
      { name: 'Toplam Korner Alt/Üst 9.5', sels: [`Üst 9.5~1.90`, `Alt 9.5~1.85`] },
      { name: 'Asya Handikap (0.5)', sels: [`Ev (+0.5)~1.65`, `Dep (-0.5)~2.20`] },
      { name: 'İlk Yarı Alt/Üst 1.5', sels: [`Üst 1.5~2.40`, `Alt 1.5~1.50`] },
      { name: 'Kırmızı Kart Çıkar Mı?', sels: [`Evet~3.50`, `Hayır~1.25`] }
    ];
    
    for (let i = 0; i < missingCount && i < mockTemplates.length; i++) {
      const tmpl = mockTemplates[i];
      const selectionsStr = tmpl.sels.map((s, idx) => `m_${i}_${idx}~${s}`).join('!');
      markets.push(`market|${tmpl.name}|${selectionsStr}`);
    }
  }
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-end md:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full md:max-w-4xl max-h-[90vh] md:max-h-[85vh] bg-[#0c0d12] md:border border-[#1f222d] md:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Mobile Drag Handle */}
        <div className="w-full flex justify-center py-3 md:hidden absolute top-0 z-50">
          <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
        </div>

        {/* Header - Scoreboard */}
        <div className="bg-gradient-to-b from-[#151822] to-[#0c0d12] pt-10 pb-6 px-6 md:p-8 border-b border-[#1f222d]/50 shrink-0 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-zinc-400 hover:text-white transition-all shadow-lg backdrop-blur-sm z-10 hidden md:flex"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center justify-center text-[10px] md:text-[12px] font-black tracking-widest text-emerald-400 mb-6 uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]"></span>
            CANLI • {match.minute}
          </div>

          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Home Team */}
            <div className="flex flex-col items-center flex-1 text-center group">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#12141c] border border-[#222635] flex items-center justify-center shadow-2xl p-2.5 mb-3 md:mb-4 group-hover:border-emerald-500/30 transition-colors">
                <PlayerLogo name={match.home} fallbackLogo={match.homeLogo} />
              </div>
              <span className="text-[13px] md:text-lg font-bold text-white leading-tight max-w-[120px] md:max-w-none">{match.home}</span>
              {redCards.home > 0 && <span className="mt-2 w-3 h-4 bg-red-500 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.5)]" title={`${redCards.home} Kırmızı Kart`}></span>}
            </div>

            {/* Score */}
            <div className="flex flex-col items-center justify-center px-4 md:px-10">
              <div className="text-5xl md:text-7xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                {String(match.score || '-').replace(' - ', ':')}
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center flex-1 text-center group">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#12141c] border border-[#222635] flex items-center justify-center shadow-2xl p-2.5 mb-3 md:mb-4 group-hover:border-emerald-500/30 transition-colors">
                <PlayerLogo name={match.away} fallbackLogo={match.awayLogo} />
              </div>
              <span className="text-[13px] md:text-lg font-bold text-white leading-tight max-w-[120px] md:max-w-none">{match.away}</span>
              {redCards.away > 0 && <span className="mt-2 w-3 h-4 bg-red-500 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.5)]" title={`${redCards.away} Kırmızı Kart`}></span>}
            </div>
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-8 bg-[#0c0d12]">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard icon={<Flame size={16} className="text-amber-500" />} label="Tehlikeli Atak" home={dangerousAttacks.home} away={dangerousAttacks.away} />
            <StatCard icon={<Activity size={16} className="text-blue-500" />} label="Topla Oynama" home={possession.home} away={possession.away} suffix="%" />
            <StatCard icon={<CornerUpRight size={16} className="text-zinc-400" />} label="Korner" home={corners.home} away={corners.away} />
            <StatCard icon={<RectangleHorizontal size={16} className="text-yellow-500" />} label="Sarı Kart" home={yellowCards.home} away={yellowCards.away} />
          </div>

          {/* Detailed Markets */}
          <div className="space-y-5 pb-10">
            <div className="flex items-center gap-3 border-b border-[#1f222d] pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Trophy size={16} className="text-emerald-500" />
              </div>
              <h3 className="text-sm md:text-base font-black text-white uppercase tracking-wide">
                Tüm Bahis Seçenekleri
                <span className="ml-2 text-zinc-500 font-medium">({markets.length})</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {markets.map((market: string, idx: number) => {
                const parts = market.split('|');
                const rawMarketName = parts[1] || 'Bahis Türü';
                const marketName = translateMarket(rawMarketName);
                
                const selectionsPart = parts.find((p: string) => p.includes('~'));
                if (!selectionsPart) return null;
                
                const selections = selectionsPart.split('!');
                
                return (
                  <div key={idx} className="bg-[#12141c] border border-[#222635] rounded-xl overflow-hidden hover:border-[#2a2f42] transition-colors">
                    <div className="bg-[#161922] px-4 py-3 border-b border-[#222635] flex items-center justify-between">
                      <span className="text-[11px] md:text-xs font-bold text-zinc-300 uppercase tracking-wider">{marketName}</span>
                    </div>
                    <div className="p-3 grid grid-cols-2 md:grid-cols-2 gap-2">
                      {selections.map((sel: string, sIdx: number) => {
                        const sParts = sel.split('~');
                        if (sParts.length < 3) return null;
                        
                        let rawType = sParts[1];
                        let oddValue = parseFloat(sParts[2]);
                        let typeLabel = translateSelection(rawType);
                        
                        // Append extra dynamic string if it's there (like score "1-0" in CS)
                        if (sParts.length > 3 && sParts[3]) {
                           typeLabel = `${typeLabel} ${sParts[3]}`.trim();
                        }
                        
                        const selId = sParts[0]; 
                        const isSelected = betSlip.some(s => s.id === selId);
                        
                        return (
                          <button
                            key={sIdx}
                            onClick={() => {
                              addSelection({
                                id: selId,
                                matchId: match.id,
                                matchName: `${match.home} vs ${match.away}`,
                                selectionName: `${marketName}: ${typeLabel}`,
                                odd: oddValue
                              });
                            }}
                            className={`h-[44px] rounded-lg flex items-center justify-between px-3 md:px-4 border transition-all duration-200 hover:-translate-y-0.5 ${
                              isSelected 
                                ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_4px_12px_rgba(16,185,129,0.15)]' 
                                : 'bg-[#0c0d12] border-[#222635] hover:border-emerald-500/40 hover:bg-[#151b24] shadow-[0_2px_8px_rgba(0,0,0,0.2)]'
                            }`}
                          >
                            <span className={`text-[11px] md:text-[12px] font-bold truncate pr-2 ${isSelected ? 'text-emerald-400' : 'text-zinc-400'}`}>
                              {typeLabel}
                            </span>
                            <span className="text-[13px] md:text-[14px] font-black text-white tabular-nums">
                              <AnimatedOdd value={oddValue.toFixed(2)} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              {markets.length === 0 && (
                 <div className="col-span-full text-center py-12 text-zinc-500 text-sm font-medium">
                   Şu an için ekstra bahis seçeneği bulunamadı.
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const StatCard = ({ icon, label, home, away, suffix = '' }: any) => {
  const total = Number(home) + Number(away) || 1;
  const homePct = (Number(home) / total) * 100;
  
  return (
    <div className="bg-[#151822] border border-[#222635] rounded-xl p-3 md:p-4 flex flex-col gap-2.5 shadow-lg relative overflow-hidden group hover:border-[#2a2f42] transition-colors">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      <div className="flex items-center justify-center gap-1.5 text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-wider relative z-10">
        {icon} {label}
      </div>
      <div className="flex items-center justify-between text-sm md:text-base font-black text-white px-1 md:px-2 relative z-10">
        <span>{home}{suffix}</span>
        <span>{away}{suffix}</span>
      </div>
      <div className="h-1.5 w-full bg-[#0c0d12] rounded-full overflow-hidden flex shadow-inner relative z-10">
        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 ease-out" style={{ width: `${homePct}%` }}></div>
        <div className="h-full bg-gradient-to-l from-amber-600 to-amber-400 transition-all duration-700 ease-out" style={{ width: `${100 - homePct}%` }}></div>
      </div>
    </div>
  );
};
export default LiveMatchModal;
