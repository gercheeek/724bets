const fs = require('fs');
const path = '/Users/alex/Desktop/7_24bets-landing-page/components/VIPRafflePromo.tsx';
let content = fs.readFileSync(path, 'utf8');

// Colors replacement map
const replacements = [
    [/amber-100/g, 'cyan-100'],
    [/amber-200/g, 'cyan-200'],
    [/amber-300/g, 'cyan-300'],
    [/amber-400/g, 'cyan-400'],
    [/amber-500/g, 'cyan-500'],
    [/amber-600/g, 'cyan-600'],
    [/amber-700/g, 'cyan-700'],
    [/text-amber-950/g, 'text-[#0A0D14]'],
    [/yellow-400/g, 'cyan-400'],
    [/yellow-500/g, 'cyan-500'],
    [/yellow-600/g, 'cyan-600'],
    [/rgba\(245,166,35,/g, 'rgba(0,229,255,'],
    [/rgba\(251,191,36,/g, 'rgba(0,229,255,'],
    [/rgba\(212,175,55,/g, 'rgba(0,229,255,'],
    [/rgba\(250,204,21,/g, 'rgba(0,229,255,'],
    [/gold-gradient-text/g, 'text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-cyan-300'],
    // Make the main action button use the #00E5FF cyan
    [/bg-cyan-400/g, 'bg-[#00E5FF]'], // just in case
];

for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Colors updated successfully in VIPRafflePromo.tsx');
