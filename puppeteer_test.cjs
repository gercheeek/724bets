const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set headers
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
  });

  console.log('Navigating to API...');
  
  // Navigate directly to the JSON endpoint
  const url = 'https://1xframemxz.com/service-api/LiveFeed/Get1x2_VZip?count=5&lng=tr&mode=4&sports=1';
  
  try {
    // 1. Visit the homepage to get cookies first if needed
    console.log('Getting cookies...');
    await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2', timeout: 15000 });
    
    // 2. Evaluate fetch inside the page context
    console.log('Fetching API inside browser context...');
    const data = await page.evaluate(async (apiUrl) => {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Status: ' + res.status);
      return await res.json();
    }, url);
    
    if (data && data.Value) {
        console.log('SUCCESS! Got data:', data.Value.length, 'matches');
    } else {
        console.log('Failed to parse data payload:', data);
    }
    
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await browser.close();
  }
})();
