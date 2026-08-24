"use client";
import React, { useState, useEffect } from 'react';
import { Trophy, ChevronDown, ChevronUp, RefreshCw, Clock, Users, DollarSign, TrendingUp } from 'lucide-react';

const TOP3 = [
  { rank: 1, name: 'KralBahis99',  wagered: 4_250_680.50, prize: 15_000, medal: '🥇', color: 'from-[#B8860B] to-[#FFD700]', glow: 'shadow-[0_0_40px_rgba(255,215,0,0.35)]', border: 'border-[#FFD700]/30' },
  { rank: 2, name: 'SpinMaster7',  wagered: 3_180_420.00, prize:  7_500, medal: '🥈', color: 'from-[#708090] to-[#C0C0C0]', glow: 'shadow-[0_0_30px_rgba(192,192,192,0.25)]', border: 'border-[#C0C0C0]/25' },
  { rank: 3, name: 'LuckyDice88',  wagered: 2_940_110.75, prize:  4_000, medal: '🥉', color: 'from-[#8B4513] to-[#CD7F32]', glow: 'shadow-[0_0_25px_rgba(205,127,50,0.25)]', border: 'border-[#CD7F32]/25' },
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
  { rank: 16, name: 'RainMaker',      wagered:   590_870, prize:  100 },
  { rank: 17, name: 'VaultBreaker',   wagered:   540_200, prize:  100 },
  { rank: 18, name: 'SlotHunter',     wagered:   510_430, prize:  100 },
  { rank: 19, name: 'DeepStrike99',   wagered:   480_760, prize:  100 },
  { rank: 20, name: 'TitanBet',       wagered:   450_320, prize:  100 },
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
    <div className="flex items-center gap-2">
      {([['GÜN', t.d], ['SAAT', t.h], ['DAK', t.m], ['SAN', t.s]] as [string, number][]).map(([lbl, val]) => (
        <div key={lbl} className="flex flex-col items-center">
          <div className="bg-black/50 rounded-lg px-2.5 py-1.5 text-white font-black text-[18px] leading-none min-w-[44px] text-center tabular-nums border border-white/10">
            {pad(val)}
          </div>
          <span className="text-white/40 text-[8px] font-bold uppercase mt-1 tracking-widest">{lbl}</span>
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
    <div className="w-full min-h-screen bg-[#070a0f] pb-20 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '300px' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c0a40] via-[#300f6a] to-[#0c0520]" />
        <div className="absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full bg-purple-700/20 blur-[110px] pointer-events-none" />
        <div className="absolute bottom-0 right-[180px] w-[280px] h-[280px] rounded-full bg-indigo-600/15 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-6 py-10 gap-8">
          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-[11px] font-black uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" /> Aktif
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px] font-bold">
                <TrendingUp className="w-3 h-3" /> En Çok Çevrim
              </span>
            </div>

            <div>
              <h1 className="text-white font-black text-[36px] sm:text-[46px] leading-none tracking-tight">
                Haftalık<br />
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                  Liderlik Tablosu
                </span>
              </h1>
              <p className="text-white/45 text-[13px] mt-3 max-w-sm leading-relaxed">
                Çevrim yaptıkça puan kazan, sıralamaya gir, dev ödüller kazan! Tablo 10 dakikada bir güncellenir.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-white/35 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> Bitiş: Pazartesi 23:59
              </span>
              <Countdown targetDate={nextEnd} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 shrink-0">
            <img src="/assets/avatars/crown_3d.png" className="w-[130px] h-auto drop-shadow-[0_20px_40px_rgba(255,215,0,0.4)]" alt="Crown" onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />
            <div className="flex flex-col items-center px-8 py-4 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/25 shadow-[0_0_35px_rgba(255,215,0,0.15)]">
              <span className="text-[#FFD700]/70 text-[10px] font-black uppercase tracking-widest mb-1">Ödül Havuzu</span>
              <div className="flex items-center gap-2">
                <img src="/assets/avatars/coin_3d.png" className="w-7 h-7" alt="" onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />
                <span className="text-[#FFD700] font-black text-[28px] leading-none tracking-tight">100.000 ₺</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP 3 PODIUM ─────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mt-[-16px] relative z-10">
        <div className="flex items-end justify-center gap-4">

          {/* 2nd */}
          {(() => { const p = TOP3[1]; return (
            <div className={`flex flex-col items-center gap-3 flex-1 max-w-[220px] rounded-2xl bg-gradient-to-b from-[#1d2540] to-[#121828] border ${p.border} ${p.glow} p-5 pt-6 hover:scale-[1.02] transition-all cursor-default`}>
              <div className="text-[38px] leading-none">{p.medal}</div>
              <div className="text-white font-black text-[14px] truncate max-w-full">{p.name}</div>
              <div className="text-white/40 text-[10px]">✓ Çevrim: <span className="text-white/55">₺{fmt(p.wagered)}</span></div>
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r ${p.color}`}>
                <DollarSign className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                <span className="text-black font-black text-[14px]">{p.prize.toLocaleString()} ₺</span>
              </div>
            </div>
          ); })()}

          {/* 1st */}
          {(() => { const p = TOP3[0]; return (
            <div className={`flex flex-col items-center gap-3 flex-1 max-w-[240px] rounded-2xl bg-gradient-to-b from-[#2a1e50] to-[#160e30] border ${p.border} ${p.glow} p-6 pt-8 mb-[-18px] hover:scale-[1.02] transition-all cursor-default relative`}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#B8860B] to-[#FFD700] rounded-full px-3 py-0.5 text-black font-black text-[9px] uppercase tracking-widest shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                🏆 1. SIRA
              </div>
              <div className="text-[50px] leading-none">{p.medal}</div>
              <div className="text-white font-black text-[16px] truncate max-w-full">{p.name}</div>
              <div className="text-white/40 text-[10px]">✓ Çevrim: <span className="text-white/55">₺{fmt(p.wagered)}</span></div>
              <div className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r ${p.color} shadow-[0_0_20px_rgba(255,215,0,0.35)]`}>
                <DollarSign className="w-4 h-4 text-black" strokeWidth={2.5} />
                <span className="text-black font-black text-[16px]">{p.prize.toLocaleString()} ₺</span>
              </div>
            </div>
          ); })()}

          {/* 3rd */}
          {(() => { const p = TOP3[2]; return (
            <div className={`flex flex-col items-center gap-3 flex-1 max-w-[220px] rounded-2xl bg-gradient-to-b from-[#1d2540] to-[#121828] border ${p.border} ${p.glow} p-5 pt-6 hover:scale-[1.02] transition-all cursor-default`}>
              <div className="text-[38px] leading-none">{p.medal}</div>
              <div className="text-white font-black text-[14px] truncate max-w-full">{p.name}</div>
              <div className="text-white/40 text-[10px]">✓ Çevrim: <span className="text-white/55">₺{fmt(p.wagered)}</span></div>
              <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r ${p.color}`}>
                <DollarSign className="w-3.5 h-3.5 text-black" strokeWidth={2.5} />
                <span className="text-black font-black text-[14px]">{p.prize.toLocaleString()} ₺</span>
              </div>
            </div>
          ); })()}

        </div>
      </div>

      {/* ── LIVE LIST ─────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            <span className="text-white/60 text-[12px] font-bold">Sıralama — her 10 dk güncellenir</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-[12px] font-bold transition-all">
            <RefreshCw className="w-3.5 h-3.5" /> Yenile
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {LEADERBOARD.map(p => (
            <div key={p.rank} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#0f1420] hover:bg-[#141a2e] border border-white/5 hover:border-purple-500/15 transition-all group">
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${p.rank <= 5 ? 'bg-purple-700/35 text-purple-300 border border-purple-500/25' : 'bg-white/5 text-white/35'}`}>
                  {p.rank}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-800/40 to-indigo-800/40 border border-white/10 flex items-center justify-center text-[13px]">🎰</div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[13px] leading-none group-hover:text-purple-300 transition-colors">{p.name}</span>
                  <span className="text-white/35 text-[10px] mt-0.5">✓ Çevrim: <span className="text-white/45">₺{fmt(p.wagered)}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/8 border border-green-500/15 shrink-0">
                <span className="text-[12px]">💰</span>
                <span className="text-green-400 font-black text-[13px]">{p.prize.toLocaleString()} ₺</span>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full py-3.5 rounded-xl bg-purple-800/20 border border-purple-500/15 text-white/60 font-bold text-[13px] hover:text-white hover:bg-purple-800/35 transition-all flex items-center justify-center gap-2">
          <Users className="w-4 h-4" /> Tam Sıralamayı Aç (her 10 dakikada güncellenir)
        </button>
      </div>

      {/* ── PAST TOURNAMENTS ──────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-black text-[19px] tracking-tight">Tüm Liderlik Tabloları</h2>
          <button className="text-purple-400 hover:text-purple-300 text-[13px] font-bold transition-colors">Tümünü Gör</button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PAST.map(t => (
            <div key={t.label} className="flex flex-col rounded-2xl bg-[#0f1420] border border-white/5 overflow-hidden hover:border-purple-500/20 transition-all cursor-pointer group">
              <div className="relative h-[100px] bg-gradient-to-br from-purple-900/50 to-indigo-900/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
                <img src="/assets/avatars/trophy_3d.png" className="h-[70px] drop-shadow-lg group-hover:scale-110 transition-transform duration-300" alt="trophy" onError={e => { (e.currentTarget as HTMLImageElement).style.display='none'; }} />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/10 border border-white/10 text-[8px] font-black text-white/60 uppercase tracking-widest">✓ Bitti</div>
                <div className="absolute top-2 right-2 text-white/35 text-[8px] font-bold">{t.label}</div>
              </div>
              <div className="px-3 pb-4 pt-2 flex flex-col gap-1">
                <div className="text-white font-extrabold text-[12px] leading-tight">Haftalık Liderlik</div>
                <div className="text-white/35 text-[10px]">En Çok Çevrim</div>
                <div className="text-[#FFD700] font-black text-[12px] mt-1">💰 {t.prize}</div>
                <button className="text-purple-400 font-bold text-[11px] text-left hover:text-purple-300 transition-colors mt-1">Detaylar &gt;</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TERMS & CONDITIONS ────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 mt-10">
        <button onClick={() => setRulesOpen(!rulesOpen)} className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-[#0f1420] border border-white/5 hover:border-purple-500/15 transition-all">
          <span className="text-white font-black text-[14px] uppercase tracking-wide">Şartlar ve Koşullar</span>
          {rulesOpen ? <ChevronUp className="w-5 h-5 text-white/40" /> : <ChevronDown className="w-5 h-5 text-white/40" />}
        </button>
        {rulesOpen && (
          <div className="px-6 py-5 bg-[#0a0d16] border border-t-0 border-white/5 rounded-b-2xl text-white/45 text-[12.5px] leading-relaxed space-y-2">
            <p>• Liderlik tablosu her Pazartesi sıfırlanır ve yeni hafta başlar.</p>
            <p>• Sıralama, katılımcıların toplam çevrim miktarına göre belirlenir.</p>
            <p>• Ödüller, yarışma sona erdikten sonra 72 saat içinde hesaplara yüklenir.</p>
            <p>• Tüm casino ve slot oyunları kapsama dahildir. Spor bahisleri hariçtir.</p>
            <p>• Eşit çevrimde, önce ulaşan oyuncu üst sırada yer alır.</p>
            <p>• 724bets, kurallara aykırı hesapları dışlama hakkını saklı tutar.</p>
          </div>
        )}
      </div>

    </div>
  );
}
