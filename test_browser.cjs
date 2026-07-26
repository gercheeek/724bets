const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));
    
    await page.goto('http://localhost:3002/', { waitUntil: 'networkidle2' });
    
    // Check if there are any errors in the window
    const errors = await page.evaluate(() => window.__ERRORS__ || []);
    console.log('WINDOW_ERRORS:', errors);

    const html = await page.content();
    console.log('HTML length:', html.length);
    if(html.length < 2000) console.log(html);
    
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
