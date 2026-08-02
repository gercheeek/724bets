const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const rawPath = path.join(__dirname, 'public', 'megaways_raw.json');
const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

let missingGames = [];
let existingCount = 0;

rawData.forEach((game) => {
    let title = game.title.replace('Game thumb - ', '').trim();
    let escapedTitle = title.replace(/'/g, "\\'");
    
    // For megaways we check if it exists at all. 
    // Even if it exists, maybe we just want to inject all 23 megaways games as purely "megaways" category.
    // Actually, if we just check if we have it, we might skip downloading image/iframe.
    if (lobbyCode.includes(`name: '${escapedTitle}'`) || lobbyCode.includes(`id: '${game.slug}'`) || lobbyCode.includes(game.slug)) {
        existingCount++;
        // If it already exists, we could just tag it, but to ensure they show up easily, let's just re-inject them OR we download only the missing ones.
        // Let's just treat all 23 as "missing" so we get fresh links and images, 
        // OR we just use the existing ones if they exist.
        // Let's do the same as before to save time.
    } else {
        missingGames.push({
            id: `megaways_${missingGames.length}`,
            title: title,
            slug: game.slug,
            provider: "Various",
            original_link: game.original_link,
            iframe_url: `https://slotra.com/game-iframe/${game.slug}?gId0=${game.slug}`,
            image_url: game.img_src
        });
    }
});

const missingPath = path.join(__dirname, 'public', 'megaways_missing.json');
fs.writeFileSync(missingPath, JSON.stringify(missingGames, null, 2), 'utf8');

console.log(`Processed 23 Megaways games.`);
console.log(`- Found ${existingCount} games already in CasinoLobby.tsx`);
console.log(`- Found ${missingGames.length} completely new games.`);
console.log(`Missing games saved to: public/megaways_missing.json`);
