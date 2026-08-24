import React, { useState, useEffect, useRef } from 'react';
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
        className="w-full py-2.5 px-3 rounded-lg text-white text-[13px] font-medium flex justify-between items-center cursor-pointer transition-all border border-white/10 hover:border-[#10B981]/50 bg-[#182030] hover:bg-[#1C263A]"
        
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

  const [ccNumber, setCcNumber] = useState('');
  const [ccName, setCcName] = useState('');
  const [ccExp, setCcExp] = useState('');
  const [ccCvv, setCcCvv] = useState('');


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
    if (activeTab === 'deposit') {
        if (selectedMethod?.type === 'creditcard') {
             return isAmountValid && ccNumber.length >= 16 && ccName.length > 3 && ccExp.length >= 4 && ccCvv.length >= 3;
        }
        return isAmountValid;
    }
    if (activeTab === 'withdraw') {
      if (selectedMethod?.type === 'banktransfer') return isAmountValid && fullName.length > 3 && iban.length > 15;
      if (selectedMethod?.type === 'crypto') return isAmountValid && cryptoAddress.length > 10;
      if (selectedMethod?.type === 'creditcard') return isAmountValid && ccNumber.length >= 16 && ccName.length > 3;
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
      <div onClick={e => e.stopPropagation()} className="relative w-full h-full sm:h-[720px] sm:max-w-[880px] flex flex-col sm:flex-row sm:rounded-[24px] overflow-hidden z-10 bg-[#151D2D] sm:shadow-[0_0_80px_rgba(0,0,0,0.8)] sm:border sm:border-white/5">
        
        {/* MOBILE HEADER (Hidden on Desktop) */}
        <div className="sm:hidden flex flex-col bg-[#101623] border-b border-white/5 px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-[18px] font-black tracking-tight">724<span className="text-[#3B82F6]">Bets</span></span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex bg-[#151D2D] p-1 rounded-xl w-full">
             {NAV_ITEMS.slice(0,3).map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${activeTab === item.id ? 'bg-[#22283A] text-white' : 'text-white/50'}`}>{item.label}</button>
             ))}
          </div>
        </div>

        {/* DESKTOP LEFT SIDEBAR */}
        <div className="hidden sm:flex w-[240px] bg-[#101623] flex-col border-r border-white/5 p-4 relative z-20">
          <div className="flex items-center gap-2 mb-8 px-4 mt-2">
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
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-[#151D2D] shadow-inner border border-white/5 relative' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-[#3B82F6] rounded-r-full shadow-[0_0_10px_#3B82F6]"></div>}
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#3B82F6]' : 'text-white/40 group-hover:text-white/70'}`} />
                  <span className={`text-[13px] font-bold tracking-wide ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto bg-[#151D2D] p-4 rounded-2xl border border-white/5">
             <p className="text-[10px] text-white/50 text-center mb-3 leading-relaxed">Süper güvenlik kalkanınız. Hesabınızı en üst düzeyde korumak için etkinleştirin.</p>
             <button className="w-full bg-[#10B981] hover:bg-[#059669] text-white text-[12px] font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <ShieldCheck strokeWidth={2.5} className="w-4 h-4" /> 2FA'YI ETKİNLEŞTİR
             </button>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col relative bg-[#151D2D]">
          
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

          <div className="sm:hidden p-4 shrink-0 flex justify-between items-center bg-[#151D2D]">
              <h2 className="text-white text-[16px] font-black">{NAV_ITEMS.find(i => i.id === activeTab)?.label || 'Cüzdan'}</h2>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Bakiye:</span>
                <span className="text-[#10B981] text-[13px] font-black">₺ 41.750</span>
              </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 custom-scrollbar relative">
            
            {success ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 bg-[#151D2D]">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-white text-[24px] font-bold mb-3">İşlem Başarılı</h3>
              </div>
            ) : activeTab === 'bonus' ? (
              <div className="h-full flex flex-col items-center animate-in fade-in pt-4 pb-10">
                 <Gift className="w-16 h-16 text-[#F59E0B] mb-4 opacity-90 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]" />
                 <h3 className="text-white text-[22px] font-black mb-2 text-center">Yatırım Bonusları</h3>
                 <p className="text-white/60 text-center text-[13px] max-w-sm mb-6">Bir sonraki para yatırma işleminizde ekstra değerin kilidini açın!</p>
                 
                 <div className="w-full flex flex-col gap-4 max-w-lg mx-auto">
                    {/* 100% HERO WELCOME BONUS (3D GLASS PREMIUM) */}
                    <div className="relative w-full rounded-2xl overflow-hidden group cursor-pointer border border-white/5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 mt-2 mb-4 hover:border-[#10B981]/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)]"
                         style={{ 
                             background: 'linear-gradient(145deg, #1A2436 0%, #101623 100%)',
                             boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.05), 0 15px 40px rgba(0,0,0,0.5)'
                         }}
                    >
                       {/* Vibrant Accent Glow (Top Left to Bottom Right) */}
                       <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#10B981]/10 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                       
                       <div className="relative p-5 sm:p-7 flex items-center justify-between z-10">
                          
                          <div className="relative z-20">
                             {/* Badge */}
                             <div className="inline-block px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] font-black tracking-widest uppercase mb-3 transition-colors group-hover:bg-[#10B981]/20">
                                YENİ ÜYELERE ÖZEL
                             </div>
                             
                             <h4 className="text-white text-[28px] sm:text-[36px] font-black italic drop-shadow-lg mb-1 leading-none tracking-tight">
                                %100 <span className="text-[#10B981]">HOŞ GELDİN</span>
                             </h4>
                             <p className="text-white/50 text-[12px] font-medium tracking-wide mt-2">İlk yatırımını anında ikiye katla, şansa başla.</p>
                          </div>
                          
                          {/* 3D Glowing Gift Box */}
                          <div className="flex-shrink-0 relative z-20 mr-2 sm:mr-4">
                             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-105 group-hover:-rotate-6 transition-all duration-500"
                                  style={{
                                      background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,78,59,0.4) 100%)',
                                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -4px 10px rgba(0,0,0,0.5)'
                                  }}
                             >
                                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-[#34D399] drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" strokeWidth={1.5} />
                                {/* Diagonal Glass Sheen */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                             </div>
                             {/* Soft drop shadow glow under the box */}
                             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#10B981]/40 blur-lg rounded-full"></div>
                          </div>
                       </div>
                    </div>

                    {/* OTHER BONUSES */}
                    <div className="grid grid-cols-3 gap-3 mt-2">
                        {['%30', '%50', '%70'].map(b => (
                           <div key={b} className="bg-[#131A26] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center hover:border-white/20 transition-all cursor-pointer group hover:bg-[#182030]">
                              <span className="text-[#34D399] text-[20px] font-black group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(52,211,153,0.2)] mb-1">{b}</span>
                              <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest text-center">Etkinleştir</span>
                           </div>
                        ))}
                    </div>
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
                
                {/* ULTRA PREMIUM PAYMENT CARDS */}
                <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
                  
                  {/* 1. BANKA HAVALESİ (Trust & Classic Premium) */}
                  <button
                    onClick={() => setSelectedMethod(DEPOSIT_METHODS[0])}
                    className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-500 overflow-hidden group ${
                      selectedMethod?.id === 'banktransfer' 
                        ? 'scale-100 sm:scale-105 z-20 shadow-[0_15px_30px_rgba(59,130,246,0.3)] ring-1 ring-[#3B82F6]/50' 
                        : 'scale-100 z-10 opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: selectedMethod?.id === 'banktransfer' 
                        ? 'radial-gradient(120% 120% at 50% -10%, #1e3a8a 0%, #090e1a 100%)' 
                        : 'linear-gradient(145deg, #131927 0%, #0d121c 100%)',
                      border: selectedMethod?.id === 'banktransfer' ? 'none' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: selectedMethod?.id === 'banktransfer' 
                        ? 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -4px 10px rgba(0,0,0,0.6)' 
                        : 'inset 0 1px 1px rgba(255,255,255,0.02)',
                      minHeight: '110px'
                    }}
                  >
                    {/* Glowing Grid Background Effect */}
                    {selectedMethod?.id === 'banktransfer' && (
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                    )}
                    
                    {selectedMethod?.id === 'banktransfer' && (
                      <div className="absolute top-2.5 right-2.5 z-30">
                        <CheckCircle2 className="w-4 h-4 text-[#60A5FA] drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                      </div>
                    )}
                    
                    <div className="text-center w-full relative z-20 mt-1">
                      <h3 className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors ${selectedMethod?.id === 'banktransfer' ? 'text-white drop-shadow-md' : 'text-white/70'}`}>
                        Banka Havalesi
                      </h3>
                    </div>
                    
                    <div className="h-[36px] w-full flex items-center justify-center my-2 relative z-20">
                      <div className="relative">
                        <Building2 className={`w-8 h-8 transition-all duration-500 ${selectedMethod?.id === 'banktransfer' ? 'text-[#93C5FD] drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-white/30'}`} strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    <div className="mt-auto w-full text-center relative z-20">
                      <div className={`text-[8px] font-black tracking-widest uppercase inline-block px-2 py-0.5 rounded-full border ${
                        selectedMethod?.id === 'banktransfer' 
                          ? 'border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#93C5FD]' 
                          : 'border-white/5 bg-white/5 text-white/30'
                      }`}>
                        7/24 Aktif
                      </div>
                    </div>
                  </button>

                  {/* 2. KRİPTO PARA (Web3 & Cyberpunk Neon) */}
                  <button
                    onClick={() => setSelectedMethod(DEPOSIT_METHODS[1])}
                    className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-500 overflow-hidden group ${
                      selectedMethod?.id === 'crypto' 
                        ? 'scale-100 sm:scale-105 z-20 shadow-[0_15px_30px_rgba(16,185,129,0.2)] ring-1 ring-[#10B981]/50' 
                        : 'scale-100 z-10 opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: selectedMethod?.id === 'crypto' 
                        ? 'radial-gradient(130% 130% at 50% 100%, #064e3b 0%, #090e1a 100%)' 
                        : 'linear-gradient(145deg, #131927 0%, #0d121c 100%)',
                      border: selectedMethod?.id === 'crypto' ? 'none' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: selectedMethod?.id === 'crypto' 
                        ? 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -4px 10px rgba(0,0,0,0.6)' 
                        : 'inset 0 1px 1px rgba(255,255,255,0.02)',
                      minHeight: '110px'
                    }}
                  >
                    {/* Hexagon/Tech Pattern Effect */}
                    {selectedMethod?.id === 'crypto' && (
                      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
                    )}

                    {selectedMethod?.id === 'crypto' && (
                      <div className="absolute top-2.5 right-2.5 z-30">
                        <CheckCircle2 className="w-4 h-4 text-[#34D399] drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      </div>
                    )}
                    
                    <div className="text-center w-full relative z-20 mt-1">
                      <h3 className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors ${selectedMethod?.id === 'crypto' ? 'text-white drop-shadow-md' : 'text-white/70'}`}>
                        Kripto Para
                      </h3>
                    </div>
                    
                    <div className="h-[36px] w-full flex items-center justify-center my-2 relative z-20">
                      <div className="flex items-center">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 relative z-10 translate-x-3 ${selectedMethod?.id === 'crypto' ? 'border-[#34D399]/50 bg-gradient-to-br from-[#10B981] to-[#047857] shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-white/10 bg-[#1A2436] grayscale opacity-50'}`}>
                          <span className="text-white text-[10px] font-bold">₮</span>
                        </div>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 relative z-20 ${selectedMethod?.id === 'crypto' ? 'border-[#FCD34D]/50 bg-gradient-to-br from-[#F59E0B] to-[#B45309] shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-110' : 'border-white/10 bg-[#1A2436] grayscale opacity-50'}`}>
                          <span className="text-white text-[14px] font-bold">₿</span>
                        </div>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-500 relative z-0 -translate-x-3 ${selectedMethod?.id === 'crypto' ? 'border-[#94A3B8]/50 bg-gradient-to-br from-[#64748B] to-[#334155] shadow-[0_0_15px_rgba(100,116,139,0.5)]' : 'border-white/10 bg-[#1A2436] grayscale opacity-50'}`}>
                          <span className="text-white text-[10px] font-bold">Ξ</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto w-full text-center relative z-20">
                      <div className={`text-[8px] font-black tracking-widest uppercase inline-block px-2 py-0.5 rounded-full border ${
                        selectedMethod?.id === 'crypto' 
                          ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#6EE7B7]' 
                          : 'border-white/5 bg-white/5 text-white/30'
                      }`}>
                        Anında
                      </div>
                    </div>
                  </button>

                  {/* 3. KREDİ KARTI (Physical Titanium Card) */}
                  <button
                    onClick={() => setSelectedMethod(DEPOSIT_METHODS[2])}
                    className={`relative flex flex-col items-center justify-between p-3 sm:p-4 rounded-2xl transition-all duration-500 overflow-hidden group ${
                      selectedMethod?.id === 'creditcard' 
                        ? 'scale-100 sm:scale-105 z-20 shadow-[0_15px_30px_rgba(139,92,246,0.2)] ring-1 ring-[#8B5CF6]/50' 
                        : 'scale-100 z-10 opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      background: selectedMethod?.id === 'creditcard' 
                        ? 'linear-gradient(135deg, #2e1065 0%, #0f0728 50%, #1e1b4b 100%)' 
                        : 'linear-gradient(145deg, #131927 0%, #0d121c 100%)',
                      border: selectedMethod?.id === 'creditcard' ? 'none' : '1px solid rgba(255,255,255,0.03)',
                      boxShadow: selectedMethod?.id === 'creditcard' 
                        ? 'inset 0 2px 4px rgba(255,255,255,0.2), inset -2px -2px 10px rgba(0,0,0,0.8), inset 2px 0 10px rgba(139,92,246,0.3)' 
                        : 'inset 0 1px 1px rgba(255,255,255,0.02)',
                      minHeight: '110px'
                    }}
                  >
                    {/* Metal Sheen Effect */}
                    {selectedMethod?.id === 'creditcard' && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    )}

                    {selectedMethod?.id === 'creditcard' && (
                      <div className="absolute top-2.5 right-2.5 z-30">
                        <CheckCircle2 className="w-4 h-4 text-[#A78BFA] drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                      </div>
                    )}
                    
                    <div className="text-center w-full relative z-20 mt-1">
                      <h3 className={`text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-colors ${selectedMethod?.id === 'creditcard' ? 'text-white drop-shadow-md' : 'text-white/70'}`}>
                        Kredi Kartı
                      </h3>
                    </div>
                    
                    <div className="h-[36px] w-full flex flex-col items-center justify-center my-2 relative z-20">
                       {/* EMV Chip Simulation */}
                       {selectedMethod?.id === 'creditcard' && (
                         <div className="w-6 h-4 mb-2 rounded-sm bg-gradient-to-br from-[#FCD34D] to-[#B45309] opacity-80 border border-[#FDE68A]/30 flex flex-col justify-evenly px-0.5 overflow-hidden">
                            <div className="w-full h-[1px] bg-black/20"></div>
                            <div className="w-full h-[1px] bg-black/20"></div>
                         </div>
                       )}
                       <div className="relative">
                          {selectedMethod?.id === 'creditcard' && <div className="absolute inset-0 bg-white/20 blur-md rounded-full"></div>}
                          <span className={`relative font-black italic text-[18px] transition-all duration-500 ${selectedMethod?.id === 'creditcard' ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]' : 'text-white/30'}`}>VISA</span>
                       </div>
                    </div>
                    
                    <div className="mt-auto w-full text-center relative z-20">
                      <div className={`text-[8px] font-black tracking-widest uppercase inline-block px-2 py-0.5 rounded-full border ${
                        selectedMethod?.id === 'creditcard' 
                          ? 'border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C4B5FD]' 
                          : 'border-white/5 bg-white/5 text-white/30'
                      }`}>
                        3D Güvenli
                      </div>
                    </div>
                  </button>

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
                    <div className="space-y-3 animate-in fade-in">
                      <CustomSelect label="Banka Seçin" options={BANK_OPTIONS} value={bank} onChange={setBank} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Çekim Adresi (Ad Soyad)</h3>
                          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Banka hesabınızdaki ad" className="w-full py-2.5 px-3 rounded-lg text-white text-[13px] font-medium outline-none border border-white/10 focus:border-[#10B981]/50 bg-[#182030] transition-all hover:bg-[#1C263A]" />
                        </div>
                        <div>
                          <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">IBAN</h3>
                          <input type="text" value={iban} onChange={e => setIban(e.target.value)} placeholder="TR..." className="w-full py-2.5 px-3 rounded-lg text-white text-[13px] font-medium outline-none border border-white/10 focus:border-[#10B981]/50 bg-[#182030] transition-all hover:bg-[#1C263A]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'withdraw' && selectedMethod?.type === 'crypto' && (
                    <div className="space-y-3 animate-in fade-in">
                      <CustomSelect label="Kripto Ağı Seçin" options={CRYPTO_NETWORKS} value={depositCryptoNetwork} onChange={setDepositCryptoNetwork} />
                      <div>
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Cüzdan Adresi</h3>
                        <input type="text" value={cryptoAddress} onChange={e => setCryptoAddress(e.target.value)} placeholder="Örn: T9yD1P..." className="w-full py-2.5 px-3 rounded-lg text-white text-[13px] font-mono outline-none border border-white/10 focus:border-[#10B981]/50 bg-[#182030] transition-all hover:bg-[#1C263A]" />
                      </div>
                    </div>
                  )}

                  {/* CREDIT CARD FORM (Deposit) - ULTRA PREMIUM STRIPE STYLE */}
                  {activeTab === 'deposit' && selectedMethod?.type === 'creditcard' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-2 uppercase flex items-center gap-2">
                         <Lock className="w-3 h-3 text-[#10B981]" /> Güvenli Ödeme Bilgileri
                      </h3>
                      
                      <div className="rounded-xl border border-white/10 bg-[#131A26] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] focus-within:ring-1 focus-within:ring-[#8B5CF6]/50 transition-all">
                        {/* Name on Card */}
                        <div className="border-b border-white/5 relative group">
                          <input type="text" value={ccName} onChange={e => setCcName(e.target.value.toUpperCase())} placeholder="KART ÜZERİNDEKİ İSİM" className="w-full bg-transparent py-3 px-4 text-white text-[13px] font-medium outline-none placeholder:text-white/30 group-hover:bg-white/[0.02] transition-colors" />
                        </div>
                        
                        {/* Card Number */}
                        <div className="border-b border-white/5 relative group">
                          <input type="text" maxLength={19} value={ccNumber} onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                            setCcNumber(val);
                          }} placeholder="KART NUMARASI (0000 0000 0000 0000)" className="w-full bg-transparent py-3 px-4 text-white text-[14px] font-mono tracking-widest outline-none placeholder:text-white/30 group-hover:bg-white/[0.02] transition-colors" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-50">
                             <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
                             <div className="w-6 h-4 bg-white/10 rounded-sm"></div>
                          </div>
                        </div>
                        
                        {/* Expiry & CVC */}
                        <div className="flex w-full">
                          <div className="w-1/2 border-r border-white/5 relative group">
                            <input type="text" maxLength={5} value={ccExp} onChange={e => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length > 2) val = val.substring(0,2) + '/' + val.substring(2,4);
                              setCcExp(val);
                            }} placeholder="SKT (AA/YY)" className="w-full bg-transparent py-3 px-4 text-white text-[14px] font-mono tracking-widest outline-none placeholder:text-white/30 group-hover:bg-white/[0.02] transition-colors" />
                          </div>
                          <div className="w-1/2 relative group">
                            <input type="password" maxLength={4} value={ccCvv} onChange={e => setCcCvv(e.target.value.replace(/\D/g, ''))} placeholder="CVC (***)" className="w-full bg-transparent py-3 px-4 text-white text-[14px] font-mono tracking-widest outline-none placeholder:text-white/30 group-hover:bg-white/[0.02] transition-colors" />
                            <AlertCircle className="w-3.5 h-3.5 text-white/20 absolute right-4 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CREDIT CARD FORM (Withdraw) */}
                  {activeTab === 'withdraw' && selectedMethod?.type === 'creditcard' && (
                    <div className="space-y-3 animate-in fade-in">
                      <div>
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Kart Sahibi (Ad Soyad)</h3>
                        <input type="text" value={ccName} onChange={e => setCcName(e.target.value.toUpperCase())} placeholder="Banka kartınızdaki isim" className="w-full py-2.5 px-3 rounded-lg text-white text-[13px] font-medium outline-none border border-white/10 focus:border-[#8B5CF6]/50 bg-[#182030] placeholder:text-white/30 transition-all hover:bg-[#1C263A]" />
                      </div>
                      <div>
                        <h3 className="text-white/50 text-[10px] font-bold tracking-widest mb-1.5 uppercase">Çekim Yapılacak Kart Numarası</h3>
                        <input type="text" maxLength={19} value={ccNumber} onChange={e => {
                          const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                          setCcNumber(val);
                        }} placeholder="0000 0000 0000 0000" className="w-full py-2.5 px-3 rounded-lg text-white text-[14px] font-mono outline-none border border-white/10 focus:border-[#8B5CF6]/50 bg-[#182030] tracking-widest placeholder:text-white/30 transition-all hover:bg-[#1C263A]" />
                      </div>
                    </div>
                  )}

                  {/* AMOUNT & QUICK AMOUNTS */}
                  <div className="mt-3 bg-[#1A2436] p-3 rounded-xl border border-white/5 shadow-inner">
                    <div className="flex justify-between items-end mb-2">
                       <h3 className="text-white/60 text-[11px] font-bold tracking-widest uppercase">Tutar Belirleyin</h3>
                    </div>
                    
                    <div className="relative flex items-center rounded-xl overflow-hidden bg-[#101623] border border-white/10 focus-within:border-[#10B981]/50 transition-colors mb-3">
                      <div className="pl-4 pr-2 flex items-center justify-center shrink-0">
                        <span className="text-[#10B981] font-black text-[18px]">₺</span>
                      </div>
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent py-2.5 px-2 text-white text-[18px] font-black outline-none" />
                      <button onClick={() => setAmount('41750')} className="mr-2 bg-[#1F2A3F] hover:bg-[#2A3752] text-white/80 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/5">
                        Maks.
                      </button>
                    </div>

                    {/* Quick Amounts */}
                    {activeTab === 'deposit' && (
                      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                        {[250, 500, 1000, 2500, 5000, 10000, 25000, 50000].map(val => (
                          <button
                            key={val}
                            onClick={() => setAmount(val.toString())}
                            className="py-1.5 rounded-md text-[11px] font-bold transition-all text-white/50 hover:text-white hover:bg-[#1F2A3F] bg-[#151D2D] border border-white/5"
                          >
                            +{val >= 1000 ? (val/1000).toFixed(0) + 'k' : val}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA BUTTON */}
                  <div className="mt-4">
                    <button 
                      onClick={handleSubmit} disabled={loading || !isFormValid()}
                      className="w-full rounded-xl text-white font-black text-[15px] tracking-wide py-3.5 transition-all hover:bg-[#0EA5E9] disabled:opacity-50 shadow-[0_5px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_5px_25px_rgba(14,165,233,0.4)]"
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
