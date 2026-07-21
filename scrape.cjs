const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();
        
        // Block images/media for speed
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if(req.resourceType() === 'image' || req.resourceType() === 'media' || req.resourceType() === 'font'){
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log("Navigating to betlivo303...");
        await page.goto('https://www.betlivo303.com/tr/wonderwheel', { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Give it a couple of seconds for animations or SPA routing
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Find the wonderwheel container
        const html = await page.evaluate(() => {
            const wheelContainer = document.querySelector('.wonderwheel, [class*="wonder"], [class*="wheel"], #wonderwheel, main');
            if (wheelContainer) {
                return wheelContainer.outerHTML;
            }
            return document.body.innerHTML;
        });
        
        console.log(html);

        await browser.close();
    } catch (e) {
        console.error("Error:", e);
    }
})();
