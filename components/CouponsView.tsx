import React, { useState } from 'react';
import { 
  Trophy, Shield, Copy, Image as ImageIcon, Share2, 
  ArrowRightLeft, ChevronRight, ChevronLeft, Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Coupon, SiteUser, SiteStatusConfig } from '../types';

interface CouponsViewProps {
  coupons?: Coupon[];
  siteUser: SiteUser | null;
  userRole: string | null;
  setAuthModalMode: (mode: 'member' | 'admin' | null) => void;
  onNavigate: (view: string) => void;
  statusConfig: SiteStatusConfig;
}

const CouponsView: React.FC<CouponsViewProps> = ({ 
  siteUser, userRole, setAuthModalMode 
}) => {
  const { t } = useTranslation();
  const [activeMainTab, setActiveMainTab] = useState<'aktif' | 'gecmis'>('aktif');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [cashedOutBets, setCashedOutBets] = useState<string[]>([]);

  const subTabs = [
    { id: 'all', label: t('coupons.subtab_all', 'Tümü') },
    { id: 'prematch', label: t('coupons.subtab_prematch', 'Ön Maç') },
    { id: 'live', label: t('coupons.subtab_live', 'Canlı') },
    { id: 'single', label: t('coupons.subtab_single', 'Tekliler') },
    { id: 'combo', label: t('coupons.subtab_combo', 'Kombineler') }
  ];

  // Temporary mock data to exactly match the screenshot requested by the user
  const mockBets = [
    {
      id: '1',
      type: t('coupons.single', 'Tekli'),
      date: '09.07.2026 16:06',
      sport: 'FIFA Dünya Kupası',
      match: 'Fransa vs. Fas',
      market: '1x2',
      selection: 'Fransa',
      odds: '1.60',
      stake: '$17,90',
      estimatedPayout: '$28,64',
      cashoutValue: '$15,03'
    }
  ];

  return (
    <div className="w-full min-h-screen font-sans overflow-x-hidden pb-20 relative bg-[#090D14]">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-2xl font-black tracking-tight">{t('coupons.title', 'Bahislerim')}</h1>
            <span className="bg-[color:var(--theme-accent)]/10 border border-[color:var(--theme-accent)]/20 text-[color:var(--theme-accent)] text-xs font-bold px-2 py-0.5 rounded">
              {mockBets.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#121824] p-1 rounded-lg border border-white/5 self-start sm:self-auto">
            <button 
              onClick={() => setActiveMainTab('aktif')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                activeMainTab === 'aktif' 
                  ? 'bg-transparent border border-[color:var(--theme-accent)] text-[color:var(--theme-accent)] shadow-[0_0_15px_rgba(0,255,163,0.1)]' 
                  : 'text-zinc-500 border border-transparent hover:text-white'
              }`}
            >
              {t('coupons.active_bets', 'Aktif Bahisler')}
            </button>
            <button 
              onClick={() => setActiveMainTab('gecmis')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                activeMainTab === 'gecmis' 
                  ? 'bg-transparent border border-[color:var(--theme-accent)] text-[color:var(--theme-accent)] shadow-[0_0_15px_rgba(0,255,163,0.1)]' 
                  : 'text-zinc-500 border border-transparent hover:text-white'
              }`}
            >
              {t('coupons.bet_history', 'Bahis Geçmişi')}
            </button>
          </div>
        </div>

        {/* Sub-tabs Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 mb-6 gap-4">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-0">
            {subTabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`pb-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeSubTab === tab.id 
                    ? 'border-[color:var(--theme-accent)] text-[color:var(--theme-accent)]' 
                    : 'border-transparent text-zinc-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 text-zinc-500 text-sm pb-3 self-end sm:self-auto">
            <span className="font-medium">1-1</span>
            <div className="flex gap-1">
              <button className="hover:text-white transition-colors p-1"><ChevronLeft className="w-4 h-4" /></button>
              <button className="hover:text-white transition-colors p-1"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Bets List */}
        <div className="flex flex-col gap-4">
          {mockBets.map((bet, idx) => (
            <div key={idx} className="bg-[#121824] border border-white/5 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:border-white/10 duration-300">
              
              {/* Card Header */}
              <div className="bg-[#1A2130]/80 px-4 py-3 flex items-center gap-3 border-b border-white/5">
                <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#0f172a] border border-white/5 text-zinc-400 text-xs font-black">
                  {idx + 1}
                </span>
                <span className="text-[#00E5FF] text-sm font-bold tracking-wide uppercase">{bet.type}</span>
                <span className="text-zinc-500 text-sm font-medium">{bet.date}</span>
              </div>
              
              {/* Card Body */}
              <div className="p-5">
                
                {/* Match Info */}
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" /> 
                  <span>{bet.sport}</span>
                </div>
                
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-white font-black text-base mb-1.5">{bet.match}</h3>
                    <p className="text-zinc-500 text-xs font-semibold mb-3 uppercase">{bet.market}</p>
                    <p className="text-white font-bold text-sm">{bet.selection}</p>
                  </div>
                  <div className="text-white font-black text-base tracking-tight bg-white/5 px-3 py-1 rounded-md border border-white/10">
                    {bet.odds}
                  </div>
                </div>
                
                {/* Mid Bar (Logo & Actions) */}
                <div className="flex items-center justify-between border-t border-b border-white/5 py-3 mb-5">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[color:var(--theme-accent)]" />
                    <span className="text-white font-black tracking-wide text-sm">724BAHİS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title={t('coupons.copy', 'Kopyala')}>
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title={t('coupons.share_img', 'Görsel Olarak Paylaş')}>
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        const chatInput = document.querySelector('input[placeholder="Bir mesaj yazın..."]') as HTMLInputElement;
                        if (chatInput) {
                          // Simulate typing a bet share command into the chat
                          chatInput.value = `Spor: #${bet.id} Özel Oran: ${bet.odds} - Olası Kazanç: ${bet.estimatedPayout}`;
                          chatInput.dispatchEvent(new Event('input', { bubbles: true }));
                          // Highlight chat area to draw attention
                          const chatWrapper = document.getElementById('modern-chat-wrapper');
                          if (chatWrapper) {
                             chatWrapper.classList.add('ring-2', 'ring-[#06b6d4]', 'ring-offset-2', 'ring-offset-[#090D14]');
                             setTimeout(() => chatWrapper.classList.remove('ring-2', 'ring-[#06b6d4]', 'ring-offset-2', 'ring-offset-[#090D14]'), 2000);
                          }
                        }
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded bg-white/5 text-zinc-400 hover:text-[color:var(--theme-accent)] hover:bg-white/10 transition-colors" 
                      title={t('coupons.share', 'Paylaş')}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Financials */}
                <div className="flex flex-col gap-2.5 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium">{t('coupons.return_lbl', 'Geri dönmek')}</span>
                    <span className="text-white font-bold">{bet.odds}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium">{t('coupons.stake', 'Bahis')}</span>
                    <span className="text-white font-bold">{bet.stake}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium">{t('coupons.estimated_payout', 'Tahmini Ödeme')}</span>
                    <span className="text-[color:var(--theme-accent)] font-black">{bet.estimatedPayout}</span>
                  </div>
                </div>
                
                {/* Action Button */}
                {cashedOutBets.includes(bet.id) ? (
                  <button disabled className="w-full py-3.5 bg-[#00E5FF]/20 border border-[#00E676]/30 text-[#00E5FF] font-black uppercase tracking-wide text-sm rounded-lg flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,230,118,0.1)]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>BAHİS BOZDURULDU</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if (window.confirm(`${bet.cashoutValue} tutarında bahis bozdurma işlemini onaylıyor musunuz?`)) {
                        setCashedOutBets([...cashedOutBets, bet.id]);
                      }
                    }}
                    className="w-full py-3.5 bg-[color:var(--theme-accent)] hover:bg-[#33FFB5] text-black font-black uppercase tracking-wide text-sm rounded-lg transition-all flex items-center justify-between px-6 shadow-[0_0_20px_rgba(0,255,163,0.15)] hover:shadow-[0_0_30px_rgba(0,255,163,0.3)]"
                  >
                    <span>{t('coupons.early_cashout', 'Erken ödeme')} {bet.cashoutValue}</span>
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CouponsView;
