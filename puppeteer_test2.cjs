const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set headers
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
  });

  console.log('Navigating to live page and listening to responses...');
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('LiveFeed') || url.includes('LineFeed') || url.includes('Get1x2')) {
      console.log('Found 1xBet Feed API Call:', url);
      try {
        const json = await response.json();
        console.log('Data length:', json?.Value?.length || 0);
      } catch (e) {
        console.log('Failed to parse response for:', url);
      }
    }
  });

  try {
    await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Finished loading page. Waiting 5s for data to flow...');
    await new Promise(r => setTimeout(r, 5000));
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await browser.close();
  }
})();
