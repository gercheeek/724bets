const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Click on Spor button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const sporButton = buttons.find(b => b.textContent.includes('Spor'));
    if (sporButton) sporButton.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const result = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    // Find divs that contain "Brezilya" and "Japonya"
    const matchDivs = divs.filter(d => d.textContent.includes('Brezilya') && d.textContent.includes('Japonya'));
    
    return {
      matchDivsCount: matchDivs.length,
      matchDivsTexts: matchDivs.map(d => d.textContent.substring(0, 200)),
      // Let's also look for "Güney Afrika" or "Hollanda"
      hasGuneyAfrika: divs.some(d => d.textContent.includes('Güney Afrika')),
      hasHollanda: divs.some(d => d.textContent.includes('Hollanda'))
    };
  });
  
  console.log("Result:", JSON.stringify(result, null, 2));
  
  await browser.close();
})();
