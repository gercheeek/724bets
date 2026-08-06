import React from 'react';
import VIPRafflePromo from './VIPRafflePromo';

export default function RaffleLanding({ onLoginRequired }: { onLoginRequired: () => void }) {
  return (
    <div className="relative min-h-screen bg-[#0A0C10] overflow-x-hidden flex flex-col items-center pb-20">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#F5A623] opacity-[0.03] blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E53E3E] opacity-[0.03] blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <style>{`
        @keyframes blob { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-50px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} 100%{transform:translate(0,0) scale(1)} }
        @keyframes shimmerLine { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes feedSlide { 0%{transform:translateY(-100%);opacity:0} 20%{transform:translateY(0);opacity:1} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 40px rgba(245,166,35,0.2)} 50%{box-shadow:0 0 80px rgba(245,166,35,0.5)} }
        @keyframes scaleIn { 0%{transform:scale(0.95);opacity:0} 100%{transform:scale(1);opacity:1} }
      `}</style>

      {/* Hero Section with VIPRafflePromo */}
      <section className="relative z-10 m-0 p-0 max-w-full flex-1 flex flex-col items-center justify-center min-h-[50vh] w-full">
        {/* VIPRafflePromo Centered */}
        <div className="w-full flex-1 flex flex-col justify-center">
          <VIPRafflePromo 
            loyalty={{ tickets: 0, deposit: 0 }}
            onOpenDepositModal={() => {}}
            onBuyTicket={() => {}}
            buyMsg=""
            totalSoldInMatrix={386}
            totalPoolSize={1000}
            targetDateStr="2026-12-31T23:59:59"
            isGuest={true}
            onLoginRequired={onLoginRequired}
          />
        </div>
      </section>

    </div>
  );
}
