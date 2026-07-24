const fs = require('fs');

// 1. Header.tsx
let header = fs.readFileSync('components/Header.tsx', 'utf8');

header = header.replace(
  /<button\s+onClick=\{onMemberRegisterClick\}\s+className="flex items-center justify-center bg-gradient-to-r from-\[#10b981\] to-\[#059669\] hover:from-\[#00E676\] hover:to-\[#10b981\] border-none text-\[#050505\] shadow-\[0_0_15px_rgba\(16,185,129,0\.3\)\] hover:shadow-\[0_0_25px_rgba\(16,185,129,0\.6\)\] rounded-lg font-bold text-\[13px\] md:text-\[14px\] h-\[38px\] md:h-\[42px\] px-4 md:px-5 transition-all duration-300 whitespace-nowrap transform hover:-translate-y-0\.5"\s*>\s*Bonusla Başla\s*<\/button>/g,
  `<button
                onClick={onMemberRegisterClick}
                className="relative overflow-hidden group flex items-center justify-center bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#00E676] hover:to-[#10b981] border-none text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] rounded-lg font-black text-[13px] md:text-[14px] h-[38px] md:h-[42px] px-5 md:px-6 transition-all duration-300 whitespace-nowrap transform hover:-translate-y-0.5 tracking-wider uppercase"
              >
                <span className="relative z-10 drop-shadow-md">Bonusla Başla</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              </button>`
);

header = header.replace(
  /text-\[20px\] md:text-\[24px\] font-black tracking-tight text-white transition-all group-hover:scale-105 group-hover:drop-shadow-\[0_0_10px_rgba\(255,255,255,0\.3\)\]/g,
  "text-[24px] md:text-[28px] font-black tracking-tighter text-white transition-all group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
);

fs.writeFileSync('components/Header.tsx', header);

// 2. Spor724View.tsx
let spor = fs.readFileSync('components/Spor724View.tsx', 'utf8');

spor = spor.replace(/bg-\[#0f1016\]/g, 'bg-[#050505]');
spor = spor.replace(/bg-\[#1a1d29\]/g, 'bg-[#0a0a0a]');
spor = spor.replace(/border-\[#23273a\]/g, 'border-white/5');

// Update Canlı Bahisler title with Purple gradient
spor = spor.replace(
  /<span className="ml-1 relative z-10 text-white drop-shadow-\[0_0_8px_rgba\(255,255,255,0\.5\)\]">Canlı Bahisler<\/span>/g,
  '<span className="ml-1 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#d946ef] drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">Canlı Bahisler</span>'
);

// Update Yaklaşan Maçlar title with Purple gradient
spor = spor.replace(
  /<Clock className="text-\[#10b981\]" size=\{24\} \/>\s*<span className="drop-shadow-\[0_0_8px_rgba\(255,255,255,0\.5\)\]">Yaklaşan Maçlar<\/span>/g,
  '<Clock className="text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" size={24} />\n                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#d946ef] drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">Yaklaşan Maçlar</span>'
);

// Update Sidebar active state from Blue to Neon Green in Spor724View
spor = spor.replace(/bg-\[#3b82f6\] text-white/g, 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]');

fs.writeFileSync('components/Spor724View.tsx', spor);


// 3. RainbetTopNav.tsx
let nav = fs.readFileSync('components/sports/RainbetTopNav.tsx', 'utf8');
nav = nav.replace(/bg-\[#3b82f6\] text-white shadow-\[0_4px_12px_rgba\(59,130,246,0\.3\)\]/g, 'bg-[#10b981] text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]');
nav = nav.replace(/text-\[#3b82f6\]/g, 'text-[#10b981]');
nav = nav.replace(/border-\[#3b82f6\]/g, 'border-[#10b981]');
fs.writeFileSync('components/sports/RainbetTopNav.tsx', nav);


// 4. RainbetMatchCard.tsx
let card = fs.readFileSync('components/sports/RainbetMatchCard.tsx', 'utf8');

// Match Card wrapper
card = card.replace(
  /className="bg-\[#1a1d29\] rounded border border-\[#23273a\] p-3 hover:-translate-y-0\.5 transition-transform duration-200 cursor-pointer flex flex-col"/g,
  'className="bg-[#0a0a0a] rounded-xl border border-white/5 p-3 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden group"'
);

// Odds wrapper 1
card = card.replace(
  /<div className="flex-1 flex justify-between items-center bg-\[#23273a\] hover:bg-\[#2f3448\] px-2\.5 py-1\.5 rounded transition-colors text-white text-\[12px\] font-medium cursor-pointer">\s*<span className="text-\[#8e939d\]">1<\/span>\s*<span>\{match\.homeOdd\}<\/span>\s*<\/div>/g,
  `<div className="flex-1 flex justify-between items-center bg-[#111111] border border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/10 px-2.5 py-1.5 rounded-lg transition-all duration-300 text-white text-[12px] font-medium cursor-pointer group/odd">
                    <span className="text-[#8e939d] group-hover/odd:text-white transition-colors">1</span>
                    <span className="group-hover/odd:text-[#10b981] group-hover/odd:drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all font-bold">{match.homeOdd}</span>
                </div>`
);

// Odds wrapper 2 (X)
card = card.replace(
  /<div className="flex-1 flex justify-between items-center bg-\[#23273a\] hover:bg-\[#2f3448\] px-2\.5 py-1\.5 rounded transition-colors text-white text-\[12px\] font-medium cursor-pointer">\s*<span className="text-\[#8e939d\]">X<\/span>\s*<span>\{match\.drawOdd\}<\/span>\s*<\/div>/g,
  `<div className="flex-1 flex justify-between items-center bg-[#111111] border border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/10 px-2.5 py-1.5 rounded-lg transition-all duration-300 text-white text-[12px] font-medium cursor-pointer group/odd">
                        <span className="text-[#8e939d] group-hover/odd:text-white transition-colors">X</span>
                        <span className="group-hover/odd:text-[#10b981] group-hover/odd:drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all font-bold">{match.drawOdd}</span>
                    </div>`
);

// Odds wrapper 3 (2)
card = card.replace(
  /<div className="flex-1 flex justify-between items-center bg-\[#23273a\] hover:bg-\[#2f3448\] px-2\.5 py-1\.5 rounded transition-colors text-white text-\[12px\] font-medium cursor-pointer">\s*<span className="text-\[#8e939d\]">2<\/span>\s*<span>\{match\.awayOdd\}<\/span>\s*<\/div>/g,
  `<div className="flex-1 flex justify-between items-center bg-[#111111] border border-white/5 hover:border-[#10b981]/50 hover:bg-[#10b981]/10 px-2.5 py-1.5 rounded-lg transition-all duration-300 text-white text-[12px] font-medium cursor-pointer group/odd">
                    <span className="text-[#8e939d] group-hover/odd:text-white transition-colors">2</span>
                    <span className="group-hover/odd:text-[#10b981] group-hover/odd:drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] transition-all font-bold">{match.awayOdd}</span>
                </div>`
);

// Live Score background inside the card
card = card.replace(/bg-\[#141621\] border border-\[#23273a\]/g, 'bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]');
card = card.replace(/text-\[#e2e8f0\] font-bold text-\[13px\] bg-\[#141621\]/g, 'text-purple-400 font-black text-[14px] bg-purple-500/20'); // In case it misses the first

fs.writeFileSync('components/sports/RainbetMatchCard.tsx', card);

console.log("Styling applied to sports section");
