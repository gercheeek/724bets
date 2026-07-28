const fs = require('fs');
const path = require('path');
const https = require('https'); // Still needed for downloading images maybe, though fetch works too

const LOGOS_DIR = path.join(__dirname, '../public/assets/logos');
if (!fs.existsSync(LOGOS_DIR)) fs.mkdirSync(LOGOS_DIR, { recursive: true });

const normalize = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/ fc$/i, '')
    .replace(/ afc$/i, '')
    .replace(/^fc /i, '')
    .replace(/[^\w\sğüşıöç]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const fetchHtml = async (url) => {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Referer': 'https://football-logos.cc/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    if (!res.ok) return { status: res.status, data: '' };
    const data = await res.text();
    return { status: res.status, data };
  } catch (err) {
    return { status: 500, data: '' };
  }
};

const main = async () => {
  const countryPages = JSON.parse(fs.readFileSync(path.join(__dirname, '../scratch/country_pages.json'), 'utf8'));
  console.log(`Fetching HTML from ${countryPages.length} country pages...`);
  
  const dictionary = {};
  let totalProcessed = 0;
  
  const processBatch = async (batch) => {
     await Promise.all(batch.map(async (countryUrl) => {
        const { status, data } = await fetchHtml(countryUrl);
        if (status === 200) {
           const blockRegex = /data-category-id="([^"]+)"\s+data-logo-id="([^"]+)"[\s\S]*?<h3[^>]*>([^<]+)<\/h3>[\s\S]*?(?:<select[^>]*>[\s\S]*?<option\s+value="1500::([^"]+)")?/g;
           let match;
           let count = 0;
           while ((match = blockRegex.exec(data)) !== null) {
              const catId = match[1];
              const slug = match[2];
              const name = match[3].trim();
              const hash = match[4];
              
              let imgUrl = '';
              if (hash) {
                 imgUrl = `https://assets.football-logos.cc/logos/${catId}/1500x1500/${slug}.${hash}.png`;
              } else {
                 const imgMatch = data.substring(match.index, match.index + 2000).match(/<img\s+src="(\/logos\/[^"]+)"/);
                 if (imgMatch) {
                    imgUrl = 'https://assets.football-logos.cc' + imgMatch[1];
                 }
              }
              
              if (imgUrl) {
                 dictionary[normalize(slug)] = imgUrl;
                 dictionary[normalize(name.replace(/ Logo$/i, ''))] = imgUrl;
                 count++;
              }
           }
        }
        totalProcessed++;
        if (totalProcessed % 20 === 0) console.log(`Processed ${totalProcessed}/${countryPages.length} countries... dict size: ${Object.keys(dictionary).length}`);
     }));
  };
  
  for (let i = 0; i < countryPages.length; i += 20) {
     await processBatch(countryPages.slice(i, i + 20));
  }
  
  console.log(`Built dictionary with ${Object.keys(dictionary).length} keys.`);
  fs.writeFileSync(path.join(__dirname, '../scratch/logo_dictionary.json'), JSON.stringify(dictionary, null, 2));
  
  const siteTeams = JSON.parse(fs.readFileSync(path.join(__dirname, '../scratch/site_teams.json'), 'utf8'));
  const unmatched = [];
  const matchedUrls = {};
  
  siteTeams.forEach(team => {
    const normTeam = normalize(team);
    if (dictionary[normTeam]) {
      matchedUrls[team] = dictionary[normTeam];
    } else {
      let found = false;
      for (const dictKey of Object.keys(dictionary)) {
        if (normTeam.includes(dictKey) || dictKey.includes(normTeam)) {
           matchedUrls[team] = dictionary[dictKey];
           found = true;
           break;
        }
      }
      if (!found) unmatched.push(team);
    }
  });
  
  console.log(`Matched ${Object.keys(matchedUrls).length} teams. Could not match ${unmatched.length} teams.`);
  fs.writeFileSync(path.join(__dirname, '../scratch/matched_logos.json'), JSON.stringify(matchedUrls, null, 2));
  fs.writeFileSync(path.join(__dirname, '../scratch/unmatched_logos.json'), JSON.stringify(unmatched, null, 2));
  
  console.log(`Starting download of ${Object.keys(matchedUrls).length} logos...`);
  const entries = Object.entries(matchedUrls);
  
  const downloadImage = async (url, dest) => {
    if (fs.existsSync(dest)) return true;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://football-logos.cc/'
        }
      });
      if (!res.ok) return false;
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buffer));
      return true;
    } catch (e) {
      return false;
    }
  };
  
  for (let i = 0; i < entries.length; i += 20) {
    const batch = entries.slice(i, i + 20);
    await Promise.all(batch.map(async ([team, url]) => {
      const dest = path.join(LOGOS_DIR, `${normalize(team)}.png`);
      await downloadImage(url, dest);
    }));
  }
  console.log('Download complete!');
};

main();
