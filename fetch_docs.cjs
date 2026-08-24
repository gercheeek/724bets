const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    try {
        await page.goto('https://backoffice.aggregator.databetrix.com/documents/introduction', { waitUntil: 'networkidle2' });
        const content = await page.evaluate(() => document.body.innerText);
        console.log(content);
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
