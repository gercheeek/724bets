const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const missingGamesPath = path.join(__dirname, 'public', 'bonusbuy_missing_with_iframes.json');
const missingGames = JSON.parse(fs.readFileSync(missingGamesPath, 'utf8'));

let finalGamesStr = `\n// --- BONUS BUY GAMES EXTRACTED FROM SLOTRA ---\n`;

missingGames.forEach((game, idx) => {
    let cleanName = game.title.replace('Game thumb - ', '').trim();
    
    let customDemoUrlLine = '';
    if (game.real_iframe_url && game.real_iframe_url !== "HATA" && game.real_iframe_url !== "BULUNAMADI") {
        customDemoUrlLine = `    customDemoUrl: '${game.real_iframe_url}',\n`;
    }

    finalGamesStr += `  {
    id: 2000 + ${idx},
    name: '${cleanName.replace(/'/g, "\\'")}',
    provider: '${game.provider || 'Various'}',
    img: '${game.image}',
    category: 'bonusbuy',
    rtp: '96.50%',
${customDemoUrlLine}    containImg: false
  },\n`;
});

// Insert at the end of DEMO_GAMES, before the last ];
let endOfDemoGames = lobbyCode.indexOf('];', lobbyCode.indexOf('const DEMO_GAMES'));
if (endOfDemoGames !== -1) {
    lobbyCode = lobbyCode.substring(0, endOfDemoGames) + finalGamesStr + '// --- END BONUS BUY ---\n' + lobbyCode.substring(endOfDemoGames);
}

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log(`CasinoLobby.tsx successfully updated with ${missingGames.length} new Bonus Buy games.`);
