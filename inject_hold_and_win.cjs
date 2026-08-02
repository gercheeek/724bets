const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

// Add tab if not exists
if (!lobbyCode.includes("{ id: 'holdwin', label: 'Hold & Win'")) {
    lobbyCode = lobbyCode.replace(
        "{ id: 'new', label: 'Yeni Eklenenler', icon: <Sparkles size={16} /> },",
        "{ id: 'new', label: 'Yeni Eklenenler', icon: <Sparkles size={16} /> },\n  { id: 'holdwin', label: 'Hold & Win', icon: <Disc size={16} /> },"
    );
}

const allGamesPath = path.join(__dirname, 'public', 'slots_hold_and_win_with_iframes.json');
const allGames = JSON.parse(fs.readFileSync(allGamesPath, 'utf8'));

let finalGamesStr = `\n// --- HOLD AND WIN GAMES EXTRACTED FROM SLOTRA ---\n`;

allGames.forEach((game, idx) => {
    let cleanName = game.title.replace('Game thumb - ', '').trim();
    
    let customDemoUrlLine = '';
    if (game.real_iframe_url && game.real_iframe_url !== "HATA" && game.real_iframe_url !== "BULUNAMADI") {
        customDemoUrlLine = `    customDemoUrl: '${game.real_iframe_url}',\n`;
    }

    finalGamesStr += `  {
    id: 1500 + ${idx},
    name: '${cleanName.replace(/'/g, "\\'")}',
    provider: '${game.provider || 'Various'}',
    img: '${game.image}',
    category: 'holdwin',
    rtp: '96.50%',
${customDemoUrlLine}    containImg: false
  },\n`;
});

// We want to insert these games before the end of the DEMO_GAMES array
let startIdx = lobbyCode.indexOf('// --- HOLD AND WIN GAMES EXTRACTED FROM SLOTRA ---');

if (startIdx !== -1) {
    // If it already exists, replace it
    let endIdx = lobbyCode.indexOf('// --- END HOLD AND WIN ---', startIdx);
    if (endIdx !== -1) {
        lobbyCode = lobbyCode.substring(0, startIdx) + finalGamesStr + '// --- END HOLD AND WIN ---\n' + lobbyCode.substring(endIdx + 27);
    }
} else {
    // Insert at the end of DEMO_GAMES, before the last ];
    let endOfDemoGames = lobbyCode.indexOf('];', lobbyCode.indexOf('const DEMO_GAMES'));
    if (endOfDemoGames !== -1) {
        lobbyCode = lobbyCode.substring(0, endOfDemoGames) + finalGamesStr + '// --- END HOLD AND WIN ---\n' + lobbyCode.substring(endOfDemoGames);
    }
}

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log(`CasinoLobby.tsx successfully updated with ${allGames.length} Hold and Win games.`);
