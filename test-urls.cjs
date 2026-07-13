const https = require('https');

const urls = [
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/SweetBonanza.png',
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/GatesofOlympus.png',
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/SugarRush.png',
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/SweetBonanza1000.png',
  'https://b2b.pragmaticplay.net/gs2c/minipic/game/vs20sweetbonanza.png',
  'https://b2b.pragmaticplay.net/gs2c/minipic/game/vs20sb1000.png'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url} - Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url} - Error: ${e.message}`);
  });
});
