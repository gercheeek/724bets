const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

// First, change ALL instances of `category: 'slots'` to `category: 'old_slots'`
lobbyCode = lobbyCode.replace(/category:\s*'slots'/g, "category: 'old_slots'");

// Then, only in the newly injected block, change `category: 'old_slots'` back to `category: 'slots'`
let startBlock = '// --- SLOTS GAMES EXTRACTED FROM SLOTRA ---';
let endBlock = '// --- END SLOTS ---';

let startIndex = lobbyCode.indexOf(startBlock);
let endIndex = lobbyCode.indexOf(endBlock);

if (startIndex !== -1 && endIndex !== -1) {
    let before = lobbyCode.substring(0, startIndex);
    let block = lobbyCode.substring(startIndex, endIndex);
    let after = lobbyCode.substring(endIndex);

    // Revert inside the block
    block = block.replace(/category:\s*'old_slots'/g, "category: 'slots'");

    lobbyCode = before + block + after;
    fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
    console.log("Successfully isolated the 81 new games in the 'slots' category.");
} else {
    console.log("Could not find the extracted block.");
}
