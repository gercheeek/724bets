
import React from 'react';
import { UserStats } from '../types';
import { Shield, Clock, TrendingUp, History, Star } from 'lucide-react';

interface ProfileViewProps {
  userStats: UserStats;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userStats }) => {
  const vipNames = ['BRONZ ÜYE', 'GÜMÜŞ ÜYE', 'ALTIN ÜYE', 'PLATİN ÜYE', 'KRAL ÜYE'];
  const vipMultipliers = [0, 5, 10, 20, 30];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: User Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border-2 border-primary/20 rounded-[40px] p-8 flex flex-col items-center text-center glow-primary">
            <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-black mb-4 shadow-xl">
               <Shield className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-black text-white italic tracking-tighter">HESAP ÖZETİ</h3>
            <span className="bg-zinc-800 text-zinc-500 text-[10px] font-black px-4 py-1 rounded-full mt-2">ID: #724001</span>
            
            <div className="mt-8 w-full space-y-4">
                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                    <span className="text-zinc-500 font-bold text-[10px] uppercase block mb-1">Mevcut Bakiye</span>
                    <span className="text-primary font-black text-2xl">{userStats.balance} BONUS</span>
                </div>
                <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800">
                    <span className="text-zinc-500 font-bold text-[10px] uppercase block mb-1">VIP Seviyesi</span>
                    <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-white font-black text-lg">{vipNames[userStats.vipLevel - 1]}</span>
                    </div>
                    <span className="text-primary text-[10px] font-bold mt-1 block">+{vipMultipliers[userStats.vipLevel - 1]}% Bonus Avantajı</span>
                </div>
            </div>
          </div>
        </div>

        {/* Right: History Logs */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-black mb-4 flex items-center gap-3 uppercase italic">
              <History className="w-5 h-5 text-primary" /> Son İşlemler
            </h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-[30px] overflow-hidden">
                {userStats.bonusHistory.length === 0 ? (
                    <div className="p-12 text-center text-zinc-600 font-bold uppercase text-xs tracking-widest">Henüz bir işlem yok</div>
                ) : (
                    <div className="divide-y divide-zinc-800">
                        {userStats.bonusHistory.map((log, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-green-500">
                                        <TrendingUp className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white font-black text-xs uppercase">{log.reason}</span>
                                        <span className="text-zinc-500 text-[10px] font-bold">{new Date(log.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                                <span className="text-primary font-black text-sm">+{log.amount} BONUS</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </section>

          <section>
             <h2 className="text-xl font-black mb-4 flex items-center gap-3 uppercase italic">
              <TrendingUp className="w-5 h-5 text-primary" /> İstatistikler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-6 rounded-[30px] border border-zinc-800">
                    <span className="text-zinc-500 font-bold text-xs uppercase">Tamamlanan Görevler</span>
                    <p className="text-white font-black text-3xl mt-1">{userStats.taskLogs.length}</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-[30px] border border-zinc-800">
                    <span className="text-zinc-500 font-bold text-xs uppercase">Açılan Kasalar</span>
                    <p className="text-white font-black text-3xl mt-1">{userStats.caseHistory.length}</p>
                </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
