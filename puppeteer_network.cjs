const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'tr-TR' });

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('LiveFeed')) {
      console.log('Intercepted:', url);
    }
  });

  try {
    await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2' });
    console.log('Waiting 10s for live updates...');
    await new Promise(r => setTimeout(r, 10000));
  } catch (err) {}
  process.exit(0);
})();
