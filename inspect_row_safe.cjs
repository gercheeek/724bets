const puppeteer = require('puppeteer');

async function inspectRowStructure() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = 'https://tarafbet982.com/tr/prelive/league/sport-soccer/premier_league-15542/default/all_time/';
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise(r => setTimeout(r, 10000));
        
        const structure = await page.evaluate(() => {
            const row = document.querySelector('[class*="event-row_"]');
            if (!row) return "No row found";
            
            const elements = Array.from(row.querySelectorAll('*'));
            return elements.map(el => ({
                tagName: el.tagName,
                className: el.className,
                text: el.innerText ? el.innerText.trim() : ''
            })).filter(el => el.className);
        });
        
        console.log(JSON.stringify(structure, null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await browser.close();
    }
}

inspectRowStructure();
