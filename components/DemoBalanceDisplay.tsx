import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Wallet } from 'lucide-react';

interface Props {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  isDesktop?: boolean;
}

export const DemoBalanceDisplay: React.FC<Props> = ({ onLoginClick, onRegisterClick, isDesktop }) => {
  const { isFunMode, demoBalance } = useUser();

  if (!isFunMode) {
    if (isDesktop) return null; // Desktop normally handles login differently or handled elsewhere
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-1">
        <button
          onClick={onLoginClick}
          className="flex items-center justify-center h-[34px] md:h-[36px] bg-[#1b1e28] hover:bg-white/5 text-white border border-white/5 rounded-md font-bold text-[12px] sm:text-[13px] px-3 transition-colors whitespace-nowrap"
        >
          Giriş yap
        </button>
        <button
          onClick={onRegisterClick}
          className="flex items-center justify-center h-[34px] md:h-[36px] bg-gradient-to-r from-[#00E5FF] to-[#00b3cc] hover:brightness-110 text-[#0A0D14] border border-transparent rounded-md font-extrabold text-[12px] sm:text-[13px] px-3 sm:px-4 transition-all whitespace-nowrap shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]"
        >
          Kaydolun
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-[#0A0C10] rounded-lg p-1.5 pr-3 cursor-default border border-[#00E5FF]/20 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
        <div className="w-7 h-7 rounded bg-gradient-to-br from-[#00E5FF] to-[#00b3cc] text-[#0A0D14] flex items-center justify-center font-bold mr-2 shadow-[0_0_8px_rgba(0,229,255,0.4)]">
          <span className="text-[14px]">$</span>
        </div>
        <div className="flex flex-col items-start leading-none mr-1.5">
          <span className="text-[#00E5FF] text-[9px] font-bold uppercase tracking-widest mb-0.5">Demo Bakiye</span>
          <span className="text-white font-bold text-sm sm:text-base tracking-tight">{demoBalance.toFixed(2)}</span>
        </div>
      </div>
      {!isDesktop && onLoginClick && (
        <button onClick={onLoginClick} className="w-9 h-9 flex items-center justify-center bg-[#1b1e28] hover:bg-[#202632] rounded-md transition-colors border border-white/10" title="Giriş Yap">
           <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
        </button>
      )}
    </div>
  );
};
