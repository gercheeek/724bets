const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    try {
        const page = await browser.newPage();
        await page.goto('https://tarafbet982.com/tr/live/', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 10000));
        
        const html = await page.evaluate(() => {
            const allElements = Array.from(document.querySelectorAll('*'));
            const logs = [];
            let lastHeader = null;
            
            for (let el of allElements) {
                const cn = typeof el.className === 'string' ? el.className : '';
                
                // If it looks like a championship/competition header
                if (cn.includes('championship_') || cn.includes('competition_') || cn.includes('tournament_') || cn.includes('region_')) {
                    const text = el.innerText ? el.innerText.trim() : '';
                    if (text && text.length < 50) {
                        lastHeader = text;
                        logs.push("HEADER_CANDIDATE: " + cn + " -> " + text.replace(/\n/g, ' | '));
                    }
                }
                
                // If it's an event row, log what the last header was
                if (cn.includes('event-row_')) {
                    logs.push("MATCH ROW! Last seen header was: " + lastHeader);
                }
            }

            return logs.slice(0, 100); // return first 100 interesting lines
        });
        
        console.log("LOGS:\n" + html.join('\n'));
    } catch(e) {
        console.log("Error:", e.message);
    } finally {
        await browser.close();
    }
})();
