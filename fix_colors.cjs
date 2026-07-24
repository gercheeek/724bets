const fs = require('fs');

let content = fs.readFileSync('components/ModernChat.tsx', 'utf8');

// Container
content = content.replace(/bg-\[\#0F111A\]/g, 'bg-transparent');

// Header and Input wrappers (were #141722)
// Since container is now transparent (inheriting App.tsx's #141722), we can make them transparent or slightly lighter
content = content.replace(/bg-\[\#141722\]/g, 'bg-[#141722]'); // Keep it, or maybe use bg-transparent

// Buttons and Inputs (were #1f2330, #1a1e2d)
content = content.replace(/bg-\[\#1a1e2d\]/g, 'bg-[#1c202f]');
content = content.replace(/bg-\[\#1f2330\]/g, 'bg-[#1c202f]');
content = content.replace(/bg-\[\#202538\]/g, 'bg-[#252a3d]');
content = content.replace(/bg-\[\#2a2f40\]/g, 'bg-[#2a3046]');
content = content.replace(/bg-\[\#161925\]/g, 'bg-[#1a1e2b]');

// Make the "Henüz kimse yok" message look better
content = content.replace(/bg-white\/5 px-4 py-2/g, 'bg-[#1c202f] border border-white/5 px-4 py-3');

fs.writeFileSync('components/ModernChat.tsx', content);
console.log('Colors updated.');
