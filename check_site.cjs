const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle0' });
  
  // Click on "Bilet"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div'));
    const bilet = btns.find(b => b.textContent && b.textContent.includes('Detaylar & Katıl'));
    if (bilet) bilet.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  // Click on "ÖDÜLLER"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div'));
    const rewards = btns.find(b => b.textContent && b.textContent.includes('ÖDÜLLER'));
    if (rewards) rewards.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
