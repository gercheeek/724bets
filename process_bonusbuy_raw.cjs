const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const rawPath = path.join(__dirname, 'public', 'bonusbuy_raw.json');
const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

let missingGames = [];
let existingCount = 0;

rawData.forEach((game) => {
    let title = game.title.replace('Game thumb - ', '').trim();
    let escapedTitle = title.replace(/'/g, "\\'");
    
    // Check if it already exists in the code
    if (lobbyCode.includes(`name: '${escapedTitle}'`) || lobbyCode.includes(`id: '${game.slug}'`) || lobbyCode.includes(game.slug)) {
        existingCount++;
    } else {
        missingGames.push({
            id: `bonusbuy_${missingGames.length}`,
            title: title,
            slug: game.slug,
            provider: "Various",
            original_link: game.original_link,
            iframe_url: `https://slotra.com/game-iframe/${game.slug}?gId0=${game.slug}`,
            image_url: game.img_src
        });
    }
});

const missingPath = path.join(__dirname, 'public', 'bonusbuy_missing.json');
fs.writeFileSync(missingPath, JSON.stringify(missingGames, null, 2), 'utf8');

console.log(`Processed 50 Bonus Buy games.`);
console.log(`- Found ${existingCount} games already in CasinoLobby.tsx`);
console.log(`- Found ${missingGames.length} completely new games.`);
console.log(`Missing games saved to: public/bonusbuy_missing.json`);
