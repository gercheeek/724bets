const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeGamdomGraphQL() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const allImages = new Set();
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('graphql')) {
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
    await page.goto('https://gamdom.com/tr-tr/casino/slots', { waitUntil: 'domcontentloaded', timeout: 90000 });
    
    // We will simulate a user scrolling and clicking "load more" if it exists, or just continuous scrolling
    for (let i = 0; i < 200; i++) {
        await page.evaluate(() => window.scrollBy(0, 1500));
        await new Promise(r => setTimeout(r, 200));
    }
    
    fs.writeFileSync('gamdom_images.json', JSON.stringify([...allImages], null, 2), 'utf8');
    console.log(`Saved ${allImages.size} image URLs to gamdom_images.json`);
    
  } catch (error) {
    console.error("Error scraping:", error.message);
  } finally {
    await browser.close();
  }
}

scrapeGamdomGraphQL();
