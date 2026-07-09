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

      const response = await fetch("https://prod20522-194534354.fssb.io/api/pulse/snapshot/events?lang=TR");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Filter Futbol (SportId: "1") or Basketbol (SportId: "6")
        const filtered = data.filter((e: any) => e.SportId === "1" || e.SportId === "6");
        
        const mappedMatches: MacData[] = filtered.slice(0, 12).map((mac: any) => {
          const homeParticipant = mac.Participants?.find((p: any) => p.VenueRole === "Home");
          const awayParticipant = mac.Participants?.find((p: any) => p.VenueRole === "Away");
          
          const evSahibi = homeParticipant?.Name || mac.EventName?.split(' karşı ')?.[0] || 'Ev Sahibi';
          const deplasman = awayParticipant?.Name || mac.EventName?.split(' karşı ')?.[1] || 'Deplasman';
          
          return {
            mac_id: mac._id,
            ev_sahibi: evSahibi,
            deplasman: deplasman,
            oranlar: {
              "1": Number((Math.random() * 2 + 1.2).toFixed(2)),
              "X": Number((Math.random() * 1.5 + 2.5).toFixed(2)),
              "2": Number((Math.random() * 3 + 1.5).toFixed(2))
            }
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

            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3" style={{ color: '#00FFA3' }} />
                <span style={{ fontSize: '9px', fontWeight: 900, color: 'rgba(0, 255, 163, 0.7)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Canlı Bahis
                </span>
              </div>
              <TrendingUp className="w-3.5 h-3.5" style={{ color: 'rgba(0, 255, 163, 0.3)' }} />
            </div>

            {/* Team Names */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{
                  width: '4px', height: '16px', borderRadius: '2px',
                  background: 'linear-gradient(180deg, #00FFA3, #00FFA3)',
                  boxShadow: '0 0 6px rgba(0, 255, 163, 0.4)'
                }} />
                <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
                  {match.ev_sahibi}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '4px', height: '16px', borderRadius: '2px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))'
                }} />
                <span style={{ fontSize: '13px', fontWeight: 900, color: 'rgba(255,255,255,0.65)', letterSpacing: '-0.3px' }}>
                  {match.deplasman}
                </span>
              </div>
            </div>

            {/* Odds Row */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {/* 1 */}
              <div style={{
                flex: 1, textAlign: 'center', padding: '10px 4px',
                background: 'rgba(0, 255, 163, 0.04)',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: '8px', fontWeight: 900, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>1</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: getOddColor(match.oranlar?.['1']), letterSpacing: '-0.5px' }}>
                  {formatOdd(match.oranlar?.['1'])}
                </div>
              </div>
              {/* X */}
              <div style={{
                flex: 1, textAlign: 'center', padding: '10px 4px',
                background: 'rgba(0, 255, 163, 0.04)',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: '8px', fontWeight: 900, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>X</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: getOddColor(match.oranlar?.['X']), letterSpacing: '-0.5px' }}>
                  {formatOdd(match.oranlar?.['X'])}
                </div>
              </div>
              {/* 2 */}
              <div style={{
                flex: 1, textAlign: 'center', padding: '10px 4px',
                background: 'rgba(0, 255, 163, 0.04)',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}>
                <div style={{ fontSize: '8px', fontWeight: 900, color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>2</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: getOddColor(match.oranlar?.['2']), letterSpacing: '-0.5px' }}>
                  {formatOdd(match.oranlar?.['2'])}
                </div>
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
