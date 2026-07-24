const fs = require('fs');

function fixRed(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // 1. Live minute badge - change red to green (emerald) to match the brand and remove red
  content = content.replace(/bg-red-500\/10 border-red-500\/20/g, 'bg-[#10b981]/10 border-[#10b981]/20');
  content = content.replace(/shadow-\[0_0_10px_rgba\(239,68,68,0\.1\)\]/g, 'shadow-[0_0_10px_rgba(16,185,129,0.1)]');
  content = content.replace(/bg-red-500/g, 'bg-[#10b981]');
  content = content.replace(/text-red-500/g, 'text-[#10b981]');

  // 2. The header red pulse shadow
  content = content.replace(/shadow-\[0_0_10px_rgba\(239,68,68,0\.6\)\]/g, 'shadow-[0_0_10px_rgba(16,185,129,0.6)]');

  // 3. Make the score badge look even more sophisticated (glass instead of solid dark)
  content = content.replace(/className="bg-\[#0a0b0d\] border border-white\/5 rounded px-2\.5 py-0\.5 min-w-\[32px\] flex items-center justify-center shadow-\[inset_0_2px_4px_rgba\(0,0,0,0\.5\)\]"/g,
  'className="bg-black/40 border border-white/10 rounded px-2.5 py-0.5 min-w-[32px] flex items-center justify-center backdrop-blur-sm shadow-inner"');

  // 4. Subtle odds box improvements
  content = content.replace(/'bg-gradient-to-b from-\[#1a1b1e\] to-\[#151619\] border border-white\/5 border-t-white\/10 shadow-\[0_2px_4px_rgba\(0,0,0,0\.4\)\] hover:border-white\/20 hover:from-\[#202126\] hover:to-\[#1a1b1e\] text-gray-300 hover:text-white'/g,
  "'bg-[#16171a] border border-white/5 border-t-white/10 hover:bg-[#1c1d22] hover:border-white/20 text-slate-300 hover:text-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]'");

  fs.writeFileSync(file, content);
}

fixRed('components/sports/GercekView.tsx');
fixRed('components/sports/MatchListV2.tsx');
fixRed('components/sports/MatchCardV2.tsx');
console.log("Removed red and made it more sophisticated");
