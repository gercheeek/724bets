const fs = require('fs');

// 1. SportsBanners.tsx: Text contrast and pagination dots spacing
let sb = fs.readFileSync('components/SportsBanners.tsx', 'utf8');
sb = sb.replace(
  /<span className="text-\[\#00E701\] font-bold drop-shadow-\[0_0_8px_rgba\(0,231,1,0\.5\)\]">%300 bonusu kap!<\/span>/g,
  '<span className="text-white font-black drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">%300 bonusu kap!</span>'
);
sb = sb.replace(
  /absolute bottom-6 md:bottom-10 left-6 md:left-12 flex gap-2 z-30/g,
  'absolute bottom-8 md:bottom-12 left-6 md:left-12 flex gap-2 z-30'
);
fs.writeFileSync('components/SportsBanners.tsx', sb);

// 2. Header.tsx: Match Bonusla Basla button gradient
let hd = fs.readFileSync('components/Header.tsx', 'utf8');
hd = hd.replace(
  /className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-\[\#050505\] shadow-\[0_0_15px_rgba\(16,185,129,0\.3\)\] hover:shadow-\[0_0_25px_rgba\(16,185,129,0\.6\)\] rounded-lg font-bold/g,
  'className="flex items-center justify-center bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#00E676] hover:to-[#10b981] border-none text-[#050505] shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] rounded-lg font-bold'
);
fs.writeFileSync('components/Header.tsx', hd);

// 3. LiveWinsTicker.tsx: Move text info to absolute corners over the card
let lw = fs.readFileSync('components/LiveWinsTicker.tsx', 'utf8');
lw = lw.replace(
  /{ \/\* User Info \*\/ }[\s\S]*?<div className="flex items-center gap-1 w-full justify-center px-0\.5 mb-0\.5">[\s\S]*?<span className="text-gray-400 font-semibold text-\[8px\] md:text-\[9px\] truncate tracking-wide group-hover:text-white transition-colors">\{win\.user\}<\/span>[\s\S]*?<\/div>[\s\S]*?{ \/\* Payout \*\/ }[\s\S]*?<span className="text-emerald-400 font-black text-\[9px\] md:text-\[10px\] tracking-wide">[\s\S]*?\{win\.payout\}[\s\S]*?<\/span>/m,
  ''
);

lw = lw.replace(
  /<div className="absolute inset-0 bg-black\/0 group-hover:bg-black\/20 transition-colors duration-300" \/>/g,
  `<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                 
                 {/* Username Badge Top Left */}
                 <div className="absolute top-1 left-1 z-20">
                   <span className="bg-black/70 backdrop-blur-sm border border-white/10 text-white font-semibold text-[8px] px-1.5 py-0.5 rounded shadow-lg">{win.user}</span>
                 </div>
                 
                 {/* Payout Badge Top Right */}
                 <div className="absolute top-1 right-1 z-20">
                   <span className="bg-emerald-500/90 backdrop-blur-sm border border-emerald-400 text-black font-black text-[9px] px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.4)]">{win.multiplier}</span>
                 </div>`
);
fs.writeFileSync('components/LiveWinsTicker.tsx', lw);

console.log("Success");
