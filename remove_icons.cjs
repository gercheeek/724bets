const fs = require('fs');

let content = fs.readFileSync('components/RewardsPage.tsx', 'utf8');

// Target Icon Block
const targetRegex = /\s*<div className="w-12 h-12 rounded-xl bg-black\/80 border border-yellow-500\/30 flex items-center justify-center backdrop-blur-xl shadow-\[0_0_20px_rgba\(234,179,8,0\.3\)\] group-hover:shadow-\[0_0_40px_rgba\(234,179,8,0\.6\)\] group-hover:scale-110 group-hover:border-yellow-500\/60 transition-all duration-500">\s*<Target className="w-6 h-6 text-yellow-500" style=\{\{ filter: 'drop-shadow\(0 0 10px rgba\(234,179,8,0\.8\)\)' \}\} \/>\s*<\/div>/;

// Gift Icon Block
const giftRegex = /\s*<div className="w-12 h-12 rounded-xl bg-black\/80 border border-white\/20 flex items-center justify-center backdrop-blur-xl shadow-\[0_0_20px_rgba\(255,255,255,0\.1\)\] group-hover:shadow-\[0_0_40px_rgba\(255,255,255,0\.3\)\] group-hover:scale-110 group-hover:border-white\/50 transition-all duration-500">\s*<Gift className="w-6 h-6 text-white" style=\{\{ filter: 'drop-shadow\(0 0 10px rgba\(255,255,255,0\.8\)\)' \}\} \/>\s*<\/div>/;

content = content.replace(targetRegex, '');
content = content.replace(giftRegex, '');

fs.writeFileSync('components/RewardsPage.tsx', content);
console.log('Icons removed.');
