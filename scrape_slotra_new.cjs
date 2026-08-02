const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const DIR_PATH = path.join(__dirname, 'public', 'assets', 'slots', 'new');
if (!fs.existsSync(DIR_PATH)) {
    fs.mkdirSync(DIR_PATH, { recursive: true });
}

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err.message);
        });
    });
}

(async () => {
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

    console.log('Navigating to https://slotra.com/casino/new');
    
    try {
        await page.goto('https://slotra.com/casino/new', { waitUntil: 'networkidle2', timeout: 60000 });
        
        console.log('Waiting for game elements to load...');
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 100;
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if(totalHeight >= 4000){
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
        
        await new Promise(r => setTimeout(r, 2000));

        const games = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="/game/"]'));
            const results = [];
            
            links.forEach(link => {
                const img = link.querySelector('img');
                if (!img) return;
                
                let src = img.src || img.getAttribute('data-src');
                if (!src || src.includes('data:image')) {
                    const sourceTag = link.querySelector('source');
                    if (sourceTag) src = sourceTag.srcset.split(' ')[0];
                }
                
                let title = img.alt || link.getAttribute('aria-label') || '';
                if (title.startsWith('Game thumb - ')) {
                    title = title.replace('Game thumb - ', '');
                }
                
                // Provider is often inside an SVG or text nearby. We can just set it to 'Slotra' for now if not found easily.
                
                results.push({
                    title: title || 'Unknown Game',
                    provider: 'Various',
                    image_url: src,
                    link: link.href
                });
            });
            
            const unique = [];
            const seen = new Set();
            for (const item of results) {
                if (item.image_url && !seen.has(item.image_url)) {
                    seen.add(item.image_url);
                    unique.push(item);
                }
            }
            
            return unique;
        });

        console.log(`Found ${games.length} games. Starting downloads...`);
        
        const finalGames = [];
        
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            const cleanTitle = game.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            const filename = `${cleanTitle}_${crypto.randomBytes(4).toString('hex')}.jpg`;
            const dest = path.join(DIR_PATH, filename);
            
            try {
                await downloadImage(game.image_url, dest);
                finalGames.push({
                    id: `new_${i}`,
                    title: game.title,
                    provider: game.provider,
                    image: `/assets/slots/new/${filename}`,
                    original_link: game.link
                });
                console.log(`Downloaded [${i+1}/${games.length}]: ${filename}`);
            } catch (e) {
                console.error(`Failed to download ${game.image_url}:`, e);
            }
        }
        
        fs.writeFileSync(path.join(__dirname, 'public', 'slots_new.json'), JSON.stringify(finalGames, null, 2));
        console.log('Saved slots_new.json successfully.');

    } catch (err) {
        console.error('Error during scraping:', err);
    } finally {
        await browser.close();
    }
})();
