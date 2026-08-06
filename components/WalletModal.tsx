import React, { useState, useEffect } from 'react';
import { X, Copy, AlertCircle, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WalletModalProps {
  onClose: () => void;
  initialTab?: 'deposit' | 'withdraw';
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'Kripto' | 'fiat'>('Kripto');
  const [selectedCoin, setSelectedCoin] = useState<'ETH' | 'BTC' | 'USDT' | 'USDC'>('ETH');
  
  const [adminAddresses, setAdminAddresses] = useState<Record<string, string>>({
    'ETH': '0xB1F5D5436dDbCCD4F28D6bf9e1ACe970Dc349D66',
    'BTC': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    'USDT': 'TXLAQ63Xg1N4vef5K6Uq9M4Jb3V2o3o5X7',
    'USDC': '0xUSDC...9D66'
  });

  useEffect(() => {
    // Load custom addresses from localStorage if set by admin
    const stored = localStorage.getItem('admin_wallet_addresses');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAdminAddresses(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Error parsing admin wallet addresses", e);
      }
    }
  }, []);

  const coinDetails = {
    'ETH': { name: 'ETH', network: 'Ethereum (ERC20)', min: '0.0002 ETH', color: '#627EEA' },
    'BTC': { name: 'BTC', network: 'Bitcoin', min: '0.0001 BTC', color: '#F7931A' },
    'USDT': { name: 'USDT', network: 'Tron (TRC20)', min: '1 USDT', color: '#26A17B' },
    'USDC': { name: 'USDC', network: 'Ethereum (ERC20)', min: '1 USDC', color: '#2775CA' }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  // Icons
  const EthIcon = () => (
    <div className="w-5 h-5 rounded-full bg-[#627EEA] flex items-center justify-center text-white text-[10px] font-bold">Ξ</div>
  );
  const BtcIcon = () => (
    <div className="w-5 h-5 rounded-full bg-[#F7931A] flex items-center justify-center text-white text-[10px] font-bold">₿</div>
  );
  const UsdtIcon = () => (
    <div className="w-5 h-5 rounded-full bg-[#26A17B] flex items-center justify-center text-white text-[10px] font-bold">₮</div>
  );
  const UsdcIcon = () => (
    <div className="w-5 h-5 rounded-full bg-[#2775CA] flex items-center justify-center text-white text-[10px] font-bold">$</div>
  );

  const getActiveIcon = () => {
    switch (selectedCoin) {
      case 'ETH': return <EthIcon />;
      case 'BTC': return <BtcIcon />;
      case 'USDT': return <UsdtIcon />;
      case 'USDC': return <UsdcIcon />;
      default: return <EthIcon />;
    }
  };

  const formatAddress = (address: string) => {
    if (address.length < 10) return <span>{address}</span>;
    const start = address.substring(0, 4);
    const middle = address.substring(4, address.length - 4);
    const end = address.substring(address.length - 4);
    return (
      <>
        <span className="text-[#00E5FF]">{start}</span>
        <span className="text-white">{middle}</span>
        <span className="text-[#00E5FF]">{end}</span>
      </>
    );
  };

  const activeAddress = adminAddresses[selectedCoin] || coinDetails[selectedCoin].network;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" style={{ zIndex: 999999 }} onClick={onClose}>
      <div 
        className="w-full max-w-[480px] bg-[#0A0C10] border border-white/5 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] relative flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center py-5 border-b border-white/5 bg-[#0A0C10]">
          <h2 className="text-white font-black text-lg tracking-wide">Depozito</h2>
          <button 
            onClick={onClose}
            className="absolute right-4 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-[#0A0C10]">
          <button 
            onClick={() => setActiveTab('Kripto')}
            className={`flex-1 py-3.5 text-center font-bold text-[13px] uppercase tracking-wider transition-all border-b-[3px] ${
              activeTab === 'Kripto' ? 'text-white border-[#00E676] bg-[#00E5FF]/5' : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Kripto
          </button>
          <button 
            onClick={() => setActiveTab('fiat')}
            className={`flex-1 py-3.5 text-center font-bold text-[13px] uppercase tracking-wider transition-all border-b-[3px] ${
              activeTab === 'fiat' ? 'text-white border-[#00E676] bg-[#00E5FF]/5' : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            fiat
          </button>
        </div>

        {/* Content */}
        <div className="p-5 bg-[#0A0C10] flex-1">
          {activeTab === 'Kripto' ? (
            <div className="bg-[#0A0C10] rounded-xl p-5 border border-white/5 shadow-inner">
              
              {/* Coin Quick Select */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide mb-3 pb-2">
                <button onClick={() => setSelectedCoin('ETH')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${selectedCoin === 'ETH' ? 'border-[#00E676] bg-[#00E5FF]/10 text-[#00E5FF]' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'}`}>
                  <EthIcon /> <span className="text-sm font-semibold">ETH</span>
                </button>
                <button onClick={() => setSelectedCoin('BTC')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${selectedCoin === 'BTC' ? 'border-[#00E676] bg-[#00E5FF]/10 text-[#00E5FF]' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'}`}>
                  <BtcIcon /> <span className="text-sm font-semibold">BTC</span>
                </button>
                <button onClick={() => setSelectedCoin('USDT')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${selectedCoin === 'USDT' ? 'border-[#00E676] bg-[#00E5FF]/10 text-[#00E5FF]' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'}`}>
                  <UsdtIcon /> <span className="text-sm font-semibold">USDT</span>
                </button>
                <button onClick={() => setSelectedCoin('USDC')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${selectedCoin === 'USDC' ? 'border-[#00E676] bg-[#00E5FF]/10 text-[#00E5FF]' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'}`}>
                  <UsdcIcon /> <span className="text-sm font-semibold">USDC</span>
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/5 shrink-0">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 z-20 border border-[#0A0D14]"></div>
                    <div className="w-4 h-4 rounded-full bg-blue-500 z-10 border border-[#0A0D14]"></div>
                    <div className="w-4 h-4 rounded-full bg-purple-500 z-0 border border-[#0A0D14]"></div>
                  </div>
                  <span className="text-sm font-semibold text-zinc-400">Daha fazla {'>'}</span>
                </button>
              </div>

              <div className="text-[12px] text-zinc-500 mb-6 font-medium">
                Para biriminizi göremiyor musunuz? <span className="text-[#00E5FF] cursor-pointer hover:underline">Buraya ekleyin</span>
              </div>

              {/* Selectors */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">Para Birimi</label>
                  <div className="flex items-center justify-between bg-[#0A0C10] border border-white/5 rounded-lg p-3 cursor-pointer hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      {getActiveIcon()}
                      <span className="text-white font-bold text-[13px]">{coinDetails[selectedCoin].name}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">Ağ</label>
                  <div className="flex items-center justify-between bg-[#0A0C10] border border-white/5 rounded-lg p-3 cursor-pointer hover:border-white/10 transition-colors">
                    <span className="text-white font-bold text-[13px] truncate">{coinDetails[selectedCoin].network}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-3 rounded-xl relative shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  {/* Fake QR for demo */}
                  <div className="w-36 h-36 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=example&color=000000&bgcolor=ffffff')] bg-contain"></div>
                  {/* Center Logo in QR */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow-lg border border-gray-100">
                    {getActiveIcon()}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-5">
                <label className="block text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-1.5">Para yatırma adresi</label>
                <div className="flex items-center justify-between bg-[#0A0C10] border border-white/5 rounded-lg p-3">
                  <div className="text-[13px] font-mono font-medium truncate mr-2 select-all break-all whitespace-pre-wrap">
                    {formatAddress(activeAddress)}
                  </div>
                  <button onClick={() => handleCopy(activeAddress)} className="text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded transition-colors active:scale-95 shrink-0">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-[#00E5FF]/5 border border-[#00E676]/20 rounded-lg p-4 flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]" />
                <p className="text-[12px] text-zinc-400 leading-relaxed font-medium">
                  Bu para yatırma adresine yalnızca <strong className="text-white">{coinDetails[selectedCoin].name}</strong> gönderin. <strong className="text-white">{coinDetails[selectedCoin].min}</strong> değerinin altındaki transferler hesaba aktarılmayacaktır.
                </p>
              </div>

              {/* Alternate Web3 Wallets */}
              <div className="text-center mb-3 flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-white/5"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Veya Web3 İle Ödeyin</span>
                <div className="h-[1px] flex-1 bg-white/5"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-[#0A0C10] hover:bg-white/5 text-zinc-300 hover:text-white py-3 rounded-lg font-bold text-[13px] transition-colors border border-white/5">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-5 h-5" />
                  MetaMask
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#0A0C10] hover:bg-white/5 text-zinc-300 hover:text-white py-3 rounded-lg font-bold text-[13px] transition-colors border border-white/5">
                  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 40 40" fill="currentColor"><path d="M20,6C11,6,3.6,11.3,1.4,18.9c-0.1,0.5,0,1,0.4,1.4l3.1,3.1c0.4,0.4,1,0.5,1.5,0.2 C9.2,21.8,14.4,20,20,20s10.8,1.8,13.6,3.6c0.5,0.3,1.1,0.2,1.5-0.2l3.1-3.1c0.4-0.4,0.5-0.9,0.4-1.4C36.4,11.3,29,6,20,6z M30,26.7 l-3.1-3.1c-0.4-0.4-1.1-0.4-1.5-0.1c-1.5,1.1-3.3,1.9-5.3,2.3c-0.5,0.1-1,0.2-1.5,0.2s-1-0.1-1.5-0.2c-2-0.4-3.8-1.2-5.3-2.3 c-0.4-0.3-1.1-0.3-1.5,0.1l-3.1,3.1c-0.4,0.4-0.4,1,0,1.4l5.3,5.3c0.4,0.4,1,0.4,1.4,0l3.1-3.1c0.4-0.4,1.1-0.4,1.5-0.1 c0.5,0.4,1,0.6,1.6,0.6s1.1-0.2,1.6-0.6c0.4-0.3,1.1-0.3,1.5,0.1l3.1,3.1c0.4,0.4,1,0.4,1.4,0l5.3-5.3C30.4,27.7,30.4,27.1,30,26.7z"/></svg>
                  WalletConnect
                </button>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-[#0A0C10] rounded-xl border border-white/5 h-full">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5 border border-white/5 shadow-inner">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-white font-black text-xl mb-3 tracking-wide">Fiat Para Yatırma</h3>
              <p className="text-zinc-500 max-w-[260px] text-sm font-medium leading-relaxed">
                Banka havalesi ve kredi kartı ile para yatırma seçenekleri çok yakında aktif edilecek.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
