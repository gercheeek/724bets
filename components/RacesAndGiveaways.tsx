import React from 'react';
import { Timer, Trophy, Ticket, Info } from 'lucide-react';

const CircularProgress = ({ 
  progress, 
  title, 
  time, 
  color = "#3B82F6" 
}: { 
  progress: number; 
  title: string; 
  time: string;
  color?: string;
}) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-[96px] h-[96px] flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-[#151D24]"
          strokeWidth="6"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        <circle
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-[#848B9D] text-[10px] font-medium leading-tight mb-0.5">{title}</span>
        <span className="text-white font-bold text-sm tracking-wide">{time}</span>
      </div>
    </div>
  );
};

export default function RacesAndGiveaways() {
  return (
    <div className="w-full mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Timer className="w-5 h-5 text-[#848B9D]" />
        <h2 className="text-white text-lg font-bold">Yarışlar ve Çekilişler</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Race Card */}
        <div className="bg-[#1A2229] border border-[#26313B] rounded-xl flex flex-col overflow-hidden transition-colors hover:border-[#32404D]">
          <div className="p-5 md:p-6 flex items-start justify-between">
            <div className="flex flex-col h-full">
              <h3 className="text-white font-bold text-base md:text-lg mb-1">100.000$ Yarışı</h3>
              <p className="text-[#848B9D] text-xs md:text-sm mb-6">Liderlik için yarışmaya hazır mısınız?</p>
              
              <div className="flex items-center gap-3 mt-auto">
                <button className="bg-[#263340] hover:bg-[#2F3E4D] text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors">
                  Liderlik Sıralaması
                </button>
                <button className="text-[#848B9D] hover:text-white transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="shrink-0 ml-4">
              <CircularProgress progress={65} title="Bitiş zamanı" time="17s 55d" color="#38BDF8" />
            </div>
          </div>
          
          <div className="bg-[#161D23] px-5 py-3 border-t border-[#26313B] flex items-center gap-3">
            <Trophy className="w-4 h-4 text-[#848B9D]" />
            <span className="text-[#848B9D] text-xs md:text-sm font-medium">Henüz katılmadınız</span>
          </div>
        </div>

        {/* Giveaway Card */}
        <div className="bg-[#1A2229] border border-[#26313B] rounded-xl flex flex-col overflow-hidden transition-colors hover:border-[#32404D]">
          <div className="p-5 md:p-6 flex items-start justify-between">
            <div className="flex flex-col h-full">
              <h3 className="text-white font-bold text-base md:text-lg mb-1">75.000$'lık Haftalık Çekiliş</h3>
              <p className="text-[#848B9D] text-xs md:text-sm mb-6">Haftayı galibiyetle sonlandırın!</p>
              
              <div className="flex items-center gap-3 mt-auto">
                <button className="bg-[#263340] hover:bg-[#2F3E4D] text-[#848B9D] font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-default">
                  0 Bilet
                </button>
                <button className="text-[#848B9D] hover:text-white transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="shrink-0 ml-4">
              <CircularProgress progress={35} title="Bitiş zamanı" time="2g 17s" color="#38BDF8" />
            </div>
          </div>
          
          <div className="bg-[#161D23] px-5 py-3 border-t border-[#26313B] flex items-center justify-between gap-4">
            <div className="flex items-center flex-1 gap-3">
              <Ticket className="w-4 h-4 text-[#848B9D]" />
              <div className="flex-1 h-1.5 bg-[#0F1419] rounded-full overflow-hidden">
                <div className="h-full bg-[#38BDF8] w-0"></div>
              </div>
            </div>
            <span className="text-white text-xs font-bold">0%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
