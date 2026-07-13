import React from 'react';
import { ArrowLeft, Target, Activity, Shield, Trophy } from 'lucide-react';
import { PromoSlider } from './PromoSlider';
import CategoryNav from './CategoryNav';
import AnalysisView from './AnalysisView';
import { MatchAnalysis, Coupon, SiteUser } from '../types';

interface KralViewProps {
  onBack: () => void;
  onShowLiveScore?: () => void;
  onNavigate?: (view: string) => void;
  analyses?: MatchAnalysis[];
  coupons?: Coupon[];
  siteUser?: SiteUser | null;
  isLoggedIn?: boolean;
  onLoginRequired?: () => void;
  initialExpandedId?: string | null;
}

const KralView = ({ 
  onBack, 
  onShowLiveScore,
  onNavigate,
  analyses,
  coupons,
  siteUser,
  isLoggedIn,
  onLoginRequired,
  initialExpandedId
}: KralViewProps) => {
  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00FFA3] rounded-full blur-[150px] opacity-[0.03]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00FFA3] rounded-full blur-[180px] opacity-[0.02]" />
      </div>

      {/* Top Navbar */}
      <div className="flex items-center justify-between p-6 z-10 border-b border-white/5 bg-[#0A0D14]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-black italic tracking-wider text-white">
              724<span className="text-[#00FFA3]">ANALİZ</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Özel Analiz Portalı (Beta)</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="max-w-4xl w-full flex flex-col items-center">
            <CategoryNav />
            
            {/* ── Ekstra Oyunlar & Görevler ── */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full mt-6">
              <button 
                onClick={() => onNavigate?.('pool')} 
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#00FFA3]/50 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg group"
              >
                <Target className="w-5 h-5 text-gray-400 group-hover:text-[#00FFA3] transition-colors" />
                <span className="text-sm font-black text-white tracking-wider uppercase">724TOTO</span>
              </button>
              <button 
                onClick={() => onNavigate?.('loyalty')} 
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#00FFA3]/50 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg group"
              >
                <Trophy className="w-5 h-5 text-gray-400 group-hover:text-[#00FFA3] transition-colors" />
                <span className="text-sm font-black text-white tracking-wider uppercase">Görevler</span>
              </button>
              <button 
                onClick={() => onNavigate?.('wheel')} 
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-white/10 hover:border-[#00FFA3]/50 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg group"
              >
                <Activity className="w-5 h-5 text-gray-400 group-hover:text-[#00FFA3] transition-colors" />
                <span className="text-sm font-black text-white tracking-wider uppercase">Çarkıfelek</span>
              </button>
            </div>
            {/* ── Canlı Skor Section ── */}
            <div className="p-4 sm:p-6 mb-6 rounded-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-zinc-800/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 w-full text-left">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-[#00FFA3]/10 flex items-center justify-center border border-[#00FFA3]/20 shrink-0">
                  <Target className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider italic">MAÇ SONUÇLARI & CANLI SKOR</h3>
                  <p className="text-gray-400 text-xs font-medium mt-0.5 line-clamp-1 sm:line-clamp-none">Dünya genelindeki tüm maçların anlık skorlarını takip edin.</p>
                </div>
              </div>
              <button 
                onClick={onShowLiveScore}
                className="w-full sm:w-auto px-6 py-3 bg-[#00FFA3] hover:bg-[#33FFB5] text-black text-xs sm:text-sm font-black rounded-lg transition-all hover:scale-105 active:scale-95 uppercase tracking-wider shrink-0 mt-2 sm:mt-0"
              >
                Canlı Skor
              </button>
            </div>

            {/* ── Promosyonlar Section ── */}
            <div className="w-full mb-8">
              <PromoSlider />
            </div>

            {/* ── Analizler Section ── */}
            <div className="w-full">
              <AnalysisView 
                onNavigate={onNavigate}
                analyses={analyses}
                coupons={coupons}
                siteUser={siteUser}
                isLoggedIn={isLoggedIn}
                onLoginRequired={onLoginRequired}
                initialExpandedId={initialExpandedId}
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default KralView;
