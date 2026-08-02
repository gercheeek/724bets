const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

// Replace all instances of "name: 'Game thumb - " with "name: '"
lobbyCode = lobbyCode.replace(/name:\s*'Game thumb - /g, "name: '");

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log('Fixed Game thumb prefixes in CasinoLobby.tsx');
