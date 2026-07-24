const fs = require('fs');

let appContent = fs.readFileSync('App.tsx', 'utf8');
appContent = appContent.replace(/bg-\[\#141722\]/g, 'bg-[#050505]');
fs.writeFileSync('App.tsx', appContent);

let chatContent = fs.readFileSync('components/ModernChat.tsx', 'utf8');
chatContent = chatContent.replace(/bg-\[\#141722\]/g, 'bg-transparent');
chatContent = chatContent.replace(/bg-\[\#1c202f\]/g, 'bg-[#111111]');
chatContent = chatContent.replace(/bg-\[\#252a3d\]/g, 'bg-[#1a1a1a]');
chatContent = chatContent.replace(/bg-\[\#2a3046\]/g, 'bg-[#222222]');
chatContent = chatContent.replace(/bg-\[\#1a1e2b\]/g, 'bg-[#0f0f0f]');

// Remove the purpleish borders if any
chatContent = chatContent.replace(/border-white\/10/g, 'border-white/5');

fs.writeFileSync('components/ModernChat.tsx', chatContent);
console.log('Theme fixed to match 724bets dark mode.');
