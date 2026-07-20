const puppeteer = require('puppeteer');

async function getLinks() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    try {
        const page = await browser.newPage();
        await page.goto('https://tarafbet982.com/tr/prelive/sport-soccer/', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 6000));
        
        const html = await page.evaluate(() => document.body.innerHTML);
        const matches = html.match(/\/tr\/prelive\/league\/sport-soccer\/[^\/]+\//g);
        if (matches) {
            const unique = [...new Set(matches)];
            console.log(JSON.stringify(unique, null, 2));
        } else {
            console.log("No links found in HTML using regex.");
        }
    } catch (e) {
        console.log(e.message);
    } finally {
        await browser.close();
    }
}
getLinks();
