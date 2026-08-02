const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const missingGamesPath = path.join(__dirname, 'public', 'slots_missing_with_iframes.json');
const missingGames = JSON.parse(fs.readFileSync(missingGamesPath, 'utf8'));

let finalGamesStr = `\n// --- SLOTS GAMES EXTRACTED FROM SLOTRA ---\n`;

// Also need the 19 existing games that were in the top 100 to make sure they get the right category/handling if needed.
// But for now, we just inject the missing ones.

missingGames.forEach((game, idx) => {
    let cleanName = game.title.replace('Game thumb - ', '').trim();
    
    let customDemoUrlLine = '';
    if (game.real_iframe_url && game.real_iframe_url !== "HATA" && game.real_iframe_url !== "BULUNAMADI") {
        customDemoUrlLine = `    customDemoUrl: '${game.real_iframe_url}',\n`;
    }

    finalGamesStr += `  {
    id: 1700 + ${idx},
    name: '${cleanName.replace(/'/g, "\\'")}',
    provider: '${game.provider || 'Various'}',
    img: '${game.image}',
    category: 'slots',
    rtp: '96.50%',
${customDemoUrlLine}    containImg: false
  },\n`;
});

// Insert at the end of DEMO_GAMES, before the last ];
let endOfDemoGames = lobbyCode.indexOf('];', lobbyCode.indexOf('const DEMO_GAMES'));
if (endOfDemoGames !== -1) {
    lobbyCode = lobbyCode.substring(0, endOfDemoGames) + finalGamesStr + '// --- END SLOTS ---\n' + lobbyCode.substring(endOfDemoGames);
}

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log(`CasinoLobby.tsx successfully updated with ${missingGames.length} new Slots games.`);
