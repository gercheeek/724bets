const fs = require('fs');
let guest = fs.readFileSync('components/GuestLanding.tsx', 'utf8');

// Replace clip-tech on the outer div
guest = guest.replace(/ clip-tech"/g, ' rounded-xl overflow-hidden border border-[#1a1d29] hover:border-white/10"');

// Replace clip-tech-inner and inset-[1px] on the inner div
guest = guest.replace(/className="absolute inset-\[1px\] bg-\[#05070a\] flex flex-col z-10 clip-tech-inner overflow-hidden"/g, 
                     'className="absolute inset-0 bg-[#05070a] flex flex-col z-10 overflow-hidden"');

// Since there is a hover:rotate-y-[5deg] which might cause 3D glitches on mobile without proper perspective, 
// let's also tone down the 3D rotation slightly or remove it if it causes issues.
// The user complained about "çatlaklar" (cracks). The inset-[1px] and clip-path were the main culprits.

fs.writeFileSync('components/GuestLanding.tsx', guest);
console.log("Cracks fixed.");
