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
           console.log(`[Get1x2_VZip] Intercepted ${json.Value.length} matches at ${new Date().toISOString()}`);
        }
      } catch (e) {
      }
    }
  });

  try {
    await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2' });
    console.log('First load done. Waiting 5s...');
    await new Promise(r => setTimeout(r, 5000));
    console.log('Reloading page...');
    await page.reload({ waitUntil: 'networkidle2' });
    console.log('Reload done. Waiting 5s...');
    await new Promise(r => setTimeout(r, 5000));
  } catch (err) {
  }
  process.exit(0);
})();
