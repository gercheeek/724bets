const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

// 1. In the injected block, change 'slots' to 'pure_slots'
let startBlock = '// --- SLOTS GAMES EXTRACTED FROM SLOTRA ---';
let endBlock = '// --- END SLOTS ---';

let startIndex = lobbyCode.indexOf(startBlock);
let endIndex = lobbyCode.indexOf(endBlock);

if (startIndex !== -1 && endIndex !== -1) {
    let before = lobbyCode.substring(0, startIndex);
    let block = lobbyCode.substring(startIndex, endIndex);
    let after = lobbyCode.substring(endIndex);

    block = block.replace(/category:\s*'slots'/g, "category: 'pure_slots'");

    lobbyCode = before + block + after;
}

// 2. Change the tab filtering logic
let oldLogic = `} else if (activeTab === 'popular') {
      matchesTab = game.category === 'popular';
    } else {
      matchesTab = game.category === activeTab;
    }`;

let newLogic = `} else if (activeTab === 'popular') {
      matchesTab = game.category === 'popular';
    } else if (activeTab === 'slots') {
      matchesTab = game.category === 'pure_slots';
    } else {
      matchesTab = game.category === activeTab;
    }`;

lobbyCode = lobbyCode.replace(oldLogic, newLogic);

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log("Successfully fixed the slots tab logic to ONLY show the 81 scraped games.");
