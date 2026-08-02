const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const jsonPath = path.join(__dirname, 'public', 'slots_new.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('slots_new.json not found!');
        return;
    }
    
    let games = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
    });
    
    // To speed up, block images and css
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const type = req.resourceType();
        if (['image', 'stylesheet', 'font'].includes(type)) {
            req.abort();
        } else {
            req.continue();
        }
    });

    let successCount = 0;

    for (let i = 0; i < games.length; i++) {
        if (games[i].iframe_url) {
            console.log(`Skipping [${i+1}/${games.length}], already has iframe: ${games[i].title}`);
            successCount++;
            continue;
        }

        const gameLink = games[i].original_link;
        // Transform /game/ to /game-iframe/ as seen in screenshot
        const gameId = gameLink.split('/').pop();
        const iframePageLink = `https://slotra.com/game-iframe/${gameId}?gId0=${gameId}`;

        console.log(`[${i+1}/${games.length}] Visiting: ${iframePageLink}`);
        
        try {
            await page.goto(iframePageLink, { waitUntil: 'domcontentloaded', timeout: 15000 });
            await new Promise(r => setTimeout(r, 2000));
            
            // Look for iframe
            const iframeSrc = await page.evaluate(() => {
                const iframes = Array.from(document.querySelectorAll('iframe'));
                for (const frame of iframes) {
                    if (frame.src && frame.src.includes('http')) return frame.src;
                }
                return null;
            });

            if (iframeSrc) {
                console.log(` -> Found iframe: ${iframeSrc.substring(0, 80)}...`);
                games[i].iframe_url = iframeSrc;
                successCount++;
            } else {
                console.log(` -> No iframe found on /game-iframe/ page. Checking API requests or falling back...`);
                // Let's try the original link
                await page.goto(gameLink, { waitUntil: 'domcontentloaded', timeout: 15000 });
                await new Promise(r => setTimeout(r, 3000));
                const fallbackSrc = await page.evaluate(() => {
                    const frame = document.querySelector('iframe');
                    return frame ? frame.src : null;
                });
                if (fallbackSrc) {
                    console.log(` -> Found iframe on fallback: ${fallbackSrc.substring(0, 80)}...`);
                    games[i].iframe_url = fallbackSrc;
                    successCount++;
                } else {
                    console.log(` -> Still no iframe found.`);
                }
            }
        } catch (err) {
            console.error(` -> Error visiting ${iframePageLink}: ${err.message}`);
        }
        
        fs.writeFileSync(jsonPath, JSON.stringify(games, null, 2));
    }

    console.log(`Finished scraping iframes. Success: ${successCount}/${games.length}`);
    await browser.close();
})();
