const https = require('https');

const urls = [
  'https://medium.stake.com/game-images/pragmatic-play/gates-of-olympus.webp',
  'https://medium.stake.com/game-images/pragmatic-play/gates-of-olympus.png',
  'https://medium.stake.com/games/pragmatic-play/gates-of-olympus.webp',
  'https://cdn.stakedw.com/games/pragmatic-play/gates-of-olympus.webp',
  'https://cdn.gamdom.com/games/pragmatic-play/gates-of-olympus.png'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url} - Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url} - Error: ${e.message}`);
  });
});
