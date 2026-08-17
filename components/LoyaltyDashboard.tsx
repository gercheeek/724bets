import React from 'react';
import { Trophy, Gift, Target, Flame, Star, Zap, ChevronRight, Crown, Shield } from 'lucide-react';
import { SiteUser } from '../types';

interface LoyaltyDashboardProps {
  user: SiteUser | null;
}

const LoyaltyDashboard: React.FC<LoyaltyDashboardProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-10 h-full text-zinc-500">
        Lütfen giriş yapın.
      </div>
    );
  }

  const level = user.loyalty?.level || 1;
  const xp = user.loyalty?.points || 0;
  const xpForNextLevel = level * 1000;
  const progressPercent = Math.min((xp / xpForNextLevel) * 100, 100);

  const getTierIcon = () => {
    const tier = user.loyalty?.tier?.toLowerCase() || 'bronze';
    if (tier === 'diamond') return <Diamond className="w-8 h-8 text-blue-400" />;
    if (tier === 'platinum') return <Shield className="w-8 h-8 text-zinc-300" />;
    if (tier === 'gold') return <Crown className="w-8 h-8 text-yellow-400" />;
    if (tier === 'silver') return <Star className="w-8 h-8 text-gray-300" />;
    return <Trophy className="w-8 h-8 text-orange-400" />; // Bronze
  };

  const getTierColor = () => {
    const tier = user.loyalty?.tier?.toLowerCase() || 'bronze';
    if (tier === 'diamond') return 'from-blue-600 to-cyan-400';
    if (tier === 'platinum') return 'from-zinc-400 to-zinc-200';
    if (tier === 'gold') return 'from-yellow-600 to-yellow-400';
    if (tier === 'silver') return 'from-gray-500 to-gray-300';
    return 'from-orange-700 to-orange-400';
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 flex flex-col gap-6 animate-fade-in">
      
      {/* Header Section */}
      <div className="bg-[#12141c] rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/5 blur-3xl pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3"></div>
        
        {/* Avatar & Rank */}
        <div className="relative group shrink-0">
          <div className="w-32 h-32 rounded-2xl bg-[#1c2027] p-1 border border-white/10 shadow-lg relative z-10">
            <div className={`w-full h-full rounded-xl bg-gradient-to-br ${getTierColor()} flex items-center justify-center shadow-inner`}>
              {getTierIcon()}
            </div>
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0a0c10] border border-white/10 text-white font-black text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-xl z-20">
            SEVİYE {level}
          </div>
        </div>

        {/* User Details & XP Bar */}
        <div className="flex flex-col w-full z-10 pt-2 text-center md:text-left">
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">{user.username}</h1>
          <p className="text-zinc-400 text-sm font-medium mb-6 uppercase tracking-widest">{user.loyalty?.tier || 'Bronze'} Üye</p>

          <div className="flex flex-col w-full bg-[#0a0c10]/50 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-end mb-2">
              <span className="text-white font-bold text-sm tracking-wide">Sonraki Seviye</span>
              <div className="text-right">
                <span className="text-[#00E5FF] font-black text-lg">{xp}</span>
                <span className="text-zinc-500 font-bold text-xs ml-1">/ {xpForNextLevel} XP</span>
              </div>
            </div>
            
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden shadow-inner border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#12141c] p-5 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Görevler</div>
            <div className="text-white font-black text-xl">12 Tamamlanan</div>
          </div>
        </div>
        
        <div className="bg-[#12141c] p-5 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Seri</div>
            <div className="text-white font-black text-xl">5 Gün</div>
          </div>
        </div>
        
        <div className="bg-[#12141c] p-5 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Kazanılan Freebet</div>
            <div className="text-white font-black text-xl">250 ₺</div>
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-[#12141c] rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-[#1c2027]/50 flex items-center justify-between">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" /> Seviye Ödülleri
          </h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {[
            { lvl: 2, reward: '50 ₺ Freebet', status: 'completed' },
            { lvl: 3, reward: '100 ₺ FreeSpin', status: 'completed' },
            { lvl: 4, reward: '250 ₺ Nakit Ödül', status: 'locked' },
            { lvl: 5, reward: 'VIP Müşteri Temsilcisi', status: 'locked' }
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${item.status === 'completed' ? 'bg-green-500/5 border-green-500/20' : 'bg-[#0a0c10] border-white/5 opacity-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${item.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-zinc-500'}`}>
                  {item.lvl}
                </div>
                <div>
                  <div className={`font-bold ${item.status === 'completed' ? 'text-white' : 'text-zinc-400'}`}>{item.reward}</div>
                  <div className={`text-xs ${item.status === 'completed' ? 'text-green-400' : 'text-zinc-600'}`}>{item.status === 'completed' ? 'Alındı' : 'Kilitli'}</div>
                </div>
              </div>
              <button 
                disabled={item.status === 'completed' || item.status === 'locked'}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${item.status === 'completed' ? 'text-green-500' : 'bg-white/5 text-zinc-600'}`}
              >
                {item.status === 'completed' ? <Zap className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// SVG component missing from lucide-react import
const Diamond = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z" />
  </svg>
);

export default LoyaltyDashboard;
