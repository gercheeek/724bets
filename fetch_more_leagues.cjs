const fs = require('fs');
const https = require('https');
const path = require('path');

const LEAGUES = {
  'copa-libertadores.png': 'https://media.api-sports.io/football/leagues/13.png',
  'primera-chile.png': 'https://media.api-sports.io/football/leagues/265.png',
  'primera-nacional-argentina.png': 'https://media.api-sports.io/football/leagues/129.png',
  'czech-liga.png': 'https://media.api-sports.io/football/leagues/345.png',
  'denmark-superliga.png': 'https://media.api-sports.io/football/leagues/119.png',
  'finland-veikkausliiga.png': 'https://media.api-sports.io/football/leagues/244.png',
  'ireland-1st-div.png': 'https://media.api-sports.io/football/leagues/357.png',
  'nrl.png': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/National_Rugby_League_logo.svg/800px-National_Rugby_League_logo.svg.png'
};

const dir = path.join(__dirname, 'public', 'assets', 'leagues');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

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
      // Handle redirects manually just in case
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        fs.unlink(dest, () => {});
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
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
    console.log(`Downloading ${filename}...`);
    try {
      await download(url, dest);
      console.log(`Downloaded ${filename} successfully!`);
    } catch (e) {
      console.error(`Failed to download ${filename}:`, e.message);
    }
  }
}

run();
