const puppeteer = require('puppeteer');

async function findGamdomAPI() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('graphql') || url.includes('/api/')) {
        try {
            const text = await response.text();
            if (text.includes('game') && text.includes('image')) {
                console.log('Found game data at URL:', url);
                console.log('Sample:', text.substring(0, 500));
            }
        } catch (e) {}
    }
  });

  try {
    console.log("Navigating to Gamdom...");
    await page.goto('https://gamdom.com/tr-tr/casino/slots', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await new Promise(r => setTimeout(r, 10000));
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
}

findGamdomAPI();
