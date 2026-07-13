const https = require('https');

const urls = [
  'https://demogamesfree.pragmaticplay.net/gs2c/minipic/game/vs20sweetbonanza.png',
  'https://demogamesfree.pragmaticplay.net/gs2c/minipic/game/vs20sb1000.png',
  'https://demogamesfree.pragmaticplay.net/gs2c/minipic/game/vs20olympusgate.png'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url} - Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url} - Error: ${e.message}`);
  });
});
