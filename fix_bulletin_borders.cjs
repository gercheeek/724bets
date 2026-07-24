const fs = require('fs');
let view = fs.readFileSync('components/UpcomingMatchesView.tsx', 'utf8');

// League Header frame - make it look like a floating card header with neon top border
view = view.replace(
  /className="flex items-center justify-between px-3 py-2 bg-\[#0a0a0a\] rounded-t-lg border-b border-white\/5"/g,
  'className="flex items-center justify-between px-3 py-2.5 bg-gradient-to-r from-[#0a0a0a] to-[#111111] rounded-t-xl border-t border-t-purple-500/30 border-b border-b-white/5 shadow-[0_-4px_20px_rgba(168,85,247,0.05)]"'
);

// Matches container frame
view = view.replace(
  /className="flex flex-col border border-white\/5 rounded-b-lg overflow-hidden bg-\[#0a0a0a\]"/g,
  'className="flex flex-col border border-white/5 border-t-0 rounded-b-xl overflow-hidden bg-[#0a0a0a] shadow-xl"'
);

fs.writeFileSync('components/UpcomingMatchesView.tsx', view);
console.log("Bulletin frames upgraded.");
