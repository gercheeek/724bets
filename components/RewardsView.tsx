import React from 'react';
import { Info, Lock, ChevronRight, Check } from 'lucide-react';
import { SiteUser } from '../types';

interface RewardsViewProps {
  siteUser: SiteUser | null;
}

const RewardsView: React.FC<RewardsViewProps> = ({ siteUser }) => {
  return (
    <div className="flex-1 w-full bg-[#0a0d13] min-h-screen text-white p-4 md:p-6 lg:p-8 space-y-6">
      
      {/* Top Info row (Mock balance etc) */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6 border-b border-white/5 pb-4">
        <span className="text-white font-black text-xl tracking-tight mr-4">Ödüller</span>
        <ChevronRight className="w-4 h-4 text-zinc-600" />
        <span>Bekleyen Yeniden Yükleme <strong className="text-white">₺0,00</strong></span>
        <Info className="w-4 h-4 ml-1 cursor-pointer hover:text-white transition-colors" />
      </div>

      {/* Reward Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        
        {/* Rakeback */}
        <div className="bg-[#1a1d24] rounded-xl p-4 md:p-5 flex flex-col items-center justify-between min-h-[220px] md:min-h-[240px] border border-white/5 relative group hover:border-white/10 transition-colors">
          <div className="w-full flex justify-between items-start mb-4">
            <span className="font-bold text-sm md:text-base text-zinc-200">Bahis Geri Ödemesi</span>
            <Info className="w-4 h-4 text-zinc-500 cursor-pointer" />
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#00FFA3] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,255,163,0.15)] group-hover:shadow-[0_0_30px_rgba(0,255,163,0.3)] transition-shadow">
            <span className="text-[#00FFA3] font-black text-2xl md:text-3xl">₺</span>
          </div>
          <button className="w-full bg-[#00FFA3] hover:bg-[#00E693] text-black font-bold py-2.5 rounded-lg text-xs md:text-sm shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all">
            Şunun için Kutuyu Aç:
          </button>
        </div>

        {/* Günlük */}
        <div className="bg-[#1a1d24] rounded-xl p-4 md:p-5 flex flex-col items-center justify-between min-h-[220px] md:min-h-[240px] border border-white/5 relative group hover:border-white/10 transition-colors">
          <div className="w-full flex justify-between items-start mb-4">
            <span className="font-bold text-sm md:text-base text-zinc-200">Günlük</span>
            <Info className="w-4 h-4 text-zinc-500 cursor-pointer" />
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#00FFA3] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,255,163,0.15)] group-hover:shadow-[0_0_30px_rgba(0,255,163,0.3)] transition-shadow">
            <span className="text-[#00FFA3] font-black text-2xl md:text-3xl">1</span>
          </div>
          <button className="w-full bg-[#00FFA3] hover:bg-[#00E693] text-black font-bold py-2.5 rounded-lg text-xs md:text-sm shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all">
            Şunun için Kutuyu Aç:
          </button>
        </div>

        {/* Haftalık */}
        <div className="bg-[#1a1d24] rounded-xl p-4 md:p-5 flex flex-col items-center justify-between min-h-[220px] md:min-h-[240px] border border-white/5 relative group hover:border-white/10 transition-colors">
          <div className="w-full flex justify-between items-start mb-4">
            <span className="font-bold text-sm md:text-base text-zinc-200">Haftalık</span>
            <Info className="w-4 h-4 text-zinc-500 cursor-pointer" />
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#00FFA3] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,255,163,0.15)] group-hover:shadow-[0_0_30px_rgba(0,255,163,0.3)] transition-shadow">
            <span className="text-[#00FFA3] font-black text-2xl md:text-3xl">7</span>
          </div>
          <button className="w-full bg-[#00FFA3] hover:bg-[#00E693] text-black font-bold py-2.5 rounded-lg text-xs md:text-sm shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all">
            Şunun için Kutuyu Aç:
          </button>
        </div>

        {/* Aylık Öncesi (Locked) */}
        <div className="bg-[#1a1d24] rounded-xl p-4 md:p-5 flex flex-col items-center justify-between min-h-[220px] md:min-h-[240px] border border-white/5 relative opacity-60">
          <div className="w-full flex justify-between items-start mb-4">
            <span className="font-bold text-sm md:text-base text-zinc-400">Aylık Öncesi</span>
            <Info className="w-4 h-4 text-zinc-600 cursor-pointer" />
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-zinc-600" />
          </div>
          <div className="w-full flex items-center justify-center gap-2 bg-[#252a35] text-zinc-400 font-bold py-2.5 rounded-lg text-xs md:text-sm border border-white/5">
            Gerektirir <span className="text-zinc-300">Gümüş</span>
          </div>
        </div>

        {/* Aylık */}
        <div className="bg-[#1a1d24] rounded-xl p-4 md:p-5 flex flex-col items-center justify-between min-h-[220px] md:min-h-[240px] border border-white/5 relative group hover:border-white/10 transition-colors">
          <div className="w-full flex justify-between items-start mb-4">
            <span className="font-bold text-sm md:text-base text-zinc-200">Aylık</span>
            <Info className="w-4 h-4 text-zinc-500 cursor-pointer" />
          </div>
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-[#00FFA3] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,255,163,0.15)] group-hover:shadow-[0_0_30px_rgba(0,255,163,0.3)] transition-shadow">
            <span className="text-[#00FFA3] font-black text-2xl md:text-3xl">30</span>
          </div>
          <button className="w-full bg-[#00FFA3] hover:bg-[#00E693] text-black font-bold py-2.5 rounded-lg text-xs md:text-sm shadow-[0_0_15px_rgba(0,255,163,0.2)] transition-all">
            Şunun için Kutuyu Aç:
          </button>
        </div>

      </div>

      {/* Rank Progress */}
      <div className="bg-[#12151b] border border-white/5 rounded-2xl p-5 md:p-8 relative mt-8 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-zinc-500" />
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">Rütbe İlerlemeniz</h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30 font-bold py-2.5 px-4 md:px-6 rounded-lg text-xs md:text-sm transition-colors border border-emerald-500/30">
              Rütbe Yükseltme Ödülleri Talep Et
            </button>
            <button className="flex-1 md:flex-none bg-[#252a35] hover:bg-[#2d3340] text-zinc-300 font-bold py-2.5 px-4 md:px-6 rounded-lg text-xs md:text-sm transition-colors border border-white/5">
              Tüm Rütbeleri Görüntüle
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-10 xl:gap-20 items-center">
          {/* Progress Bar Side */}
          <div className="flex-1 w-full">
            <div className="w-full h-3 md:h-4 bg-[#252a35] rounded-full mb-6 overflow-hidden relative border border-white/5">
              <div className="absolute top-0 left-0 h-full w-[45%] bg-gradient-to-r from-[#00FFA3]/50 to-[#00FFA3] rounded-full shadow-[0_0_15px_rgba(0,255,163,0.5)]"></div>
            </div>
            <div className="flex justify-between items-center w-full px-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rotate-45 border-2 border-zinc-600 flex items-center justify-center bg-[#1a1d24]"></div>
                <span className="font-black text-zinc-400 text-xs tracking-wider">DERECESİZ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rotate-45 border-2 border-[#cd7f32] flex items-center justify-center bg-[#cd7f32]/10 shadow-[0_0_10px_rgba(205,127,50,0.3)]"></div>
                <span className="font-black text-[#cd7f32] text-xs tracking-wider">BRONZ I</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center w-full px-2 mt-8 text-xs font-medium text-zinc-400">
              <span><strong className="text-white">₺4.500,00</strong> / ₺10.000,00 Bahis Yapılan</span>
              <span>%45 Tamamlandı</span>
            </div>
          </div>

          {/* Ranks Side */}
          <div className="flex items-center justify-between xl:justify-end gap-2 md:gap-4 lg:gap-8 w-full xl:w-auto bg-[#1a1d24] p-6 rounded-xl border border-white/5">
            {/* Bronz I */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] md:text-xs font-bold text-[#cd7f32]">Bronz I</span>
              <div className="w-10 h-10 md:w-14 md:h-14 rotate-45 border-2 border-[#cd7f32] bg-[#cd7f32]/20 flex items-center justify-center shadow-[0_0_15px_rgba(205,127,50,0.3)]">
                <div className="w-5 h-5 md:w-8 md:h-8 -rotate-45 flex items-center justify-center"><Check className="w-4 h-4 text-[#cd7f32]" /></div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
            {/* Bronz II */}
            <div className="flex flex-col items-center gap-3 opacity-60">
              <span className="text-[10px] md:text-xs font-bold text-[#cd7f32]">Bronz II</span>
              <div className="w-10 h-10 md:w-14 md:h-14 rotate-45 border-2 border-zinc-700 bg-zinc-800/50 flex items-center justify-center">
                 <div className="w-4 h-4 -rotate-45 flex items-center justify-center"><Lock className="w-3 h-3 text-zinc-600" /></div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700 hidden sm:block" />
            {/* Bronz III */}
            <div className="flex flex-col items-center gap-3 opacity-60 hidden sm:flex">
              <span className="text-[10px] md:text-xs font-bold text-[#cd7f32]">Bronz III</span>
              <div className="w-10 h-10 md:w-14 md:h-14 rotate-45 border-2 border-zinc-700 bg-zinc-800/50 flex items-center justify-center">
                 <div className="w-4 h-4 -rotate-45 flex items-center justify-center"><Lock className="w-3 h-3 text-zinc-600" /></div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700 hidden md:block" />
            {/* Bronz IV */}
            <div className="flex flex-col items-center gap-3 opacity-60 hidden md:flex">
              <span className="text-[10px] md:text-xs font-bold text-[#cd7f32]">Bronz IV</span>
              <div className="w-10 h-10 md:w-14 md:h-14 rotate-45 border-2 border-zinc-700 bg-zinc-800/50 flex items-center justify-center">
                 <div className="w-4 h-4 -rotate-45 flex items-center justify-center"><Lock className="w-3 h-3 text-zinc-600" /></div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700 hidden lg:block" />
            {/* Gümüş I */}
            <div className="flex flex-col items-center gap-3 opacity-60 hidden lg:flex">
              <span className="text-[10px] md:text-xs font-bold text-zinc-300">Gümüş I</span>
              <div className="w-10 h-10 md:w-14 md:h-14 rotate-45 border-2 border-zinc-700 bg-zinc-800/50 flex items-center justify-center">
                 <div className="w-4 h-4 -rotate-45 flex items-center justify-center"><Lock className="w-3 h-3 text-zinc-600" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Totals Table */}
      <div className="bg-[#12151b] border border-white/5 rounded-2xl p-0 overflow-hidden mt-8 flex flex-col md:flex-row">
        <div className="bg-[#1a1d24] p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 md:w-[250px] relative clip-path-slant">
          <span className="font-bold text-sm text-zinc-100 mb-2">Toplam Ödüller</span>
          <span className="font-black text-2xl text-white">₺0,00</span>
          {/* A cool arrow shape divider overlay would normally go here but we simulate with border */}
        </div>
        <div className="flex-1 p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
           <div className="flex flex-col">
             <span className="text-xs text-zinc-500 font-medium mb-1">Günlük</span>
             <span className="font-bold text-sm text-zinc-200">₺0,00</span>
           </div>
           <div className="flex flex-col">
             <span className="text-xs text-zinc-500 font-medium mb-1">Haftalık</span>
             <span className="font-bold text-sm text-zinc-200">₺0,00</span>
           </div>
           <div className="flex flex-col">
             <span className="text-xs text-zinc-500 font-medium mb-1">Aylık Öncesi</span>
             <span className="font-bold text-sm text-zinc-200">₺0,00</span>
           </div>
           <div className="flex flex-col">
             <span className="text-xs text-zinc-500 font-medium mb-1">Aylık</span>
             <span className="font-bold text-sm text-zinc-200">₺0,00</span>
           </div>
           <div className="flex flex-col">
             <span className="text-xs text-zinc-500 font-medium mb-1">Bahis Geri Ödemesi</span>
             <span className="font-bold text-sm text-zinc-200">₺0,00</span>
           </div>
           <div className="flex flex-col">
             <span className="text-xs text-zinc-500 font-medium mb-1">Rütbeler</span>
             <span className="font-bold text-sm text-zinc-200">₺0,00</span>
           </div>
        </div>
      </div>

    </div>
  );
};

export default RewardsView;
