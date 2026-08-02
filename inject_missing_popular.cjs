const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const missingGamesPath = path.join(__dirname, 'public', 'slots_popular_missing_with_iframes.json');
const missingGames = JSON.parse(fs.readFileSync(missingGamesPath, 'utf8'));

let finalGamesStr = `\n// --- POPULAR GAMES EXTRACTED FROM SLOTRA ---\n`;

missingGames.forEach((game, idx) => {
    let cleanName = game.title.replace('Game thumb - ', '').trim();
    
    let customDemoUrlLine = '';
    if (game.real_iframe_url && game.real_iframe_url !== "HATA" && game.real_iframe_url !== "BULUNAMADI") {
        customDemoUrlLine = `    customDemoUrl: '${game.real_iframe_url}',\n`;
    }

    finalGamesStr += `  {
    id: 1600 + ${idx},
    name: '${cleanName.replace(/'/g, "\\'")}',
    provider: '${game.provider || 'Various'}',
    img: '${game.image}',
    category: 'popular',
    isPopular: true,
    rtp: '96.50%',
${customDemoUrlLine}    containImg: false
  },\n`;
});

// We want to insert these games before the end of the DEMO_GAMES array
let startIdx = lobbyCode.indexOf('// --- POPULAR GAMES EXTRACTED FROM SLOTRA ---');

if (startIdx !== -1) {
    // If it already exists, replace it
    let endIdx = lobbyCode.indexOf('// --- END POPULAR ---\n', startIdx);
    if (endIdx !== -1) {
        lobbyCode = lobbyCode.substring(0, startIdx) + finalGamesStr + '// --- END POPULAR ---\n' + lobbyCode.substring(endIdx + 23);
    }
} else {
    // Insert at the end of DEMO_GAMES, before the last ];
    let endOfDemoGames = lobbyCode.indexOf('];', lobbyCode.indexOf('const DEMO_GAMES'));
    if (endOfDemoGames !== -1) {
        lobbyCode = lobbyCode.substring(0, endOfDemoGames) + finalGamesStr + '// --- END POPULAR ---\n' + lobbyCode.substring(endOfDemoGames);
    }
}

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log(`CasinoLobby.tsx successfully updated with ${missingGames.length} new Popular games.`);
