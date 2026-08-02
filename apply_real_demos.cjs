const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const demoLinksPath = path.join(__dirname, 'demo_links.json');
const demoLinks = JSON.parse(fs.readFileSync(demoLinksPath, 'utf8'));

let updatedCount = 0;

demoLinks.forEach(link => {
    if (link.real_demo_url && link.real_demo_url !== 'HATA') {
        const cleanName = link.title.replace('Game thumb - ', '').trim();
        const escapedName = cleanName.replace(/'/g, "\\'");
        
        // Find the block for this game. It looks like:
        // name: 'Mr. Bells 40',
        // ...
        // customDemoUrl: '...'
        
        const regex = new RegExp(`(name:\\s*'${escapedName}',[\\s\\S]*?customDemoUrl:\\s*')[^']+(')`, 'g');
        if (regex.test(lobbyCode)) {
            lobbyCode = lobbyCode.replace(regex, `$1${link.real_demo_url}$2`);
            updatedCount++;
        } else {
            console.log(`Could not find game in CasinoLobby.tsx: ${cleanName}`);
        }
    }
});

fs.writeFileSync(lobbyPath, lobbyCode);
console.log(`Successfully updated customDemoUrl for ${updatedCount} games from demo_links.json.`);
