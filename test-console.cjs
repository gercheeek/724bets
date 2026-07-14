const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  try {
    const targetUrl = process.argv[2] || 'http://localhost:3000/';
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
  } catch (e) {
    console.error('Goto error:', e);
  }
  await browser.close();
})();
