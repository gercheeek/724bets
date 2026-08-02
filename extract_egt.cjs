const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
const lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

// We need to parse const DEMO_GAMES = [ ... ]
// This is a bit tricky with pure regex, let's just extract lines with category: 'egt'
const lines = lobbyCode.split('\n');
const egtGames = [];

for (let line of lines) {
    if (line.includes(`category: 'egt'`)) {
        // extract name
        const nameMatch = line.match(/name:\s*'([^']+)'/);
        // extract img
        const imgMatch = line.match(/img:\s*'([^']+)'/);
        // extract iframe
        const iframeMatch = line.match(/customDemoUrl:\s*'([^']+)'/);
        
        if (nameMatch) {
            egtGames.push({
                name: nameMatch[1],
                img: imgMatch ? imgMatch[1] : null,
                iframe: iframeMatch ? iframeMatch[1] : null
            });
        }
    }
}

const outputPath = path.join(__dirname, 'public', 'egt_current.json');
fs.writeFileSync(outputPath, JSON.stringify(egtGames, null, 2), 'utf8');
console.log(`Extracted ${egtGames.length} EGT games.`);
