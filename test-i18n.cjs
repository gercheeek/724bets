const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:3002', { waitUntil: 'networkidle2' });
  
  // Wait for 1 second
  await new Promise(r => setTimeout(r, 1000));
  
  // Try to click Language button in sidebar
  await page.evaluate(() => {
    const langBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Dil') || a.textContent.includes('Language') || a.textContent.includes('Idioma'));
    if (langBtn) {
      langBtn.click();
      console.log('Clicked Language button');
    } else {
      console.log('Could not find Language button');
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Click English
  await page.evaluate(() => {
    const enBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('English'));
    if (enBtn) {
      enBtn.click();
      console.log('Clicked English');
    } else {
      console.log('Could not find English button');
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Log the sidebar text
  const sidebarText = await page.evaluate(() => {
    const homeBtn = Array.from(document.querySelectorAll('a')).find(a => a.href.endsWith('/home') || a.href === window.location.origin + '/');
    return homeBtn ? homeBtn.textContent.trim() : 'Not found';
  });
  
  console.log('Sidebar Home text after language change:', sidebarText);
  
  await browser.close();
})();
