const puppeteer = require('puppeteer');

(async () => {
    console.log("Starting Puppeteer analysis on Sekabet...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set a typical user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Intercept and log interesting network requests
    await page.setRequestInterception(true);
    
    const apiEndpoints = new Set();
    const wsEndpoints = new Set();

    page.on('request', (request) => {
        const url = request.url();
        const resourceType = request.resourceType();
        
        if (resourceType === 'websocket') {
            wsEndpoints.add(url);
        } else if (resourceType === 'xhr' || resourceType === 'fetch') {
            if (url.includes('api') || url.includes('sports') || url.includes('match') || url.includes('feed')) {
                apiEndpoints.add(url);
            }
        }
        request.continue();
    });

    try {
        await page.goto('https://sekabet1624.com/tr/Sports/StartFirstSB', { waitUntil: 'networkidle2', timeout: 30000 });
        console.log("Page loaded successfully.");
        
        // Wait a bit to ensure async requests are fired
        await new Promise(r => setTimeout(r, 5000));
        
        console.log("\n--- WEBSOCKET ENDPOINTS ---");
        wsEndpoints.forEach(url => console.log(url));
        
        console.log("\n--- API ENDPOINTS (XHR/FETCH) ---");
        apiEndpoints.forEach(url => console.log(url));
        
        // Let's also check if there is any cloudflare protection
        const title = await page.title();
        console.log("\nPage Title:", title);
        
    } catch (err) {
        console.error("Error during navigation:", err.message);
    } finally {
        await browser.close();
    }
})();
