const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    try {
        const page = await browser.newPage();
        await page.goto('https://tarafbet982.com/tr/live/', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 10000));
        
        const html = await page.evaluate(() => {
            const wrappers = Array.from(document.querySelectorAll('[class*="events-wrapper_"]'));
            const logs = [];
            
            for (let i = 0; i < Math.min(3, wrappers.length); i++) {
                const wrapper = wrappers[i];
                let current = wrapper.previousElementSibling;
                const prevTags = [];
                while (current && prevTags.length < 3) {
                    prevTags.push({
                        tag: current.tagName,
                        className: typeof current.className === 'string' ? current.className : '',
                        text: current.innerText ? current.innerText.trim() : ''
                    });
                    current = current.previousElementSibling;
                }
                
                logs.push({
                    wrapperClasses: typeof wrapper.className === 'string' ? wrapper.className : '',
                    prevSiblings: prevTags
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
