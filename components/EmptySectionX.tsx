import React from 'react';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EmptySectionX() {
  return (
    <div className="mb-4 mt-8 w-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <Flame size={24} className="text-[#00E5FF] animate-pulse" />
          <h2 className="text-xl md:text-2xl font-black text-white">x</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#848B9D] hidden sm:block">Tümünü Gör</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#848B9D] hover:text-white transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3 w-full animate-fade-in relative px-1 md:px-0 min-h-[150px]">
        {/* Oyunlar daha sonra buraya eklenecek */}
      </div>
    </div>
  );
}
