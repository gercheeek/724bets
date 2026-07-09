// ── HowToJoin.tsx ─────────────────────────────────────────────────
// 4-step horizontal flow showing how to participate in a raffle.

const steps = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M12 2a5 5 0 0 1 5 5c0 2.76-2.24 5-5 5S7 9.76 7 7a5 5 0 0 1 5-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 22c0-5.52 4.48-10 10-10s10 4.48 10 10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 8l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 10h-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    step: '01',
    title: 'Coin Kazan',
    desc: 'Canlı yayında duyurulan şifreleri gir, görev tamamla, coin biriktir.',
    color: '#00E676',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 7V5a2 2 0 0 0-4 0v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="14" r="2" />
      </svg>
    ),
    step: '02',
    title: 'Bilet Al',
    desc: 'Coinlerini harcayarak istediğin çekilişe bilet satın al. Ne kadar fazla, o kadar şans.',
    color: '#00E676',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    step: '03',
    title: 'Çekilişi Bekle',
    desc: 'Çekiliş tarihi geldiğinde canlı yayında rastgele kazanan belirlenir.',
    color: '#f97316',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16 6 12 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="2" x2="12" y2="15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    step: '04',
    title: 'Ödülünü Al',
    desc: 'Kazandığında ekip seni iletişime geçer, ödülün kapına kadar gelir.',
    color: '#f97316',
  },
];

export default function HowToJoin() {
  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-black uppercase tracking-widest text-zinc-400 whitespace-nowrap">
          Nasıl Katılabilirim?
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-zinc-700/60 to-transparent" />
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((s, idx) => (
          <div key={s.step} className="relative flex flex-col gap-4 p-5 rounded-lg border border-zinc-800 bg-[#111111] group hover:border-zinc-700 transition-colors">
            {/* Connector line (hidden on last) */}
            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute top-10 -right-2 w-4 border-t-2 border-dashed border-zinc-700 z-10" />
            )}

            {/* Step number + icon */}
            <div className="flex items-center justify-between">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}12`, border: `1px solid ${s.color}25`, color: s.color }}
              >
                {s.icon}
              </div>
              <span className="text-3xl font-black tabular-nums" style={{ color: `${s.color}15` }}>
                {s.step}
              </span>
            </div>

            {/* Text */}
            <div>
              <h3 className="text-white font-bold text-sm mb-1.5">{s.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
