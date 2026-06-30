import React, { useState, useEffect, useMemo } from 'react';
import { Gift, Ticket, Zap, Crown, Activity } from 'lucide-react';
import { GiveawayConfig } from '../types';

interface GiveawayBannerProps {
  config: GiveawayConfig;
  onViewChange?: (view: string) => void;
}

const LATEST_TICKETS = [
  { user: 'Ahmet_***', count: 3, time: '2 dk önce' },
  { user: 'Burak_***', count: 1, time: '5 dk önce' },
  { user: 'Caner_***', count: 5, time: '12 dk önce' },
  { user: 'Selin_***', count: 2, time: '18 dk önce' },
  { user: 'Mehmet_***', count: 1, time: '25 dk önce' },
];

const GiveawayBanner: React.FC<GiveawayBannerProps> = ({ config, onViewChange }) => {
  const activeGiveaway = useMemo(() => 
    config.giveaways.find(g => g.status === 'active') || config.giveaways[0], 
    [config.giveaways]
  );

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!activeGiveaway) return;
    const target = new Date(activeGiveaway.drawDate).getTime();
    const tick = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeGiveaway]);

  if (!activeGiveaway) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <a 
      href="https://gamdom.com/r/724bahis"
      target="_blank"
      rel="noopener noreferrer"
      className="giveaway-banner-wrapper"
    >
      <style>{`
        .giveaway-banner-wrapper {
          width: 100%;
          max-width: 1200px;
          margin: 15px auto;
          background: linear-gradient(135deg, #040507 0%, #0c0d14 50%, #040507 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }
        .giveaway-banner-wrapper:hover {
          border-color: rgba(255, 215, 0, 0.25);
          background: linear-gradient(180deg, rgba(255, 215, 0, 0.02) 0%, #1a1a22 100%);
          box-shadow: 0 0 25px rgba(255, 215, 0, 0.1);
          transform: translateY(-2px);
        }
        .giveaway-banner-glow {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .gb-content {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          gap: 20px;
          position: relative;
          z-index: 2;
        }
        .gb-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
        }
        .gb-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(255, 215, 0, 0.05);
          border: 1px solid rgba(255, 215, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFD700;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.05);
        }
        .gb-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .gb-badge-row {
          display: flex;
          margin-bottom: 2px;
        }
        .gb-badge {
          color: #000;
          font-size: 8.5px;
          font-weight: 900;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: #FFD700;
          padding: 1px 5px;
          border-radius: 4px;
          display: inline-block;
          line-height: 1.2;
        }
        .gb-title {
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 1px 0;
          text-transform: uppercase;
          letter-spacing: -0.2px;
          line-height: 1.2;
        }
        .gb-desc {
          font-size: 11px;
          font-weight: 500;
          color: #9ca3af;
          margin: 0;
          line-height: 1.3;
        }
        .gb-right {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
        }
        .gb-countdown {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .gb-cd-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 24px;
        }
        .gb-cd-val {
          color: #FFD700;
          font-size: 17px;
          font-weight: 900;
          line-height: 1.1;
        }
        .gb-cd-lbl {
          color: #6b7280;
          font-size: 8px;
          text-transform: uppercase;
          font-weight: 700;
          margin-top: 1px;
        }
        .gb-cd-divider {
          color: #FFD700;
          font-size: 15px;
          font-weight: 900;
          margin-bottom: 10px;
          opacity: 0.8;
        }
        .gb-cta {
          background: #f0b90b;
          color: #000;
          font-weight: 900;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 8px 18px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 0 15px rgba(240, 185, 11, 0.2);
          transition: all 0.3s;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .gb-cta:hover {
          transform: translateY(-1px);
          background: #f5c518;
          box-shadow: 0 0 20px rgba(240, 185, 11, 0.35);
        }
        .gb-cta-arrow {
          font-size: 13px;
          font-weight: 900;
          transition: transform 0.2s;
        }
        .gb-cta:hover .gb-cta-arrow {
          transform: translateX(2px);
        }

        /* Ticker Styles */
        .gb-ticker-wrap {
          width: 100%;
          background: rgba(0, 0, 0, 0.4);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px 0;
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          align-items: center;
        }
        .gb-ticker-title {
          font-size: 10px;
          font-weight: 800;
          color: #FFD700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 16px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          margin-right: 16px;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
        }
        .gb-ticker-container {
          overflow: hidden;
          width: 100%;
        }
        .gb-ticker-track {
          display: inline-block;
          white-space: nowrap;
          animation: ticker-animation 30s linear infinite;
        }
        .gb-ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-right: 40px;
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
        }
        .gb-ticker-user {
          color: #fff;
          font-weight: 800;
        }
        .gb-ticker-count {
          background: rgba(255, 215, 0, 0.15);
          color: #FFD700;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255, 215, 0, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .gb-ticker-time {
          color: #4b5563;
        }
        
        @keyframes ticker-animation {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @media (max-width: 768px) {
          .gb-content {
            flex-direction: column;
            align-items: stretch;
            padding: 14px 16px;
            gap: 14px;
          }
          .gb-left {
            gap: 12px;
          }
          .gb-right {
            justify-content: space-between;
            gap: 16px;
          }
          /* Custom Mobile Styling for 21.com Aesthetic */
          .gb-title {
            color: #fff;
            font-size: 20px !important;
            font-weight: 900 !important;
          }
        }
      `}</style>
      
      <div className="giveaway-banner-glow" />
      
      <div className="gb-content">
        <div className="gb-left">
          <div className="gb-icon-box">
            <Gift size={20} />
          </div>
          <div className="gb-info">
            <div className="gb-badge-row">
              <span className="gb-badge">GAMDOM ÖZEL</span>
            </div>
            <h3 className="gb-title">Haftalık Büyük Çekiliş</h3>
            <p className="gb-desc">724bahis koduyla üye ol ve 1000 TL yatırım/çevrim yap, sınırsız bilet kazan!</p>
          </div>
        </div>

        <div className="gb-right">
          <div className="gb-countdown">
            <div className="gb-cd-item">
              <span className="gb-cd-val">{pad(countdown.days)}</span>
              <span className="gb-cd-lbl">Gün</span>
            </div>
            <span className="gb-cd-divider">:</span>
            <div className="gb-cd-item">
              <span className="gb-cd-val">{pad(countdown.hours)}</span>
              <span className="gb-cd-lbl">Saat</span>
            </div>
            <span className="gb-cd-divider">:</span>
            <div className="gb-cd-item">
              <span className="gb-cd-val">{pad(countdown.minutes)}</span>
              <span className="gb-cd-lbl">Dk</span>
            </div>
            <span className="gb-cd-divider">:</span>
            <div className="gb-cd-item">
              <span className="gb-cd-val">{pad(countdown.seconds)}</span>
              <span className="gb-cd-lbl">Sn</span>
            </div>
          </div>
          <button className="gb-cta">
            Şimdi Katıl
            <span className="gb-cta-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Ticket Purchases Marquee */}
      <div className="gb-ticker-wrap">
        <div className="gb-ticker-title">
          <Activity size={12} />
          Son Biletler
        </div>
        <div className="gb-ticker-container">
          <div className="gb-ticker-track">
            {/* Render list twice to create seamless loop */}
            {[...LATEST_TICKETS, ...LATEST_TICKETS].map((ticket, i) => (
              <span key={i} className="gb-ticker-item">
                <span className="gb-ticker-user">{ticket.user}</span>
                <span className="gb-ticker-count">
                  <Ticket size={11} />
                  {ticket.count} bilet aldı
                </span>
                <span className="gb-ticker-time">({ticket.time})</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
};

export default React.memo(GiveawayBanner);
