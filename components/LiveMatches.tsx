import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Zap, TrendingUp, ExternalLink, RefreshCw, Wifi } from 'lucide-react';

interface MacData {
  mac_id: string;
  ev_sahibi: string;
  deplasman: string;
  oranlar: {
    '1'?: number;
    'X'?: number;
    '2'?: number;
  };
  guncellenme_tarihi?: string;
}

const LiveMatches: React.FC = () => {
  const [matches, setMatches] = useState<MacData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchMatches = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

        // Öncelikle Supabase'den deniyoruz, başarısız olursa botun oluşturduğu JSON dosyasına dönüyoruz.
        let matchData: any[] = [];
        
        try {
            // Option A: Try Supabase
            const { data, error } = await supabase.from('live_matches').select('*').order('last_updated', { ascending: false }).limit(20);
            if (!error && data && data.length > 0) {
                matchData = data;
            } else {
                throw new Error("Supabase boş veya bağlı değil");
            }
        } catch (supaErr) {
            // Option B: Fallback to local JSON (written by bot)
            const response = await fetch("/live_matches.json?" + new Date().getTime());
            if (response.ok) {
                matchData = await response.json();
            }
        }
        
        if (matchData && matchData.length > 0) {
          const mappedMatches: MacData[] = matchData.slice(0, 15).map((mac: any, index: number) => {
            return {
              mac_id: mac.id || `match-${index}`,
              ev_sahibi: mac.home_team || 'Ev Sahibi',
              deplasman: mac.away_team || 'Deplasman',
              oranlar: {
                "1": mac.home_odd,
                "X": mac.draw_odd,
                "2": mac.away_odd
              },
              status: mac.status || mac.match_time
            };
          });
  
          setMatches(mappedMatches);
        setLastUpdated(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
        setError(null);
      } else {
        setMatches([]);
      }
    } catch (err: any) {
      console.error('Canlı maç verisi çekilemedi:', err);
      setError('Veriler yüklenemedi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => fetchMatches(true), 60000);
    return () => clearInterval(interval);
  }, []);

  const getOddColor = (odd: number | undefined) => {
    if (!odd) return '#888';
    if (odd < 1.5) return '#ff6b6b';
    if (odd < 2.0) return '#ffa726';
    if (odd < 3.0) return '#00FFA3';
    return '#66bb6a';
  };

  const formatOdd = (odd: number | undefined) => {
    if (!odd || odd <= 0) return '-';
    return odd.toFixed(2);
  };

  if (loading && matches.length === 0) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 255, 163, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(0, 255, 163, 0.1)' }}>
            <Zap className="w-4 h-4" style={{ color: '#00FFA3' }} />
          </div>
          <h3 className="font-black text-sm uppercase tracking-wider italic" style={{ color: '#e0e0e0' }}>
            CANLI ORANLAR
          </h3>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(0, 255, 163, 0.2), transparent)' }} />
        </div>
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              background: '#1A1D24',
              borderRadius: '8px',
              padding: '20px',
              animation: 'pulse 1.5s infinite'
            }}>
              <div style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '60%', marginBottom: '12px' }} />
              <div style={{ height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '80%', marginBottom: '8px' }} />
              <div style={{ height: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', width: '80%', marginBottom: '16px' }} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', flex: 1 }} />
                <div style={{ height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', flex: 1 }} />
                <div style={{ height: '36px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', flex: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (matches.length === 0 && !loading) return null;

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 255, 163, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(0, 255, 163, 0.1)' }}>
          <Zap className="w-4 h-4" style={{ color: '#00FFA3' }} />
        </div>
        <h3 className="font-black text-sm uppercase tracking-wider italic" style={{ color: '#e0e0e0' }}>
          CANLI ORANLAR
        </h3>
        <div className="flex items-center gap-1.5 ml-1">
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FFA3', boxShadow: '0 0 8px #00FFA3', animation: 'live-pulse 2s infinite' }} />
          <span style={{ fontSize: '9px', fontWeight: 900, color: '#00FFA3', textTransform: 'uppercase', letterSpacing: '1px' }}>CANLI</span>
        </div>
        <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(0, 255, 163, 0.2), transparent)' }} />
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span style={{ fontSize: '9px', color: '#555', fontWeight: 700 }}>{lastUpdated}</span>
          )}
          <button
            onClick={() => fetchMatches(true)}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '28px', height: '28px', borderRadius: '8px',
              background: 'rgba(0, 255, 163, 0.06)',
              cursor: 'pointer', transition: 'all 0.3s',
              color: '#00FFA3'
            }}
            title="Yenile"
          >
            <RefreshCw className="w-3.5 h-3.5" style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {matches.map((match, idx) => (
          <div
            key={match.mac_id}
            style={{
              background: '#1A1D24',
              borderRadius: '8px',
              padding: '20px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'default',
              animation: `fadeInUp 0.4s ease ${idx * 0.05}s both`
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#22262F';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(0, 255, 163, 0.08)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#1A1D24';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            {/* Glow effect */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 20%, rgba(0, 255, 163, 0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />

            {/* Date/Status Top Right */}
            <div className="absolute top-4 right-4 text-zinc-400 text-[11px] font-semibold flex items-center gap-1.5">
              {match.status === 'Canlı Bahis' && (
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00FFA3', boxShadow: '0 0 6px #00FFA3', animation: 'live-pulse 2s infinite' }} />
              )}
              {match.status || 'Canlı Bahis'}
            </div>

            {/* Teams */}
            <div className="flex flex-col gap-3 mt-1 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">⚽</span>
                </div>
                <span className="text-white font-bold text-[13px]">{match.ev_sahibi}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px]">⚽</span>
                </div>
                <span className="text-white font-bold text-[13px]">{match.deplasman}</span>
              </div>
            </div>

            {/* Odds Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg bg-[#0F1219] hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <span className="text-[10px] font-bold text-zinc-500 mb-0.5">1</span>
                <span className="font-bold text-[13px]" style={{ color: getOddColor(match.oranlar?.['1']) }}>{formatOdd(match.oranlar?.['1'])}</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg bg-[#0F1219] hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <span className="text-[10px] font-bold text-zinc-500 mb-0.5">X</span>
                <span className="font-bold text-[13px]" style={{ color: getOddColor(match.oranlar?.['X']) }}>{formatOdd(match.oranlar?.['X'])}</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-2 rounded-lg bg-[#0F1219] hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                <span className="text-[10px] font-bold text-zinc-500 mb-0.5">2</span>
                <span className="font-bold text-[13px]" style={{ color: getOddColor(match.oranlar?.['2']) }}>{formatOdd(match.oranlar?.['2'])}</span>
              </div>
            </div>

            {/* CTA Button */}
            <a
              href="https://21.com/tr/sports/1"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                width: '100%', padding: '9px 12px',
                background: 'linear-gradient(135deg, #00FFA3 0%, #00FFA3 100%)',
                color: '#000', fontWeight: 900, fontSize: '10px',
                borderRadius: '8px', textTransform: 'uppercase',
                letterSpacing: '1.5px', textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0, 255, 163, 0.25)',
                border: 'none', cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 25px rgba(0, 255, 163, 0.4)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(0, 255, 163, 0.25)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <span>BAHİS YAP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Inline keyframes for animations */}
      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default LiveMatches;
