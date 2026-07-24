const fs = require('fs');

// 1. GuestLanding.tsx Update
let guest = fs.readFileSync('components/GuestLanding.tsx', 'utf8');

guest = guest.replace(/h-\[200px\] md:h-\[240px\]/g, "h-[110px] md:h-[130px]");
guest = guest.replace(/mt-10 mb-6/g, "mt-5 mb-5");

fs.writeFileSync('components/GuestLanding.tsx', guest);

// 2. SportsBanners.tsx Update
let banners = fs.readFileSync('components/SportsBanners.tsx', 'utf8');

banners = banners.replace(/h-\[200px\] md:h-\[280px\] lg:h-\[340px\]/g, "h-[160px] md:h-[220px] lg:h-[260px]");

fs.writeFileSync('components/SportsBanners.tsx', banners);

console.log("Fold issues fixed.");
