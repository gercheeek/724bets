const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const demoLinksPath = path.join(__dirname, 'demo_links.json');
const allGamesPath = path.join(__dirname, 'public', 'slots_new.json');

const demoLinks = JSON.parse(fs.readFileSync(demoLinksPath, 'utf8'));
const allGames = JSON.parse(fs.readFileSync(allGamesPath, 'utf8'));

// Build the array of 6 good games
let finalGamesStr = `\n// --- NEW GAMES EXTRACTED FROM SLOTRA ---\n`;
let counter = 0;

demoLinks.forEach((link, idx) => {
    if (link.real_demo_url && link.real_demo_url !== "HATA" && link.real_demo_url !== "BULUNAMADI") {
        // Find matching image from allGames
        // We can match by iframe_page_url
        const matchingGame = allGames.find(g => g.iframe_url === link.iframe_page_url);
        
        let localImg = 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=500&q=80';
        if (matchingGame && matchingGame.image) {
            localImg = matchingGame.image;
        }

        // Clean name
        let cleanName = link.title.replace('Game thumb - ', '').trim();

        finalGamesStr += `  {
    id: 1200 + ${counter},
    name: '${cleanName.replace(/'/g, "\\'")}',
    provider: 'Provider',
    img: '${localImg}',
    category: 'new',
    rtp: '96.50%',
    customDemoUrl: '${link.real_demo_url}',
    containImg: true
  },\n`;
        counter++;
    }
});

// We need to replace everything from "// --- TEST GAMES EXTRACTED FROM NETWORK ---" 
// or "// --- NEW GAMES EXTRACTED FROM SLOTRA ---" down to the end of the DEMO_GAMES array.

// Find the start of the section to replace
let startIdx = lobbyCode.indexOf('// --- TEST GAMES EXTRACTED FROM NETWORK ---');
if (startIdx === -1) {
    startIdx = lobbyCode.indexOf('// --- NEW GAMES EXTRACTED FROM SLOTRA ---');
}

// Find where DEMO_GAMES ends. We know it ends before "export const CasinoLobby" or similar, 
// but specifically the DEMO_GAMES array ends with "];"
// So we find the first "];" after startIdx.
let endIdx = lobbyCode.indexOf('];', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newLobbyCode = lobbyCode.substring(0, startIdx) + finalGamesStr + lobbyCode.substring(endIdx);
    fs.writeFileSync(lobbyPath, newLobbyCode, 'utf8');
    console.log("CasinoLobby.tsx successfully updated with proper images and names, and old games removed.");
} else {
    console.log("Could not find the insertion markers in CasinoLobby.tsx");
}
