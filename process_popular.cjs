const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const rawPath = path.join(__dirname, 'public', 'popular_raw.json');
const popularRaw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

let missingGames = [];
let existingCount = 0;

popularRaw.forEach((game) => {
    let title = game.title.replace('Game thumb - ', '').trim();
    let escapedTitle = title.replace(/'/g, "\\'");
    
    // Check if we have this game
    if (lobbyCode.includes(`name: '${escapedTitle}'`)) {
        existingCount++;
        // Try to add isPopular: true if not there
        const searchStr = `name: '${escapedTitle}',`;
        if (lobbyCode.includes(searchStr) && !lobbyCode.includes(`name: '${escapedTitle}',\n    isPopular: true`)) {
            lobbyCode = lobbyCode.replace(searchStr, `${searchStr}\n    isPopular: true,`);
        }
    } else {
        // We don't have it, it's missing!
        missingGames.push({
            id: `popular_${missingGames.length}`,
            title: title,
            provider: "Various",
            original_link: game.original_link,
            iframe_url: `https://slotra.com/game-iframe/${game.slug}?gId0=${game.slug}`,
            image_url: game.img_src
        });
    }
});

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');

const missingPath = path.join(__dirname, 'public', 'slots_popular_missing.json');
fs.writeFileSync(missingPath, JSON.stringify(missingGames, null, 2), 'utf8');

console.log(`Processed 100 popular games.`);
console.log(`- Found ${existingCount} games already in CasinoLobby.tsx (Marked as isPopular: true)`);
console.log(`- Found ${missingGames.length} completely new games.`);
console.log(`Missing games saved to: public/slots_popular_missing.json`);
