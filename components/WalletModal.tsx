import React, { useState, useEffect } from 'react';
import { X, Copy, AlertCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';

interface WalletModalProps {
  onClose: () => void;
  initialTab?: 'deposit' | 'withdraw';
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose, initialTab = 'deposit' }) => {
  const { t } = useTranslation();
  const { siteUser } = useUser();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>(initialTab as any);
  
  const [methods, setMethods] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await fetch('https://api.724bahis.net/api/admin/payment-methods');
        const data = await res.json();
        if (data.success && data.methods.length > 0) {
          const activeMethods = data.methods.filter((m: any) => m.isActive);
          setMethods(activeMethods);
          if (activeMethods.length > 0) {
            setSelectedMethod(activeMethods[0]);
          }
        } else {
          const dummies = [
            { id: '1', name: 'Papara', type: 'papara', accountName: '724Bets Destek', accountNo: '1234567890', minAmount: 50 },
            { id: '2', name: 'Banka Havalesi', type: 'bank_transfer', accountName: '724Bets Finans', accountNo: 'TR12 3456 7890 0000 0000 0000 00', minAmount: 100 },
            { id: '3', name: 'USDT (TRC-20)', type: 'crypto', accountName: 'USDT Cüzdanı', accountNo: 'TXYZ1234567890abcdef', minAmount: 10 }
          ];
          setMethods(dummies);
          setSelectedMethod(dummies[0]);
        }
      } catch (err) {
        console.error("Error fetching methods", err);
      }
    };
    fetchMethods();
  }, []);

  useEffect(() => {
    if (activeTab === 'history' && siteUser) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await fetch(`https://api.724bahis.net/api/payments/history?userId=${siteUser.id}`);
          const data = await res.json();
          if (data.success) {
            setHistory(data.history);
          }
        } catch (err) {
          console.error("Error fetching history", err);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [activeTab, siteUser]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async () => {
    if (!siteUser) {
      setError('Lütfen önce giriş yapın.');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) < selectedMethod?.minAmount) {
      setError(`Minimum tutar: ${selectedMethod?.minAmount}`);
      return;
    }
    if (activeTab === 'deposit' && !txHash) {
      setError('Lütfen işlem referans numarasını girin.');
      return;
    }
    if (activeTab === 'withdraw' && !txHash) {
      setError('Lütfen çekim yapılacak cüzdan/IBAN adresinizi girin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = activeTab === 'deposit' ? 'https://api.724bahis.net/api/payments/deposit' : 'https://api.724bahis.net/api/payments/withdraw';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: siteUser.id,
          method: selectedMethod.name,
          amount: amount,
          txHash: txHash
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.error || 'İşlem başarısız oldu.');
      }
    } catch (err) {
      setError('Sunucu bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" style={{ zIndex: 999999 }} onClick={onClose}>
      <div 
        className="w-full max-w-[480px] bg-[#0A0C10] border border-white/5 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] relative flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-center py-5 border-b border-white/5 bg-[#0A0C10]">
          <h2 className="text-white font-black text-lg tracking-wide">
            {activeTab === 'deposit' ? 'Para Yatır' : activeTab === 'withdraw' ? 'Para Çek' : 'İşlem Geçmişi'}
          </h2>
          <button 
            onClick={onClose}
            className="absolute right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-white/5 bg-[#0A0C10]">
          <button 
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-3.5 text-center font-bold text-[13px] uppercase tracking-wider transition-all border-b-[3px] ${
              activeTab === 'deposit' ? 'text-white border-[#00E676] bg-[#00E5FF]/5' : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Yatırım
          </button>
          <button 
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-3.5 text-center font-bold text-[13px] uppercase tracking-wider transition-all border-b-[3px] ${
              activeTab === 'withdraw' ? 'text-white border-[#00E676] bg-[#00E5FF]/5' : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Çekim
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3.5 text-center font-bold text-[13px] uppercase tracking-wider transition-all border-b-[3px] ${
              activeTab === 'history' ? 'text-white border-[#00E5FF] bg-[#00E5FF]/5' : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Geçmiş
          </button>
        </div>

        <div className="p-5 bg-[#0A0C10] flex-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="w-16 h-16 text-[#00E676] mb-4 drop-shadow-[0_0_15px_rgba(0,230,118,0.5)]" />
              <h3 className="text-white font-bold text-xl mb-2">İşlem Başarılı!</h3>
              <p className="text-zinc-400 text-sm">
                Talebiniz alınmıştır. Finans birimimiz tarafından incelendikten sonra bakiyenize yansıyacaktır.
              </p>
            </div>
          ) : activeTab === 'history' ? (
            <div className="space-y-3">
              {loadingHistory ? (
                <div className="text-center text-zinc-500 py-10">Yükleniyor...</div>
              ) : history.length === 0 ? (
                <div className="text-center text-zinc-500 py-10 bg-white/5 rounded-xl border border-white/5">İşlem geçmişiniz bulunmuyor.</div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="bg-[#131620] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                          item.type === 'deposit' ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {item.type === 'deposit' ? 'YATIRIM' : 'ÇEKİM'}
                        </span>
                        <span className="text-white font-bold text-sm">{item.method}</span>
                      </div>
                      <div className="text-xs text-zinc-500">{new Date(item.createdAt).toLocaleString('tr-TR')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#00E5FF] font-black">{item.amount.toLocaleString('tr-TR')} ₺</div>
                      <div className={`text-[11px] font-bold ${
                        item.status === 'approved' ? 'text-[#00E676]' :
                        item.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                      }`}>
                        {item.status === 'approved' ? 'ONAYLANDI' : item.status === 'rejected' ? 'İPTAL EDİLDİ' : 'BEKLİYOR'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-[#0A0C10] rounded-xl p-5 border border-white/5 shadow-inner">
              <div className="mb-5">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">Ödeme Yöntemi</label>
                <div className="grid grid-cols-3 gap-2">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m)}
                      className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${
                        selectedMethod?.id === m.id 
                          ? 'border-[#00E676] bg-[#00E5FF]/10 text-white' 
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMethod && activeTab === 'deposit' && (
                <div className="bg-[#00E5FF]/5 border border-[#00E676]/20 rounded-lg p-4 mb-5">
                  <p className="text-[12px] text-zinc-300 leading-relaxed font-medium mb-3">
                    Lütfen aşağıdaki hesaba gönderim yaptıktan sonra işlemi onaylayın.
                  </p>
                  <div className="mb-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Alıcı Adı</span>
                    <div className="text-white font-bold text-sm">{selectedMethod.accountName}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Hesap / IBAN / Cüzdan</span>
                    <div className="flex items-center justify-between bg-black/50 p-2 rounded border border-white/5 mt-1">
                      <span className="text-[#00E5FF] font-mono text-sm break-all">{selectedMethod.accountNo}</span>
                      <button onClick={() => handleCopy(selectedMethod.accountNo)} className="text-zinc-400 hover:text-white p-1">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">Tutar (USD/TL)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={selectedMethod?.minAmount?.toString() || '0'}
                    className="w-full bg-[#131620] border border-white/10 rounded-lg py-3 pl-8 pr-4 text-white font-bold outline-none focus:border-[#00E5FF]/50"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                  {activeTab === 'deposit' ? 'İşlem Numarası / Gönderen Adı' : 'Çekim Yapılacak Hesap / Cüzdan / IBAN'}
                </label>
                <input 
                  type="text" 
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder={activeTab === 'deposit' ? 'Örn: Ahmet Yılmaz veya TX123456' : 'TR12 3456...'}
                  className="w-full bg-[#131620] border border-white/10 rounded-lg py-3 px-4 text-white font-medium outline-none focus:border-[#00E5FF]/50"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#c6ff00] hover:bg-[#a6d900] text-black font-black py-3.5 rounded-lg uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? 'İşleniyor...' : (activeTab === 'deposit' ? 'Yatırımı Bildir' : 'Çekim Talebi Oluştur')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;

