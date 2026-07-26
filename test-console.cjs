const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('HTTP ERROR:', response.status(), response.url());
    }
  });
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });
  const bodyHtml = await page.evaluate(() => document.body.innerHTML);
  const fs = require('fs');
  fs.writeFileSync('body_output.html', bodyHtml);
  await browser.close();
})();
