const fs = require('fs');
const path = require('path');

const lobbyPath = path.join(__dirname, 'components', 'CasinoLobby.tsx');
let lobbyCode = fs.readFileSync(lobbyPath, 'utf8');

// The URL user gave
const demoUrl = "https://demogamesfree.slanyywbug.net/gs2c/openGame.do?gameSymbol=vs10sleepdud&lang=en&cur=USD&lobbyUrl=https://launchgame2me.com/lobby/exit?redirect_url=https%3A%2F%2Fslotra.com&stylename=grplfm_slotra260&isGameUrlApiCalled=true&userId=None_USD";

// Replace all instances of https://slotra.com/game-iframe/... in the new games
lobbyCode = lobbyCode.replace(/customDemoUrl: 'https:\/\/slotra\.com\/game-iframe\/[^']+'/g, `customDemoUrl: '${demoUrl}'`);

fs.writeFileSync(lobbyPath, lobbyCode);
console.log("Updated customDemoUrl for all 30 new games.");
