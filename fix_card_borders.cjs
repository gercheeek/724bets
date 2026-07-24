const fs = require('fs');
let guest = fs.readFileSync('components/GuestLanding.tsx', 'utf8');

// The class we injected was: ' rounded-xl overflow-hidden border border-[#1a1d29] hover:border-white/10"'
// Let's replace the whole string for each card. Since they have onViewChange('x'), we can target them individually.

// Casino (blackjack)
guest = guest.replace(
  /onViewChange\('blackjack'\).*?hover:border-white\/10"/,
  "onViewChange('blackjack')} className=\"group relative w-full h-[160px] md:h-[130px] bg-[#050505] cursor-pointer transition-all duration-[500ms] hover:-translate-y-2 rounded-xl overflow-hidden border border-white/5 hover:border-[#06b6d4]/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]\""
);

// Slots
guest = guest.replace(
  /onViewChange\('slots'\).*?hover:border-white\/10"/,
  "onViewChange('slots')} className=\"group relative w-full h-[160px] md:h-[130px] bg-[#050505] cursor-pointer transition-all duration-[500ms] hover:-translate-y-2 rounded-xl overflow-hidden border border-white/5 hover:border-[#d946ef]/50 hover:shadow-[0_0_30px_rgba(217,70,239,0.2)]\""
);

// Sports
guest = guest.replace(
  /onViewChange\('sports'\).*?hover:border-white\/10"/,
  "onViewChange('sports')} className=\"group relative w-full h-[160px] md:h-[130px] bg-[#050505] cursor-pointer transition-all duration-[500ms] hover:-translate-y-2 rounded-xl overflow-hidden border border-white/5 hover:border-[#10b981]/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]\""
);

// Originals
guest = guest.replace(
  /onViewChange\('originals'\).*?hover:border-white\/10"/,
  "onViewChange('originals')} className=\"group relative w-full h-[160px] md:h-[130px] bg-[#050505] cursor-pointer transition-all duration-[500ms] hover:-translate-y-2 rounded-xl overflow-hidden border border-white/5 hover:border-[#eab308]/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]\""
);

fs.writeFileSync('components/GuestLanding.tsx', guest);
console.log("Card borders upgraded.");
