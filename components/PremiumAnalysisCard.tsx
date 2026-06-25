import React from 'react';
import { Shield, TrendingUp, Zap, Lock, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { PremiumAnalysis } from '../types';

interface Props {
  analysis: PremiumAnalysis;
  onBuy: (analysis: PremiumAnalysis) => void;
  isPurchased?: boolean;
}

const STATUS_CONFIG = {
  pending: { label: 'AKTİF', color: '#FFC107', icon: Clock, bg: 'rgba(255,193,7,0.1)' },
  won: { label: 'KAZANDI', color: '#00E676', icon: CheckCircle2, bg: 'rgba(0,230,118,0.1)' },
  lost: { label: 'KAYBETTİ', color: '#FF5252', icon: XCircle, bg: 'rgba(255,82,82,0.1)' },
  void: { label: 'İPTAL', color: '#9E9E9E', icon: XCircle, bg: 'rgba(158,158,158,0.1)' },
};

const PremiumAnalysisCard: React.FC<Props> = ({ analysis, onBuy, isPurchased }) => {
  const statusInfo = STATUS_CONFIG[analysis.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div
      className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(255,193,7,0.15)]"
      style={{
        background: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 193, 7, 0.12)',
      }}
    >
      {/* Ambient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,193,7,0.08) 0%, transparent 70%)' }}
      />

      {/* Guaranteed Badge */}
      {analysis.isGuaranteed && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #FFC107, #FF8F00)',
              color: '#000',
              boxShadow: '0 4px 15px rgba(255,193,7,0.4)',
            }}
          >
            <Shield className="w-3 h-3" /> İADE GARANTİLİ
          </div>
        </div>
      )}

      {/* Header: League + Status */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#FFC107' }} />
          <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#9E9E9E' }}>
            {analysis.league || 'PREMİUM'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: statusInfo.bg }}>
          <StatusIcon className="w-3 h-3" style={{ color: statusInfo.color }} />
          <span className="text-[9px] font-black uppercase" style={{ color: statusInfo.color }}>{statusInfo.label}</span>
        </div>
      </div>

      {/* Match Name */}
      <div className="px-5 pt-4 pb-3">
        <h3 className="text-lg font-black text-white leading-tight tracking-tight">
          {analysis.matchName}
        </h3>
        {analysis.matchDate && (
          <p className="text-[11px] font-bold mt-1" style={{ color: '#757575' }}>
            {new Date(analysis.matchDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* Stats Row */}
      <div className="px-5 grid grid-cols-3 gap-3 py-3">
        {/* Prediction */}
        <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(255,193,7,0.08)', border: '1px solid rgba(255,193,7,0.15)' }}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#757575' }}>TAHMİN</p>
          <p className="text-sm font-black" style={{ color: '#FFC107' }}>{analysis.prediction}</p>
        </div>

        {/* Odd */}
        <div className="rounded-2xl p-3 text-center" style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.12)' }}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#757575' }}>ORAN</p>
          <p className="text-sm font-black" style={{ color: '#00E676' }}>{analysis.odd.toFixed(2)}</p>
        </div>

        {/* Confidence */}
        <div className="rounded-2xl p-3 text-center relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#757575' }}>GÜVEN</p>
          <p className="text-sm font-black text-white">%{analysis.confidence}</p>
          {/* Mini progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full transition-all duration-1000" style={{
              width: `${analysis.confidence}%`,
              background: analysis.confidence >= 80 ? '#00E676' : analysis.confidence >= 60 ? '#FFC107' : '#FF5252',
            }} />
          </div>
        </div>
      </div>

      {/* Analysis Preview (blurred if not purchased) */}
      {analysis.analysisText && (
        <div className="px-5 py-2">
          <div className={`text-[12px] leading-relaxed p-3 rounded-xl ${isPurchased ? '' : 'select-none'}`}
            style={{
              color: isPurchased ? '#BDBDBD' : 'transparent',
              background: 'rgba(0,0,0,0.3)',
              textShadow: isPurchased ? 'none' : '0 0 8px rgba(255,255,255,0.5)',
              filter: isPurchased ? 'none' : 'blur(4px)',
            }}
          >
            {isPurchased ? analysis.analysisText : 'Bu içeriği görmek için premium analizi satın almanız gerekmektedir. Detaylı maç analizi, taktiksel bilgiler ve bahis senaryoları...'}
          </div>
          {!isPurchased && (
            <div className="flex items-center justify-center gap-2 -mt-8 relative z-10">
              <Lock className="w-4 h-4" style={{ color: '#FFC107' }} />
              <span className="text-[11px] font-black" style={{ color: '#FFC107' }}>İÇERİK KİLİTLİ</span>
            </div>
          )}
        </div>
      )}

      {/* Footer: Price + Buy Button */}
      <div className="p-5 pt-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>FİYAT</p>
          <p className="text-2xl font-black" style={{ color: '#FFC107' }}>
            {analysis.price.toFixed(0)} <span className="text-sm">TL</span>
          </p>
        </div>

        {isPurchased ? (
          <div className="flex items-center gap-2 px-6 py-3 rounded-2xl" style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)' }}>
            <CheckCircle2 className="w-4 h-4" style={{ color: '#00E676' }} />
            <span className="text-[11px] font-black uppercase" style={{ color: '#00E676' }}>SATIN ALINDI</span>
          </div>
        ) : analysis.status !== 'pending' ? (
          <div className="flex items-center gap-2 px-6 py-3 rounded-2xl" style={{ background: 'rgba(158,158,158,0.1)' }}>
            <span className="text-[11px] font-black uppercase" style={{ color: '#757575' }}>SATIŞ KAPANDI</span>
          </div>
        ) : (
          <button
            onClick={() => onBuy(analysis)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[12px] uppercase tracking-wider transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,193,7,0.3)] hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FFC107, #FF8F00)',
              color: '#000',
            }}
          >
            <Zap className="w-4 h-4" /> SATIN AL
          </button>
        )}
      </div>
    </div>
  );
};

export default PremiumAnalysisCard;
