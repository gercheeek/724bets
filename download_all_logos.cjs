const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const teamLogos = require('./utils/team_logos.json');
const LOGOS_DIR = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

// Convert team_logos.json into an array of { id: normClean, url: "..." }
const queue = Object.entries(teamLogos).map(([name, url]) => {
    const id = name.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
    return { id, url };
});

// Remove duplicates
const uniqueQueue = [];
const seenIds = new Set();
for (const item of queue) {
    if (!seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueQueue.push(item);
    }
}

async function run() {
    console.log(`Starting to download ${uniqueQueue.length} logos...`);
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Go to football-logos.cc to get the right origin and bypass Cloudflare
    await page.goto('https://football-logos.cc/', { waitUntil: 'networkidle2' });

    // Expose a function to save the base64 data to disk
    await page.exposeFunction('saveLogoToDisk', (id, base64Data) => {
        if (!base64Data) return false;
        try {
            const base64Image = base64Data.split(';base64,').pop();
            const filePath = path.join(LOGOS_DIR, `${id}.png`);
            fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });
            return true;
        } catch (e) {
            console.error("Error saving", id, e.message);
            return false;
        }
    });

    console.log("Browser ready. Starting batch download...");
    
    // Batch process in chunks of 50 to not crash the browser memory
    const chunkSize = 50;
    for (let i = 0; i < uniqueQueue.length; i += chunkSize) {
        const chunk = uniqueQueue.slice(i, i + chunkSize);
        
        // Filter out those already downloaded
        const needed = chunk.filter(item => !fs.existsSync(path.join(LOGOS_DIR, `${item.id}.png`)));
        if (needed.length === 0) continue;
        
        console.log(`Processing chunk ${i/chunkSize + 1} (${needed.length} logos)...`);
        
        await page.evaluate(async (items) => {
            for (const item of items) {
                try {
                    const res = await fetch(item.url);
                    if (!res.ok) continue;
                    const blob = await res.blob();
                    const base64 = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                    await window.saveLogoToDisk(item.id, base64);
                } catch(e) {
                    // ignore
                }
            }
        }, needed);
    }

    console.log("Download complete!");
    await browser.close();
}

run();
