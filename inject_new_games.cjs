const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const snippet = fs.readFileSync('new_games_snippet.ts', 'utf8');

// We need to insert snippet before "];\n// End of Mock Data"
const marker = "];\n// End of Mock Data";
if (lobbyCode.includes(marker)) {
    lobbyCode = lobbyCode.replace(marker, snippet + '\n' + marker);
    fs.writeFileSync(lobbyPath, lobbyCode);
    console.log('Successfully injected new games into CasinoLobby.tsx');
} else {
    console.log('Marker not found!');
}
