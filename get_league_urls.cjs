const puppeteer = require('puppeteer');

async function getLinks() {
    console.log("Starting...");
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto('https://tarafbet982.com/tr/prelive/sport-soccer/', { waitUntil: 'networkidle2' });
    console.log("Loaded. Waiting 5s...");
    await new Promise(r => setTimeout(r, 5000));
    
    const links = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('a'));
        return anchors
            .map(a => ({ text: a.innerText.trim(), href: a.href }))
            .filter(l => l.href.includes('/league/sport-soccer/'));
    });
    
    // Deduplicate and filter out common ones
    const unique = [];
    const seen = new Set();
    for (const l of links) {
        if (l.text && !seen.has(l.href)) {
            seen.add(l.href);
            unique.push(l);
        }
    }
    
    console.log(JSON.stringify(unique, null, 2));
    await browser.close();
}

getLinks();
