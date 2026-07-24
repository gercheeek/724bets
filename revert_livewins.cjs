const fs = require('fs');
const path = '/Users/alex/Desktop/7_24bets-landing-page/components/LiveWinsTicker.tsx';
let content = fs.readFileSync(path, 'utf8');

const newCode = `    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 mb-0 mt-4">`;
const endCode = `        {selectedWin && (`;

if (content.includes(newCode)) {
  const before = content.substring(0, content.indexOf(newCode));
  const after = content.substring(content.indexOf(endCode));

  const oldCode = `    <div className="w-full flex flex-col mb-0 relative mt-0">
      <div className="w-full relative flex items-center bg-transparent overflow-hidden pt-6 pb-2">
        
        {/* Canlı Kazançlar Badge top left */}
        <div className="absolute -top-3 left-4 flex items-center gap-1.5 z-10 bg-black/40 px-2 py-0.5 rounded-full border border-white/5 backdrop-blur-md">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
          </span>
          <span className="text-gray-200 font-bold text-[8px] tracking-widest uppercase">CANLI</span>
        </div>

        {/* Horizontal Auto-Moving List (250 Unique Entries) */}
        <div 
          ref={scrollContainerRef}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          onTouchStart={() => { isHoveredRef.current = true; }}
          onTouchEnd={() => { isHoveredRef.current = false; }}
          className="flex gap-2.5 md:gap-4 overflow-x-auto hide-scrollbar w-full px-4 md:px-8 select-none"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {wins.map((win) => (
            <div 
              key={win.id}
              onClick={() => setSelectedWin(win)}
              className="flex-shrink-0 cursor-pointer w-[52px] md:w-[65px]"
            >
              <PremiumTiltCard className="w-full">
                <div className="flex flex-col items-center group transition-all duration-300">
                  {/* Game Cover */}
                  <div className="w-full aspect-[3/4] rounded-[12px] md:rounded-2xl overflow-hidden relative shadow-[0_5px_15px_rgba(0,0,0,0.5)] mb-3 bg-[#111111] border border-emerald-500/10 group-hover:border-emerald-500/60 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all">
                     <img 
                       src={win.image} 
                       alt={win.game} 
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                     
                     <div className="absolute top-1 right-1 bg-black/80 border border-emerald-500/50 text-emerald-400 text-[7px] md:text-[8px] font-black px-1 py-0.5 rounded-[2px] shadow-[0_0_8px_rgba(16,185,129,0.4)] backdrop-blur-sm z-10">
                       {win.multiplier}
                     </div>
                     
                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-1 w-full justify-center px-0.5 mb-1">
                     <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] flex items-center justify-center rounded-[2px] bg-gradient-to-br from-yellow-400 to-yellow-600 text-[5px] md:text-[6px] text-black font-bold" title={\`VIP Level \${Math.floor(win.userRank / 10) + 1}\`}>V{Math.floor(win.userRank / 10) + 1}</div>
                     <span className="text-gray-400 font-semibold text-[8px] md:text-[9px] truncate tracking-wide group-hover:text-white transition-colors">{win.user}</span>
                  </div>
                  
                  {/* Payout */}
                  <span className="text-emerald-400 font-black text-[9px] md:text-[10px] tracking-wide">
                     {win.payoutRaw !== undefined ? (
                       <AnimatedCounter value={win.payoutRaw} format="currency" prefix="$" decimals={2} />
                     ) : (
                       win.payout
                     )}
                  </span>
                </div>
              </PremiumTiltCard>
            </div>
          ))}
        </div>

`;
  fs.writeFileSync(path, before + oldCode + after);
  console.log("LiveWinsTicker reverted.");
} else {
  console.log("Could not find rollbit marker in LiveWinsTicker");
}
