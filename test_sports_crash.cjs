const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', error => console.log('BROWSER_ERROR_STACK:', error.stack));
  await page.goto('http://localhost:3002/', { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*'));
    const sporEl = els.find(e => e.innerText === 'SPOR' && e.tagName !== 'SCRIPT');
    if (sporEl) sporEl.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
