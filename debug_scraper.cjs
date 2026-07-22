const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto("https://sekabet1624.com/tr/live/", { waitUntil: 'networkidle2' });
    await page.screenshot({ path: '/Users/alex/.gemini/antigravity/brain/61d2d081-90bc-479a-a419-4ee4c6177d3a/scratch/debug_sekabet.png' });
    console.log("Screenshot saved.");
    await browser.close();
})();
