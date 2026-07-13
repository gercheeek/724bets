import React from 'react';
import { X, Calendar, Ticket, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface Selection {
  mac_adi: string;
  bahis: string;
  oran: number;
}

interface Bet {
  id: string;
  timestamp: number;
  amount: number;
  selections: Selection[];
  totalOdds: number;
  potentialPayout: number;
  status: 'PENDING' | 'WON' | 'LOST';
}

interface MyBetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyBetsModal: React.FC<MyBetsModalProps> = ({ isOpen, onClose }) => {
  const bets: Bet[] = JSON.parse(localStorage.getItem('site_my_bets') || '[]');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-zinc-800/80 rounded-lg shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-900/50 px-6 py-4 border-b border-zinc-800/50 flex justify-between items-center relative z-10">
          <h3 className="text-white font-black uppercase tracking-wider text-sm flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-500" />
            Açık & Geçmiş Bahislerim
          </h3>
          <button 
            onClick={onClose} 
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bets List Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {bets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-500">
                <Ticket size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-300">Henüz hiç bahis yapmadınız.</p>
                <p className="text-xs text-zinc-500 mt-1">Spor sayfalarından kupon yaparak bahislerinizi burada görebilirsiniz.</p>
              </div>
            </div>
          ) : (
            bets.map((bet) => (
              <div 
                key={bet.id} 
                className="bg-slate-900/40 border border-zinc-800/80 rounded-lg p-4 space-y-3 hover:border-zinc-700/80 transition-all"
              >
                {/* Bet Metadata Header */}
                <div className="flex justify-between items-start border-b border-zinc-800/50 pb-2.5">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                      Kupon ID: #{bet.id.substring(bet.id.length - 6)}
                    </span>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-medium">
                      <Calendar size={10} />
                      {new Date(bet.timestamp).toLocaleString('tr-TR')}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Clock size={10} className="animate-spin-slow" /> Devam Ediyor
                  </span>
                </div>

                {/* Bet Match List */}
                <div className="space-y-2">
                  {bet.selections.map((sel, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-bold items-center">
                      <span className="text-zinc-300 max-w-[70%] truncate">{sel.mac_adi}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 font-medium">{sel.bahis}</span>
                        <span className="text-amber-500 font-mono">{sel.oran.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bet Summary Footer */}
                <div className="bg-slate-950/40 rounded-lg p-3 border border-zinc-800/30 flex justify-between items-center text-xs font-bold">
                  <div className="space-y-1">
                    <span className="text-zinc-500 block">Yatırılan Tutar:</span>
                    <span className="text-white font-mono">{bet.amount.toFixed(2)} ₺</span>
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="text-zinc-500 block">Toplam Oran:</span>
                    <span className="text-amber-500 font-mono">{bet.totalOdds.toFixed(2)}</span>
                  </div>
                  <div className="space-y-1 text-right">
                    <span className="text-zinc-500 block">Olası Kazanç:</span>
                    <span className="text-emerald-400 font-mono">{bet.potentialPayout.toFixed(2)} ₺</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBetsModal;
