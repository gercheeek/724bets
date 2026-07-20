import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Lock, Unlock, CheckCircle2, Star, Shield, 
  Swords, Gift, Crown, Timer, ArrowRight, Sparkles, Target,
  Zap, Skull, KeyRound, Flame, Eye, ChevronRight
} from 'lucide-react';

/* ──────────────── LOCKS DATA ──────────────── */
const LOCKS = [
  {
    id: 1,
    tag: 'KİLİT 1',
    title: "Sokağın Kuralı",
    subtitle: "Kanıtla Kendini",
    description: "Sendikaya girmek bedava değil. 1.000 TL ile masaya otur, ilk biletini al ve büyük çekilişe adını yazdır.",
    reward: "1 Çekiliş Bileti + Giriş Hakkı",
    icon: Swords,
    color: 'red',
    status: 'active' as const,
    effectText: "Kilit lazerle kesilecek!"
  },
  {
    id: 2,
    tag: 'KİLİT 2',
    title: "İlk Kan, İlk Ganimet",
    subtitle: "Güven İnşası",
    description: "Bizde söz namustur. Bu 1.000 TL Bonus senin. Şimdi yeteneğini göster: Bunu 2.000 yap ve 1.500 olarak nakit çek! Göreyim seni.",
    reward: "1.000 TL Macera Bonusu",
    icon: Gift,
    color: 'gold',
    status: 'locked' as const,
    effectText: "İŞLEM BAŞARILI: SAYGINLIK KAZANILDI"
  },
  {
    id: 3,
    tag: 'KİLİT 3',
    title: "Çatışma Bölgesi",
    subtitle: "Geri Dönüş",
    description: "Parayı tattın, şimdi oyuna dön. Arenada tek seferde 500 TL'lik mermiyi (bahsi) ateşle!",
    reward: "50 Free Spin + Şimşek Efekti",
    icon: Target,
    color: 'cyan',
    status: 'locked' as const,
    effectText: "Şimşekler çakıyor!"
  },
  {
    id: 4,
    tag: 'KİLİT 4',
    title: "Masanın Ağır Abisi",
    subtitle: "Zincirleri Kır",
    description: "Artık çaylak değilsin. 2.000 TL ile kasayı besle, gücünü ikiye katlayalım (%100 VIP Bonus).",
    reward: "%100 VIP Bonus + VIP Çark Dönüşü",
    icon: Shield,
    color: 'purple',
    status: 'locked' as const,
    effectText: "Zincirler kırıldı!"
  },
  {
    id: 5,
    tag: 'KİLİT 5',
    title: "Adrenalin Bağımlısı",
    subtitle: "Hacim Sınavı",
    description: "Durmak yok! 10.000 TL'lik oyun hacmi yarat, ne kadar çılgın olduğunu bilelim.",
    reward: "Şartsız 500 TL Nakit İade",
    icon: Flame,
    color: 'orange',
    status: 'locked' as const,
    effectText: "RİSK SIFIRLANDI"
  },
  {
    id: 6,
    tag: 'KİLİT 6',
    title: "Kaos Teorisi",
    subtitle: "Çapraz Oyun",
    description: "Tek yönlü savaşçılar çabuk ölür. Konfor alanından çık! Farklı bir arenada 3 kez şansını dene.",
    reward: "Gümüş Anahtar + Sürpriz Sandık (100-500 TL)",
    icon: KeyRound,
    color: 'split',
    status: 'locked' as const,
    effectText: "Enerjiler birleşti!"
  },
  {
    id: 7,
    tag: 'KİLİT 7',
    title: "APEX PREDATOR",
    subtitle: "Büyük Final",
    description: "Efsaneler arasına girmeye tek adım kaldı. 5.000 TL'lik final darbesini vur ve 724Bets tahtına otur!",
    reward: "3.000 TL Nakit + 5 Altın Bilet + 'Apex' Rozeti",
    icon: Skull,
    color: 'legendary',
    status: 'locked' as const,
    effectText: "APEX STATÜSÜNE ULAŞILDI"
  }
];

/* ──────────────── HYPE FEED DATA ──────────────── */
const HYPE_NAMES = [
  'Viper_99', 'GhostBet', 'NeonWolf', 'DarkAce', 'PhantomX', 
  'BlazeStar', 'CyberKing', 'ShadowFox', 'IronClad', 'StormRider',
  'LuckyDemon', 'TurboMax', 'NightHawk', 'ThunderBolt', 'ApexHunter'
];
const HYPE_ACTIONS = [
  '2. Kilidi kırdı!', '1. Kilidi açtı!', 'Apex statüsüne ulaştı!',
  '3. Kilitte ilerliyor!', '1.500 TL çekim yaptı!', 'VIP halesi kazandı!',
  '5. Kilidi tamamladı!', 'Gümüş Anahtar aldı!', 'Çekiliş bileti kazandı!',
  'Adrenalin barını doldurdu!', '500 TL nakit kazandı!', 'Şimşek efekti açıldı!'
];

