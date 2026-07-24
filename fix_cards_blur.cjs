const fs = require('fs');

let guest = fs.readFileSync('components/GuestLanding.tsx', 'utf8');

// 1. Mobile height adjustment
guest = guest.replace(/h-\[110px\] md:h-\[130px\]/g, "h-[160px] md:h-[130px]");

// 2. Remove blur / darkness (opacity-80) on the images
guest = guest.replace(/opacity-80 group-hover:opacity-100/g, "opacity-100");

// 3. Optional: Lessen the dark gradient overlay if needed so it's not so dark
guest = guest.replace(/via-\[#05070a\]\/60/g, "via-[#05070a]/20");

fs.writeFileSync('components/GuestLanding.tsx', guest);

console.log("Cards adjusted.");
