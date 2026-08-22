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
                const base64Data = await page.evaluate(async (searchQuery) => {
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
                    
                    if (!imgUrl) return null;
                    
                    // Fetch within the browser context to bypass Cloudflare
                    try {
                        const response = await fetch(imgUrl);
                        const blob = await response.blob();
                        return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(blob);
                        });
                    } catch(e) {
                        return null;
                    }
                }, teamName);

                await page.close();

                if (base64Data) {
                    console.log(`[Scraper] Found and downloaded logo for ${teamName}`);
                    const base64Image = base64Data.split(';base64,').pop();
                    fs.writeFileSync(filePath, base64Image, {encoding: 'base64'});
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
