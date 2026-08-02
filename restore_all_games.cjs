const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const allGamesPath = path.join(__dirname, 'public', 'slots_all_new.json');
const demoLinksPath = path.join(__dirname, 'demo_links.json');

const allGames = JSON.parse(fs.readFileSync(allGamesPath, 'utf8'));
let demoLinks = [];
if (fs.existsSync(demoLinksPath)) {
    demoLinks = JSON.parse(fs.readFileSync(demoLinksPath, 'utf8'));
}

let finalGamesStr = `\n// --- NEW GAMES EXTRACTED FROM SLOTRA ---\n`;

allGames.forEach((game, idx) => {
    // Clean name
    let cleanName = game.title.replace('Game thumb - ', '').trim();
    
    // Check if we have a real demo url from demo_links.json
    let customDemoUrlLine = '';
    const matchingLink = demoLinks.find(d => d.iframe_page_url === game.iframe_url);
    
    if (matchingLink && matchingLink.real_demo_url && matchingLink.real_demo_url !== "HATA" && matchingLink.real_demo_url !== "BULUNAMADI") {
        customDemoUrlLine = `    customDemoUrl: '${matchingLink.real_demo_url}',\n`;
    }

    finalGamesStr += `  {
    id: 1200 + ${idx},
    name: '${cleanName.replace(/'/g, "\\'")}',
    provider: '${game.provider || 'Pragmatic Play'}',
    img: '${game.image}',
    category: 'new',
    rtp: '96.50%',
${customDemoUrlLine}    containImg: false
  },\n`;
});

// Find the start of the section to replace
let startIdx = lobbyCode.indexOf('// --- TEST GAMES EXTRACTED FROM NETWORK ---');
if (startIdx === -1) {
    startIdx = lobbyCode.indexOf('// --- NEW GAMES EXTRACTED FROM SLOTRA ---');
}

// Find where DEMO_GAMES ends
let endIdx = lobbyCode.indexOf('];', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newLobbyCode = lobbyCode.substring(0, startIdx) + finalGamesStr + lobbyCode.substring(endIdx);
    fs.writeFileSync(lobbyPath, newLobbyCode, 'utf8');
    console.log(`CasinoLobby.tsx successfully updated with ${allGames.length} games. Valid demo links mapped.`);
} else {
    console.log("Could not find the insertion markers in CasinoLobby.tsx");
}
