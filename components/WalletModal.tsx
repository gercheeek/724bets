import React, { useState } from 'react';
import { X, Lock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WalletModalProps {
  onClose: () => void;
  initialTab?: 'deposit' | 'withdraw';
}

const WalletModal: React.FC<WalletModalProps> = ({ onClose, initialTab = 'deposit' }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'swap'>(initialTab);

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

  const renderOption = (item: { icon: JSX.Element; name: string; isPopular?: boolean; fee?: string; feeColor?: string }, key: number) => (
    <button key={key} className="relative flex items-center justify-between p-3 bg-gradient-to-br from-[#1E2532]/80 to-[#151A23] hover:from-[#1E2532] hover:to-[#1A1F29] rounded-xl transition-all duration-300 border border-white/5 hover:border-[#00E5FF]/50 hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)] group overflow-hidden">
      <div className="flex items-center gap-3">
        {item.icon}
        <div className="flex flex-col items-start">
          <span className="text-white font-bold text-sm drop-shadow-sm group-hover:text-white transition-colors">{item.name}</span>
          {item.fee && <span className={`text-[10px] font-bold mt-0.5 ${item.feeColor}`}>{item.fee}</span>}
        </div>
      </div>
      {item.isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] text-black text-[9px] font-black px-2 py-0.5 rounded-bl-lg shadow-[0_0_10px_rgba(245,158,11,0.3)]">
          {t('wallet.popular', 'POPÜLER')}
        </div>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center md:p-4 bg-black/95 md:bg-black/60 md:backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="flex flex-col md:flex-row w-full h-full md:h-[85vh] md:max-w-[850px] bg-[#1A1F29] md:rounded-[24px] overflow-hidden shadow-2xl relative md:max-h-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#151A23] border-b border-white/5 shrink-0">
          <h2 className="text-white font-bold text-lg tracking-tight">{t('wallet.title', 'Cüzdan')}</h2>
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
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00E5FF]" />
              {t('wallet.title', 'Cüzdan')}
            </h2>
            <div className="flex items-center gap-1 bg-[#12161D] px-2 py-1 rounded-md cursor-pointer border border-[#2A3441]/50 shadow-inner hover:border-[#00E5FF]/30 transition-colors">
              <span className="text-sm">🇹🇭</span>
              <svg className="w-3 h-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9l4-4 4 4M16 15l-4 4-4-4"/></svg>
            </div>
          </div>

          <div className="flex flex-row md:flex-col flex-1 p-2 md:p-3 space-x-2 md:space-x-0 md:space-y-1 mt-0 md:mt-2 overflow-x-auto custom-scrollbar">
            {/* Deposit Tab */}
            <button 
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl transition-all duration-300 ${
                activeTab === 'deposit' ? 'bg-gradient-to-r from-[#00E5FF]/10 to-transparent border border-[#00E5FF]/20 shadow-[inset_2px_0_0_#00E5FF]' : 'hover:bg-[#151A23]/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <DepositIcon />
                <span className={`font-bold text-sm ${activeTab === 'deposit' ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{t('wallet.deposit', 'Para Yatır')}</span>
              </div>
            </button>

            {/* Withdraw Tab */}
            <button 
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl transition-all duration-300 ${
                activeTab === 'withdraw' ? 'bg-gradient-to-r from-[#F59E0B]/10 to-transparent border border-[#F59E0B]/20 shadow-[inset_2px_0_0_#F59E0B]' : 'hover:bg-[#151A23]/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <WithdrawIcon />
                <span className={`font-bold text-sm ${activeTab === 'withdraw' ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-zinc-400 group-hover:text-zinc-200'}`}>{t('wallet.withdraw', 'Para Çek')}</span>
              </div>
            </button>

            {/* Swap Tab */}
            <button 
              onClick={() => setActiveTab('swap')}
              className={`flex-1 md:w-full flex items-center justify-center md:justify-between px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl transition-all duration-300 ${
                activeTab === 'swap' ? 'bg-gradient-to-r from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/20 shadow-[inset_2px_0_0_#8B5CF6]' : 'hover:bg-[#151A23]/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3H21V8" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 21H9V16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 3L14 10" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 21L10 14" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className={`font-bold text-sm ${activeTab === 'swap' ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-zinc-400 group-hover:text-zinc-200'}`}>Dönüştür (Swap)</span>
              </div>
            </button>
          </div>

          {/* Bottom 2FA Section */}
          <div className="hidden md:block p-5 pt-0">
            <div className="flex items-center gap-2 mb-3 text-zinc-400">
              <Lock className="w-4 h-4 text-zinc-500" />
              <span className="text-xs font-semibold">{t('wallet.two_factor_disabled', 'Şu anda 2FA etkin değil')}</span>
            </div>
            <button className="w-full py-3 bg-gradient-to-r from-[#242D3D] to-[#2A3447] hover:from-[#2A3447] hover:to-[#354157] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg border border-white/5 active:scale-[0.98]">
              {t('wallet.enable_2fa', '2FA\'yı Etkinleştir')}
            </button>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col bg-[#0F131A] relative">
          <div className="p-4 md:p-6 pb-2 flex items-center justify-between sticky top-0 bg-[#0F131A] z-10 border-b md:border-none border-white/5">
            <h2 className="text-white font-black text-base md:text-xl tracking-tight flex items-center gap-2">
              <div className={`w-2 h-6 rounded-full ${activeTab === 'deposit' ? 'bg-[#00E5FF]' : activeTab === 'withdraw' ? 'bg-[#F59E0B]' : 'bg-[#8B5CF6]'}`}></div>
              {activeTab === 'deposit' ? t('wallet.deposit_options', 'Para Yatırma Seçenekleri') : 
               activeTab === 'withdraw' ? t('wallet.withdraw_options', 'Para Çekme Seçenekleri') : 
               'Kripto Dönüştür (Swap)'}
            </h2>
            <button 
              onClick={onClose}
              className="hidden md:flex w-9 h-9 rounded-full bg-[#1A1F29] border border-white/5 items-center justify-center text-zinc-400 hover:text-white transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-4 custom-scrollbar">
            {activeTab === 'deposit' && (
              <div className="space-y-6">
                
                {/* Kripto */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold uppercase tracking-wider">{t('wallet.crypto_deposit', 'Kripto Para Yatırma')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <BitcoinIcon />, name: 'Bitcoin', isPopular: true },
                      { icon: <EthereumIcon />, name: 'Ethereum' },
                      { icon: <USDTIcon />, name: 'USDT', isPopular: true },
                      { icon: <USDCIcon />, name: 'USDC' },
                      { icon: <LitecoinIcon />, name: 'Litecoin' },
                      { icon: <TronIcon />, name: 'TRON' },
                      { icon: <OtherCryptoIcon />, name: t('wallet.others', 'Diğer') },
                    ].map((item, i) => renderOption(item, i))}
                  </div>
                </div>

                {/* Borsalar */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold uppercase tracking-wider">{t('wallet.exchanges', 'Borsalar ve Cüzdanlar')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <BinanceIcon />, name: 'Binance', fee: '0% FEE', feeColor: 'text-[#06b6d4]' },
                      { icon: <CoinbaseIcon />, name: 'Coinbase', fee: '0% FEE', feeColor: 'text-[#06b6d4]' },
                      { icon: <OtherCryptoIcon />, name: t('wallet.others', 'Diğer'), fee: '0% FEE', feeColor: 'text-[#06b6d4]' },
                    ].map((item, i) => renderOption(item, i))}
                  </div>
                </div>

                {/* Banka */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold uppercase tracking-wider">{t('wallet.bank', 'Banka hesabı')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <CardIcon />, name: 'Card' },
                      { icon: <ApplePayIcon />, name: 'Apple Pay' },
                      { icon: <GooglePayIcon />, name: 'Google Pay' },
                      { icon: <SwappedIcon />, name: 'Swapped' },
                      { icon: <BankTransferIcon />, name: 'Banka transferi', isPopular: true },
                      { icon: <CS2Icon />, name: 'CS2 Skins' },
                      { icon: <OtherCryptoIcon />, name: t('wallet.others', 'Diğer') },
                    ].map((item, i) => renderOption(item, i))}
                  </div>
                </div>

                {/* Hediye Kartları */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold uppercase tracking-wider">{t('wallet.gift_cards', 'Hediye Kartları')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <PayPalIcon />, name: 'PayPal' },
                      { icon: <MasterCardIcon />, name: 'MasterCard' },
                      { icon: <VisaIcon />, name: 'Visa' },
                      { icon: <PaysafeIcon />, name: 'Paysafecard' },
                      { icon: <GooglePayIcon />, name: 'Google Pay' },
                      { icon: <TrustlyIcon />, name: 'Trustly' },
                    ].map((item, i) => renderOption(item, i))}
                  </div>
                </div>
                
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="space-y-6">
                {/* Kripto Çekim */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold uppercase tracking-wider">{t('wallet.crypto_withdraw', 'Kripto Çekim')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <BitcoinIcon />, name: 'Bitcoin', isPopular: true },
                      { icon: <EthereumIcon />, name: 'Ethereum' },
                      { icon: <USDTIcon />, name: 'USDT' },
                      { icon: <USDCIcon />, name: 'USDC' },
                      { icon: <LitecoinIcon />, name: 'Litecoin' },
                      { icon: <TronIcon />, name: 'TRON' },
                      { icon: <OtherCryptoIcon />, name: t('wallet.others', 'Diğer') },
                    ].map((item, i) => renderOption(item, i))}
                  </div>
                </div>

                {/* Diğer */}
                <div>
                  <h3 className="text-[#8892A3] text-sm mb-3 font-semibold uppercase tracking-wider">{t('wallet.others', 'Diğer')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: <VaultIcon />, name: 'Kasa' },
                    ].map((item, i) => renderOption(item, i))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'swap' && (
              <div className="flex flex-col gap-6 w-full max-w-lg mx-auto mt-4">
                <div className="text-center mb-2">
                  <h3 className="text-white font-black text-xl mb-1">Hızlı Dönüştürme</h3>
                  <p className="text-zinc-400 text-sm">Sıfır komisyon ile anında cüzdan bakiyenizi dönüştürün.</p>
                </div>
                
                <div className="bg-[#151A23] border border-white/5 rounded-2xl p-4 relative">
                  {/* From */}
                  <div className="flex flex-col gap-2">
                    <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Gönderilen (Mevcut Bakiye)</label>
                    <div className="flex items-center gap-3 bg-[#0F131A] p-3 rounded-xl border border-white/5 focus-within:border-[#8B5CF6]/50 transition-colors">
                      <div className="flex items-center gap-2 pr-3 border-r border-white/10 cursor-pointer">
                        <BitcoinIcon />
                        <span className="text-white font-bold text-sm">BTC</span>
                        <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                      <input type="number" placeholder="0.00" className="flex-1 bg-transparent text-white font-black text-xl text-right outline-none" />
                    </div>
                  </div>
                  
                  {/* Swap Icon */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1A1F29] border border-white/5 flex items-center justify-center shadow-lg z-10 cursor-pointer hover:bg-[#2A3441] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  {/* To */}
                  <div className="flex flex-col gap-2 mt-6">
                    <label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Alınan (Tahmini Bakiye)</label>
                    <div className="flex items-center gap-3 bg-[#0F131A] p-3 rounded-xl border border-white/5 focus-within:border-[#8B5CF6]/50 transition-colors">
                      <div className="flex items-center gap-2 pr-3 border-r border-white/10 cursor-pointer">
                        <USDTIcon />
                        <span className="text-white font-bold text-sm">USDT</span>
                        <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                      </div>
                      <input type="number" placeholder="0.00" disabled className="flex-1 bg-transparent text-white/50 font-black text-xl text-right outline-none" />
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-[#8B5CF6] hover:bg-[#9333EA] text-white font-black uppercase tracking-wider py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                  Şimdi Dönüştür
                </button>
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
