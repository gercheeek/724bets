import os

new_code = """import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, CheckCircle2, Building2, Lock, Zap, Clock, History, AlertCircle, ChevronDown } from 'lucide-react';

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
  { id: 'TX-99279', type: 'deposit', method: 'Kredi Kartı', amount: '500.00', status: 'completed', date: '20 Ağu 2026', time: '18:45' },
  { id: 'TX-99278', type: 'deposit', method: 'Kripto Para', amount: '1,000.00', status: 'failed', date: '19 Ağu 2026', time: '22:10' },
  { id: 'TX-99277', type: 'withdraw', method: 'Kripto Para', amount: '5,000.00', status: 'completed', date: '18 Ağu 2026', time: '11:20' }
];

// Elite CustomSelect Component
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
      <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1 uppercase">{label}</h3>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 px-4 rounded-xl text-white text-[14px] font-medium flex justify-between items-center cursor-pointer transition-all hover:ring-1 hover:ring-white/10"
        style={{ 
          background: 'rgba(0,0,0,0.4)', 
          boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <span>{value}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-50 max-h-56 overflow-y-auto py-2 custom-scrollbar backdrop-blur-xl" style={{ background: "rgba(20,25,35,0.95)" }}>
          {options.map(opt => (
            <div 
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`px-4 py-3 text-[13px] font-medium cursor-pointer transition-colors flex items-center justify-between ${
                value === opt ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span>{opt}</span>
              {value === opt && <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WalletModal = ({ isOpen, onClose, initialTab = 'deposit' }: { isOpen: boolean, onClose: () => void, initialTab?: string }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedMethod, setSelectedMethod] = useState(DEPOSIT_METHODS[0]);
  
  const [amount, setAmount] = useState('100');
  
  // Withdraw States
  const [bank, setBank] = useState(BANK_OPTIONS[0]);
  const [fullName, setFullName] = useState('');
  const [iban, setIban] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  
  // Crypto Deposit States
  const [depositCryptoCoin, setDepositCryptoCoin] = useState(CRYPTO_COINS[0]);
  const [depositCryptoNetwork, setDepositCryptoNetwork] = useState(CRYPTO_NETWORKS[0]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSuccess(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
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

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 sm:p-6 transition-all animate-in fade-in duration-200 font-sans" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[680px] h-[90vh] sm:h-[760px] flex flex-col rounded-[24px] overflow-hidden z-10 bg-[#0F1423] shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/5"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-5 border-b border-white/5 shrink-0 bg-[#0F1423] relative z-20">
          <div className="flex items-center gap-3">
            <span className="text-white text-[20px] font-black tracking-tight">724<span className="text-[#3B82F6]">Bets</span></span>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <span className="text-white/50 text-[12px] font-bold tracking-widest uppercase">FİNANS</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-white/40 text-[9px] font-black tracking-widest uppercase mb-0.5">Kullanılabilir Bakiye</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#3B82F6]/20 flex items-center justify-center">
                  <span className="text-[#3B82F6] font-bold text-[10px]">₺</span>
                </div>
                <span className="text-white text-[16px] font-bold tracking-wide">41.750,00</span>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 min-h-0 p-5 sm:px-8 sm:py-6 flex flex-col relative z-10 overflow-y-auto custom-scrollbar">
          
          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-white text-[24px] font-bold mb-3">İşlem Başarılı</h3>
              <p className="text-white/60 text-center max-w-xs text-[14px]">
                {activeTab === 'deposit' 
                  ? 'Güvenli ödeme sayfasına yönlendiriliyorsunuz.'
                  : 'Çekim talebiniz işleme alınmıştır.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full w-full max-w-full">
              
              {/* TABS */}
              <div className="flex bg-[#161B29] p-1.5 rounded-xl mb-4 shrink-0 border border-white/5 shadow-inner">
                {['deposit', 'withdraw', 'history'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 rounded-lg text-[12px] font-bold tracking-wide transition-all ${
                      activeTab === tab 
                        ? 'bg-[#22283A] text-white shadow-md' 
                        : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                    }`}
                  >
                    {tab === 'deposit' ? 'Para Yatır' : tab === 'withdraw' ? 'Para Çek' : 'Geçmiş'}
                  </button>
                ))}
              </div>

              {activeTab === 'history' ? (
                <div className="flex-1 flex flex-col animate-in fade-in duration-300 h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <History className="w-4 h-4 text-[#3B82F6]" />
                    <h3 className="text-white/70 text-[11px] font-bold tracking-widest uppercase">Son İşlemler</h3>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                    {MOCK_HISTORY.map(tx => (
                      <div key={tx.id} className="bg-[#1A1F2E] p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {tx.type === 'deposit' ? <span className="text-[14px] font-black">+</span> : <span className="text-[14px] font-black">-</span>}
                          </div>
                          <div>
                            <div className="text-white font-bold text-[14px] mb-0.5">{tx.method}</div>
                            <div className="flex items-center gap-2 text-white/50 text-[11px] font-medium">
                              <span>{tx.date}</span>
                              <span className="w-1 h-1 rounded-full bg-white/20"></span>
                              <span>{tx.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-black text-[15px] mb-1 ${tx.type === 'deposit' ? 'text-green-500' : 'text-white'}`}>
                            {tx.type === 'deposit' ? '+' : '-'}₺{tx.amount}
                          </div>
                          <div className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full inline-block ${
                            tx.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                            tx.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {tx.status === 'completed' ? 'Tamamlandı' : tx.status === 'pending' ? 'Bekliyor' : 'İptal'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full animate-in fade-in duration-300">
                  
                  {/* PAYMENT METHOD CARDS (Elite Refactor) */}
                  <h3 className="text-white/50 text-[10px] font-bold tracking-widest uppercase mb-3 shrink-0">Ödeme Yöntemi</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 mb-4">
                    {DEPOSIT_METHODS.map((method) => {
                      const isSelected = selectedMethod?.id === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method)}
                          className={`relative flex flex-col items-center justify-between p-4 rounded-[16px] transition-all duration-500 w-full group overflow-hidden ${
                            isSelected 
                              ? 'scale-100 sm:scale-[1.03] z-20 shadow-[0_20px_40px_rgba(0,0,0,0.8)]' 
                              : 'scale-100 hover:scale-[1.02] z-10 opacity-70 hover:opacity-100 shadow-[0_10px_20px_rgba(0,0,0,0.4)]'
                          }`}
                          style={{
                            background: isSelected ? `linear-gradient(145deg, ${method.theme.bg} 0%, #0d111a 100%)` : '#10141d',
                            borderColor: isSelected ? method.theme.color + '80' : 'rgba(255,255,255,0.05)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            boxShadow: isSelected 
                              ? `inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.5), 0 15px 35px ${method.theme.color}30` 
                              : 'inset 0 1px 1px rgba(255,255,255,0.02), inset 0 -1px 1px rgba(0,0,0,0.4)',
                            minHeight: '140px'
                          }}
                        >
                          {isSelected && (
                            <div className="absolute top-3 right-3 animate-in zoom-in duration-300">
                              <CheckCircle2 className="w-5 h-5" style={{ color: method.theme.color, filter: `drop-shadow(0 0 8px ${method.theme.color})` }} />
                            </div>
                          )}
                          <div className="text-center w-full mt-1">
                            <h3 className={`text-[12px] sm:text-[13px] font-black tracking-widest uppercase transition-colors ${isSelected ? 'text-white' : 'text-white/90'}`}>{method.name}</h3>
                            <p className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase mt-1 transition-colors ${isSelected ? 'text-white/70' : 'text-white/60 group-hover:text-white/80'}`}>{method.desc}</p>
                          </div>
                          <div className="h-[50px] w-full flex items-center justify-center my-3 relative z-10">
                            {method.id === 'banktransfer' && (
                              <div className="relative">
                                <Building2 className={`w-8 h-8 transition-colors ${isSelected ? 'text-white' : 'text-white/60'}`} strokeWidth={1.5} />
                                {isSelected && <div className="absolute inset-0 blur-xl opacity-50" style={{ background: method.theme.color }}></div>}
                              </div>
                            )}
                            {method.id === 'crypto' && (
                              <div className="flex items-center justify-center">
                                <div className="relative flex items-center justify-center">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#86EFAC]/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-10 translate-x-2.5 bg-gradient-to-br from-[#BBF7D0] to-[#059669]"><span className="text-white text-[10px] font-bold">₮</span></div>
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#FDE047]/50 shadow-[0_10px_20px_rgba(0,0,0,0.9)] relative z-20 bg-gradient-to-br from-[#FEF08A] to-[#D97706]"><span className="text-white text-[14px] font-bold">₿</span></div>
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#E2E8F0]/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)] relative z-0 -translate-x-2.5 bg-gradient-to-br from-[#F8FAFC] to-[#94A3B8]"><span className="text-white text-[10px] font-bold">Ξ</span></div>
                                </div>
                              </div>
                            )}
                            {method.id === 'creditcard' && (
                              <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center gap-3">
                                  <span className="font-black italic text-white text-[16px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">VISA</span>
                                  <div className="flex -space-x-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"><div className="w-4 h-4 rounded-full bg-[#EF4444] mix-blend-screen opacity-90"></div><div className="w-4 h-4 rounded-full bg-[#F59E0B] mix-blend-screen opacity-90"></div></div>
                                </div>
                                <div className="text-white/50 font-mono text-[9px] tracking-[0.2em] mt-1.5 font-bold">**** 7890</div>
                              </div>
                            )}
                          </div>
                          <div className="mt-auto pt-2 border-t border-white/5 w-full">
                            <span className={`block text-center text-[9px] font-black tracking-widest uppercase ${isSelected ? 'text-white/90' : 'text-white/50 group-hover:text-white/70'}`}>{method.badge}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* DYNAMIC FORMS & ALERTS */}
                  <div className="flex flex-col flex-1 shrink-0 space-y-4">
                    {/* Security Alert (Deposit only) */}
                    {activeTab === 'deposit' && (
                      <div className="p-3 rounded-xl flex gap-4 items-center shrink-0" style={{ backgroundColor: `${selectedMethod?.theme?.color}10`, border: `1px solid ${selectedMethod?.theme?.color}20` }}>
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: selectedMethod?.theme?.color, boxShadow: `0 0 20px ${selectedMethod?.theme?.color}40, inset 0 1px 1px rgba(255,255,255,0.3)` }}>
                          <ShieldCheck strokeWidth={2.5} className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white text-[14px] font-bold mb-0.5">{selectedMethod.name} İle Güvenli Ödeme</h4>
                          <p className="text-white/60 text-[11px] font-medium">256-bit SSL sertifikalı güvenli ödeme geçidine yönlendirileceksiniz.</p>
                        </div>
                      </div>
                    )}

                    {/* Crypto Deposit Options */}
                    {activeTab === 'deposit' && selectedMethod?.type === 'crypto' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
                        <CustomSelect label="Kripto Para Birimi" options={CRYPTO_COINS} value={depositCryptoCoin} onChange={setDepositCryptoCoin} />
                        {depositCryptoCoin === 'Tether (USDT)' && (
                          <CustomSelect label="Ağ (Network)" options={CRYPTO_NETWORKS} value={depositCryptoNetwork} onChange={setDepositCryptoNetwork} />
                        )}
                      </div>
                    )}

                    {/* Withdraw Forms */}
                    {activeTab === 'withdraw' && selectedMethod?.type === 'banktransfer' && (
                      <div className="space-y-3 shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
                        <CustomSelect label="Banka Seçin" options={BANK_OPTIONS} value={bank} onChange={setBank} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1 uppercase">Ad Soyad</h3>
                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Banka hesabınızdaki ad" className="w-full py-3 px-4 rounded-xl text-white text-[14px] font-medium outline-none transition-all focus:ring-1 focus:ring-white/10" style={{ background: 'rgba(0,0,0,0.4)', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }} />
                          </div>
                          <div>
                            <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1 uppercase">IBAN</h3>
                            <input type="text" value={iban} onChange={e => setIban(e.target.value)} placeholder="TR..." className="w-full py-3 px-4 rounded-xl text-white text-[14px] font-medium outline-none transition-all focus:ring-1 focus:ring-white/10" style={{ background: 'rgba(0,0,0,0.4)', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'withdraw' && selectedMethod?.type === 'crypto' && (
                      <div className="space-y-3 shrink-0 animate-in fade-in slide-in-from-top-2 duration-300">
                        <CustomSelect label="Kripto Ağı Seçin" options={CRYPTO_NETWORKS} value={depositCryptoNetwork} onChange={setDepositCryptoNetwork} />
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1 uppercase">Cüzdan Adresi</h3>
                          <input type="text" value={cryptoAddress} onChange={e => setCryptoAddress(e.target.value)} placeholder="Örn: T9yD1P..." className="w-full py-3 px-4 rounded-xl text-white text-[14px] font-mono outline-none transition-all focus:ring-1 focus:ring-white/10" style={{ background: 'rgba(0,0,0,0.4)', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }} />
                        </div>
                      </div>
                    )}

                    {/* AMOUNT SECTION (Premium 3D Glass) */}
                    <div className="shrink-0 mt-auto">
                      <div className="flex justify-between items-end mb-1.5">
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest uppercase">İşlem Tutarı</h3>
                      </div>
                      <div className="relative flex items-center rounded-xl overflow-hidden transition-all focus-within:ring-1" style={{ background: 'rgba(0,0,0,0.4)', boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.8), inset -1px -1px 2px rgba(255,255,255,0.05)', borderColor: selectedMethod?.theme?.color + '50', borderWidth: '1px', borderStyle: 'solid' }}>
                        <div className="pl-4 flex items-center justify-center shrink-0">
                          <span className="text-lg font-black" style={{ color: selectedMethod?.theme?.color, textShadow: `0 0 10px ${selectedMethod?.theme?.color}80` }}>₺</span>
                        </div>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent py-3 px-3 text-white text-[22px] font-black outline-none placeholder-white/10 tracking-wider" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.8)' }} />
                      </div>
                      
                      {/* Quick Amounts */}
                      {activeTab === 'deposit' && (
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                          {[250, 500, 1000, 2500, 5000, 10000].map(val => (
                            <button
                              key={val}
                              onClick={() => setAmount(val.toString())}
                              className="py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all text-white/70 hover:text-white hover:scale-105 active:scale-95"
                              style={{
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                                boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.3)',
                                border: '1px solid rgba(255,255,255,0.03)'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = selectedMethod?.theme?.color + '50'; e.currentTarget.style.boxShadow = `0 0 10px ${selectedMethod?.theme?.color}30, inset 1px 1px 0 rgba(255,255,255,0.1)`; e.currentTarget.style.color = '#ffffff'; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.boxShadow = 'inset 1px 1px 0 rgba(255,255,255,0.05), inset -1px -1px 0 rgba(0,0,0,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                            >
                              +{val >= 1000 ? (val/1000).toFixed(3) : val}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* SOLID CTA BUTTON */}
                    <div className="shrink-0 pt-2 pb-1">
                      <button 
                        onClick={handleSubmit} 
                        disabled={loading || !isFormValid()}
                        className="w-full rounded-xl text-white font-black text-[15px] py-4 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 flex items-center justify-center gap-2"
                        style={{ 
                          background: `linear-gradient(135deg, ${selectedMethod?.theme?.color}, ${selectedMethod?.theme?.color}dd)`, 
                          boxShadow: `0 10px 25px ${selectedMethod?.theme?.color}50, inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px -1px 2px rgba(0,0,0,0.2)` 
                        }}
                      >
                        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                          {loading ? 'İşleniyor...' : (activeTab === 'deposit' ? 'İşlemi Onayla' : 'Talebi Gönder')}
                        </span>
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══ BOTTOM FOOTER (Security & Partners) ═══ */}
        <div className="w-full bg-[#121722] border-t border-white/5 px-5 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 relative z-20">
           <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide w-full sm:w-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="flex items-center gap-2 shrink-0">
                <ShieldCheck strokeWidth={2.5} className="w-4 h-4 text-white/30" />
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Güvenli Altyapı</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Zap strokeWidth={2.5} className="w-4 h-4 text-white/30" />
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Otonom Transfer</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Lock strokeWidth={2.5} className="w-4 h-4 text-white/30" />
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">256-bit Şifreleme</span>
              </div>
           </div>
           <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Partner</span>
              <img src="/neopays-logo.png" alt="NeoPAYS" className="h-3 object-contain filter invert opacity-30 hover:opacity-100 transition-opacity" />
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