/* ──────────────── COLOR HELPERS ──────────────── */
const getColorClasses = (color: string) => {
  switch (color) {
    case 'red': return { border: 'border-red-500/40', bg: 'bg-red-500', glow: 'shadow-[0_0_40px_rgba(239,68,68,0.4)]', text: 'text-red-400', bgSoft: 'bg-red-500/10', gradient: 'from-red-500 to-rose-600' };
    case 'gold': return { border: 'border-amber-400/40', bg: 'bg-amber-400', glow: 'shadow-[0_0_40px_rgba(251,191,36,0.4)]', text: 'text-amber-400', bgSoft: 'bg-amber-400/10', gradient: 'from-amber-400 to-yellow-500' };
    case 'cyan': return { border: 'border-cyan-400/40', bg: 'bg-cyan-400', glow: 'shadow-[0_0_40px_rgba(34,211,238,0.4)]', text: 'text-cyan-400', bgSoft: 'bg-cyan-400/10', gradient: 'from-cyan-400 to-blue-500' };
    case 'purple': return { border: 'border-purple-500/40', bg: 'bg-purple-500', glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]', text: 'text-purple-400', bgSoft: 'bg-purple-500/10', gradient: 'from-purple-500 to-violet-600' };
    case 'orange': return { border: 'border-orange-500/40', bg: 'bg-orange-500', glow: 'shadow-[0_0_40px_rgba(249,115,22,0.4)]', text: 'text-orange-400', bgSoft: 'bg-orange-500/10', gradient: 'from-orange-500 to-red-500' };
    case 'split': return { border: 'border-fuchsia-500/40', bg: 'bg-fuchsia-500', glow: 'shadow-[0_0_40px_rgba(217,70,239,0.4)]', text: 'text-fuchsia-400', bgSoft: 'bg-fuchsia-500/10', gradient: 'from-red-500 via-fuchsia-500 to-blue-500' };
    case 'legendary': return { border: 'border-amber-300/60', bg: 'bg-amber-300', glow: 'shadow-[0_0_60px_rgba(252,211,77,0.5)]', text: 'text-amber-300', bgSoft: 'bg-amber-300/10', gradient: 'from-amber-300 via-red-500 to-amber-300' };
    default: return { border: 'border-white/10', bg: 'bg-white', glow: '', text: 'text-white', bgSoft: 'bg-white/5', gradient: 'from-gray-400 to-gray-500' };
  }
};

/* ──────────────── AVATAR LEVELS ──────────────── */
const AVATAR_STAGES = [
  { label: 'Sokak Savaşçısı', emoji: '🥷', aura: '' },
  { label: 'Onaylı Üye', emoji: '🧥', aura: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]' },
  { label: 'Arena Dövüşçüsü', emoji: '⚡', aura: 'shadow-[0_0_25px_rgba(34,211,238,0.3)]' },
  { label: 'VIP Savaşçı', emoji: '👑', aura: 'shadow-[0_0_30px_rgba(168,85,247,0.4)]' },
  { label: 'Adrenalin Lordu', emoji: '🔥', aura: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]' },
  { label: 'Kaos Efendisi', emoji: '💎', aura: 'shadow-[0_0_35px_rgba(217,70,239,0.5)]' },
  { label: 'APEX PREDATOR', emoji: '☠️', aura: 'shadow-[0_0_50px_rgba(252,211,77,0.6)]' },
];

