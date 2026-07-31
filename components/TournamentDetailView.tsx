import React, { useState } from 'react';
import { ArrowLeft, Info, ChevronDown, ChevronUp, User, Users, DollarSign, Calendar as CalendarIcon, X, Trophy, Timer, Sparkles, Medal } from 'lucide-react';

interface Tournament {
  id: string;
  title: string;
  desc: string;
  prize: string;
  status: 'active' | 'upcoming' | 'ended';
  timeInfo: string;
  participants?: number;
  image: string;
}

interface TournamentDetailViewProps {
  tournament: Tournament;
  onBack: () => void;
}

const mockLeaderboard = [
  { rank: 1, name: 'cesurk', status: 'aktif 7 saat önce', points: 500, prize: '$97.83' },
  { rank: 2, name: 'ferman-34', status: 'Gates of Olympus Super Scatter oyununda oyna', points: 19 },
  { rank: 3, name: 'mediator#774398', status: 'aktif bir saat önce', points: 15 },
  { rank: 4, name: 'beybaba66', status: 'aktif 6 saat önce', points: 7 },
  { rank: 5, name: 'azat4141', status: 'aktif 16 saat önce', points: 6 },
  { rank: 6, name: 'salimzz', status: 'aktif 9 saat önce', points: 6 },
  { rank: 7, name: 'nilayykacar', status: 'aktif 6 saat önce', points: 6 },
  { rank: 8, name: 'hanifi61', status: 'aktif 10 saat önce', points: 5 },
];

const pragmaticGames = [
  { id: 1, name: 'Gates of Olympus', provider: 'PRAGMATIC PLAY', image: '/images/slots/gates-of-olympus.webp' },
  { id: 2, name: 'Sweet Bonanza', provider: 'PRAGMATIC PLAY', image: '/images/slots/sweet-bonanza.webp' },
  { id: 3, name: 'Starlight Princess', provider: 'PRAGMATIC PLAY', image: '/images/slots/starlight.webp' },
];

const hacksawGames = [
  { id: 4, name: 'Wanted Dead or a Wild', provider: 'HACKSAW GAMING', image: '/images/slots/wanted-dead-or-a-wild.webp' },
  { id: 5, name: 'RIP City', provider: 'HACKSAW GAMING', image: '/images/slots/rip-city.webp' },
  { id: 6, name: 'Hand of Anubis', provider: 'HACKSAW GAMING', image: '/images/slots/hand-of-anubis.webp' },
];

const leSeriesGames = [
  { id: 7, name: 'Le Bandit', provider: 'HACKSAW GAMING', image: '/images/slots/le-bandit.webp' },
  { id: 8, name: 'Le Pharaoh', provider: 'HACKSAW GAMING', image: '/images/slots/le-pharaoh.webp' },
];

const mockDates = [
  '23.07.2026', '16.07.2026', '09.07.2026', '02.07.2026', '25.06.2026',
  '18.06.2026', '11.06.2026', '04.06.2026', '28.05.2026', '21.05.2026'
];

