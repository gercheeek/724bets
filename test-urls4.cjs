const https = require('https');

const urls = [
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/vs20olympgate.png',
  'https://cdn2.softswiss.net/i/s3/pragmaticexternal/gatesofolympus_1.png',
  'https://cdn2.softswiss.net/i/s3/pragmatic/GatesofOlympus.png',
  'https://cdn2.softswiss.net/i/s3/pragmatic/SweetBonanza.png'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${url} - Status: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`${url} - Error: ${e.message}`);
  });
});
