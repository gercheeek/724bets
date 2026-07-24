import React from 'react';

export default function HowItWorksCards() {
  return (
    <div className="w-full relative z-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .arcade-font {
          font-family: 'Press Start 2P', monospace;
        }

        .pixel-card {
          background-color: #050B06;
          position: relative;
          border: 4px solid #004400;
          box-shadow: 
            inset 0 0 20px rgba(0, 255, 0, 0.1),
            0 0 10px rgba(0, 0, 0, 0.8);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          overflow: hidden;
          cursor: pointer;
        }

        .pixel-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0, 255, 0, 0.04) 0px,
            rgba(0, 255, 0, 0.04) 2px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          z-index: 1;
        }
        
        .pixel-card::after {
          content: "";
          position: absolute;
          top: -50%; left: -50%; right: -50%; bottom: -50%;
          background: radial-gradient(circle, rgba(0,255,0,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.5s;
          z-index: 0;
          pointer-events: none;
        }

        .pixel-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            inset 0 0 30px rgba(0, 255, 0, 0.3),
            0 15px 30px rgba(0, 0, 0, 0.9),
            0 0 20px rgba(0, 255, 0, 0.4);
          border-color: #00ff00;
        }
        
        .pixel-card:hover::after {
          opacity: 1;
        }

        .arcade-title {
          color: #00aa00;
          text-shadow: 2px 2px 0px #003300;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 1.2rem;
          text-align: center;
          text-transform: uppercase;
          position: relative;
          z-index: 2;
          transition: all 0.3s;
        }

        .pixel-card:hover .arcade-title {
          color: #fff;
          text-shadow: 
            2px 2px 0px #00ff00,
            0 0 10px #00ff00;
        }

        .arcade-text {
          font-family: 'Courier New', Courier, monospace;
          color: #77aa77;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          line-height: 1.6;
          position: relative;
          z-index: 2;
          transition: color 0.3s;
        }

        .pixel-card:hover .arcade-text {
          color: #ccffcc;
        }

        .pixel-icon-container {
          width: 70px;
          height: 70px;
          margin: 0 auto 1.5rem;
          border: 3px dashed #004400;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          background: rgba(0, 255, 0, 0.05);
          transition: all 0.3s;
        }
        
        .pixel-card:hover .pixel-icon-container {
          border: 3px solid #00ff00;
          background: rgba(0, 255, 0, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
          transform: scale(1.1);
        }

        /* Pure CSS 8-bit style icons */
        .icon-user {
          width: 30px; height: 30px;
          background: #00aa00;
          clip-path: polygon(30% 100%, 30% 60%, 0% 60%, 0% 40%, 20% 40%, 20% 20%, 40% 20%, 40% 0%, 60% 0%, 60% 20%, 80% 20%, 80% 40%, 100% 40%, 100% 60%, 70% 60%, 70% 100%);
          transition: all 0.3s;
        }
        .icon-play {
          width: 24px; height: 28px;
          background: #00aa00;
          clip-path: polygon(0 0, 0 100%, 100% 50%);
          transition: all 0.3s;
        }
        .icon-reward {
          width: 32px; height: 28px;
          background: #00aa00;
          clip-path: polygon(20% 0%, 80% 0%, 100% 30%, 100% 70%, 80% 100%, 20% 100%, 0% 70%, 0% 30%);
          transition: all 0.3s;
        }

        .pixel-card:hover .icon-user,
        .pixel-card:hover .icon-play,
        .pixel-card:hover .icon-reward {
          background: #fff;
          filter: drop-shadow(0 0 5px #00ff00);
        }

        .scanline-connector {
          position: absolute;
          top: 50%;
          left: 5%;
          right: 5%;
          height: 4px;
          background: repeating-linear-gradient(90deg, #00ff00 0, #00ff00 15px, transparent 15px, transparent 30px);
          animation: scanlineMove 1s linear infinite;
          z-index: 0;
          opacity: 0.15;
        }

        @keyframes scanlineMove {
          0% { background-position: 0 0; }
          100% { background-position: 30px 0; }
        }
      `}</style>

      <section className="relative my-12 py-4">
        {/* Animated Dashed Connector Line */}
        <div className="hidden md:block scanline-connector -translate-y-1/2"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 px-4 md:px-0 max-w-[1200px] mx-auto">
          
          {/* Card 1 */}
          <div className="pixel-card rounded-none h-[300px] p-6 flex flex-col justify-center">
            <div className="pixel-icon-container">
              <div className="icon-user"></div>
            </div>
            <h3 className="arcade-font arcade-title">ÜYE OLUN</h3>
            <p className="arcade-text">
              İster acemi olun ister tecrübeli, ödüllerinizi yükseltmek için sadece bir tık uzaktasınız.
            </p>
          </div>

          {/* Card 2 */}
          <div className="pixel-card rounded-none h-[300px] p-6 flex flex-col justify-center mt-0 md:mt-8">
            <div className="pixel-icon-container">
              <div className="icon-play"></div>
            </div>
            <h3 className="arcade-font arcade-title">OYNAYIN VE<br/>KAZANIN</h3>
            <p className="arcade-text">
              Yaptığınız her bahis, size anında puan ve tecrübe kazandırır.
            </p>
          </div>

          {/* Card 3 */}
          <div className="pixel-card rounded-none h-[300px] p-6 flex flex-col justify-center mt-0 md:mt-16">
            <div className="pixel-icon-container">
              <div className="icon-reward"></div>
            </div>
            <h3 className="arcade-font arcade-title">ÖDÜLLERİ ALIN</h3>
            <p className="arcade-text">
              Puan toplayın; efsanevi bonusların ve VIP ayrıcalıkların kilidini açın.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