export default function TournamentDetailView({ tournament, onBack }: TournamentDetailViewProps) {
  const [rulesOpen, setRulesOpen] = useState(false);

  let displayGames = pragmaticGames;
  if (tournament.title.includes('Le Serisi')) displayGames = leSeriesGames;
  else if (tournament.title.includes('Hacksaw')) displayGames = hacksawGames;


  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 font-sans pb-32 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Premium Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-3 text-zinc-400 hover:text-white transition-all duration-300 mb-8 group w-fit"
      >
        <div className="p-2.5 bg-[#0B0F19] rounded-xl border border-white/5 group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <ArrowLeft className="w-4 h-4 relative z-10" />
        </div>
        <span className="text-sm font-semibold tracking-wide uppercase">Turnuvalara Dön</span>
      </button>

      {/* Clean Hero Banner */}
      <div className="relative w-full h-[180px] md:h-[220px] rounded-t-xl overflow-hidden bg-[#2a3848] flex flex-col md:flex-row border border-white/5 shadow-lg">
        <div className="relative z-30 w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center h-full bg-gradient-to-r from-[#172336] to-transparent">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md">
            {tournament.title}
          </h1>
        </div>
        
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 overflow-hidden">
           <img 
             src={tournament.image} 
             alt="Promo" 
             className="w-full h-full object-cover object-right opacity-90"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[#172336] via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Status Bar */}
      <div className="w-full bg-[#1b263b] p-3 rounded-b-xl border border-white/5 border-t-0 flex items-center gap-2 mb-6 shadow-md">
        <div className={`p-1 rounded-md ${tournament.status === 'upcoming' ? 'bg-yellow-500/10' : 'bg-blue-500/10'}`}>
          <Info className={`w-4 h-4 ${tournament.status === 'upcoming' ? 'text-yellow-400' : 'text-blue-400'}`} />
        </div>
        <span className={`text-sm font-semibold tracking-wide ${tournament.status === 'upcoming' ? 'text-yellow-400' : 'text-blue-400'}`}>
          {tournament.status === 'upcoming' ? 'Yaklaşan' : 'Katılmıyorum'}
        </span>
      </div>

      <div className="w-full space-y-4">
        
        {/* Prize & Countdown Box */}
        <div className="flex flex-col md:flex-row bg-[#1b263b] rounded-xl border border-white/5 overflow-hidden shadow-sm">
          <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-white/5 bg-[#172336]/50">
            <div className="text-[11px] font-medium text-zinc-400 mb-2 tracking-wide">Ana ödül</div>
            <div className="text-2xl font-bold text-white">{tournament.prize}</div>
          </div>
          <div className="flex-1 p-5 bg-[#1b263b] flex flex-col justify-center">
            <div className="text-[11px] font-medium text-zinc-400 mb-2 tracking-wide">
              {tournament.status === 'upcoming' ? '... içinde başlar' : 'Bitiş tarihi'}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="bg-[#111827] px-3.5 py-2 rounded text-white font-mono text-sm border border-white/5 shadow-inner">00</div>
              <span className="text-zinc-500 font-bold">/</span>
              <div className="bg-[#111827] px-3.5 py-2 rounded text-white font-mono text-sm border border-white/5 shadow-inner">15</div>
              <span className="text-zinc-500 font-bold">:</span>
              <div className="bg-[#111827] px-3.5 py-2 rounded text-white font-mono text-sm border border-white/5 shadow-inner">47</div>
              <span className="text-zinc-500 font-bold">:</span>
              <div className="bg-[#111827] px-3.5 py-2 rounded text-white font-mono text-sm border border-white/5 shadow-inner">10</div>
            </div>
          </div>
        </div>

        {/* Mechanics Info */}
        <div className="bg-[#1b263b] rounded-xl border border-white/5 p-5 flex flex-col gap-3 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <span className="text-zinc-500">☁️</span> Minimum Bahis: $0,20
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <span className="text-zinc-500">👥</span> Oyuncular: {tournament.participants || 276}
          </div>
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <span className="text-zinc-500">⚔️</span> Kazanç çarpanı - kazanç çarpanınız ne kadar yüksek olursa o kadar çok puan kazanırsınız.
          </div>
        </div>

        {/* Rules Accordion */}
        <div className="bg-[#1b263b] border border-white/5 rounded-xl shadow-sm overflow-hidden">
          <button 
            onClick={() => setRulesOpen(!rulesOpen)}
            className="w-full flex items-center justify-between bg-transparent hover:bg-white/5 transition-colors p-5"
          >
            <span className="font-semibold text-white text-sm">Turnuva kuralları</span>
            {rulesOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {rulesOpen && (
            <div className="p-5 pt-2 text-sm text-zinc-300 leading-relaxed font-medium bg-[#172336]/50 border-t border-white/5">
              {tournament.title.includes('Olympus') && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-1">Mücadele: Gates of Olympus Super Scatter</h4>
                    <p>Öne çıkan oyunda çarpanları yakala! Bunu en az bir kez başarman yeterlidir.</p>
                    <ul className="list-none space-y-0.5 mt-1">
                      <li>- Her <strong className="text-yellow-400">x50</strong> çarpanda 1 puan kazan</li>
                      <li>- Her <strong className="text-yellow-400">x100</strong> çarpanda 2 puan kazan</li>
                      <li>- Her <strong className="text-yellow-400">x500</strong> çarpanda 10 puan kazan</li>
                      <li>- Her <strong className="text-yellow-400">x1000</strong> çarpanda 500 puan kazan</li>
                    </ul>
                    <p className="mt-1">Tek bir ödül sırasında liderlik tablosunun zirvesine çık ve <strong className="text-yellow-400">$100</strong> ödülün sahibi ol.</p>
                  </div>

                  <div>
                    <h4 className="text-yellow-400 font-bold mb-1">Turnuva Oyunu:</h4>
                    <p>Gates of Olympus Super Scatter</p>
                  </div>

                  <div>
                    <h4 className="text-yellow-400 font-bold mb-1">Nasıl Oynanır</h4>
                    <ul className="list-none space-y-0.5">
                      <li>- Minimum bahis: <strong className="text-yellow-400">0.20 $</strong> (veya para birimi karşılığı).</li>
                      <li>- Sadece Gates of Olympus Super Scatter oyunundaki çevrimeler geçerlidir.</li>
                      <li>- Puanlama sistemi:</li>
                    </ul>
                    <ul className="list-none space-y-0.5 mt-1 ml-2 text-yellow-400/90">
                      <li>x50 çarpanı yakala = 1 puan</li>
                      <li>x100 çarpanı yakala = 2 puan</li>
                      <li>x500 çarpanı yakala = 10 puan</li>
                      <li>x1000 çarpanı yakala = 500 puan</li>
                    </ul>
                    <p className="mt-1">1 hafta içinde en yüksek puana ulaşan oyuncu ödülü kazanır.</p>
                  </div>

                  <div>
                    <h4 className="text-yellow-400 font-bold mb-2">Puanlama Tablosu</h4>
                    <table className="w-full text-center border-collapse border border-yellow-500/50 mb-4 text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-yellow-500/50 text-yellow-400">
                          <th className="p-2 border-r border-yellow-500/50 font-semibold">Çarpan</th>
                          <th className="p-2 font-semibold">Puan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x50</td><td className="p-1.5">1</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x100</td><td className="p-1.5">2</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x500</td><td className="p-1.5">10</td></tr>
                        <tr><td className="p-1.5 border-r border-yellow-500/50">x1000</td><td className="p-1.5">500</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-2">Ödül Dağılımı</h4>
                    <table className="w-full md:w-2/3 mx-auto text-center border-collapse border border-yellow-500/50 text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-yellow-500/50 text-yellow-400">
                          <th className="p-2 border-r border-yellow-500/50 font-semibold">Sıra</th>
                          <th className="p-2 font-semibold">Ödül</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="p-1.5 border-r border-yellow-500/50">1</td><td className="p-1.5">$100</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tournament.title.includes('Le Serisi') && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-1">Meydan Okuma: Le Series Tournament</h4>
                    <p>Öne çıkan oyunlarda çarpanları yakala! En az bir kez başarman yeterlidir.</p>
                    <ul className="list-none space-y-0.5 mt-1">
                      <li>- Her <strong className="text-yellow-400">x50</strong> çarpanı için 1 puan</li>
                      <li>- Her <strong className="text-yellow-400">x100</strong> çarpanı için 2 puan</li>
                      <li>- Her <strong className="text-yellow-400">x500</strong> çarpanı için 10 puan</li>
                      <li>- Her <strong className="text-yellow-400">x1000</strong> çarpanı için 500 puan</li>
                    </ul>
                    <p className="mt-1">Liderlik tablosunda zirveye çık ve toplam <strong className="text-yellow-400">10.000 TL</strong> ödül havuzunu paylaş.</p>
                  </div>

                  <div>
                    <h4 className="text-yellow-400 font-bold mb-1">Nasıl Oynanır</h4>
                    <ul className="list-none space-y-0.5">
                      <li>- Minimum bahis: <strong className="text-yellow-400">$0.20</strong> (veya para birimi karşılığı).</li>
                      <li>- Sadece listelenen Le Series oyunlarındaki dönüşler geçerlidir.</li>
                      <li>- Puanlama sistemi:</li>
                    </ul>
                    <ul className="list-none space-y-0.5 mt-1 ml-2 text-yellow-400/90">
                      <li>x50 çarpanı = 1 puan</li>
                      <li>x100 çarpanı = 2 puan</li>
                      <li>x500 çarpanı = 10 puan</li>
                      <li>x1000 çarpanı = 500 puan</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-yellow-400 font-bold mb-2">Puan Tablosu</h4>
                    <table className="w-full text-center border-collapse border border-yellow-500/50 mb-4 text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-yellow-500/50 text-yellow-400">
                          <th className="p-2 border-r border-yellow-500/50 font-semibold">Çarpan</th>
                          <th className="p-2 font-semibold">Puan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x50</td><td className="p-1.5">1</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x100</td><td className="p-1.5">2</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x500</td><td className="p-1.5">10</td></tr>
                        <tr><td className="p-1.5 border-r border-yellow-500/50">x1000</td><td className="p-1.5">500</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-2">Ödül Dağılımı (Toplam: 10.000 TL)</h4>
                    <table className="w-full md:w-2/3 mx-auto text-center border-collapse border border-yellow-500/50 text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-yellow-500/50 text-yellow-400">
                          <th className="p-2 border-r border-yellow-500/50 font-semibold">Sıralama</th>
                          <th className="p-2 font-semibold">Ödül</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">1.</td><td className="p-1.5">5.000 TL</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">2.</td><td className="p-1.5">3.000 TL</td></tr>
                        <tr><td className="p-1.5 border-r border-yellow-500/50">3.</td><td className="p-1.5">2.000 TL</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tournament.title.includes('HAFTASONU') && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-1">Turnuva: Hafta Sonu Çarpan Turnuvası</h4>
                    <p>Seçili oyunlarda çarpanları yakala ve liderlik tablosunda zirveye çık!</p>
                    <ul className="list-none space-y-0.5 mt-1">
                      <li>- <strong className="text-yellow-400">x50</strong> çarpan için 1 puan</li>
                      <li>- <strong className="text-yellow-400">x100</strong> çarpan için 2 puan</li>
                      <li>- <strong className="text-yellow-400">x150</strong> çarpan için 3 puan</li>
                      <li>- <strong className="text-yellow-400">x200</strong> çarpan için 4 puan</li>
                      <li>- <strong className="text-yellow-400">x500</strong> çarpan için 50 puan</li>
                      <li>- <strong className="text-yellow-400">x1000</strong> çarpan için 100 puan</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-yellow-400 font-bold mb-2">Puan Tablosu</h4>
                    <table className="w-full text-center border-collapse border border-yellow-500/50 mb-4 text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-yellow-500/50 text-yellow-400">
                          <th className="p-2 border-r border-yellow-500/50 font-semibold">Çarpan</th>
                          <th className="p-2 font-semibold">Puan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x50</td><td className="p-1.5">1</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x100</td><td className="p-1.5">2</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x150</td><td className="p-1.5">3</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x200</td><td className="p-1.5">4</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">x500</td><td className="p-1.5">50</td></tr>
                        <tr><td className="p-1.5 border-r border-yellow-500/50">x1000</td><td className="p-1.5">100</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-2">Ödül Dağılımı (Toplam 5.000 EUR)</h4>
                    <table className="w-full md:w-2/3 mx-auto text-center border-collapse border border-yellow-500/50 text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-yellow-500/50 text-yellow-400">
                          <th className="p-2 border-r border-yellow-500/50 font-semibold">Sıralama</th>
                          <th className="p-2 font-semibold">Ödül</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">1.</td><td className="p-1.5">3.000 EUR</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">2.</td><td className="p-1.5">1.000 EUR</td></tr>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">3.</td><td className="p-1.5">500 EUR</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tournament.title.includes('Hacksaw') && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-1">Turnuva: Hacksaw Turnuvası</h4>
                    <p>Seçili <strong className="text-yellow-400">Hacksaw Gaming</strong> oyunlarında bahis yap, puan topla ve liderlik tablosunda zirveye yüksel!</p>
                    <p className="mt-2">Her <strong className="text-yellow-400">0.17 USD</strong> bahis için <strong className="text-yellow-400">+1 Puan</strong> kazanırsın.</p>
                    <p className="mt-1">Ayrıca elde ettiğin her <strong className="text-yellow-400">100 USD</strong> kazanç için <strong className="text-yellow-400">+5 Ekstra Puan</strong> kazanırsın.</p>
                  </div>

                  <div>
                    <h4 className="text-yellow-400 font-bold mb-2">Puanlama Sistemi</h4>
                    <table className="w-full text-center border-collapse border border-yellow-500/50 mb-4 text-xs md:text-sm">
                      <thead>
                        <tr className="border-b border-yellow-500/50 text-yellow-400">
                          <th className="p-2 border-r border-yellow-500/50 font-semibold">İşlem</th>
                          <th className="p-2 font-semibold">Kazanılan Puan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-yellow-500/50"><td className="p-1.5 border-r border-yellow-500/50">Her 0.17 USD Bahis</td><td className="p-1.5">+1 Puan</td></tr>
                        <tr><td className="p-1.5 border-r border-yellow-500/50">Her 100 USD Kazanç</td><td className="p-1.5">+5 Ekstra Puan</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-white">Liderler Tablosu</h2>
          </div>
          
          <div className="bg-[#1b263b] rounded-xl border border-white/5 overflow-hidden">
            <div className="flex flex-col">
              {mockLeaderboard.map((user, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between px-5 py-3.5 ${idx !== mockLeaderboard.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/[0.02] transition-colors`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 text-center font-semibold text-sm text-zinc-400">
                      {user.rank}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-zinc-200">{user.name}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">{user.status}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white">{user.points}</div>
                    {user.prize && <div className="text-[11px] font-semibold text-zinc-400 mt-0.5">{user.prize}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tournament Games Grid */}
        <div className="mt-8 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-semibold text-white">Turnuva oyunları</h2>
            <div className="flex items-center gap-1">
               <button className="p-1.5 bg-[#1b263b] rounded text-zinc-400 hover:text-white border border-white/5"><ChevronDown className="w-4 h-4 rotate-90" /></button>
               <button className="p-1.5 bg-[#1b263b] rounded text-zinc-400 hover:text-white border border-white/5"><ChevronDown className="w-4 h-4 -rotate-90" /></button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {displayGames.map(game => (
              <div key={game.id} className="bg-transparent rounded-lg overflow-hidden group cursor-pointer relative">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                  <img src={game.image} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center pl-0.5">
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-[8px] font-black text-white">H</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Rounds */}
        <div className="mt-8 pt-4">
          <h3 className="text-sm font-semibold text-white mb-3">Önceki turlar</h3>
          <div className="flex flex-wrap gap-2">
            {mockDates.slice(0,3).map((date, idx) => (
              <button 
                key={idx}
                className="px-3 py-1.5 bg-[#1b263b] hover:bg-white/5 border border-white/5 rounded text-[11px] font-semibold text-zinc-400 transition-all"
              >
                {date}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}


// Needed icons for Tournament Games section
function ChevronLeft(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
}
function ChevronRight(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
}
