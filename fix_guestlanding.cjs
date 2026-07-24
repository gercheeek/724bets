const fs = require('fs');

let content = fs.readFileSync('components/GuestLanding.tsx', 'utf8');

// Fix 724ORİJİNAL to 724 ORIGINALS
content = content.replace(/724ORİJİNAL/g, '724 ORIGINALS');

// Fix font sizes of category cards to prevent truncation
content = content.replace(/text-sm sm:text-lg lg:text-2xl xl:text-3xl truncate font-extrabold/g, 'text-sm sm:text-base lg:text-xl xl:text-2xl truncate font-extrabold');

fs.writeFileSync('components/GuestLanding.tsx', content);
console.log("Success");
