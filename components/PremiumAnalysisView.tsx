import React, { useState, useEffect } from 'react';
import { Diamond, Filter, TrendingUp, Shield, Sparkles } from 'lucide-react';
import PremiumAnalysisCard from './PremiumAnalysisCard';
import PremiumCheckout from './PremiumCheckout';
import { fetchPremiumAnalyses } from '../utils/premiumService';
import type { PremiumAnalysis } from '../types';

interface Props {
  userId?: string;
  username?: string;
  userRole?: string | null;
}

type FilterType = 'all' | 'guaranteed' | 'active';

const PremiumAnalysisView: React.FC<Props> = ({ userId, username, userRole }) => {
  const [analyses, setAnalyses] = useState<PremiumAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [checkoutAnalysis, setCheckoutAnalysis] = useState<PremiumAnalysis | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);

  useEffect(() => {
    loadAnalyses();
    // Load purchased IDs from localStorage
    const stored = localStorage.getItem('premium_purchased_ids');
    if (stored) setPurchasedIds(JSON.parse(stored));
  }, []);

  const loadAnalyses = async () => {
    setLoading(true);
    const data = await fetchPremiumAnalyses();
    setAnalyses(data);
    setLoading(false);
  };

  const filteredAnalyses = analyses.filter(a => {
    if (filter === 'guaranteed') return a.isGuaranteed;
    if (filter === 'active') return a.status === 'pending';
    return true;
  });

  const handleBuy = (analysis: PremiumAnalysis) => {
    if (userRole === 'admin' || userRole === 'editor') {
      const updated = [...purchasedIds, analysis.id];
      setPurchasedIds(updated);
      localStorage.setItem('premium_purchased_ids', JSON.stringify(updated));
      return;
    }

    if (!userId) {
      alert('Satın almak için giriş yapmalısınız.');
      return;
    }
    setCheckoutAnalysis(analysis);
  };

  const handlePurchaseSuccess = () => {
    if (checkoutAnalysis) {
      const updated = [...purchasedIds, checkoutAnalysis.id];
      setPurchasedIds(updated);
      localStorage.setItem('premium_purchased_ids', JSON.stringify(updated));
    }
    setCheckoutAnalysis(null);
  };

  const FILTERS: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'TÜMÜ', icon: <Filter className="w-3.5 h-3.5" /> },
    { key: 'guaranteed', label: 'GARANTİLİ', icon: <Shield className="w-3.5 h-3.5" /> },
    { key: 'active', label: 'AKTİF', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#000000' }}>
      {/* Hero Banner */}
      <div className="relative overflow-hidden py-10 px-6">
        {/* Ambient Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,193,7,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,230,118,0.05) 0%, transparent 70%)' }} />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Premium <span style={{ color: '#FFC107' }}>Analizler</span>
          </h1>
          
          <p className="text-base font-bold max-w-xl mx-auto" style={{ color: '#757575' }}>
            Profesyonel analistlerimizin detaylı maç analizleri. İade garantili seçeneklerle risksiz yatırım.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: '#00E676' }}>%87</p>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>İSABET ORANI</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <p className="text-2xl font-black" style={{ color: '#FFC107' }}>{analyses.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>TOPLAM ANALİZ</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <p className="text-2xl font-black text-white">{analyses.filter(a => a.isGuaranteed).length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>GARANTİLİ</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)' }}
              >
                <Diamond className="w-3 h-3" style={{ color: '#FFC107' }} />
                <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#FFC107' }}>Uzman Kadro</span>
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest mt-1.5" style={{ color: '#757575' }}>Yüksek İsabet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-3 p-2 rounded-2xl" style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.05)' }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300"
              style={{
                background: filter === f.key ? 'linear-gradient(135deg, #FFC107, #FF8F00)' : 'transparent',
                color: filter === f.key ? '#000' : '#757575',
                boxShadow: filter === f.key ? '0 4px 15px rgba(255,193,7,0.2)' : 'none',
              }}
            >
              {f.icon} {f.label}
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-[11px] font-bold px-3" style={{ color: '#757575' }}>
            {filteredAnalyses.length} analiz
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-3xl animate-pulse" style={{ background: '#1E1E1E' }} />
            ))}
          </div>
        ) : filteredAnalyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map(analysis => (
              <PremiumAnalysisCard
                key={analysis.id}
                analysis={analysis}
                onBuy={handleBuy}
                isPurchased={purchasedIds.includes(analysis.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-3xl" style={{ background: '#1E1E1E', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: '#FFC107', opacity: 0.5 }} />
            <p className="text-lg font-black text-white mb-2">Henüz analiz yayınlanmadı</p>
            <p className="text-sm font-bold" style={{ color: '#757575' }}>Yeni premium analizler yakında burada olacak.</p>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {checkoutAnalysis && userId && (
        <PremiumCheckout
          analysis={checkoutAnalysis}
          userId={userId}
          username={username || 'Kullanıcı'}
          onClose={() => setCheckoutAnalysis(null)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default PremiumAnalysisView;
