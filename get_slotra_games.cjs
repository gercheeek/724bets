const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://slotra.com/en/casino/populer', { waitUntil: 'networkidle2' });
    const games = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img')).map(img => img.alt).filter(alt => alt && alt.trim() !== '' && alt !== 'logo');
    });
    console.log(JSON.stringify(games, null, 2));
    await browser.close();
})();
