import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  FileText, 
  Copy,
  Receipt
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
  status: 'PENDING' | 'WON' | 'LOST';
}

export const MyBetsView: React.FC = () => {
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'WON' | 'LOST'>('ALL');
  
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

  const filteredBets = bets.filter(bet => {
    if (activeTab === 'ALL') return true;
    return bet.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WON': return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
      case 'LOST': return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20';
      default: return 'text-[#EAB308] bg-[#EAB308]/10 border-[#EAB308]/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WON': return <CheckCircle2 className="w-4 h-4" />;
      case 'LOST': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'WON': return 'Kazandı';
      case 'LOST': return 'Kaybetti';
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
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Receipt className="w-7 h-7 text-[#00E5FF]" />
            Bahis Geçmişim
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Oynadığınız tüm kuponları ve sonuçlarını buradan takip edebilirsiniz.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#111620] p-1 rounded-xl border border-white/5 shadow-inner self-start">
          {[
            { id: 'ALL', label: 'Tümü' },
            { id: 'PENDING', label: 'Açık Bahisler' },
            { id: 'WON', label: 'Kazananlar' },
            { id: 'LOST', label: 'Kaybedenler' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bets List */}
      <div className="flex flex-col gap-5">
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
            <div key={bet.id} className="bg-[#111620]/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl overflow-hidden group">
              
              {/* Card Header */}
              <div className="px-5 py-4 border-b border-white/5 bg-black/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wider ${getStatusColor(bet.status)}`}>
                    {getStatusIcon(bet.status)}
                    {getStatusText(bet.status)}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                    <span className="bg-white/5 px-2 py-1 rounded">
                      {bet.selections.length > 1 ? 'KOMBİNE' : 'TEKLİ BAHİS'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(bet.timestamp)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-xs font-mono">ID: {bet.id}</span>
                  <button 
                    onClick={() => copyToClipboard(bet.id)}
                    className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded transition-colors"
                    title="Kupon ID'sini Kopyala"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Body - Selections */}
              <div className="p-5 flex flex-col gap-4">
                {bet.selections.map((sel, idx) => {
                  const matchTitle = sel.matchName || sel.match || 'Bilinmeyen Maç';
                  const selName = sel.selectionName || sel.selection || 'Bilinmeyen Seçim';
                  const marketName = sel.market || (selName.includes(':') ? selName.split(':')[0].trim() : 'Bahis Seçimi');
                  const finalSelection = selName.includes(':') ? selName.split(':')[1].trim() : selName;
                  const finalOdd = sel.odd || sel.odds || 1.0;

                  return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center shrink-0 border border-white/10">
                        <PlayerLogo name={matchTitle.split('-')[0]?.trim() || matchTitle} fallbackLogo={<span className="text-xs">🎯</span>} />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-[14px]">{matchTitle}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-zinc-400 text-[11px] uppercase tracking-wider">{marketName}</span>
                          <span className="text-zinc-600 text-[10px]">•</span>
                          <span className="text-white text-[12px] font-bold text-[#00E5FF]">{finalSelection}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:ml-auto">
                      <div className="text-right">
                        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-0.5">Oran</div>
                        <div className="text-white font-black">{finalOdd.toFixed(2)}</div>
                      </div>
                      
                      {/* Selection Status indicator (if available) */}
                      <div className="w-8 flex justify-end">
                        {sel.status === 'WON' && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                        {sel.status === 'LOST' && <XCircle className="w-5 h-5 text-[#EF4444]" />}
                        {(!sel.status || sel.status === 'PENDING') && <Clock className="w-4 h-4 text-zinc-600" />}
                      </div>
                    </div>
                  </div>
                )})}
              </div>

              {/* Card Footer - Financials */}
              <div className="px-5 py-4 bg-gradient-to-r from-[#00E5FF]/5 to-transparent border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-zinc-500 text-[11px] uppercase font-bold tracking-wider mb-1">Bahis Tutarı</div>
                    <div className="text-white font-bold text-lg">${bet.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 text-[11px] uppercase font-bold tracking-wider mb-1">Toplam Oran</div>
                    <div className="text-white font-bold text-lg">{bet.totalOdds.toFixed(2)}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-zinc-500 text-[11px] uppercase font-bold tracking-wider mb-1">
                    {bet.status === 'WON' ? 'Kazanılan Tutar' : 'Olası Kazanç'}
                  </div>
                  <div className={`font-black text-2xl ${bet.status === 'WON' ? 'text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.3)]'}`}>
                    ${bet.potentialPayout.toFixed(2)}
                  </div>
                </div>

              </div>
              
            </div>
          ))
        )}
      </div>

    </div>
  );
};
