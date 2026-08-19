const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGOS_DIR = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

async function scrapeAllLogos() {
    console.log('[Bulk Scraper] Starting bulk logo extraction from football-logos.cc...');
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Speed up scraping by aborting unnecessary resources
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        console.log('[Bulk Scraper] Navigating to /all/');
        await page.goto('https://football-logos.cc/all/', { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Auto-scroll to load all lazy-loaded images
        console.log('[Bulk Scraper] Scrolling to load all logos. This might take a few minutes...');
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 300;
                let scrollCount = 0;
                let unchangedCount = 0;
                
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    
                    if (totalHeight >= scrollHeight) {
                        unchangedCount++;
                        // If we hit the bottom 15 times (~4 seconds) and height didn't increase, we are done
                        if (unchangedCount > 15) {
                            clearInterval(timer);
                            resolve(true);
                        }
                    } else {
                        unchangedCount = 0;
                    }
                }, 250);
            });
        });
        
        // Extract all image URLs
        const urls = await page.evaluate(() => {
            const imgs = document.querySelectorAll('img');
            const validUrls = [];
            for (const img of imgs) {
                if (img.src && img.src.includes('assets.football-logos.cc/logos/')) {
                    validUrls.push(img.src);
                }
            }
            return Array.from(new Set(validUrls));
        });
        
        console.log(`[Bulk Scraper] Found ${urls.length} logos! Starting download...`);
        
        // Download concurrently (batch of 10)
        let downloaded = 0;
        let skipped = 0;
        
        const downloadImage = (url) => {
            return new Promise((resolve) => {
                const parts = url.split('/');
                const filenameWithHash = parts[parts.length - 1]; // arsenal.e5528ede.png
                const cleanName = filenameWithHash.split('.')[0] + '.png'; // arsenal.png
                
                const dest = path.join(LOGOS_DIR, cleanName);
                if (fs.existsSync(dest)) {
                    skipped++;
                    resolve(true);
                    return;
                }
                
                const file = fs.createWriteStream(dest);
                https.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://football-logos.cc/',
                        'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
                    }
                }, (res) => {
                    if (res.statusCode === 200) {
                        res.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            downloaded++;
                            if (downloaded % 50 === 0) {
                                console.log(`[Bulk Scraper] Downloaded ${downloaded}/${urls.length}`);
                            }
                            resolve(true);
                        });
                    } else if (res.statusCode === 301 || res.statusCode === 302) {
                        // handle redirect? Cloudflare usually just blocks 403
                        resolve(false);
                    } else {
                        resolve(false);
                    }
                }).on('error', () => {
                    fs.unlink(dest, () => {});
                    resolve(false);
                });
            });
        };
        
        // Batch processor
        for (let i = 0; i < urls.length; i += 10) {
            const batch = urls.slice(i, i + 10);
            await Promise.all(batch.map(url => downloadImage(url)));
        }
        
        console.log(`[Bulk Scraper] Finished! Downloaded: ${downloaded}, Skipped: ${skipped}, Total available: ${urls.length}`);
        
    } catch (e) {
        console.error('[Bulk Scraper] Error:', e);
    } finally {
        if (browser) await browser.close();
        process.exit(0);
    }
}

scrapeAllLogos();
