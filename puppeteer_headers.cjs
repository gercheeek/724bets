const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'tr-TR' });

  let savedHeaders = null;

  page.on('request', async (req) => {
    const url = req.url();
    if (url.includes('LiveFeed/Get1x2_VZip')) {
      savedHeaders = req.headers();
    }
  });

  try {
    await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2' });
    
    if (savedHeaders) {
      console.log('Got headers, trying manual fetch with cache buster...');
      const result = await page.evaluate(async (headers) => {
        try {
          const res = await fetch(`https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=50&lng=tr&mode=4&country=180&partner=85&noFilterBlockEvent=true&sports=1&_cb=${Date.now()}`, {
            headers: headers
          });
          return { status: res.status, text: (await res.text()).substring(0, 100) };
        } catch (e) {
          return { error: e.toString() };
        }
      }, savedHeaders);
      
      console.log(result);
    }
    
  } catch (err) {}
  process.exit(0);
})();
