const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('zip') || url.includes('json') || url.includes('feed') || url.includes('graphql') || url.includes('Live')) {
      try {
        const text = await response.text();
        if (text.length > 50 && (text.includes('Value') || text.includes('events') || text.includes('sport'))) {
           console.log('FOUND API:', url);
           console.log('Sample:', text.substring(0, 150));
        }
      } catch (e) {}
    }
  });

  console.log('Navigating to 1xframemxz.com/tr/live...');
  await page.goto('https://1xframemxz.com/tr/live', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