/* ──────────────── STYLES ──────────────── */
const cyberpunkStyles = `
  @keyframes digitalRain {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  @keyframes glitchFlicker {
    0%, 100% { opacity: 1; }
    33% { opacity: 0.8; }
    66% { opacity: 1; }
    77% { opacity: 0.6; transform: translateX(1px); }
    88% { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px currentColor; }
    50% { box-shadow: 0 0 40px currentColor, 0 0 60px currentColor; }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes lockHover {
    0%, 100% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-2deg) scale(1.02); }
    75% { transform: rotate(2deg) scale(1.02); }
  }
  @keyframes slideInUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes hypeFeed {
    0% { opacity: 0; transform: translateX(-20px); }
    10% { opacity: 1; transform: translateX(0); }
    90% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateX(20px); }
  }
  @keyframes neonBorder {
    0%, 100% { border-color: rgba(239, 68, 68, 0.3); }
    50% { border-color: rgba(239, 68, 68, 0.7); }
  }
  @keyframes floatAvatar {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes progressFill {
    0% { width: 0%; }
    100% { width: var(--fill); }
  }
  .adventure-lock-item { animation: slideInUp 0.6s ease-out both; }
  .adventure-lock-item:nth-child(1) { animation-delay: 0.1s; }
  .adventure-lock-item:nth-child(2) { animation-delay: 0.2s; }
  .adventure-lock-item:nth-child(3) { animation-delay: 0.3s; }
  .adventure-lock-item:nth-child(4) { animation-delay: 0.4s; }
  .adventure-lock-item:nth-child(5) { animation-delay: 0.5s; }
  .adventure-lock-item:nth-child(6) { animation-delay: 0.6s; }
  .adventure-lock-item:nth-child(7) { animation-delay: 0.7s; }
  .detail-card-enter { animation: fadeInScale 0.4s ease-out both; }
`;

