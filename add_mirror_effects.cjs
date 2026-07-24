const fs = require('fs');

function addMirror(file) {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add classic glossy mirror reflection to the sports nav circles using before/after pseudo elements
  content = content.replace(
    /className="w-\[64px\] h-\[64px\] md:w-\[72px\] md:h-\[72px\] rounded-full bg-gradient-to-b from-\[#1a1b1e\] to-\[#121316\] border border-white\/5 flex items-center justify-center shadow-\[inset_0_2px_10px_rgba\(255,255,255,0\.02\)\] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-\[0_20px_40px_rgba\(0,0,0,0\.8\)\] group-hover:border-white\/20 group-hover:from-\[#202126\] group-hover:to-\[#1a1b1e\] relative overflow-hidden"/g,
    'className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-full bg-gradient-to-b from-[#1a1b1e] to-[#0a0b0c] border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),_0_0_20px_rgba(16,185,129,0.3)] group-hover:border-[#10b981]/50 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:h-1/2 before:rounded-t-full before:opacity-50"'
  );

  // 2. League Container - Glass/Mirror effect
  content = content.replace(
    /className="bg-\[#101114\] border border-white\/5 border-t-white\/10 border-l-2 border-l-\[#10b981\]\/50 rounded-xl overflow-hidden shadow-2xl transition-all hover:border-l-\[#10b981\]"/g,
    'className="bg-black/40 backdrop-blur-2xl border border-white/10 border-t-white/20 border-l-2 border-l-[#10b981]/80 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-white/20"'
  );

  // 3. League Header - High gloss
  content = content.replace(
    /className="bg-gradient-to-r from-\[#151619\] to-\[#101114\] px-4 py-3 border-b border-white\/5 flex items-center gap-2"/g,
    'className="bg-gradient-to-r from-white/[0.05] to-transparent px-4 py-3 border-b border-white/5 flex items-center gap-2 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent before:h-1/2 before:pointer-events-none"'
  );

  // 4. Match Rows - Glassy alternating rows with reflection hover
  content = content.replace(
    /className="flex flex-col md:flex-row md:items-center gap-4 p-4 even:bg-\[#121316\] odd:bg-\[#101114\] hover:bg-\[#151619\] hover:shadow-\[0_0_20px_rgba\(0,0,0,0\.5\)\] transition-all duration-300"/g,
    'className="flex flex-col md:flex-row md:items-center gap-4 p-4 even:bg-white/[0.01] odd:bg-transparent hover:bg-white/[0.03] hover:backdrop-blur-md hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 relative group overflow-hidden"'
  );

  fs.writeFileSync(file, content);
}

upgradeMirror('components/sports/GercekView.tsx');

function upgradeMirror(file) { fixMirror(file) }
function fixMirror(file) {
  addMirror(file);
}

console.log("Mirror effects applied");
