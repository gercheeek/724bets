import React, { useState, useEffect } from 'react';
import { Layers, Users, ChevronRight, Clock, ShieldCheck, Flame, Zap } from 'lucide-react';
import { PlayerLogo } from './PlayerLogo';

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface ComboLeg {
  match: string;
  selection: string;
  market: string;
  teamName?: string;
}

interface Combo {
  id: string;
  riskLevel: RiskLevel;
  expiresAt: number; // timestamp in ms
  players: number;
  title: string;
  legsCount: number;
  totalOdds: number;
  legs: ComboLeg[];
}

const MATCHUPS = [
  { t1: 'Fenerbahçe', t2: 'Galatasaray' },
  { t1: 'Real Madrid', t2: 'Barcelona' },
  { t1: 'Arsenal', t2: 'Chelsea' },
  { t1: 'Liverpool', t2: 'Man City' },
  { t1: 'B. Munich', t2: 'B. Dortmund' },
  { t1: 'Juventus', t2: 'Inter' },
  { t1: 'PSG', t2: 'Marseille' },
  { t1: 'Ajax', t2: 'Feyenoord' },
  { t1: 'Boca Juniors', t2: 'River Plate' },
  { t1: 'Benfica', t2: 'Porto' }
];
const MARKETS = ['Kazanan', 'Toplam Gol', '1x2', 'Handikap', 'İlk Yarı Sonucu'];

const generateRandomLeg = (apiMatches: any[]): ComboLeg => {
  let team1 = '';
  let team2 = '';

  if (apiMatches && apiMatches.length > 0) {
    const matchObj = apiMatches[Math.floor(Math.random() * apiMatches.length)];
    team1 = matchObj.home;
    team2 = matchObj.away;
  } else {
    const matchObj = MATCHUPS[Math.floor(Math.random() * MATCHUPS.length)];
    team1 = matchObj.t1;
    team2 = matchObj.t2;
  }
  
  const market = MARKETS[Math.floor(Math.random() * MARKETS.length)];
  const isOver = Math.random() > 0.5;
  const selection = market === 'Toplam Gol' ? (isOver ? 'üstü 2.5' : 'altı 2.5') : (Math.random() > 0.5 ? team1 : (Math.random() > 0.5 ? team2 : 'Beraberlik'));

  return {
    match: `${team1} - ${team2}`,
    selection: selection,
    market: market,
    teamName: selection !== 'Beraberlik' && selection !== 'üstü 2.5' && selection !== 'altı 2.5' ? selection : undefined
  };
};

const generateCombo = (risk: RiskLevel, apiMatches: any[]): Combo => {
  const legsCount = risk === 'LOW' ? 2 : 3;
  let baseOdds = 1.0;
  
  if (risk === 'LOW') baseOdds = (Math.random() * 1.5) + 1.5; // 1.50 - 3.00
  if (risk === 'MEDIUM') baseOdds = (Math.random() * 5.0) + 3.5; // 3.50 - 8.50
  if (risk === 'HIGH') baseOdds = (Math.random() * 30.0) + 15.0; // 15.00 - 45.00

  const legs = Array.from({ length: legsCount }, () => generateRandomLeg(apiMatches));
  
  // Saniye cinsinden rastgele bir süre (15 ile 45 saniye arası - test amaçlı hızlı dönmesi için)
  const expiresInSeconds = Math.floor(Math.random() * 30) + 15;

  return {
    id: Math.random().toString(36).substring(2, 9),
    riskLevel: risk,
    expiresAt: Date.now() + expiresInSeconds * 1000,
    players: Math.floor(Math.random() * 500) + 10,
    title: risk === 'LOW' ? 'Günün Bankosu' : risk === 'MEDIUM' ? 'İdeal Seçimler' : 'Büyük Vurgun',
    legsCount,
    totalOdds: Number(baseOdds.toFixed(2)),
    legs
  };
};

