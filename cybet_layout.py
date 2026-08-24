import re

new_code = """import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, Building2, Lock, Zap, Clock, History, AlertCircle, ChevronDown, Wallet, ArrowDownToLine, ArrowUpFromLine, Gift } from 'lucide-react';

const DEPOSIT_METHODS = [
  { id: 'banktransfer', name: 'Banka Havalesi', desc: 'Hızlı & Güvenli', badge: '7/24 AKTİF', type: 'banktransfer', theme: { bg: '#0f1c3f', color: '#3B82F6' } },
  { id: 'crypto', name: 'Kripto Para', desc: 'Kripto Ödemeleri', badge: 'ANINDA', type: 'crypto', theme: { bg: '#452203', color: '#F59E0B' } },
  { id: 'creditcard', name: 'Kredi Kartı', desc: 'Kredi / Banka Kartı', badge: '3D GÜVENLİ', type: 'creditcard', theme: { bg: '#2e1065', color: '#8B5CF6' } }
];

const BANK_OPTIONS = ['Ziraat Bankası', 'Garanti BBVA', 'İş Bankası', 'Yapı Kredi', 'Akbank', 'QNB Finansbank', 'Enpara', 'Vakıfbank'];
const CRYPTO_COINS = ['Tether (USDT)', 'Bitcoin (BTC)', 'Ethereum (ETH)', 'Tron (TRX)', 'Litecoin (LTC)'];
const CRYPTO_NETWORKS = ['TRC20 (Tron)', 'ERC20 (Ethereum)', 'BEP20 (BSC)', 'Polygon'];

const MOCK_HISTORY = [
  { id: 'TX-99281', type: 'deposit', method: 'Kripto Para', amount: '2,500.00', status: 'completed', date: '22 Ağu 2026', time: '14:30' },
  { id: 'TX-99280', type: 'withdraw', method: 'Banka Havalesi', amount: '10,000.00', status: 'pending', date: '21 Ağu 2026', time: '09:15' },
  { id: 'TX-99279', type: 'deposit', method: 'Kredi Kartı', amount: '500.00', status: 'completed', date: '20 Ağu 2026', time: '18:45' }
];

const CustomSelect = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (v: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">{label}</h3>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-medium flex justify-between items-center cursor-pointer transition-all hover:ring-1 hover:ring-white/10"
        style={{ background: '#131927', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-50 max-h-56 overflow-y-auto py-2 custom-scrollbar backdrop-blur-xl" style={{ background: "rgba(20,25,35,0.95)" }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} className={`px-4 py-3 text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-between ${value === opt ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}>
              <span>{opt}</span>
              {value === opt && <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WalletModal = ({ onClose, initialTab = 'deposit' }: { onClose: () => void, initialTab?: string }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedMethod, setSelectedMethod] = useState(DEPOSIT_METHODS[0]);
  const [amount, setAmount] = useState('100');
  
  const [bank, setBank] = useState(BANK_OPTIONS[0]);
  const [fullName, setFullName] = useState('');
  const [iban, setIban] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  
  const [depositCryptoCoin, setDepositCryptoCoin] = useState(CRYPTO_COINS[0]);
  const [depositCryptoNetwork, setDepositCryptoNetwork] = useState(CRYPTO_NETWORKS[0]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setSuccess(false);
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(() => { setSuccess(false); onClose(); }, 3000); }, 1500);
  };

  const isFormValid = () => {
    const amt = parseFloat(amount);
    const isAmountValid = !isNaN(amt) && amt >= 100;
    if (activeTab === 'deposit') return isAmountValid;
    if (activeTab === 'withdraw') {
      if (selectedMethod.type === 'banktransfer') return isAmountValid && fullName.length > 3 && iban.length > 15;
      if (selectedMethod.type === 'crypto') return isAmountValid && cryptoAddress.length > 10;
    }
    return false;
  };

  const NAV_ITEMS = [
    { id: 'deposit', label: 'Para Yatır', icon: ArrowDownToLine },
    { id: 'withdraw', label: 'Çekim', icon: ArrowUpFromLine },
    { id: 'history', label: 'Geçmiş', icon: History },
    { id: 'bonus', label: 'Bonus', icon: Gift }
  ];

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-0 sm:p-6 transition-all animate-in fade-in duration-200 font-sans" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="relative w-full h-full sm:h-[680px] sm:max-w-[880px] flex flex-col sm:flex-row sm:rounded-[24px] overflow-hidden z-10 bg-[#0F1423] sm:shadow-[0_0_80px_rgba(0,0,0,0.8)] sm:border sm:border-white/5">
        
        {/* MOBILE HEADER (Hidden on Desktop) */}
        <div className="sm:hidden flex flex-col bg-[#161B29] border-b border-white/5 px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-[18px] font-black tracking-tight">724<span className="text-[#3B82F6]">Bets</span></span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex bg-[#0F1423] p-1 rounded-xl w-full">
             {NAV_ITEMS.slice(0,3).map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === item.id ? 'bg-[#22283A] text-white' : 'text-white/50'}`}>{item.label}</button>
             ))}
          </div>
        </div>

        {/* DESKTOP LEFT SIDEBAR */}
        <div className="hidden sm:flex w-[240px] bg-[#161B29] flex-col border-r border-white/5 p-4 relative z-20">
          <div className="flex items-center gap-2 mb-8 px-2 mt-2">
             <span className="text-white text-[24px] font-black tracking-tight">724<span className="text-[#3B82F6]">Bets</span></span>
          </div>
          
          <nav className="flex-1 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-[#0F1423] shadow-inner border border-white/5 relative' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#3B82F6] rounded-r-full shadow-[0_0_10px_#3B82F6]"></div>}
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#3B82F6]' : 'text-white/40 group-hover:text-white/70'}`} />
                  <span className={`text-[13px] font-bold tracking-wide ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto bg-[#0F1423] p-4 rounded-2xl border border-white/5">
             <p className="text-[10px] text-white/50 text-center mb-3 leading-relaxed">Süper güvenlik kalkanınız. Hesabınızı en üst düzeyde korumak için etkinleştirin.</p>
             <button className="w-full bg-[#10B981] hover:bg-[#059669] text-white text-[12px] font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck strokeWidth={2.5} className="w-4 h-4" /> 2FA'YI ETKİNLEŞTİR
             </button>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col relative bg-[#0F1423]">
          
          {/* Top Bar (Balance & Close) */}
          <div className="hidden sm:flex items-center justify-between p-6 shrink-0">
            <h2 className="text-white text-[18px] font-black">{NAV_ITEMS.find(i => i.id === activeTab)?.label || 'Cüzdan'}</h2>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Kullanılabilir:</span>
                <span className="text-[#10B981] text-[14px] font-black">₺ 41.750,00</span>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="sm:hidden p-4 shrink-0 flex justify-between items-center bg-[#0F1423]">
              <h2 className="text-white text-[16px] font-black">{NAV_ITEMS.find(i => i.id === activeTab)?.label || 'Cüzdan'}</h2>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Bakiye:</span>
                <span className="text-[#10B981] text-[13px] font-black">₺ 41.750</span>
              </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 custom-scrollbar relative">
            
            {success ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 bg-[#0F1423]">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-white text-[24px] font-bold mb-3">İşlem Başarılı</h3>
              </div>
            ) : activeTab === 'bonus' ? (
              <div className="h-full flex flex-col items-center justify-center animate-in fade-in">
                 <Gift className="w-20 h-20 text-[#F59E0B] mb-6 opacity-80 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.5)]" />
                 <h3 className="text-white text-[22px] font-black mb-3 text-center">Yatırım Bonusu Satın Al</h3>
                 <p className="text-white/60 text-center text-[13px] max-w-sm mb-8">Bir sonraki para yatırma işleminizde ekstra değerin kilidini açın!</p>
                 <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    {['%30', '%50', '%70', '%100'].map(b => (
                       <div key={b} className="bg-[#131927] border border-white/5 p-4 rounded-2xl flex flex-col items-center hover:border-[#10B981] transition-colors cursor-pointer group">
                          <span className="text-[#10B981] text-[24px] font-black group-hover:scale-110 transition-transform">{b}</span>
                          <span className="text-white/40 text-[10px] mt-1 font-bold">Bonusu Etkinleştir</span>
                       </div>
                    ))}
                 </div>
              </div>
            ) : activeTab === 'history' ? (
              <div className="space-y-3 animate-in fade-in">
                {MOCK_HISTORY.map(tx => (
                  <div key={tx.id} className="bg-[#131927] p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {tx.type === 'deposit' ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-white font-bold text-[14px] mb-0.5">{tx.method}</div>
                        <div className="text-white/50 text-[11px]">{tx.date} • {tx.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black text-[15px] mb-1 ${tx.type === 'deposit' ? 'text-green-500' : 'text-white'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}₺{tx.amount}
                      </div>
                      <div className={`text-[9px] font-bold tracking-wider uppercase ${tx.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {tx.status === 'completed' ? 'Tamamlandı' : 'Bekliyor'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col h-full animate-in fade-in">
                
                {/* 3D PAYMENT METHOD CARDS */}
                <div className="grid grid-cols-3 gap-3 mb-6 shrink-0">
                  {DEPOSIT_METHODS.map((method) => {
                    const isSelected = selectedMethod?.id === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method)}
                        className={`relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-300 overflow-hidden ${
                          isSelected ? 'scale-100 sm:scale-105 z-20 shadow-[0_15px_30px_rgba(0,0,0,0.6)]' : 'scale-100 z-10 opacity-60 hover:opacity-100 hover:bg-[#161B29]'
                        }`}
                        style={{
                          background: isSelected ? `linear-gradient(145deg, ${method.theme.bg} 0%, #0d111a 100%)` : '#131927',
                          borderColor: isSelected ? method.theme.color + '80' : 'rgba(255,255,255,0.02)',
                          borderWidth: '1px', borderStyle: 'solid',
                          boxShadow: isSelected ? `inset 0 1px 1px rgba(255,255,255,0.1), 0 10px 20px ${method.theme.color}20` : 'none',
                          minHeight: '120px'
                        }}
                      >
                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5">
                            <CheckCircle2 className="w-4 h-4" style={{ color: method.theme.color, filter: `drop-shadow(0 0 5px ${method.theme.color})` }} />
                          </div>
                        )}
                        <div className="text-center w-full mt-1">
                          <h3 className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase ${isSelected ? 'text-white' : 'text-white/80'}`}>{method.name}</h3>
                        </div>
                        <div className="h-[40px] w-full flex items-center justify-center my-2">
                          {method.id === 'banktransfer' && <Building2 className={`w-7 h-7 ${isSelected ? 'text-white' : 'text-white/40'}`} />}
                          {method.id === 'crypto' && (
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center border border-[#86EFAC]/30 relative z-10 translate-x-2 bg-gradient-to-br from-[#BBF7D0] to-[#059669] shadow-lg"><span className="text-white text-[10px] font-bold">₮</span></div>
                              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-[#FDE047]/50 relative z-20 bg-gradient-to-br from-[#FEF08A] to-[#D97706] shadow-xl"><span className="text-white text-[12px] font-bold">₿</span></div>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center border border-[#E2E8F0]/30 relative z-0 -translate-x-2 bg-gradient-to-br from-[#F8FAFC] to-[#94A3B8] shadow-lg"><span className="text-white text-[10px] font-bold">Ξ</span></div>
                            </div>
                          )}
                          {method.id === 'creditcard' && <span className="font-black italic text-white text-[15px]">VISA</span>}
                        </div>
                        <div className="mt-auto w-full text-center">
                          <span className={`text-[8px] font-black tracking-widest uppercase ${isSelected ? 'text-white/90' : 'text-white/40'}`}>{method.badge}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* DYNAMIC FORMS */}
                <div className="flex flex-col flex-1 space-y-4">
                  
                  {activeTab === 'deposit' && selectedMethod?.type === 'crypto' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                      <CustomSelect label="Para Birimi" options={CRYPTO_COINS} value={depositCryptoCoin} onChange={setDepositCryptoCoin} />
                      <CustomSelect label="Ağ (Network)" options={CRYPTO_NETWORKS} value={depositCryptoNetwork} onChange={setDepositCryptoNetwork} />
                    </div>
                  )}

                  {activeTab === 'withdraw' && selectedMethod?.type === 'banktransfer' && (
                    <div className="space-y-4 animate-in fade-in">
                      <CustomSelect label="Banka Seçin" options={BANK_OPTIONS} value={bank} onChange={setBank} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Çekim Adresi (Ad Soyad)</h3>
                          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Banka hesabınızdaki ad" className="w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-medium outline-none border border-white/5 focus:border-[#10B981]/50 bg-[#131927]" />
                        </div>
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">IBAN</h3>
                          <input type="text" value={iban} onChange={e => setIban(e.target.value)} placeholder="TR..." className="w-full py-3.5 px-4 rounded-xl text-white text-[13px] font-medium outline-none border border-white/5 focus:border-[#10B981]/50 bg-[#131927]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AMOUNT INPUT */}
                  <div className="mt-2">
                    <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Tutar</h3>
                    <div className="relative flex items-center rounded-xl overflow-hidden bg-[#131927] border border-white/5 focus-within:border-[#10B981]/50 transition-colors">
                      <div className="pl-4 pr-2 flex items-center justify-center shrink-0">
                        <span className="text-[#10B981] font-black text-[16px]">₺</span>
                      </div>
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent py-3.5 px-2 text-white text-[16px] font-bold outline-none" />
                      <button onClick={() => setAmount('41750')} className="mr-3 bg-white/5 hover:bg-white/10 text-white/70 text-[10px] font-bold px-3 py-1.5 rounded-md transition-colors">
                        Maks.
                      </button>
                    </div>
                  </div>

                  {/* CTA BUTTON */}
                  <div className="pt-4 mt-auto">
                    <button 
                      onClick={handleSubmit} disabled={loading || !isFormValid()}
                      className="w-full rounded-xl text-white font-black text-[14px] py-4 transition-all hover:brightness-110 disabled:opacity-50 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                      style={{ background: '#10B981' }}
                    >
                      {loading ? 'İşleniyor...' : (activeTab === 'deposit' ? 'Para Yatır' : 'Çekim Yap')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
"""

with open('components/WalletModal.tsx', 'w') as f:
    f.write(new_code)
