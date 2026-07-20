const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function debugScraper() {
    console.log("Starting Puppeteer debug...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = 'https://tarafbet982.com/tr/prelive/league/sport-soccer/premier_league-15542/default/all_time/';
    console.log(`Navigating to ${url}...`);
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        console.log("Page loaded. Waiting 10s for JavaScript render...");
        await new Promise(r => setTimeout(r, 10000));
        
        // Take a screenshot to inspect visually
        const screenshotPath = path.join(__dirname, 'public', 'debug_screenshot.png');
        await page.screenshot({ path: screenshotPath });
        console.log(`Screenshot saved to: ${screenshotPath}`);
        
        // Print the page title and some DOM elements to see what is rendered
        const info = await page.evaluate(() => {
            return {
                title: document.title,
                htmlLength: document.body.innerHTML.length,
                classes: Array.from(document.querySelectorAll('*')).map(el => el.className).filter(c => c).slice(0, 50),
                eventRowsExist: document.querySelectorAll('.sport-title-event-row-b, .event-row-bc').length
            };
        });
        
        console.log("Page Info:", JSON.stringify(info, null, 2));
        
    } catch (e) {
        console.error("Error during debug:", e.message);
    } finally {
        await browser.close();
        console.log("Puppeteer closed.");
    }
}

debugScraper();