const RiskBadge = ({ level }: { level: RiskLevel }) => {
  if (level === 'LOW') return (
    <div className="flex items-center gap-1.5 bg-[#10b981]/20 text-[#10b981] px-2 py-1 rounded border border-[#10b981]/30">
      <ShieldCheck className="w-3.5 h-3.5" />
      <span className="text-[11px] font-black uppercase tracking-wider">Az Riskli</span>
    </div>
  );
  if (level === 'MEDIUM') return (
    <div className="flex items-center gap-1.5 bg-[#eab308]/20 text-[#eab308] px-2 py-1 rounded border border-[#eab308]/30">
      <Zap className="w-3.5 h-3.5" />
      <span className="text-[11px] font-black uppercase tracking-wider">Orta Riskli</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 bg-[#ef4444]/20 text-[#ef4444] px-2 py-1 rounded border border-[#ef4444]/30">
      <Flame className="w-3.5 h-3.5" />
      <span className="text-[11px] font-black uppercase tracking-wider">Yüksek Riskli</span>
    </div>
  );
};

const formatTimeLeft = (expiresAt: number) => {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return '00:00';
  const totalSeconds = Math.floor(diff / 1000);
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

interface FeaturedCombosProps {
  activeSport?: string;
}

const FeaturedCombos: React.FC<FeaturedCombosProps> = ({ activeSport = 'Tüm Sporlar' }) => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [now, setNow] = useState(Date.now());
  const [apiData, setApiData] = useState<any[]>([]);

  // Fetch real data from API
  useEffect(() => {
    const fetchApiMatches = async () => {
      try {
        const response = await fetch('/api/maclar');
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.success && resJson.data) {
            setApiData(resJson.data);
          }
        }
      } catch (e) {
        console.error("API verisi alınamadı", e);
      }
    };
    fetchApiMatches();
  }, []);

  useEffect(() => {
    // Initial generation (Wait for api data to load if possible, or just generate once)
    setCombos([
      generateCombo('LOW', apiData),
      generateCombo('MEDIUM', apiData),
      generateCombo('HIGH', apiData)
    ]);
    // Sadece ilk render'da veya apiData geldiğinde bir kez yükle
  }, [apiData.length > 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
      setCombos(prev => prev.map(combo => {
        if (Date.now() > combo.expiresAt) {
          return generateCombo(combo.riskLevel, apiData);
        }
        return combo;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [apiData]);

  if (combos.length === 0) return null;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-300" />
          <h2 className="text-white text-lg font-bold">Günün Öne Çıkan Kombineleri</h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#00E5FF] font-medium px-3 py-1 bg-[#00E5FF]/10 rounded-full border border-[#00E5FF]/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
          </span>
          Canlı Rotasyon Aktif
        </div>
      </div>

      <div className="flex flex-nowrap overflow-x-auto md:grid md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 snap-x snap-mandatory hide-scrollbar relative w-full">
        {combos.map((combo) => (
          <div 
            key={combo.id}
            className="snap-center shrink-0 w-[300px] sm:w-[350px] md:w-auto min-w-[300px] md:min-w-0 rounded-xl overflow-hidden relative border border-white/[0.04] border-l-[3px] hover:border-l-[#00E5FF] bg-[#0b0e14]/80 backdrop-blur-md shadow-xl flex flex-col group/combo hover:shadow-[0_8px_30px_rgba(0,229,255,0.05)] transition-all duration-300"
            style={{ borderLeftColor: combo.riskLevel === 'LOW' ? '#10b981' : combo.riskLevel === 'MEDIUM' ? '#eab308' : '#ef4444' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/[0.02] to-transparent pointer-events-none opacity-0 group-hover/combo:opacity-100 transition-opacity duration-500"></div>
            
            {/* Animasyonlu timer arka plan glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent pointer-events-none transition-colors duration-1000"></div>

            <div className="p-4 relative z-10">
              <div className="flex justify-between items-center mb-3">
                <RiskBadge level={combo.riskLevel} />
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded text-slate-300 border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span className="text-[12px] font-mono font-bold text-[#00E5FF] w-10 text-center">
                      {formatTimeLeft(combo.expiresAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold text-[16px] mb-0.5 group-hover/combo:text-[#00E5FF] transition-colors">{combo.title}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-[12px]">
                    <span className="font-bold text-white">{combo.legsCount} Seçim</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {combo.players} Oynadı</span>
                  </div>
                </div>
                <div className="text-[#00E5FF] font-black text-2xl drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">
                  {combo.totalOdds.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div className="px-4 pb-2 relative z-10 flex-1">
              <div className="flex flex-col gap-2">
                {combo.legs.map((leg, index) => (
                  <div key={index} className="border-t border-white/5 pt-2">
                    <div className="text-slate-400 text-[10px] font-medium mb-0.5 truncate">
                      {leg.match}
                    </div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                        {leg.teamName ? (
                           <div className="w-full h-full flex items-center justify-center">
                             <PlayerLogo name={leg.teamName} fallbackLogo={<span className="text-[12px]">⚽</span>} />
                           </div>
                        ) : (
                           <span className="text-[12px] opacity-50">⚽</span>
                        )}
                      </div>
                      <span className="text-white text-[13px] font-bold truncate leading-tight">{leg.selection}</span>
                    </div>
                    <div className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">
                      {leg.market}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4 pt-2 relative z-10 mt-auto">
              <button className="flex items-center gap-1 text-[#00E5FF]/70 hover:text-[#00E5FF] transition-colors mb-3 group/link">
                <span className="text-[12px] font-bold">Kupon Detayını İncele</span>
                <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
              </button>

              <button className="w-full bg-[#111620] hover:bg-[#1a2233] transition-all border border-white/5 hover:border-[#00E5FF]/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] rounded-lg py-3 px-4 flex justify-between items-center group active:scale-[0.98]">
                <span className="text-zinc-300 text-[13px] font-bold group-hover:text-white transition-colors">Hızlı Kupona Ekle</span>
                <span className="text-[#00E5FF] font-black text-[14px] group-hover:drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">
                  {combo.totalOdds.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCombos;
