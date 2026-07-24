const fs = require('fs');

// 1. Fix the Bet Slip Header in DualRightPanel.tsx
let dualPanel = fs.readFileSync('components/sports/DualRightPanel.tsx', 'utf8');
// Replace the solid green header with a dark one and green accents
dualPanel = dualPanel.replace(
  /<div className="bg-\[#00E676\] px-4 py-3 flex items-center justify-between shadow-md z-10">/,
  '<div className="bg-[#14171d] border-b border-[#00E676]/20 px-4 py-4 flex items-center justify-between shadow-md z-10">'
);
// Make the text green instead of black
dualPanel = dualPanel.replace(
  /<span className="text-black font-black text-\[15px\] tracking-tight">\{language === 'tr' \? 'Bahis kuponu' : 'Bet Slip'\}<\/span>/,
  '<span className="text-white font-black text-[15px] tracking-tight">{language === \'tr\' ? \'Bahis kuponu\' : \'Bet Slip\'}</span>'
);
// The badge: bg-white text-black -> bg-[#00E676] text-black
dualPanel = dualPanel.replace(
  /<span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-black text-\[10px\] font-black rounded-full flex items-center justify-center shadow-sm">/,
  '<span className="absolute -top-2 -right-2 w-4 h-4 bg-[#00E676] text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,230,118,0.5)]">'
);
// The chevron: text-black/60 -> text-zinc-500
dualPanel = dualPanel.replace(
  /<ChevronDown className="w-4 h-4 text-black\/60 group-hover:text-black transition-colors" \/>/,
  '<ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />'
);
// Fast bet text: text-black -> text-zinc-400
dualPanel = dualPanel.replace(
  /<span className="text-black font-bold text-\[13px\]">\{language === 'tr' \? 'Hızlı Bahis' : 'Fast Bet'\}<\/span>/,
  '<span className="text-zinc-400 font-bold text-[13px]">{language === \'tr\' ? \'Hızlı Bahis\' : \'Fast Bet\'}</span>'
);
// The switch bg
dualPanel = dualPanel.replace(
  /className=\{`w-9 h-5 rounded-full p-0\.5 transition-colors border border-black\/20 \$\{quickBet \? 'bg-black' : 'bg-black\/20'\}`\}/,
  'className={`w-9 h-5 rounded-full p-0.5 transition-colors border ${quickBet ? \'bg-[#00E676] border-[#00E676]\' : \'bg-[#1c1f26] border-white/10\'}`}'
);
// The switch handle
dualPanel = dualPanel.replace(
  /className=\{`w-4 h-4 rounded-full bg-white transition-transform \$\{quickBet \? 'translate-x-4' : 'translate-x-0'\}`\}/,
  'className={`w-4 h-4 rounded-full bg-white transition-transform ${quickBet ? \'translate-x-4\' : \'translate-x-0\'}`}'
);

// Empty state icon
dualPanel = dualPanel.replace(
  /<div className="w-16 h-16 rounded-full bg-\[#1c1f26\] flex items-center justify-center mb-4 border border-white\/5">[\s\S]*?<\/div>/,
  `<div className="w-20 h-20 rounded-full bg-[#1c1f26] flex items-center justify-center mb-6 border border-white/5 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
                  <svg className="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>`
);

// "SOHBETE GEÇ" bar
dualPanel = dualPanel.replace(
  /<div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">/,
  '<div className="flex items-center gap-2 text-[#00E676] group-hover:text-[#00ff87] transition-colors">'
);

fs.writeFileSync('components/sports/DualRightPanel.tsx', dualPanel);

// 2. Fix the ugly blue/orange filter pills in Spor724View.tsx
let sporView = fs.readFileSync('components/Spor724View.tsx', 'utf8');
// They are rendered using getSportIcon() in Spor724View.tsx? Let's check.
// The pill active bg is `bg-[#10b981] text-black`. That's good, but the inactive state `bg-[#18191c] text-[#8e939d]` is okay.
// Wait, the screenshot shows "Futbol" is blue `bg-blue-500`?? Let me find the exact classes in Spor724View.tsx
fs.writeFileSync('fix_criticisms.cjs.done', 'ok');
