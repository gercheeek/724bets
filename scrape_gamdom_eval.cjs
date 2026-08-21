const puppeteer = require('puppeteer');
const fs = require('fs');

async function extractGamdomImagesViaEval() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    console.log("Navigating to Gamdom...");
    await page.goto('https://gamdom.com/tr-tr/casino/slots', { waitUntil: 'networkidle2', timeout: 90000 });
    
    console.log("Evaluating script...");
    
    // Attempt to extract window.__NEXT_DATA__ or any window variable containing 'cdn_images'
    const data = await page.evaluate(() => {
        let results = [];
        const html = document.documentElement.innerHTML;
        const regex = /https:\/\/gamdom\.com\/static\/dyn\/cdn_images\/[^"'\\]+/g;
        let m;
        while ((m = regex.exec(html)) !== null) {
            results.push(m[0]);
        }
        
        // Also let's try to fetch their graphql if we can construct the query
        return [...new Set(results)];
    });

    fs.writeFileSync('gamdom_images.json', JSON.stringify(data, null, 2), 'utf8');
    console.log(`Saved ${data.length} image URLs to gamdom_images.json`);
    
  } catch (error) {
    console.error("Error scraping:", error.message);
  } finally {
    await browser.close();
  }
}

extractGamdomImagesViaEval();