/* ──────────────── DIGITAL RAIN BG ──────────────── */
const DigitalRain = () => {
  const columns = 20;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07]">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 text-red-500/80 font-mono text-xs leading-none select-none"
          style={{
            left: `${(i / columns) * 100}%`,
            animation: `digitalRain ${4 + Math.random() * 6}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {Array.from({ length: 30 }).map((_, j) => (
            <div key={j} className="opacity-60">{String.fromCharCode(0x30A0 + Math.random() * 96)}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

/* ──────────────── HYPE FEED COMPONENT ──────────────── */
const HypeFeed = () => {
  const [feed, setFeed] = useState<Array<{ id: number; name: string; action: string }>>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const addItem = () => {
      const name = HYPE_NAMES[Math.floor(Math.random() * HYPE_NAMES.length)];
      const action = HYPE_ACTIONS[Math.floor(Math.random() * HYPE_ACTIONS.length)];
      idRef.current += 1;
      setFeed(prev => [...prev.slice(-4), { id: idRef.current, name, action }]);
    };
    addItem();
    const interval = setInterval(addItem, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-1.5 max-h-[180px] overflow-hidden">
      {feed.map((item) => (
        <div key={item.id} className="flex items-center gap-2 text-xs" style={{ animation: 'hypeFeed 5s ease-in-out both' }}>
          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-amber-400 font-bold">{item.name}</span>
          <span className="text-gray-500">{item.action}</span>
        </div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   ██ MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function AdventureMap() {
  const { t } = useLanguage();
  const [activeLock, setActiveLock] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState({ days: 7, hours: 23, minutes: 59, seconds: 59 });
  const [mounted, setMounted] = useState(false);

  // Find current progress level (which lock is active)
  const currentLevel = LOCKS.findIndex(l => l.status === 'active');

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lock = LOCKS[activeLock - 1];
  const colors = getColorClasses(lock.color);
  const avatar = AVATAR_STAGES[currentLevel] || AVATAR_STAGES[0];

  if (!mounted) return null;

  return (
    <>
      <style>{cyberpunkStyles}</style>
      <div className="w-full min-h-[calc(100vh-80px)] bg-[#050508] relative overflow-hidden flex flex-col font-sans">

        {/* ═══ BACKGROUND LAYERS ═══ */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0008] via-[#050508] to-[#080510]" />
          {/* Neon ambient glows */}
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-600/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[100px]" />
          {/* Digital rain */}
          <DigitalRain />
          {/* Scanline */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
            <div className="w-full h-[2px] bg-white/50" style={{ animation: 'scanline 8s linear infinite' }} />
          </div>
          {/* Metallic noise texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />
        </div>

        {/* ═══ HEADER ═══ */}
        <div className="relative z-10 pt-6 pb-4 px-4 md:px-8 max-w-[1500px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Title */}
            <div style={{ animation: 'glitchFlicker 4s ease-in-out infinite' }}>
              <div className="flex items-center gap-2 mb-1">
                <Skull className="w-5 h-5 text-red-500" />
                <span className="text-red-500/80 text-[10px] font-bold uppercase tracking-[0.3em]">7 Ölümcül Kilit</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-fuchsia-500 to-purple-500">724Bets</span>
                <span className="text-white/90 ml-3">Serüveni</span>
              </h1>
              <p className="text-gray-500 mt-1 text-sm max-w-lg font-medium">
                Holografik masada 7 kilidi kır, APEX statüsüne ulaş ve efsane ol.
              </p>
            </div>

            {/* FOMO Timer */}
            <div className="bg-black/60 backdrop-blur-xl border border-red-500/20 rounded-2xl px-5 py-3 flex items-center gap-5 shrink-0" style={{ animation: 'neonBorder 3s ease-in-out infinite' }}>
              <div className="flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-[10px] font-bold uppercase tracking-[0.2em]">Son Süre</span>
              </div>
              <div className="flex items-center gap-3 font-mono font-bold text-lg text-white">
                {[
                  { val: timeLeft.days, label: 'G' },
                  { val: timeLeft.hours, label: 'S' },
                  { val: timeLeft.minutes, label: 'D' },
                  { val: timeLeft.seconds, label: 'S' },
                ].map((unit, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-red-500/30 text-sm -mx-1">:</span>}
                    <div className="flex flex-col items-center min-w-[28px]">
                      <span className={i === 3 ? 'text-red-400' : ''}>{String(unit.val).padStart(2, '0')}</span>
                      <span className="text-[8px] text-gray-600 uppercase tracking-wider -mt-0.5">{unit.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="relative z-10 flex-grow px-4 md:px-8 pb-8 max-w-[1500px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_380px] gap-6 lg:gap-8 h-full">

            {/* ──── LEFT: AVATAR & HYPE FEED ──── */}
            <div className="hidden lg:flex flex-col gap-6">
              {/* Avatar Card */}
              <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent" />
                <div className="relative z-10">
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-3">Karakter</div>
                  <div 
                    className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-white/10 flex items-center justify-center text-5xl mb-3 ${avatar.aura}`}
                    style={{ animation: 'floatAvatar 4s ease-in-out infinite' }}
                  >
                    {avatar.emoji}
                  </div>
                  <div className="text-white font-bold text-sm">{avatar.label}</div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Seviye {currentLevel + 1}/7</div>
                  
                  {/* Level progress */}
                  <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-fuchsia-500 rounded-full transition-all duration-1000"
                      style={{ width: `${((currentLevel + 1) / 7) * 100}%` } as React.CSSProperties}
                    />
                  </div>
                </div>
              </div>

              {/* Hype Feed */}
              <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4 flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/3 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[9px] text-amber-400/80 font-bold uppercase tracking-[0.3em]">Canlı Akış</span>
                  </div>
                  <HypeFeed />
                </div>
              </div>
            </div>

            {/* ──── CENTER: LOCK DETAIL PANEL ──── */}
            <div className="detail-card-enter" key={activeLock}>
              <div className={`h-full bg-black/30 backdrop-blur-[20px] border ${colors.border} rounded-3xl p-6 md:p-10 relative overflow-hidden transition-all duration-500`}>
                {/* Ambient glow for this lock's color */}
                <div className={`absolute top-0 right-0 w-[300px] h-[300px] ${colors.bgSoft} rounded-full blur-[100px] -mr-32 -mt-32 opacity-60`} />
                <div className={`absolute bottom-0 left-0 w-[200px] h-[200px] ${colors.bgSoft} rounded-full blur-[80px] -ml-20 -mb-20 opacity-40`} />
                
                {/* Scanline overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Lock Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center ${colors.glow}`}>
                        {lock.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-black" /> :
                         lock.status === 'active' ? <lock.icon className="w-5 h-5 text-black" /> :
                         <Lock className="w-4 h-4 text-black/60" />}
                      </div>
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${colors.text}`}>{lock.tag}</span>
                        <div className="text-gray-500 text-[10px] uppercase tracking-widest">{lock.subtitle}</div>
                      </div>
                    </div>
                    {lock.status === 'active' && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-400 text-[10px] font-bold uppercase tracking-wider">Aktif</span>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4 leading-tight">
                    {lock.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 max-w-xl font-medium">
                    {lock.description}
                  </p>

                  {/* Reward Box */}
                  <div className={`bg-black/40 rounded-2xl p-5 border ${colors.border} mb-8 relative overflow-hidden`}>
                    <div className={`absolute inset-0 ${colors.bgSoft} opacity-30`} />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shrink-0`}>
                        <Gift className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-1">Kilidin Ganimetleri</div>
                        <p className={`${colors.text} font-bold text-lg`}>{lock.reward}</p>
                      </div>
                    </div>
                  </div>

                  {/* Effect text hint */}
                  <div className="flex items-center gap-2 mb-6 opacity-50">
                    <Sparkles className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider italic">
                      Efekt: "{lock.effectText}"
                    </span>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <button className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.97] relative overflow-hidden
                      ${lock.status === 'completed' ? 'bg-white/5 text-emerald-400 cursor-not-allowed border border-emerald-500/20' :
                        lock.status === 'locked' ? 'bg-white/[0.03] text-gray-600 cursor-not-allowed border border-white/5' :
                        `bg-gradient-to-r ${colors.gradient} text-black ${colors.glow} hover:scale-[1.02]`}`}>
                      {lock.status === 'active' && (
                        <div className="absolute inset-0 bg-white/10 animate-pulse" />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {lock.status === 'completed' ? '✓ Tamamlandı' :
                         lock.status === 'locked' ? 'Önceki Kilidi Kır' :
                         'Görevi Başlat'}
                        {lock.status === 'active' && <ArrowRight className="w-5 h-5" />}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ──── RIGHT: LOCK COLUMNS (HOLOGRAPHIC TABLE) ──── */}
            <div className="relative">
              {/* Holographic table glow */}
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
              
              {/* Vertical energy line */}
              <div className="absolute top-4 bottom-4 left-8 lg:left-10 w-[2px] rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.03]" />
                <div 
                  className="absolute top-0 left-0 w-full bg-gradient-to-b from-red-500 via-fuchsia-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ height: `${((currentLevel + 1) / 7) * 100}%`, boxShadow: '0 0 12px rgba(239,68,68,0.5)' }}
                />
              </div>

              {/* Lock Items */}
              <div className="flex flex-col gap-3 relative z-10 py-2">
                {LOCKS.map((lockItem) => {
                  const c = getColorClasses(lockItem.color);
                  const isActive = lockItem.status === 'active';
                  const isCompleted = lockItem.status === 'completed';
                  const isSelected = activeLock === lockItem.id;
                  const Icon = lockItem.icon;

                  return (
                    <div
                      key={lockItem.id}
                      onClick={() => setActiveLock(lockItem.id)}
                      className={`adventure-lock-item flex items-center gap-4 cursor-pointer group transition-all duration-300 pl-4 lg:pl-5 ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                      style={isActive && !isSelected ? { animation: 'lockHover 2s ease-in-out infinite' } : undefined}
                    >
                      {/* Lock Node */}
                      <div className="relative shrink-0">
                        {isActive && (
                          <div className={`absolute inset-0 ${c.bg} rounded-full animate-ping opacity-20 scale-150`} />
                        )}
                        <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300
                          ${isCompleted ? `${c.bg} text-black ${c.glow}` :
                            isActive ? `${c.bg} text-black ${c.glow}` :
                            'bg-[#0D0F14] border-2 border-white/[0.06] text-gray-700'}`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> :
                           lockItem.status === 'locked' ? <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={1.5} /> :
                           <Icon className="w-4 h-4 md:w-5 md:h-5" />}
                        </div>
                      </div>

                      {/* Lock Card */}
                      <div className={`flex-1 p-3.5 md:p-4 rounded-2xl border backdrop-blur-md transition-all duration-300
                        ${isSelected ? `${c.bgSoft} ${c.border} ${c.glow.replace('40px', '15px')}` :
                          isCompleted ? 'bg-emerald-500/5 border-emerald-500/10' :
                          isActive ? `${c.bgSoft} ${c.border} group-hover:${c.border}` :
                          'bg-white/[0.02] border-white/[0.04] group-hover:border-white/10 group-hover:bg-white/[0.04]'}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`font-bold text-sm md:text-base transition-colors leading-tight
                              ${isSelected ? c.text :
                                isCompleted ? 'text-emerald-400' :
                                isActive ? c.text :
                                'text-gray-600 group-hover:text-gray-400'}`}>
                              {lockItem.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {lockItem.status === 'locked' && (
                                <span className="text-[9px] text-gray-600 font-medium uppercase tracking-wider flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" strokeWidth={1.5} /> Kilitli
                                </span>
                              )}
                              {lockItem.status === 'active' && (
                                <span className={`text-[9px] ${c.text} font-bold uppercase tracking-wider flex items-center gap-1`}>
                                  <Unlock className="w-2.5 h-2.5" strokeWidth={1.5} /> Devam Ediyor
                                </span>
                              )}
                              {lockItem.status === 'completed' && (
                                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Tamamlandı</span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-all ${isSelected ? `${c.text} translate-x-0.5` : 'text-gray-700'}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ═══ MOBILE HYPE FEED (Twitch-style) ═══ */}
        <div className="lg:hidden relative z-10 px-4 pb-4">
          <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-3 h-3 text-amber-400" />
              <span className="text-[9px] text-amber-400/80 font-bold uppercase tracking-[0.3em]">Canlı Akış</span>
            </div>
            <HypeFeed />
          </div>
        </div>

      </div>
    </>
  );
}
