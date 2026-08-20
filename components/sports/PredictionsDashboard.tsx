import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Bookmark, X, TrendingUp } from 'lucide-react';
import teamLogosData from '../../utils/team_logos.json';
import PredictionsPromoSlider from './PredictionsPromoSlider';

const teamLogos: Record<string, string> = teamLogosData;

interface PredictionOption {
  id: string;
  name: string;
  probability: number;
  colorClass?: string;
}

interface SubMarket {
  id: string;
  name: string;
  probability: number;
}

interface PredictionItem {
  id: string;
  question: string;
  volumePlayed: string;
  rawVolume: number;
  iconUrl?: string;
  imageFailed?: boolean;
  type: 'binary' | 'list' | 'multi_binary';
  status: string;
  options?: PredictionOption[];
  subMarkets?: SubMarket[];
  endDate?: string;
  categories?: string[];
}

export interface SelectedTrade {
  item: PredictionItem;
  optionId: string;
  optionName: string;
  probability: number;
  colorClass?: string;
}

const getEmoji = (id: string, question: string): string => {
  const q = question.toLowerCase();
  if (q.includes('transfer')) return '🤝';
  if (q.includes('şampiyon') || q.includes('kazanır')) return '🏆';
  if (q.includes('kart') || q.includes('kırmızı')) return '🟥';
  if (q.includes('gol')) return '⚽️';
  const pool = ['🏟️', '🏃', '👟', '🔥', '🌍'];
  return pool[(id.charCodeAt(0) + id.charCodeAt(id.length - 1)) % pool.length];
};

export interface TeamTheme {
  primary: string;
  secondary: string;
  logoUrl?: string;
}

