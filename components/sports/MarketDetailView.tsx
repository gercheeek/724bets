import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, TrendingUp, Info, MessageCircle, Share2, Bookmark, User, Send } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { PredictionItem } from './PredictionsDashboard';
import { useBetSlip } from '../../contexts/BetSlipContext';

interface MarketDetailViewProps {
  onNavigate?: (view: string) => void;
}

// Generate some fake chart data
const generateChartData = (currentProb: number) => {
  const data = [];
  let prob = currentProb;
  for (let i = 0; i < 30; i++) {
    data.push({
      time: i,
      prob: prob,
      noProb: 100 - prob
    });
    // Random walk with mean reversion
    prob = Math.max(10, Math.min(90, prob + (Math.random() - 0.5) * 10 + (currentProb - prob) * 0.1));
  }
  return data.reverse();
};

export default function MarketDetailView({ onNavigate }: MarketDetailViewProps) {
  const navigate = useNavigate();
  const [item, setItem] = useState<PredictionItem | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState('TÜMÜ');
  const [tradeAmount, setTradeAmount] = useState('100');
  const [comments, setComments] = useState<any[]>([
    { id: 1, user: 'galender', avatar: '🧙‍♂️', text: 'bence çok net evet olacak bu', time: '12:30' },
    { id: 2, user: 'dochka2002', avatar: '🥷', text: 'oranlar neden bu kadar düşük?', time: '13:45' },
    { id: 3, user: 'kingsemco', avatar: '👨‍🚀', text: 'hayır basanlar patlayacak rez alın', time: '14:20' }
  ]);
  const [newComment, setNewComment] = useState('');
  
  const [suggestions, setSuggestions] = useState<PredictionItem[]>([]);
  const { addSelection } = useBetSlip();

  // Extract ID from pathname as a fallback if useParams is tricky with custom routing
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];
    
    (async () => {
      try {
        const res = await fetch('/api/evetabi/market?tab=magazin&mode=tahmin&page=1&limit=50');
        const json = await res.json();
        if (json.success && json.data) {
          const rawItems = json.data.map((item: any) => {
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
              iconUrl: item.image || null,
              category: item.categories?.[0]?.name || 'Piyasa',
              options: item.outcomes?.map((o: any, i: number) => ({
                id: o.id, name: o.name,
                probability: Math.round(o.probability) || 50,
                colorClass: i === 0 ? '#10B981' : '#F43F5E',
              }))
            };
          });
          
          let foundItem = rawItems.find((i: any) => i.id === slug) || rawItems.find((i: any) => i.type === 'binary') || rawItems[0];
          setItem(foundItem);
          
          if (foundItem && foundItem.options && foundItem.options[0]) {
             setChartData(generateChartData(foundItem.options[0].probability));
          }
          
          setSuggestions(rawItems.filter((i: any) => i.id !== foundItem?.id && i.type === 'binary').slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!item) return <div className="p-10 text-white flex justify-center items-center h-full"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div></div>;

  const yesOpt = item.options?.find(o => o.colorClass === '#10B981') || item.options?.[0];
  const noOpt = item.options?.find(o => o.colorClass === '#EF4444') || item.options?.[1];

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('tahminler');
      // Update URL
      window.history.pushState(null, '', '/tahminler');
    } else {
      navigate(-1);
    }
  };

  const handleBuy = (opt: any) => {
    if (!opt) return;
    addSelection({
      id: `${item.id}-${opt.id}`,
      matchId: item.id,
      matchName: item.question,
      selectionId: opt.id,
      selectionName: opt.name,
      odds: opt.probability / 100, // Dummy odds based on probability
      isLive: true,
      category: item.category
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0C10] text-white overflow-y-auto custom-scrollbar relative animate-fade-in">
      
      {/* ─── HEADER ─── */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0C10]/90 backdrop-blur-md border-b border-white/[0.05]">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-0.5">{item.category}</span>
            <h1 className="text-sm font-bold text-white line-clamp-1 max-w-[400px] lg:max-w-[800px]">{item.question}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-400">15g 07s 20dk</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400"><MessageCircle className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400"><Share2 className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-zinc-400"><Bookmark className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* ─── LEFT COLUMN (Chart & Details) ─── */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Chart Section */}
          <div className="bg-[#050608] border border-white/[0.05] rounded-[24px] p-6 flex flex-col h-[450px] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10 gap-4">
              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2">OLASILIKLAR</span>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_#10B981]" />
                      <span className="text-sm font-bold text-zinc-300">Evet <span className="text-emerald-400 ml-1 font-mono text-lg">{yesOpt?.probability}%</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_#F43F5E]" />
                      <span className="text-sm font-bold text-zinc-300">Hayır <span className="text-rose-400 ml-1 font-mono text-lg">{noOpt?.probability}%</span></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/[0.05]">
                {['1S', '6S', '24S', 'TÜMÜ'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-4 py-1.5 text-[11px] font-bold rounded-lg transition-all ${timeFilter === t ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Fake SVG Line Chart */}
            <div className="flex-1 w-full relative z-10 flex items-end pt-10">
               <div className="w-full h-full relative">
                 {/* Y Axis lines */}
                 {[0, 25, 50, 75, 100].map((val) => (
                   <div key={val} className="absolute w-full border-t border-white/[0.03] flex items-center" style={{ bottom: `${val}%` }}>
                     <span className="absolute -right-2 sm:-right-8 text-[9px] font-mono text-zinc-600 translate-y-[-50%] bg-[#050608] pl-2">{val}%</span>
                   </div>
                 ))}
                 
                 {/* SVG Line */}
                 <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradientYes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    
                    {/* Render Line */}
                    {chartData.length > 0 && (() => {
                      const points = chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 100;
                        const y = 100 - d.prob;
                        return `${x}%,${y}%`;
                      }).join(' ');
                      
                      const fillPoints = `0%,100% ${points} 100%,100%`;
                      
                      return (
                        <>
                          <polygon points={fillPoints} fill="url(#gradientYes)" className="transition-all duration-1000" />
                          <polyline 
                            points={points} 
                            fill="none" 
                            stroke="#10B981" 
                            strokeWidth="3" 
                            style={{ filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.4))' }} 
                            vectorEffect="non-scaling-stroke"
                            className="transition-all duration-1000"
                          />
                        </>
                      );
                    })()}
                 </svg>
               </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/[0.05] flex justify-between items-center z-10">
              <span className="text-[11px] text-zinc-500 font-mono tracking-wide">Toplam Hacim: <strong className="text-zinc-300">₺{(item.volumePlayed || '107,500').replace(/[^0-9,]/g, '')}</strong></span>
              <span className="text-[11px] text-zinc-500 font-mono tracking-wide">Son Güncelleme: 1dk önce</span>
            </div>
          </div>

          {/* Rules and Comments Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Rules */}
            <div className="bg-[#050608] border border-white/[0.05] rounded-[24px] p-6 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Bu Tahminin Kuralları</h3>
              </div>
              <div className="space-y-4 text-[13px] text-zinc-400 leading-relaxed flex-1">
                <p>Bu piyasada, <strong>"{item.question}"</strong> sorusunun yanıtı tahmin edilmektedir.</p>
                <ul className="list-disc pl-4 space-y-2 marker:text-zinc-600 mt-3">
                  <li>Sonuçlar güvenilir, resmi haber kaynakları ve doğrulayıcı platformlar üzerinden teyit edilir.</li>
                  <li>İlgili piyasanın belirlenen bitiş tarihinden önce sonuçlanması durumunda işlemler erken kapatılabilir.</li>
                  <li>Hatalı açılan veya iptal edilen etkinliklerde tutarlar iade edilir.</li>
                </ul>
              </div>
              <button className="mt-4 text-[11px] uppercase tracking-widest text-emerald-400 font-bold hover:text-emerald-300 transition-colors w-fit">Daha fazla göster ▾</button>
            </div>

            {/* Comments */}
            <div className="bg-[#050608] border border-white/[0.05] rounded-[24px] p-6 flex flex-col h-[400px]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Yorumlar</h3>
                </div>
                <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded-full text-zinc-300">12</span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-5 mb-5">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-black border border-white/10 flex items-center justify-center text-lg shrink-0 shadow-sm">
                      {c.avatar}
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-300">@{c.user}</span>
                        <span className="text-[10px] text-zinc-600 font-mono">{c.time}</span>
                      </div>
                      <p className="text-[13px] text-zinc-400 mt-1 leading-snug">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="relative mt-auto">
                <input 
                  type="text" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Yorum yaz..." 
                  className="w-full bg-[#000000] border border-white/[0.1] rounded-xl pl-4 pr-12 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
        
        {/* ─── RIGHT COLUMN (Trading Panel) ─── */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0 pb-10">
          
          {/* Trade Panel */}
          <div className="bg-[#050608] border border-white/[0.05] rounded-[24px] p-6 shadow-2xl relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />
            
            <div className="flex items-start gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center p-2 border border-white/10 shrink-0 shadow-lg">
                 <TrendingUp className="w-6 h-6 text-white/80" />
              </div>
              <h2 className="text-[15px] font-bold leading-snug">{item.question}</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
              <button 
                className="flex flex-col items-center justify-center py-5 rounded-2xl transition-all duration-300 border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 shadow-[0_4px_24px_rgba(16,185,129,0.15)] group"
              >
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-1 group-hover:scale-105 transition-transform">EVET</span>
                <span className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{yesOpt?.probability}%</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center py-5 rounded-2xl transition-all duration-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 group"
              >
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-1 group-hover:scale-105 transition-transform">HAYIR</span>
                <span className="text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">{noOpt?.probability}%</span>
              </button>
            </div>

            <div className="space-y-5 relative z-10">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">TUTAR (₺)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="w-full bg-[#000000] border border-white/[0.1] rounded-xl pl-4 pr-16 py-4 text-xl font-black text-white focus:outline-none focus:border-emerald-500/50 transition-colors text-right font-mono shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-lg">₺</span>
                </div>
                <div className="flex justify-between items-center px-1 mt-1">
                  <span className="text-xs text-zinc-500">Bakiye: <strong className="text-zinc-300 font-mono">₺2,450.00</strong></span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded bg-white/5 text-[10px] font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5">YARISI</button>
                    <button className="px-3 py-1 rounded bg-white/5 text-[10px] font-bold text-zinc-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5">MAX</button>
                  </div>
                </div>
              </div>

              <div className="bg-[#000000] border border-white/5 rounded-xl p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Tahmini Kazanç</span>
                  <span className="font-black text-emerald-400 font-mono text-base">₺{(parseInt(tradeAmount || '0') * (100 / (yesOpt?.probability || 50))).toFixed(2)}</span>
                </div>
                <div className="w-full h-px bg-white/5"></div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Potansiyel ROI</span>
                  <span className="font-black text-white font-mono text-base">%+{((100 / (yesOpt?.probability || 50) - 1) * 100).toFixed(1)}</span>
                </div>
              </div>

              <button 
                onClick={() => handleBuy(yesOpt)}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-lg tracking-wide transition-all shadow-[0_0_24px_rgba(16,185,129,0.3)] hover:shadow-[0_0_36px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                EVET SATIN AL
              </button>
            </div>
          </div>

          {/* Suggested Predictions */}
          <div className="flex flex-col gap-3 mt-2">
            <h3 className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-bold px-2 mb-2">Önerilen Tahminler</h3>
            {suggestions.map(p => (
              <div key={p.id} onClick={() => {
                window.history.pushState(null, '', `/tahmin/${p.id}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }} className="bg-[#050608] border border-white/[0.05] rounded-xl p-3 flex gap-4 cursor-pointer hover:bg-white/5 transition-colors group relative overflow-hidden">
                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)' }} />
                 <div className="w-12 h-12 rounded-lg bg-black border border-white/5 flex items-center justify-center shrink-0 shadow-sm">
                    <TrendingUp className="w-5 h-5 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                 </div>
                 <div className="flex flex-col flex-1 justify-center relative z-10">
                    <h4 className="text-xs font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">{p.question}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">EVET {p.options?.[0]?.probability}%</span>
                      <span className="text-[10px] font-mono text-zinc-500">₺{p.volumePlayed}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
