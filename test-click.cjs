const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
    
    // Find the button and click it
    // Wait for the button to be rendered
    await page.waitForSelector('button', { timeout: 5000 });
    
    // Let's find button with text "Maç Sonuçları & Canlı Skor"
    const buttons = await page.$$('button');
    let clickBtn = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Maç Sonuçları & Canlı Skor')) {
        clickBtn = btn;
        break;
      }
    }
    
    if (clickBtn) {
      console.log('Clicking the Live Score button...');
      await clickBtn.click();
      // Wait a bit for the crash or render
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log('Button not found!');
    }
  } catch (e) {
    console.error('Error during click test:', e);
  }
  await browser.close();
})();
