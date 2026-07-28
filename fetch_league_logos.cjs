const fs = require('fs');
const https = require('https');
const path = require('path');

const LEAGUES = {
  'champions-league.png': 'https://media.api-sports.io/football/leagues/2.png',
  'europa-league.png': 'https://media.api-sports.io/football/leagues/3.png',
  'conference-league.png': 'https://media.api-sports.io/football/leagues/848.png',
  'serie-a-italy.png': 'https://media.api-sports.io/football/leagues/135.png',
  'bundesliga.png': 'https://media.api-sports.io/football/leagues/78.png',
  'premier-league.png': 'https://media.api-sports.io/football/leagues/39.png',
  'la-liga.png': 'https://media.api-sports.io/football/leagues/140.png',
  'ligue-1.png': 'https://media.api-sports.io/football/leagues/61.png',
  'super-lig.png': 'https://media.api-sports.io/football/leagues/203.png',
  'serie-a-ecuador.png': 'https://media.api-sports.io/football/leagues/242.png',
  'bundesliga-austria.png': 'https://media.api-sports.io/football/leagues/218.png',
  'serie-a-brazil.png': 'https://media.api-sports.io/football/leagues/71.png',
  'csl-china.png': 'https://media.api-sports.io/football/leagues/169.png',
  'copa-sudamericana.png': 'https://media.api-sports.io/football/leagues/11.png',
  'liga-profesional-argentina.png': 'https://media.api-sports.io/football/leagues/128.png',
  'primera-a-colombia.png': 'https://media.api-sports.io/football/leagues/239.png',
  'club-friendlies.png': 'https://media.api-sports.io/football/leagues/15.png'
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
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
