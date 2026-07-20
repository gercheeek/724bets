const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log("Navigating...");
    await page.goto('https://tarafbet981.com/tr/live/', { waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.log(e.message));
    
    await new Promise(r => setTimeout(r, 5000));
    
    await page.screenshot({ path: 'tarafbet_screenshot.png' });
    const html = await page.evaluate(() => document.body.innerHTML);
    const fs = require('fs');
    fs.writeFileSync('tarafbet_body.html', html);
    
    console.log("Saved screenshot and body.");
    await browser.close();
})();