export const formatTimeRemaining = (dateString?: string): string => {
  if (!dateString) return '24 SAAT';
  
  const target = new Date(dateString).getTime();
  const now = Date.now();
  const diff = target - now;
  
  if (diff <= 0) return 'SONUÇ';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} GÜN`;
  if (hours > 0) return `${hours} SAAT`;
  if (minutes > 0) return `${minutes} DK`;
  return 'SONUÇ';
};

export const getTeamTheme = (question: string): TeamTheme | null => {
  const q = question.toLowerCase();
  // Teams
  if (q.includes('galatasaray') || q.includes('cimbom')) return { primary: '#A90432', secondary: '#FDB912', logoUrl: teamLogos['galatasaray'] };
  if (q.includes('fenerbahçe') || q.includes('fenerbahce')) return { primary: '#001E61', secondary: '#FDB913', logoUrl: teamLogos['fenerbahçe'] || teamLogos['fenerbahce'] };
  if (q.includes('beşiktaş') || q.includes('besiktas')) return { primary: '#1A1A1A', secondary: '#8A8A8A', logoUrl: teamLogos['beşiktaş'] || teamLogos['besiktas'] };
  if (q.includes('trabzonspor')) return { primary: '#831D3A', secondary: '#419EDC', logoUrl: teamLogos['trabzonspor'] };
  if (q.includes('real madrid')) return { primary: '#FFFFFF', secondary: '#00529F', logoUrl: teamLogos['real madrid'] };
  if (q.includes('barcelona')) return { primary: '#A50044', secondary: '#004D98', logoUrl: teamLogos['barcelona'] };
  if (q.includes('bayern')) return { primary: '#DC052D', secondary: '#0066B2', logoUrl: teamLogos['bayern munich'] };
  if (q.includes('arsenal')) return { primary: '#EF0107', secondary: '#063672', logoUrl: teamLogos['arsenal'] };
  if (q.includes('manchester city') || q.includes('m. city')) return { primary: '#6CABDD', secondary: '#1C2C5B', logoUrl: teamLogos['manchester city'] };
  
  // Leagues & Tournaments
  if (q.includes('süper lig') || q.includes('super lig')) return { primary: '#37003c', secondary: '#00ff85', logoUrl: teamLogos['super lig'] || 'https://assets.football-logos.cc/logos/turkey/700x700/super-lig.c70194ee.png' };
  if (q.includes('premier') || q.includes('epl')) return { primary: '#38003C', secondary: '#00FF85', logoUrl: teamLogos['english premier league'] || 'https://assets.football-logos.cc/logos/england/700x700/english-premier-league.ee1e9b08.png' };
  if (q.includes('la liga')) return { primary: '#EE3344', secondary: '#000000', logoUrl: teamLogos['la liga'] || 'https://assets.football-logos.cc/logos/spain/700x700/la-liga.d69e4ce8.png' };
  if (q.includes('serie a')) return { primary: '#0033A0', secondary: '#2489C6', logoUrl: teamLogos['serie a'] || 'https://assets.football-logos.cc/logos/italy/700x700/serie-a.fbc4170c.png' };
  if (q.includes('champions league') || q.includes('şampiyonlar ligi')) return { primary: '#001E61', secondary: '#00FFFF', logoUrl: teamLogos['uefa champions league'] || 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/UEFA_Champions_League_logo_2.svg/1200px-UEFA_Champions_League_logo_2.svg.png' };

  // ─── Magazin / Genel Kategoriler ──────────────────────────────────────────
  if (q.includes('survivor')) return { primary: '#FF6B00', secondary: '#FFD700' };
  if (q.includes('oscar') || q.includes('ödül')) return { primary: '#D4AF37', secondary: '#1C1C1C' };
  if (q.includes('iphone') || q.includes('apple')) return { primary: '#A2AAAD', secondary: '#333333' };
  if (q.includes('trump')) return { primary: '#C41E3A', secondary: '#002868' };
  if (q.includes('enflasyon') || q.includes('ekonomi') || q.includes('togg')) return { primary: '#16A34A', secondary: '#064E3B' };
  if (q.includes('deprem')) return { primary: '#DC2626', secondary: '#7F1D1D' };
  if (q.includes('siyaset') || q.includes('parti') || q.includes('tutukla')) return { primary: '#7C3AED', secondary: '#1E1B4B' };

  return null;
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
const PredictionsDashboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState<PredictionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState<SelectedTrade | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`/api/evetabi/market?mode=tahmin&page=1&limit=200`);
        const json = await res.json();
        
        if (json.success && json.data) {
          let rawItems = json.data;

          setData(rawItems.map((item: any) => {
            const isGroup = item.structure === 'GROUP_PARENT';
            const type: PredictionItem['type'] = isGroup
              ? 'multi_binary'
              : item.outcomes?.length > 2 ? 'list' : 'binary';
            const rawVol = parseFloat(item.totalVolume) || 0;
            return {
              id: item.id, type,
              status: item.status || 'active',
              question: item.question,
              rawVolume: rawVol,
              volumePlayed: rawVol > 0 ? `₺${(rawVol / 1000).toFixed(1)} B` : '₺0',
              endDate: item.endDate || item.closeDate || null,
              categories: item.categories?.map((c: any) => c.name) || [],
              iconUrl: item.image || null,
              options: item.outcomes?.map((o: any, i: number) => ({
                id: o.id, name: o.name,
                probability: Math.round(o.probability) || 50,
                colorClass: i === 0 ? '#10B981' : '#F43F5E',
              })),
              subMarkets: isGroup && item.subMarkets
                ? item.subMarkets.map((sub: any) => {
                    const e = sub.outcomes?.find((o: any) => o.name === 'Evet' || o.name === 'Yes');
                    return { id: sub.id, name: sub.question || sub.slug?.split('-').join(' ') || '—', probability: e ? Math.round(e.probability) : 50 };
                  })
                : undefined,
            };
          }));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally { 
        if (!silent) setLoading(false); 
      }
    };

    fetchData(); // Initial load

    // 15 dk'da bir sessiz güncelleme (loading=false)
    interval = setInterval(() => {
      fetchData(true);
    }, 15 * 60 * 1000);

    // Sayfa tekrar görünür olduğunda verileri güncelle (ve polling gereksiz yere çalışmasın)
    const handleVisibility = () => {
      if (document.hidden) {
        clearInterval(interval);
      } else {
        fetchData(true);
        interval = setInterval(() => {
          fetchData(true);
        }, 15 * 60 * 1000);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const handleErr = (id: string) =>
    setData(p => p.map(i => i.id === id ? { ...i, imageFailed: true } : i));

  const active = data.filter(d => d.status === 'active');
  const ended  = data.filter(d => d.status !== 'active');

  const uniqueCategories = ['Tümü', ...Array.from(new Set(active.flatMap(d => d.categories || []))).sort((a, b) => a.localeCompare(b, 'tr'))];

  const filteredActive = active.filter(d => 
    (activeCategory === 'Tümü' || (d.categories && d.categories.includes(activeCategory))) &&
    d.question.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredEnded = ended.filter(d => 
    (activeCategory === 'Tümü' || (d.categories && d.categories.includes(activeCategory))) &&
    d.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-screen px-5 py-6 pb-28 text-white overflow-hidden">
      <div className="flex flex-col gap-6 mb-8">
        
        {/* ── Row 1: Header & Search ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[24px] font-black tracking-tight text-white">Piyasalar</h1>
            <span className="text-[13px] font-semibold text-zinc-500 bg-white/5 px-2.5 py-1 rounded-full">
              {filteredActive.length} piyasa
            </span>
          </div>

          <div className="relative w-full md:w-auto">
            <svg 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Piyasa ara... (Örn: Beşiktaş, Survivor)"
              className="w-full md:w-[320px] bg-[#0A0C10] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-white font-medium text-[13px] focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-600 shadow-inner"
            />
          </div>
        </div>

        {/* ── Row 2: Category Tabs (Full Width) ── */}
        <div className="relative border-b border-white/[0.08]">
          <div 
            className="flex items-center gap-8 overflow-x-auto scroll-smooth hide-scrollbar pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-1 pb-4 pt-1 font-bold text-[14px] whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-white rounded-t-full shadow-[0_-2px_12px_rgba(255,255,255,0.8)] z-10" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-6 h-6 border-[1.5px] border-zinc-700 border-t-zinc-400 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {filteredActive.length > 0 && (
            <PredictionsPromoSlider predictions={filteredActive} />
          )}

          {filteredActive.length > 0 && (
            <div className="columns-1 md:columns-2 xl:columns-3 gap-[14px]">
              {filteredActive.map(item => (
                <div key={item.id} className="break-inside-avoid mb-[14px]">
                  <Card 
                    item={item} 
                    onErr={() => handleErr(item.id)} 
                    active 
                    onSelectTrade={setSelectedTrade} 
                    isLobi={true}
                  />
                </div>
              ))}
            </div>
          )}

          {filteredEnded.length > 0 && (
            <div className="mt-12">
              <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest mb-4">Sonuçlanmış</p>
              <div className="columns-1 md:columns-2 xl:columns-3 gap-[14px] opacity-35 hover:opacity-60 transition-opacity duration-500">
                {filteredEnded.map(item => (
                  <div key={item.id} className="break-inside-avoid mb-[14px]">
                    <Card 
                      item={item} 
                      onErr={() => handleErr(item.id)} 
                      active={false} 
                      onSelectTrade={setSelectedTrade} 
                      isLobi={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <TradePanel trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
    </div>
  );
};

const Card = ({ item, onErr, active, onSelectTrade, isLobi }: any) => {
  const [saved, setSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isLobi);
  
  const hot = active && item.rawVolume > 100_000;
  const theme = getTeamTheme(item.question);

  const volStr = item.volumePlayed?.toString() || '0';
  const numOnly = volStr.replace(/[^0-9]/g, '');
  const displayVol = numOnly ? parseInt(numOnly, 10).toLocaleString('tr-TR') : '45.000';

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col rounded-[20px] transition-all duration-300 bg-[#0E1017] border border-white/[0.07] overflow-hidden
        ${active ? 'cursor-pointer hover:border-white/[0.15] hover:shadow-[0_16px_48px_rgba(0,0,0,0.7)]' : 'opacity-50 grayscale-[30%] pointer-events-none'}
        ${isExpanded ? (active ? 'hover:-translate-y-1' : '') : 'hover:-translate-y-0.5'}
      `}
      style={{ height: isExpanded ? 'auto' : 138 }}
    >
      {/* ─── BANNER (Option B: watermark logo) ─── */}
      <div
        className="relative h-[88px] w-full flex-shrink-0 overflow-hidden flex flex-col justify-between p-4"
        style={{
          background: active
            ? theme
              ? `linear-gradient(135deg, ${theme.primary}EE 0%, ${theme.secondary}44 100%)`
              : `linear-gradient(135deg, #1A2540 0%, #0C1020 100%)`
            : '#14161D'
        }}
      >
        {/* Top shimmer line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        {/* Bottom fade to body */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Logo — WATERMARK: High quality, vibrant, but smoothly faded into background */}
        {active && theme?.logoUrl && (
          <img
            src={theme.logoUrl}
            alt=""
            className="absolute right-0 -bottom-2 w-[110px] h-[110px] object-contain opacity-[0.45] pointer-events-none select-none drop-shadow-2xl mix-blend-screen"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)'
            }}
          />
        )}

        {/* Question — FULL WIDTH, no logo obstruction */}
        <h3 className="relative z-10 text-white font-extrabold text-[16px] leading-[1.3] line-clamp-2 w-full pr-[90px] drop-shadow-[0_2px_12px_rgba(0,0,0,1)]">
          {item.question}
        </h3>
      </div>

      {/* ─── DATA STRIP ─── */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.06] bg-[#090B10] border-y border-white/[0.06]">
        <div className="flex flex-col justify-center px-3 py-2">
          <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-600 font-bold">Havuz</span>
          <span className="text-[13px] font-black text-white font-mono leading-tight mt-0.5">TL {displayVol}</span>
        </div>
        <div className="flex flex-col justify-center px-3 py-2">
          <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-600 font-bold">Kapanış</span>
          <span className="text-[13px] font-black text-zinc-200 font-mono leading-tight mt-0.5">{formatTimeRemaining(item.endDate)}</span>
        </div>
        <div className="flex flex-col justify-center px-3 py-2">
          <span className="text-[8px] uppercase tracking-[0.15em] text-zinc-600 font-bold">Volatilite</span>
          <span className={`text-[13px] font-black font-mono leading-tight mt-0.5 ${hot ? 'text-rose-400' : 'text-emerald-400'}`}>
            {hot ? 'YÜKSEK' : 'NORMAL'}
          </span>
        </div>
      </div>

      {/* ─── BODY ─── */}
      {isExpanded && (
        <div className="flex-1 flex flex-col px-4 py-3 bg-[#0E1017]">
          <div className="flex-1 min-h-0 flex flex-col justify-center animate-in fade-in zoom-in-95 duration-200">
            {item.type === 'binary'       && item.options    && <BinaryBody opts={item.options}      active={active} item={item} onSelectTrade={onSelectTrade} theme={theme} />}
            {item.type === 'list'         && item.options    && <ListBody   opts={item.options}       active={active} item={item} onSelectTrade={onSelectTrade} theme={theme} />}
            {item.type === 'multi_binary' && item.subMarkets && <MultiBody  subs={item.subMarkets}   active={active} item={item} onSelectTrade={onSelectTrade} theme={theme} />}
          </div>
        </div>
      )}

      {/* ─── COLLAPSED INDICATOR ─── */}
      {!isExpanded && (
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-white/70 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          Görüntüle
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      )}
    </div>
  );
};

