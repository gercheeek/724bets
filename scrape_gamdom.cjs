const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeGamdom() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 1080 });

  try {
    console.log("Navigating to Gamdom...");
    await page.goto('https://gamdom.com/tr-tr/casino/slots', { waitUntil: 'domcontentloaded', timeout: 90000 });
    
    await new Promise(r => setTimeout(r, 5000));
    
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight - window.innerHeight || totalHeight > 15000) {
            clearInterval(timer);
            resolve();
          }
        }, 200);
      });
    });
    
    await new Promise(r => setTimeout(r, 2000));

    const scrapedData = await page.evaluate(() => {
      const results = [];
      const gameElements = document.querySelectorAll('img');
      
      gameElements.forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        if (src && src.includes('cdn_images')) {
          results.push(src);
        }
      });
      return [...new Set(results)];
    });

    fs.writeFileSync('gamdom_images.json', JSON.stringify(scrapedData, null, 2), 'utf8');
    console.log(`Saved ${scrapedData.length} image URLs to gamdom_images.json`);
    
  } catch (error) {
    console.error("Error scraping:", error.message);
  } finally {
    await browser.close();
  }
}

scrapeGamdom();
