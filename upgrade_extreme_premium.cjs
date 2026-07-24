const fs = require('fs');

function upgradeExtreme(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // 1. Live Minute Pill Badge (replaces the simple dot and text)
  content = content.replace(/<div className="flex items-center gap-2">\s*<div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Canlı" \/>\s*<span className="text-\[#10b981\] text-\[13px\] font-black tracking-tight">\{match\.minute\}<\/span>\s*<\/div>/g, 
  '<div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(239,68,68,0.1)]"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /><span className="text-red-500 text-[11px] font-black tracking-widest">{match.minute}\'</span></div>');

  // 2. Odds Buttons 3D Glass Effect
  content = content.replace(/'bg-\[#151619\] border-white\/5 hover:border-white\/20 hover:bg-\[#1f2025\] text-gray-300 hover:text-white'/g, 
  "'bg-gradient-to-b from-[#1a1b1e] to-[#151619] border border-white/5 border-t-white/10 shadow-[0_2px_4px_rgba(0,0,0,0.4)] hover:border-white/20 hover:from-[#202126] hover:to-[#1a1b1e] text-gray-300 hover:text-white'");

  // 3. League Container Left Accent
  content = content.replace(/className="bg-\[#101114\] border border-white\/5 border-t-white\/10 rounded-xl overflow-hidden shadow-2xl"/g, 
  'className="bg-[#101114] border border-white/5 border-t-white/10 border-l-2 border-l-[#10b981]/50 rounded-xl overflow-hidden shadow-2xl transition-all hover:border-l-[#10b981]"');

  // 4. Alternating Row Colors & Team Name Shadow
  content = content.replace(/className="flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-\[#151619\]\/50 hover:shadow-lg transition-all duration-300"/g, 
  'className="flex flex-col md:flex-row md:items-center gap-4 p-4 even:bg-[#121316] odd:bg-[#101114] hover:bg-[#151619] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300"');

  // Add text-shadow to team names
  content = content.replace(/className="text-\[15px\] font-black text-white truncate tracking-tight"/g, 
  'className="text-[15px] font-black text-white truncate tracking-tight drop-shadow-md"');

  // 5. Score Badge refinement (darker background, glowing green text)
  content = content.replace(/className="bg-\[#1a1b1e\] border border-white\/5 rounded px-2\.5 py-0\.5 min-w-\[32px\] flex items-center justify-center shadow-inner"/g,
  'className="bg-[#0a0b0d] border border-white/5 rounded px-2.5 py-0.5 min-w-[32px] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"');

  fs.writeFileSync(file, content);
}

upgradeExtreme('components/sports/GercekView.tsx');
upgradeExtreme('components/sports/MatchListV2.tsx');
upgradeExtreme('components/sports/MatchCardV2.tsx');
console.log("Extreme premium upgrades applied");
