const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Starting Puppeteer to extract Sekabet data...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    let matchData = null;

    page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('sportscenter/carousels/featured-matches/events') || url.includes('featured-carousel-items')) {
            try {
                const json = await response.json();
                if (json && !matchData) {
                    matchData = json;
                    fs.writeFileSync('sekabet_extracted.json', JSON.stringify(json, null, 2));
                    console.log("Data extracted and saved to sekabet_extracted.json");
                }
            } catch(e) {}
        }
    });

    try {
        await page.goto('https://sekabet1624.com/tr/Sports/StartFirstSB', { waitUntil: 'networkidle2', timeout: 30000 });
        console.log("Page loaded.");
        await new Promise(r => setTimeout(r, 5000)); // wait a bit more for responses
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await browser.close();
    }
})();
