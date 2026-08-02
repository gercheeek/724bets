const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

const badNames = [
    "Amazon",
    "Dorothy",
    "Emperor",
    "Savanna",
    "Thumbelina",
    "Venezia D"
];

badNames.forEach(name => {
    // We are looking for name: 'Amazon\',
    // But since it's a string in our code, the backslash escapes the quote, so the file literally contains:
    // name: 'Amazon\',
    const badStr = `name: '${name}\\',`;
    const goodStr = `name: '${name}',`;
    lobbyCode = lobbyCode.replace(badStr, goodStr);
});

fs.writeFileSync(lobbyPath, lobbyCode, 'utf8');
console.log('Fixed syntax errors in CasinoLobby.tsx');
