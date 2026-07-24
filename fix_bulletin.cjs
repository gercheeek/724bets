const fs = require('fs');
let view = fs.readFileSync('components/UpcomingMatchesView.tsx', 'utf8');

// 1. Overall Backgrounds
view = view.replace(/bg-\[#111111\]/g, 'bg-[#0a0a0a]');
view = view.replace(/bg-white\/\[0\.02\]/g, 'bg-[#0a0a0a]');

// 2. Active Sport Tab
view = view.replace(
  /'bg-\[#10b981\] text-white shadow-\[0_4px_12px_rgba\(16,185,129,0\.3\)\] border border-\[#10b981\]'/g,
  "'bg-[#10b981] text-black shadow-[0_0_15px_rgba(16,185,129,0.5)] font-bold border-none'"
);
view = view.replace(
  /'bg-\[#111111\] text-slate-400 hover:bg-white\/\[0\.05\] hover:text-gray-200 border border-white\/5'/g,
  "'bg-[#050505] text-slate-400 hover:bg-[#1a1d29] hover:text-white border border-white/5'"
);

// 3. League Header Styling
view = view.replace(
  /className="text-\[12px\] font-bold text-white tracking-wide uppercase"/g,
  'className="text-[12px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#d946ef] drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] tracking-wide uppercase"'
);

// 4. Odds Buttons
view = view.replace(
  /'border-white\/5 bg-white\/\[0\.03\] text-gray-300 hover:bg-white\/\[0\.06\] hover:border-white\/\[0\.1\] hover:text-\[#10b981\]'/g,
  "'border-white/5 bg-[#111111] text-white hover:bg-[#10b981]/10 hover:border-[#10b981]/50 hover:text-[#10b981] group/odd transition-all duration-300'"
);

// 5. Active Odds Button
view = view.replace(
  /'bg-\[#10b981\]\/10 border-\[#10b981\]\/50 text-white shadow-\[0_0_15px_rgba\(16,185,129,0\.15\)\]'/g,
  "'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.5)] border-none'"
);

// 6. Match Row Hover
view = view.replace(
  /hover:bg-white\/\[0\.03\]/g,
  'hover:bg-[#10b981]/5 group-hover:shadow-[inset_2px_0_0_#10b981]'
);
view = view.replace(
  /flex items-center px-3 py-3 hover:bg-\[#10b981\]\/5 group-hover:shadow-\[inset_2px_0_0_#10b981\] transition-colors/g,
  'flex items-center px-3 py-3 hover:bg-[#10b981]/5 hover:shadow-[inset_2px_0_0_#10b981] transition-all duration-300 cursor-pointer'
);

// 7. '+x' More Markets Button
view = view.replace(
  /rounded border border-\[#10b981\]\/30 bg-\[#10b981\]\/10 flex items-center justify-center hover:bg-\[#10b981\]\/20/g,
  'rounded border border-purple-500/30 bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/50'
);
view = view.replace(
  /text-\[#10b981\] tabular-nums">/g,
  'text-purple-400 tabular-nums">'
);

fs.writeFileSync('components/UpcomingMatchesView.tsx', view);
console.log("Bulletin updated");
