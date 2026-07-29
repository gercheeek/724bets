import React, { useState } from 'react';
import { Crown, Shield, Zap, Target, Star, Gift, ChevronRight, CheckCircle2, Lock, Flame, Diamond, TrendingUp, Gem } from 'lucide-react';

interface VIPClubViewProps {
  onNavigate?: (view: string) => void;
  siteUser?: any;
}

const VIPClubView: React.FC<VIPClubViewProps> = ({ onNavigate, siteUser }) => {
  // Mock Data for Gamification
  const currentXP = 4250;
  const nextLevelXP = 5000;
  const progressPercent = (currentXP / nextLevelXP) * 100;
  
  const currentLevel = { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: Crown };
  const nextLevel = { name: 'Platinum', color: 'from-slate-300 to-slate-500', icon: Diamond };

  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);

  const handleClaim = (taskId: string) => {
    if (!claimedTasks.includes(taskId)) {
      setClaimedTasks([...claimedTasks, taskId]);
      // In a real app, you would add XP here via API
    }
  };

  const tasks = [
    { id: 'task-1', title: 'Günün Ziyareti', desc: 'Bugün 3 farklı sponsorumuzun sitesine giriş yap.', progress: 3, target: 3, reward: '50 XP', xpReward: 50 },
    { id: 'task-2', title: 'Hacim Şampiyonu', desc: 'Herhangi bir partner sitemizde 100$ bahis hacmi oluştur.', progress: 65, target: 100, reward: '100 XP + Çekiliş Bileti', xpReward: 100 },
    { id: 'task-3', title: 'Profilini Tamamla', desc: 'Telefon numaranı ve Telegram hesabını profilinle eşleştir.', progress: 1, target: 2, reward: '200 XP', xpReward: 200 },
  ];

  const benefits = [
    { level: 'Bronze', req: '0 XP', cashback: '%0', support: 'Standart', withdrawal: 'Normal' },
    { level: 'Silver', req: '1,000 XP', cashback: '%2', support: 'Öncelikli', withdrawal: 'Hızlı' },
    { level: 'Gold', req: '3,000 XP', cashback: '%5', support: 'VIP', withdrawal: 'Çok Hızlı' },
    { level: 'Platinum', req: '5,000 XP', cashback: '%10', support: 'Özel Menajer', withdrawal: 'Anında' },
    { level: 'Diamond', req: '15,000 XP', cashback: '%15', support: 'Özel Menajer', withdrawal: 'Limitsiz & Anında' },
  ];

  return (
    <div className="w-full h-full min-h-[calc(100vh-140px)] bg-[#0A0D14] flex flex-col items-center relative overflow-hidden pb-24">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 lg:pt-16">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-[#131823] rounded-2xl border border-white/5 shadow-2xl mb-6">
            <Gem className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-[40px] md:text-[56px] font-black leading-[1.1] tracking-tight text-white mb-4">
            Sadakat <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400 italic">Programı</span>
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#8b92a5] font-medium leading-relaxed max-w-[600px] mx-auto">
            Sitemizi ne kadar çok kullanırsan o kadar çok kazanırsın. Görevleri tamamla, seviye atla ve eşsiz ayrıcalıkların kilidini aç!
          </p>
        </div>

        {/* PROGRESS HERO */}
        <div className="relative w-full bg-[#131823] border border-white/10 rounded-3xl p-8 lg:p-12 mb-20 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Current Level Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentLevel.color} p-1 shadow-[0_0_30px_rgba(250,204,21,0.3)] animate-[pulse_4s_infinite]`}>
                  <div className="w-full h-full bg-[#0A0D14] rounded-full flex items-center justify-center">
                    <currentLevel.icon className="w-10 h-10 text-yellow-400" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#1b2230] border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                  LVL 3
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[#8b92a5] font-semibold uppercase tracking-wider text-[12px] mb-1">Mevcut Seviyen</span>
                <h2 className="text-3xl font-black text-white italic">{currentLevel.name}</h2>
                <span className="text-yellow-400 font-bold mt-1">{currentXP.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Progress Bar Area */}
            <div className="flex-1 w-full max-w-[500px]">
              <div className="flex justify-between items-end mb-3">
                <span className="text-white font-bold">{progressPercent.toFixed(1)}%</span>
                <div className="flex flex-col items-end">
                  <span className="text-[#8b92a5] text-[11px] font-semibold uppercase tracking-wider">Sonraki Seviye</span>
                  <span className="text-white font-bold text-[14px] flex items-center gap-1">
                    {nextLevel.name} <nextLevel.icon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
              <div className="w-full h-4 bg-[#0A0D14] rounded-full overflow-hidden border border-white/5 relative">
                <div 
                  className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full relative transition-all duration-1000 ease-out`}
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                  <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-r from-transparent to-white/30 blur-[2px]"></div>
                </div>
              </div>
              <p className="text-[#8b92a5] text-xs font-medium mt-3 text-right">
                Sonraki seviyeye <strong className="text-white">{(nextLevelXP - currentXP).toLocaleString()} XP</strong> kaldı
              </p>
            </div>
          </div>
        </div>

        {/* QUESTS SECTION (Gamification) */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-white flex items-center gap-3">
              <Target className="w-7 h-7 text-purple-400" />
              VIP Görevleri
            </h3>
            <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-lg text-sm font-bold border border-purple-500/20">
              Günlük Yenilenir
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              const isCompleted = task.progress >= task.target;
              const isClaimed = claimedTasks.includes(task.id);
              const taskProgressPercent = Math.min((task.progress / task.target) * 100, 100);

              return (
                <div key={task.id} className={`bg-[#131823] border ${isCompleted && !isClaimed ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/5'} rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:border-white/10`}>
                  {isClaimed && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white font-bold tracking-wide">Ödül Alındı</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                      <h4 className="text-lg font-bold text-white mb-1 leading-tight">{task.title}</h4>
                      <p className="text-[#8b92a5] text-[13px] leading-relaxed line-clamp-2">{task.desc}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0 bg-[#0A0D14] p-2 rounded-xl border border-white/5">
                      <span className="text-yellow-400 font-bold text-sm flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" fill="currentColor" /> {task.xpReward}
                      </span>
                      <span className="text-[#8b92a5] text-[10px] font-bold uppercase">XP Ödülü</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-white">İlerleme</span>
                      <span className={isCompleted ? 'text-green-400' : 'text-[#8b92a5]'}>{task.progress} / {task.target}</span>
                    </div>
                    <div className="w-full h-2 bg-[#0A0D14] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-purple-500'}`}
                        style={{ width: `${taskProgressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <button 
                    disabled={!isCompleted || isClaimed}
                    onClick={() => handleClaim(task.id)}
                    className={`w-full py-3 rounded-xl font-bold text-[14px] transition-all flex items-center justify-center gap-2 ${
                      isClaimed ? 'bg-[#1b2230] text-[#8b92a5] cursor-not-allowed' :
                      isCompleted ? 'bg-gradient-to-r from-green-400 to-green-600 text-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] cursor-pointer' : 
                      'bg-[#1b2230] text-[#8b92a5] cursor-not-allowed'
                    }`}
                  >
                    {isClaimed ? 'Toplandı' : isCompleted ? 'Ödülü Topla' : 'Devam Ediyor'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* BENEFITS TABLE */}
        <div className="relative">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-white flex items-center justify-center gap-3 mb-2">
              <Gift className="w-7 h-7 text-yellow-400" />
              Seviye Ayrıcalıkları
            </h3>
            <p className="text-[#8b92a5] text-sm">Seviye atladıkça kilidini açacağınız ödüller</p>
          </div>

          <div className="w-full overflow-x-auto custom-scrollbar pb-4">
            <div className="min-w-[800px] bg-[#131823] rounded-3xl border border-white/5 overflow-hidden">
              <div className="grid grid-cols-5 bg-[#0A0D14]/50 border-b border-white/5 p-5">
                <div className="text-[#8b92a5] font-bold text-xs uppercase tracking-wider">Seviye & Gereksinim</div>
                <div className="text-[#8b92a5] font-bold text-xs uppercase tracking-wider text-center">Aylık Nakit İade (Cashback)</div>
                <div className="text-[#8b92a5] font-bold text-xs uppercase tracking-wider text-center">Özel Destek</div>
                <div className="text-[#8b92a5] font-bold text-xs uppercase tracking-wider text-center">Çekim Hızı & Limiti</div>
                <div className="text-[#8b92a5] font-bold text-xs uppercase tracking-wider text-right">Durum</div>
              </div>
              
              {benefits.map((tier, idx) => {
                const isCurrent = tier.level === currentLevel.name;
                const isPassed = ['Bronze', 'Silver'].includes(tier.level); // Logic mock
                const isLocked = !isCurrent && !isPassed;

                return (
                  <div key={idx} className={`grid grid-cols-5 items-center p-5 border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02] ${isCurrent ? 'bg-yellow-500/[0.03] border-l-2 border-l-yellow-400 relative' : ''}`}>
                    {isCurrent && <div className="absolute left-0 top-0 h-full w-[2px] bg-yellow-400 shadow-[0_0_15px_#facc15]"></div>}
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLocked ? 'bg-[#0A0D14]' : 'bg-gradient-to-br from-white/10 to-transparent'}`}>
                        {isLocked ? <Lock className="w-5 h-5 text-[#8b92a5]" /> : <Flame className={`w-5 h-5 ${isCurrent ? 'text-yellow-400' : 'text-white'}`} />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-bold text-[15px] ${isCurrent ? 'text-yellow-400' : isLocked ? 'text-[#8b92a5]' : 'text-white'}`}>{tier.level}</span>
                        <span className="text-[#64748b] text-[11px] font-semibold">{tier.req}</span>
                      </div>
                    </div>
                    
                    <div className={`text-center font-black text-lg ${isLocked ? 'text-[#8b92a5]' : 'text-white'}`}>
                      {tier.cashback}
                    </div>
                    
                    <div className={`text-center font-semibold text-[13px] ${isLocked ? 'text-[#8b92a5]' : 'text-slate-300'}`}>
                      {tier.support}
                    </div>

                    <div className={`text-center font-semibold text-[13px] ${isLocked ? 'text-[#8b92a5]' : 'text-slate-300'}`}>
                      {tier.withdrawal}
                    </div>

                    <div className="flex justify-end">
                      {isCurrent ? (
                         <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-lg text-xs font-bold">Aktif Seviyeniz</span>
                      ) : isPassed ? (
                         <span className="text-green-500 font-bold text-xs flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Tamamlandı</span>
                      ) : (
                         <span className="text-[#8b92a5] font-bold text-xs flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Kilitli</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VIPClubView;
