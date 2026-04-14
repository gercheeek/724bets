import React from 'react';
import { MatchAnalysis } from '../types';
import { BarChart3, ArrowRight } from 'lucide-react';

interface PortalMatchListProps {
  analyses: MatchAnalysis[];
  selectedLeague: string;
  onNavigate: (view: string) => void;
}

const PortalMatchList: React.FC<PortalMatchListProps> = ({ analyses, selectedLeague, onNavigate }) => {
  let displayItems = analyses;
  if (selectedLeague !== 'Tümü' && selectedLeague !== 'Genel Maçlar') {
    displayItems = displayItems.filter(a => a.league === selectedLeague);
  }
  displayItems.sort((a, b) => b.confidence - a.confidence);
  displayItems = displayItems.slice(0, 5);

  if (displayItems.length === 0) return null;

  return (
    <div style={{ margin: '0 0 12px' }}>
      {/* Compact header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '3px', height: '14px', background: '#f0b90b', borderRadius: '2px' }} />
          <span style={{ color: '#fff', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Analizler</span>
        </div>
        <button 
          onClick={() => onNavigate('analysis')}
          style={{ background: 'none', border: 'none', color: '#f0b90b', fontSize: '9px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          TÜMÜ <ArrowRight style={{ width: 10, height: 10 }} />
        </button>
      </div>

      {/* Compact iddaa-style table */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '10px', overflow: 'hidden' }}>
        {/* Table header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr 100px 50px 50px 45px', alignItems: 'center', padding: '6px 10px', borderBottom: '1px solid #151515', gap: '4px' }}>
          <span style={{ fontSize: '7px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>SAAT</span>
          <span style={{ fontSize: '7px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '1px' }}>MAÇ</span>
          <span style={{ fontSize: '7px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>TAHMİN</span>
          <span style={{ fontSize: '7px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>KG</span>
          <span style={{ fontSize: '7px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>2.5Ü</span>
          <span style={{ fontSize: '7px', fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>%</span>
        </div>

        {/* Match rows */}
        {displayItems.map((item, idx) => {
          const kgOdd = (1.50 + Math.random() * 0.4).toFixed(2);
          const ustOdd = (1.60 + Math.random() * 0.4).toFixed(2);
          const confColor = item.confidence >= 90 ? '#22c55e' : '#f0b90b';

          return (
            <div
              key={item.id}
              onClick={() => onNavigate('analysis')}
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 1fr 100px 50px 50px 45px',
                alignItems: 'center',
                padding: '7px 10px',
                borderBottom: idx < displayItems.length - 1 ? '1px solid #111' : 'none',
                cursor: 'pointer',
                gap: '4px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#141414')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Time */}
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#f0b90b' }}>{item.matchTime || '21:00'}</div>
                <div style={{ fontSize: '6px', fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '1px' }}>{item.league?.substring(0, 12)}</div>
              </div>

              {/* Teams */}
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#e5e5e5', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  {item.homeTeam} <span style={{ color: '#333', fontSize: '8px', fontWeight: 600, margin: '0 2px' }}>vs</span> {item.awayTeam}
                </span>
              </div>

              {/* Prediction badge */}
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '8px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: item.prediction?.toLowerCase().includes('ev') ? 'rgba(34,197,94,0.1)' : 'rgba(240,185,11,0.1)',
                  color: item.prediction?.toLowerCase().includes('ev') ? '#22c55e' : '#f0b90b',
                  border: `1px solid ${item.prediction?.toLowerCase().includes('ev') ? 'rgba(34,197,94,0.2)' : 'rgba(240,185,11,0.2)'}`,
                }}>
                  {item.prediction}
                </span>
              </div>

              {/* KG Odd */}
              <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 800, color: '#ccc' }}>{kgOdd}</div>

              {/* 2.5U Odd */}
              <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 800, color: '#ccc' }}>{ustOdd}</div>

              {/* Confidence */}
              <div style={{ textAlign: 'right', fontSize: '11px', fontWeight: 900, color: confColor }}>%{item.confidence}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortalMatchList;
