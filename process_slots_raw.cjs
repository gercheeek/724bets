const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const rawPath = path.join(__dirname, 'public', 'slots_raw.json');
const slotsRaw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

let missingGames = [];
let existingCount = 0;

slotsRaw.forEach((game) => {
    let title = game.title.replace('Game thumb - ', '').trim();
    let escapedTitle = title.replace(/'/g, "\\'");
    
    // Check if we have this game
    if (lobbyCode.includes(`name: '${escapedTitle}'`) || lobbyCode.includes(`id: '${game.slug}'`) || lobbyCode.includes(game.slug)) {
        existingCount++;
    } else {
        // We don't have it, it's missing!
        missingGames.push({
            id: `slots_${missingGames.length}`,
            title: title,
            slug: game.slug,
            provider: "Various",
            original_link: game.original_link,
            iframe_url: `https://slotra.com/game-iframe/${game.slug}?gId0=${game.slug}`,
            image_url: game.img_src
        });
    }
});

const missingPath = path.join(__dirname, 'public', 'slots_missing.json');
fs.writeFileSync(missingPath, JSON.stringify(missingGames, null, 2), 'utf8');

console.log(`Processed 100 slot games.`);
console.log(`- Found ${existingCount} games already in CasinoLobby.tsx`);
console.log(`- Found ${missingGames.length} completely new games.`);
console.log(`Missing games saved to: public/slots_missing.json`);
