import React from 'react';

const CasinoLogo: React.FC = () => {
  return (
    <div className="flex items-center cursor-pointer select-none font-black text-2xl tracking-tighter">
      <span className="text-white">724</span>
      <span className="text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">bets</span>
    </div>
  );
};

export default CasinoLogo;
