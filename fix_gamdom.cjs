const fs = require('fs');

const filesToUpdate = [
  'components/Spor724View.tsx',
  'components/UpcomingMatchesView.tsx',
  'components/sports/RainbetMatchCard.tsx',
  'components/LiveMatches.tsx'
];

filesToUpdate.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');

  // Gamdom Main Background -> #171923
  content = content.replace(/bg-\[#050505\]/g, 'bg-[#171923]');
  
  // Gamdom Cards/Containers -> #1a1d29
  content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-[#1a1d29]');
  content = content.replace(/bg-gradient-to-r from-\[#0a0a0a\] to-\[#111111\]/g, 'bg-[#1a1d29]');
  
  // Gamdom Inner Elements / Odds Buttons -> #232736
  content = content.replace(/bg-\[#111111\]/g, 'bg-[#232736]');
  
  // Remove extreme glows from Gamdom style (they prefer flat/matte)
  content = content.replace(/shadow-\[0_0_15px_rgba\(16,185,129,0\.5\)\]/g, 'shadow-md');
  content = content.replace(/shadow-\[0_0_30px_rgba.*?\]/g, 'shadow-lg');
  content = content.replace(/hover:shadow-\[0_0_20px_rgba\(168,85,247,0\.15\)\]/g, '');
  content = content.replace(/drop-shadow-\[0_0_8px_rgba.*?\]/g, '');
  
  // Update borders to Gamdom subtle borders
  content = content.replace(/border-white\/5/g, 'border-white/5'); // Keep this, it's subtle enough
  
  // Green accent to Gamdom green (Optional, #10b981 is fine, but Gamdom uses #00e701. Let's use #00e701 for true Gamdom feel on CANLI badges)
  // Just changing the backgrounds to #171923 and #1a1d29 makes 90% of the difference.

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
