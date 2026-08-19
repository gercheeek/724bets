const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');

const LOGOS_DIR = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

// Simple queue to prevent launching 100 browsers at once
const queue = [];
let isProcessing = false;

async function processQueue() {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    let browser = null;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        while (queue.length > 0) {
            const task = queue.shift();
            const { teamId, teamName, resolve, reject } = task;
            
            const filePath = path.join(LOGOS_DIR, `${teamId}.png`);
            if (fs.existsSync(filePath)) {
                resolve(filePath);
                continue;
            }

            try {
                const page = await browser.newPage();
                // Block unnecessary resources to speed up
                await page.setRequestInterception(true);
                page.on('request', (req) => {
                    if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
                        req.abort();
                    } else {
                        req.continue();
                    }
                });

                console.log(`[Scraper] Searching football-logos.cc for: ${teamName}`);
                await page.goto(`https://football-logos.cc/?q=${encodeURIComponent(teamName)}`, { waitUntil: 'networkidle2', timeout: 15000 });

                // Get the first visible image that matches the search or inside a group
                const logoUrl = await page.evaluate((searchQuery) => {
                    const items = Array.from(document.querySelectorAll('.group'));
                    let imgUrl = null;
                    
                    for (const item of items) {
                        const h3 = item.querySelector('h3');
                        if (h3 && h3.innerText.toLowerCase().includes(searchQuery.toLowerCase())) {
                            const img = item.querySelector('img');
                            if (img && img.src) {
                                imgUrl = img.src;
                                break;
                            }
                        }
                    }
                    
                    
                    return imgUrl;
                }, teamName);

                await page.close();

                if (logoUrl) {
                    console.log(`[Scraper] Found logo for ${teamName}: ${logoUrl}`);
                    await downloadImage(logoUrl, filePath);
                    resolve(filePath);
                } else {
                    console.log(`[Scraper] No logo found for ${teamName}`);
                    resolve(null);
                }
            } catch (err) {
                console.error(`[Scraper] Error scraping ${teamName}:`, err.message);
                resolve(null);
            }
        }
    } catch (e) {
        console.error('[Scraper] Browser launch failed:', e);
    } finally {
        if (browser) await browser.close();
        isProcessing = false;
        if (queue.length > 0) processQueue();
    }
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://football-logos.cc/',
                'Accept': 'image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
            }
        }, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve(dest);
                });
            } else {
                reject(new Error(`Failed to download image. Status: ${response.statusCode}`));
            }
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

function getLogo(teamId, teamName) {
    const filePath = path.join(LOGOS_DIR, `${teamId}.png`);
    if (fs.existsSync(filePath)) {
        return Promise.resolve(filePath);
    }

    return new Promise((resolve, reject) => {
        queue.push({ teamId, teamName, resolve, reject });
        processQueue();
    });
}

module.exports = {
    getLogo
};
