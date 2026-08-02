const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const rawPath = path.join(__dirname, 'public', 'bonusbuy_raw.json');
const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

let bonusBuyNames = rawData.map(game => {
    return game.title.replace('Game thumb - ', '').trim().replace(/'/g, "\\'");
});

const arrayStr = `\nconst BONUSBUY_GAMES = [\n  '${bonusBuyNames.join("',\n  '")}'\n];\n`;

// Inject BONUSBUY_GAMES just above const DEMO_GAMES
if (!lobbyCode.includes('const BONUSBUY_GAMES')) {
    lobbyCode = lobbyCode.replace('const DEMO_GAMES = [', arrayStr + '\nconst DEMO_GAMES = [');
}

// Update matchesTab logic
// Find:
//     } else if (activeTab === 'bonusbuy') {
//       matchesTab = game.category === 'bonusbuy';
// Replace with:
//     } else if (activeTab === 'bonusbuy') {
//       matchesTab = game.category === 'bonusbuy' || BONUSBUY_GAMES.includes(game.name);

const targetBlock1 = `    } else if (activeTab === 'bonusbuy') {\n      matchesTab = game.category === 'bonusbuy';`;
const replaceBlock1 = `    } else if (activeTab === 'bonusbuy') {\n      matchesTab = game.category === 'bonusbuy' || BONUSBUY_GAMES.includes(game.name);`;

if (lobbyCode.includes(targetBlock1)) {
    lobbyCode = lobbyCode.replace(targetBlock1, replaceBlock1);
} else {
    // If we can't find it exactly, let's just do a generic replacement for the default 'matchesTab = game.category === activeTab;'
    const targetBlock2 = `    } else {\n      matchesTab = game.category === activeTab;\n    }`;
    const replaceBlock2 = `    } else if (activeTab === 'bonusbuy') {\n      matchesTab = game.category === 'bonusbuy' || BONUSBUY_GAMES.includes(game.name);\n    } else {\n      matchesTab = game.category === activeTab;\n    }`;
    
    if (lobbyCode.includes(targetBlock2) && !lobbyCode.includes(`activeTab === 'bonusbuy'`)) {
        lobbyCode = lobbyCode.replace(targetBlock2, replaceBlock2);
    }
}

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log(`Updated CasinoLobby.tsx to include all 50 Bonus Buy games in the filter.`);
