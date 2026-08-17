import React, { useState } from 'react';
import { Share2, Copy, ThumbsUp, MessageCircle, Star, Users, Flame, Trophy, ExternalLink } from 'lucide-react';
import { useBetSlip } from '../contexts/BetSlipContext';
import { triggerGlobalToast } from './GlobalToaster';

const DUMMY_SLIPS = [
  {
    id: 's1',
    user: 'BüyükUsta',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    tier: 'diamond',
    title: 'Hafta Sonu Bankosu',
    totalOdds: 4.85,
    likes: 124,
    comments: 12,
    time: '2 saat önce',
    selections: [
      { id: '1_1', matchId: 'm1', matchName: 'Galatasaray - Fenerbahçe', selectionName: 'Maç Sonucu: 1', odd: 2.10 },
      { id: '2_2', matchId: 'm2', matchName: 'Arsenal - Chelsea', selectionName: '2.5 Üst', odd: 1.65 },
      { id: '3_1', matchId: 'm3', matchName: 'Real Madrid - Barcelona', selectionName: 'Maç Sonucu: 1', odd: 1.40 },
    ]
  },
  {
    id: 's2',
    user: 'Kuponcu',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble',
    tier: 'gold',
    title: 'Sürpriz Kupon',
    totalOdds: 15.40,
    likes: 56,
    comments: 8,
    time: '4 saat önce',
    selections: [
      { id: '4_0', matchId: 'm4', matchName: 'Roma - Lazio', selectionName: 'Beraberlik', odd: 3.20 },
      { id: '5_0', matchId: 'm5', matchName: 'Sevilla - Betis', selectionName: 'Beraberlik', odd: 3.10 },
      { id: '6_2', matchId: 'm6', matchName: 'Porto - Benfica', selectionName: 'Karşılıklı Gol Var', odd: 1.55 },
    ]
  },
  {
    id: 's3',
    user: 'Kazandırır',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    tier: 'platinum',
    title: 'NBA Gecesi',
    totalOdds: 2.95,
    likes: 312,
    comments: 45,
    time: '5 saat önce',
    selections: [
      { id: '7_1', matchId: 'm7', matchName: 'Lakers - Warriors', selectionName: 'Maç Sonucu: 1', odd: 1.85 },
      { id: '8_2', matchId: 'm8', matchName: 'Celtics - Heat', selectionName: 'Maç Sonucu: 2', odd: 1.60 },
    ]
  }
];

const SocialBettingView: React.FC = () => {
  const { clearBetSlip, addSelection, setBetAmount } = useBetSlip();
  const [likedSlips, setLikedSlips] = useState<Set<string>>(new Set());

  const handleCopyBet = (slip: typeof DUMMY_SLIPS[0]) => {
    clearBetSlip();
    slip.selections.forEach(sel => addSelection(sel));
    setBetAmount(100);
    triggerGlobalToast({
      type: 'success',
      message: `${slip.user} adlı kullanıcının kuponu başarıyla kopyalandı!`,
    });
  };

  const toggleLike = (id: string) => {
    setLikedSlips(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getTierColor = (tier: string) => {
    if (tier === 'diamond') return 'text-[#00E5FF]';
    if (tier === 'platinum') return 'text-zinc-300';
    if (tier === 'gold') return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0C10] flex justify-center py-10 px-4">
      <div className="w-full max-w-[800px] flex flex-col gap-6 animate-fade-in">
        
        {/* Header */}
        <div className="bg-[#12161E] border border-[#202532] rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E5FF]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-[#00E5FF]/10 text-[#00E5FF] rounded-xl flex items-center justify-center border border-[#00E5FF]/20 shadow-[0_0_20px_rgba(0,255,163,0.2)]">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Sosyal Bahis</h1>
              <p className="text-zinc-400 text-sm mt-1">Günün en çok oynanan ve takip edilen kuponlarını kopyalayın.</p>
            </div>
          </div>
          <div className="relative z-10 flex gap-2">
            <button className="bg-[#1A212D] text-white hover:bg-white/10 font-bold px-4 py-2 rounded-lg text-sm transition-colors border border-white/5">Popüler</button>
            <button className="bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 font-bold px-4 py-2 rounded-lg text-sm transition-colors border border-[#00E5FF]/20">Kazananlar</button>
          </div>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-6">
          {DUMMY_SLIPS.map(slip => (
            <div key={slip.id} className="bg-[#12161E] border border-[#202532] rounded-2xl overflow-hidden hover:border-[#00E5FF]/30 transition-colors">
              
              {/* Post Header */}
              <div className="p-4 border-b border-[#202532] flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1A212D] border border-white/10 shrink-0">
                    <img src={slip.avatar} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{slip.user}</span>
                      <Trophy className={`w-3.5 h-3.5 ${getTierColor(slip.tier)}`} />
                    </div>
                    <div className="text-zinc-500 text-xs">{slip.time}</div>
                  </div>
                </div>
                <div className="bg-[#1A212D] border border-white/5 px-3 py-1.5 rounded-lg text-center">
                  <div className="text-zinc-500 text-[10px] font-black uppercase tracking-wider">Toplam Oran</div>
                  <div className="text-[#00E5FF] font-black text-lg">{slip.totalOdds.toFixed(2)}</div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h3 className="text-white font-bold">{slip.title}</h3>
                </div>
                
                <div className="flex flex-col gap-2">
                  {slip.selections.map((sel, idx) => (
                    <div key={idx} className="bg-[#1A212D] border border-white/5 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-zinc-300 font-bold text-sm">{sel.matchName}</span>
                        <span className="text-zinc-500 text-xs mt-0.5">{sel.selectionName}</span>
                      </div>
                      <div className="bg-white/5 px-3 py-1 rounded text-white font-black text-sm border border-white/10">
                        {sel.odd.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Post Footer */}
              <div className="p-4 border-t border-[#202532] bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleLike(slip.id)}
                    className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${likedSlips.has(slip.id) ? 'text-pink-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <ThumbsUp className="w-4 h-4" /> {slip.likes + (likedSlips.has(slip.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-300 transition-colors">
                    <MessageCircle className="w-4 h-4" /> {slip.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-zinc-300 transition-colors">
                    <Share2 className="w-4 h-4" /> Paylaş
                  </button>
                </div>
                
                <button 
                  onClick={() => handleCopyBet(slip)}
                  className="bg-[color:var(--theme-accent)] hover:bg-[#00E5FF] text-black font-black text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(0,255,163,0.3)]"
                >
                  <Copy className="w-4 h-4" />
                  Kuponu Kopyala
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialBettingView;
