const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    try {
        const page = await browser.newPage();
        await page.goto('https://tarafbet982.com/tr/live/', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 10000));
        
        const html = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('[class*="event-row_"]'));
            const logs = [];
            
            for (let i = 0; i < Math.min(3, rows.length); i++) {
                const row = rows[i];
                let current = row.previousElementSibling;
                const prevTags = [];
                while (current && prevTags.length < 3) {
                    prevTags.push({
                        tag: current.tagName,
                        className: typeof current.className === 'string' ? current.className : '',
                        text: current.innerText ? current.innerText.trim() : ''
                    });
                    current = current.previousElementSibling;
                }
                
                let parent = row.parentElement;
                let parentInfo = null;
                if (parent) {
                    parentInfo = {
                        tag: parent.tagName,
                        className: typeof parent.className === 'string' ? parent.className : '',
                        textPrefix: parent.innerText ? parent.innerText.substring(0, 50).replace(/\n/g, ' ') : ''
                    };
                }

                logs.push({
                    rowClasses: typeof row.className === 'string' ? row.className : '',
                    prevSiblings: prevTags,
                    parent: parentInfo
                });
            }
            return logs;
        });
        
        console.log("DOM INFO:\n" + JSON.stringify(html, null, 2));
    } catch(e) {
        console.log("Error:", e.message);
    } finally {
        await browser.close();
    }
})();
