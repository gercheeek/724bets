const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeLive() {
    console.log("Tarayıcı başlatılıyor...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log("Tarafbet'e gidiliyor...");
    await page.goto('https://tarafbet981.com/tr/live/', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log("Maçların yüklenmesi bekleniyor...");
    await page.waitForSelector('.live-game-item, .game-list-item, .event-row', { timeout: 15000 }).catch(() => console.log("Seçici bulunamadı, mevcut DOM inceleniyor..."));
    
    // Get basic info from DOM
    const data = await page.evaluate(() => {
        // Find match elements (BetConstruct usually has specific classes, we'll try generic text parsing if classes fail)
        const matches = [];
        document.querySelectorAll('.game-list-item, .event-list-item, .live-events-list .event-row').forEach(el => {
            const teams = el.innerText.split('\n').filter(t => t.trim().length > 0);
            if (teams.length > 2) {
                matches.push({ raw: teams });
            }
        });
        return matches;
    });
    
    console.log(`Bulunan maç sayısı (Ham): ${data.length}`);
    
    await browser.close();
    
    if (data.length > 0) {
        fs.writeFileSync('public/tarafbet_dump.json', JSON.stringify(data, null, 2));
        console.log("Veriler public/tarafbet_dump.json dosyasına kaydedildi.");
    } else {
        console.log("Maç bulunamadı.");
    }
}

scrapeLive().catch(console.error);
