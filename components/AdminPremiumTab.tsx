import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, XCircle, RefreshCw, Diamond, CreditCard, AlertCircle, Shield, TrendingUp, Clock, Zap, Save, Calendar } from 'lucide-react';
import { fetchPremiumAnalyses, createPremiumAnalysis, updateAnalysisStatus, deletePremiumAnalysis, fetchPayments, confirmPayment, rejectPayment } from '../utils/premiumService';
import type { PremiumAnalysis, PremiumPayment } from '../types';

const STATUS_COLORS: Record<string, string> = {
  pending: '#FFC107',
  won: '#00E676',
  lost: '#FF5252',
  void: '#9E9E9E',
  confirmed: '#00E676',
  rejected: '#FF5252',
  refunded: '#2196F3',
};

interface AdminPremiumTabProps {
  initialTab?: 'analyses' | 'payments';
}

const AdminPremiumTab: React.FC<AdminPremiumTabProps> = ({ initialTab = 'analyses' }) => {
  const [tab, setTab] = useState<'analyses' | 'payments'>(initialTab);
  const [analyses, setAnalyses] = useState<PremiumAnalysis[]>([]);
  const [payments, setPayments] = useState<PremiumPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [form, setForm] = useState({
    matchName: '',
    league: '',
    matchDate: '',
    prediction: '',
    odd: 1.50,
    confidence: 85,
    analysisText: '',
    isGuaranteed: false,
    price: 100,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [a, p] = await Promise.all([fetchPremiumAnalyses(), fetchPayments()]);
    setAnalyses(a);
    setPayments(p);
    setLoading(false);
  };

  const handleCreateAnalysis = async () => {
    if (!form.matchName || !form.prediction) {
      alert('Lütfen zorunlu alanları (Maç Adı, Tahmin) doldurun!');
      return;
    }

    if (isNaN(form.odd) || isNaN(form.price) || isNaN(form.confidence)) {
      alert('Lütfen oran, fiyat ve güven skoru için geçerli sayılar girin!');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createPremiumAnalysis({
        ...form,
        odd: Number(form.odd) || 0,
        confidence: Number(form.confidence) || 0,
        price: Number(form.price) || 0,
        status: 'pending',
      });

      if (result) {
        setAnalyses([result, ...analyses]);
        setForm({ matchName: '', league: '', matchDate: '', prediction: '', odd: 1.50, confidence: 85, analysisText: '', isGuaranteed: false, price: 100 });
        setShowForm(false);
        alert('Analiz başarıyla yayınlandı!');
      } else {
        alert('Analiz kaydedilirken bir hata oluştu. Lütfen bağlantınızı ve veritabanı ayarlarınızı kontrol edin.');
      }
    } catch (err) {
      console.error('Create error:', err);
      alert('Bir hata oluştu: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: PremiumAnalysis['status']) => {
    const msg = status === 'lost'
      ? 'Bu analizi KAYBETTİ olarak işaretlemek istediğinize emin misiniz? Garantili ise iade tetiklenecek!'
      : `Analiz durumunu "${status.toUpperCase()}" olarak değiştirmek istiyor musunuz?`;
    if (!window.confirm(msg)) return;
    
    const success = await updateAnalysisStatus(id, status);
    if (success) {
      setAnalyses(analyses.map(a => a.id === id ? { ...a, status } : a));
      if (status === 'lost') await loadData(); // Refresh to see refunds
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu analizi silmek istediğinize emin misiniz?')) return;
    const success = await deletePremiumAnalysis(id);
    if (success) setAnalyses(analyses.filter(a => a.id !== id));
  };

  const handleConfirmPayment = async (id: string) => {
    const success = await confirmPayment(id);
    if (success) setPayments(payments.map(p => p.id === id ? { ...p, status: 'confirmed' } : p));
  };

  const handleRejectPayment = async (id: string) => {
    const success = await rejectPayment(id);
    if (success) setPayments(payments.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  const inputStyle: React.CSSProperties = {
    background: '#0D1117',
    border: '1px solid rgba(255,193,7,0.15)',
    borderRadius: '8px',
    padding: '14px 18px',
    color: '#E6EDF3',
    fontWeight: 600,
    width: '100%',
    outline: 'none',
  };

  const cardStyle: React.CSSProperties = {
    background: '#161B22',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '24px',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,193,7,0.1)', border: '1px solid rgba(255,193,7,0.2)' }}>
            <Diamond className="w-7 h-7" style={{ color: '#FFC107' }} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">PREMİUM YÖNETİMİ</h2>
            <p className="text-[11px] font-bold" style={{ color: '#757575' }}>Analizler, ödemeler ve iade yönetimi</p>
          </div>
        </div>
        <button onClick={loadData} className="p-3 rounded-lg hover:bg-white/5 transition-all">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} style={{ color: '#757575' }} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button onClick={() => setTab('analyses')}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-[12px] font-black uppercase tracking-wider transition-all"
          style={{
            background: tab === 'analyses' ? 'linear-gradient(135deg, #FFC107, #FF8F00)' : '#1E1E1E',
            color: tab === 'analyses' ? '#000' : '#757575',
          }}
        >
          <TrendingUp className="w-4 h-4" /> ANALİZLER ({analyses.length})
        </button>
        <button onClick={() => setTab('payments')}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-[12px] font-black uppercase tracking-wider transition-all"
          style={{
            background: tab === 'payments' ? 'linear-gradient(135deg, #FFC107, #FF8F00)' : '#1E1E1E',
            color: tab === 'payments' ? '#000' : '#757575',
          }}
        >
          <CreditCard className="w-4 h-4" /> ÖDEMELER ({payments.filter(p => p.status === 'pending').length} bekleyen)
        </button>
      </div>

      {/* ANALYSES TAB */}
      {tab === 'analyses' && (
        <div className="space-y-6">
          {/* Add Button */}
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-black text-[12px] uppercase tracking-wider transition-all hover:shadow-[0_8px_30px_rgba(255,193,7,0.2)]"
            style={{ background: 'linear-gradient(135deg, #FFC107, #FF8F00)', color: '#000' }}
          >
            <Plus className="w-4 h-4" /> {showForm ? 'FORMU KAPAT' : 'YENİ ANALİZ EKLE'}
          </button>

          {/* Add Form */}
          {showForm && (
            <div style={cardStyle} className="space-y-5">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: '#FFC107' }} /> Yeni Premium Analiz
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>MAÇ ADI *</label>
                  <input value={form.matchName} onChange={e => setForm({...form, matchName: e.target.value})} placeholder="Galatasaray vs Fenerbahçe" style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>LİG</label>
                  <input value={form.league} onChange={e => setForm({...form, league: e.target.value})} placeholder="Süper Lig" style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>MAÇ TARİHİ</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#FFC107' }} />
                    <input 
                      type="datetime-local" 
                      value={form.matchDate} 
                      onChange={e => setForm({...form, matchDate: e.target.value})} 
                      style={{...inputStyle, paddingLeft: '45px'}} 
                      className="cursor-pointer"
                      onClick={(e) => (e.target as any).showPicker?.()}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>TAHMİN *</label>
                  <input value={form.prediction} onChange={e => setForm({...form, prediction: e.target.value})} placeholder="MS 1 / KG VAR / 2.5 ÜST" style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>ORAN</label>
                  <input type="number" step="0.01" value={form.odd || ''} onChange={e => setForm({...form, odd: parseFloat(e.target.value)})} style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>GÜVEN SKORU (%)</label>
                  <input type="number" min={0} max={100} value={form.confidence || ''} onChange={e => setForm({...form, confidence: parseInt(e.target.value)})} style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>FİYAT (TL)</label>
                  <input type="number" value={form.price || ''} onChange={e => setForm({...form, price: parseFloat(e.target.value)})} style={{...inputStyle, color: '#FFC107'}} />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg transition-all"
                    style={{ background: form.isGuaranteed ? 'rgba(255,193,7,0.1)' : '#0D1117', border: `1px solid ${form.isGuaranteed ? 'rgba(255,193,7,0.3)' : 'rgba(255,255,255,0.05)'}` }}
                  >
                    <input type="checkbox" checked={form.isGuaranteed} onChange={e => setForm({...form, isGuaranteed: e.target.checked})} className="hidden" />
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: form.isGuaranteed ? '#FFC107' : 'rgba(255,255,255,0.05)', border: `2px solid ${form.isGuaranteed ? '#FFC107' : 'rgba(255,255,255,0.1)'}` }}
                    >
                      {form.isGuaranteed && <CheckCircle2 className="w-4 h-4 text-black" />}
                    </div>
                    <div>
                      <span className="text-sm font-black text-white">İade Garantili</span>
                      <p className="text-[10px] font-bold" style={{ color: '#757575' }}>Kaybederse otomatik iade</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>ANALİZ METNİ</label>
                <textarea value={form.analysisText} onChange={e => setForm({...form, analysisText: e.target.value})}
                  rows={4} placeholder="Detaylı maç analizi, taktiksel bilgiler..."
                  style={{...inputStyle, resize: 'vertical'}}
                />
              </div>
              <button 
                onClick={handleCreateAnalysis}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3.5 rounded-lg font-black text-[12px] uppercase tracking-wider transition-all hover:shadow-[0_8px_30px_rgba(255,193,7,0.3)] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #FFC107, #FF8F00)', color: '#000' }}
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSubmitting ? 'KAYDEDİLİYOR...' : 'ANALİZİ YAYINLA'}
              </button>
            </div>
          )}

          {/* Analyses List */}
          <div className="space-y-3">
            {analyses.map(analysis => (
              <div key={analysis.id} style={cardStyle} className="flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[rgba(255,193,7,0.2)] transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {analysis.isGuaranteed && (
                      <Shield className="w-4 h-4 shrink-0" style={{ color: '#FFC107' }} />
                    )}
                    <h4 className="text-white font-black truncate">{analysis.matchName}</h4>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-[10px] font-bold" style={{ color: '#757575' }}>{analysis.league}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-lg" style={{ background: 'rgba(255,193,7,0.1)', color: '#FFC107' }}>
                      {analysis.prediction}
                    </span>
                    <span className="text-[10px] font-black" style={{ color: '#00E676' }}>@{analysis.odd.toFixed(2)}</span>
                    <span className="text-[10px] font-black" style={{ color: '#FFC107' }}>{analysis.price.toFixed(0)} TL</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Status Badge */}
                  <span className="text-[9px] font-black uppercase px-3 py-1.5 rounded-lg"
                    style={{ background: `${STATUS_COLORS[analysis.status]}15`, color: STATUS_COLORS[analysis.status] }}
                  >
                    {analysis.status === 'pending' ? 'AKTİF' : analysis.status === 'won' ? 'KAZANDI' : analysis.status === 'lost' ? 'KAYBETTİ' : 'İPTAL'}
                  </span>

                  {/* Action Buttons */}
                  {analysis.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusChange(analysis.id, 'won')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-green-500/20"
                        title="Kazandı"
                      >
                        <CheckCircle2 className="w-4 h-4" style={{ color: '#00E676' }} />
                      </button>
                      <button onClick={() => handleStatusChange(analysis.id, 'lost')}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20"
                        title="Kaybetti"
                      >
                        <XCircle className="w-4 h-4" style={{ color: '#FF5252' }} />
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(analysis.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: '#FF5252' }} />
                  </button>
                </div>
              </div>
            ))}
            {analyses.length === 0 && !loading && (
              <div className="py-12 text-center rounded-lg" style={{ background: '#1E1E1E', border: '1px dashed rgba(255,255,255,0.1)' }}>
                <AlertCircle className="w-8 h-8 mx-auto mb-3" style={{ color: '#757575' }} />
                <p className="text-sm font-bold" style={{ color: '#757575' }}>Henüz premium analiz eklenmemiş.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAYMENTS TAB */}
      {tab === 'payments' && (
        <div className="space-y-4">
          {payments.length > 0 ? payments.map(payment => (
            <div key={payment.id} style={cardStyle} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-black">{payment.username}</span>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg"
                    style={{ background: `${STATUS_COLORS[payment.status]}15`, color: STATUS_COLORS[payment.status] }}
                  >
                    {payment.status === 'pending' ? 'BEKLEYEN' : payment.status === 'confirmed' ? 'ONAYLANDI' : payment.status === 'rejected' ? 'REDDEDİLDİ' : 'İADE EDİLDİ'}
                  </span>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-[10px] font-bold" style={{ color: '#757575' }}>{payment.method === 'usdt' ? 'Kripto (USDT)' : 'Banka Havalesi'}</span>
                  <span className="text-[10px] font-black" style={{ color: '#FFC107' }}>{payment.amount.toFixed(0)} TL</span>
                  {payment.txReference && <span className="text-[10px] font-bold truncate max-w-[200px]" style={{ color: '#757575' }}>Ref: {payment.txReference}</span>}
                  <span className="text-[10px] font-bold" style={{ color: '#757575' }}>
                    {new Date(payment.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>

              {payment.status === 'pending' && (
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleConfirmPayment(payment.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all"
                    style={{ background: 'rgba(0,230,118,0.1)', color: '#00E676', border: '1px solid rgba(0,230,118,0.2)' }}
                  >
                    <CheckCircle2 className="w-4 h-4" /> ONAYLA
                  </button>
                  <button onClick={() => handleRejectPayment(payment.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all"
                    style={{ background: 'rgba(255,82,82,0.1)', color: '#FF5252', border: '1px solid rgba(255,82,82,0.2)' }}
                  >
                    <XCircle className="w-4 h-4" /> REDDET
                  </button>
                </div>
              )}
            </div>
          )) : (
            <div className="py-12 text-center rounded-lg" style={{ background: '#1E1E1E', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <CreditCard className="w-8 h-8 mx-auto mb-3" style={{ color: '#757575' }} />
              <p className="text-sm font-bold" style={{ color: '#757575' }}>Henüz ödeme kaydı yok.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPremiumTab;
