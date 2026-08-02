const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const gamesPath = path.join(__dirname, 'public', 'egt_fixed.json');
const games = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

// Remove existing EGT games using regex
const egtRegex = /\{[^}]*category:\s*'egt'[^}]*\},\n?/g;
lobbyCode = lobbyCode.replace(egtRegex, '');

// Format the 109 games
let finalGamesStr = `\n// --- NEW EGT DIGITAL (NO-TOKEN) GAMES ---\n`;

games.forEach((game, idx) => {
    let cleanName = game.name.replace(/'/g, "\\'");
    let img = game.new_img;
    let customDemoUrlLine = `    customDemoUrl: '${game.new_iframe}',\n`;

    finalGamesStr += `  {
    id: 5000 + ${idx},
    name: '${cleanName}',
    provider: 'EGT Digital',
    img: '${img}',
    category: 'egt',
    rtp: '96.50%',
${customDemoUrlLine}    containImg: false
  },\n`;
});

// Insert at the end of DEMO_GAMES
let endOfDemoGames = lobbyCode.indexOf('];', lobbyCode.indexOf('const DEMO_GAMES'));
if (endOfDemoGames !== -1) {
    lobbyCode = lobbyCode.substring(0, endOfDemoGames) + finalGamesStr + '// --- END EGT DIGITAL ---\n' + lobbyCode.substring(endOfDemoGames);
}

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log(`CasinoLobby.tsx successfully restored with ${games.length} EGT Digital games.`);
