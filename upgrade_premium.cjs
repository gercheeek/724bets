const fs = require('fs');
let content = fs.readFileSync('components/sports/GercekView.tsx', 'utf8');

// Borders and dividers
content = content.replace(/border-\[#1b2335\]/g, 'border-white/5');
content = content.replace(/divide-\[#1b2335\]\/50/g, 'divide-white/5');
content = content.replace(/border-\[#222d44\]/g, 'border-white/5');

// Active selected bets (currently blue) -> Premium Green
content = content.replace(/bg-blue-600\/30 border-blue-500 text-blue-300/g, 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent');

// Odds buttons background (currently #18191c) -> make it #141518 and hover #1f2025 for better depth
// In the file it's: bg-[#18191c] border-[#222d44] hover:bg-[#25262b] text-slate-300
content = content.replace(/bg-\[#18191c\] border-white\/5 hover:bg-\[#25262b\] text-slate-300/g, 'bg-[#151619] border-white/5 hover:border-white/20 hover:bg-[#1f2025] text-gray-300 hover:text-white');

// Time color (currently blue text-[#3b82f6]) -> Premium Green or Amber
content = content.replace(/text-\[#3b82f6\]/g, 'text-[#10b981]');

// Hover on rows (currently hover:bg-[#101114]/40) -> Premium hover
content = content.replace(/hover:bg-\[#101114\]\/40 transition-colors/g, 'hover:bg-[#151619]/50 hover:shadow-lg transition-all duration-300');

// League Header (currently bg-[#101114]) -> Add a subtle gradient for depth
content = content.replace(/className="bg-\[#101114\] px-4 py-3 border-b border-white\/5 flex items-center gap-2"/g, 'className="bg-gradient-to-r from-[#151619] to-[#101114] px-4 py-3 border-b border-white/5 flex items-center gap-2"');

fs.writeFileSync('components/sports/GercekView.tsx', content);
console.log("Upgraded GercekView to premium.");
