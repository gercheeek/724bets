const puppeteer = require('puppeteer');
const fs = require('fs');

async function getHtml() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://football-logos.cc/', { waitUntil: 'networkidle2' });
  const html = await page.content();
  fs.writeFileSync('site.html', html, 'utf8');
  await browser.close();
}
getHtml();
