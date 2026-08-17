import React, { useState } from 'react';
import { Tv, Activity, Pin, PlayCircle, BarChart2, Clock, Scale, Star } from 'lucide-react';
import { LiveMatchRadar } from './LiveMatchRadar';
import { MatchInfo } from './types';

interface MatchAnimationPlayerProps {
  match: MatchInfo;
  stats: any;
  homeStats: any;
  awayStats: any;
}

export const MatchAnimationPlayer: React.FC<MatchAnimationPlayerProps> = ({ match, stats, homeStats, awayStats }) => {
  const [activeRightTab, setActiveRightTab] = useState<'video'|'animation'>('animation');
  const [animTab, setAnimTab] = useState<'pitch'|'stats'|'timeline'|'h2h'|'standings'>('pitch');

  return (
    <div className="bg-[#1a1d29] rounded-xl overflow-hidden border border-white/5 shadow-[0_0_20px_rgba(0,0,0,0.5)] sticky top-4 h-full flex flex-col">
       {/* Player Tabs */}
       <div className="flex items-center justify-between p-2 border-b border-white/5 bg-[#0a0c10]">
          <div className="flex items-center gap-1 bg-[#12141c] p-1 rounded-xl w-full border border-white/5 shadow-inner">
             <button 
                onClick={() => setActiveRightTab('video')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  activeRightTab === 'video' 
                    ? 'bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white shadow-[0_2px_10px_rgba(59,130,246,0.3)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
             >
                <Tv className="w-3.5 h-3.5" />
                Video
             </button>
             <button 
                onClick={() => setActiveRightTab('animation')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  activeRightTab === 'animation' 
                    ? 'bg-gradient-to-b from-[color:var(--theme-accent)] to-[#0284c7] text-[#050505] shadow-[0_2px_10px_rgba(var(--theme-accent-rgb),0.3)]' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
             >
                <Activity className="w-3.5 h-3.5" />
                Animasyon
             </button>
          </div>
          <div className="flex items-center gap-1 ml-2">
             <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all shadow-sm">
                <Pin className="w-4 h-4" />
             </button>
          </div>
       </div>

       {/* Player Content */}
       {activeRightTab === 'video' ? (
         <div className="aspect-video bg-[#0c0d12] flex flex-col items-center justify-center p-6 text-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]"></div>
            
            <div className="w-12 h-12 rounded-full bg-[#1a1d29] border border-[#222635] flex items-center justify-center mb-4 relative z-10 shadow-lg">
               <div className="w-6 h-6 rounded-full bg-[#3b82f6]/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
               </div>
            </div>
            
            <h4 className="text-white font-bold text-[13px] mb-4 relative z-10">
               Lütfen izlemek için oturum aç
            </h4>
            
            <button className="w-full bg-[#3b82f6] hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all relative z-10">
               GİRİŞ
            </button>
            
            <div className="text-[10px] text-zinc-400 mt-4 relative z-10">
               Herhangi bir hesabınız yok mu? <span className="text-[#3b82f6] underline cursor-pointer hover:text-white">Hemen Üye Ol!</span>
            </div>
         </div>
       ) : (
         <div className="flex flex-col flex-1 bg-[#0a0a0c]">
           
           {/* Momentum Bars (Pure Dark Style) */}
           {(() => {
             const hPossRaw = parseInt(stats?.possession?.team1_value) || parseInt(homeStats?.possession) || parseInt((match as any).homeStats?.possession) || 45;
             const aPossRaw = parseInt(stats?.possession?.team2_value) || parseInt(awayStats?.possession) || parseInt((match as any).awayStats?.possession) || 55;
             const totalPoss = hPossRaw + aPossRaw;
             const hPoss = totalPoss > 0 ? Math.round((hPossRaw / totalPoss) * 100) : 45;
             const aPoss = totalPoss > 0 ? Math.round((aPossRaw / totalPoss) * 100) : 55;

             const hDangAtt = parseInt(stats?.dangerous_attack?.team1_value) || parseInt(homeStats?.dangerous_attack) || parseInt((match as any).homeStats?.dangerousAttacks) || 32;
             const aDangAtt = parseInt(stats?.dangerous_attack?.team2_value) || parseInt(awayStats?.dangerous_attack) || parseInt((match as any).awayStats?.dangerousAttacks) || 48;
             const totalDangAtt = hDangAtt + aDangAtt;
             const normalizedHDangAtt = totalDangAtt > 0 ? Math.round((hDangAtt / totalDangAtt) * 100) : 40;
             const normalizedADangAtt = totalDangAtt > 0 ? Math.round((aDangAtt / totalDangAtt) * 100) : 60;

             return (
                 <div className="flex flex-col px-5 py-5 bg-gradient-to-b from-[#0c0e14] to-[#0a0a0c] border-b border-white/5 gap-5 relative overflow-hidden">
                   {/* Background Glow */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none"></div>
                   
                   {/* Possession */}
                   <div className="flex flex-col gap-2.5 relative z-10">
                      <div className="flex justify-between text-[10px] font-black text-white tracking-[0.15em] uppercase drop-shadow-md">
                         <span className="w-12 text-left text-[#3b82f6]">{hPoss}%</span>
                         <span className="text-zinc-400">Topa Sahip Olma</span>
                         <span className="w-12 text-right text-[#ef4444]">{aPoss}%</span>
                      </div>
                      <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#12141c] gap-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-white/5 relative">
                         <div className="bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] h-full rounded-full relative transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.6)]" style={{ width: `${hPoss}%` }}></div>
                         <div className="bg-gradient-to-l from-[#b91c1c] to-[#ef4444] h-full rounded-full relative transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.6)]" style={{ width: `${aPoss}%` }}></div>
                      </div>
                   </div>
                   
                   {/* Dangerous Attacks */}
                   <div className="flex flex-col gap-2.5 relative z-10">
                      <div className="flex justify-between text-[10px] font-black text-white tracking-[0.15em] uppercase drop-shadow-md">
                         <span className="w-12 text-left text-[#3b82f6]">{hDangAtt}</span>
                         <span className="text-zinc-400">Tehlikeli Atak</span>
                         <span className="w-12 text-right text-[#ef4444]">{aDangAtt}</span>
                      </div>
                      <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#12141c] gap-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] border border-white/5 relative">
                         <div className="bg-gradient-to-r from-[#1d4ed8] to-[#3b82f6] h-full rounded-full relative transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.6)]" style={{ width: `${normalizedHDangAtt}%` }}></div>
                         <div className="bg-gradient-to-l from-[#b91c1c] to-[#ef4444] h-full rounded-full relative transition-all duration-1000 shadow-[0_0_10px_rgba(239,68,68,0.6)]" style={{ width: `${normalizedADangAtt}%` }}></div>
                      </div>
                   </div>
                 </div>
             );
           })()}

           {/* Tracker Body */}
           <div className="flex-1 relative overflow-hidden bg-[#0a0a0c]">
             
             {animTab === 'pitch' && (
               <div className="absolute inset-0 flex flex-col relative overflow-hidden bg-[#0a0a0c]">
                 {(() => {
                   const hPossRaw = parseInt(stats?.possession?.team1_value) || parseInt(homeStats?.possession) || parseInt((match as any).homeStats?.possession) || 45;
                   const aPossRaw = parseInt(stats?.possession?.team2_value) || parseInt(awayStats?.possession) || parseInt((match as any).awayStats?.possession) || 55;
                   const totalPoss = hPossRaw + aPossRaw;
                   const hPoss = totalPoss > 0 ? Math.round((hPossRaw / totalPoss) * 100) : 45;
                   const aPoss = totalPoss > 0 ? Math.round((aPossRaw / totalPoss) * 100) : 55;
                   
                   const hDangAtt = parseInt(stats?.dangerous_attack?.team1_value) || parseInt(homeStats?.dangerous_attack) || parseInt((match as any).homeStats?.dangerousAttacks) || 32;
                   const aDangAtt = parseInt(stats?.dangerous_attack?.team2_value) || parseInt(awayStats?.dangerous_attack) || parseInt((match as any).awayStats?.dangerousAttacks) || 48;
                   return <LiveMatchRadar homePossession={hPoss} awayPossession={aPoss} homeAttacks={hDangAtt} awayAttacks={aDangAtt} />;
                 })()}
               </div>
             )}

             {animTab === 'stats' && (
               <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-3">
                 {[
                   { label: 'Ataklar', h: stats?.attack?.team1_value || homeStats?.attack || (match as any).homeStats?.attack, a: stats?.attack?.team2_value || awayStats?.attack || (match as any).awayStats?.attack },
                   { label: 'Tehlikeli Ataklar', h: stats?.dangerous_attack?.team1_value || homeStats?.dangerous_attack || (match as any).homeStats?.dangerous_attack, a: stats?.dangerous_attack?.team2_value || awayStats?.dangerous_attack || (match as any).awayStats?.dangerous_attack },
                   { label: 'İsabetli Şutlar', h: stats?.shot_on_target?.team1_value || homeStats?.ShotOnTarget || (match as any).homeStats?.shotsOnTarget, a: stats?.shot_on_target?.team2_value || awayStats?.ShotOnTarget || (match as any).awayStats?.shotsOnTarget },
                   { label: 'Kornerler', h: stats?.corner?.team1_value || homeStats?.Corner || (match as any).homeStats?.corners, a: stats?.corner?.team2_value || awayStats?.Corner || (match as any).awayStats?.corners },
                   { label: 'Sarı Kartlar', h: stats?.yellow_card?.team1_value || homeStats?.YellowCard || (match as any).homeStats?.yellowCards, a: stats?.yellow_card?.team2_value || awayStats?.YellowCard || (match as any).awayStats?.yellowCards },
                   { label: 'Kırmızı Kart', h: stats?.red_card?.team1_value || homeStats?.RedCard || (match as any).homeStats?.redCards, a: stats?.red_card?.team2_value || awayStats?.RedCard || (match as any).awayStats?.redCards },
                 ].map((stat, i) => {
                   const hVal = stat.h !== undefined ? stat.h : '-';
                   const aVal = stat.a !== undefined ? stat.a : '-';
                   const hNum = typeof stat.h === 'number' ? stat.h : 0;
                   const aNum = typeof stat.a === 'number' ? stat.a : 0;
                   
                   const total = hNum + aNum;
                   const hp = total > 0 ? (hNum / total) * 100 : 0;
                   const ap = total > 0 ? (aNum / total) * 100 : 0;
                   
                   return (
                     <div key={i} className="flex flex-col gap-1">
                       <div className="flex justify-between items-center text-[10px] font-bold text-white px-1">
                         <span>{hVal}</span>
                         <span className="text-zinc-400">{stat.label}</span>
                         <span>{aVal}</span>
                       </div>
                       <div className="flex h-1.5 w-full bg-[#1a1d29] rounded-full overflow-hidden">
                         <div className="h-full bg-[#ef4444]" style={{ width: `${hp}%` }}></div>
                         <div className="h-full bg-[#10b981]" style={{ width: `${ap}%` }}></div>
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
             
             {(animTab === 'timeline' || animTab === 'h2h' || animTab === 'standings') && (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                 <Activity className="w-8 h-8 text-zinc-600 mb-2" />
                 <div className="text-zinc-400 text-xs font-bold mb-1">
                   {animTab === 'timeline' ? 'Maç Özeti' : animTab === 'h2h' ? 'Karşılaşma Geçmişi' : 'Puan Durumu'}
                 </div>
                 <div className="text-zinc-500 text-[10px]">
                   Bu veriler şu an için güncelleniyor...
                 </div>
               </div>
             )}

           </div>

           {/* Tracker Nav */}
           <div className="flex items-center bg-[#0a0a0c] border-t border-white/5 relative z-20">
             {[
               { id: 'pitch', icon: PlayCircle },
               { id: 'stats', icon: BarChart2 },
               { id: 'timeline', icon: Clock },
               { id: 'h2h', icon: Scale },
               { id: 'standings', icon: Star },
             ].map(tab => {
               const Icon = tab.icon;
               const isActive = animTab === tab.id;
               return (
                 <button 
                   key={tab.id}
                   onClick={() => setAnimTab(tab.id as any)}
                   className={`flex-1 flex items-center justify-center py-3.5 relative transition-all group overflow-hidden ${
                     isActive ? 'text-[color:var(--theme-accent)]' : 'text-zinc-500 hover:text-zinc-300'
                   }`}
                 >
                   {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--theme-accent)]/10 to-transparent"></div>
                   )}
                   <Icon className={`w-4 h-4 relative z-10 transition-all ${isActive ? 'drop-shadow-[0_0_8px_rgba(var(--theme-accent-rgb),0.8)] scale-110' : 'group-hover:scale-110'}`} />
                   {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] bg-[color:var(--theme-accent)] shadow-[0_0_10px_rgba(var(--theme-accent-rgb),1)]"></div>
                   )}
                 </button>
               );
             })}
           </div>
           
         </div>
       )}
    </div>
  );
};
