const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://tarafbet980.com/tr/sports/', { waitUntil: 'networkidle2' });
  // Wait a few seconds for data to load
  await new Promise(r => setTimeout(r, 5000));
  await page.screenshot({ path: 'tarafbet_screenshot.png', fullPage: true });
  await browser.close();
})();
