const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2' });
  
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log(html.substring(0, 1000));
  
  // Also try to find match elements
  const classNames = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*'))
      .map(el => el.className)
      .filter(c => c && typeof c === 'string' && c.includes('event'));
  });
  console.log([...new Set(classNames)].slice(0, 20));
  
  process.exit(0);
})();
