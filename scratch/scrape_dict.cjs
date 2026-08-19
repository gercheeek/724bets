const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

(async () => {
  try {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    console.log("Navigating to 1xBet...");
    await page.goto('https://1xframemxz.com/tr/spor/mac/745481001', { waitUntil: 'networkidle2', timeout: 15000 });
    
    console.log("Extracting dictionaries...");
    const html = await page.content();
    console.log("HTML length:", html.length);
    
    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
