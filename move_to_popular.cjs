const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

// Find the section
const marker = '// --- NEW GAMES EXTRACTED FROM SLOTRA ---';
let startIdx = lobbyCode.indexOf(marker);
if (startIdx !== -1) {
    let section = lobbyCode.substring(startIdx);
    
    // Change category to popular
    section = section.replace(/category: 'new'/g, "category: 'popular'");
    
    // Add (TEST) to the names if not already there
    // The names are like: name: 'Mr. Bells 40',
    section = section.replace(/name: '([^']+)'/g, (match, p1) => {
        if (!p1.includes('(TEST)')) {
            return `name: '${p1} (TEST)'`;
        }
        return match;
    });

    lobbyCode = lobbyCode.substring(0, startIdx) + section;
    fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
    console.log("Moved games to popular and added TEST suffix.");
} else {
    console.log("Marker not found.");
}
