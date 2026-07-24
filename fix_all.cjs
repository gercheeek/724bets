const fs = require('fs');

// Fix 724 ORIGINALS -> 724 <br/> ORIGINALS in GuestLanding
let glContent = fs.readFileSync('components/GuestLanding.tsx', 'utf8');
glContent = glContent.replace(/724 ORIGINALS/g, '724<br/>ORIGINALS');
fs.writeFileSync('components/GuestLanding.tsx', glContent);

// Fix badges in LiveGamesSlider
let lgsContent = fs.readFileSync('components/LiveGamesSlider.tsx', 'utf8');
lgsContent = lgsContent.replace(/absolute top-2 left-2/g, 'absolute top-1 left-1 md:top-2 md:left-2 scale-90 origin-top-left');
lgsContent = lgsContent.replace(/absolute top-2 right-2/g, 'absolute top-1 right-1 md:top-2 md:right-2 scale-90 origin-top-right');
fs.writeFileSync('components/LiveGamesSlider.tsx', lgsContent);

// Fix badges in GameLobbyGrid
let glgContent = fs.readFileSync('components/GameLobbyGrid.tsx', 'utf8');
glgContent = glgContent.replace(/absolute top-2 left-2/g, 'absolute top-1 left-1 md:top-2 md:left-2 scale-90 origin-top-left');
glgContent = glgContent.replace(/absolute top-2 right-2/g, 'absolute top-1 right-1 md:top-2 md:right-2 scale-90 origin-top-right');
fs.writeFileSync('components/GameLobbyGrid.tsx', glgContent);

console.log("Success");
