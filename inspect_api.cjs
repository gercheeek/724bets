const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    try {
        const page = await browser.newPage();
        
        page.on('response', async (response) => {
            const url = response.url();
            if (url.includes('api') || url.includes('graphql') || url.includes('sportsbook')) {
                try {
                    const text = await response.text();
                    if (text.includes('events') || text.includes('competitions')) {
                        console.log("FOUND API:", url);
                        console.log("Snippet:", text.substring(0, 300));
                    }
                } catch(e) {}
            }
        });
        
        await page.goto('https://tarafbet982.com/tr/live/', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 10000));
    } catch(e) {
        console.log("Error:", e.message);
    } finally {
        await browser.close();
    }
})();
