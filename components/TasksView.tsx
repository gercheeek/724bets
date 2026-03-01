
import React, { useState, useEffect } from 'react';
import { Task, UserStats } from '../types';
import { CheckCircle, Clock, Star, Gift, Share2, Zap } from 'lucide-react';

interface TasksViewProps {
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
  onReward: (amount: number, reason: string) => void;
}

const DEFAULT_TASKS: Task[] = [
  { id: 'daily-login', title: 'Günlük Giriş', description: 'Günde bir kez siteyi ziyaret ederek ödülünü al.', reward: 5, icon: 'Zap', cooldownHours: 24, isActive: true },
  { id: 'wheel-spin', title: 'Çarkıfelek Çevir', description: 'Bonus çarkını çevirerek şansını dene.', reward: 10, icon: 'Star', cooldownHours: 24, isActive: true },
  { id: 'visit-site', title: 'Siteyi Gez', description: 'Sponsor siteleri ziyaret ederek bonus kazan.', reward: 3, icon: 'Gift', cooldownHours: 24, isActive: true },
  { id: 'invite-friend', title: 'Arkadaş Davet Et', description: 'Referansınla üye olan her arkadaşın için ödül kazan.', reward: 20, icon: 'Share2', cooldownHours: 24, isActive: true },
];

const TasksView: React.FC<TasksViewProps> = ({ userStats, setUserStats, onReward }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('site_tasks');
    setTasks(saved ? JSON.parse(saved) : DEFAULT_TASKS);
  }, []);

  const getCooldownStatus = (taskId: string) => {
    const log = userStats.taskLogs.find(l => l.taskId === taskId);
    if (!log) return { isReady: true };
    
    const task = tasks.find(t => t.id === taskId);
    const cooldownMs = (task?.cooldownHours || 24) * 3600000;
    const timeLeft = cooldownMs - (Date.now() - log.completedAt);
    
    if (timeLeft <= 0) return { isReady: true };
    return { isReady: false, timeLeft };
  };

  const completeTask = (task: Task) => {
    const status = getCooldownStatus(task.id);
    if (!status.isReady) return;

    onReward(task.reward, `${task.title} Görevi Tamamlandı`);
    
    setUserStats(prev => ({
      ...prev,
      taskLogs: [
        { taskId: task.id, completedAt: Date.now() },
        ...prev.taskLogs.filter(l => l.taskId !== task.id)
      ]
    }));
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}s ${minutes}d`;
  };

  const IconMap: any = { Zap, Star, Gift, Share2 };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">GÜNLÜK GÖREVLER</h2>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Her gün tamamla, bonuslarını topla!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.filter(t => t.isActive).map(task => {
          const status = getCooldownStatus(task.id);
          const Icon = IconMap[task.icon] || Zap;
          
          return (
            <div key={task.id} className={`bg-zinc-900 border-2 rounded-[30px] p-6 flex items-center gap-6 transition-all group ${status.isReady ? 'border-primary/20 hover:border-primary glow-primary' : 'border-zinc-800 opacity-80'}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${status.isReady ? 'bg-primary text-black shadow-lg animate-float' : 'bg-zinc-800 text-zinc-600'}`}>
                <Icon className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-black text-xl text-white mb-1 uppercase italic">{task.title}</h3>
                <p className="text-zinc-500 text-xs font-bold leading-relaxed">{task.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="bg-zinc-800 text-primary px-3 py-1 rounded-full text-[10px] font-black border border-primary/20">+{task.reward} BONUS</span>
                  {!status.isReady && (
                    <span className="text-zinc-500 text-[10px] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTime(status.timeLeft!)} kaldı
                    </span>
                  )}
                </div>
              </div>

              <button 
                disabled={!status.isReady}
                onClick={() => completeTask(task)}
                className={`px-6 py-3 rounded-2xl font-black text-xs transition-all ${status.isReady ? 'bg-primary text-black hover:scale-105 active:scale-95' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
              >
                {status.isReady ? 'ÖDÜLÜ AL' : 'TAMAMLANDI'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksView;
