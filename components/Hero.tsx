import React from 'react';
import { Target, BarChart, ShieldCheck, MessageSquare, CheckCircle2, Users, FileSearch, Zap } from 'lucide-react';

interface HeroProps {
  onNavigate?: (view: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: <FileSearch className="w-8 h-8 text-[#FFC107]" />,
      title: "Derin Maç Analizi",
      desc: "Sadece skor tahmini değil, taktiksel diziliş ve sakatlık raporlarını içeren kapsamlı analiz."
    },
    {
      icon: <BarChart className="w-8 h-8 text-[#FFC107]" />,
      title: "xG & İstatistik Raporu",
      desc: "Beklenen gol (xG) verileri ve ileri düzey istatistiklerle desteklenmiş profesyonel raporlama."
    },
    {
      icon: <Target className="w-8 h-8 text-[#FFC107]" />,
      title: "Risk Skorlaması",
      desc: "Her tahmin için yapay zeka destekli risk analizi ve kasa yönetimi önerileri."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-[#FFC107]" />,
      title: "Editör Yorumu",
      desc: "Yılların tecrübesine sahip profesyonel tipster kadrosundan özel maç yorumları."
    }
  ];

  const stats = [
    { label: "BAŞARI ORANI", value: "%78" },
    { label: "ANALİZ SAYISI", value: "500+" },
    { label: "GÜNCEL İÇERİK", value: "GÜNLÜK" },
    { label: "SİSTEM DURUMU", value: "7/24 AKTİF" }
  ];

  return (
    <section className="relative w-full py-32 bg-[#0B0B0F] overflow-hidden border-t border-white/5">
      <div className="relative max-w-[1240px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-24 animate-fade-in-up">
          <h2 className="text-[42px] md:text-[56px] font-black text-white mb-6 leading-tight">
            Kazanç Tesadüf Değil,<br />
            <span className="text-[#FFC107]">ANALİZ</span> İşidir.
          </h2>
          <p className="text-[#A0A0A0] text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            724Bets, sadece tahmin paylaşmaz. İstatistik, form, xG ve maç içi senaryolarla
            veri destekli profesyonel analizler üretir.
          </p>
          <button
            onClick={() => onNavigate?.('analysis')}
            className="px-8 py-4 bg-gradient-to-r from-[#f0b90b] to-[#FFC107] text-black font-black uppercase tracking-widest text-sm rounded-full shadow-[0_0_30px_rgba(240,185,11,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(240,185,11,0.5)] transition-all duration-300"
          >
            TÜM ANALİZLERİ GÖR
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-card p-10 rounded-[30px] hover:border-[#FFC107]/30 transition-all duration-500 group animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="mb-8 p-4 bg-[#FFC107]/5 rounded-2xl w-fit group-hover:bg-[#FFC107]/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-white font-black text-xl mb-4 italic uppercase tracking-tight">
                {feature.title}
              </h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Trust/Stats Strip */}
        <div className="bg-[#111118] border border-white/5 rounded-[40px] px-12 py-10 flex flex-wrap items-center justify-around gap-12 animate-fade-in-up animate-delay-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-[#FFC107] text-4xl font-black italic">{stat.value}</span>
              <span className="text-zinc-600 text-[10px] font-black tracking-[0.2em] uppercase">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
