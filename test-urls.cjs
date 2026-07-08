const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const urls = [
    'https://sport.7yrrerfcet.com/SportsBook/Results',
    'https://sport.7yrrerfcet.com/SportsBook/LiveScore',
    'https://sport.7yrrerfcet.com/SportsBook/LiveCalendar',
    'https://sport.7yrrerfcet.com/SportsBook/Home?page=results',
  ];

  for (const url of urls) {
    const page = await browser.newPage();
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 5000 });
      console.log(`URL: ${url} -> Status: ${response.status()}`);
    } catch (e) {
      console.log(`URL: ${url} -> Failed: ${e.message}`);
    }
    await page.close();
  }
  await browser.close();
})();
