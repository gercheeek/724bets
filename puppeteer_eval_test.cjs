const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2' });
  console.log('Page loaded. Now executing fetch inside page context...');

  const result = await page.evaluate(async () => {
    const res = await fetch('https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1');
    return await res.json();
  });

  console.log(`Successfully fetched ${result?.Value?.length} matches via page.evaluate!`);
  process.exit(0);
})();
