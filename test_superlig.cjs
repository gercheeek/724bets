const puppeteer = require('puppeteer');

async function findSuperLig() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    try {
        const page = await browser.newPage();
        await page.goto('https://tarafbet982.com/tr/prelive/sport/soccer/', { waitUntil: 'networkidle2' });
        await new Promise(r => setTimeout(r, 6000));
        
        const links = await page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('a'));
            return anchors
                .filter(a => a.href && a.href.includes('/prelive/league/'))
                .map(a => ({ text: a.innerText.trim(), href: a.href }));
        });
        
        console.log(JSON.stringify(links.filter(l => l.text.toLowerCase().includes('lig') || l.text.toLowerCase().includes('turk') || l.text.toLowerCase().includes('süper')), null, 2));
    } catch (e) {
        console.log(e.message);
    } finally {
        await browser.close();
    }
}
findSuperLig();
