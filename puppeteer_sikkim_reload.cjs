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
           const sikkim = json.Value.find(m => m.O1 && m.O1.includes('Sikkim'));
           if (sikkim) {
             console.log(`[${new Date().toISOString()}] Sikkim Score: S1=${sikkim.SC?.FS?.S1}, S2=${sikkim.SC?.FS?.S2}, TS=${sikkim.SC?.TS}`);
           }
        }
      } catch (e) {}
    }
  });

  try {
    await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2' });
    console.log('First load done. Waiting 10s...');
    await new Promise(r => setTimeout(r, 10000));
    console.log('Reloading...');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 10000));
  } catch (err) {}
  process.exit(0);
})();
