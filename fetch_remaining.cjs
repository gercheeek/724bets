const fs = require('fs');
const https = require('https');
const path = require('path');

const LEAGUES = {
  'nrl.png': 'https://media.api-sports.io/rugby/leagues/3.png',
  'belgium-pro.png': 'https://media.api-sports.io/football/leagues/144.png',
  'croatia-hnl.png': 'https://media.api-sports.io/football/leagues/210.png',
  'argentina-reserves.png': 'https://media.api-sports.io/football/leagues/131.png'
};

const dir = path.join(__dirname, 'public', 'assets', 'leagues');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    };
    
    https.get(options, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const [filename, url] of Object.entries(LEAGUES)) {
    const dest = path.join(dir, filename);
    try {
      await download(url, dest);
      console.log(`Downloaded ${filename} successfully!`);
    } catch (e) {
      console.error(`Failed to download ${filename}:`, e.message);
    }
  }
}

run();