// ─── Binary Body (Neon Stroke V2) ─────────────────────────────────────────────
const BinaryBody: React.FC<{ 
  opts: PredictionOption[]; 
  active: boolean;
  item: PredictionItem;
  onSelectTrade: (t: SelectedTrade) => void;
  theme: TeamTheme | null;
}> = ({ opts, active, item, onSelectTrade, theme }) => {
  const [yes, no] = opts;
  if (!yes || !no) return null;

  const colorYes = theme?.primary || '#10B981';
  const colorNo = theme?.secondary || '#F43F5E';

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500">İŞLEM SEÇENEKLERİ</span>
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-500">ORAN</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[yes, no].map((opt) => {
          const isYes = opt.colorClass === '#10B981';
          const c = isYes ? colorYes : colorNo;
          return (
            <button
              key={opt.id}
              disabled={!active}
              onClick={(e) => {
                e.stopPropagation();
                onSelectTrade({ item, optionId: opt.id, optionName: opt.name, probability: opt.probability, colorClass: c });
              }}
              className={`relative flex flex-col items-center justify-center h-[72px] rounded-xl bg-white/[0.02] transition-all duration-200 group/btn border
                ${active ? 'hover:bg-white/[0.04] border-white/[0.05] hover:border-white/[0.15]' : 'opacity-40 border-transparent'}`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 z-10 group-hover/btn:text-white transition-colors">{opt.name}</span>
              <span className="text-[22px] font-black text-white z-10 leading-none">{opt.probability}%</span>
              
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl opacity-60 overflow-hidden">
                <div className="h-full" style={{ width: `${opt.probability}%`, backgroundColor: c }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ListBody: React.FC<{ 
  opts: PredictionOption[]; 
  active: boolean;
  item: PredictionItem;
  onSelectTrade: (t: SelectedTrade) => void;
  theme: TeamTheme | null;
}> = ({ opts, active, item, onSelectTrade, theme }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const max = Math.max(...opts.map(o => o.probability), 1);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const rankColor = (i: number) => {
    if (!active) return 'text-zinc-700';
    if (i === 0) return theme?.secondary || '#FBBF24';
    if (i === 1) return theme?.primary ? `${theme.primary}B3` : '#94A3B8';
    if (i === 2) return theme?.primary ? `${theme.primary}80` : '#B45309';
    return 'text-zinc-600';
  };

  return (
    <div
      ref={ref}
      className="flex flex-col h-full overflow-hidden"
      style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
    >
      {opts.map((opt, i) => {
        const rc = rankColor(i);
        const isHex = rc.startsWith('#');
        const c = theme?.primary || '#3B82F6';

        return (
          <button
            key={i}
            disabled={!active}
            onClick={(e) => {
                e.stopPropagation();
                onSelectTrade({ item, optionId: opt.id, optionName: opt.name, probability: opt.probability, colorClass: c });
            }}
            className={`w-full flex items-center justify-between py-2 px-3 mb-2 rounded-[10px] transition-all duration-200 group/list bg-white/[0.02] border border-white/[0.03]
              ${active ? 'hover:bg-white/[0.05] hover:border-white/10 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
          >
            <div className="flex items-center gap-3">
              <span 
                className={`text-[12px] font-black w-4 text-center flex-shrink-0 ${!isHex ? rc : ''}`}
                style={isHex ? { color: rc } : undefined}
              >
                {i + 1}
              </span>
              <span className="text-[13px] text-left truncate font-semibold text-zinc-300 group-hover/list:text-white transition-colors">
                {opt.name}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {active && (
                <div className="w-16 h-1 bg-black rounded-full overflow-hidden border border-white/5">
                  <div className="h-full rounded-full transition-all duration-1000" 
                       style={{ width: visible ? `${(opt.probability / max) * 100}%` : '0%', backgroundColor: c }} />
                </div>
              )}
              <span className={`text-[13px] font-black w-10 text-right tabular-nums flex-shrink-0
                ${active ? (i === 0 ? (isHex ? '' : 'text-white') : 'text-zinc-400') : 'text-zinc-600'}`}
                style={(active && i === 0 && isHex) ? { color: c } : undefined}
              >
                {opt.probability}%
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ─── Multi Body (Clean Lines V2) ──────────────────────────────────────────────
const MultiBody: React.FC<{ 
  subs: SubMarket[]; 
  active: boolean;
  item: PredictionItem;
  onSelectTrade: (t: SelectedTrade) => void;
  theme: TeamTheme | null;
}> = ({ subs, active, item, onSelectTrade, theme }) => {
  const colorYes = theme?.primary || '#10B981';
  const colorNo = theme?.secondary || '#F43F5E';

  return (
    <div
      className="flex flex-col gap-1 h-full overflow-hidden"
      style={{ maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)' }}
    >
      {subs.map((sub, i) => (
        <div
          key={i}
          className={`flex items-center gap-2 py-1.5 px-2 rounded-xl transition-all duration-200 group
            ${active ? 'hover:bg-white/[0.02]' : 'opacity-35'}`}
        >
          {/* Name */}
          <span
            className={`text-[12px] font-semibold flex-1 truncate ${active ? 'text-zinc-300 group-hover:text-white' : 'text-zinc-600'}`}
            title={sub.name}
          >
            {sub.name}
          </span>

          {/* Evet / Hayır pill-pair */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {[
              { label: 'Evet', val: sub.probability, yes: true },
              { label: 'Hayır', val: 100 - sub.probability, yes: false },
            ].map(({ label, val, yes }) => {
              const c = yes ? colorYes : colorNo;
              return (
                <button
                  key={label}
                  disabled={!active}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrade({ 
                      item: { ...item, question: `${item.question} - ${sub.name}` },
                      optionId: `${sub.id}-${yes}`, 
                      optionName: label, 
                      probability: val, 
                      colorClass: c 
                    });
                  }}
                  className={`relative flex flex-col items-center justify-center rounded-[10px] transition-all duration-200 active:scale-95 bg-white/[0.015]
                    ${active ? 'hover:bg-white/[0.04]' : 'cursor-not-allowed opacity-50'}`}
                  style={{ 
                    width: 52, 
                    height: 40, 
                    border: `1px solid ${active ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'}` 
                  }}
                  onMouseEnter={(e) => {
                    if (active) {
                      e.currentTarget.style.borderColor = `${c}50`;
                      e.currentTarget.style.boxShadow = `0 4px 12px ${c}1A`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (active) {
                      e.currentTarget.style.borderColor = `rgba(255,255,255,0.06)`;
                      e.currentTarget.style.boxShadow = `none`;
                    }
                  }}
                >
                  <span className={`text-[8.5px] font-bold uppercase tracking-wider`}
                    style={{ color: active ? '#9CA3AF' : '#555' }}>
                    {label}
                  </span>
                  <span className={`text-[13.5px] font-extrabold leading-none mt-0.5`}
                    style={{ color: active ? '#FFF' : '#333' }}>
                    {val}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Trade Panel (Slide-over Drawer) ──────────────────────────────────────────
const TradePanel: React.FC<{ trade: SelectedTrade | null; onClose: () => void }> = ({ trade, onClose }) => {
  const [stake, setStake] = useState<string>('100');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trade) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [trade]);

  // Keep rendering if trade is null but isVisible is true to allow slide-out animation to finish
  if (!trade && !isVisible) return null;

  // Use the last known trade to keep the UI populated during the slide-out transition
  const activeTrade = trade || {} as SelectedTrade;
  
  const numStake = parseFloat(stake) || 0;
  const price = (activeTrade?.probability || 0) / 100;
  const shares = price > 0 ? (numStake / price).toFixed(2) : '0';
  const potentialReturn = price > 0 ? (parseFloat(shares) * 1).toFixed(2) : '0';
  const profit = (parseFloat(potentialReturn) - numStake).toFixed(2);

  const isYes = activeTrade?.colorClass === '#10B981' || activeTrade?.optionName?.toLowerCase() === 'evet';

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[999998] transition-opacity duration-300 ${trade ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-[100dvh] w-full sm:w-[400px] bg-[#0C0E14] border-l border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-[999999] flex flex-col transform transition-transform duration-300 ease-out ${trade ? 'translate-x-0' : 'translate-x-full'}`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h2 className="text-[16px] font-bold text-white">Alım Yap</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          
          {/* Market Info */}
          <div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Piyasa</p>
            <p className="text-[15px] font-medium text-zinc-200 leading-snug">{activeTrade?.item?.question}</p>
          </div>

          {/* Selected Option */}
          <div className={`p-4 rounded-xl border ${isYes ? 'bg-emerald-500/[0.05] border-emerald-500/20' : 'bg-rose-500/[0.05] border-rose-500/20'}`}>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[12px] font-bold uppercase tracking-wider ${isYes ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeTrade?.optionName}
              </span>
              <span className={`text-[18px] font-black ${isYes ? 'text-emerald-400' : 'text-rose-400'}`}>
                {activeTrade?.probability}%
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Hisse fiyatı: ₺{price.toFixed(2)}</p>
          </div>

          {/* Stake Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-semibold text-zinc-400">Yatırım Tutarı (₺)</label>
              <span className="text-[11px] font-medium text-zinc-600">Bakiye: ₺0.00</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₺</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="w-full bg-[#151720] border border-white/10 rounded-xl py-3.5 pl-8 pr-4 text-white font-bold text-[16px] focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-600"
                placeholder="0"
              />
            </div>
            
            {/* Quick amounts */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[50, 100, 250, 500].map(amt => (
                <button
                  key={amt}
                  onClick={() => setStake(amt.toString())}
                  className="py-2.5 rounded-[10px] bg-white/[0.03] hover:bg-white/[0.08] text-[12px] font-bold text-zinc-300 transition-colors"
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Math Output */}
          <div className="mt-auto bg-[#151720] rounded-xl p-4 border border-white/5 space-y-3.5">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-zinc-500 font-medium">Tahmini Hisse</span>
              <span className="text-zinc-200 font-bold tabular-nums">{shares}</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-zinc-500 font-medium">Potansiyel Kazanç</span>
              <span className="text-emerald-400 font-bold tabular-nums">₺{potentialReturn}</span>
            </div>
            <div className="h-px bg-white/5 w-full my-1.5" />
            <div className="flex justify-between items-center text-[14px]">
              <span className="text-zinc-400 font-medium">Net Kâr</span>
              <span className="text-emerald-400 font-black tabular-nums">+₺{profit}</span>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 bg-[#0C0E14]">
          <button className="w-full py-4 rounded-xl bg-[#E2B75E] hover:bg-[#D5A953] text-black font-black text-[15px] transition-colors flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Satın Al
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default PredictionsDashboard;
