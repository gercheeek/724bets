const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const demoLinksPath = path.join(__dirname, 'demo_links.json');
const demoLinks = JSON.parse(fs.readFileSync(demoLinksPath, 'utf8'));

let injectedGames = `\n// --- TEST GAMES EXTRACTED FROM NETWORK ---\n`;
demoLinks.forEach((link, idx) => {
    if (link.real_demo_url && link.real_demo_url !== "HATA" && link.real_demo_url !== "BULUNAMADI") {
        injectedGames += `  {
    id: 5000 + ${idx},
    name: "${link.title.replace('Game thumb - ', '')} (TEST)",
    provider: 'Test',
    img: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=500&q=80',
    category: 'new',
    rtp: '99.00%',
    customDemoUrl: '${link.real_demo_url}',
    containImg: true
  },\n`;
    }
});

// Insert right before "// --- NEW GAMES EXTRACTED FROM SLOTRA ---"
lobbyCode = lobbyCode.replace('// --- NEW GAMES EXTRACTED FROM SLOTRA ---', injectedGames + '// --- NEW GAMES EXTRACTED FROM SLOTRA ---');

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log("Test games injected successfully!");
