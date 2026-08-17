const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:3000/tr/spor', { waitUntil: 'networkidle2' });
  // Wait a few seconds for data and layout to settle
  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'local_spor_screenshot.png', fullPage: true });
  await browser.close();
})();
