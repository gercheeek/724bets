const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
  await page.goto('http://localhost:3002/', { waitUntil: 'networkidle2' });
  
  // Click SPOR
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const sporBtn = btns.find(b => b.innerText.includes('SPOR'));
    if (sporBtn) sporBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('SPORTS_HTML_LEN:', html.length);
  if (html.length < 500) console.log(html);
  
  await browser.close();
})();
