const puppeteer = require('puppeteer');
const fs = require('fs');

const CACHE_FILE = 'football_logos.json';

async function scrapeLogos() {
  if (fs.existsSync(CACHE_FILE)) {
    console.log("Veriler yerel cache dosyasından yüklendi.");
    const data = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    return data;
  }

  console.log("Siteye bağlanılıyor...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto('https://football-logos.cc/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Scroll down to trigger lazy loading if any
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      });
    });
    
    // Wait for a little bit to ensure dynamic content loads
    await new Promise(r => setTimeout(r, 2000));

    const scrapedData = await page.evaluate(() => {
      const data = {
        most_popular_logos: [],
        trending_today: [],
        categories: {
          logos_by_country: [],
          logos_by_league: []
        }
      };

      try {
        // Most Popular Logos
        const logoDivs = document.querySelectorAll('[data-logo-id]');
        const seenTeams = new Set();
        
        logoDivs.forEach(div => {
           const nameEl = div.querySelector('h3');
           const imgEl = div.querySelector('img');
           const selectEl = div.querySelector('select');
           
           if (nameEl && imgEl) {
              const teamName = nameEl.textContent.trim();
              if (!seenTeams.has(teamName)) {
                 seenTeams.add(teamName);
                 
                 let pngLink = null;
                 if (selectEl && selectEl.options.length > 1) {
                    pngLink = selectEl.options[1].value; 
                    // this is usually like "3000::e44ac452" which means we need the base url.
                 }
                 
                 data.most_popular_logos.push({
                   team: teamName,
                   country: div.getAttribute('data-category-id') || "Unknown",
                   logo_url: imgEl.src,
                   png_download: imgEl.src,
                   svg_download: imgEl.src.replace(/\.png$/, '.svg')
                 });
              }
           }
        });
      } catch(e) {}

      try {
        // Trending Today
        const trendingHeading = Array.from(document.querySelectorAll('h2, h3')).find(h => h.textContent.includes('Trending Today'));
        if (trendingHeading) {
          const section = trendingHeading.closest('section');
          if (section) {
            const list = section.querySelectorAll('ol > li');
            list.forEach(li => {
              const spans = li.querySelectorAll('span');
              if (spans.length >= 6) {
                 data.trending_today.push({
                   rank: spans[0].textContent.trim(),
                   team: spans[3].textContent.trim(),
                   country: spans[4].textContent.trim(),
                   growth: spans[5].textContent.trim()
                 });
              }
            });
          }
        }
      } catch(e) {}

      try {
        // Logos by Country
        const countryHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Logos by Country') || h.textContent.includes('LOGOS BY COUNTRY'));
        if (countryHeading) {
           const list = countryHeading.parentElement.querySelectorAll('ul > li > a');
           list.forEach(a => {
              const spans = a.querySelectorAll('span');
              if (spans.length >= 3) {
                 data.categories.logos_by_country.push({
                    country: spans[1].textContent.trim(),
                    count: parseInt(spans[2].textContent.trim(), 10)
                 });
              }
           });
        }
        
        // Logos by League
        const leagueHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Logos by League') || h.textContent.includes('LOGOS BY LEAGUE'));
        if (leagueHeading) {
           const list = leagueHeading.parentElement.querySelectorAll('ul > li > a');
           list.forEach(a => {
              const spans = a.querySelectorAll('span');
              if (spans.length >= 3) {
                 data.categories.logos_by_league.push({
                    league: spans[1].textContent.trim(),
                    count: parseInt(spans[2].textContent.trim(), 10)
                 });
              }
           });
        }
      } catch(e) {}

      return data;
    });

    fs.writeFileSync(CACHE_FILE, JSON.stringify(scrapedData, null, 2), 'utf8');
    console.log("Veriler siteden çekildi ve JSON olarak kaydedildi.");
    
    return scrapedData;

  } catch (error) {
    console.error("Kazıma sırasında bir hata oluştu:", error.message);
  } finally {
    await browser.close();
  }
}

async function scrapeSlotra() {
  const OUTPUT_FILE = 'slotra_casino.json';
  console.log("Slotra sitesine bağlanılıyor...");
  
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 1080 });

  try {
    await page.goto('https://slotra.com/live-casino/online', { waitUntil: 'domcontentloaded', timeout: 90000 });
    console.log("Sayfa yükleniyor, oyunlar için bekleniyor...");
    
    // Cloudflare vb. korumaları atlamak veya sayfanın tam oturmasını beklemek için 5 saniye bekle
    await new Promise(r => setTimeout(r, 5000));
    
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight - window.innerHeight || totalHeight > 10000) {
            clearInterval(timer);
            resolve();
          }
        }, 150);
      });
    });
    
    await new Promise(r => setTimeout(r, 2000));

    const scrapedData = await page.evaluate(() => {
      const results = [];
      const gameElements = document.querySelectorAll('img');
      const seen = new Set();
      
      gameElements.forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        const alt = img.alt || 'Bilinmeyen Oyun';
        
        if (src && !src.includes('.svg') && !src.includes('logo') && src.includes('zvrkntplm.com')) {
          if (!seen.has(src)) {
            seen.add(src);
            results.push({ name: alt, image: src });
          }
        }
      });
      return results;
    });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedData, null, 2), 'utf8');
    console.log(`Veriler siteden çekildi. Toplam ${scrapedData.length} oyun bulundu ve ${OUTPUT_FILE} olarak kaydedildi.`);
    
  } catch (error) {
    console.error("Kazıma sırasında bir hata oluştu:", error.message);
  } finally {
    await browser.close();
  }
}

const mode = process.argv[2];
if (mode === 'slotra') {
  scrapeSlotra();
} else {
  scrapeLogos();
}
