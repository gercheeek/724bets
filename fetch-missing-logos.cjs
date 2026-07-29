const fs = require('fs');
const https = require('https');

const missing = require('./missing-teams.json');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        resolve(null);
      }
    }).on('error', reject);
  });
};

const fetchFromSportsDB = (teamName) => {
  return new Promise((resolve) => {
    const searchName = encodeURIComponent(teamName.split(' U2')[0].replace(/FC | FC| SC|SC /ig, '').trim());
    https.get(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${searchName}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.teams && json.teams.length > 0) {
            resolve(json.teams[0].strBadge);
          } else {
            resolve(null);
          }
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log(`Starting download for ${missing.length} missing logos...`);
  let downloadedCount = 0;
  
  // To avoid hitting API rate limits, process in chunks of 5
  const chunkSize = 5;
  for (let i = 0; i < missing.length; i += chunkSize) {
    const chunk = missing.slice(i, i + chunkSize);
    
    await Promise.all(chunk.map(async (item) => {
      try {
        const badgeUrl = await fetchFromSportsDB(item.team);
        if (badgeUrl) {
          const filepath = `./public/assets/logos/${item.norm}.png`;
          const saved = await downloadImage(badgeUrl, filepath);
          if (saved) {
            console.log(`[+] Downloaded: ${item.team} -> ${item.norm}.png`);
            downloadedCount++;
          }
        } else {
          console.log(`[-] Not found: ${item.team}`);
        }
      } catch (err) {
        console.log(`[x] Error on ${item.team}: ${err.message}`);
      }
    }));
    
    // Add a small delay between chunks to respect API limits
    await delay(100);
  }
  
  console.log(`\nFinished! Successfully downloaded ${downloadedCount} logos.`);
  
  // Update logo-index.json
  const files = fs.readdirSync('./public/assets/logos').filter(f => f.endsWith('.png')).map(f => f.replace('.png', ''));
  fs.writeFileSync('./public/assets/logo-index.json', JSON.stringify(files));
  console.log('Updated logo-index.json');
}

run();
