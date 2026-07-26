const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3002/', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'public/test_screen.png' });
  await browser.close();
})();
