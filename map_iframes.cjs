const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'public', 'slots_new.json');
let games = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let tsCode = `\n// --- NEW GAMES EXTRACTED FROM SLOTRA ---\n`;

for (let i = 0; i < games.length; i++) {
    const slug = games[i].original_link.split('/').pop();
    const iframeUrl = `https://slotra.com/game-iframe/${slug}?gId0=${slug}`;
    games[i].iframe_url = iframeUrl;
    
    // Generate TS array entry
    tsCode += `  {
    id: 1200 + ${i},
    name: '${games[i].title.replace(/'/g, "\\'")}',
    provider: 'Slotra',
    img: '${games[i].image}',
    category: 'new',
    rtp: '96.50%',
    customDemoUrl: '${iframeUrl}',
    containImg: true
  },\n`;
}

fs.writeFileSync(jsonPath, JSON.stringify(games, null, 2));
fs.writeFileSync('new_games_snippet.ts', tsCode);
console.log('Done mapping game-iframe links and generated TS snippet.');
