const https = require('https');

const urls = [
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/GatesOfOlympus.png',
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/gatesofolympus.png',
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/gates-of-olympus.png',
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/TheDogHouse.png',
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/BigBassBonanza.png'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url} - Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url} - Error: ${e.message}`);
  });
});
