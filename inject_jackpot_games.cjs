const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const missingGamesPath = path.join(__dirname, 'public', 'jackpot_with_iframes.json');
const newGames = JSON.parse(fs.readFileSync(missingGamesPath, 'utf8'));

// 1. We need to remove all old 'egt' games from the DEMO_GAMES array.
// This is tricky using pure string replacement because objects can be multiline.
// Instead, let's use regex to remove objects that have category: 'egt'
// However, regex for multiline objects is risky.
// Better approach: Since we injected games into DEMO_GAMES, maybe we can just read the file line by line
// and skip lines that contain category: 'egt'
let lines = lobbyCode.split('\n');
let newLines = [];
let skipMode = false;
let objectBuffer = [];
let openBraces = 0;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Simple heuristic: if we are in the DEMO_GAMES array and a line starts a new game
    // Since our games are single line or a few lines, let's just do line-based filtering 
    // for the ones that are single-line, which is how they were originally formatted!
    // Wait, the original games were single line:
    // { id: 117, name: 'Flaming Hot', provider: 'EGT Digital', img: '...', category: 'egt', ... },
    if (line.includes(`category: 'egt'`)) {
        // If it's a single line object
        if (line.trim().startsWith('{') && line.trim().endsWith('},')) {
            continue; // Skip it
        }
        // If it's multiline, we would need a proper parser. 
        // Let's assume they are single line as seen in grep search earlier.
        // Even if some were multi-line, we can just let them be, but all EGT ones were single line!
        // Wait, looking at the grep output earlier:
        //  { id: 117, name: 'Flaming Hot Extreme BL', provider: 'EGT Digital', img: '...', category: 'egt', ... },
        //  isPopular: true, provider: 'EGT Digital', ...
        // So some might be split across 2 lines. 
    }
    
    // More robust way: Use regex to remove any object containing category: 'egt' inside DEMO_GAMES
    // It's safer to just inject the new ones at the end and change the tab logic? No, we want to REMOVE the old ones.
}

// Let's use a simpler Regex to remove the old EGT games. 
// Match { ... category: 'egt' ... },
const egtRegex = /\{[^}]*category:\s*'egt'[^}]*\},\n?/g;
lobbyCode = lobbyCode.replace(egtRegex, '');

// 2. Format the new games
let finalGamesStr = `\n// --- NEW JACKPOT (EGT) GAMES ---\n`;

newGames.forEach((game, idx) => {
    let cleanName = game.title.replace(/'/g, "\\'");
    
    let customDemoUrlLine = '';
    if (game.real_iframe_url && game.real_iframe_url !== "HATA" && game.real_iframe_url !== "BULUNAMADI") {
        customDemoUrlLine = `    customDemoUrl: '${game.real_iframe_url}',\n`;
    }

    finalGamesStr += `  {
    id: 3000 + ${idx},
    name: '${cleanName}',
    provider: '${game.provider}',
    img: '${game.image}',
    category: 'egt',
    rtp: '96.50%',
${customDemoUrlLine}    containImg: false
  },\n`;
});

// Insert at the end of DEMO_GAMES, before the last ];
let endOfDemoGames = lobbyCode.indexOf('];', lobbyCode.indexOf('const DEMO_GAMES'));
if (endOfDemoGames !== -1) {
    lobbyCode = lobbyCode.substring(0, endOfDemoGames) + finalGamesStr + '// --- END NEW JACKPOT (EGT) ---\n' + lobbyCode.substring(endOfDemoGames);
}

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log(`CasinoLobby.tsx successfully updated with ${newGames.length} new Jackpot games (replacing old EGT).`);
