const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    
    await page.goto('http://localhost:3005', { waitUntil: 'networkidle0' });
    
    // Evaluate to click the Spor button
    await page.evaluate(() => {
        // Find a button containing "Spor" text and click it
        const buttons = Array.from(document.querySelectorAll('button'));
        const sporBtn = buttons.find(b => b.textContent && b.textContent.includes('Spor'));
        if (sporBtn) sporBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
