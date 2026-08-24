const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    try {
        await page.goto('https://backoffice.aggregator.databetrix.com/documents/introduction', { waitUntil: 'networkidle2' });
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => a.href);
        });
        console.log(links.join('\n'));
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
