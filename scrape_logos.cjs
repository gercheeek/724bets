const https = require('https');
const fs = require('fs');

const COUNTRIES = ['turkey', 'england', 'spain', 'germany', 'italy', 'france', 'portugal', 'netherlands', 'brazil', 'argentina', 'saudi-arabia'];
const BASE_URL = 'https://football-logos.cc';

const fetchHtml = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
};

const extractLogos = (html) => {
    const logos = {};
    
    // Simplest regex for JSON-LD if it exists on the page
    const ldRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
    let match;
    while ((match = ldRegex.exec(html)) !== null) {
        try {
            const data = JSON.parse(match[1]);
            if (data['@type'] === 'CollectionPage' && data.mainEntity && data.mainEntity.itemListElement) {
                for (const item of data.mainEntity.itemListElement) {
                    if (item.item && item.item.name && item.item.thumbnailUrl) {
                        let teamName = item.item.name.replace(' Logo', '').replace(' FC', '').trim();
                        // Normalize team name slightly
                        const normalized = teamName.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
                        logos[normalized] = item.item.thumbnailUrl;
                        logos[teamName.toLowerCase()] = item.item.thumbnailUrl;
                    }
                }
            }
        } catch (e) {
            // Ignore parse errors for non-json-ld scripts
        }
    }
    
    // Also try simple img tags if JSON-LD isn't enough
    const imgRegex = /<img[^>]*alt="([^"]*?) Logo"[^>]*src="([^"]*assets\.football-logos\.cc[^"]*)"/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
        const teamName = imgMatch[1].replace(' FC', '').trim();
        const normalized = teamName.toLowerCase().replace(/[^a-z0-9ğüşöçiı]/g, '');
        if (!logos[normalized]) {
            logos[normalized] = imgMatch[2];
            logos[teamName.toLowerCase()] = imgMatch[2];
        }
    }
    
    return logos;
};

const run = async () => {
    let allLogos = {};
    
    for (const country of COUNTRIES) {
        console.log(`Fetching ${country}...`);
        try {
            const html = await fetchHtml(`${BASE_URL}/${country}/`);
            const logos = extractLogos(html);
            allLogos = { ...allLogos, ...logos };
            console.log(`Found ${Object.keys(logos).length / 2} logos for ${country}`);
        } catch (err) {
            console.error(`Error fetching ${country}:`, err.message);
        }
    }
    
    fs.writeFileSync('public/team_logos.json', JSON.stringify(allLogos, null, 2));
    console.log(`Saved ${Object.keys(allLogos).length} total variations to public/team_logos.json`);
};

run();
