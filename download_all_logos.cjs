const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OUTPUT_DIR = path.join(__dirname, 'public', 'assets', 'logos');
const BASE_URL = 'https://football-logos.cc';

// Normalize helper (same as PlayerLogo.tsx)
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

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchHtml(new URL(res.headers.location, url).toString()));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath)) {
      return resolve(true); // Already downloaded
    }
    const file = fs.createWriteStream(destPath);
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        fs.unlink(destPath, () => {});
        return reject(new Error('Status code: ' + res.statusCode));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log("1. Ana sayfa çekiliyor...");
  const homeHtml = await fetchHtml(BASE_URL);
  
  // Ülke ve lig linklerini bul
  const categoryLinks = [];
  const linkRegex = /href="(\/[a-z0-9-]+\/)"[^>]*>.*?<span/g;
  let match;
  while ((match = linkRegex.exec(homeHtml)) !== null) {
    if (!categoryLinks.includes(match[1])) {
      categoryLinks.push(match[1]);
    }
  }
  
  // Sadece kıtaları falan eleyip sadece geçerli ülke/lig kategorilerini tut
  const validLinks = categoryLinks.filter(l => l.length > 2 && !l.includes('search'));
  console.log(`${validLinks.length} adet kategori bulundu.`);

  const allTeams = [];
  
  console.log("2. Kategoriler taranıyor ve takım listesi çıkarılıyor...");
  for (let i = 0; i < validLinks.length; i++) {
    const link = validLinks[i];
    console.log(`[${i+1}/${validLinks.length}] Taranıyor: ${link}`);
    try {
      const catHtml = await fetchHtml(BASE_URL + link);
      
      // H3 içindeki isimleri ve IMG src'lerini regex ile yakala
      const blockRegex = /<img src="(https:\/\/assets\.football-logos\.cc\/logos\/[^"]+)"[^>]*>.*?<h3[^>]*>([^<]+)<\/h3>/gs;
      let bMatch;
      let count = 0;
      while ((bMatch = blockRegex.exec(catHtml)) !== null) {
        const imgUrl = bMatch[1];
        // En yüksek kalite için 256x256 linkini çekiyoruz
        const teamName = bMatch[2].trim();
        allTeams.push({ name: teamName, url: imgUrl });
        count++;
      }
      console.log(` -> ${count} takım bulundu.`);
    } catch(err) {
      console.log(`HATA: ${link} çekilemedi.`);
    }
  }

  console.log(`\nToplam ${allTeams.length} takım bulundu! İndirme işlemi başlıyor...`);
  
  // Concurrency limit for downloading
  const CONCURRENCY = 10;
  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < allTeams.length; i += CONCURRENCY) {
    const chunk = allTeams.slice(i, i + CONCURRENCY);
    const promises = chunk.map(async (team) => {
      const fileName = normalize(team.name) + '.png';
      const filePath = path.join(OUTPUT_DIR, fileName);
      try {
        if (fs.existsSync(filePath)) {
          skipped++;
        } else {
          await downloadImage(team.url, filePath);
          downloaded++;
        }
      } catch (e) {
        errors++;
      }
    });
    
    await Promise.all(promises);
    process.stdout.write(`\rİlerleme: %${Math.round(((i + chunk.length) / allTeams.length) * 100)} (${downloaded} indirildi, ${skipped} atlandı, ${errors} hata)`);
  }
  
  console.log(`\n\nBİTTİ! Toplam ${downloaded} yeni logo indirildi, ${skipped} logo zaten vardı. ${errors} hata oluştu.`);
}

run().catch(console.error);
