const puppeteer = require('puppeteer');

async function inspectDOM() {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const url = 'https://tarafbet982.com/tr/prelive/league/sport-soccer/premier_league-15542/default/all_time/';
    
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise(r => setTimeout(r, 10000));
        
        // Find elements containing "Arsenal" or "Chelsea" to see their structure
        const targetElementsInfo = await page.evaluate(() => {
            const matches = [];
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
            let node;
            while (node = walk.nextNode()) {
                if (node.textContent.includes('Arsenal') || node.textContent.includes('Chelsea')) {
                    // Check if it has a class and is relatively small (so we don't just get the body)
                    if (node.className && node.textContent.length < 300) {
                        matches.push({
                            tagName: node.tagName,
                            className: node.className,
                            text: node.innerText.trim(),
                            parentClass: node.parentElement ? node.parentElement.className : ''
                        });
                    }
                }
            }
            return matches.slice(0, 10);
        });
        
        console.log("Matches found in DOM:", JSON.stringify(targetElementsInfo, null, 2));
    } catch (e) {
        console.error(e.message);
    } finally {
        await browser.close();
    }
}

inspectDOM();
