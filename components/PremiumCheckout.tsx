import React, { useState } from 'react';
import { X, Copy, CheckCircle2, CreditCard, Bitcoin, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import type { PremiumAnalysis } from '../types';
import { createPayment } from '../utils/premiumService';

interface Props {
  analysis: PremiumAnalysis;
  userId: string;
  username: string;
  onClose: () => void;
  onSuccess: () => void;
}

const USDT_ADDRESS = 'TXxxxxxxxxxxxxxxxxxxxxxxxxxxx'; // Placeholder — Admin güncelleyecek
const BANK_IBAN = 'TR00 0000 0000 0000 0000 0000 00';
const BANK_HOLDER = '724BAHİS.NET';
const BANK_NAME = 'Ziraat Bankası';

const PremiumCheckout: React.FC<Props> = ({ analysis, userId, username, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'usdt' | 'bank_transfer'>('usdt');
  const [txRef, setTxRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async () => {
    if (!txRef.trim()) {
      setError(method === 'usdt' ? 'Lütfen işlem hash\'ini girin' : 'Lütfen gönderen adını veya dekont numarasını girin');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const result = await createPayment({
      userId,
      username,
      analysisId: analysis.id,
      amount: analysis.price,
      method,
      txReference: txRef.trim(),
    });

    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } else {
      setError('Ödeme kaydı oluşturulamadı. Lütfen tekrar deneyin.');
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
        <div className="w-full max-w-md rounded-3xl p-8 text-center" style={{ background: '#1E1E1E', border: '1px solid rgba(0,230,118,0.3)' }}>
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'rgba(0,230,118,0.15)' }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: '#00E676' }} />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">ÖDEME BİLDİRİLDİ!</h2>
          <p className="text-sm font-bold" style={{ color: '#9E9E9E' }}>
            Ödemeniz admin tarafından onaylandıktan sonra analiz içeriği açılacaktır.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto" style={{ background: 'rgba(0,0,0,0.9)' }}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden relative" style={{ background: '#121212' }}>
        
        {/* Header */}
        <div className="relative p-6 pb-4" style={{ borderBottom: '1px solid rgba(255,193,7,0.1)' }}>
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #FFC107, #FF8F00, #FFC107)' }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-white/10">
            <X className="w-5 h-5 text-white/50" />
          </button>
          <h2 className="text-xl font-black text-white">ÖDEME</h2>
          <p className="text-[11px] font-bold mt-1" style={{ color: '#757575' }}>Premium analiz satın alma</p>
        </div>

        {/* Analysis Summary */}
        <div className="mx-6 mt-4 p-4 rounded-2xl" style={{ background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.12)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>{analysis.league}</p>
              <p className="text-white font-black mt-1">{analysis.matchName}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg" style={{ background: 'rgba(255,193,7,0.1)', color: '#FFC107' }}>
                  {analysis.prediction}
                </span>
                <span className="text-[11px] font-bold" style={{ color: '#00E676' }}>@{analysis.odd.toFixed(2)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase" style={{ color: '#757575' }}>TUTAR</p>
              <p className="text-2xl font-black" style={{ color: '#FFC107' }}>{analysis.price.toFixed(0)}<span className="text-sm ml-1">TL</span></p>
            </div>
          </div>
          {analysis.isGuaranteed && (
            <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,193,7,0.1)' }}>
              <Shield className="w-4 h-4" style={{ color: '#FFC107' }} />
              <span className="text-[10px] font-black uppercase" style={{ color: '#FFC107' }}>Kaybetmesi durumunda bakiyenize iade edilir</span>
            </div>
          )}
        </div>

        {/* Payment Method Tabs */}
        <div className="flex gap-3 mx-6 mt-5">
          <button
            onClick={() => setMethod('usdt')}
            className={`flex-1 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
              method === 'usdt'
                ? 'shadow-[0_4px_20px_rgba(255,193,7,0.2)]'
                : 'hover:bg-white/5'
            }`}
            style={{
              background: method === 'usdt' ? 'linear-gradient(135deg, #FFC107, #FF8F00)' : 'rgba(255,255,255,0.03)',
              color: method === 'usdt' ? '#000' : '#757575',
              border: method === 'usdt' ? 'none' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Bitcoin className="w-4 h-4" /> KRİPTO (USDT)
          </button>
          <button
            onClick={() => setMethod('bank_transfer')}
            className={`flex-1 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
              method === 'bank_transfer'
                ? 'shadow-[0_4px_20px_rgba(255,193,7,0.2)]'
                : 'hover:bg-white/5'
            }`}
            style={{
              background: method === 'bank_transfer' ? 'linear-gradient(135deg, #FFC107, #FF8F00)' : 'rgba(255,255,255,0.03)',
              color: method === 'bank_transfer' ? '#000' : '#757575',
              border: method === 'bank_transfer' ? 'none' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <CreditCard className="w-4 h-4" /> BANKA HAVALESİ
          </button>
        </div>

        {/* Payment Details */}
        <div className="mx-6 mt-4 p-5 rounded-2xl space-y-4" style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.05)' }}>
          
          {method === 'usdt' ? (
            <>
              {/* QR Placeholder */}
              <div className="flex flex-col items-center py-4">
                <div className="w-40 h-40 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#fff', padding: '8px' }}>
                  <div className="w-full h-full rounded-xl flex items-center justify-center" style={{ background: '#f5f5f5' }}>
                    <span className="text-[10px] font-bold text-black/50">QR KOD</span>
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#757575' }}>USDT (TRC-20) ADRESİ</p>
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <code className="flex-1 text-[11px] font-bold text-white break-all">{USDT_ADDRESS}</code>
                <button onClick={() => handleCopy(USDT_ADDRESS, 'address')}
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                >
                  {copied === 'address' ? <CheckCircle2 className="w-4 h-4" style={{ color: '#00E676' }} /> : <Copy className="w-4 h-4" style={{ color: '#FFC107' }} />}
                </button>
              </div>

              <p className="text-[10px] font-bold" style={{ color: '#757575' }}>Yukarıdaki adrese tam olarak <strong className="text-white">{analysis.price.toFixed(0)} TL</strong> karşılığı USDT gönderin.</p>

              {/* TX Hash Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>İŞLEM HASH'İ (TX HASH)</label>
                <input
                  value={txRef}
                  onChange={(e) => setTxRef(e.target.value)}
                  placeholder="0x..."
                  className="w-full p-3.5 rounded-xl text-sm font-bold text-white outline-none transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,193,7,0.15)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(255,193,7,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,193,7,0.15)'}
                />
              </div>
            </>
          ) : (
            <>
              {/* Bank Info */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#757575' }}>BANKA</p>
                  <p className="text-sm font-black text-white">{BANK_NAME}</p>
                </div>
                <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#757575' }}>IBAN</p>
                    <p className="text-sm font-bold text-white">{BANK_IBAN}</p>
                  </div>
                  <button onClick={() => handleCopy(BANK_IBAN.replace(/\s/g, ''), 'iban')}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                  >
                    {copied === 'iban' ? <CheckCircle2 className="w-4 h-4" style={{ color: '#00E676' }} /> : <Copy className="w-4 h-4" style={{ color: '#FFC107' }} />}
                  </button>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#757575' }}>HESAP SAHİBİ</p>
                  <p className="text-sm font-black text-white">{BANK_HOLDER}</p>
                </div>
              </div>

              <p className="text-[10px] font-bold" style={{ color: '#757575' }}>Havale açıklamasına kullanıcı adınızı yazmayı unutmayın.</p>

              {/* Reference Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#757575' }}>GÖNDEREN ADI / DEKONT NO</label>
                <input
                  value={txRef}
                  onChange={(e) => setTxRef(e.target.value)}
                  placeholder="Ad Soyad veya dekont numarası"
                  className="w-full p-3.5 rounded-xl text-sm font-bold text-white outline-none transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,193,7,0.15)',
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(255,193,7,0.5)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,193,7,0.15)'}
                />
              </div>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mt-3 flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)' }}>
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: '#FF5252' }} />
            <span className="text-[11px] font-bold" style={{ color: '#FF5252' }}>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="p-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,193,7,0.3)] active:scale-[0.98] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #FFC107, #FF8F00)',
              color: '#000',
            }}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                ÖDEME BİLDİR <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumCheckout;
