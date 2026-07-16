import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface WalletModalProps {
  onClose: () => void;
  initialTab?: 'deposit' | 'withdraw';
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose, initialTab = 'deposit' }) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>(initialTab);

  // Custom Icons as SVGs for accuracy
  const BitcoinIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#F7931A] flex items-center justify-center text-white font-bold text-lg">
      ₿
    </div>
  );

  const EthereumIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#627EEA] flex items-center justify-center text-white font-bold text-lg">
      Ξ
    </div>
  );

  const USDTIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#26A17B] flex items-center justify-center text-white font-bold text-sm">
      ₮
    </div>
  );

  const USDCIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#2775CA] flex items-center justify-center text-white font-bold text-sm">
      $
    </div>
  );

  const LitecoinIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#BFBBBB] flex items-center justify-center text-white font-bold text-lg">
      Ł
    </div>
  );

  const TronIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#EF0027] flex items-center justify-center text-white font-bold text-lg">
      T
    </div>
  );

  const OtherCryptoIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#2C3444] grid grid-cols-2 grid-rows-2 p-1.5 gap-0.5">
      <div className="bg-blue-400 rounded-sm"></div>
      <div className="bg-red-400 rounded-sm"></div>
      <div className="bg-green-400 rounded-sm"></div>
      <div className="bg-yellow-400 rounded-sm"></div>
    </div>
  );

  const BinanceIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#FCD535] flex items-center justify-center text-black font-bold">
      B
    </div>
  );

  const CoinbaseIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#0052FF] flex items-center justify-center text-white font-bold">
      C
    </div>
  );

  const CardIcon = () => (
    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
      <div className="flex">
        <div className="w-4 h-4 rounded-full bg-red-500 opacity-80 -mr-2"></div>
        <div className="w-4 h-4 rounded-full bg-orange-500 opacity-80"></div>
      </div>
    </div>
  );

  const ApplePayIcon = () => (
    <div className="w-8 h-8 rounded-md bg-black border border-white/10 flex items-center justify-center text-white font-bold text-[10px]">
      Pay
    </div>
  );

  const GooglePayIcon = () => (
    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center font-bold text-[10px] text-gray-800">
      G Pay
    </div>
  );

  const SwappedIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#6E32CD] flex items-center justify-center text-white font-bold">
      S
    </div>
  );

  const BankTransferIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#5B4AF0] flex items-center justify-center text-white font-bold text-[11px] text-center leading-tight">
      Banka
    </div>
  );

  const CS2Icon = () => (
    <div className="w-8 h-8 rounded-md bg-[#D97700] flex items-center justify-center text-white font-bold">
      CS2
    </div>
  );
  
  const PayPalIcon = () => (
    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-[#003087] font-bold italic">
      P
    </div>
  );

  const MasterCardIcon = CardIcon;
  const VisaIcon = () => (
    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-[#1A1F71] font-bold text-xs italic">
      VISA
    </div>
  );
  const PaysafeIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#007AC9] flex items-center justify-center text-white font-bold text-[8px] text-center">
      PaySafe
    </div>
  );
  const TrustlyIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#0EE06E] flex items-center justify-center text-white font-bold text-[10px]">
      T
    </div>
  );
  const VaultIcon = () => (
    <div className="w-8 h-8 rounded-md bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-lg overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
      V
    </div>
  );

  const DepositIcon = () => (
    <div className="flex items-center justify-center w-6 h-6">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 5L12 14M12 14L9 11M12 14L15 11" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="19" width="18" height="2" fill="#FF4D4D"/>
      </svg>
    </div>
  );

  const WithdrawIcon = () => (
    <div className="flex items-center justify-center w-6 h-6">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 19L12 10M12 10L9 13M12 10L15 13" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="3" y="19" width="18" height="2" fill="#F59E0B"/>
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center md:p-4 bg-black/95 md:bg-black/60 md:backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="flex flex-col md:flex-row w-full h-full md:h-[85vh] md:max-w-[850px] bg-[#1A1F29] md:rounded-[24px] overflow-hidden shadow-2xl relative md:max-h-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#151A23] border-b border-white/5 shrink-0">
          <h2 className="text-white font-bold text-lg tracking-tight">Cüzdan</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-[260px] flex md:flex-col border-b md:border-b-0 md:border-r border-[#2A3441] bg-[#1A1F29] shrink-0">
          <div className="hidden md:flex p-5 pb-2 items-center justify-between">
            <h2 className="text-white font-bold text-lg">Cüzdan</h2>
            <div className="flex items-center gap-1 bg-[#12161D] px-2 py-1 rounded-md cursor-pointer border border-[#2A3441]/50">
              <span className="text-sm">🇹🇭</span>
              <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l4-4 4 4M16 15l-4 4-4-4"/></svg>
            </div>
          </div>

          <div className="flex flex-row md:flex-col flex-1 p-2 md:p-3 space-x-2 md:space-x-0 md:space-y-1 mt-0 md:mt-2 overflow-x-auto custom-scrollbar">
            {/* Deposit Tab */}
            <button 
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl transition-all ${
                activeTab === 'deposit' ? 'bg-[#151A23] shadow-inner' : 'hover:bg-[#151A23]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <DepositIcon />
                <span className={`font-bold text-sm ${activeTab === 'deposit' ? 'text-white' : 'text-zinc-300'}`}>Para Yatır</span>
              </div>
              {activeTab === 'deposit' && (
                <div className="hidden md:block w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-[#10B981] border-b-[5px] border-b-transparent"></div>
              )}
            </button>

            {/* Withdraw Tab */}
            <button 
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl transition-all ${
                activeTab === 'withdraw' ? 'bg-[#151A23] shadow-inner' : 'hover:bg-[#151A23]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <WithdrawIcon />
                <span className={`font-bold text-sm ${activeTab === 'withdraw' ? 'text-white' : 'text-zinc-300'}`}>Para Çek</span>
              </div>
              {activeTab === 'withdraw' && (
                <div className="hidden md:block w-0 h-0 border-t-[5px] border-t-transparent border-l-[6px] border-l-[#10B981] border-b-[5px] border-b-transparent"></div>
              )}
            </button>
          </div>

          {/* Bottom 2FA Section */}
          <div className="hidden md:block p-5 pt-0">
            <div className="flex items-center gap-2 mb-3 text-zinc-400">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-semibold">Şu anda 2FA etkin değil</span>
            </div>
            <button className="w-full py-3 bg-[#242D3D] hover:bg-[#2A3447] text-white font-bold text-sm rounded-xl transition-colors">
              2FA'yı Etkinleştir
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col bg-[#151A23] relative">
          <div className="p-4 md:p-6 pb-2 flex items-center justify-between sticky top-0 bg-[#151A23] z-10 border-b md:border-none border-white/5">
            <h2 className="text-white font-bold text-base md:text-lg">
              {activeTab === 'deposit' ? 'Para Yatırma Seçenekleri' : 'Para Çekme Seçenekleri'}
            </h2>
            <button 
              onClick={onClose}
              className="hidden md:flex w-8 h-8 rounded-full bg-[#1A1F29] items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-4 custom-scrollbar">
            {activeTab === 'deposit' && (
              <div className="space-y-6">
                
                {/* Kripto */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold">Kripto Para Yatırma</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <BitcoinIcon />, name: 'Bitcoin' },
                      { icon: <EthereumIcon />, name: 'Ethereum' },
                      { icon: <USDTIcon />, name: 'USDT' },
                      { icon: <USDCIcon />, name: 'USDC' },
                      { icon: <LitecoinIcon />, name: 'Litecoin' },
                      { icon: <TronIcon />, name: 'TRON' },
                      { icon: <OtherCryptoIcon />, name: 'Diğer' },
                    ].map((item, i) => (
                      <button key={i} className="flex items-center gap-3 p-3 bg-[#1A1F29] hover:bg-[#1E2532] rounded-xl transition-colors border border-transparent hover:border-white/5">
                        {item.icon}
                        <span className="text-white font-bold text-sm">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Borsalar */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold">Borsalar ve Cüzdanlar</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <BinanceIcon />, name: 'Binance', fee: '0% FEE', feeColor: 'text-[#10B981]' },
                      { icon: <CoinbaseIcon />, name: 'Coinbase', fee: '0% FEE', feeColor: 'text-[#10B981]' },
                      { icon: <OtherCryptoIcon />, name: 'Diğer', fee: '0% FEE', feeColor: 'text-[#10B981]' },
                    ].map((item, i) => (
                      <button key={i} className="flex items-center justify-between p-3 bg-[#1A1F29] hover:bg-[#1E2532] rounded-xl transition-colors border border-transparent hover:border-white/5">
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <div className="flex flex-col items-start">
                            <span className="text-white font-bold text-sm">{item.name}</span>
                            <span className={`text-[10px] font-bold ${item.feeColor}`}>{item.fee}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banka */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold">Banka hesabı</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <CardIcon />, name: 'Card' },
                      { icon: <ApplePayIcon />, name: 'Apple Pay' },
                      { icon: <GooglePayIcon />, name: 'Google Pay' },
                      { icon: <SwappedIcon />, name: 'Swapped' },
                      { icon: <BankTransferIcon />, name: 'Banka transferi' },
                      { icon: <CS2Icon />, name: 'CS2 Skins' },
                      { icon: <OtherCryptoIcon />, name: 'Diğer' },
                    ].map((item, i) => (
                      <button key={i} className="flex items-center gap-3 p-3 bg-[#1A1F29] hover:bg-[#1E2532] rounded-xl transition-colors border border-transparent hover:border-white/5">
                        {item.icon}
                        <span className="text-white font-bold text-sm">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hediye Kartları */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold">Hediye Kartları</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <PayPalIcon />, name: 'PayPal' },
                      { icon: <MasterCardIcon />, name: 'MasterCard' },
                      { icon: <VisaIcon />, name: 'Visa' },
                      { icon: <PaysafeIcon />, name: 'Paysafecard' },
                      { icon: <GooglePayIcon />, name: 'Google Pay' },
                      { icon: <TrustlyIcon />, name: 'Trustly' },
                    ].map((item, i) => (
                      <button key={i} className="flex items-center gap-3 p-3 bg-[#1A1F29] hover:bg-[#1E2532] rounded-xl transition-colors border border-transparent hover:border-white/5">
                        {item.icon}
                        <span className="text-white font-bold text-sm">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="space-y-6">
                {/* Kripto Çekim */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold">Kripto Çekim</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <BitcoinIcon />, name: 'Bitcoin' },
                      { icon: <EthereumIcon />, name: 'Ethereum' },
                      { icon: <USDTIcon />, name: 'USDT' },
                      { icon: <USDCIcon />, name: 'USDC' },
                      { icon: <LitecoinIcon />, name: 'Litecoin' },
                      { icon: <TronIcon />, name: 'TRON' },
                      { icon: <OtherCryptoIcon />, name: 'Diğer' },
                    ].map((item, i) => (
                      <button key={i} className="flex items-center gap-3 p-3 bg-[#1A1F29] hover:bg-[#1E2532] rounded-xl transition-colors border border-transparent hover:border-white/5">
                        {item.icon}
                        <span className="text-white font-bold text-sm">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diğer */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold">Diğer</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <VaultIcon />, name: 'Kasa' },
                    ].map((item, i) => (
                      <button key={i} className="flex items-center gap-3 p-3 bg-[#1A1F29] hover:bg-[#1E2532] rounded-xl transition-colors border border-transparent hover:border-white/5">
                        {item.icon}
                        <span className="text-white font-bold text-sm">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #2A3441;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
};

export default WalletModal;
