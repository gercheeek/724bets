const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1280, height: 800 });
  await page1.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await page1.screenshot({ path: 'local.png' });

  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1280, height: 800 });
  await page2.goto('https://www.724bahis.net/', { waitUntil: 'networkidle2' });
  await page2.screenshot({ path: 'live.png' });

  await browser.close();
})();
