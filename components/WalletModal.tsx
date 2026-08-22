import React, { useState, useEffect } from 'react';
import { X, Copy, AlertCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/UserContext';

interface WalletModalProps {
  onClose: () => void;
  initialTab?: 'deposit' | 'withdraw';
}

const MethodLogo: React.FC<{ code: string }> = ({ code }) => {
  switch (code) {
    case 'papara':
      return (
        <span className="font-black text-[11px] text-white bg-gradient-to-r from-[#7B2CBF] to-[#9D4EDD] px-2 py-0.5 rounded shadow-[0_0_8px_rgba(123,44,191,0.5)] tracking-tighter">
          papara
        </span>
      );
    case 'creditcard':
      return (
        <div className="flex items-center gap-0.5 bg-black/40 px-1.5 py-1 rounded border border-white/10">
          <div className="w-3 h-3 rounded-full bg-[#EB001B]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FF5F00] -ml-1.5 opacity-90"></div>
          <span className="text-[9px] font-black text-white ml-1">CARD</span>
        </div>
      );
    case 'crypto':
      return (
        <div className="w-6 h-6 rounded-full bg-[#26A17B] text-black font-black text-[11px] flex items-center justify-center border border-white/20 shadow-[0_0_8px_rgba(38,161,123,0.4)]">
          ₮
        </div>
      );
    case 'banktransfer':
      return (
        <div className="w-6 h-6 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] flex items-center justify-center font-black text-xs border border-[#00E5FF]/40 shadow-[0_0_8px_rgba(0,229,255,0.3)]">
          🏦
        </div>
      );
    case 'parolapara':
      return (
        <span className="px-1.5 py-0.5 bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40 rounded font-black text-[10px] tracking-tight">
          PAROLA
        </span>
      );
    case 'popypara':
      return (
        <span className="px-1.5 py-0.5 bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800]/40 rounded font-black text-[10px] tracking-tight">
          POPY
        </span>
      );
    case 'papel':
      return (
        <span className="px-1.5 py-0.5 bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 rounded font-black text-[10px] tracking-tight">
          PAPEL
        </span>
      );
    case 'paybol':
      return (
        <span className="px-1.5 py-0.5 bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/40 rounded font-black text-[10px] tracking-tight">
          PAYBOL⚡
        </span>
      );
    case 'pep':
      return (
        <span className="px-1.5 py-0.5 bg-[#E11D48]/20 text-[#E11D48] border border-[#E11D48]/40 rounded font-black text-[10px] tracking-tight">
          PeP
        </span>
      );
    case 'payco':
      return (
        <span className="px-1.5 py-0.5 bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40 rounded font-black text-[10px] tracking-tight">
          PAYCO
        </span>
      );
    case 'paratim':
      return (
        <span className="px-1.5 py-0.5 bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/40 rounded font-black text-[10px] tracking-tight">
          PARATİM
        </span>
      );
    default:
      return <span className="text-xl">💳</span>;
  }
};

const DEPOSIT_METHODS = [
  { id: 'banktransfer', name: 'Banka Havalesi', type: 'banktransfer', neoCode: 'banktransfer', badge: '7/24 EFT/Havale', minAmount: 100 },
  { id: 'crypto', name: 'Kripto Para', type: 'crypto', neoCode: 'crypto', badge: 'USDT/BTC/XRP', minAmount: 50 },
  { id: 'creditcard', name: 'Kredi Kartı', type: 'creditcard', neoCode: 'creditcard', badge: '3D Secure', minAmount: 100 },
];

const WITHDRAW_METHODS = [
  { id: 'banktransfer', name: 'Banka Havalesi', type: 'banktransfer', neoCode: 'banktransfer', badge: '7/24 IBAN Transfer', minAmount: 3000 },
  { id: 'crypto', name: 'Kripto Para', type: 'crypto', neoCode: 'crypto', badge: 'USDT/BTC/XRP', minAmount: 3000 },
];

const TURKISH_BANKS = [
  'Ziraat Bankası', 'Garanti BBVA', 'Türkiye İş Bankası', 'Akbank', 
  'Yapı Kredi', 'VakıfBank', 'Enpara.com', 'QNB Finansbank', 'Halkbank', 'Papara / IBAN'
];

const CRYPTO_COINS = [
  { code: 'USDT_TRC20', name: 'USDT (TRC-20)' },
  { code: 'USDT_ERC20', name: 'USDT (ERC-20)' },
  { code: 'BTC', name: 'Bitcoin (BTC)' },
  { code: 'ETH', name: 'Ethereum (ETH)' },
  { code: 'XRP', name: 'Ripple (XRP)' },
  { code: 'TRX', name: 'TRON (TRX)' }
];

const WalletModal: React.FC<WalletModalProps> = ({ onClose, initialTab = 'deposit' }) => {
  const { t } = useTranslation();
  const { siteUser, setSiteUser } = useUser();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>(initialTab as any);
  
  const [methods, setMethods] = useState<any[]>(DEPOSIT_METHODS);
  const [selectedMethod, setSelectedMethod] = useState<any>(DEPOSIT_METHODS[0]);
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Specific Withdrawal Form State
  const [selectedBank, setSelectedBank] = useState<string>('Ziraat Bankası');
  const [accountName, setAccountName] = useState<string>(siteUser?.username || '');
  const [selectedCoin, setSelectedCoin] = useState<string>('USDT (TRC-20)');
  const [cryptoAddress, setCryptoAddress] = useState<string>('');
  const [cryptoMemo, setCryptoMemo] = useState<string>('');

  // Receipt Modal State
  const [lastReceipt, setLastReceipt] = useState<{
    trxId: string;
    method: string;
    amount: string;
    details: string;
    date: string;
    fullText: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string>('');

  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'withdraw') {
      setMethods(WITHDRAW_METHODS);
      setSelectedMethod(WITHDRAW_METHODS[0]);
    } else {
      setMethods(DEPOSIT_METHODS);
      setSelectedMethod(DEPOSIT_METHODS[0]);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'history' && siteUser) {
      const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
          const res = await fetch(`/api/payments/history?userId=${siteUser.id}`);
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

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  const handleSubmit = async () => {
    if (!siteUser) {
      setError('Lütfen önce giriş yapın.');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) < (selectedMethod?.minAmount || 10)) {
      setError(`Minimum tutar: ${selectedMethod?.minAmount || 10} ₺`);
      return;
    }

    setLoading(true);
    setError('');

    // Handle NeoPays Deposit Redirect for any selected method
    if (activeTab === 'deposit') {
      try {
        const neoCode = selectedMethod?.neoCode || selectedMethod?.type || 'banktransfer';
        const res = await fetch('/api/payments/neopays/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: siteUser.id,
            amount: amount,
            method: neoCode,
            fullname: siteUser.username,
            returnUrl: window.location.origin.replace('https://724bets.net', 'https://www.724bets.net')
          })
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          setError(`[HTTP ${res.status}] NeoPays Hatası: ${text.substring(0, 150) || res.statusText}`);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.url) {
          window.location.href = data.url;
          return;
        } else {
          setError(`[NeoPays Hatası] ${data.error || 'Ödeme yönlendirmesi alınamadı.'}`);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        setError(`[Bağlantı Hatası] Debug: ${err?.message || String(err)}`);
        setLoading(false);
        return;
      }
    }

    // Handle Withdrawal Request Submission
    if (activeTab === 'withdraw') {
      let withdrawalDetails = '';
      if (selectedMethod.id === 'crypto') {
        if (!cryptoAddress || cryptoAddress.trim().length < 6) {
          setError('Lütfen geçerli bir kripto cüzdan adresi girin.');
          setLoading(false);
          return;
        }
        withdrawalDetails = `Coin: ${selectedCoin} | Cüzdan: ${cryptoAddress.trim()}${cryptoMemo ? ' | Memo: ' + cryptoMemo.trim() : ''}`;
      } else {
        if (!txHash || txHash.trim().length < 8) {
          setError('Lütfen geçerli bir IBAN veya Hesap numarası girin.');
          setLoading(false);
          return;
        }
        withdrawalDetails = `Banka: ${selectedBank} | Ad Soyad: ${accountName || siteUser.username} | IBAN: ${txHash.trim()}`;
      }

      const generatedTrx = `TRX_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}`;

      try {
        const endpoint = '/api/payments/withdraw';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: siteUser.id,
            method: `${selectedMethod.name} (${selectedMethod.id === 'crypto' ? selectedCoin : selectedBank})`,
            amount: amount,
            txHash: `${generatedTrx} - ${withdrawalDetails}`,
            iban: selectedMethod.id === 'crypto' ? undefined : txHash.trim(),
            bankId: selectedMethod.id === 'crypto' ? undefined : "48889430-844c-4149-bca0-1745e64319ed",
            walletAddress: selectedMethod.id === 'crypto' ? cryptoAddress.trim() : undefined,
            coinId: selectedMethod.id === 'crypto' ? "01a7e83c-17cd-4039-9f03-92f4e5d256dd" : undefined,
            memo: cryptoMemo ? cryptoMemo.trim() : undefined,
            fullname: accountName || siteUser.username
          })
        });
        
        const data = await res.json().catch(() => ({}));
        
        if (!res.ok) {
          const debugStr = data.debug ? JSON.stringify(data.debug, null, 2) : '';
          setError(`[HTTP ${res.status} Hata] ${data.error || res.statusText}${debugStr ? '\n\n[Debug Log]:\n' + debugStr : ''}`);
          setLoading(false);
          return;
        }

        if (data.success) {
          const finalTrxId = data.request?.id || generatedTrx;
          const numAmt = parseFloat(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 });
          const dateStr = new Date().toLocaleString('tr-TR');
          
          const debugLog = data.debug || {};
          const fullText = `=== 724BETS ÇEKİM TALEBİ FİŞİ ===\nİşlem ID (TRX): ${finalTrxId}\nKullanıcı: ${siteUser.username}\nYöntem: ${selectedMethod.id === 'crypto' ? `Kripto (${selectedCoin})` : `Banka Havalesi (${selectedBank})`}\nTutar: ${numAmt} TL\nDetaylar: ${withdrawalDetails}\nTarih: ${dateStr}\nDurum: Bekliyor (Finans Onayında)\n\n--- DEBUG / SUNUCU YANITI ---\nStatus: ${res.status} OK\nMesaj: ${debugLog.message || 'Başarılı'}\nDüşülen Tutar: ${numAmt} TL\nKalan Bakiye: ${debugLog.remainingBalance !== undefined ? debugLog.remainingBalance + ' TL' : 'Güncellendi'}`;

          setLastReceipt({
            trxId: finalTrxId,
            method: selectedMethod.id === 'crypto' ? `Kripto (${selectedCoin})` : `Banka Havalesi (${selectedBank})`,
            amount: `${numAmt} TL`,
            details: withdrawalDetails,
            date: dateStr,
            fullText,
            debug: debugLog
          });
          setSuccess(true);
          
          if (data.newBalance !== undefined && setSiteUser) {
             setSiteUser((prev: any) => {
                 if (!prev) return prev;
                 const updated = { ...prev, balance: data.newBalance };
                 localStorage.setItem('site_current_member', JSON.stringify(updated));
                 return updated;
             });
          }
        } else {
          setError(`[İşlem Hatası] ${data.error || 'İşlem başarısız oldu.'}`);
        }
      } catch (err: any) {
        setError(`[Bağlantı Hatası] Debug: ${err?.message || String(err)}`);
      } finally {
        setLoading(false);
      }
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
            onClick={() => { setActiveTab('deposit'); setSuccess(false); setError(''); }}
            className={`flex-1 py-3.5 text-center font-bold text-[13px] uppercase tracking-wider transition-all border-b-[3px] ${
              activeTab === 'deposit' ? 'text-white border-[#00E676] bg-[#00E5FF]/5' : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Yatırım
          </button>
          <button 
            onClick={() => { setActiveTab('withdraw'); setSuccess(false); setError(''); }}
            className={`flex-1 py-3.5 text-center font-bold text-[13px] uppercase tracking-wider transition-all border-b-[3px] ${
              activeTab === 'withdraw' ? 'text-white border-[#00E676] bg-[#00E5FF]/5' : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Çekim
          </button>
          <button 
            onClick={() => { setActiveTab('history'); setSuccess(false); setError(''); }}
            className={`flex-1 py-3.5 text-center font-bold text-[13px] uppercase tracking-wider transition-all border-b-[3px] ${
              activeTab === 'history' ? 'text-white border-[#00E5FF] bg-[#00E5FF]/5' : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Geçmiş
          </button>
        </div>

        <div className="p-5 bg-[#0A0C10] flex-1 max-h-[65vh] overflow-y-auto custom-scrollbar">
          {success && lastReceipt ? (
            <div className="flex flex-col items-center justify-center py-4 text-center animate-fade-in">
              <CheckCircle2 className="w-14 h-14 text-[#00E676] mb-2 drop-shadow-[0_0_15px_rgba(0,230,118,0.5)]" />
              <h3 className="text-white font-black text-xl mb-1">Çekim Talebi Alındı!</h3>
              <p className="text-zinc-400 text-xs mb-4">Talebiniz finans ekibimize iletilmiştir.</p>

              <div className="w-full bg-[#131620] border border-white/10 rounded-xl p-4 text-left font-mono text-xs text-zinc-300 mb-4 space-y-2.5 relative shadow-inner">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500 font-bold uppercase text-[10px]">İşlem Numarası (TRX ID):</span>
                  <button 
                    onClick={() => handleCopyText(lastReceipt.trxId, 'trxId')}
                    className="flex items-center gap-1 text-[#00E5FF] font-bold hover:underline select-all text-[11px]"
                  >
                    {copiedKey === 'trxId' ? '✓ Kopyalandı' : `${lastReceipt.trxId.substring(0, 16)}... 📋`}
                  </button>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">Çekim Yöntemi:</span>
                  <span className="text-white font-bold">{lastReceipt.method}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">Çekilen Tutar:</span>
                  <span className="text-[#00E676] font-black">{lastReceipt.amount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-500">Tarih:</span>
                  <span className="text-zinc-400">{lastReceipt.date}</span>
                </div>

                <div className="flex flex-col pt-1 border-t border-white/5">
                  <span className="text-zinc-500 text-[10px] mb-1">Hesap / Cüzdan Detayları:</span>
                  <span className="text-amber-400 font-semibold break-all bg-black/40 p-2 rounded border border-amber-500/20 select-all">
                    {lastReceipt.details}
                  </span>
                </div>

                {/* Sunucu & NeoPays Debug Log Alanı */}
                {lastReceipt.debug && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 bg-black/50 p-2.5 rounded border border-[#00E5FF]/20">
                    <div className="text-[10px] font-bold text-[#00E5FF] uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>🔍 Sunucu & NeoPays Debug Logu</span>
                      <button 
                        onClick={() => handleCopyText(JSON.stringify(lastReceipt.debug, null, 2), 'debugJson')}
                        className="text-zinc-400 hover:text-white text-[9px] underline"
                      >
                        {copiedKey === 'debugJson' ? '✓ Log Kopyalandı' : 'JSON Kopyala 📋'}
                      </button>
                    </div>
                    <div className="text-[10px] text-zinc-300 space-y-1">
                      <div><span className="text-zinc-500">Durum:</span> <span className="text-emerald-400 font-bold">{lastReceipt.debug.status || '200 OK'}</span></div>
                      <div><span className="text-zinc-500">Mesaj:</span> {lastReceipt.debug.message || 'İşlem Başarılı'}</div>
                      {lastReceipt.debug.remainingBalance !== undefined && (
                        <div><span className="text-zinc-500">Kalan Bakiye:</span> <span className="text-[#00E5FF] font-bold">{lastReceipt.debug.remainingBalance} ₺</span></div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col gap-2">
                <button 
                  onClick={() => handleCopyText(lastReceipt.fullText, 'fullReceipt')}
                  className="w-full bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  {copiedKey === 'fullReceipt' ? '✓ Tüm Fiş & Debug Metni Kopyalandı!' : 'Tüm İşlem Fişini Kopyala 📋'}
                </button>
                <button 
                  onClick={() => { setSuccess(false); setLastReceipt(null); onClose(); }}
                  className="w-full bg-white/5 hover:bg-white/10 text-zinc-300 font-bold py-2.5 rounded-xl text-xs uppercase transition-all"
                >
                  Pencereyi Kapat ✕
                </button>
              </div>
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
            <div>
              <div className="mb-5">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-2">Ödeme Yöntemi Seçin</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {methods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedMethod(m); setError(''); }}
                      className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        selectedMethod?.id === m.id 
                          ? 'bg-gradient-to-br from-[#00E5FF]/20 to-blue-600/10 border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]' 
                          : 'bg-[#131620] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <MethodLogo code={m.neoCode} />
                        {m.badge && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-white/10 text-[#00E5FF]">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs truncate text-white">{m.name}</div>
                      <div className="text-[10px] text-zinc-500 font-medium mt-0.5">Min: {m.minAmount || 50} ₺</div>
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'deposit' && selectedMethod && (
                <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl p-3.5 mb-5 flex items-center gap-3">
                  <MethodLogo code={selectedMethod.neoCode} />
                  <div>
                    <div className="text-white font-bold text-xs">{selectedMethod.name} İle Güvenli Ödeme</div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Tutarı girip onayladığınızda NeoPays ödeme sayfasına otomatik yönlendirileceksiniz.
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                  {activeTab === 'deposit' ? 'Yatırılacak Tutar (TL)' : 'Çekilecek Tutar (TL)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₺</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={selectedMethod?.minAmount?.toString() || '100'}
                    className="w-full bg-[#131620] border border-white/10 rounded-lg py-3 pl-8 pr-4 text-white font-bold outline-none focus:border-[#00E5FF]/50"
                  />
                </div>
              </div>

              {activeTab === 'withdraw' && selectedMethod?.id === 'crypto' && (
                <div className="space-y-4 mb-6 animate-fade-in">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                      Çekim Yapılacak Kripto Para / Ağ
                    </label>
                    <select 
                      value={selectedCoin}
                      onChange={(e) => setSelectedCoin(e.target.value)}
                      className="w-full bg-[#131620] border border-white/10 rounded-lg py-3 px-3 text-white font-bold outline-none focus:border-[#00E5FF]/50"
                    >
                      {CRYPTO_COINS.map(c => (
                        <option key={c.code} value={c.name} className="bg-[#0A0C10] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                      Kripto Cüzdan Adresi (Wallet Address)
                    </label>
                    <input 
                      type="text" 
                      value={cryptoAddress}
                      onChange={(e) => setCryptoAddress(e.target.value)}
                      placeholder="Örn: T9yD1P... veya 0x71C..."
                      className="w-full bg-[#131620] border border-white/10 rounded-lg py-3 px-4 text-white font-mono text-xs font-semibold outline-none focus:border-[#00E5FF]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                      Destination Tag / Memo <span className="text-zinc-600 font-normal">(Opsiyonel / XRP için)</span>
                    </label>
                    <input 
                      type="text" 
                      value={cryptoMemo}
                      onChange={(e) => setCryptoMemo(e.target.value)}
                      placeholder="Örn: 1029384 (Gerekmiyorsa boş bırakın)"
                      className="w-full bg-[#131620] border border-white/10 rounded-lg py-2.5 px-4 text-zinc-300 font-mono text-xs outline-none focus:border-[#00E5FF]/50"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'withdraw' && selectedMethod?.id === 'banktransfer' && (
                <div className="space-y-4 mb-6 animate-fade-in">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                      Banka Seçin
                    </label>
                    <select 
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-[#131620] border border-white/10 rounded-lg py-3 px-3 text-white font-bold outline-none focus:border-[#00E5FF]/50"
                    >
                      {TURKISH_BANKS.map(b => (
                        <option key={b} value={b} className="bg-[#0A0C10] text-white">
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                      Hesap Sahibi Ad Soyad
                    </label>
                    <input 
                      type="text" 
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Banka hesabınızdaki ad soyad"
                      className="w-full bg-[#131620] border border-white/10 rounded-lg py-3 px-4 text-white font-semibold outline-none focus:border-[#00E5FF]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">
                      IBAN Adresi
                    </label>
                    <input 
                      type="text" 
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      placeholder="TR00 0000 0000 0000 0000 0000 00"
                      className="w-full bg-[#131620] border border-white/10 rounded-lg py-3 px-4 text-white font-mono text-xs font-semibold outline-none focus:border-[#00E5FF]/50"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-3.5 mb-4 text-red-400 text-xs font-mono font-semibold break-all select-all flex items-start gap-2 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#00E5FF] to-blue-600 hover:brightness-110 text-black font-black py-3.5 rounded-xl uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-[#00E5FF]/20 flex items-center justify-center gap-2"
              >
                {loading ? 'İşleniyor...' : (activeTab === 'deposit' ? `${selectedMethod?.name || 'Ödeme'} İle Devam Et 🚀` : 'Çekim Talebi Oluştur')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
