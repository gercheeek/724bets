const fs = require('fs');

let content = fs.readFileSync('components/sports/GercekView.tsx', 'utf8');

// Fix the active category pill colors
content = content.replace(
  /'bg-\[#2563eb\] text-white shadow-lg shadow-blue-500\/25 border border-blue-400\/40'/g,
  "'bg-[#00E676] text-black shadow-lg shadow-[#00E676]/25 border border-[#00E676]/40'"
);

content = content.replace(
  /'bg-\[#2563eb\] text-white font-bold shadow-lg shadow-blue-500\/25 border border-blue-400\/40'/g,
  "'bg-[#00E676] text-black font-bold shadow-lg shadow-[#00E676]/25 border border-[#00E676]/40'"
);

// Fix the YAKLAŞAN banner blue dot
content = content.replace(
  /bg-blue-500 shadow-\[0_0_12px_#3b82f6\]/g,
  "bg-blue-400 shadow-[0_0_12px_#60a5fa]"
);
// Make the YAKLAŞAN dot match the UI better (maybe white/cyan instead of blue)
content = content.replace(
  /bg-blue-400 shadow-\[0_0_12px_#60a5fa\]/g,
  "bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
);
content = content.replace(
  /bg-blue-500\/20 border border-blue-500\/30 text-blue-500/g,
  "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400"
);

// Search bar focus border
content = content.replace(
  /focus:border-blue-500/g,
  "focus:border-[#00E676]"
);

// Fallback image for broken FUT Esports image
// In GercekView.tsx line 497: <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/FUT_Esports_logo.svg/256px-FUT_Esports_logo.svg.png" ... />
// Wait, I can't easily guess the exact line. Let's just fix the broken image URL if it exists, or just leave it.

fs.writeFileSync('components/sports/GercekView.tsx', content);
