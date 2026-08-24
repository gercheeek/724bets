import re

filename = 'components/LeaderboardView.tsx'

content = """"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, Clock, Users, TrendingUp, Info } from 'lucide-react';

const TOP3 = [
  { rank: 1, name: 'KralBahis99', wagered: 4_250_680.50, prize: 15_000, color: 'from-[#FFD700] to-[#FDB931]', text: 'text-[#FFD700]', glow: 'shadow-[0_0_40px_rgba(255,215,0,0.4)]', bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]/50' },
  { rank: 2, name: 'SpinMaster7', wagered: 3_180_420.00, prize:  7_500, color: 'from-[#E3E3E3] to-[#A3A3A3]', text: 'text-[#E3E3E3]', glow: 'shadow-[0_0_30px_rgba(227,227,227,0.3)]', bg: 'bg-[#E3E3E3]/10', border: 'border-[#E3E3E3]/40' },
  { rank: 3, name: 'LuckyDice88', wagered: 2_940_110.75, prize:  4_000, color: 'from-[#CD7F32] to-[#A0522D]', text: 'text-[#CD7F32]', glow: 'shadow-[0_0_25px_rgba(205,127,50,0.3)]', bg: 'bg-[#CD7F32]/10', border: 'border-[#CD7F32]/40' },
];

const LEADERBOARD = [
  { rank: 4,  name: 'AydinBet',       wagered: 1_842_300, prize: 2000 },
  { rank: 5,  name: 'TurboSpin44',    wagered: 1_691_500, prize: 1500 },
  { rank: 6,  name: 'BahisKrali',     wagered: 1_420_800, prize: 1000 },
  { rank: 7,  name: 'GoldSlot21',     wagered: 1_380_200, prize:  750 },
  { rank: 8,  name: 'XSpinPro',       wagered: 1_250_670, prize:  750 },
  { rank: 9,  name: 'ElmasOyun',      wagered: 1_100_940, prize:  500 },
  { rank: 10, name: 'BetKing777',     wagered:   980_320, prize:  500 },
  { rank: 11, name: 'GalaxySpin',     wagered:   870_150, prize:  250 },
  { rank: 12, name: 'MaxWager66',     wagered:   820_450, prize:  250 },
  { rank: 13, name: 'CasinoAce',      wagered:   710_900, prize:  250 },
  { rank: 14, name: 'ShadowBet',      wagered:   680_240, prize:  250 },
  { rank: 15, name: 'NightKing44',    wagered:   620_100, prize:  100 },
];

const PAST = [
  { label: '17.08.2026', prize: '100.000 ₺' },
  { label: '10.08.2026', prize: '100.000 ₺' },
  { label: '03.08.2026', prize: '100.000 ₺' },
  { label: '27.07.2026', prize: '100.000 ₺' },
];

function fmt(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Custom Medal Component (No Emojis!) ───
function MedalBadge({ rank, color, textGlow }: { rank: number, color: string, textGlow?: string }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Circle */}
      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_10px_rgba(0,0,0,0.5)] z-10 relative border-2 border-white/20`}>
        <span className={`text-white font-black text-[22px] drop-shadow-md`}>{rank}</span>
      </div>
      {/* Ribbons */}
      <div className="absolute -bottom-3 flex justify-center w-full z-0">
        <div className="w-3 h-6 bg-[#6c2bd9] transform -skew-y-12 translate-x-1 shadow-md"></div>
        <div className="w-3 h-6 bg-[#8b3dff] transform skew-y-12 -translate-x-1 shadow-md"></div>
      </div>
    </div>
  );
}

function Countdown({ targetDate }: { targetDate: Date }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  
  const pad = (n: number) => String(n).padStart(2, '0');
  
  return (
    <div className="flex items-center gap-1.5">
      {([['GÜN', t.d], ['SAAT', t.h], ['DAK', t.m], ['SAN', t.s]] as [string, number][]).map(([lbl, val]) => (
        <div key={lbl} className="flex flex-col items-center">
          <div className="bg-[#0a0d14] rounded-md px-2 py-1.5 text-white font-black text-[16px] leading-none min-w-[38px] text-center tabular-nums shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.4)]">
            {pad(val)}
          </div>
          <span className="text-white/30 text-[7px] font-black uppercase mt-1 tracking-widest">{lbl}</span>
        </div>
      ))}
    </div>
  );
}

export default function LeaderboardView() {
  const [rulesOpen, setRulesOpen] = useState(false);
  const nextEnd = new Date();
  const daysUntilMonday = (7 - nextEnd.getDay() + 1) % 7 || 7;
  nextEnd.setDate(nextEnd.getDate() + daysUntilMonday);
  nextEnd.setHours(23, 59, 59, 0);

  return (
    <div className="w-full min-h-screen bg-[#070a0f] pb-20 overflow-x-hidden font-sans">

      {/* ── HERO BANNER ─────────────────────────────────── */}
      <div className="relative w-full rounded-2xl mt-4 max-w-6xl mx-auto overflow-hidden bg-[#0e121a] border border-white/5 shadow-2xl" style={{ minHeight: '300px' }}>
        
        {/* Abstract Glowing Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7a2fb0]/15 via-[#1a0a3a]/50 to-transparent blur-3xl pointer-events-none" />
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 py-10 h-full gap-8">
          
          {/* Left: Content */}
          <div className="flex flex-col gap-5 flex-1 z-20">
            {/* Badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#12211c] border border-[#00FF87]/20 shadow-[0_0_15px_rgba(0,255,135,0.1)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
                <span className="text-[#00FF87] text-[10px] font-black uppercase tracking-widest">Aktif Turnuva</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <TrendingUp className="w-3 h-3 text-white/50" />
                <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">En Çok Çevrim</span>
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-white font-black text-[32px] sm:text-[44px] leading-[1.1] tracking-tight drop-shadow-xl">
                Haftalık<br />
                Liderlik Tablosu
              </h1>
              <p className="text-white/40 text-[13px] mt-3 max-w-md leading-relaxed">
                Her hafta çevrim miktarına göre en çok oynayan oyuncular dev ödül havuzunu paylaşıyor. Tablo her 10 dakikada bir güncellenir.
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-white/30 text-[9px] uppercase tracking-widest font-black flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Bitiş Süresi
                </span>
                <Countdown targetDate={nextEnd} />
              </div>
            </div>
          </div>

          {/* Right: Premium Prize Pool display */}
          <div className="flex flex-col items-center gap-0 shrink-0 relative z-20 md:pr-10">
            {/* Crown bursting out */}
            <img 
              src="/assets/avatars/crown_3d.png" 
              className="w-[180px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-20 animate-float" 
              alt="Crown" 
              onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} 
            />
            {/* Prize Box - Sleek Glass */}
            <div className="flex flex-col items-center px-10 py-5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] mt-[-30px] z-10">
              <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-widest mb-1 drop-shadow-md">Toplam Ödül Havuzu</span>
              <div className="flex items-center gap-2">
                <span className="text-[#FFD700] font-black text-[36px] leading-none tracking-tight drop-shadow-lg">100.000 ₺</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── TOP 3 PODIUM (METASPINS STYLE) ─────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 mt-12 mb-10 relative z-10">
        <div className="flex items-end justify-center gap-3 sm:gap-5">

          {/* 2nd Place */}
          {(() => { const p = TOP3[1]; return (
            <div className={`relative flex flex-col items-center flex-1 max-w-[200px] rounded-t-[20px] rounded-b-[16px] bg-[#111520] border border-white/5 border-t-[3px] border-t-[#C0C0C0] shadow-[0_15px_30px_rgba(0,0,0,0.4)] pb-6 hover:brightness-110 transition-all`}>
              {/* Medal positioned on top edge */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <MedalBadge rank={p.rank} color={p.color} />
              </div>
              <div className="mt-12 flex flex-col items-center w-full px-4 text-center">
                <div className="text-white font-extrabold text-[15px] truncate max-w-full">{p.name}</div>
                <div className="text-white/30 text-[10px] font-bold mt-1">Wagered <span className="text-white/60">₺{fmt(p.wagered)}</span></div>
                
                {/* Clean Prize Display */}
                <div className="flex items-center gap-1.5 mt-5 px-3 py-1.5 bg-[#0a0d14] rounded-lg border border-white/5">
                  <span className="text-[#00FF87] font-black text-[14px]">₺ {p.prize.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ); })()}

          {/* 1st Place */}
          {(() => { const p = TOP3[0]; return (
            <div className={`relative flex flex-col items-center flex-1 max-w-[220px] rounded-t-[20px] rounded-b-[16px] bg-[#1a142e] border border-white/5 border-t-[3px] border-t-[#FFD700] shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(138,43,226,0.15)] pb-8 mb-4 hover:brightness-110 transition-all`}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 scale-110">
                <MedalBadge rank={p.rank} color={p.color} />
              </div>
              <div className="mt-14 flex flex-col items-center w-full px-4 text-center">
                <div className="text-white font-black text-[17px] truncate max-w-full">{p.name}</div>
                <div className="text-white/30 text-[11px] font-bold mt-1">Wagered <span className="text-white/70">₺{fmt(p.wagered)}</span></div>
                
                <div className="flex items-center gap-1.5 mt-6 px-4 py-2 bg-[#0a0d14] rounded-lg border border-[#FFD700]/20 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                  <span className="text-[#00FF87] font-black text-[16px]">₺ {p.prize.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ); })()}

          {/* 3rd Place */}
          {(() => { const p = TOP3[2]; return (
            <div className={`relative flex flex-col items-center flex-1 max-w-[200px] rounded-t-[20px] rounded-b-[16px] bg-[#111520] border border-white/5 border-t-[3px] border-t-[#CD7F32] shadow-[0_15px_30px_rgba(0,0,0,0.4)] pb-6 hover:brightness-110 transition-all`}>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <MedalBadge rank={p.rank} color={p.color} />
              </div>
              <div className="mt-12 flex flex-col items-center w-full px-4 text-center">
                <div className="text-white font-extrabold text-[15px] truncate max-w-full">{p.name}</div>
                <div className="text-white/30 text-[10px] font-bold mt-1">Wagered <span className="text-white/60">₺{fmt(p.wagered)}</span></div>
                
                <div className="flex items-center gap-1.5 mt-5 px-3 py-1.5 bg-[#0a0d14] rounded-lg border border-white/5">
                  <span className="text-[#00FF87] font-black text-[14px]">₺ {p.prize.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ); })()}

        </div>
      </div>

      {/* ── LIVE LIST (SLEEK UI) ─────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="bg-[#0b0e14] rounded-2xl border border-white/5 p-4 shadow-xl">
          
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-[14px] flex items-center gap-2">
                Sıralama 
                <span className="text-white/30 text-[11px] font-normal">(her 10 dakikada güncellenir)</span>
              </span>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[11px] font-bold transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> Yenile
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {LEADERBOARD.map(p => (
              <div key={p.rank} className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-[#111520] hover:bg-[#161b29] border border-transparent hover:border-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  
                  {/* Hexagon / Sleek Badge for Rank */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[12px] font-black shrink-0 ${
                    p.rank <= 10 ? 'bg-[#7a2fb0]/20 text-[#c27cfa] border border-[#7a2fb0]/40' : 'bg-[#070a0f] text-white/30 border border-white/5'
                  }`}>
                    {p.rank}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-white/90 font-bold text-[14px] leading-tight group-hover:text-white transition-colors">{p.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden sm:flex flex-col items-end">
                     <span className="text-white/30 text-[10px] font-bold">Wagered</span>
                     <span className="text-white/60 text-[13px] font-medium font-mono tracking-tight">₺ {fmt(p.wagered)}</span>
                  </div>
                  <div className="w-[80px] text-right">
                    <span className="text-[#00FF87] font-black text-[15px]">₺ {p.prize.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-3 w-full py-4 rounded-xl bg-gradient-to-r from-[#111520] to-[#161b29] border border-white/5 text-white/50 font-bold text-[12px] hover:text-white hover:border-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
             Tümünü Gör (100+)
          </button>
        </div>
      </div>

      {/* ── PAST TOURNAMENTS ──────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-5 px-2">
          <h2 className="text-white font-bold text-[16px] tracking-tight">Geçmiş Turnuvalar</h2>
          <button className="text-white/40 hover:text-white text-[12px] font-bold transition-colors bg-white/5 px-3 py-1.5 rounded-lg">Tümünü Gör</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PAST.map(t => (
            <div key={t.label} className="flex flex-col rounded-2xl bg-[#0b0e14] border border-white/5 overflow-hidden hover:border-[#7a2fb0]/30 transition-all cursor-pointer group shadow-lg">
              <div className="relative h-[110px] bg-[#111520] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] to-transparent z-10" />
                <div className="absolute w-[150px] h-[150px] bg-[#7a2fb0]/10 blur-2xl rounded-full" />
                <img src="/assets/avatars/trophy_3d.png" className="h-[80px] drop-shadow-xl group-hover:scale-110 transition-transform duration-500 z-0" alt="trophy" onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />
                <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-[#0a0d14]/80 backdrop-blur-md border border-white/10 text-[9px] font-bold text-white/50 z-20">
                  {t.label}
                </div>
              </div>
              <div className="px-4 pb-5 pt-1 flex flex-col z-20">
                <div className="text-white font-bold text-[14px]">Haftalık Liderlik</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-white/30 text-[10px] uppercase font-bold">Ödül Havuzu</div>
                  <div className="text-[#FFD700] font-black text-[13px]">{t.prize}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
"""

with open(filename, 'w') as f:
    f.write(content)

print("Rewrote LeaderboardView.tsx to match Metaspins premium aesthetic strictly")
