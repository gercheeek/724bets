const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const allGamesPath = path.join(__dirname, 'public', 'slots_all_new.json');
const allGames = JSON.parse(fs.readFileSync(allGamesPath, 'utf8'));

let finalGamesStr = `\n// --- NEW GAMES EXTRACTED FROM SLOTRA ---\n`;
let counter = 0;

allGames.forEach((game, idx) => {
    let cleanName = game.title.replace('Game thumb - ', '').trim();

    finalGamesStr += `  {
    id: 1200 + ${counter},
    name: '${cleanName.replace(/'/g, "\\'")}',
    provider: 'Pragmatic Play',
    img: '${game.image}?v=1',
    category: 'new',
    rtp: '96.50%',
    customDemoUrl: '${game.iframe_url}',
    containImg: false
  },\n`;
    counter++;
});

let startIdx = lobbyCode.indexOf('// --- NEW GAMES EXTRACTED FROM SLOTRA ---');
if (startIdx === -1) {
    startIdx = lobbyCode.indexOf('// --- TEST GAMES EXTRACTED FROM NETWORK ---');
}

if (startIdx === -1) {
    console.error("Marker // --- NEW GAMES EXTRACTED FROM SLOTRA --- not found!");
    process.exit(1);
}

let endIdx = lobbyCode.indexOf('];', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newLobbyCode = lobbyCode.substring(0, startIdx) + finalGamesStr + lobbyCode.substring(endIdx);
    fs.writeFileSync(lobbyPath, newLobbyCode, 'utf8');
    console.log(`Successfully injected ${counter} games into CasinoLobby.tsx!`);
} else {
    console.log("Could not find the insertion markers in CasinoLobby.tsx");
}
