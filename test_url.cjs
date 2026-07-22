const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
        console.log("Visiting sekabet1624.com/tr/live/");
        await page.goto("https://sekabet1624.com/tr/live/", { waitUntil: 'networkidle2', timeout: 20000 });
        const html = await page.content();
        console.log("HTML length:", html.length);
        const iframes = await page.$$eval('iframe', frames => frames.map(f => f.src));
        console.log("iframes:", iframes);
    } catch (e) {
        console.error("Error:", e.message);
    }
    await browser.close();
})();
