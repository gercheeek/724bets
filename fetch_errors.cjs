const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:3002/spor', { waitUntil: 'networkidle0' });
    console.log('Page loaded successfully');
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: 'test_screenshot.png' });
    console.log('Screenshot saved as test_screenshot.png');
  } catch (err) {
    console.log('Error loading page:', err.message);
  }

  await browser.close();
})();
