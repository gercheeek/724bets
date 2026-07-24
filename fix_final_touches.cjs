const fs = require('fs');

// 1. SportsBanners.tsx Pagination Dots
let sb = fs.readFileSync('components/SportsBanners.tsx', 'utf8');
// Move higher: bottom-4 -> bottom-8
sb = sb.replace(/absolute bottom-4 md:bottom-6 left-6 md:left-12 flex gap-2 z-30/g, 'absolute bottom-6 md:bottom-10 left-6 md:left-12 flex gap-2 z-30');
// Active color: bg-white -> bg-[#10b981]
sb = sb.replace(
  /w-8 md:w-12 bg-white shadow-\[0_0_10px_rgba\(255,255,255,0\.8\)\]/g, 
  'w-8 md:w-12 bg-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.9)]'
);
fs.writeFileSync('components/SportsBanners.tsx', sb);

// 2. GuestLanding.tsx Play buttons default glow
let gl = fs.readFileSync('components/GuestLanding.tsx', 'utf8');
gl = gl.replace(
  /absolute inset-\[6px\] bg-\[\#10b981\]\/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-\[\#10b981\] shadow-\[0_0_15px_rgba\(16,185,129,0\.3\)\] group-hover:shadow-\[0_0_25px_rgba\(16,185,129,0\.7\)\] transition-all duration-500 cursor-pointer group-hover:scale-110/g,
  'absolute inset-[6px] bg-[#10b981]/40 border border-[#10b981]/50 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.9)] transition-all duration-500 cursor-pointer group-hover:scale-110'
);
fs.writeFileSync('components/GuestLanding.tsx', gl);

// 3. LiveWinsTicker.tsx Breathing space
let lw = fs.readFileSync('components/LiveWinsTicker.tsx', 'utf8');
// Increase pt-4 to pt-8 so CANLI badge has room
lw = lw.replace(/pt-4 pb-2/g, 'pt-7 pb-3');
lw = lw.replace(/absolute top-0 left-4/g, 'absolute top-0 left-4 md:left-6');
fs.writeFileSync('components/LiveWinsTicker.tsx', lw);

console.log("Success");
