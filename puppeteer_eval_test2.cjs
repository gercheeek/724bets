const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2' });

  const result = await page.evaluate(async () => {
    try {
      const res = await fetch('https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1');
      const text = await res.text();
      return { status: res.status, text: text.substring(0, 100) };
    } catch (e) {
      return { error: e.toString() };
    }
  });

  console.log(result);
  process.exit(0);
})();
