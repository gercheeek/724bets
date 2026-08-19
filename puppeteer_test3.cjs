const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'tr-TR' });

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('LiveFeed/Get1x2_VZip')) {
      try {
        const json = await response.json();
        if (json.Value && json.Value.length > 0) {
           console.log('Sample Match from Get1x2_VZip:');
           console.log(JSON.stringify(json.Value[0], null, 2));
           process.exit(0);
        }
      } catch (e) {
      }
    }
  });

  try {
    await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2', timeout: 30000 });
  } catch (err) {
  }
})();
