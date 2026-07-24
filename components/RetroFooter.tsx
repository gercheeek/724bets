import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const RetroFooter: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="w-full relative z-10 retro-footer-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .retro-footer-container {
          background-color: #050510;
          border-top: 4px solid #880088;
          padding: 40px 0;
          font-family: 'Courier New', Courier, monospace;
          color: #00ffff;
          position: relative;
          box-shadow: inset 0 20px 20px -20px rgba(0, 255, 255, 0.2);
        }

        .retro-footer-container::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 255, 255, 0.03) 0px,
            rgba(0, 255, 255, 0.03) 2px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        .retro-title {
          font-family: 'Press Start 2P', monospace;
          font-size: 14px;
          color: #06b6d4;
          text-shadow: 2px 2px 0px #880088;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .retro-text {
          font-size: 12px;
          color: #88eeee;
          line-height: 1.6;
        }

        .retro-box {
          border: 2px solid #00ffff;
          background: rgba(0, 255, 255, 0.05);
          padding: 10px;
          display: inline-block;
          margin-right: 10px;
          margin-bottom: 10px;
          transition: all 0.2s;
          cursor: pointer;
          color: #00ffff;
          font-weight: bold;
          text-align: center;
          font-family: 'Press Start 2P', monospace;
          font-size: 10px;
          box-shadow: 2px 2px 0 #880088;
        }
        
        .retro-box:hover {
          background: #00ffff;
          color: #000;
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 #880088;
        }
        
        .retro-box:active {
          transform: translate(2px, 2px);
          box-shadow: 0 0 0 #000;
        }

        .retro-link {
          color: #00ffff;
          text-decoration: none;
          transition: all 0.2s;
          display: inline-block;
          font-weight: bold;
        }
        .retro-link:hover {
          color: #fff;
          text-shadow: 0 0 5px #00ffff;
        }

        .pixel-badge {
          display: inline-block;
          background: #ff00ff;
          color: white;
          font-family: 'Press Start 2P', monospace;
          font-size: 12px;
          padding: 8px 10px;
          border: 2px solid #880088;
          box-shadow: 2px 2px 0 #880088;
        }
        
        .pixel-crypto-icon {
          width: 24px;
          height: 24px;
          margin: 0 auto 5px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          filter: grayscale(100%) brightness(200%) sepia(100%) hue-rotate(180deg) saturate(400%);
        }
        
        .retro-box:hover .pixel-crypto-icon {
          filter: none;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & About */}
          <div className="flex flex-col gap-4">
            <h2 className="retro-title text-2xl lowercase" style={{ fontSize: '20px', color: '#00ffff' }}>724bets</h2>
            <p className="retro-text">
              {t("footer_desc")}
            </p>
            <div className="mt-2 border-2 border-dashed border-[#880088] p-4 bg-[#000011]">
              <p className="text-[10px] text-[#00ffff] leading-snug font-bold">
                [SYSTEM]: {t("footer_license")}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="retro-title text-[#ff00ff]">{t("payment_methods")}</h3>
            <div>
              {/* Crypto */}
              <div className="retro-box" title="Bitcoin">
                <div className="pixel-crypto-icon" style={{ backgroundImage: 'url(https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029)' }}></div>
                BTC
              </div>
              <div className="retro-box" title="Ethereum">
                <div className="pixel-crypto-icon" style={{ backgroundImage: 'url(https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029)' }}></div>
                ETH
              </div>
              <div className="retro-box" title="Tether">
                <div className="pixel-crypto-icon" style={{ backgroundImage: 'url(https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029)' }}></div>
                USDT
              </div>
              <div className="retro-box" title="Tron">
                <div className="pixel-crypto-icon" style={{ backgroundImage: 'url(https://cryptologos.cc/logos/tron-trx-logo.svg?v=029)' }}></div>
                TRX
              </div>
              <div className="retro-box" title="Binance Coin">
                <div className="pixel-crypto-icon" style={{ backgroundImage: 'url(https://cryptologos.cc/logos/bnb-bnb-logo.svg?v=029)' }}></div>
                BNB
              </div>
              {/* Fiat/Bank */}
              <div className="retro-box px-4 py-4" title="Havale">
                HAVALE / EFT
              </div>
            </div>
            
            {/* Providers */}
            <h3 className="retro-title mt-6 text-[#ff00ff]">{t("trusted_providers")}</h3>
            <div>
               <div className="retro-box px-3 py-2">PRAGMATIC PLAY</div>
               <div className="retro-box px-3 py-2">HACKSAW</div>
               <div className="retro-box px-3 py-2">EVOLUTION</div>
               <div className="retro-box px-3 py-2">NOLIMIT CITY</div>
            </div>
          </div>

          {/* Trust & Responsible Gaming */}
          <div className="flex flex-col gap-4 lg:items-end lg:text-right">
            <h3 className="retro-title text-[#ff00ff]">{t("responsible_gaming")}</h3>
            
            <div className="flex flex-wrap lg:justify-end gap-3 mb-2 mt-1">
              <div className="pixel-badge">18+</div>
              <div className="retro-box px-3 py-2 !border-[#ff00ff] !text-[#ff00ff] shadow-[2px_2px_0_#880088] hover:!bg-[#ff00ff] hover:!text-black">GAMBLEAWARE</div>
            </div>
            
            <div className="text-xs text-[#00ffff] max-w-xs border-l-4 lg:border-l-0 lg:border-r-4 border-[#ff00ff] pl-3 lg:pl-0 lg:pr-3 py-1 font-bold">
              <p className="mb-2 text-[#ff00ff] uppercase">! {t("gambling_addictive")} !</p>
              <p>{t('gambling_limits')} {t('gambling_help_1')} <a href="#" className="retro-link underline">{t('gambling_help_link')}</a> {t('gambling_help_2')}</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t-2 border-[#880088] text-[11px] sm:text-xs text-[#ff00ff] gap-4 font-bold">
          <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6">
            <a href="#" className="retro-link uppercase">[{t("terms_conditions")}]</a>
            <a href="#" className="retro-link uppercase">[{t("privacy_policy")}]</a>
            <a href="#" className="retro-link uppercase">[{t("responsible_gaming")}]</a>
            <a href="#" className="retro-link uppercase">[{t("kyc_policy")}]</a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-[#00ffff]">
            <div className="flex items-center gap-2 mb-1 text-[10px]">
              <span>[OK] {t("all_rights_reserved")}</span>
            </div>
            <div className="flex items-center gap-2 mb-2 text-[10px]">
              <span>SYS.VER: 724bets v2.0.1</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-admin'))}
                className="retro-box px-3 py-2"
              >
                YÖNETİCİ.EXE
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-finance'))}
                className="retro-box px-3 py-2"
              >
                FİNANS.EXE
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default RetroFooter;
