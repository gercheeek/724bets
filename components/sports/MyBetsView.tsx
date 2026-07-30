import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  FileText, 
  Copy,
  Receipt,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { PlayerLogo } from './PlayerLogo';

interface BetSelection {
  id: string;
  matchName?: string;
  match?: string; // For backward compatibility if any
  selectionName?: string;
  selection?: string;
  market?: string;
  odd?: number;
  odds?: number;
  status?: 'PENDING' | 'WON' | 'LOST';
}

interface BetRecord {
  id: string;
  timestamp: number;
  amount: number;
  selections: BetSelection[];
  totalOdds: number;
  potentialPayout: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'CASHED_OUT';
}

export const MyBetsView: React.FC = () => {
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'WON' | 'LOST' | 'CASHED_OUT'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Cashout States
  const [cashoutConfirmId, setCashoutConfirmId] = useState<string | null>(null);
  const [isCashingOut, setIsCashingOut] = useState(false);

  const toggleExpand = (id: string) => setExpandedId(prev => prev === id ? null : id);
  
  useEffect(() => {
    // Load bets from local storage
    const savedBets = localStorage.getItem('site_my_bets');
    if (savedBets) {
      try {
        const parsed = JSON.parse(savedBets);
        setBets(parsed);
      } catch (e) {
        console.error("Error parsing bets", e);
      }
    }
  }, []);

  const handleCashout = async (betId: string, amount: number) => {
    setIsCashingOut(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      // 1. Get current member to update balance
      const memberStr = localStorage.getItem('site_member');
      if (memberStr) {
        const member = JSON.parse(memberStr);
        member.balance = (member.balance || 0) + amount;
        localStorage.setItem('site_member', JSON.stringify(member));
        // Dispatch storage event so topnav updates instantly
        window.dispatchEvent(new Event('storage'));
      }

      // 2. Update bet status in localStorage
      const updatedBets = bets.map(bet => {
        if (bet.id === betId) {
          return {
            ...bet,
            status: 'CASHED_OUT' as const,
            potentialPayout: amount // set payout to cashed out amount
          };
        }
        return bet;
      });
      
      setBets(updatedBets);
      localStorage.setItem('site_my_bets', JSON.stringify(updatedBets));

    } catch (e) {
      console.error("Cashout failed", e);
    } finally {
      setIsCashingOut(false);
      setCashoutConfirmId(null);
    }
  };

  const filteredBets = bets.filter(bet => {
    if (activeTab === 'ALL') return true;
    return bet.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON': return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
      case 'LOST': return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
      case 'CASHED_OUT': return 'text-[#00E5FF] bg-[#00E5FF]/10 border-[#00E5FF]/20';
      default: return 'text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WON': return <CheckCircle2 className="w-4 h-4" />;
      case 'LOST': return <XCircle className="w-4 h-4" />;
      case 'CASHED_OUT': return <FileText className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'WON': return 'Kazandı';
      case 'LOST': return 'Kaybetti';
      case 'CASHED_OUT': return 'Bozduruldu';
      default: return 'Açık Bahis';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-6 pb-32">
          {/* Header & Title */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 relative z-10">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-transparent flex items-center justify-center border border-[#00E5FF]/30 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <Receipt className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">
              Bahis Geçmişim
            </h1>
          </div>
          <p className="text-zinc-400 text-sm">Oynadığınız tüm kuponları ve sonuçlarını detaylı olarak buradan takip edebilirsiniz.</p>
        </div>
        
        {/* Modern Tabs */}
        <div className="flex bg-[#0A0D14] p-1.5 rounded-2xl border border-white/5 shadow-inner self-start overflow-x-auto custom-scrollbar max-w-full">
          {[
            { id: 'ALL', label: 'Tümü' },
            { id: 'PENDING', label: 'Açık Bahisler' },
            { id: 'WON', label: 'Kazananlar' },
            { id: 'LOST', label: 'Kaybedenler' },
            { id: 'CASHED_OUT', label: 'Bozdurulanlar' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-[#00E5FF]/20 to-[#00B4D8]/10 text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.1)] border border-[#00E5FF]/20' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bets List */}
      <div className="flex flex-col gap-4">
        {filteredBets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#111620]/60 backdrop-blur-sm rounded-2xl border border-white/5">
            <FileText className="w-16 h-16 text-zinc-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Gösterilecek Kupon Yok</h3>
            <p className="text-zinc-400 text-sm text-center max-w-sm">
              Bu kategoride herhangi bir bahis bulunamadı. Hemen bültene gidip bahis yapabilirsiniz.
            </p>
          </div>
        ) : (
          filteredBets.map(bet => (
            <div key={bet.id} className={`bg-gradient-to-r from-[#111620] to-[#0A0D14] rounded-xl border transition-all duration-300 overflow-hidden group shadow-lg ${expandedId === bet.id ? 'border-[#00E5FF]/50 shadow-[0_0_20px_rgba(0,229,255,0.15)]' : 'border-white/10 hover:border-white/25 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]'}`}>
              
              {/* Card Header - Accordion Toggle */}
              <div 
                onClick={() => toggleExpand(bet.id)} 
                className="cursor-pointer p-4 flex flex-col relative transition-colors hover:bg-white/[0.02]"
              >
                {/* Top Row: Status & Type */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* Minimal Status Badge */}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${bet.status === 'WON' ? 'bg-[#10B981] shadow-[0_0_8px_#10B981]' : bet.status === 'LOST' ? 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]' : bet.status === 'CASHED_OUT' ? 'bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]' : 'bg-[#EAB308] shadow-[0_0_8px_#EAB308]'}`}></div>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${bet.status === 'WON' ? 'text-[#10B981]' : bet.status === 'LOST' ? 'text-[#EF4444]' : bet.status === 'CASHED_OUT' ? 'text-[#00E5FF]' : 'text-[#EAB308]'}`}>
                        {getStatusText(bet.status)}
                      </span>
                    </div>
                    
                    <div className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:block"></div>
                    
                    <span className="text-zinc-400 text-[11px] font-semibold tracking-wide flex items-center gap-1">
                      {bet.selections.length > 1 ? (
                        <><Copy className="w-3 h-3" /> Kombine</>
                      ) : (
                        <><CheckCircle2 className="w-3 h-3" /> Tekli</>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-medium">
                      <Clock className="w-3 h-3"/> 
                      {formatDate(bet.timestamp)}
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 bg-white/5 ${expandedId === bet.id ? 'rotate-180 bg-white/10' : 'group-hover:bg-white/10'}`}>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                    </div>
                  </div>
                </div>
                
                {/* Metrics Clean Layout */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-6 md:gap-10">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-0.5">Yatırım Tutarı</span>
                      <span className="text-white font-black text-base">${bet.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-px h-6 bg-white/5 hidden sm:block"></div>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest mb-0.5">Toplam Oran</span>
                      <span className="text-white font-black text-base">{bet.totalOdds.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                      {bet.status === 'WON' ? 'Kazanılan Tutar' : bet.status === 'CASHED_OUT' ? 'Bozdurulan Tutar' : 'Olası Kazanç'}
                    </span>
                    <span className={`font-black text-xl md:text-2xl tracking-tight ${bet.status === 'WON' ? 'text-[#10B981]' : bet.status === 'LOST' ? 'text-zinc-500' : 'text-[#00E5FF]'}`}>
                      ${bet.potentialPayout.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content Details */}
              {expandedId === bet.id && (
                <div className="border-t border-white/5 bg-black/20 animate-in slide-in-from-top-2 fade-in duration-300">
                  
                  {/* Detailed Meta Bar */}
                  <div className="px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-gradient-to-r from-[#00E5FF]/[0.03] to-transparent">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Kupon Referans ID:</span>
                      <span className="text-zinc-300 text-xs font-mono bg-black/40 px-2 py-0.5 rounded border border-white/5">{bet.id}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(bet.id); }} 
                        className="p-1 text-zinc-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title="ID Kopyala"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Onaylanma Zamanı:</span>
                      <span className="text-zinc-300 text-xs">{formatDate(bet.timestamp)}</span>
                    </div>
                  </div>

                  {/* Card Body - Selections */}
                  <div className="p-6 flex flex-col gap-3">
                    {bet.selections.map((sel, idx) => {
                      const matchTitle = sel.matchName || sel.match || 'Bilinmeyen Maç';
                      const selName = sel.selectionName || sel.selection || 'Bilinmeyen Seçim';
                      const marketName = sel.market || (selName.includes(':') ? selName.split(':')[0].trim() : 'Bahis Seçimi');
                      const finalSelection = selName.includes(':') ? selName.split(':')[1].trim() : selName;
                      const finalOdd = sel.odd || sel.odds || 1.0;

                      return (
                      <div key={idx} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#111620] rounded-xl border border-white/[0.03] hover:border-white/10 transition-colors shadow-inner">
                        
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                            <PlayerLogo name={matchTitle.split('-')[0]?.trim() || matchTitle} fallbackLogo={<span className="text-sm">🎯</span>} />
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="text-white font-black text-[15px]">{matchTitle}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-zinc-400 text-[11px] uppercase tracking-wider">{marketName}</span>
                              <span className="text-zinc-600 text-[10px]">•</span>
                              <span className="text-[#00E5FF] text-[13px] font-bold">{finalSelection}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 sm:ml-auto bg-black/20 px-4 py-2 rounded-lg border border-white/5">
                          <div className="text-right">
                            <div className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider mb-0.5">Oran</div>
                            <div className="text-white font-black text-sm">{finalOdd.toFixed(2)}</div>
                          </div>
                          
                          {/* Selection Status indicator */}
                          <div className="w-8 flex justify-end pl-3 border-l border-white/5">
                            {sel.status === 'WON' && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                            {sel.status === 'LOST' && <XCircle className="w-5 h-5 text-[#EF4444]" />}
                            {(!sel.status || sel.status === 'PENDING') && <Clock className="w-5 h-5 text-zinc-500" />}
                          </div>
                        </div>
                      </div>
                    )})}
                  </div>

                  {/* Card Footer - Cashout & Financials */}
                  <div className="p-6 bg-gradient-to-t from-black/60 to-transparent border-t border-white/5 flex flex-wrap items-center justify-end gap-4">
                    {bet.status === 'PENDING' ? (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setCashoutConfirmId(bet.id); }}
                        className="px-8 py-3 bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] hover:from-[#00F0FF] hover:to-[#00C0E8] text-black font-black rounded-xl text-sm tracking-wide hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all flex items-center gap-3 group hover:-translate-y-0.5"
                      >
                        BAHSİ BOZDUR
                        <span className="bg-black/20 px-2.5 py-1 rounded-md text-xs border border-black/10">${(bet.amount * 0.95).toFixed(2)}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-zinc-400 text-xs font-bold uppercase tracking-wider shadow-inner">
                        <FileText className="w-4 h-4"/> {bet.status === 'CASHED_OUT' ? 'Bozduruldu' : 'Maçlar Sonuçlandı'}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cashout Confirmation Modal */}
              {cashoutConfirmId === bet.id && (
                <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !isCashingOut && setCashoutConfirmId(null)} />
                  <div className="relative bg-[#111620] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
                    <div className="w-12 h-12 bg-[#00E5FF]/10 rounded-full flex items-center justify-center mb-4 border border-[#00E5FF]/20">
                      <AlertTriangle className="w-6 h-6 text-[#00E5FF]" />
                    </div>
                    <h3 className="text-white font-black text-lg mb-2">Bahsi Bozdur</h3>
                    <p className="text-zinc-400 text-sm mb-6">
                      Bu kuponu anında <strong className="text-white">${(bet.amount * 0.95).toFixed(2)}</strong> karşılığında nakde çevirmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                    </p>
                    
                    <div className="flex w-full gap-3">
                      <button 
                        onClick={() => setCashoutConfirmId(null)}
                        disabled={isCashingOut}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        İptal
                      </button>
                      <button 
                        onClick={() => handleCashout(bet.id, bet.amount * 0.95)}
                        disabled={isCashingOut}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-[#00E5FF] text-black font-black text-sm hover:bg-[#00F0FF] transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 disabled:opacity-80"
                      >
                        {isCashingOut ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            İşleniyor
                          </>
                        ) : (
                          'Onayla'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
