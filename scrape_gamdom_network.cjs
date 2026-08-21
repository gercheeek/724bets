const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeGamdomNetwork() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });
  
  const allImages = new Set();
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('cdn_images') && (url.endsWith('.avif') || url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.webp'))) {
        allImages.add(url);
    }
  });

  try {
    console.log("Navigating to Gamdom...");
    await page.goto('https://gamdom.com/tr-tr/casino/slots', { waitUntil: 'networkidle2', timeout: 90000 });
    
    // We will simulate a user scrolling. Since it's a huge list, we scroll continuously.
    for (let i = 0; i < 200; i++) {
        await page.evaluate(() => window.scrollBy(0, 1500));
        await new Promise(r => setTimeout(r, 200));
    }
    
    // also extract from DOM just in case
    const domImages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => img.src || img.getAttribute('data-src')).filter(Boolean);
    });
    
    domImages.forEach(src => {
        if (src.includes('cdn_images')) allImages.add(src);
    });

    fs.writeFileSync('gamdom_images.json', JSON.stringify([...allImages], null, 2), 'utf8');
    console.log(`Saved ${allImages.size} image URLs to gamdom_images.json`);
    
  } catch (error) {
    console.error("Error scraping:", error.message);
  } finally {
    await browser.close();
  }
}

scrapeGamdomNetwork();
