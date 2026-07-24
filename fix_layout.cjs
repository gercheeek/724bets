const fs = require('fs');

// 1. Fix SportsBanners blur and visibility
let sportsBanners = fs.readFileSync('components/SportsBanners.tsx', 'utf8');

// Remove backdrop-blur-[2px]
sportsBanners = sportsBanners.replace('backdrop-blur-[2px]', '');

// Reduce the darkness of the global gradient so images pop more
sportsBanners = sportsBanners.replace(
  'absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10 w-full',
  'absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-10 w-full'
);
// Also reduce the left side masking slightly
sportsBanners = sportsBanners.replace(
  'absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10 w-[60%]',
  'absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10 w-[50%]'
);

fs.writeFileSync('components/SportsBanners.tsx', sportsBanners);

// 2. Fix GuestLanding layout (Move Welcome text and SportsBanners above Category Nav Cards)
let guestLanding = fs.readFileSync('components/GuestLanding.tsx', 'utf8');

// Remove the Welcome Title from its current position
const welcomeTitleRegex = /\s*\{\/\* Welcome Title \*\/\}\s*<div className="w-full text-left mb-3 mt-2 pl-1">\s*<h2 className="text-3xl md:text-\[42px\] font-black tracking-tight drop-shadow-md flex flex-wrap gap-2">\s*<span className="text-white">724bets'e<\/span> <span className="text-\[\#10b981\] drop-shadow-\[0_0_10px_rgba\(16,185,129,0\.4\)\]">Hoş Geldiniz!<\/span>\s*<\/h2>\s*<\/div>/g;
guestLanding = guestLanding.replace(welcomeTitleRegex, '');

// Remove SportsBanners from its current position
guestLanding = guestLanding.replace(/\s*\{\/\* Static 3-Column Banners \*\/\}\s*<SportsBanners \/>/g, '');

// Insert Welcome Title and SportsBanners right at the start of GUEST VIEW
const newHeader = `
            {/* Welcome Title */}
            <div className="w-full text-left mb-4 mt-2 pl-1">
               <h2 className="text-3xl md:text-[42px] font-black tracking-tight drop-shadow-md flex flex-wrap gap-2">
                 <span className="text-white">724bets'e</span> <span className="text-[#10b981] drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">Hoş Geldiniz!</span>
               </h2>
            </div>
            
            {/* Static 3-Column Banners (Slot Oyna & Kazan vs) */}
            <div className="mb-8 w-full">
               <SportsBanners />
            </div>
`;

guestLanding = guestLanding.replace(
  '{/* Category Navigation Cards (Web: 3 cols, Mobile: grid) */}',
  newHeader + '\n            {/* Category Navigation Cards (Web: 3 cols, Mobile: grid) */}'
);

fs.writeFileSync('components/GuestLanding.tsx', guestLanding);
console.log('Fixed layout and blur issues.');
