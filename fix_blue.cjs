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

  // Replace the bluish dark slate with neutral graphite/charcoal
  
  // Main background
  content = content.replace(/bg-\[#171923\]/g, 'bg-[#101114]');
  
  // Cards / rows
  content = content.replace(/bg-\[#1a1d29\]/g, 'bg-[#18191c]');
  
  // Odds buttons / inner elements
  content = content.replace(/bg-\[#232736\]/g, 'bg-[#25262b]');
  
  fs.writeFileSync(file, content);
  console.log(`Removed blue tint from ${file}`);
});
