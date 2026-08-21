const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeGamdomAPI() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const allImages = new Set();
  const gameData = [];
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('cdn_images')) {
      allImages.add(url);
    }
    // intercept GraphQL or REST endpoints that return games
    if (url.includes('graphql') || url.includes('/api/')) {
        try {
            const text = await response.text();
            if (text.includes('cdn_images')) {
                const regex = /https:\/\/gamdom\.com\/static\/dyn\/cdn_images\/[^"'\\]+/g;
                let m;
                while ((m = regex.exec(text)) !== null) {
                    allImages.add(m[0]);
                }
            }
        } catch (e) {}
    }
  });

  try {
    console.log("Navigating to Gamdom...");
    await page.goto('https://gamdom.com/tr-tr/casino/slots', { waitUntil: 'networkidle2', timeout: 90000 });
    
    // scroll repeatedly
    for (let i = 0; i < 50; i++) {
        await page.evaluate(() => window.scrollBy(0, 1000));
        await new Promise(r => setTimeout(r, 500));
    }
    
    // extract from DOM too
    const domImages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => img.src).filter(src => src.includes('cdn_images'));
    });
    
    domImages.forEach(src => allImages.add(src));

    fs.writeFileSync('gamdom_images.json', JSON.stringify([...allImages], null, 2), 'utf8');
    console.log(`Saved ${allImages.size} image URLs to gamdom_images.json`);
    
  } catch (error) {
    console.error("Error scraping:", error.message);
  } finally {
    await browser.close();
  }
}

scrapeGamdomAPI();
