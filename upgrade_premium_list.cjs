const fs = require('fs');
let content = fs.readFileSync('components/sports/MatchListV2.tsx', 'utf8');

// Apply similar premium upgrades to MatchListV2
content = content.replace(/border-\[#1b2335\]/g, 'border-white/5');
content = content.replace(/divide-\[#1b2335\]\/50/g, 'divide-white/5');
content = content.replace(/border-\[#222d44\]/g, 'border-white/5');
content = content.replace(/text-\[#3b82f6\]/g, 'text-[#10b981]');
content = content.replace(/bg-blue-600\/30 border-blue-500 text-blue-300/g, 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent');
content = content.replace(/bg-\[#18191c\] border-white\/5 hover:bg-\[#25262b\] text-slate-300/g, 'bg-[#151619] border-white/5 hover:border-white/20 hover:bg-[#1f2025] text-gray-300 hover:text-white');

fs.writeFileSync('components/sports/MatchListV2.tsx', content);

let cardContent = fs.readFileSync('components/sports/MatchCardV2.tsx', 'utf8');
cardContent = cardContent.replace(/border-\[#1b2335\]/g, 'border-white/5');
cardContent = cardContent.replace(/border-\[#222d44\]/g, 'border-white/5');
cardContent = cardContent.replace(/bg-blue-600\/30 border-blue-500 text-blue-300/g, 'bg-[#10b981] text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] border-transparent');
fs.writeFileSync('components/sports/MatchCardV2.tsx', cardContent);

console.log("Upgraded MatchListV2 and MatchCardV2.");
