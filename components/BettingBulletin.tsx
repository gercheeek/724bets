import React from 'react';
import { MatchAnalysis } from '../types';
import { Trophy, Clock, ArrowRight } from 'lucide-react';

interface BettingBulletinProps {
  matches: MatchAnalysis[];
}

const BettingBulletin: React.FC<BettingBulletinProps> = ({ matches }) => {
  const activeMatches = matches.filter(m => m.isActive);

  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <Trophy className="w-5 h-5 text-black" />
        </div>
        <div>
          <h3 className="text-white font-black text-xl uppercase tracking-wider italic flex items-center gap-2">
            BAHİS BÜLTENİ
          </h3>
          <p className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-widest mt-0.5">En Yüksek Oranlar</p>
        </div>
      </div>

      {activeMatches.length === 0 ? (
        <div className="text-center py-12 bg-[#0F172A] rounded-lg border border-white/5">
          <p className="text-gray-400 font-bold">Şu an aktif maç bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {activeMatches.map((match) => (
            <div 
              key={match.id} 
              className="bg-[#0F172A] border border-white/5 rounded-lg p-2 md:px-4 flex flex-col md:flex-row items-center gap-3 hover:border-[#F59E0B]/30 hover:bg-[#162032] transition-all group"
            >
              {/* League & Time Info */}
              <div className="flex flex-row md:flex-col items-center md:items-start justify-between w-full md:w-36 gap-1 shrink-0">
                <div className="bg-[#1E293B] px-2 py-0.5 rounded text-[10px] font-bold text-gray-300 border border-white/5 truncate max-w-[150px] md:max-w-full text-center md:text-left">
                  {match.league}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded border border-[#F59E0B]/20">
                  <Clock className="w-3 h-3" />
                  {match.matchTime}
                </div>
              </div>

              {/* Teams */}
              <div className="flex-1 flex flex-row justify-center md:justify-start items-center w-full gap-2">
                <div className="text-white font-bold text-sm group-hover:text-amber-400 transition-colors text-right flex-1 md:flex-none md:w-32 truncate">
                  {match.homeTeam}
                </div>
                <div className="text-gray-500 font-black text-[9px] tracking-widest italic shrink-0">VS</div>
                <div className="text-white font-bold text-sm group-hover:text-amber-400 transition-colors text-left flex-1 md:flex-none md:w-32 truncate">
                  {match.awayTeam}
                </div>
              </div>

              {/* Odds */}
              <div className="flex items-center gap-1.5 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                <button className="flex-1 md:flex-none flex flex-row md:flex-col items-center justify-between md:justify-center bg-[#1E293B] border border-white/5 rounded-lg w-auto md:w-16 px-2 py-1 md:py-1 hover:bg-[#F59E0B] hover:border-[#F59E0B] group/odd transition-all cursor-pointer">
                  <span className="text-[9px] font-black text-gray-400 group-hover/odd:text-black/60 md:mb-0.5">1</span>
                  <span className="text-sm font-black text-white group-hover/odd:text-black">{match.odds1 || '-'}</span>
                </button>
                <button className="flex-1 md:flex-none flex flex-row md:flex-col items-center justify-between md:justify-center bg-[#1E293B] border border-white/5 rounded-lg w-auto md:w-16 px-2 py-1 md:py-1 hover:bg-[#F59E0B] hover:border-[#F59E0B] group/odd transition-all cursor-pointer">
                  <span className="text-[9px] font-black text-gray-400 group-hover/odd:text-black/60 md:mb-0.5">X</span>
                  <span className="text-sm font-black text-white group-hover/odd:text-black">{match.oddsX || '-'}</span>
                </button>
                <button className="flex-1 md:flex-none flex flex-row md:flex-col items-center justify-between md:justify-center bg-[#1E293B] border border-white/5 rounded-lg w-auto md:w-16 px-2 py-1 md:py-1 hover:bg-[#F59E0B] hover:border-[#F59E0B] group/odd transition-all cursor-pointer">
                  <span className="text-[9px] font-black text-gray-400 group-hover/odd:text-black/60 md:mb-0.5">2</span>
                  <span className="text-sm font-black text-white group-hover/odd:text-black">{match.odds2 || '-'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-center">
        <a 
          href="https://724bahis.net" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#F59E0B] text-xs font-black tracking-widest uppercase hover:text-white transition-colors"
        >
          TÜM BÜLTENİ GÖR <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default BettingBulletin;
